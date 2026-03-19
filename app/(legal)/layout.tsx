import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#111] bg-black/95 backdrop-blur-xl h-12 flex items-center px-6">
        <div className="flex items-center gap-4 w-full max-w-4xl mx-auto">
          <BrandLogo size="sm" href="/" />
          <span className="text-[#222] font-mono">/</span>
          <span className="text-[11px] font-black text-[#555] tracking-[0.15em] font-display uppercase">Legal</span>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/terms" className="px-3 py-1 text-[12px] text-[#444] hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="px-3 py-1 text-[12px] text-[#444] hover:text-white transition-colors">Privacy</Link>
            <Link href="/" className="px-3 py-1 text-[12px] text-[#444] hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </nav>
      <div className="h-12" />
      {children}
      <footer className="border-t border-[#111] py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] text-[#333]">© {new Date().getFullYear()} MoltWall · www.moltwall.xyz</p>
          <div className="flex items-center gap-4 text-[11px] text-[#444]">
            <Link href="/terms" className="hover:text-[#FFC400] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#FFC400] transition-colors">Privacy Policy</Link>
            <Link href="/docs" className="hover:text-[#FFC400] transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
