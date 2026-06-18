from transformers import (
    AutoProcessor,
    AutoModelForDocumentQuestionAnswering
)
from PIL import Image
import torch

_processor = None
_model     = None

def get_layoutlm():
    global _processor, _model
    if _processor is None:
        print("🤖 Loading LayoutLMv3...")
        _processor = AutoProcessor.from_pretrained(
            "impira/layoutlm-document-qa",
            apply_ocr=True
        )
        _model = AutoModelForDocumentQuestionAnswering.from_pretrained(
            "impira/layoutlm-document-qa"
        )
        print("✅ LayoutLMv3 loaded")
    return _processor, _model

def extract_with_layoutlm(image_path: str) -> dict:
    try:
        processor, model = get_layoutlm()
        image = Image.open(image_path).convert("RGB")

        questions = [
            "What are the health claims?",
            "What is the protein content?",
            "What is the fat content?",
            "What is the sugar content?",
            "What is the sodium content?",
            "What are the ingredients?"
        ]

        answers = {}
        for question in questions:
            try:
                encoding = processor(
                    image,
                    question,
                    return_tensors="pt"
                )

                with torch.no_grad():
                    outputs = model(**encoding)

                start_idx = outputs.start_logits.argmax()
                end_idx   = outputs.end_logits.argmax()

                input_ids = encoding.input_ids[0]

                if end_idx >= start_idx:
                    answer_ids = input_ids[
                        start_idx:end_idx + 1
                    ]
                    answer = processor.tokenizer.decode(
                        answer_ids,
                        skip_special_tokens=True
                    )
                else:
                    answer = "Not found"

                answers[question] = answer.strip()

            except Exception as e:
                answers[question] = f"Error: {str(e)}"

        return {
            "raw_answers": answers,
            "source":      "layoutlmv3"
        }

    except Exception as e:
        print(f"❌ LayoutLMv3 error: {e}")
        return {
            "raw_answers": {},
            "source":      "layoutlmv3"
        }