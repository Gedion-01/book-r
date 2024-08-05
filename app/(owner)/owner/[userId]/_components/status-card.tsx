export default function StatusCard() {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold">This Month Statistics</h3>
      <p className="text-2xl font-bold mt-4">
        ETB 9460.00 <span className="text-red-600 text-sm">↓1.5%</span>
      </p>
      <p className="text-gray-500 mt-1">Compared to ETB8940 last month</p>
    </div>
  );
}
