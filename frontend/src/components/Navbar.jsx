import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import {
//   Sun,
//   Moon,
//   ScanLine,
//   History,
//   User,
//   LogOut,
//   Menu,
//   X,
//   ShieldCheck
// } from 'lucide-react'
import {
  Sun, Moon, ScanLine, History, User,
  LogOut, Menu, X, ShieldCheck,
  Home, FlaskConical           // ← add these two
} from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.clear()
    setMobileOpen(false)
    navigate('/login')
  }

const navLinks = [
  { label: 'Home',    href: '/',       icon: Home      },
  { label: 'Scan',    href: '/scan',   icon: ScanLine  },
  { label: 'History', href: '/history',icon: History   },
  { label: 'Demo',    href: '/demo',   icon: FlaskConical },
]

  const isActive = (href) => location.pathname === href

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
<Link
  to="/"
  className="flex items-center gap-2.5 font-bold text-xl"
>
  <div
    style={{
      width:           '2rem',
      height:          '2rem',
      borderRadius:    '0.5rem',
      background:      theme === 'dark'
        ? 'hsl(142 65% 44%)'      /* bright green in dark */
        : 'hsl(142 65% 28%)',     /* rich dark green in light */
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      flexShrink:      0,
      boxShadow:       theme === 'dark'
        ? '0 0 0 1px rgba(255,255,255,0.1)'
        : '0 0 0 1.5px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.1)'
    }}
  >
    <ShieldCheck
      style={{
        width:  '1rem',
        height: '1rem',
        color:  '#ffffff',
        strokeWidth: 2.5
      }}
    />
  </div>
  <span
    style={{
      color:       theme === 'dark'
        ? 'hsl(210 35% 95%)'
        : 'hsl(220 40% 8%)',
      letterSpacing: '-0.02em',
      fontWeight:    700
    }}
  >
    LabelIQ
  </span>
</Link>

          {/* Desktop Nav */}
          {token && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon
                const active = isActive(link.href)

                return (
                  <Link key={link.href} to={link.href}>
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Theme */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </Button>

            {token ? (
              <>
                {/* Desktop Avatar */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/30">
                        {/* <AvatarFallback className="bg-primary text-white font-semibold"> */}
                        <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>

                    {/* <DropdownMenuContent
                      align="end"
                      className="w-56"
                    > */}
                    <DropdownMenuContent
  align="end"
  className="w-56 bg-card border border-border shadow-lg"
>
                      {/* User Info */}
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium text-foreground">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>

                      <DropdownMenuItem
                        onClick={() => navigate('/profile')}
                        className="gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => navigate('/history')}
                        className="gap-2"
                      >
                        <History className="h-4 w-4" />
                        History
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="gap-2 text-red-500 focus:text-red-500"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(!mobileOpen)}
                  >
                    {mobileOpen
                      ? <X className="h-5 w-5" />
                      : <Menu className="h-5 w-5" />
                    }
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-3 space-y-2">
            {token ? (
              <>
                <div className="px-2">
                  <p className="text-sm font-medium">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>

                {navLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  )
                })}

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2 px-2">
                <Link to="/login">
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}