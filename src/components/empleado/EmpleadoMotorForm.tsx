'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ClienteSection from './ClienteSection'
import MotorSection from './MotorSection'
import EntregaSection from './EntregaSection'
import SuccessMessage from './SuccessMessage'
import MediaUploadMotor from './MediaUploadMotor'
import VisualizadorMotor from './VisualizadorMotor'

export default function EmpleadoMotorForm() {
  const [empleadoId, setEmpleadoId] = useState<string | null>(null)
  const [empleadoValido, setEmpleadoValido] = useState(true)
  const [vistaActual, setVistaActual] = useState<'formulario' | 'consultar'>('formulario')

  const [formData, setFormData] = useState({
    nombreCliente: '',
    telefono: '',
    cuil: '',
    domicilio: '',
    descripcion: '',
    componentes: '',
    observaciones: '',
    fechaEstimada: '',
    demora: 0,
    codigo: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loadingCodigo, setLoadingCodigo] = useState(false)
  
  // Estado para los archivos multimedia
  const [mediaFiles, setMediaFiles] = useState<File[]>([])

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

  // ✅ Función mejorada para obtener el próximo código
  const obtenerProximoCodigo = async () => {
    setLoadingCodigo(true)
    try {
      console.log('🔄 Obteniendo próximo código...')
      
      // Método 1: Intentar usar la función RPC
      const { data, error } = await supabase.rpc('obtener_proximo_codigo_motor')
      
      if (!error && data) {
        console.log('✅ Código obtenido via RPC:', data)
        return data
      }
      
      console.warn('⚠️ RPC falló, usando método alternativo:', error)
      
      // Método 2: Fallback - consultar directamente la tabla
      const { data: motores, error: queryError } = await supabase
        .from('motores')
        .select('codigo')
        .like('codigo', '0-%')
        .order('codigo', { ascending: false })
        .limit(1)
      
      if (queryError) {
        console.error('Error en consulta alternativa:', queryError)
        return '0-0001' // Último fallback
      }
      
      let proximoNumero = 1
      
      if (motores && motores.length > 0) {
        const ultimoCodigo = motores[0].codigo
        if (ultimoCodigo && ultimoCodigo.includes('-')) {
          const numero = parseInt(ultimoCodigo.split('-')[1])
          if (!isNaN(numero)) {
            proximoNumero = numero + 1
          }
        }
      }
      
      const nuevoCodigo = `0-${String(proximoNumero).padStart(4, '0')}`
      console.log('✅ Código generado via fallback:', nuevoCodigo)
      return nuevoCodigo
      
    } catch (error) {
      console.error('Error crítico en obtenerProximoCodigo:', error)
      return '0-0001'
    } finally {
      setLoadingCodigo(false)
    }
  }

  // ✅ Efecto mejorado para cargar el código inicial
  useEffect(() => {
    if (empleadoId && vistaActual === 'formulario' && !formData.codigo) {
      console.log('🚀 Cargando código inicial...')
      obtenerProximoCodigo().then(codigo => {
        console.log('✅ Código inicial obtenido:', codigo)
        setFormData(prev => ({ ...prev, codigo }))
      }).catch(error => {
        console.error('Error al cargar código inicial:', error)
        setFormData(prev => ({ ...prev, codigo: '0-0001' }))
      })
    }
  }, [empleadoId, vistaActual, formData.codigo])

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const resetForm = async () => {
    console.log('🔄 Reseteando formulario y obteniendo nuevo código...')
    const nuevoCodigo = await obtenerProximoCodigo()
    
    setFormData({
      nombreCliente: '',
      telefono: '',
      cuil: '',
      domicilio: '',
      descripcion: '',
      componentes: '',
      observaciones: '',
      fechaEstimada: '',
      demora: 0,
      codigo: nuevoCodigo,
    })
    
    // Limpiar archivos multimedia
    setMediaFiles([])
  }

  // Función para subir archivos multimedia
  const uploadMediaFiles = async (motorCodigo: string) => {
    if (mediaFiles.length === 0) return true

    try {
      const uploadPromises = mediaFiles.map(async (file) => {
        const filePath = `${motorCodigo}/${Date.now()}_${file.name}`
        const { error } = await supabase.storage
          .from('fenix')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          })
        
        if (error) {
          console.error(`Error al subir ${file.name}:`, error)
          throw error
        }
        
        return filePath
      })

      await Promise.all(uploadPromises)
      console.log(`✅ ${mediaFiles.length} archivos subidos correctamente`)
      return true
    } catch (error) {
      console.error('Error al subir archivos:', error)

      // ✅ Fix del error de tipo unknown
      if (error instanceof Error && error.message.includes('Bucket not found')) {
        alert('⚠️ Motor registrado exitosamente, pero el almacenamiento de archivos no está configurado. Contacte al administrador para configurar Supabase Storage.')
        return false
      }

      return false
    }
  }

  const handleSubmit = async () => {
    if (!empleadoId) {
      alert('Error: No se ha proporcionado el ID del empleado.')
      return
    }

    setIsLoading(true)
    try {
      console.log('💾 Guardando motor con código:', formData.codigo)
      
      // Registrar el motor en la base de datos (sin código, se auto-genera)
      const { data, error } = await supabase.from('motores').insert([{
        nombre_cliente: formData.nombreCliente,
        telefono: formData.telefono,
        cuil: formData.cuil,
        domicilio: formData.domicilio,
        descripcion_trabajo: formData.descripcion,
        componentes_recibidos: formData.componentes,
        observaciones: formData.observaciones,
        fecha_estimada_entrega: formData.fechaEstimada,
        demora_estimacion_dias: formData.demora,
        empleado_id: empleadoId,
        // NO enviar código, se genera automáticamente en el trigger
      }]).select('codigo')

      if (error) throw error

      const motorCodigo = data[0]?.codigo
      console.log('✅ Motor registrado con código:', motorCodigo)

      // Subir archivos multimedia si los hay
      if (mediaFiles.length > 0) {
        const uploadSuccess = await uploadMediaFiles(motorCodigo)
        if (!uploadSuccess) {
          alert('Motor registrado, pero hubo errores al subir algunos archivos multimedia')
        }
      }
      
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

  const regenerarCodigo = async () => {
    console.log('🔄 Regenerando código...')
    const nuevoCodigo = await obtenerProximoCodigo()
    setFormData(prev => ({ ...prev, codigo: nuevoCodigo }))
  }

  if (!empleadoValido) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        ❌ Error: No se encontró un ID de empleado válido. Inicie sesión nuevamente.
      </div>
    )
  }

  // Si está en vista de consultar, mostrar el visualizador
  if (vistaActual === 'consultar') {
    return (
      <div>
        {/* Navegación */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setVistaActual('formulario')}
            className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20 px-4 py-2 rounded-lg text-gray-700 hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Formulario
          </button>
        </div>
        <VisualizadorMotor />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Navegación superior */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Ingreso de Motor</h1>
            <p className="text-gray-600">Complete los datos del motor y cliente</p>
          </div>
          
          {/* Botón para consultar motores */}
          <button
            onClick={() => setVistaActual('consultar')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Consultar Motor
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Datos del Cliente y Motor</h2>
          </div>

          <div className="p-8 space-y-8">
            {success && <SuccessMessage />}

            {/* Número de motor con opción de regenerar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Número de Motor</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={loadingCodigo ? 'Generando...' : formData.codigo || 'Cargando...'}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600 font-mono"
                />
                <button
                  onClick={regenerarCodigo}
                  disabled={loadingCodigo || isLoading}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Regenerar código"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Este código se genera automáticamente y es único para cada motor
              </p>
            </div>

            <ClienteSection formData={formData} onChange={handleChange} />
            <MotorSection formData={formData} onChange={handleChange} />
            <EntregaSection formData={formData} onChange={handleChange} />
            <MediaUploadMotor 
              mediaFiles={mediaFiles} 
              setMediaFiles={setMediaFiles}
            />

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !formData.nombreCliente.trim() || loadingCodigo}
                className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando motor y archivos...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Registrar Motor {mediaFiles.length > 0 && `(${mediaFiles.length} archivos)`}
                  </div>
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={isLoading || loadingCodigo}
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