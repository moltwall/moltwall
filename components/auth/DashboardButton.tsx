"use client";

import { usePrivy } from "@privy-io/react-auth";
import { usePrivyEnabled, PRIVY_REDIRECT_KEY } from "@/components/providers";
import { useRouter } from "next/navigation";

// Inner component — only mounted when PrivyProvider is in the tree
function PrivyDashboardButton({
  className,
  children,
  onBeforeAction,
}: {
  className?: string;
  children: React.ReactNode;
  onBeforeAction?: () => void;
}) {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  const handleClick = () => {
    onBeforeAction?.();
    if (authenticated) {
      router.push("/dashboard");
    } else {
      // Persist intent — survives OAuth full-page redirect
      sessionStorage.setItem(PRIVY_REDIRECT_KEY, "/dashboard");
      login();
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

// Public component — safe to use anywhere on the page
export function DashboardButton({
  className,
  children,
  onBeforeAction,
}: {
  className?: string;
  children: React.ReactNode;
  onBeforeAction?: () => void;
}) {
  const enabled = usePrivyEnabled();
  const router = useRouter();

  if (enabled) {
    return (
      <PrivyDashboardButton className={className} onBeforeAction={onBeforeAction}>
        {children}
      </PrivyDashboardButton>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        onBeforeAction?.();
        router.push("/dashboard");
      }}
      className={className}
    >
      {children}
    </button>
  );
}
