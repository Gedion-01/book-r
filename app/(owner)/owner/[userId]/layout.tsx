import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

export default function Layout({
  children, params
}: {
  children: React.ReactNode, params: { userId: string };
}) {
  return (
    <div className="flex gap-4 h-screen w-full p-[14px]">
      {/* <!-- Sidebar --> */}
      <Sidebar userId={params.userId} />

      {/* <!-- Main Content --> */}
      <div className="flex flex-col flex-1 gap-4">
        {/* <!-- Top Navbar --> */}
        <Navbar title="Admin/Dashboard" />

        {/* <!-- Content Body --> */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
