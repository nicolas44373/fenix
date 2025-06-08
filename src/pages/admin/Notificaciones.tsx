'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format, differenceInDays, parseISO } from 'date-fns'

interface Motor {
  id: string
  nombre_cliente: string
  descripcion_trabajo: string
  fecha_estimada_entrega: string | null
  estado: string | null
}

export function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Motor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMotores = async () => {
      const { data, error } = await supabase
        .from('motores')
        .select('id, nombre_cliente, descripcion_trabajo, fecha_estimada_entrega, estado')
        .neq('estado', 'Completado')
        .order('fecha_estimada_entrega', { ascending: true })

      if (error) {
        console.error('Error al obtener motores:', error)
        setLoading(false)
        return
      }

      const hoy = new Date()

      const proximos = (data || []).filter((motor) => {
        if (!motor.fecha_estimada_entrega || isNaN(Date.parse(motor.fecha_estimada_entrega))) return false
        const entrega = parseISO(motor.fecha_estimada_entrega)
        const dias = differenceInDays(entrega, hoy)
        return dias <= 2
      })

      setNotificaciones(proximos)
      setLoading(false)
    }

    fetchMotores()
  }, [])

  const getPriorityColor = (fecha: string | null) => {
    if (!fecha || isNaN(Date.parse(fecha))) return 'bg-gray-400'
    const entrega = parseISO(fecha)
    const hoy = new Date()
    
    // Normalizar las fechas a medianoche para comparación exacta
    const entregaNormalizada = new Date(entrega.getFullYear(), entrega.getMonth(), entrega.getDate())
    const hoyNormalizada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    
    const dias = differenceInDays(entregaNormalizada, hoyNormalizada)
    
    if (dias < 0) return 'bg-red-500 animate-pulse' // Vencido
    if (dias === 0) return 'bg-orange-500 animate-pulse' // Hoy
    if (dias === 1) return 'bg-yellow-500' // Mañana
    return 'bg-blue-500' // 2 días
  }

  const getPriorityText = (fecha: string | null) => {
    if (!fecha || isNaN(Date.parse(fecha))) return 'Sin fecha'
    const entrega = parseISO(fecha)
    const hoy = new Date()
    
    // Normalizar las fechas a medianoche para comparación exacta
    const entregaNormalizada = new Date(entrega.getFullYear(), entrega.getMonth(), entrega.getDate())
    const hoyNormalizada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    
    const dias = differenceInDays(entregaNormalizada, hoyNormalizada)
    
    if (dias < 0) return '¡VENCIDO!'
    if (dias === 0) return 'HOY'
    if (dias === 1) return 'MAÑANA'
    return `EN ${dias} DÍAS`
  }

  if (loading) {
    return (
      <div className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 shadow-xl rounded-2xl p-6 border border-slate-200">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-300 rounded w-full"></div>
            <div className="h-4 bg-slate-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-2xl rounded-2xl p-6 border border-slate-200 backdrop-blur-sm relative overflow-hidden">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v18M9 7l3-3 3 3M9 17l3 3 3-3" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Entregas Próximas
            </h2>
            <p className="text-sm text-slate-500">Motores que requieren atención urgente</p>
          </div>
        </div>

        {notificaciones.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">¡Todo al día!</p>
            <p className="text-sm text-slate-400">No hay entregas próximas que requieran atención</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificaciones.map((motor, index) => (
              <div 
                key={motor.id} 
                className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white relative overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.5s ease-out forwards'
                }}
              >
                {/* Línea de color lateral */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(motor.fecha_estimada_entrega)}`}></div>
                
                <div className="flex items-start gap-4 ml-3">
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full ${getPriorityColor(motor.fecha_estimada_entrega)} shadow-lg`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {motor.nombre_cliente}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                          {motor.descripcion_trabajo}
                        </p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                        getPriorityColor(motor.fecha_estimada_entrega).includes('red') ? 'bg-red-500' :
                        getPriorityColor(motor.fecha_estimada_entrega).includes('orange') ? 'bg-orange-500' :
                        getPriorityColor(motor.fecha_estimada_entrega).includes('yellow') ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}>
                        {getPriorityText(motor.fecha_estimada_entrega)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        Entrega estimada: {' '}
                        <span className="font-medium text-slate-700">
                          {motor.fecha_estimada_entrega && !isNaN(Date.parse(motor.fecha_estimada_entrega))
                            ? format(parseISO(motor.fecha_estimada_entrega), 'dd/MM/yyyy')
                            : 'Sin fecha definida'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}