"use client";

import { usePrivy } from "@privy-io/react-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

function DashboardGuardContent({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="size-12 animate-spin rounded-full border-2 border-[#FFC400]/30 border-t-[#FFC400]" />
          <p className="text-[#666] text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display font-black text-2xl uppercase text-white mb-3">
            Sign in to try the demo
          </h1>
          <p className="text-[#666] text-sm mb-8 leading-relaxed">
            Use email, Google, GitHub, or a wallet to access the MoltWall security dashboard.
          </p>
          <button
            onClick={login}
            className="inline-flex items-center justify-center gap-2 bg-[#FFC400] text-black font-black text-[14px] uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#e6b000] transition-all font-display"
          >
            Sign in with Privy
          </button>
          <p className="mt-6 text-[11px] text-[#333] leading-relaxed max-w-xs mx-auto">
            By signing in you agree to our{" "}
            <a href="/terms" className="text-[#555] hover:text-[#FFC400] transition-colors underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="text-[#555] hover:text-[#FFC400] transition-colors underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return <>{children}</>;
  }
  return <DashboardGuardContent>{children}</DashboardGuardContent>;
}
