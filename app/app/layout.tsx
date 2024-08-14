import Header from "@/ui/section/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      <div className="p-6 mt-20 md:p-12">{children}</div>
    </main>
  );
}
