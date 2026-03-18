import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-[#1e1e1e] bg-black flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#1e1e1e]">
          <BrandLogo variant="full" size="md" />
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#1e1e1e] mt-auto">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#FFC400] glow-gold-sm" />
            <p className="text-[11px] text-[#555] font-sans">v0.1.0 — Active</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-black">
        {children}
      </main>
    </div>
  );
}
