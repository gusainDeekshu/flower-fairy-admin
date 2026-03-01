// src/components/providers/AuthProvider.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Session } from "next-auth"; // Import the Session type

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null; // Add this property
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}