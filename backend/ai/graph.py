import networkx as nx
import re

# ── Main Interaction Graph ────────────────────────────────────
G = nx.DiGraph()

# Each edge has:
# interaction  — what happens chemically/biologically
# severity     — CRITICAL / HIGH / MEDIUM / LOW
# source       — peer-reviewed citation
# health_conditions — list of conditions this is especially
#                     dangerous for (empty = dangerous for all)
# mechanism    — plain english explanation

interactions = [

    # ═══════════════════════════════════════════════════════
    # CRITICAL — Carcinogenic / Life-threatening
    # ═══════════════════════════════════════════════════════

    {
        "from":             "Sodium Benzoate (E211)",
        "to":               "Ascorbic Acid (E300)",
        "interaction":      "Forms Benzene",
        "severity":         "CRITICAL",
        "source":           "WHO 2005 Benzene in Beverages / IARC Group 1",
        "health_conditions":["heart", "pcos", "diabetic"],
        "mechanism":        "Under acidic conditions, sodium benzoate "
                           "reacts with ascorbic acid to form benzene, "
                           "a known Group 1 carcinogen linked to leukemia."
    },
    {
        "from":             "Sodium Benzoate (E211)",
        "to":               "Citric Acid (E330)",
        "interaction":      "Benzene Precursor Risk",
        "severity":         "HIGH",
        "source":           "FDA Benzene in Beverages Study 2006",
        "health_conditions":["heart", "pcos"],
        "mechanism":        "Citric acid can partially substitute for "
                           "ascorbic acid in benzene formation under "
                           "acidic, high-temperature conditions."
    },
    {
        "from":             "Potassium Bromate (E924)",
        "to":               "Ascorbic Acid (E300)",
        "interaction":      "Oxidation Amplification",
        "severity":         "CRITICAL",
        "source":           "IARC Monographs Vol 73 — Group 2B Carcinogen",
        "health_conditions":[],
        "mechanism":        "Potassium bromate, a flour improver banned "
                           "in EU and India but found in some imports, "
                           "generates free radicals amplified by ascorbic "
                           "acid oxidation."
    },

    # ═══════════════════════════════════════════════════════
    # HIGH — Serious Health Risk
    # ═══════════════════════════════════════════════════════

    {
        "from":             "Aspartame (E951)",
        "to":               "Phenylalanine",
        "interaction":      "PKU Neurotoxicity",
        "severity":         "HIGH",
        "source":           "FSSAI Warning Label Requirement / FDA PKU Advisory",
        "health_conditions":["pku"],
        "mechanism":        "Aspartame metabolizes into phenylalanine. "
                           "Individuals with PKU cannot metabolize "
                           "phenylalanine, causing irreversible brain damage."
    },
    {
        "from":             "Aspartame (E951)",
        "to":               "Acesulfame K (E950)",
        "interaction":      "Synergistic Sweetener Load",
        "severity":         "HIGH",
        "source":           "EFSA 2013 Re-evaluation of Aspartame",
        "health_conditions":["pku", "pregnant", "diabetic"],
        "mechanism":        "Combined use of aspartame and acesulfame K "
                           "doubles artificial sweetener load. "
                           "Especially dangerous for PKU patients and "
                           "pregnant women — linked to preterm delivery."
    },
    {
        "from":             "Monosodium Glutamate (E621)",
        "to":               "Disodium Inosinate (E631)",
        "interaction":      "Flavour Synergy — Sodium Spike",
        "severity":         "HIGH",
        "source":           "Journal of Nutrition 2011 — MSG Synergists",
        "health_conditions":["hypertensive", "heart"],
        "mechanism":        "MSG combined with nucleotide flavor enhancers "
                           "creates 8x flavor amplification, allowing "
                           "manufacturers to use far higher total sodium "
                           "than declared. Critical risk for hypertension."
    },
    {
        "from":             "Monosodium Glutamate (E621)",
        "to":               "Disodium Guanylate (E627)",
        "interaction":      "Sodium Amplification",
        "severity":         "HIGH",
        "source":           "American Journal of Clinical Nutrition 2011",
        "health_conditions":["hypertensive", "heart", "uric_acid"],
        "mechanism":        "Same synergy as MSG + E631. Disodium guanylate "
                           "is also high in purines — dangerous for "
                           "hyperuricemia and gout patients."
    },
    {
        "from":             "High Fructose Corn Syrup",
        "to":               "Fructose",
        "interaction":      "Uric Acid Elevation",
        "severity":         "HIGH",
        "source":           "NEJM 2010 — Fructose and Uric Acid",
        "health_conditions":["uric_acid", "diabetic", "heart"],
        "mechanism":        "Fructose metabolism uniquely stimulates uric "
                           "acid synthesis via purine degradation. Combined "
                           "HFCS and free fructose dramatically raises "
                           "serum uric acid — gout trigger."
    },
    {
        "from":             "Partially Hydrogenated Oil",
        "to":               "Palm Oil",
        "interaction":      "Trans Fat + Saturated Fat Stack",
        "severity":         "HIGH",
        "source":           "WHO TFA Elimination Guidelines 2018",
        "health_conditions":["heart", "pcos", "diabetic"],
        "mechanism":        "Trans fats from partial hydrogenation combined "
                           "with saturated palmitic acid from palm oil "
                           "creates compounded cardiovascular risk — "
                           "raises LDL while lowering HDL simultaneously."
    },
    {
        "from":             "Sodium Nitrate (E251)",
        "to":               "Ascorbic Acid (E300)",
        "interaction":      "Nitrosamine Formation",
        "severity":         "HIGH",
        "source":           "IARC Group 2A — Inorganic Nitrates / WHO 2015",
        "health_conditions":["pregnant", "heart"],
        "mechanism":        "Nitrates react with ascorbic acid under "
                           "acidic gastric conditions to form nitrosamines, "
                           "classified as probable human carcinogens. "
                           "Especially harmful in pregnancy."
    },
    {
        "from":             "Carrageenan (E407)",
        "to":               "Sodium Carboxymethylcellulose (E466)",
        "interaction":      "Gut Microbiome Disruption",
        "severity":         "HIGH",
        "source":           "Cornucopia Institute 2016 / Gut journal 2015",
        "health_conditions":["ibs", "pcos"],
        "mechanism":        "Both are emulsifiers that disrupt the gut "
                           "mucus layer. In combination, they significantly "
                           "alter gut microbiome composition, worsening "
                           "inflammatory bowel conditions and IBS."
    },

    # ═══════════════════════════════════════════════════════
    # MEDIUM — Moderate / Cumulative Risk
    # ═══════════════════════════════════════════════════════

    {
        "from":             "Sunset Yellow (E110)",
        "to":               "Tartrazine (E102)",
        "interaction":      "Hyperactivity in Children",
        "severity":         "MEDIUM",
        "source":           "EFSA Southampton Study 2007 / FSA UK Warning",
        "health_conditions":["pregnant"],
        "mechanism":        "The Southampton Six azo dyes in combination "
                           "cause measurable hyperactivity in children. "
                           "EU requires warning label — India does not "
                           "currently mandate this."
    },
    {
        "from":             "Sunset Yellow (E110)",
        "to":               "Quinoline Yellow (E104)",
        "interaction":      "Azo Dye Synergy",
        "severity":         "MEDIUM",
        "source":           "McCann et al. 2007 Lancet — Southampton Study",
        "health_conditions":["pregnant"],
        "mechanism":        "Combined azo dyes cause additive behavioral "
                           "effects in children — hyperactivity and "
                           "attention deficits."
    },
    {
        "from":             "Maltodextrin",
        "to":               "High Fructose Corn Syrup",
        "interaction":      "Glycemic Index Amplification",
        "severity":         "MEDIUM",
        "source":           "American Diabetes Association 2019",
        "health_conditions":["diabetic", "pcos"],
        "mechanism":        "Maltodextrin has GI of 110 (higher than glucose). "
                           "Combined with HFCS, the product causes a "
                           "dramatically faster blood glucose spike than "
                           "either ingredient alone."
    },
    {
        "from":             "Sorbitol (E420)",
        "to":               "Mannitol (E421)",
        "interaction":      "Laxative Threshold Exceeded",
        "severity":         "MEDIUM",
        "source":           "EFSA 2011 Polyols Scientific Opinion",
        "health_conditions":["ibs", "diabetic"],
        "mechanism":        "Sorbitol alone triggers GI distress above 10g. "
                           "Combined with mannitol, the FODMAP load "
                           "doubles — severe bloating, diarrhea, "
                           "and abdominal pain in IBS patients."
    },
    {
        "from":             "Inulin",
        "to":               "Fructooligosaccharides",
        "interaction":      "High-FODMAP Stack",
        "severity":         "MEDIUM",
        "source":           "Monash University FODMAP Research 2018",
        "health_conditions":["ibs"],
        "mechanism":        "Both are fermentable oligosaccharides. "
                           "Combined they rapidly exceed the FODMAP "
                           "threshold causing severe IBS symptoms — "
                           "gas, bloating, and altered bowel habits."
    },
    {
        "from":             "Wheat Gluten",
        "to":               "Barley Extract",
        "interaction":      "Compound Gluten Exposure",
        "severity":         "MEDIUM",
        "source":           "Celiac Disease Foundation / ESPGHAN 2012",
        "health_conditions":["celiac"],
        "mechanism":        "Products containing both wheat gluten and "
                           "barley extract expose celiac patients to "
                           "multiple gluten sources simultaneously, "
                           "accelerating intestinal villous atrophy."
    },
    {
        "from":             "Milk Solids",
        "to":               "Whey Powder",
        "interaction":      "Compound Lactose Load",
        "severity":         "MEDIUM",
        "source":           "Indian Journal of Gastroenterology 2018",
        "health_conditions":["lactose_intolerant"],
        "mechanism":        "Products combining milk solids and whey powder "
                           "contain a double lactose source, dramatically "
                           "increasing GI distress risk for the 60% of "
                           "Indians with lactose malabsorption."
    },
    {
        "from":             "Casein",
        "to":               "Lactose",
        "interaction":      "Dairy Protein + Sugar Combo",
        "severity":         "MEDIUM",
        "source":           "Bangalore Gastro Centre Medical Review 2024",
        "health_conditions":["lactose_intolerant"],
        "mechanism":        "Casein slows gastric emptying, keeping lactose "
                           "in the gut longer and intensifying fermentation "
                           "by gut bacteria — worsening lactose intolerance "
                           "symptoms significantly."
    },

    # ═══════════════════════════════════════════════════════
    # LOW — Absorption Interference / Minor Risk
    # ═══════════════════════════════════════════════════════

    {
        "from":             "Fortified Iron",
        "to":               "Fortified Calcium",
        "interaction":      "Iron Absorption Inhibition",
        "severity":         "LOW",
        "source":           "NIH Office of Dietary Supplements",
        "health_conditions":["pregnant"],
        "mechanism":        "Calcium competes with iron for intestinal "
                           "absorption pathways, reducing iron uptake "
                           "by 30-60%. Critical for pregnant women who "
                           "need both nutrients simultaneously."
    },
    {
        "from":             "Fortified Zinc",
        "to":               "Fortified Copper",
        "interaction":      "Mineral Absorption Competition",
        "severity":         "LOW",
        "source":           "American Journal of Clinical Nutrition 2000",
        "health_conditions":[],
        "mechanism":        "High zinc supplementation inhibits copper "
                           "absorption via metallothionein induction. "
                           "Long-term consumption can cause copper deficiency."
    },
    {
        "from":             "Tannins",
        "to":               "Fortified Iron",
        "interaction":      "Non-Heme Iron Inhibition",
        "severity":         "LOW",
        "source":           "European Journal of Clinical Nutrition 1999",
        "health_conditions":["pregnant"],
        "mechanism":        "Tannins in tea extracts, grape extracts, and "
                           "certain fruit flavourings bind non-heme iron "
                           "and reduce bioavailability by up to 60%."
    }
]

