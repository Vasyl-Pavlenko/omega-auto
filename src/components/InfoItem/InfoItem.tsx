export const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="min-h-[4rem]">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold truncate max-w-full">{value}</p>
  </div>
);
