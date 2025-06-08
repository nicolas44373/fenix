'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

export default function EmpleadoMotorForm() {
  const [empleadoId, setEmpleadoId] = useState<string | null>(null)
  const [empleadoValido, setEmpleadoValido] = useState(true)

  const [nombreCliente, setNombreCliente] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cuil, setCuil] = useState('')
  const [domicilio, setDomicilio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [componentes, setComponentes] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [fechaEstimada, setFechaEstimada] = useState('')
  const [demora, setDemora] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem('empleadoId')
    if (!id) {
      console.warn('❌ ID de empleado no encontrado en localStorage')
      setEmpleadoValido(false)
    } else {
      setEmpleadoId(id)
      setEmpleadoValido(true)
    }
  }, [])

  const handleSubmit = async () => {
    if (!empleadoId) {
      alert('Error: No se ha proporcionado el ID del empleado.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from('motores').insert([
        {
          nombre_cliente: nombreCliente,
          telefono,
          cuil,
          domicilio,
          descripcion_trabajo: descripcion,
          componentes_recibidos: componentes,
          observaciones,
          fecha_estimada_entrega: fechaEstimada,
          demora_estimacion_dias: demora,
          empleado_id: empleadoId,
        },
      ])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      alert('Error al registrar el motor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNombreCliente('')
    setTelefono('')
    setCuil('')
    setDomicilio('')
    setDescripcion('')
    setComponentes('')
    setObservaciones('')
    setFechaEstimada('')
    setDemora(0)
  }

  if (!empleadoValido) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        ❌ Error: No se encontró un ID de empleado válido. Inicie sesión nuevamente.
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ingreso de Motor</h1>
          <p className="text-gray-600">Complete los datos del motor y cliente</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Datos del Cliente y Motor</h2>
          </div>

          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-800 font-medium">Motor registrado correctamente</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Client Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre del Cliente</label>
                    <input
                      type="text"
                      placeholder="Ingrese el nombre completo"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="Ej: +54 9 11 1234-5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Domicilio</label>
                    <input
                      type="text"
                      placeholder="Dirección completa del cliente"
                      value={domicilio}
                      onChange={(e) => setDomicilio(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Motor Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  Información del Motor
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Descripción del Trabajo</label>
                    <textarea
                      placeholder="Detalle el trabajo a realizar en el motor..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Componentes Recibidos</label>
                    <textarea
                      placeholder="Liste los componentes y partes recibidas..."
                      value={componentes}
                      onChange={(e) => setComponentes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Observaciones</label>
                    <textarea
                      placeholder="Observaciones adicionales, estado del motor, etc..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Information Section */}
              {/* Schedule Information Section */}
<div>
  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Programación de Entrega
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Demora Estimada (días)</label>
      <input
        type="number"
        placeholder="0"
        value={demora}
        onChange={(e) => {
          const dias = parseInt(e.target.value) || 0
          setDemora(dias)

          // Calcular nueva fecha estimada
          const hoy = new Date()
          const nuevaFecha = new Date(hoy)
          nuevaFecha.setDate(hoy.getDate() + dias)

          // Formatear como yyyy-MM-dd
          const yyyy = nuevaFecha.getFullYear()
          const mm = String(nuevaFecha.getMonth() + 1).padStart(2, '0')
          const dd = String(nuevaFecha.getDate()).padStart(2, '0')
          setFechaEstimada(`${yyyy}-${mm}-${dd}`)
        }}
        min="0"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
      <input
        type="date"
        value={fechaEstimada}
        readOnly
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
      />
    </div>
  </div>
</div>

                
              
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="flex-1">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !nombreCliente.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Registrar Motor
                    </div>
                  )}
                </Button>
              </div>
              <button
                onClick={resetForm}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}