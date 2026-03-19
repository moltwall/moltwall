"use client";

import { usePrivy } from "@privy-io/react-auth";
import { usePrivyEnabled } from "@/components/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PrivyAuthGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#FFC400]/30 border-t-[#FFC400] animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const enabled = usePrivyEnabled();

  if (enabled) {
    return <PrivyAuthGuard>{children}</PrivyAuthGuard>;
  }

  return <>{children}</>;
}
