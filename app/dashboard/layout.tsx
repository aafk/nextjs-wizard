import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="w-full md:h-screen md:fixed md:w-64">
        <SideNav />
      </div>
      <div className="p-6 md:overflow-y-auto md:p-12 md:ml-64">{children}</div>
    </div>
  );
}
