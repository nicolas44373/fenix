export default function SuccessMessage() {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-green-800 font-medium">
        ✅ Motor registrado correctamente
      </p>
    </div>
  )
}
