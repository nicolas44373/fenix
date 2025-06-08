'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Trash2 } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
type Empleado = {
  id: string
  nombre: string
  dni: string
  password: string
}

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [form, setForm] = useState({ nombre: '', dni: '', password: '' })

  const fetchEmpleados = async () => {
    const { data } = await supabase.from('empleados').select('*').order('nombre')
    if (data) setEmpleados(data)
  }

  useEffect(() => {
    fetchEmpleados()
  }, [])

  const handleAddEmpleado = async () => {
  const nombre = form.nombre.trim()
  const dni = form.dni.trim()
  const password = form.password.trim()

  if (!nombre || !dni || !password) {
    return alert('Completa todos los campos correctamente.')
  }

  // Verificar si ya existe un empleado con ese DNI
  const { data: existente, error: errorExistente } = await supabase
    .from('empleados')
    .select('id')
    .eq('dni', dni)
    .single()

  if (existente) {
    alert('Ya existe un empleado registrado con ese DNI.')
    return
  }

  if (errorExistente && errorExistente.code !== 'PGRST116') {
    // Ignora el error de "no rows" (eso es bueno)
    console.error('Error al verificar duplicado:', errorExistente)
    return alert('Error al verificar el DNI. Intenta de nuevo.')
  }

  const { data, error } = await supabase
    .from('empleados')
    .insert([{ nombre, dni, password }])
    .select()
    .single()

  if (error) {
    alert('Error al guardar empleado')
    console.error(error)
  } else {
    setForm({ nombre: '', dni: '', password: '' })
    fetchEmpleados()
    alert(`Empleado creado correctamente`)
  }
}


  const handleEliminar = async (id: string) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este empleado?')
    if (!confirm) return

    const { error } = await supabase.from('empleados').delete().eq('id', id)
    if (error) {
      alert('Error al eliminar')
    } else {
      fetchEmpleados()
    }
  }

  return (
    <AdminLayout>
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">Gestión de Empleados</h1>

      {/* Formulario */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Agregar nuevo empleado</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full p-2 border mb-2 rounded"
        />
        <input
          type="text"
          placeholder="DNI"
          value={form.dni}
          onChange={(e) => setForm({ ...form, dni: e.target.value })}
          className="w-full p-2 border mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border mb-3 rounded"
        />
        <button
          onClick={handleAddEmpleado}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Guardar empleado
        </button>
      </div>

      {/* Lista */}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">Empleados actuales</h2>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">DNI</th>
              <th className="text-center p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{emp.nombre}</td>
                <td className="p-3">{emp.dni}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEliminar(emp.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="inline h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {empleados.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No hay empleados registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  )
}
