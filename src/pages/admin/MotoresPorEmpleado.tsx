'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type MotorConEmpleado = {
  id: string
  codigo: string
  descripcion: string
  nombre_cliente: string
  fecha_ingreso: string
  empleado: {
    id: string
    nombre: string
  } | null
}

export default function MotoresPorEmpleado() {
  const [motores, setMotores] = useState<MotorConEmpleado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMotores = async () => {
      try {
        const { data, error } = await supabase
          .from('motores')
          .select(`
            id,
            codigo,
            descripcion_trabajo,
            nombre_cliente,
            fecha_ingreso,
            empleado_id,
            empleados(
              id,
              nombre
            )
          `)
          .order('fecha_ingreso', { ascending: false })

        if (error) {
          console.error('Error al obtener motores:', error)
          return
        }

        const transformado: MotorConEmpleado[] = (data || []).map((motor: any) => {
          console.log('Motor individual:', motor) // Debug cada motor
          console.log('nombre_cliente:', motor.nombre_cliente) // Debug específico del cliente
          
          return {
            id: motor.id,
            codigo: motor.codigo || '',
            descripcion: motor.descripcion_trabajo || '',
            nombre_cliente: motor.nombre_cliente || '',
            fecha_ingreso: motor.fecha_ingreso,
            empleado: motor.empleados ? {
              id: motor.empleados.id,
              nombre: motor.empleados.nombre
            } : null,
          }
        })

        console.log('Datos obtenidos:', data) // Para debuggear
        console.log('Datos transformados:', transformado) // Para debuggear
        setMotores(transformado)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMotores()
  }, [])

  const agrupado = motores.reduce<Record<string, MotorConEmpleado[]>>((acc, motor) => {
    const nombre = motor.empleado?.nombre || 'Sin asignar'
    if (!acc[nombre]) acc[nombre] = []
    acc[nombre].push(motor)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">Motores por Empleado</h2>
      </div>
      
      {Object.keys(agrupado).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📋</div>
          <p>No hay motores registrados</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(agrupado).map(([empleado, lista]) => (
            <div key={empleado} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-gray-800">{empleado}</h3>
                <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {lista.length} {lista.length === 1 ? 'motor' : 'motores'}
                </span>
              </div>
              
              <div className="grid gap-3">
                {lista.map((motor) => (
                  <div 
                    key={motor.id} 
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-blue-500 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            {motor.codigo || 'Sin código'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(motor.fecha_ingreso).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {/* Cliente - Siempre mostrar */}
                        <div className="mb-1">
                          <span className="text-sm text-gray-600">Cliente: </span>
                          <span className="text-sm font-medium text-gray-800">
                            {motor.nombre_cliente || 'Sin especificar'}
                          </span>
                        </div>
                        
                        {/* Descripción - Siempre mostrar */}
                        <div className="mb-1">
                          <span className="text-sm text-gray-600">Trabajo: </span>
                          <span className="text-sm text-gray-700">
                            {motor.descripcion || 'Sin descripción'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}