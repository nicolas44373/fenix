import { Eye, EyeOff, User, Lock, Shield, Flame } from 'lucide-react'

interface Props {
  dni: string
  setDni: (value: string) => void
  password: string
  setPassword: (value: string) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  isLoading: boolean
  handleLogin: () => void
}

export default function LoginForm({
  dni, setDni, password, setPassword,
  showPassword, setShowPassword,
  isAdmin, setIsAdmin, isLoading,
  handleLogin
}: Props) {
  return (
    <>
      <h2 className="text-2xl font-bold text-white text-center mb-8">
        INGRESA LAS CREDENCIALES
      </h2>

      {/* DNI */}
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

      {/* Password */}
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

      {/* Checkbox */}
      <div className="flex items-center mb-8 group cursor-pointer" onClick={() => setIsAdmin(!isAdmin)}>
        <div className="relative">
          <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} className="sr-only" />
          <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
            isAdmin ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-400' : 'border-white/40 bg-white/10'
          }`}>
            {isAdmin && (
              <Shield size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
        <label className="ml-3 text-white font-medium cursor-pointer group-hover:text-orange-300 transition-colors">
          (Admin)
        </label>
      </div>

      {/* Button */}
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center">
          <Flame className="mr-2 group-hover:animate-bounce" size={20} />
          {isLoading ? 'cargando...' : 'INGRESAR'}
          <Flame className="ml-2 group-hover:animate-bounce" size={20} />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </>
  )
}
