// components/factura/ClienteForm.tsx
import { Building2 } from 'lucide-react'
import { MONTO_MINIMO_DATOS_CLIENTE } from '@/types/facturaTypes'

export default function ClienteForm({ cliente, tipo, setCliente, setTipo, cuitCliente, setCuitCliente, domicilioCliente, setDomicilioCliente, total }: any) {
  const requiresClientData = () => tipo === 'final' && total >= MONTO_MINIMO_DATOS_CLIENTE

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Información del Cliente</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Cliente</label>
          <input
            type="text"
            className="w-full px-4 py-3 border rounded-xl"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Consumidor</label>
          <select
            className="w-full px-4 py-3 border rounded-xl"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="final">Consumidor Final</option>
           
          </select>
        </div>

        {tipo === 'responsable_inscripto' && (
          <>
            <div>
              <label className="block text-sm font-medium">CUIT</label>
              <input type="text" className="w-full px-4 py-3 border rounded-xl" value={cuitCliente} onChange={(e) => setCuitCliente(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Domicilio</label>
              <input type="text" className="w-full px-4 py-3 border rounded-xl" value={domicilioCliente} onChange={(e) => setDomicilioCliente(e.target.value)} />
            </div>
          </>
        )}

        {requiresClientData() && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm font-medium mb-3">
              ⚠️ Para montos superiores a ${MONTO_MINIMO_DATOS_CLIENTE.toLocaleString()} se requieren datos del cliente
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="CUIT/DNI del cliente"
                className="w-full px-3 py-2 border border-amber-300 rounded-lg"
                value={cuitCliente}
                onChange={(e) => setCuitCliente(e.target.value)}
              />
              <input
                type="text"
                placeholder="Domicilio del cliente"
                className="w-full px-3 py-2 border border-amber-300 rounded-lg"
                value={domicilioCliente}
                onChange={(e) => setDomicilioCliente(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}