'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import LoginForm from './LoginForm'

export default function PhoenixLogin() {
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (isAdmin && dni === 'admin' && password === 'admin123') {
      router.push('/admin/dashboard')
      return
    }

    const { data } = await supabase
      .from('empleados')
      .select('*')
      .eq('dni', dni)
      .eq('password', password)
      .single()

    if (data) {
      localStorage.setItem('empleadoId', data.id)
      router.push('/empleado')
    } else {
      alert('❌ Credenciales incorrectas')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#000000] via-[#000000] to-[#4c180f] relative px-4 py-16 overflow-hidden">
      {/* Logo Fénix */}
      <img
        src="/fenix.png"
        alt="Logo Fénix"
        className="w-52 md:w-64 mb-8 z-10"
      />

      {/* Formulario */}
      <div className="w-full max-w-md bg-[#2d1616]/90 border border-[#ff4a1a]/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,60,0,0.1)] z-10 backdrop-blur-sm">
        <h1 className="text-white text-2xl font-bold text-center mb-6 tracking-wider">
          INICIAR SESIÓN
        </h1>

        <LoginForm
          dni={dni}
          setDni={setDni}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          isLoading={isLoading}
          handleLogin={handleLogin}
        />
      </div>

      {/* Fuego perfectamente fusionado */}
      <img
        src="/fuego-footer.png"
        alt="Fuego decorativo"
        className="absolute bottom-0 w-full max-h-48 object-cover opacity-40 mix-blend-normal brightness-110 pointer-events-none z-0"
      />
    </div>
  )
}
