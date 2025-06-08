'use client'
export const FacturaItem = ({ item, idx, updateItem }: any) => (
  <div className="grid grid-cols-3 gap-2 mb-2">
    <input
      placeholder="Descripción"
      value={item.descripcion}
      onChange={(e) => updateItem(idx, 'descripcion', e.target.value)}
      className="p-2 border"
    />
    <input
      type="number"
      placeholder="Cantidad"
      value={item.cantidad}
      onChange={(e) => updateItem(idx, 'cantidad', parseInt(e.target.value))}
      className="p-2 border"
    />
    <input
      type="number"
      placeholder="Precio"
      value={item.precio_unitario}
      onChange={(e) => updateItem(idx, 'precio_unitario', parseFloat(e.target.value))}
      className="p-2 border"
    />
  </div>
)