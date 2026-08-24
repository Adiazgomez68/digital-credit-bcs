"use client";

import { useFetchApplicationById } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";

import { DataLoadingSkeleton } from "../data-loading-skeleton";
import { LoadError } from "../load-error";
import { SupplementaryDataForm } from "./form";

export function SupplementaryData() {
  const id = useApplicationStore((store) => store.id);
  const {
    data: application,
    isPending,
    isError,
  } = useFetchApplicationById(id!);

  if (isPending) return <DataLoadingSkeleton />;

  if (isError || !application) return <LoadError />;

  return <SupplementaryDataForm application={application} />;
}
