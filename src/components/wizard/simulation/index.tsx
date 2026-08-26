"use client";

import { useEffect, useRef, useState } from "react";

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
  const hasTriggered = useRef(false);
  const [hasSimulationError, setHasSimulationError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const simulateMutation = useSimulateOffer({
    onError: () => setHasSimulationError(true),
    onSettled: () => setIsRetrying(false),
  });

  function runSimulation() {
    setHasSimulationError(false);
    setIsRetrying(true);
    simulateMutation.mutate(id!);
  }

  useEffect(() => {
    if (fetchedApplication?.status === "draft" && !hasTriggered.current) {
      hasTriggered.current = true;
      runSimulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedApplication?.status, id]);

  const isSimulating =
    fetchedApplication?.status === "draft" && !hasSimulationError;

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

  if (hasSimulationError) {
    return <SimulationError onRetry={runSimulation} isRetrying={isRetrying} />;
  }

  return <SimulationLoading />;
}
