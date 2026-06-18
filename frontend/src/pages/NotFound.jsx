import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ScanLine, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">

        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary opacity-30">
            404
          </h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The page you are looking for does not exist
            or has been moved. Let us get you back on track.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/scan')}
            className="gap-2"
          >
            <ScanLine className="h-4 w-4" />
            Scan a Label
          </Button>
        </div>

        {/* Decoration */}
        <p className="text-xs text-muted-foreground pt-4">
          LabelIQ — FSSAI Compliance Verification System
        </p>
      </div>
    </div>
  )
}