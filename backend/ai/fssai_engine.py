# ============================================================
# FSSAI COMPLIANCE ENGINE — Updated with correct thresholds
# Source: FSSAI Advertising & Claims Regulations 2018, Sch I
# ============================================================

# ── FSSAI Claim Thresholds ───────────────────────────────────
# Each claim has solid and liquid thresholds per Schedule I

FSSAI_THRESHOLDS = {

    # ── Protein Claims ──────────────────────────────────────
    "high protein": {
        "nutrient": "protein",
        "solid":    {"operator": ">=", "value": 10.0, "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 5.0,  "unit": "g/100ml"}
    },
    "source of protein": {
        "nutrient": "protein",
        "solid":    {"operator": ">=", "value": 5.0,  "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 2.5,  "unit": "g/100ml"}
    },
    "rich in protein": {
        "nutrient": "protein",
        "solid":    {"operator": ">=", "value": 10.0, "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 5.0,  "unit": "g/100ml"}
    },

    # ── Fat Claims ───────────────────────────────────────────
    "low fat": {
        "nutrient": "fat",
        "solid":    {"operator": "<=", "value": 3.0,  "unit": "g/100g"},
        "liquid":   {"operator": "<=", "value": 1.5,  "unit": "g/100ml"}
    },
    "fat free": {
        "nutrient": "fat",
        "solid":    {"operator": "<=", "value": 0.5,  "unit": "g/100g"},
        "liquid":   {"operator": "<=", "value": 0.5,  "unit": "g/100ml"}
    },
    "reduced fat": {
        "nutrient": "fat",
        "solid":    {"operator": "<=", "value": 3.0,  "unit": "g/100g"},
        "liquid":   {"operator": "<=", "value": 1.5,  "unit": "g/100ml"}
    },

    # ── Sugar Claims ─────────────────────────────────────────
    "low sugar": {
        "nutrient": "sugar",
        "solid":    {"operator": "<=", "value": 5.0,  "unit": "g/100g"},
        "liquid":   {"operator": "<=", "value": 2.5,  "unit": "g/100ml"}
    },
    "sugar free": {
        "nutrient": "sugar",
        "solid":    {"operator": "<=", "value": 0.5,  "unit": "g/100g"},
        "liquid":   {"operator": "<=", "value": 0.5,  "unit": "g/100ml"}
    },
    "reduced sugar": {
        "nutrient": "sugar",
        "solid":    {"operator": "<=", "value": 5.0,  "unit": "g/100g"},
        "liquid":   {"operator": "<=", "value": 2.5,  "unit": "g/100ml"}
    },

    # ── Sodium Claims ────────────────────────────────────────
    "low sodium": {
        "nutrient": "sodium",
        "solid":    {"operator": "<=", "value": 120.0, "unit": "mg/100g"},
        "liquid":   {"operator": "<=", "value": 120.0, "unit": "mg/100ml"}
    },
    "low salt": {
        "nutrient": "sodium",
        "solid":    {"operator": "<=", "value": 120.0, "unit": "mg/100g"},
        "liquid":   {"operator": "<=", "value": 120.0, "unit": "mg/100ml"}
    },
    "sodium free": {
        "nutrient": "sodium",
        "solid":    {"operator": "<=", "value": 5.0,  "unit": "mg/100g"},
        "liquid":   {"operator": "<=", "value": 5.0,  "unit": "mg/100ml"}
    },
    "salt free": {
        "nutrient": "sodium",
        "solid":    {"operator": "<=", "value": 5.0,  "unit": "mg/100g"},
        "liquid":   {"operator": "<=", "value": 5.0,  "unit": "mg/100ml"}
    },

    # ── Fibre Claims ─────────────────────────────────────────
    "high fibre": {
        "nutrient": "fibre",
        "solid":    {"operator": ">=", "value": 6.0,  "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 3.0,  "unit": "g/100ml"}
    },
    "high fiber": {
        "nutrient": "fibre",
        "solid":    {"operator": ">=", "value": 6.0,  "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 3.0,  "unit": "g/100ml"}
    },
    "source of fibre": {
        "nutrient": "fibre",
        "solid":    {"operator": ">=", "value": 3.0,  "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 1.5,  "unit": "g/100ml"}
    },
    "source of fiber": {
        "nutrient": "fibre",
        "solid":    {"operator": ">=", "value": 3.0,  "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 1.5,  "unit": "g/100ml"}
    },
    "good source of fibre": {
        "nutrient": "fibre",
        "solid":    {"operator": ">=", "value": 3.0,  "unit": "g/100g"},
        "liquid":   {"operator": ">=", "value": 1.5,  "unit": "g/100ml"}
    },

    # ── Calcium Claims ───────────────────────────────────────
    # CORRECTED: Rich in Calcium = ≥30% RDA for solids
    # Source of Calcium = ≥15% RDA for solids
    "rich in calcium": {
        "nutrient": "calcium",
        "solid":    {"operator": ">=", "value": 30.0, "unit": "% RDA/100g"},
        "liquid":   {"operator": ">=", "value": 15.0, "unit": "% RDA/100ml"}
    },
    "high in calcium": {
        "nutrient": "calcium",
        "solid":    {"operator": ">=", "value": 30.0, "unit": "% RDA/100g"},
        "liquid":   {"operator": ">=", "value": 15.0, "unit": "% RDA/100ml"}
    },
    "source of calcium": {
        "nutrient": "calcium",
        "solid":    {"operator": ">=", "value": 15.0, "unit": "% RDA/100g"},
        "liquid":   {"operator": ">=", "value": 7.5,  "unit": "% RDA/100ml"}
    },
}

# ── Banned Terms ─────────────────────────────────────────────
# FSSAI Advisory April 2024 + FSS Act 2006
BANNED_TERMS = [
    "health drink",
    "energy drink",
    "health food",
    "nutritious drink",
    "tonic",
    "health tonic"
]

# ── Sugar Aliases (No Added Sugar check) ─────────────────────
SUGAR_ALIASES = [
    "dextrose", "maltodextrin", "corn syrup",
    "fructose", "glucose syrup", "maltose",
    "sucrose", "fruit concentrate", "fruit juice concentrate",
    "evaporated cane juice", "invert sugar", "treacle",
    "agave", "barley malt", "coconut sugar",
    "date syrup", "honey", "jaggery", "raw sugar",
    "cane sugar", "beet sugar", "maple syrup",
    "high fructose corn syrup", "hfcs"
]

# ── Health Condition Ingredient Flags ────────────────────────
# When a user has a health condition selected,
# these ingredients get additionally flagged

HEALTH_CONDITION_FLAGS = {

    "diabetic": {
        "label": "Diabetic Alert",
        "ingredients": [
            "maltodextrin", "dextrose", "glucose syrup",
            "high fructose corn syrup", "hfcs",
            "corn syrup", "white flour", "maida",
            "refined flour", "modified starch",
            "glucose", "fructose"
        ],
        "nutrient_checks": [
            {
                "nutrient": "sugar",
                "operator": ">",
                "value":    5.0,
                "message":  "High sugar content — raises blood glucose"
            }
        ],
        "message": "This product may spike blood glucose rapidly."
    },

    "hypertensive": {
        "label": "Heart / BP Alert",
        "ingredients": [
            "sodium", "salt", "monosodium glutamate",
            "msg", "sodium benzoate", "sodium nitrate",
            "disodium", "baking soda", "baking powder",
            "sodium bicarbonate", "sea salt", "rock salt"
        ],
        "nutrient_checks": [
            {
                "nutrient": "sodium",
                "operator": ">",
                "value":    400.0,
                "message":  "High sodium — risk for hypertension"
            }
        ],
        "message": "This product has elevated sodium — risk for blood pressure."
    },

    "pku": {
        "label": "PKU Alert",
        "ingredients": [
            "aspartame", "e951", "phenylalanine",
            "contains phenylalanine", "aspartyl-phenylalanine"
        ],
        "nutrient_checks": [],
        "message": "Contains phenylalanine — dangerous for PKU patients."
    },

    "pregnant": {
        "label": "Pregnancy Alert",
        "ingredients": [
            "aspartame", "saccharin", "e954",
            "unpasteurized", "raw milk",
            "sodium nitrate", "e251", "e252",
            "alcohol", "caffeine", "high caffeine",
            "acesulfame", "e950", "cyclamate", "e952"
        ],
        "nutrient_checks": [],
        "message": "Contains ingredients that require caution during pregnancy."
    },

    "lactose_intolerant": {
        "label": "Lactose Alert",
        "ingredients": [
            "milk", "milk solids", "milk powder",
            "skimmed milk", "full cream milk",
            "whey", "whey powder", "whey protein",
            "casein", "caseinate", "lactose",
            "lactulose", "cream", "butter",
            "ghee", "cheese", "paneer",
            "milk fat", "dairy", "milk derivatives",
            "milk proteins", "lactalbumin",
            "lactoglobulin", "milk serum"
        ],
        "nutrient_checks": [],
        "message": "Contains dairy/lactose — may cause digestive issues for lactose intolerant individuals."
    },

    "pcos": {
        "label": "PCOS Alert",
        "ingredients": [
            "maida", "refined wheat flour",
            "white flour", "refined flour",
            "partially hydrogenated",
            "hydrogenated vegetable oil",
            "trans fat", "vanaspati",
            "high fructose corn syrup", "hfcs",
            "corn syrup", "maltodextrin",
            "dextrose", "glucose syrup",
            "refined sugar", "white sugar",
            "artificial sweetener"
        ],
        "nutrient_checks": [
            {
                "nutrient": "sugar",
                "operator": ">",
                "value":    5.0,
                "message":  "High sugar — worsens insulin resistance in PCOS"
            }
        ],
        "message": "Contains ingredients that worsen insulin resistance — avoid for PCOS management."
    },

    "celiac": {
        "label": "Gluten Alert",
        "ingredients": [
            "wheat", "wheat flour", "maida",
            "atta", "semolina", "suji", "sooji",
            "rawa", "barley", "rye", "malt",
            "malt extract", "malt flavoring",
            "barley malt", "wheat starch",
            "wheat protein", "hydrolyzed wheat protein",
            "gluten", "wheat gluten",
            "spelt", "kamut", "farro",
            "wheat bran", "wheat germ",
            "triticale", "bulgur", "couscous"
        ],
        "nutrient_checks": [],
        "message": "Contains gluten — dangerous for Celiac disease patients."
    },

    "heart": {
        "label": "CVD / Heart Alert",
        "ingredients": [
            "palm oil", "palmolein", "palm kernel oil",
            "partially hydrogenated", "hydrogenated oil",
            "vanaspati", "trans fat",
            "coconut oil", "lard", "tallow",
            "interesterified fat",
            "saturated fat", "butter fat"
        ],
        "nutrient_checks": [
            {
                "nutrient": "sodium",
                "operator": ">",
                "value":    400.0,
                "message":  "High sodium — elevates cardiovascular risk"
            },
            {
                "nutrient": "fat",
                "operator": ">",
                "value":    17.5,
                "message":  "High fat content — risk for dyslipidemia"
            }
        ],
        "message": "Contains saturated/trans fats or high sodium — elevates cardiovascular risk."
    },

    "ibs": {
        "label": "IBS / Gut Alert",
        "ingredients": [
            "sorbitol", "maltitol", "xylitol",
            "erythritol", "mannitol", "isomalt",
            "lactitol", "polyol", "sugar alcohol",
            "inulin", "chicory root", "chicory fiber",
            "chicory root extract", "chicory root fiber",
            "fructooligosaccharides", "fos",
            "galactooligosaccharides", "gos",
            "high fructose corn syrup", "hfcs",
            "fructose", "apple juice", "pear juice",
            "onion", "garlic", "wheat"
        ],
        "nutrient_checks": [],
        "message": "Contains high-FODMAP ingredients — may trigger IBS symptoms."
    },

    "uric_acid": {
        "label": "Uric Acid Alert",
        "ingredients": [
            "high fructose corn syrup", "hfcs",
            "fructose", "liquid glucose",
            "glucose-fructose syrup",
            "corn syrup", "yeast extract",
            "autolyzed yeast", "yeast",
            "hydrolyzed yeast", "msg",
            "monosodium glutamate",
            "disodium guanylate", "e627",
            "disodium inosinate", "e631",
            "ribonucleotides", "e635",
            "anchovies", "sardines", "mackerel"
        ],
        "nutrient_checks": [],
        "message": "Contains fructose/purines — raises uric acid levels, risk for gout."
    }
}

# ── Helper Functions ─────────────────────────────────────────

def check_threshold(operator: str, actual: float, threshold: float) -> bool:
    if operator == ">=": return actual >= threshold
    if operator == "<=": return actual <= threshold
    if operator == ">":  return actual > threshold
    if operator == "<":  return actual < threshold
    return False

def detect_form(nutrition: dict) -> str:
    """
    Detect if product is solid or liquid.
    Liquids typically have very low energy density
    or have serving in ml declared.
    Default to solid if uncertain.
    """
    # If product explicitly has per_ml flag
    if nutrition.get("is_liquid"):
        return "liquid"
    # Heuristic: if fat < 0.5 and protein < 1 likely liquid
    fat     = nutrition.get("fat", 10)
    protein = nutrition.get("protein", 5)
    if fat < 0.5 and protein < 1.0:
        return "liquid"
    return "solid"

def check_health_condition_flags(
    ingredients: str,
    nutrition: dict,
    health_profile: str
) -> list:
    """
    Check ingredients and nutrition against
    health condition specific flags.
    """
    if not health_profile or health_profile == "none":
        return []

    condition = HEALTH_CONDITION_FLAGS.get(health_profile)
    if not condition:
        return []

    flags      = []
    ing_lower  = ingredients.lower()

    # Check ingredient flags
    found_ings = [
        ing for ing in condition["ingredients"]
        if ing.lower() in ing_lower
    ]

    if found_ings:
        flags.append({
            "type":       "ingredient_flag",
            "condition":  health_profile,
            "label":      condition["label"],
            "found":      found_ings,
            "message":    condition["message"],
            "severity":   "HIGH"
        })

    # Check nutrient flags
    for check in condition.get("nutrient_checks", []):
        actual = nutrition.get(check["nutrient"], 0)
        if check_threshold(check["operator"], actual, check["value"]):
            flags.append({
                "type":      "nutrient_flag",
                "condition": health_profile,
                "label":     condition["label"],
                "message":   check["message"],
                "actual":    f"{actual} per 100g",
                "severity":  "MEDIUM"
            })

    return flags

# ── Main FSSAI Engine ────────────────────────────────────────

def run_fssai_engine(product: dict) -> list:
    claims      = product.get("claims", [])
    nutrition   = product.get("nutrition", {})
    ingredients = product.get("ingredients", "").lower()
    form        = detect_form(nutrition)

    results = []

    for claim in claims:
        claim_lower = claim.lower()

        # ── Check 1: Banned Terms ──────────────────────────
        if any(banned in claim_lower for banned in BANNED_TERMS):
            results.append({
                "claim":      claim,
                "verdict":    "ILLEGAL TERM",
                "severity":   "CRITICAL",
                "actual":     "N/A",
                "required":   "N/A",
                "regulation": "FSSAI Advisory April 2024 — term not defined under FSS Act 2006",
                "note":       f'"{claim}" is not a legally recognized category under Indian food law'
            })
            continue

        # ── Check 2: No Added Sugar ────────────────────────
        if "no added sugar" in claim_lower:
            found = [s for s in SUGAR_ALIASES if s in ingredients]
            results.append({
                "claim":      claim,
                "verdict":    "MISLEADING" if found else "VERIFIED",
                "severity":   "CRITICAL" if found else "NONE",
                "actual":     f"Contains: {', '.join(found)}" if found else "No sugar aliases detected",
                "required":   "No monosaccharides, disaccharides or sweetening agents added",
                "regulation": "FSSAI Advertising & Claims Regulations 2018",
                "note":       "Sugar found under alternative name" if found else "Claim appears valid"
            })
            continue

        # ── Check 3: Threshold-Based Claims ───────────────
        matched = False
        for keyword, rule in FSSAI_THRESHOLDS.items():
            if keyword in claim_lower:
                matched   = True
                nutrient  = rule["nutrient"]
                threshold_data = rule[form]
                operator  = threshold_data["operator"]
                threshold = threshold_data["value"]
                unit      = threshold_data["unit"]
                actual    = nutrition.get(nutrient, 0)
                passes    = check_threshold(operator, actual, threshold)

                direction = f"≥ {threshold}" if operator == ">=" else f"≤ {threshold}"
                regulation_note = f"FSSAI Advertising & Claims Regulations 2018, Schedule I ({'Solid' if form == 'solid' else 'Liquid'} threshold)"

                results.append({
                    "claim":      claim,
                    "verdict":    "VERIFIED" if passes else "MISLEADING",
                    "severity":   "NONE" if passes else "HIGH",
                    "actual":     f"{actual} {unit}",
                    "required":   f"{direction} {unit}",
                    "regulation": regulation_note,
                    "note":       "Meets FSSAI threshold" if passes else f"Declared {actual} {unit} — fails threshold for {form}s"
                })
                break

        # ── Check 4: Unverifiable Claims ──────────────────
        if not matched and "no added sugar" not in claim_lower:
            results.append({
                "claim":      claim,
                "verdict":    "UNSUBSTANTIATED",
                "severity":   "MEDIUM",
                "actual":     "N/A",
                "required":   "N/A",
                "regulation": "FSSAI Advertising & Claims Regulations 2018",
                "note":       "Claim cannot be verified against declared nutrition values"
            })

    return results