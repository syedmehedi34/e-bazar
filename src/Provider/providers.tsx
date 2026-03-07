"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import ReduxProvider from "@/Provider/ReduxPresistProbider/ReduxPresistProbider";
import SessionWrapper from "@/Components/SessionWrapper/SessionWrapper";
import ToastProvider from "@/Components/ToastProvider/ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionWrapper>
        <ReduxProvider>
          {children}
          <ToastProvider />
        </ReduxProvider>
      </SessionWrapper>
    </QueryClientProvider>
  );
}
