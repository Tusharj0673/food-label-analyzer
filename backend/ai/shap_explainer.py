import numpy as np

_classifier = None

def get_classifier():
    global _classifier
    if _classifier is None:
        # if transformers/torch has version issues
        try:
            from transformers import pipeline as hf_pipeline
            print("🤖 Loading SHAP classifier...")
            _classifier = hf_pipeline(
                "text-classification",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                return_all_scores=True
            )
            print("✅ SHAP classifier loaded")
        except Exception as e:
            print(f"❌ SHAP classifier load failed: {e}")
            raise
    return _classifier

def explain_claim(claim: str) -> dict:
    empty_result = {
        "claim":      claim,
        "top_tokens": [],
        "source":     "shap"
    }

    try:
        # Import shap here — not at module level
        import shap

        if not claim or not isinstance(claim, str):
            return empty_result

        claim = claim.strip()
        if len(claim) == 0:
            return empty_result

        classifier  = get_classifier()
        explainer   = shap.Explainer(classifier)
        shap_values = explainer([claim])

        if shap_values is None:
            print("⚠️ SHAP: explainer returned None")
            return empty_result

        if not hasattr(shap_values, 'data') or \
           not hasattr(shap_values, 'values'):
            print("⚠️ SHAP: missing data/values attributes")
            return empty_result

        try:
            tokens = list(shap_values.data[0])
            values = np.array(shap_values.values[0])
        except (IndexError, TypeError) as e:
            print(f"⚠️ SHAP: indexing error: {e}")
            return empty_result

        print(f"🔍 SHAP tokens: {len(tokens)}, "
              f"values shape: {values.shape}")

        token_importance = []

        for i, token in enumerate(tokens):
            if not token:
                continue
            token_str = str(token).strip()
            if token_str in [
                '[CLS]', '[SEP]', '[PAD]',
                '<s>', '</s>', '<pad>', ''
            ]:
                continue

            try:
                val       = values[i]
                val_array = np.array(val)
                importance = float(np.max(np.abs(val_array)))
                if importance > 0:
                    token_importance.append({
                        "token":      token_str,
                        "importance": round(importance, 4)
                    })
            except Exception as token_err:
                print(f"⚠️ token[{i}] error: {token_err}")
                continue

        token_importance.sort(
            key=lambda x: x["importance"],
            reverse=True
        )

        top_tokens = token_importance[:5]
        print(f"✅ SHAP: {len(top_tokens)} tokens "
              f"for '{claim[:30]}'")

        return {
            "claim":      claim,
            "top_tokens": top_tokens,
            "source":     "shap"
        }

    except Exception as e:
        print(f"❌ SHAP error [{type(e).__name__}]: {e}")
        import traceback
        traceback.print_exc()
        return empty_result