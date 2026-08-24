"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SimulatorForm } from "./form";
import {
  DEFAULT_AMOUNT,
  DEFAULT_TERM_MONTHS,
  estimateMonthlyFee,
  simulatorSchema,
  type SimulationResult,
  type SimulatorValues,
} from "./schema";
import { Summary } from "./summary";

export function Simulator() {
  const [result, setResult] = useState<SimulationResult | null>(null);

  const form = useForm<SimulatorValues>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: { amount: DEFAULT_AMOUNT, termMonths: DEFAULT_TERM_MONTHS },
  });

  function onSubmit(values: SimulatorValues) {
    setResult({
      ...values,
      estimatedFee: estimateMonthlyFee(values.amount, values.termMonths),
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {result ? "Simulación de referencia" : "Simulador rápido"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {result ? (
          <Summary result={result} onRecalculate={() => setResult(null)} />
        ) : (
          <SimulatorForm
            control={form.control}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        )}
      </CardContent>
    </Card>
  );
}
