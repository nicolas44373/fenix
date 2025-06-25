interface Props {
  formData: {
    nombreCliente: string
    telefono: string
    domicilio: string
  }
  onChange: (key: string, value: string) => void
}

export default function ClienteSection({ formData, onChange }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Información del Cliente
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre del Cliente</label>
          <input
            type="text"
            placeholder="Ingrese el nombre completo"
            value={formData.nombreCliente}
            onChange={(e) => onChange('nombreCliente', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            placeholder="Ej: +54 9 11 1234-5678"
            value={formData.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Domicilio</label>
          <input
            type="text"
            placeholder="Dirección completa del cliente"
            value={formData.domicilio}
            onChange={(e) => onChange('domicilio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
          />
        </div>
      </div>
    </div>
  )
}
