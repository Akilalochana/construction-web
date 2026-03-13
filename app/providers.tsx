"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: AuthProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
