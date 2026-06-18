import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  History as HistoryIcon,
  ScanLine,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FlaskConical,
  Zap,
  Calendar,
  User
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '@/api/axios'

// ── Config ────────────────────────────────────
const SCANS_PER_PAGE = 10

const verdictConfig = {
  SAFE: {
    label:  'All Clear',
    color:  'text-green-600 dark:text-green-500',
    bg:     'bg-green-100 dark:bg-green-500/10',
    border: 'border-green-300 dark:border-green-500/30',
    icon:   ShieldCheck
  },
  CAUTION: {
    label:  'Caution',
    color:  'text-yellow-700 dark:text-yellow-500',
    bg:     'bg-yellow-100 dark:bg-yellow-500/10',
    border: 'border-yellow-300 dark:border-yellow-500/30',
    icon:   AlertTriangle
  },
  VIOLATIONS_FOUND: {
    label:  'Violations Found',
    color:  'text-red-600 dark:text-red-500',
    bg:     'bg-red-100 dark:bg-red-500/10',
    border: 'border-red-300 dark:border-red-500/30',
    icon:   XCircle
  }
}

const filters = [
  { id: 'all',              label: 'All Scans'  },
  { id: 'SAFE',             label: 'Safe'        },
  { id: 'CAUTION',          label: 'Caution'     },
  { id: 'VIOLATIONS_FOUND', label: 'Violations'  },
]

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  })
}
// ── Clean Pagination Algorithm ────────────────
const getPageNumbers = (currentPage, totalPages) => {
  // If 7 or fewer pages — show all, no ellipsis needed
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = []

  // Always show first page
  pages.push(1)

  // Left ellipsis — show if current is far from start
  if (currentPage > 3) {
    pages.push('...')
  }

  // Pages around current
  const rangeStart = Math.max(2, currentPage - 1)
  const rangeEnd   = Math.min(totalPages - 1, currentPage + 1)

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Right ellipsis — show if current is far from end
  if (currentPage < totalPages - 2) {
    pages.push('...')
  }

  // Always show last page
  pages.push(totalPages)

  return pages
}
export default function History() {
  const navigate = useNavigate()

  const [scans, setScans]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchHistory()
  }, [])

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const fetchHistory = async () => {
    try {
      const response = await api.get('/scan/history')
      setScans(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login')
        return
      }
      toast.error('Could not load scan history')
    } finally {
      setLoading(false)
    }
  }

  // ── Derived data ──────────────────────────────

  const filteredScans = filter === 'all'
    ? scans
    : scans.filter(
        s => s.results?.overallVerdict === filter
      )

  const totalPages  = Math.ceil(
    filteredScans.length / SCANS_PER_PAGE
  )

  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * SCANS_PER_PAGE,
    currentPage * SCANS_PER_PAGE
  )

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top of page list smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Loading ───────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading your scan history...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[90vh] py-12 px-4">
      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-background to-background pointer-events-none" />

      <div className="max-w-3xl mx-auto relative space-y-8">

        {/* ── Header ── */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium">
            <HistoryIcon className="h-4 w-4" />
            Scan History
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Your Scans
          </h1>
          <p className="text-muted-foreground">
            All your previous food label analyses
          </p>
        </div>

        {/* ── Stats Row ── */}
        {scans.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Scans',
                value: scans.length,
                color: 'text-primary'
              },
              {
                label: 'Safe Products',
                value: scans.filter(
                  s => s.results?.overallVerdict === 'SAFE'
                ).length,
                color: 'text-green-600 dark:text-green-500'
              },
              {
                label: 'Violations',
                value: scans.filter(
                  s => s.results?.overallVerdict === 'VIOLATIONS_FOUND'
                ).length,
                color: 'text-red-600 dark:text-red-500'
              },
              {
                label: 'Research Scans',
                value: scans.filter(
                  s => s.mode === 'research'
                ).length,
                color: 'text-violet-600 dark:text-violet-400'
              }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="border border-border bg-card rounded-2xl p-4 text-center shadow-sm dark:shadow-none"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter Tabs ── */}
        {scans.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  filter === f.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-card text-foreground hover:border-primary/40'
                }`}
              >
                {f.label}
                {f.id !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({scans.filter(
                      s => s.results?.overallVerdict === f.id
                    ).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Scan List ── */}
        {paginatedScans.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <ScanLine className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {filter === 'all'
                  ? 'No scans yet'
                  : `No ${filter.toLowerCase().replace('_', ' ')} scans`
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === 'all'
                  ? 'Start scanning food labels to see your history here'
                  : 'Try a different filter'
                }
              </p>
            </div>
            {filter === 'all' && (
              <Button
                onClick={() => navigate('/scan')}
                className="gap-2"
              >
                <ScanLine className="h-4 w-4" />
                Scan Your First Label
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">

            {/* Page info */}
            {filteredScans.length > SCANS_PER_PAGE && (
              <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                <span>
                  Showing{' '}
                  <span className="font-medium text-foreground">
                    {(currentPage - 1) * SCANS_PER_PAGE + 1}–
                    {Math.min(
                      currentPage * SCANS_PER_PAGE,
                      filteredScans.length
                    )}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium text-foreground">
                    {filteredScans.length}
                  </span>
                  {' '}scans
                </span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}

            {/* Scan cards */}
            {paginatedScans.map(scan => {
              const verdict = scan.results?.overallVerdict
                || 'SAFE'
              const config  = verdictConfig[verdict]
                || verdictConfig.SAFE
              const Icon         = config.icon
              const claims       = scan.results?.claims || []
              const violations   = claims.filter(
                c => c.verdict !== 'VERIFIED'
              ).length
              const interactions = scan.results?.interactions
                ?.length || 0

              return (
                <div
                  key={scan._id}
                  onClick={() => navigate(`/results/${scan._id}`)}
                  className="group border border-border bg-card rounded-2xl p-5 hover:border-primary/40 hover:shadow-md dark:hover:shadow-none transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">

                      {/* Verdict icon */}
                      <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {scan.productName || 'Unknown Product'}
                        </p>

                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(scan.scanDate)}
                          </span>

                          {scan.healthProfile &&
                           scan.healthProfile !== 'none' && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {scan.healthProfile.replace(/_/g, ' ')}
                            </span>
                          )}

                          {scan.mode === 'research' ? (
                            <span className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-medium">
                              <FlaskConical className="h-3 w-3" />
                              Research
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500 font-medium">
                              <Zap className="h-3 w-3" />
                              Production
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs ${config.color} border-current`}
                          >
                            {config.label}
                          </Badge>
                          {violations > 0 && (
                            <Badge
                              variant="outline"
                              className="text-xs text-red-600 dark:text-red-500 border-red-300 dark:border-red-500/30"
                            >
                              {violations} violation{violations > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {interactions > 0 && (
                            <Badge
                              variant="outline"
                              className="text-xs text-orange-600 dark:text-orange-500 border-orange-300 dark:border-orange-500/30"
                            >
                              {interactions} interaction{interactions > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </div>
              )
            })}

            {/* ── Pagination ── */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 pt-4">

    {/* Previous */}
    <Button
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="gap-1.5 h-9"
    >
      <ChevronLeft className="h-4 w-4" />
      Previous
    </Button>

    {/* Page Numbers — clean algorithm */}
    <div className="flex items-center gap-1">
      {getPageNumbers(currentPage, totalPages).map(
        (page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground select-none"
              >
                ···
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {page}
            </button>
          )
        }
      )}
    </div>

    {/* Next */}
    <Button
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="gap-1.5 h-9"
    >
      Next
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
)}
          </div>
        )}

        {/* ── Scan Again ── */}
        {scans.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => navigate('/scan')}
              className="gap-2"
            >
              <ScanLine className="h-4 w-4" />
              Scan Another Label
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}