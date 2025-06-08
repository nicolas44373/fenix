export const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className={`p-4 rounded-xl shadow-md ${color}`}>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)
