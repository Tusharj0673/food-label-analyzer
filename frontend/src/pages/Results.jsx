import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import KnowledgeGraph from '@/components/results/KnowledgeGraph'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  ScanLine,
  Loader2,
  Brain,
  GitBranch,
  Sparkles,
  Info,
  FlaskConical,
  Zap,
  BarChart2,
  Cpu,
  User
} from 'lucide-react'
import api from '@/api/axios'
import toast, { Toaster } from 'react-hot-toast'


// ── Config ────────────────────────────────────

const verdictConfig = {
  SAFE: {
    label:  'All Clear',
    color:  'text-green-500',
    bg:     'bg-green-500/10',
    border: 'border-green-500/30',
    icon:   CheckCircle
  },
  CAUTION: {
    label:  'Caution',
    color:  'text-yellow-500',
    bg:     'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon:   AlertTriangle
  },
  VIOLATIONS_FOUND: {
    label:  'Violations Found',
    color:  'text-red-500',
    bg:     'bg-red-500/10',
    border: 'border-red-500/30',
    icon:   XCircle
  }
}

const claimConfig = {
  VERIFIED: {
    icon:   CheckCircle,
    color:  'text-green-500',
    bg:     'bg-green-500/10',
    border: 'border-green-500/20'
  },
  MISLEADING: {
    icon:   XCircle,
    color:  'text-red-500',
    bg:     'bg-red-500/10',
    border: 'border-red-500/20'
  },
  'ILLEGAL TERM': {
    icon:   AlertCircle,
    color:  'text-red-600',
    bg:     'bg-red-600/10',
    border: 'border-red-600/20'
  },
  UNSUBSTANTIATED: {
    icon:   AlertTriangle,
    color:  'text-yellow-500',
    bg:     'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  }
}

const severityColors = {
  CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/30',
  HIGH:     'bg-orange-500/10 text-orange-500 border-orange-500/30',
  MEDIUM:   'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  LOW:      'bg-blue-500/10 text-blue-500 border-blue-500/30',
  NONE:     'bg-green-500/10 text-green-500 border-green-500/30'
}

const bertTypeColors = {
  'nutrition claim':    'bg-blue-500/10 text-blue-500 border-blue-500/30',
  'composition claim':  'bg-purple-500/10 text-purple-500 border-purple-500/30',
  'process claim':      'bg-orange-500/10 text-orange-500 border-orange-500/30',
  'health claim':       'bg-green-500/10 text-green-500 border-green-500/30',
  'banned term':        'bg-red-500/10 text-red-500 border-red-500/30',
  'non claim':          'bg-gray-500/10 text-gray-500 border-gray-500/30'
}

// ── Component ─────────────────────────────────

export default function Results() {
  const location   = useLocation()
  const navigate   = useNavigate()
  const { scanId } = useParams()

  const [data, setData]       = useState(location.state || null)
  const [loading, setLoading] = useState(!location.state)

  useEffect(() => {
    if (!location.state && scanId) {
      fetchScan()
    }
  }, [scanId])

  const fetchScan = async () => {
    try {
      const response = await api.get(`/scan/${scanId}`)
      const scan     = response.data
      setData({
        scanId:              scan._id,
        productName:         scan.productName,
        claims:              scan.results.claims,
        bertClassifications: scan.results.bertClassifications,
        interactions:        scan.results.interactions,
        shapExplanations:    scan.results.shapExplanations,
        explanation:         scan.results.healthExplanation,
        verdict:             scan.results.overallVerdict,
        modelsUsed:          scan.modelsUsed,
        mode:                scan.mode
      })
    } catch (error) {
      toast.error('Could not load scan results')
      navigate('/history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading results...
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            No results found
          </p>
          <Button onClick={() => navigate('/scan')}>
            Scan a Label
          </Button>
        </div>
      </div>
    )
  }

  const {
    productName,
    claims              = [],
    bertClassifications = [],
    interactions        = [],
    shapExplanations    = [],
    explanation,
    verdict             = 'SAFE',
    modelsUsed          = [],
    mode                = 'production'
  } = data

  const config          = verdictConfig[verdict] || verdictConfig.SAFE
  const VerdictIcon     = config.icon
  const verifiedCount   = claims.filter(c => c.verdict === 'VERIFIED').length
  const violationsCount = claims.filter(c => c.verdict !== 'VERIFIED').length
  const isResearch      = mode === 'research'

  return (
    <div className="min-h-[90vh] py-12 px-4">
      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-background to-background pointer-events-none" />

      <div className="max-w-3xl mx-auto relative space-y-6">

        {/* Back Button */}
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate('/scan')}
        >
          <ArrowLeft className="h-4 w-4" />
          Scan Another Label
        </Button>

        {/* Mode Badge */}
        <div className="flex items-center gap-2">
          {isResearch ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-500 text-xs font-medium">
              <FlaskConical className="h-3 w-3" />
              Research Mode — Full Pipeline
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 text-xs font-medium">
              <Zap className="h-3 w-3" />
              Production Mode — Gemini Powered
            </div>
          )}
        </div>

        {/* Overall Verdict Card */}
        <Card className={`border ${config.border} ${config.bg}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                  <VerdictIcon className={`h-7 w-7 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Overall Verdict
                  </p>
                  <h1 className={`text-2xl font-bold ${config.color}`}>
                    {config.label}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {productName || 'Unknown Product'}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {verifiedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {violationsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Violations
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {interactions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Interactions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Models Used — Research Mode Only */}
        {isResearch && modelsUsed.length > 0 && (
          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-500">
                <Cpu className="h-5 w-5" />
                AI Models Used in This Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {modelsUsed.map((model, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-purple-500/30 text-purple-400 bg-purple-500/10"
                  >
                    {model}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Multi-model fusion pipeline — each model
                contributes a distinct layer of analysis
              </p>
            </CardContent>
          </Card>
        )}

        {/* BERT Classifications — Research Mode Only */}
        {isResearch && bertClassifications.length > 0 && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-blue-500" />
                BERT Claim Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                BERT zero-shot classifier categorises each
                marketing claim by type before FSSAI
                verification runs
              </p>
              {bertClassifications.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card gap-3 flex-wrap"
                >
                  <p className="text-sm font-medium">
                    "{item.claim}"
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        bertTypeColors[item.type] ||
                        'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* FSSAI Claims Verification */}
        {claims.length > 0 && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                FSSAI Claims Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {claims.map((claim, idx) => {
                const cfg  = claimConfig[claim.verdict] ||
                             claimConfig.UNSUBSTANTIATED
                const Icon = cfg.icon

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}
                  >
                    <div className="flex items-start gap-3 flex-wrap">
                      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.color}`} />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">
                            "{claim.claim}"
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${cfg.color} border-current`}
                          >
                            {claim.verdict}
                          </Badge>
                          {claim.severity !== 'NONE' && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${severityColors[claim.severity]}`}
                            >
                              {claim.severity}
                            </Badge>
                          )}
                        </div>

                        {claim.verdict !== 'VERIFIED' && (
                          <div className="space-y-1">
                            {claim.actual !== 'N/A' && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">
                                  Declared:
                                </span>{' '}
                                {claim.actual}
                              </p>
                            )}
                            {claim.required !== 'N/A' && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">
                                  Required:
                                </span>{' '}
                                {claim.required}
                              </p>
                            )}
                            {claim.note && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">
                                  Note:
                                </span>{' '}
                                {claim.note}
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground/70 italic">
                          {claim.regulation}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* SHAP Explainability — Research Mode Only */}
        {/* {isResearch && shapExplanations.length > 0 && ( */}
        {shapExplanations.length > 0 &&
 shapExplanations.some(s => s.top_tokens?.length > 0) && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="h-5 w-5 text-orange-500" />
                SHAP Explainability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                SHAP values show which words in each claim
                most influenced the AI classification
                decision — making the model transparent
                and auditable
              </p>
              {shapExplanations.map((item, idx) => (
                item.top_tokens.length > 0 && (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/60 space-y-3"
                  >
                    <p className="text-sm font-medium">
                      "{item.claim}"
                    </p>
                    <div className="space-y-2">
                      {item.top_tokens.map(
                        (token, tidx) => {
                          const maxImportance = Math.max(
                            ...item.top_tokens.map(
                              t => t.importance
                            )
                          )
                          const width = maxImportance > 0
                            ? (token.importance / maxImportance) * 100
                            : 0

                          return (
                            <div
                              key={tidx}
                              className="flex items-center gap-3"
                            >
                              <span className="text-xs font-mono text-muted-foreground w-24 shrink-0 truncate">
                                {token.token}
                              </span>
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                  style={{ width: `${width}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-12 text-right shrink-0">
                                {token.importance.toFixed(3)}
                              </span>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        )}


{/* Health Condition Flags */}
{/* Health Condition Flags */}
{data.healthFlags && data.healthFlags.length > 0 && (
  <Card className="border-border/60">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <User className="h-5 w-5 text-primary" />
        Personalised Health Alerts
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {data.healthFlags.map((flag, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/10 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs border-orange-500/30 text-orange-500"
            >
              {flag.label}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${severityColors[flag.severity]}`}
            >
              {flag.severity}
            </Badge>
          </div>
          {flag.found && flag.found.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Found: </span>
              {flag.found.join(', ')}
            </p>
          )}
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            {flag.message}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
)}
       
{/* Ingredient Interactions */}
<Card className={
  interactions.length > 0
    ? "border-border/60"
    : "border-border/60"
}>
  <CardHeader className="pb-3">
    <CardTitle className={`flex items-center gap-2 text-lg ${
      interactions.length > 0 ? 'text-red-500' : 'text-foreground'
    }`}>
      <GitBranch className="h-5 w-5" />
      Ingredient Interaction Knowledge Graph
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">

    {/* Knowledge Graph — always visible */}
    <div className="border border-border/60 rounded-xl p-4 bg-card">
      <KnowledgeGraph interactions={interactions} />
    </div>

    {/* Real interaction detail cards */}
    {interactions.length > 0 && (
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Detected Interactions
        </p>
        {interactions.map((interaction, idx) => (
  <div
    key={idx}
    className={`p-4 rounded-xl border space-y-2 ${
      interaction.relevant_for_user
        ? 'border-red-500/40 bg-red-500/15'
        : 'border-red-500/20 bg-red-500/10'
    }`}
  >
    {/* Health relevant badge */}
    {interaction.relevant_for_user && (
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs font-bold text-red-500 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/30">
          ⚠️ Especially risky for your health profile
        </span>
      </div>
    )}

    <div className="flex items-center gap-2 flex-wrap">
      <Badge
        variant="outline"
        className="text-xs border-red-500/30 text-red-400"
      >
        {interaction.ingredient1}
      </Badge>
      <span className="text-xs text-muted-foreground">+</span>
      <Badge
        variant="outline"
        className="text-xs border-red-500/30 text-red-400"
      >
        {interaction.ingredient2}
      </Badge>
      <span className="text-xs text-muted-foreground">→</span>
      <Badge
        variant="outline"
        className={`text-xs ${severityColors[interaction.severity]}`}
      >
        {interaction.severity}
      </Badge>
    </div>

    <p className="text-sm font-medium text-red-400">
      {interaction.interaction}
    </p>

    {/* Mechanism — plain english */}
    {interaction.mechanism && (
      <p className="text-xs text-muted-foreground leading-relaxed">
        {interaction.mechanism}
      </p>
    )}

    <p className="text-xs text-muted-foreground flex items-center gap-1">
      <Info className="h-3 w-3 shrink-0" />
      Source: {interaction.source}
    </p>
  </div>
))}
      </div>
    )}

    {/* No interactions message */}
    {interactions.length === 0 && (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          No dangerous interactions detected in this product
        </p>
      </div>
    )}

  </CardContent>
</Card>
        {/* Gemini Health Explanation */}
        {explanation && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-primary" />
                Health Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">
                    {explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Verified against FSSAI Advertising
                  & Claims Regulations 2018
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/history')}
                  className="gap-2"
                >
                  View History
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/scan')}
                  className="gap-2"
                >
                  <ScanLine className="h-4 w-4" />
                  Scan Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}