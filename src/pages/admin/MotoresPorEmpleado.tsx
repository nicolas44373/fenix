'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type MotorConEmpleadoRaw = {
  id: string
  descripcion_trabajo: string
  fecha_ingreso: string
  empleado: {
    id: string
    nombre: string
  } | null // ← ya no es array
}

type MotorConEmpleado = {
  id: string
  descripcion: string
  fecha_ingreso: string
  empleado: {
    id: string
    nombre: string
  } | null
}

export function MotoresPorEmpleado() {
  const [motores, setMotores] = useState<MotorConEmpleado[]>([])

  useEffect(() => {
    const fetchMotores = async () => {
      const { data, error } = await supabase
        .from('motores')
        .select(`
          id,
          descripcion_trabajo,
          fecha_ingreso,
          empleado:empleado_id (
            id,
            nombre
          )
        `)
        .order('fecha_ingreso', { ascending: false })

      if (error) {
        console.error('Error al obtener motores:', error)
        return
      }

      const transformado: MotorConEmpleado[] = (data || []).map((motor: any) => ({
        id: motor.id,
        descripcion: motor.descripcion_trabajo,
        fecha_ingreso: motor.fecha_ingreso,
        empleado: motor.empleado || null,
      }))

      setMotores(transformado)
    }

    fetchMotores()
  }, [])

  const agrupado = motores.reduce<Record<string, MotorConEmpleado[]>>((acc, motor) => {
    const nombre = motor.empleado?.nombre || 'Sin asignar'
    if (!acc[nombre]) acc[nombre] = []
    acc[nombre].push(motor)
    return acc
  }, {})

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Motores por Empleado</h2>
      {Object.entries(agrupado).map(([empleado, lista]) => (
        <div key={empleado} className="mb-4">
          <h3 className="font-bold text-gray-800 mb-2">{empleado}</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {lista.map((m) => (
              <li key={m.id}>
                {m.descripcion} - {new Date(m.fecha_ingreso).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
