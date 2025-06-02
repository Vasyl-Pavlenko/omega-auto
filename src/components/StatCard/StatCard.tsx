export const StatCard = ({ label, value }: { label: number; value: number }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all hover:shadow-xl">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-3xl font-bold text-blue-600 mt-2">{value}</div>
  </div>
);
