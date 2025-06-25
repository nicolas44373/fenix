interface Props {
  formData: {
    demora: number
    fechaEstimada: string
  }
  onChange: (key: string, value: any) => void
}

export default function EntregaSection({ formData, onChange }: Props) {
  const handleDemoraChange = (value: string) => {
    const dias = parseInt(value) || 0
    onChange('demora', dias)

    // Calcular nueva fecha estimada
    const hoy = new Date()
    hoy.setDate(hoy.getDate() + dias)
    const yyyy = hoy.getFullYear()
    const mm = String(hoy.getMonth() + 1).padStart(2, '0')
    const dd = String(hoy.getDate()).padStart(2, '0')
    const fechaFormateada = `${yyyy}-${mm}-${dd}`
    onChange('fechaEstimada', fechaFormateada)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Programación de Entrega
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Demora Estimada (días)</label>
          <input
            type="number"
            placeholder="0"
            value={formData.demora}
            onChange={(e) => handleDemoraChange(e.target.value)}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
          <input
            type="date"
            value={formData.fechaEstimada}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}
