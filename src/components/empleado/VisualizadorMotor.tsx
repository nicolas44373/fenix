'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface MotorData {
  codigo: string
  nombre_cliente: string
  telefono: string
  cuil: string
  domicilio: string
  descripcion_trabajo: string
  componentes_recibidos: string
  observaciones: string
  fecha_estimada_entrega: string
  demora_estimacion_dias: number
  fecha_ingreso: string
  estado: string
}

interface MediaFile {
  name: string
  url: string
  type: string
}

export default function VisualizadorMotor() {
  const [codigoBusqueda, setCodigoBusqueda] = useState('')
  const [motorData, setMotorData] = useState<MotorData | null>(null)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buscarMotor = async () => {
    if (!codigoBusqueda.trim()) {
      setError('Ingrese un código de motor')
      return
    }

    setLoading(true)
    setError('')
    setMotorData(null)
    setMediaFiles([])

    try {
      // Buscar datos del motor
      const { data: motorData, error: motorError } = await supabase
        .from('motores')
        .select('*')
        .eq('codigo', codigoBusqueda.trim())
        .single()

      if (motorError) {
        if (motorError.code === 'PGRST116') {
          setError('No se encontró un motor con ese código')
        } else {
          throw motorError
        }
        return
      }

      setMotorData(motorData)

      // Buscar archivos multimedia
      try {
        const { data: files, error: filesError } = await supabase.storage
          .from('fenix')
          .list(codigoBusqueda.trim(), {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' }
          })

        if (!filesError && files && files.length > 0) {
          const mediaFilesWithUrls = await Promise.all(
            files
              .filter(file => file.name !== '.emptyFolderPlaceholder')
              .map(async (file) => {
                const { data: urlData } = supabase.storage
                  .from('fenix')
                  .getPublicUrl(`${codigoBusqueda.trim()}/${file.name}`)
                return {
                  name: file.name,
                  url: urlData.publicUrl,
                  type: file.metadata?.mimetype || 'unknown'
                }
              })
          )
          setMediaFiles(mediaFilesWithUrls)
        }
      } catch {
        // ignorar errores de storage
      }

    } catch {
      setError('Error al buscar la información del motor')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') buscarMotor()
  }

  function formatearFecha(fecha: string) {
    const soloFecha = fecha.split('T')[0]
    const date = new Date(soloFecha + 'T00:00:00')
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const imprimirInfo = () => window.print()
  const esImagen = (tipo: string) => tipo.startsWith('image/')
  const esVideo = (tipo: string) => tipo.startsWith('video/')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Consultar Motor</h1>
          <p className="text-gray-600">Busque información completa de un motor por su código</p>
        </div>

        {/* Buscador */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Motor
              </label>
              <input
                type="text"
                value={codigoBusqueda}
                onChange={e => setCodigoBusqueda(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: 0-0001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={buscarMotor}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Buscar
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* --- SOLO ESTO SE IMPRIME --- */}
        {motorData && (
          <div className="printable space-y-6 print:space-y-4">
            <div className="print:hidden flex justify-end">
              <button
                onClick={imprimirInfo}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H3a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                Imprimir
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden print:shadow-none print:border print:border-gray-300 print:rounded-none">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 print:bg-blue-800">
                <h2 className="text-xl font-semibold text-white print:text-lg">Motor #{motorData.codigo}</h2>
              </div>
              <div className="p-6 print:p-4 print:text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4 print:grid-cols-2">
                  {/* Datos del Cliente */}
                  <div className="space-y-4 print:space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 print:text-base print:pb-1">
                      Datos del Cliente
                    </h3>
                    <div className="space-y-3 print:space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Nombre:</span>
                        <p className="text-gray-800 font-medium">{motorData.nombre_cliente || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                        <p className="text-gray-800">{motorData.telefono || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">CUIL:</span>
                        <p className="text-gray-800 font-mono">{motorData.cuil || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Domicilio:</span>
                        <p className="text-gray-800">{motorData.domicilio || '-'}</p>
                      </div>
                    </div>
                  </div>
                  {/* Info del Trabajo */}
                  <div className="space-y-4 print:space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 print:text-base print:pb-1">
                      Información del Trabajo
                    </h3>
                    <div className="space-y-3 print:space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Fecha de Ingreso:</span>
                        <p className="text-gray-800">{formatearFecha(motorData.fecha_ingreso)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Fecha Estimada de Entrega:</span>
                        <p className="text-gray-800">{formatearFecha(motorData.fecha_estimada_entrega)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Demora Estimada:</span>
                        <p className="text-gray-800">{motorData.demora_estimacion_dias} días</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Estado:</span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium print:px-1 print:py-0 print:rounded ${
                          motorData.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          motorData.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                          motorData.estado === 'terminado' ? 'bg-green-100 text-green-800' :
                          motorData.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {motorData.estado.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mt-6 print:mt-3">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3 print:text-base print:pb-1 print:mb-2">
                    Descripción del Trabajo
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-2 print:border print:border-gray-300">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                      {motorData.descripcion_trabajo}
                    </p>
                  </div>
                </div>
                {/* Componentes Recibidos */}
                {motorData.componentes_recibidos && (
                  <div className="mt-6 print:mt-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3 print:text-base print:pb-1 print:mb-2">
                      Componentes Recibidos
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-2 print:border print:border-gray-300">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm">
                        {motorData.componentes_recibidos}
                      </p>
                    </div>
                  </div>
                )}
                {/* Observaciones */}
                {motorData.observaciones && (
                  <div className="mt-6 print:mt-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3 print:text-base print:pb-1 print:mb-2">
                      Observaciones
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-2 print:border print:border-gray-300">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm">
                        {motorData.observaciones}
                      </p>
                    </div>
                  </div>
                )}
                {/* Multimedia */}
                {mediaFiles.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden print:hidden mt-6">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                      <h2 className="text-xl font-semibold text-white">
                        Archivos Multimedia ({mediaFiles.length})
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mediaFiles.map((file, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                            {esImagen(file.type) ? (
                              <div className="aspect-video bg-gray-100">
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                  onError={e => (e.currentTarget.src = '')}
                                />
                              </div>
                            ) : esVideo(file.type) ? (
                              <div className="aspect-video bg-gray-100">
                                <video controls className="w-full h-full" preload="metadata">
                                  <source src={file.url} type={file.type} />
                                  Tu navegador no soporta video.
                                </video>
                              </div>
                            ) : (
                              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Archivo</p>
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Ver archivo completo
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          /* Ocultar todo excepto el contenido imprimible */
          body * {
            visibility: hidden !important;
          }
          
          .printable, .printable * {
            visibility: visible !important;
          }
          
          .printable {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: white !important;
          }

          /* Estilos específicos para impresión */
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          .print\\:bg-blue-800 {
            background-color: #1e40af !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .print\\:bg-gray-800 {
            background-color: #1f2937 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .print\\:bg-transparent {
            background-color: transparent !important;
          }
          
          .print\\:border {
            border: 1px solid #d1d5db !important;
          }
          
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          
          .print\\:p-4 {
            padding: 1rem !important;
          }
          
          .print\\:p-2 {
            padding: 0.5rem !important;
          }
          
          .print\\:px-4 {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:px-1 {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:pb-1 {
            padding-bottom: 0.25rem !important;
          }
          
          .print\\:mt-3 {
            margin-top: 0.75rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:gap-4 {
            gap: 1rem !important;
          }
          
          .print\\:gap-2 {
            gap: 0.5rem !important;
          }
          
          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          
          .print\\:space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .print\\:text-sm {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
          }
          
          .print\\:text-base {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1.125rem !important;
            line-height: 1.75rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }
          
          .print\\:rounded {
            border-radius: 0.25rem !important;
          }
          
          .print\\:w-8 {
            width: 2rem !important;
          }
          
          .print\\:h-8 {
            height: 2rem !important;
          }

          /* Asegurar colores en impresión */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}