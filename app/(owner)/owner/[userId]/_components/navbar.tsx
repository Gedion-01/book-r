import getUserId from "@/lib/auth";
import { SidebarMobile } from "./mobile-sidebar";

export default async function Navbar({ title }: Readonly<{ title: string }>) {
  const id = await getUserId();

  if (!id) {
    return null;
  }
  return (
    <div className="sticky top-0 flex justify-between items-center bg-white p-4 rounded-[15px] z-20">
      <div className="text-2xl font-bold">
        Owner/<span className="font-light opacity-50">Dashboard</span>
      </div>
      <SidebarMobile userId={id} />
    </div>
  );
}
