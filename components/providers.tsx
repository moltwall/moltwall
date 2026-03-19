"use client";

import { createContext, useContext, useEffect } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
export const PRIVY_REDIRECT_KEY = "moltwall_post_login_redirect";

export const PrivyEnabledContext = createContext(!!PRIVY_APP_ID);
export function usePrivyEnabled() {
  return useContext(PrivyEnabledContext);
}

// Always mounted inside PrivyProvider — handles post-OAuth redirect
// regardless of which page the user lands on after the OAuth round-trip.
function PostLoginRedirect() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (authenticated) {
      const dest = sessionStorage.getItem(PRIVY_REDIRECT_KEY);
      if (dest) {
        sessionStorage.removeItem(PRIVY_REDIRECT_KEY);
        router.push(dest);
      }
    }
  }, [authenticated, ready, router]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <PrivyEnabledContext.Provider value={false}>
        {children}
      </PrivyEnabledContext.Provider>
    );
  }
  return (
    <PrivyEnabledContext.Provider value={true}>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ["email", "google", "wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#FFC400",
            logo: "/icon.png",
          },
          embeddedWallets: {
            ethereum: { createOnLogin: "off" },
            solana: { createOnLogin: "off" },
          },
        }}
      >
        <PostLoginRedirect />
        {children}
      </PrivyProvider>
    </PrivyEnabledContext.Provider>
  );
}
