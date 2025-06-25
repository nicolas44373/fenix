'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { StatCard } from '@/components/StatCard'
import { Loader } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { format } from 'date-fns'
import AdminLayout from '@/components/AdminLayout'
import MotoresPorEmpleado from '@/pages/admin/MotoresPorEmpleado'
import Notificaciones     from '@/pages/admin/Notificaciones'


interface Empleado {
  id: string
  dni: string
  nombre: string | null
}

interface Motor {
  id: string
  nombre_cliente: string
  telefono: string | null
  cuil: string | null
  domicilio: string | null
  descripcion_trabajo: string
  componentes_recibidos: string | null
  observaciones: string | null
  fecha_ingreso: string | null
  fecha_estimada_entrega: string | null
  fecha_entrega_real: string | null
  demora_estimacion_dias: number | null
  estado: string | null
  empleado_id: string | null
  notificado: boolean | null
  empleado?: Empleado | null
}

interface EmpleadoStat {
  nombre: string
  cantidad: number
}

interface EstadoMotor {
  estado: string
  cantidad: number
}

export default function Dashboard() {
  const [ingresos, setIngresos] = useState(0)
  const [egresos, setEgresos] = useState(0)
  const [clientes, setClientes] = useState(0)
  const [motoresData, setMotoresData] = useState<Motor[]>([])
  const [empleadosStats, setEmpleadosStats] = useState<EmpleadoStat[]>([])
  const [estadosMotores, setEstadosMotores] = useState<EstadoMotor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: facturas } = await supabase.from('facturas').select('total')
      const { data: egresosData } = await supabase.from('egresos').select('monto')

      const { data: motoresRaw, error: motoresError } = await supabase
        .from('motores')
        .select(`
          id,
          nombre_cliente,
          telefono,
          cuil,
          domicilio,
          descripcion_trabajo,
          componentes_recibidos,
          observaciones,
          fecha_ingreso,
          fecha_estimada_entrega,
          fecha_entrega_real,
          demora_estimacion_dias,
          estado,
          empleado_id,
          notificado,
          empleado:empleado_id (
            id,
            dni,
            nombre
          )
        `)
        .order('fecha_ingreso', { ascending: false })

      if (motoresError) {
        console.error('Error fetching motores:', motoresError)
      }

      const motores: Motor[] = (motoresRaw || []).map((motor: any) => ({
        ...motor,
        empleado: motor.empleado || null
      }))

      const { data: empleadosData, error: empleadosError } = await supabase
        .from('empleados')
        .select('id, nombre, dni')

      if (empleadosError) {
        console.error('Error fetching empleados:', empleadosError)
      }

      let empleadosStats: EmpleadoStat[] = []
      if (empleadosData && motores) {
        empleadosStats = empleadosData.map((emp: any) => {
          const cantidad = motores.filter(motor => motor.empleado_id === emp.id).length
          return {
            nombre: emp.nombre || emp.dni || 'Sin nombre',
            cantidad
          }
        }).filter((emp: EmpleadoStat) => emp.cantidad > 0)
      }

      const total = facturas?.reduce((acc, cur) => acc + cur.total, 0) || 0
      const eg = egresosData?.reduce((acc, cur) => acc + cur.monto, 0) || 0

      setIngresos(total)
      setEgresos(eg)
      setClientes(motores?.length || 0)
      setMotoresData(motores)
      setEmpleadosStats(empleadosStats)

      if (motores) {
        const estadosCounts = motores.reduce((acc: Record<string, number>, motor: Motor) => {
          const estado = motor.estado || 'Sin estado'
          acc[estado] = (acc[estado] || 0) + 1
          return acc
        }, {})

        const estadosArray = Object.entries(estadosCounts).map(([estado, cantidad]) => ({
          estado,
          cantidad: cantidad as number
        }))
        setEstadosMotores(estadosArray)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const balance = ingresos - egresos
  const currentMonth = format(new Date(), 'MMMM yyyy')
  const pieData = [
    { name: 'Ingresos', value: ingresos },
    { name: 'Egresos', value: egresos },
  ]

  const colors = ['#4ade80', '#f87171']
  const estadosColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">Panel de Control</h1>
        <p className="text-l font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">Resumen de actividad • {currentMonth}</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin w-10 h-10 text-gray-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Ingresos" value={`$${ingresos}`} color="bg-green-100" />
              <StatCard label="Egresos" value={`$${egresos}`} color="bg-red-100" />
              <StatCard label="Motores Registrados" value={clientes} color="bg-blue-100" />
              <StatCard label="Balance Neto" value={`$${balance}`} color="bg-yellow-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white shadow-md p-4 rounded-xl">
                <h2 className="text-lg font-semibold mb-4 text-center">Distribución de Ingresos vs Egresos</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label>
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow-md p-4 rounded-xl">
                <h2 className="text-lg font-semibold mb-4 text-center">Estados de Motores</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={estadosMotores} dataKey="cantidad" nameKey="estado" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label>
                      {estadosMotores.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={estadosColors[index % estadosColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 mb-8">
  <h2 className="text-lg font-semibold mb-4">Motores Recientes</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Cliente</th>
          <th className="text-left p-2">Descripción</th>
          <th className="text-left p-2">Estado</th>
          <th className="text-left p-2">Empleado</th>
          <th className="text-left p-2">Fecha Ingreso</th>
          <th className="text-left p-2">Fecha Est. Entrega</th>
          <th className="text-left p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {motoresData.slice(0, 10).map((motor) => (
          <tr key={motor.id} className="border-b hover:bg-gray-50">
            <td className="p-2 font-medium">{motor.nombre_cliente}</td>
            <td className="p-2 text-gray-600 truncate max-w-xs" title={motor.descripcion_trabajo}>
              {motor.descripcion_trabajo}
            </td>
            <td className="p-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                motor.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                motor.estado === 'En proceso' ? 'bg-blue-100 text-blue-800' :
                motor.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                motor.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {motor.estado || 'Sin estado'}
              </span>
            </td>
            <td className="p-2 text-gray-600">
              {motor.empleado?.nombre || motor.empleado?.dni || 'No asignado'}
            </td>
            <td className="p-2 text-gray-600">
              {motor.fecha_ingreso ? format(new Date(motor.fecha_ingreso), 'dd/MM/yyyy') : '-'}
            </td>
            <td className="p-2 text-gray-600">
              {motor.fecha_estimada_entrega ? format(new Date(motor.fecha_estimada_entrega), 'dd/MM/yyyy') : '-'}
            </td>
            <td className="p-2 flex gap-2">
              <button
                onClick={async () => {
                  await supabase.from('motores').update({ estado: 'Completado' }).eq('id', motor.id)
                  setMotoresData(prev => prev.map(m => m.id === motor.id ? { ...m, estado: 'Completado' } : m))
                }}
                className="text-green-600 hover:text-green-800 text-xs font-semibold"
              >
                Entregar
              </button>
              <button
                onClick={async () => {
                  await supabase.from('motores').update({ estado: 'Cancelado' }).eq('id', motor.id)
                  setMotoresData(prev => prev.map(m => m.id === motor.id ? { ...m, estado: 'Cancelado' } : m))
                }}
                className="text-red-600 hover:text-red-800 text-xs font-semibold"
              >
                Cancelar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


            <Notificaciones />
            <MotoresPorEmpleado />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
