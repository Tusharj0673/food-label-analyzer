from fastapi import (
    APIRouter, UploadFile,
    File, Form, Depends, HTTPException
)
from typing import Optional
from auth_utils import get_current_user
from ai.fssai_engine import run_fssai_engine
from ai.graph import check_ingredient_interactions
from ai.gemini import (
    extract_label_data,
    generate_explanation
)
from database import db
from datetime import datetime
from bson import ObjectId
import shutil, uuid, os

router = APIRouter()

@router.post("/analyze")
async def analyze_label(
    front_image:       UploadFile        = File(...),
    nutrition_image:   Optional[UploadFile] = File(None),
    ingredients_image: Optional[UploadFile] = File(None),
    health_profile:    str               = Form("none"),
    mode:              str               = Form("production"),
    user_id:           str               = Depends(get_current_user)
):
    os.makedirs("uploads", exist_ok=True)

    # ── Save uploaded images ──────────────────
    saved_paths = {}

    async def save_image(upload_file, label):
        if not upload_file:
            return None
        filename = f"{uuid.uuid4()}_{label}.jpg"
        path     = f"uploads/{filename}"
        with open(path, "wb") as f:
            shutil.copyfileobj(upload_file.file, f)
        return path

    saved_paths["front"]       = await save_image(
        front_image, "front"
    )
    saved_paths["nutrition"]   = await save_image(
        nutrition_image, "nutrition"
    )
    saved_paths["ingredients"] = await save_image(
        ingredients_image, "ingredients"
    )

    models_used = []

    # ── Step 1: OCR — Extract from all images ─
    try:
        # Extract front panel — claims
        front_data = extract_label_data(
            saved_paths["front"],
            section="front"
        )

        # Extract nutrition table if provided
        nutrition_data = {}
        if saved_paths["nutrition"]:
            nutrition_result = extract_label_data(
                saved_paths["nutrition"],
                section="nutrition"
            )
            nutrition_data = nutrition_result.get(
                "nutrition", {}
            )
        else:
            nutrition_data = front_data.get(
                "nutrition", {}
            )

        # Extract ingredients if provided
        ingredients_text = ""
        if saved_paths["ingredients"]:
            ingredients_result = extract_label_data(
                saved_paths["ingredients"],
                section="ingredients"
            )
            ingredients_text = ingredients_result.get(
                "ingredients", ""
            )
        else:
            ingredients_text = front_data.get(
                "ingredients", ""
            )

        # Merge everything
        extracted = {
            "product_name":  front_data.get(
                                 "product_name",
                                 "Unknown Product"
                             ),
            "front_claims":  front_data.get(
                                 "front_claims", []
                             ),
            "nutrition":     nutrition_data,
            "ingredients":   ingredients_text
        }

        models_used.append("Gemini Vision")

    except Exception as e:
        print(f"❌ Extraction error: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"OCR failed: {str(e)}"
        )

    # ── Step 2: BERT Classification ───────────
    bert_classifications = []
    if mode == "research" and extracted["front_claims"]:
        try:
            from ai.bert_classifier import classify_claims
            bert_classifications = classify_claims(
                extracted["front_claims"]
            )
            models_used.append("BERT Zero-Shot")
        except Exception as e:
            print(f"❌ BERT error: {e}")

    # ── Step 3: FSSAI Rule Engine ─────────────
    try:
        fssai_results = run_fssai_engine({
            "claims":      extracted["front_claims"],
            "nutrition":   extracted["nutrition"],
            "ingredients": extracted["ingredients"]
        })
        models_used.append("FSSAI Rule Engine")
    except Exception as e:
        print(f"❌ FSSAI error: {e}")
        fssai_results = []

    # ── Step 4: Knowledge Graph ───────────────
    try:
        interactions = check_ingredient_interactions(
          extracted["ingredients"],
          health_profile
          )
        models_used.append("NetworkX Graph")
    except Exception as e:
        print(f"❌ Graph error: {e}")
        interactions = []

    # ── Step 5: SHAP ──────────────────────────


    shap_explanations = []
    if mode == "research":
     try:
        from ai.bert_classifier import classify_claims
        bert_classifications = classify_claims(extracted["front_claims"])
        models_used.append("BERT Zero-Shot")
     except Exception as e:
        print(f"BERT not available on this server: {e}")
        bert_classifications = []

     try:
        from ai.shap_explainer import explain_claim
        for claim in extracted["front_claims"][:3]:
            shap_explanations.append(explain_claim(claim))
        models_used.append("SHAP")
     except Exception as e:
        print(f"SHAP not available on this server: {e}")
        shap_explanations = []

    # ── Step 6: Gemini Explanation ────────────
    try:
        explanation = generate_explanation(
            fssai_results,
            interactions,
            health_profile
        )
        models_used.append("Gemini Explanation")
    except Exception as e:
        explanation = "Health explanation unavailable."

    # ── Overall Verdict ───────────────────────
    verdicts = [r["verdict"] for r in fssai_results]
    if "ILLEGAL TERM" in verdicts:
        overall = "VIOLATIONS_FOUND"
    elif "MISLEADING" in verdicts:
        overall = "CAUTION"
    else:
        overall = "SAFE"

    # ── Save to MongoDB ───────────────────────
    scan = {
        "userId":        user_id,
        "productName":   extracted["product_name"],
        "imageUrls":     saved_paths,
        "scanDate":      datetime.utcnow(),
        "healthProfile": health_profile,
        "mode":          mode,
        "modelsUsed":    models_used,
        "imagesProvided": {
            "front":       bool(saved_paths["front"]),
            "nutrition":   bool(saved_paths["nutrition"]),
            "ingredients": bool(saved_paths["ingredients"])
        },
        "results": {
            "claims":              fssai_results,
            "bertClassifications": bert_classifications,
            "interactions":        interactions,
            "shapExplanations":    shap_explanations,
            "healthExplanation":   explanation,
            "overallVerdict":      overall
        }
    }

    result = await db.scans.insert_one(scan)

    return {
        "scanId":              str(result.inserted_id),
        "productName":         extracted["product_name"],
        "claims":              fssai_results,
        "bertClassifications": bert_classifications,
        "interactions":        interactions,
        "shapExplanations":    shap_explanations,
        "explanation":         explanation,
        "verdict":             overall,
        "modelsUsed":          models_used,
        "mode":                mode,
        "imagesProvided": {
            "front":       bool(saved_paths["front"]),
            "nutrition":   bool(saved_paths["nutrition"]),
            "ingredients": bool(saved_paths["ingredients"])
        }
    }


@router.get("/history")
async def get_history(
    user_id: str = Depends(get_current_user)
):
    cursor = db.scans.find(
        {"userId": user_id}
    ).sort("scanDate", -1).limit(50)  # Changed from 20 to 50

    scans = []
    async for scan in cursor:
        scan["_id"] = str(scan["_id"])
        scans.append(scan)

    return scans

@router.get("/{scan_id}")
async def get_scan(
    scan_id: str,
    user_id: str = Depends(get_current_user)
):
    scan = await db.scans.find_one({
        "_id":    ObjectId(scan_id),
        "userId": user_id
    })
    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )
    scan["_id"] = str(scan["_id"])
    return scan