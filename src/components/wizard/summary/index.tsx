"use client";

import { useFetchApplicationById } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";

import { DataLoadingSkeleton } from "../data-loading-skeleton";
import { LoadError } from "../load-error";
import { SummaryView } from "./view";

export function Summary() {
  const id = useApplicationStore((store) => store.id);
  const {
    data: application,
    isPending,
    isError,
  } = useFetchApplicationById(id!);

  if (isPending) return <DataLoadingSkeleton />;

  if (isError || !application) return <LoadError />;

  return <SummaryView application={application} />;
}
