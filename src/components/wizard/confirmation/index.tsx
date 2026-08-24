"use client";

import { useFetchApplicationById } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";

import { DataLoadingSkeleton } from "../data-loading-skeleton";
import { LoadError } from "../load-error";
import { ConfirmationFinalized } from "./finalized";
import { ConfirmationPendingValidation } from "./pending-validation";

export function Confirmation() {
  const id = useApplicationStore((store) => store.id);
  const {
    data: application,
    isPending,
    isError,
  } = useFetchApplicationById(id!);

  if (isPending) return <DataLoadingSkeleton />;

  if (isError || !application) return <LoadError centered />;

  if (application.status === "pending_validation") {
    return <ConfirmationPendingValidation application={application} />;
  }

  return <ConfirmationFinalized application={application} />;
}
