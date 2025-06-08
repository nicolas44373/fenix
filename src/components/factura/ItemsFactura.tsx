// components/factura/ItemsFactura.tsx
import { Plus, Trash2, DollarSign } from 'lucide-react'
import { FacturaItemType } from '@/types//facturaTypes'

export default function ItemsFactura({ items, setItems }: { items: FacturaItemType[], setItems: (items: FacturaItemType[]) => void }) {
  const agregarItem = () => setItems([...items, { descripcion: '', cantidad: 1, precio_unitario: 0 }])

  const eliminarItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, key: keyof FacturaItemType, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [key]: value }
    setItems(updated)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Items</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-end">
            <input
              className="col-span-5 px-2 py-2 border rounded"
              value={item.descripcion}
              onChange={(e) => updateItem(idx, 'descripcion', e.target.value)}
              placeholder="Descripción"
            />
            <input
              type="number"
              className="col-span-2 px-2 py-2 border rounded"
              value={item.cantidad}
              min={1}
              onChange={(e) => updateItem(idx, 'cantidad', parseInt(e.target.value))}
            />
            <input
              type="number"
              className="col-span-3 px-2 py-2 border rounded"
              value={item.precio_unitario}
              min={0}
              onChange={(e) => updateItem(idx, 'precio_unitario', parseFloat(e.target.value))}
            />
            {items.length > 1 && (
              <button className="col-span-2 text-red-500" onClick={() => eliminarItem(idx)}>
                <Trash2 />
              </button>
            )}
          </div>
        ))}
      </div>

      <button onClick={agregarItem} className="mt-4 flex items-center space-x-2 text-blue-600">
        <Plus className="w-4 h-4" /> <span>Agregar ítem</span>
      </button>
    </div>
  )
}