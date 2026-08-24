"use client";

import { ApiError } from "@/lib/http-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const MAX_RETRIES = 3;

// 4xx responses are deterministic (not found, validation, etc.) — retrying
// them just delays the error for no benefit. Only network/5xx failures are
// worth retrying.
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }

  return failureCount < MAX_RETRIES;
}

export function TanstackProvider({
  children,
}: Readonly<React.PropsWithChildren>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_5_MIN,
            refetchOnMount: false,
            retry: shouldRetry,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
