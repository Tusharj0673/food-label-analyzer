import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  ShieldCheck,
  ScanLine,
  Brain,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  ChevronDown
} from 'lucide-react'

const features = [
  "FSSAI Compliance", "Claim Verification",
  "Ingredient Interactions", "Explainable AI",
  "Health Impact", "Knowledge Graph",
  "Gemini Vision", "NLP Powered",
  "Real-time Analysis", "Personalised Results"
]

const steps = [
  {
    icon:        ScanLine,
    title:       "Upload Label",
    description: "Take a photo of any Indian packaged food label and upload it instantly"
  },
  {
    icon:        ShieldCheck,
    title:       "AI Verification",
    description: "Our system checks every claim against FSSAI's exact legal thresholds automatically"
  },
  {
    icon:        Brain,
    title:       "Get Your Report",
    description: "Receive a detailed compliance report with personalised health impact explanation"
  }
]

const stats = [
  { value: "10+",  label: "FSSAI Rules Enforced" },
  { value: "5+",   label: "Interaction Checks"   },
  { value: "100%", label: "Regulation Backed"     },
  { value: "Free", label: "Always"                }
]

const sampleClaims = [
  {
    icon:   XCircle,
    color:  "text-red-500",
    bg:     "bg-red-500/10 dark:bg-red-500/10",
    lightBg:"bg-red-50",
    label:  "High Protein",
    note:   "3.2g declared — needs ≥10g"
  },
  {
    icon:   XCircle,
    color:  "text-red-500",
    bg:     "bg-red-500/10",
    lightBg:"bg-red-50",
    label:  "No Added Sugar",
    note:   "Contains maltodextrin"
  },
  {
    icon:   CheckCircle,
    color:  "text-green-500",
    bg:     "bg-green-500/10",
    lightBg:"bg-green-50",
    label:  "Low Sodium",
    note:   "118mg — within limit"
  },
  {
    icon:   AlertCircle,
    color:  "text-yellow-500",
    bg:     "bg-yellow-500/10",
    lightBg:"bg-amber-50",
    label:  "Health Drink",
    note:   "Illegal term — FSS Act 2006"
  }
]

export default function Landing() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-background to-background pointer-events-none" />

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <div className="space-y-8">

              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                AI-Powered Food Label Verification
              </span>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
                  Is Your{' '}
                  <span className="text-primary">Label</span>
                  <br />
                  Telling The
                  <br />
                  <span className="font-serif italic font-normal text-muted-foreground">
                    whole truth?
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                  LabelIQ verifies every health claim on Indian
                  packaged food labels against FSSAI regulations
                  — automatically, instantly, and for free.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/scan">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                  >
                    <ScanLine className="w-4 h-4" />
                    Try a Scan
                  </Button>
                </Link>
              </div>

              {/* Powered by */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Powered by:
                </span>
                {["FSSAI 2018", "Gemini AI", "BERT NLP"].map(
                  (badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground font-medium"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right — Sample Report */}
            <div className="relative">

              {/* Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50" />

              {/* Card */}
              <div className="relative border border-border bg-card rounded-2xl p-6 shadow-lg dark:shadow-none space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm text-foreground">
                      LabelIQ Analysis
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold border border-red-500/20">
                    CAUTION
                  </span>
                </div>

                <p className="text-sm text-muted-foreground border-t border-border pt-3">
                  ProteinMax Multigrain Biscuits
                </p>

                {/* Claims */}
                <div className="space-y-2">
                  {sampleClaims.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-2.5 rounded-xl ${item.bg}`}
                      >
                        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${item.color}`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Interaction Alert */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-500">
                      Dangerous Interaction Detected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      E211 + E300 → Benzene risk (IARC Group 1)
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Powered by Gemini + FSSAI Rules
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    3 violations found
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-2 mt-16 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">
              Scroll to learn more
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">

          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium">
              Simple Process
            </span>
            <h2 className="text-4xl font-bold text-foreground">
              How It{' '}
              <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three steps to know exactly what's in your food
              and whether the label is legally compliant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  className="border border-border bg-card rounded-2xl p-8 text-center space-y-4 hover:border-primary/40 hover:shadow-md dark:hover:shadow-none transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary text-sm font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features Marquee ── */}
      <section className="py-12 border-y border-border overflow-hidden">
        <p className="text-sm text-muted-foreground mb-6 text-center font-medium">
          Everything LabelIQ checks for you
        </p>
        <div className="relative overflow-hidden">
          <div className="flex w-max whitespace-nowrap animate-marquee">
            {[...features, ...features].map(
              (feature, idx) => (
                <div key={idx} className="shrink-0 px-8 py-2">
                  <span className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors cursor-default">
                    ✦ {feature}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="border border-border bg-card rounded-3xl p-12 text-center space-y-6 relative overflow-hidden shadow-lg dark:shadow-none">

            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />

            <div className="relative space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Stop Trusting.{' '}
                <span className="text-primary">
                  Start Verifying.
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Every label makes a promise. LabelIQ tells you
                whether that promise is legally valid under
                Indian food law — for free, instantly.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Start Scanning Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}