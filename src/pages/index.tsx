'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, Flame, User, Lock, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Flame {
  id: number;
  delay: number;
  duration: number;
  x: number;
  y: number;
}

export default function PhoenixLogin() {
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [flames, setFlames] = useState<Flame[]>([])
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    // Generate random flame particles
    const flameArray: Flame[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
    setFlames(flameArray)
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    
    // Simulate loading for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (isAdmin) {
      if (dni === 'admin' && password === 'admin123') {
        router.push('/admin/dashboard')
        return
      }
      alert('❌ Las llamas del Fénix rechazan estas credenciales de administrador')
      setIsLoading(false)
      return
    }

    // Real Supabase call
    const { data, error } = await supabase
      .from('empleados')
      .select('*')
      .eq('dni', dni)
      .eq('password', password)
      .single()

    if (data) {
      if (isClient) {
        localStorage.setItem('empleadoId', data.id) // ✅ guardamos el ID real
      }
      router.push('/empleado')
    } else {
      alert('❌ El Fénix no reconoce estas credenciales')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Flames */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {flames.map(flame => (
          <div
            key={flame.id}
            className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-70"
            style={{
              left: `${flame.x}%`,
              top: `${flame.y}%`,
              animation: `float ${flame.duration}s ease-in-out infinite`,
              animationDelay: `${flame.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-600 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-red-500 to-yellow-600 rounded-full opacity-15 animate-bounce"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-25 animate-ping"></div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Phoenix Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="text-8xl mb-4 relative">
              🔥
              <div className="absolute inset-0 text-8xl animate-pulse opacity-60">🔥</div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
              FÉNIX
            </h1>
            <p className="text-orange-200 text-sm font-medium tracking-wider">
             
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Card Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20 rounded-3xl"></div>
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center z-50">
              <div className="text-center">
                <div className="text-6xl animate-spin mb-4">🔥</div>
                <p className="text-orange-300 font-medium">El Fénix está renaciendo...</p>
              </div>
            </div>
          )}

          <div className="relative z-10">
            {/* Form Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              INGRESA LAS CREDENCIALES
            </h2>

            {/* DNI/Usuario Input */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="DNI o Usuario"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Admin Checkbox */}
            <div className="flex items-center mb-8 group cursor-pointer" onClick={() => setIsAdmin(!isAdmin)}>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-400' 
                    : 'border-white/40 bg-white/10'
                }`}>
                  {isAdmin && (
                    <Shield size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <label className="ml-3 text-white font-medium cursor-pointer group-hover:text-orange-300 transition-colors">
                Soy fenixero (Admin)
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Flame className="mr-2 group-hover:animate-bounce" size={20} />
                {isLoading ? 'Renaciendo...' : 'INGRESAR'}
                <Flame className="ml-2 group-hover:animate-bounce" size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-orange-200/60">
          <p className="text-sm">
            "De las cenizas del pasado, surge el futuro dorado"
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
    </div>
  )
}