interface Props {
  formData: {
    descripcion: string
    componentes: string
    observaciones: string
  }
  onChange: (key: string, value: string) => void
}

export default function MotorSection({ formData, onChange }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
        Información del Motor
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descripción del Trabajo</label>
          <textarea
            placeholder="Detalle el trabajo a realizar en el motor..."
            value={formData.descripcion}
            onChange={(e) => onChange('descripcion', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Componentes Recibidos</label>
          <textarea
            placeholder="Liste los componentes y partes recibidas..."
            value={formData.componentes}
            onChange={(e) => onChange('componentes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Observaciones</label>
          <textarea
            placeholder="Observaciones adicionales, estado del motor, etc..."
            value={formData.observaciones}
            onChange={(e) => onChange('observaciones', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  )
}
