import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ScanLine,
  FlaskConical,
  Image as ImageIcon,
  ShieldCheck,
  Brain,
  BarChart2,
  GitBranch,
  Sparkles,
  Info,
  Cpu
} from 'lucide-react'

// ── Image paths ───────────────────────────────
const LABEL_IMAGES = [
  {
    src:   '/demo/label-front.jpg',
    title: 'Front Label',
    desc:  'Health claims panel — product name and marketing claims'
  },
  {
    src:   '/demo/label-nutrition.jpg',
    title: 'Nutrition Table',
    desc:  'Nutrition facts per 100ml — protein, fat, sugar, sodium, fibre'
  },
  {
    src:   '/demo/label-ingredients.jpg',
    title: 'Ingredients List',
    desc:  'Complete ingredients including additives and E-numbers'
  },
]

const RESULT_IMAGES = [
  {
    src:   '/demo/result-verdict.png',
    title: 'Overall Verdict & BERT Claim Classification',
    icon:  ShieldCheck,
    color: 'text-green-500',
    desc:  'Product compliance verdict with verified and violation counts , Zero-shot BERT model categorises each marketing claim by type'
  },
  {
    src:   '/demo/result-bert.png',
    title: 'FSSAI Compliance Check & SHAP Explainability',
    icon:  BarChart2,
    color: 'text-blue-500',
    desc:  'Per-claim verdict against FSSAI Schedule I legal thresholds , Token importance scores showing why each claim was classified'
  },
  {
    src:   '/demo/result-graph.png',
    title: 'Knowledge Graph',
    icon:  GitBranch,
    color: 'text-primary',
    desc:  'Per-claim verdict against FSSAI Schedule I legal thresholds'
  },
  {
    src:   '/demo/result-gemini3.png',
    title: 'Gemini Personalised Recommendation',
    icon:  Brain,
    color: 'text-orange-500',
    desc:  'Gemini gives a health profile recommendation.'
  },
]

