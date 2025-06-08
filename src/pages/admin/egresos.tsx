'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns'
import AdminLayout from '@/components/AdminLayout'

type Egreso = {
  id: string
  descripcion: string
  monto: number
  fecha: string
}

export default function EgresosPage() {
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [filteredEgresos, setFilteredEgresos] = useState<Egreso[]>([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Estados para filtros
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [filtroActivo, setFiltroActivo] = useState(false)

  const fetchEgresos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('egresos')
      .select('*')
      .order('fecha', { ascending: false })

    if (data) {
      setEgresos(data)
      setFilteredEgresos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEgresos()
  }, [])

  // Aplicar filtros por fecha
  const aplicarFiltros = () => {
    if (!fechaDesde && !fechaHasta) {
      setFilteredEgresos(egresos)
      setFiltroActivo(false)
      return
    }

    let egresosFiltrados = [...egresos]

    if (fechaDesde || fechaHasta) {
      egresosFiltrados = egresos.filter(egreso => {
        const fechaEgreso = parseISO(egreso.fecha)
        
        // Si solo hay fecha desde
        if (fechaDesde && !fechaHasta) {
          return fechaEgreso >= startOfDay(parseISO(fechaDesde))
        }
        
        // Si solo hay fecha hasta
        if (!fechaDesde && fechaHasta) {
          return fechaEgreso <= endOfDay(parseISO(fechaHasta))
        }
        
        // Si hay ambas fechas
        if (fechaDesde && fechaHasta) {
          return isWithinInterval(fechaEgreso, {
            start: startOfDay(parseISO(fechaDesde)),
            end: endOfDay(parseISO(fechaHasta))
          })
        }
        
        return true
      })
    }

    setFilteredEgresos(egresosFiltrados)
    setFiltroActivo(true)
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFechaDesde('')
    setFechaHasta('')
    setFilteredEgresos(egresos)
    setFiltroActivo(false)
  }

  // Filtros rápidos
  const aplicarFiltroRapido = (tipo: string) => {
    const hoy = new Date()
    let desde: Date
    let hasta: Date = hoy

    switch (tipo) {
      case 'hoy':
        desde = hoy
        hasta = hoy
        break
      case 'semana':
        desde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 7)
        break
      case 'mes':
        desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        break
      case 'trimestre':
        desde = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1)
        break
      default:
        return
    }

    setFechaDesde(format(desde, 'yyyy-MM-dd'))
    setFechaHasta(format(hasta, 'yyyy-MM-dd'))
    
    // Aplicar filtro automáticamente
    const egresosFiltrados = egresos.filter(egreso => {
      const fechaEgreso = parseISO(egreso.fecha)
      return isWithinInterval(fechaEgreso, {
        start: startOfDay(desde),
        end: endOfDay(hasta)
      })
    })
    
    setFilteredEgresos(egresosFiltrados)
    setFiltroActivo(true)
  }

  const handleAddEgreso = async () => {
    if (!descripcion || !monto) return alert('Completa todos los campos')

    const { error } = await supabase.from('egresos').insert([
      {
        descripcion,
        monto: parseFloat(monto),
      },
    ])

    if (error) {
      alert('Error al guardar')
    } else {
      setDescripcion('')
      setMonto('')
      fetchEgresos()
    }
  }

  const total = filteredEgresos.reduce((acc, eg) => acc + eg.monto, 0)

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">Control de Egresos</h1>

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Registrar nuevo egreso</h2>
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />
          <button
            onClick={handleAddEgreso}
            className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition"
          >
            Guardar Egreso
          </button>
        </div>

        {/* Filtros por fecha */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Filtrar por fechas</h2>
          
          {/* Filtros rápidos */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Filtros rápidos:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => aplicarFiltroRapido('hoy')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
              >
                Hoy
              </button>
              <button
                onClick={() => aplicarFiltroRapido('semana')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
              >
                Última semana
              </button>
              <button
                onClick={() => aplicarFiltroRapido('mes')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
              >
                Este mes
              </button>
              <button
                onClick={() => aplicarFiltroRapido('trimestre')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
              >
                Último trimestre
              </button>
            </div>
          </div>

          {/* Filtro personalizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde:
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta:
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={aplicarFiltros}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Aplicar Filtro
            </button>
            <button
              onClick={limpiarFiltros}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Limpiar Filtros
            </button>
          </div>

          {filtroActivo && (
            <div className="mt-3 p-2 bg-green-100 text-green-700 rounded text-sm">
              Filtro activo: {filteredEgresos.length} de {egresos.length} egresos mostrados
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">Historial</h2>
          <div className="text-sm text-gray-600">
            Total mostrado: <span className="font-bold text-red-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-10">Cargando...</p>
          ) : filteredEgresos.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <p className="text-gray-500">No hay egresos para mostrar</p>
            </div>
          ) : (
            <table className="w-full bg-white shadow rounded-xl overflow-hidden text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {filteredEgresos.map((egreso) => (
                  <tr key={egreso.id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="p-3">{format(new Date(egreso.fecha), 'dd/MM/yyyy')}</td>
                    <td className="p-3">{egreso.descripcion}</td>
                    <td className="p-3 text-right">${egreso.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="p-3 font-bold" colSpan={2}>
                    Total {filtroActivo ? '(filtrado)' : ''}
                  </td>
                  <td className="p-3 text-right font-bold text-red-600">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}