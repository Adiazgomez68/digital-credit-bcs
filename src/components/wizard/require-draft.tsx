"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  useApplicationStore,
  useApplicationStoreHasHydrated,
} from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";

import { DataLoadingSkeleton } from "./data-loading-skeleton";

export function RequireDraft({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const id = useApplicationStore((store) => store.id);
  const hasHydrated = useApplicationStoreHasHydrated();
  const hasCheckedOnce = useRef(false);

  useEffect(() => {
    if (!hasHydrated || hasCheckedOnce.current) return;
    hasCheckedOnce.current = true;

    if (!id) router.replace(WEB_ROUTES.CLIENT.CREDIT.CHANNEL);
  }, [hasHydrated, id, router]);

  if (!hasHydrated) return <DataLoadingSkeleton />;
  if (!id) return null;

  return <>{children}</>;
}
