

export default function Navbar({title}: Readonly<{title: string;}>) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-[15px]">
      <div className="text-2xl font-bold">Owner/<span className="font-light opacity-50">Dashboard</span></div>
    </div>
  );
}
