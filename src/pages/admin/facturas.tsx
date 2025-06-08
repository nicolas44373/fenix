'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AdminLayout from '@/components/AdminLayout'
import { FileText, Receipt, Download } from 'lucide-react'
import { generarNumeroFactura, generarFacturaHTML } from '@/lib/facturaUtils'
import ClienteForm from '@/components/factura/ClienteForm'
import ItemsFactura from '@/components/factura/ItemsFactura'
import ResumenFactura from '@/components/factura/ResumenFactura'
import { FacturaItemType } from '@/types/facturaTypes'

export default function FacturasPage() {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState<FacturaItemType[]>([{ descripcion: '', cantidad: 1, precio_unitario: 0 }])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [facturaGuardada, setFacturaGuardada] = useState<any | null>(null)
  const [facturasAnteriores, setFacturasAnteriores] = useState<any[]>([])

  const total = items.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0)
  const tipoFactura = 'B'
  const subtotal = total
  const iva = 0

  useEffect(() => {
    const fetchFacturas = async () => {
      const { data, error } = await supabase.from('facturas').select('*').order('id', { ascending: false })
      if (!error && data) setFacturasAnteriores(data)
    }
    fetchFacturas()
  }, [showSuccess])

  const resetForm = () => {
    setCliente('')
    setItems([{ descripcion: '', cantidad: 1, precio_unitario: 0 }])
  }

  const descargarFactura = async () => {
    if (!facturaGuardada) return

    const htmlFactura = generarFacturaHTML(facturaGuardada)
    const element = document.createElement('div')
    element.innerHTML = htmlFactura

    const { default: html2pdf } = await import('html2pdf.js')

    html2pdf()
      .set({
        margin: 0.5,
        filename: `Factura_${facturaGuardada.numeroFactura}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(element)
      .save()
  }

  const guardarFactura = async () => {
    setIsLoading(true)
    try {
      const numeroFactura = generarNumeroFactura()
      const fecha = new Date().toLocaleDateString('es-AR')

      const { data: factura, error } = await supabase
        .from('facturas')
        .insert([{ cliente, tipo_consumidor: 'final', total }])
        .select()
        .single()

      if (factura && !error) {
        for (const item of items) {
          await supabase.from('items_factura').insert([{ ...item, factura_id: factura.id }])
        }

        setFacturaGuardada({
          numeroFactura,
          fecha,
          cliente,
          tipoFactura,
          items,
          subtotal,
          iva,
          total,
        })

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        resetForm()
      } else {
        throw new Error('Error al guardar la factura')
      }
    } catch (error) {
      alert('Error al guardar la factura')
    } finally {
      setIsLoading(false)
    }
  }

  const descargarFacturaAnterior = async (factura: any) => {
    const { data: itemsData } = await supabase.from('items_factura').select('*').eq('factura_id', factura.id)

    const htmlFactura = generarFacturaHTML({
      numeroFactura: generarNumeroFactura(),
      fecha: new Date().toLocaleDateString('es-AR'),
      cliente: factura.cliente,
      tipoFactura: 'B',
      items: itemsData || [],
      subtotal: factura.total,
      iva: 0,
      total: factura.total,
    })

    const element = document.createElement('div')
    element.innerHTML = htmlFactura

    const { default: html2pdf } = await import('html2pdf.js')

    html2pdf()
      .set({
        margin: 0.5,
        filename: `Factura_Anterior_${factura.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(element)
      .save()
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span className="font-medium">¡Factura guardada exitosamente!</span>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Nueva Factura</h1>
                  <p className="text-blue-100 mt-1">Crea y gestiona facturas profesionales</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ClienteForm {...{ cliente, setCliente, total }} />
              <ItemsFactura items={items} setItems={setItems} />
            </div>
            <ResumenFactura
              {...{
                tipoFactura,
                subtotal,
                iva,
                total,
                guardarFactura,
                descargarFactura,
                isLoading,
                cliente,
                items,
                lastFacturaId: facturaGuardada?.numeroFactura,
              }}
            />
          </div>

          {facturasAnteriores.length > 0 && (
            <div className="bg-white p-6 rounded-xl border shadow-md">
              <h2 className="text-xl font-semibold mb-4">Facturas anteriores</h2>
              <ul className="divide-y divide-slate-200">
                {facturasAnteriores.map((factura) => (
                  <li key={factura.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{factura.cliente}</p>
                      <p className="text-sm text-slate-500">Total: ${factura.total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => descargarFacturaAnterior(factura)}
                      className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" /> <span>Descargar</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
