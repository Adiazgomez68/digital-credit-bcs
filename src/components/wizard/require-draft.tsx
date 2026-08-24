"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    if (hasHydrated && !id) router.replace(WEB_ROUTES.CLIENT.CREDIT.CHANNEL);
  }, [hasHydrated, id, router]);

  if (!hasHydrated) return <DataLoadingSkeleton />;
  if (!id) return null;

  return <>{children}</>;
}
