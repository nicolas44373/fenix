export default function LoginLoader() {
  return (
    <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-6xl animate-spin mb-4">🔥</div>
        <p className="text-orange-300 font-medium">Cargando...</p>
      </div>
    </div>
  )
}
