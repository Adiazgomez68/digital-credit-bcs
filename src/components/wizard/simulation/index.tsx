"use client";

import { useEffect, useRef } from "react";

import {
  useFetchApplicationById,
  useSimulateOffer,
} from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";

import { LoadError } from "../load-error";
import { SimulationError } from "./error";
import { SimulationLoading } from "./loading";
import { SimulationNotViable } from "./not-viable";
import { SimulationSuccess } from "./success";

export function Simulation() {
  const id = useApplicationStore((store) => store.id);
  const {
    data: fetchedApplication,
    isPending: isLoadingApplication,
    isError: isLoadError,
  } = useFetchApplicationById(id!);
  const simulateMutation = useSimulateOffer();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (fetchedApplication?.status === "draft" && !hasTriggered.current) {
      hasTriggered.current = true;
      simulateMutation.mutate(id!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedApplication?.status, id]);

  const isSimulating = fetchedApplication?.status === "draft";

  if (isLoadingApplication || isSimulating) {
    return <SimulationLoading />;
  }

  if (isLoadError) {
    return <LoadError />;
  }

  if (!fetchedApplication) return null;

  if (fetchedApplication.offer?.result === "success") {
    return <SimulationSuccess application={fetchedApplication} />;
  }

  if (fetchedApplication.offer?.result === "not_viable") {
    return <SimulationNotViable application={fetchedApplication} />;
  }

  if (simulateMutation.isError) {
    return (
      <SimulationError
        onRetry={() => simulateMutation.mutate(id!)}
        isRetrying={simulateMutation.isPending}
      />
    );
  }

  return <SimulationLoading />;
}
