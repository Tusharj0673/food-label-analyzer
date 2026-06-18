import {
  ShieldCheck,
  Brain,
  GitBranch,
  Sparkles,
  CheckCircle,
  Zap,
  FlaskConical
} from 'lucide-react'

export const healthProfiles = [
  {
    id:          'none',
    label:       'No Condition',
    description: 'General analysis',
    color:       'bg-gray-100 text-gray-800 border-gray-400 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30'
  },
  {
    id:          'diabetic',
    label:       'Diabetic',
    description: 'Sugar & GI focused',
    color:       'bg-blue-100 text-blue-900 border-blue-500 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30'
  },
  {
    id:          'hypertensive',
    label:       'Hypertensive',
    description: 'Sodium focused',
    color:       'bg-orange-100 text-orange-900 border-orange-500 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30'
  },
  {
    id:          'pku',
    label:       'PKU',
    description: 'Phenylalanine alert',
    color:       'bg-violet-100 text-violet-900 border-violet-500 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30'
  },
  {
    id:          'pregnant',
    label:       'Pregnant',
    description: 'Safety focused',
    color:       'bg-pink-100 text-pink-900 border-pink-500 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/30'
  },
  {
    id:          'lactose_intolerant',
    label:       'Lactose Intolerant',
    description: 'Flags milk & dairy',
    color:       'bg-amber-100 text-amber-900 border-amber-500 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30'
  },
  {
    id:          'pcos',
    label:       'PCOS',
    description: 'Flags maida, trans fats',
    color:       'bg-rose-100 text-rose-900 border-rose-500 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
  },
  {
    id:          'celiac',
    label:       'Celiac / Gluten',
    description: 'Flags wheat & gluten',
    color:       'bg-yellow-100 text-yellow-900 border-yellow-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
  },
  {
    id:          'heart',
    label:       'Heart / CVD',
    description: 'Flags palm oil, trans fat',
    color:       'bg-red-100 text-red-900 border-red-500 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
  },
  {
    id:          'ibs',
    label:       'IBS / Gut',
    description: 'Flags polyols, inulin',
    color:       'bg-teal-100 text-teal-900 border-teal-500 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30'
  },
  {
    id:          'uric_acid',
    label:       'High Uric Acid',
    description: 'Flags HFCS, yeast extract',
    color:       'bg-indigo-100 text-indigo-900 border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30'
  }
]

export const modes = [
  {
    id:          'production',
    label:       'Production Mode',
    description: 'Fast — Gemini powered',
    icon:        Zap,
    color:       'border-green-500 bg-green-500/10 text-green-500'
  },
  {
    id:          'research',
    label:       'Research Mode',
    description: 'Full pipeline — BERT + LayoutLMv3 + SHAP',
    icon:        FlaskConical,
    color:       'border-purple-500 bg-purple-500/10 text-purple-500'
  }
]

export const productionSteps = [
  {
    icon:   ShieldCheck,
    label:  'Reading label with Gemini Vision...',
    detail: 'Extracting claims, nutrition table, ingredients'
  },
  {
    icon:   Brain,
    label:  'Identifying health claims...',
    detail: 'Gemini parsing front panel text'
  },
  {
    icon:   CheckCircle,
    label:  'Checking FSSAI compliance...',
    detail: 'Rule engine verifying each claim against law'
  },
  {
    icon:   GitBranch,
    label:  'Scanning ingredient interactions...',
    detail: 'NetworkX knowledge graph analysis'
  },
  {
    icon:   Sparkles,
    label:  'Generating health explanation...',
    detail: 'Gemini personalising output to your profile'
  }
]

export const researchSteps = [
  {
    icon:   ShieldCheck,
    label:  'Parsing label with LayoutLMv3...',
    detail: 'Microsoft layout-aware document understanding'
  },
  {
    icon:   Brain,
    label:  'Classifying claims with BERT...',
    detail: 'Zero-shot NLP classification of claim types'
  },
  {
    icon:   CheckCircle,
    label:  'Verifying against FSSAI thresholds...',
    detail: 'Rule engine cross-referencing claim vs nutrition'
  },
  {
    icon:   GitBranch,
    label:  'Running interaction knowledge graph...',
    detail: 'NetworkX detecting dangerous additive combinations'
  },
  {
    icon:   Sparkles,
    label:  'Running SHAP + Gemini explanation...',
    detail: 'Token importance + personalised health impact'
  }
]

export const productionBadges = [
  'Gemini Vision', 'FSSAI 2018',
  'NetworkX Graph', 'Instant Results'
]

export const researchBadges = [
  'LayoutLMv3', 'BERT NLP', 'SHAP XAI',
  'NetworkX Graph', 'FSSAI 2018', 'Gemini AI'
]