# Build the graph
for item in interactions:
    G.add_edge(
        item["from"],
        item["to"],
        interaction=      item["interaction"],
        severity=         item["severity"],
        source=           item["source"],
        health_conditions=item["health_conditions"],
        mechanism=        item["mechanism"]
    )

# ── Detection Function ────────────────────────────────────────
def check_ingredient_interactions(
    ingredients_text: str,
    health_profile: str = "none"
) -> list:
    """
    Check ingredient list against knowledge graph using smart alias matching.
    """
    if not ingredients_text:
        return []

    found = []
    ing_lower = ingredients_text.lower()
    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}

    # Helper function to generate variations of the ingredient name
    def get_aliases(node_name):
        name_lower = node_name.lower()
        aliases = [name_lower] # Add the original full name
        
        # Regex to split "Ingredient Name (E123)" into parts
        match = re.match(r"(.*)\s+\((e\d+[a-z]*)\)", name_lower)
        if match:
            chem_name = match.group(1).strip()
            e_code = match.group(2).strip() # e.g., "e211"
            num_only = e_code[1:]           # e.g., "211"
            
            aliases.append(chem_name)        # "sodium benzoate"
            aliases.append(e_code)           # "e211"
            aliases.append(f"ins{num_only}") # "ins211"
            aliases.append(f"ins {num_only}")# "ins 211"
            
        return aliases

    # Traverse the graph and check for aliases
    for u, v, data in G.edges(data=True):
        u_aliases = get_aliases(u)
        v_aliases = get_aliases(v)

        # Check if ANY of the aliases exist in the OCR text
        u_found = any(alias in ing_lower for alias in u_aliases)
        v_found = any(alias in ing_lower for alias in v_aliases)

        if u_found and v_found:
            conditions = data.get("health_conditions", [])
            is_relevant = (
                health_profile != "none" and
                health_profile in conditions
            )

            found.append({
                "ingredient1":        u, # Keep original name for the React UI
                "ingredient2":        v,
                "interaction":        data["interaction"],
                "severity":           data["severity"],
                "source":             data["source"],
                "mechanism":          data["mechanism"],
                "health_conditions":  conditions,
                "relevant_for_user":  is_relevant
            })

    # Sort: user-relevant first, then by severity
    found.sort(key=lambda x: (
        0 if x["relevant_for_user"] else 1,
        severity_order.get(x["severity"], 4)
    ))

    return found
