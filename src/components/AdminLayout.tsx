'use client'
import Link from 'next/link'
import { LayoutDashboard, FileText, Users, DollarSign } from 'lucide-react'
import { useRouter } from 'next/router'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Facturas', href: '/admin/facturas', icon: FileText },
  { label: 'Empleados', href: '/admin/empleados', icon: Users },
  { label: 'Egresos', href: '/admin/egresos', icon: DollarSign },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Floating Fire Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-70 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Large Phoenix Silhouette */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <svg width="800" height="600" viewBox="0 0 800 600" className="text-orange-500">
            <path
              d="M400 50 C450 80, 500 120, 480 180 C520 200, 550 240, 530 280 C570 300, 600 340, 580 380 C620 400, 650 440, 630 480 C600 520, 550 540, 500 530 C480 570, 440 580, 400 560 C360 580, 320 570, 300 530 C250 540, 200 520, 170 480 C150 440, 180 400, 220 380 C200 340, 230 300, 270 280 C250 240, 280 200, 320 180 C300 120, 350 80, 400 50 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-80 backdrop-blur-xl bg-gradient-to-b from-orange-900/20 to-red-900/20 border-r border-orange-500/30 shadow-2xl">
        {/* Glowing border effect */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-60"></div>
        
        {/* Header with Phoenix Logo */}
        <div className="relative p-8 border-b border-orange-500/30">
          <div className="flex items-center space-x-4">
            {/* Animated Phoenix Icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
                  <path
                    d="M12 2 C14 3, 16 5, 15 8 C17 9, 18 11, 17 13 C19 14, 20 16, 19 18 C18 20, 16 21, 14 20 C13 22, 11 22, 10 20 C8 21, 6 20, 5 18 C4 16, 6 14, 8 13 C7 11, 8 9, 10 8 C9 5, 11 3, 12 2 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-12 h-12 bg-orange-400 rounded-full blur-md opacity-40 animate-pulse"></div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Admin Fénix
              </h1>
              <p className="text-orange-300/80 text-sm">Panel de Control</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3">
          {navItems.map((item, index) => {
            const isActive = router.pathname === item.href
            return (
              <Link key={item.href} href={item.href} passHref>
                <div
                  className={`group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 text-white shadow-lg shadow-orange-500/25 border border-orange-500/50' 
                      : 'text-orange-100/80 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-r-full"></div>
                  )}
                  
                  {/* Icon with glow */}
                  <div className="relative">
                    <item.icon className={`h-6 w-6 mr-4 transition-all duration-300 ${
                      isActive ? 'text-orange-300' : 'text-orange-200/70 group-hover:text-orange-300'
                    }`} />
                    {isActive && (
                      <div className="absolute inset-0 h-6 w-6 mr-4 bg-orange-400 blur-sm opacity-30"></div>
                    )}
                  </div>
                  
                  <span className={`font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Hover flame effect */}
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-900/30 to-transparent">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-gradient-to-t from-orange-600 to-red-400 rounded-full opacity-60 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative z-10 flex-1 backdrop-blur-sm bg-gradient-to-br from-slate-900/60 to-purple-900/40">
        <div className="p-8 h-full">
          {/* Content wrapper with subtle glow */}
          <div className="h-full bg-slate-800/40 backdrop-blur-md rounded-2xl border border-orange-500/20 shadow-2xl p-8 relative overflow-hidden">
            {/* Subtle corner flames */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-500/10 to-transparent rounded-tr-full"></div>
            
            {children}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.1) scaleX(0.9); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-flame {
          animation: flame 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}