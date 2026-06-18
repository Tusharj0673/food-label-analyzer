import google.genai as genai
from google.genai import types
from dotenv import load_dotenv
from PIL import Image
import os, json, io

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

PROMPTS = {
    "front": """
You are analyzing the FRONT PANEL of an Indian packaged food label.
Extract and return ONLY a JSON object:
{
    "product_name": "name of product",
    "brand": "brand name",
    "front_claims": ["claim1", "claim2"],
    "nutrition": {
        "protein": 0.0,
        "fat": 0.0,
        "sugar": 0.0,
        "sodium": 0.0,
        "fibre": 0.0,
        "calcium": 0.0
    },
    "ingredients": ""
}
Focus on: product name, brand, health claims on front panel.
If nutrition table is visible extract it too.
All nutrition values per 100g. Sodium in mg. Others in grams.
Return ONLY valid JSON. No markdown. No explanation.
""",

    "nutrition": """
You are analyzing the NUTRITION FACTS TABLE of an Indian packaged food label.
Extract and return ONLY a JSON object:
{
    "product_name": "",
    "front_claims": [],
    "nutrition": {
        "protein": 0.0,
        "fat": 0.0,
        "sugar": 0.0,
        "sodium": 0.0,
        "fibre": 0.0,
        "calcium": 0.0,
        "calories": 0.0,
        "carbohydrates": 0.0,
        "saturated_fat": 0.0,
        "trans_fat": 0.0
    },
    "ingredients": ""
}
Focus ONLY on the nutrition table values.
All values must be per 100g. Sodium in mg. Others in grams.
Return ONLY valid JSON. No markdown. No explanation.
""",

    "ingredients": """
You are analyzing the INGREDIENTS LIST of an Indian packaged food label.
Extract and return ONLY a JSON object:
{
    "product_name": "",
    "front_claims": [],
    "nutrition": {},
    "ingredients": "complete ingredients list as one string"
}
Focus ONLY on the complete ingredients list.
Include all additives, E-numbers, preservatives exactly as written.
Return ONLY valid JSON. No markdown. No explanation.
"""
}

def extract_label_data(
    image_path: str,
    section: str = "front"
) -> dict:
    try:
        image  = Image.open(image_path)
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        image_bytes = buffer.getvalue()

        prompt = PROMPTS.get(section, PROMPTS["front"])

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type="image/jpeg"
                ),
                prompt
            ]
        )

        text = response.text.strip()
        text = text.replace(
            "```json", ""
        ).replace("```", "")

        return json.loads(text)

    except Exception as e:
        print(f"❌ Gemini {section} extraction error: {e}")
        return {
            "product_name": "Unknown Product",
            "front_claims": [],
            "nutrition":    {},
            "ingredients":  ""
        }

def generate_explanation(
    violations: list,
    interactions: list,
    health_profile: str
) -> str:
    if not violations and not interactions:
        return "This product appears compliant with FSSAI regulations. No major concerns detected."

    violations_text = "\n".join([
        f"- {v['claim']}: {v['verdict']} ({v['note']})"
        for v in violations
        if v['verdict'] != 'VERIFIED'
    ])

    interactions_text = "\n".join([
        f"- {i['ingredient1']} + {i['ingredient2']}: {i['interaction']}"
        for i in interactions
    ])

    prompt = f"""
A food product has been analyzed with these findings:

FSSAI Violations:
{violations_text if violations_text else "None"}

Dangerous Ingredient Interactions:
{interactions_text if interactions_text else "None"}

User Health Profile: {health_profile}

In 3-4 simple sentences explain:
1. What these violations mean for this specific user
2. What health risks they create given their condition
3. What they should look for instead when buying

Use simple language. Be specific. No jargon.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text.strip()