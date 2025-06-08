// components/factura/ResumenFactura.tsx
import { Calculator, Save, Download } from 'lucide-react'

export default function ResumenFactura({ tipoFactura, subtotal, iva, total, guardarFactura, descargarFactura, isLoading, cliente, items, lastFacturaId }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-slate-800">Resumen</h2>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between py-2">
          <span>Tipo de Factura:</span>
          <span className="font-bold">{tipoFactura}</span>
        </div>
        {tipoFactura === 'A' && (
          <>
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>IVA (21%):</span>
              <span>${iva.toFixed(2)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between py-2 font-bold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button onClick={guardarFactura} disabled={isLoading || !cliente || items.some((i: any) => !i.descripcion)} className="w-full bg-blue-600 text-white py-2 rounded-lg">
          <Save className="inline w-4 h-4 mr-2" /> {isLoading ? 'Guardando...' : 'Guardar Factura'}
        </button>
        {lastFacturaId && (
          <button onClick={descargarFactura} className="w-full bg-emerald-600 text-white py-2 rounded-lg mt-2">
            <Download className="inline w-4 h-4 mr-2" /> Descargar Factura
          </button>
        )}
      </div>
    </div>
  )
}