from transformers import pipeline
import os

# We use zero-shot first
# Replace with fine-tuned model path after training
ZERO_SHOT_MODEL = "facebook/bart-large-mnli"

CLAIM_LABELS = [
    "nutrition claim",
    "composition claim",
    "process claim",
    "health claim",
    "banned term",
    "non claim"
]

_classifier = None

def get_classifier():
    global _classifier
    if _classifier is None:
        try:
            from transformers import pipeline as hf_pipeline
            print("🤖 Loading BERT classifier...")
            _classifier = hf_pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli"
            )
            print("✅ BERT classifier loaded")
        except Exception as e:
            print(f"❌ BERT classifier load failed: {e}")
            raise
    return _classifier

CLAIM_LABELS = [
    "nutrition claim",
    "composition claim",
    "process claim",
    "health claim",
    "banned term",
    "non claim"
]

def classify_claims(claims: list) -> list:
    if not claims:
        return []

    try:
        classifier = get_classifier()
        results    = []

        for claim in claims:
            result = classifier(
                claim,
                candidate_labels=CLAIM_LABELS,
                hypothesis_template="This text is a {}."
            )
            results.append({
                "claim":      claim,
                "type":       result["labels"][0],
                "confidence": round(result["scores"][0], 3)
            })

        return results

    except Exception as e:
        print(f"❌ BERT classification error: {e}")
        return [
            {"claim": c, "type": "unknown", "confidence": 0}
            for c in claims
        ]