function ImageCard({ src, title, desc, icon: Icon, color, isFullWidth }) {
  return (
    <div className="border border-border/60 bg-card rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:border-primary/40 hover:shadow-md transition-all duration-200 w-full">
      {/* Image Container with explicit boundary configurations */}
      <div 
        className={`relative bg-muted overflow-hidden w-full flex items-center justify-center ${
          isFullWidth ? 'max-h-120 h-auto aspect-video' : 'aspect-video'
        }`}
      >
        <img
          src={src}
          alt={title}
          // Changed object-cover to object-contain for high-res dashboard screenshot mockups
          // and restricted max-height to completely terminate parent box spillover issues
          className="w-full h-full max-h-full object-contain md:object-cover object-top"
          onError={e => {
            e.target.style.display = 'none'
            e.target.parentNode.querySelector('.fallback').style.display = 'flex'
          }}
        />
        {/* Fallback placeholder */}
        <div
          className="fallback absolute inset-0 hidden items-center justify-center flex-col gap-2 bg-muted"
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            Add screenshot to public/demo/
          </p>
        </div>
      </div>

      {/* Label */}
      <div className="p-4 space-y-1 bg-card">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className={`h-4 w-4 shrink-0 ${color || 'text-primary'}`} />
          )}
          <p className="font-semibold text-sm text-foreground">
            {title}
          </p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function DemoResults() {
  const navigate = useNavigate()

  const firstResult = RESULT_IMAGES[0]
  const middleResults = RESULT_IMAGES.slice(1, -1)
  const lastResult = RESULT_IMAGES[RESULT_IMAGES.length - 1]

  return (
    <div className="min-h-[90vh] py-12 px-4 relative">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-background to-background pointer-events-none" />

      <div className="max-w-5xl mx-auto relative space-y-10">

        {/* Back Button */}
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
            <FlaskConical className="h-4 w-4" />
            Research Mode — Sample Results
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            What LabelIQ Detects
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            This page shows a real analysis performed on an Indian
            packaged food product using LabelIQ's full Research Mode
            pipeline — BERT, FSSAI Rule Engine, Knowledge Graph,
            SHAP, and Gemini AI.
          </p>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              About This Demo
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
              The product scanned was an Appy Fizz. Three separate
              photos were uploaded — front panel, nutrition table,
              and ingredients list — for maximum accuracy.
              The analysis ran in Research Mode using all 6 AI models.
            </p>
          </div>
        </div>

        {/* ── Section 1: Input Images ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Step 1 — Label Images Used
              </h2>
              <p className="text-sm text-muted-foreground">
                Three images uploaded for maximum extraction accuracy
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {LABEL_IMAGES.map((img, idx) => (
              <ImageCard
                key={idx}
                src={img.src}
                title={img.title}
                desc={img.desc}
                isFullWidth={false}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground font-medium">
            <Cpu className="h-3 w-3" />
            AI Pipeline Processed
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Pipeline steps badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Gemini Vision OCR",
            "BERT Zero-Shot",
            "FSSAI Rule Engine",
            "NetworkX Knowledge Graph",
            "SHAP Explainability",
            "Gemini Health Explanation"
          ].map((step, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5"
            >
              {i + 1}. {step}
            </Badge>
          ))}
        </div>

        {/* ── Section 2: Result Screenshots ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Step 2 — Analysis Results
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete compliance report generated by LabelIQ
              </p>
            </div>
          </div>

          {/* First result full width */}
          {firstResult && (
            <ImageCard
              src={firstResult.src}
              title={firstResult.title}
              icon={firstResult.icon}
              color={firstResult.color}
              desc={firstResult.desc}
              isFullWidth={true}
            />
          )}

          {/* Middle results mapped in a stable 2-column layout */}
          <div className="grid sm:grid-cols-2 gap-5">
            {middleResults.map((img, idx) => (
              <ImageCard
                key={idx}
                src={img.src}
                title={img.title}
                icon={img.icon}
                color={img.color}
                desc={img.desc}
                isFullWidth={false}
              />
            ))}
          </div>

          {/* Last result full width layout constrained perfectly to baseline */}
          {lastResult && (
            <ImageCard
              src={lastResult.src}
              title={lastResult.title}
              icon={lastResult.icon}
              color={lastResult.color}
              desc={lastResult.desc}
              isFullWidth={true}
            />
          )}
        </div>

        {/* ── Key Findings ── */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Key Findings From This Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Product Scanned",
                  value: "Appy Fizz — Apple Flavoured Sparkling Drink",
                  color: "text-blue-500"
                },
                {
                  label: "Overall Verdict",
                  value: "All Clear — 0 verified, 1 violation, 2 interactions detected",
                  color: "text-green-500"
                },
                {
                  label: "FSSAI Result",
                  value: "\"Apple Flavoured Sparkling Drink\" — UNSUBSTANTIATED (MEDIUM severity)",
                  color: "text-orange-500"
                },
                {
                  label: "Dangerous Interactions",
                  value: "E211 + E300 → Forms Benzene (CRITICAL) — WHO 2005 / IARC Group 1 carcinogen",
                  color: "text-red-500"
                },
                {
                  label: "BERT Classification",
                  value: "\"Apple Flavoured Sparkling Drink\" → Composition Claim at 30% confidence",
                  color: "text-blue-500"
                },
                {
                  label: "SHAP Insight",
                  value: "\"Sparkling\" scored 0.503 importance — highest influence on BERT classification",
                  color: "text-orange-500"
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color.replace('text-', 'bg-')}`} />
                  <div>
                    <p className={`text-xs font-semibold ${item.color}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 py-4">
          <p className="text-muted-foreground text-sm">
            Want to run your own scan? Register and try it live.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="gap-2"
            >
              <ScanLine className="h-4 w-4" />
              Get Started Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}