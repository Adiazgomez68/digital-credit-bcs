"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAbandonApplication } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";
import {
  ABANDON_REASONS,
  abandonSchema,
  resolveAbandonReason,
  type AbandonValues,
} from "@/schemas/abandon";

const OTHER_REASON_INDEX = ABANDON_REASONS.length - 1;

interface AbandonReasonFormProps {
  applicationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AbandonReasonForm({
  applicationId,
  open,
  onOpenChange,
}: Readonly<AbandonReasonFormProps>) {
  const router = useRouter();
  const resetStore = useApplicationStore((store) => store.reset);
  const abandonMutation = useAbandonApplication();

  const form = useForm<AbandonValues>({
    resolver: zodResolver(abandonSchema),
    defaultValues: { reasonIndex: -1, otherReason: "" },
  });
  const reasonIndex = useWatch({ control: form.control, name: "reasonIndex" });

  function onSubmit(values: AbandonValues) {
    abandonMutation.mutate(
      {
        id: applicationId,
        payload: { reason: resolveAbandonReason(values) },
        actor: "client",
      },
      {
        onSuccess: () => {
          resetStore();
          onOpenChange(false);
          router.push(WEB_ROUTES.CLIENT.HOME);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>¿Por qué quieres abandonar el proceso?</DialogTitle>

          <DialogDescription>
            Tu información se conserva como borrador. Nos ayuda saber el motivo
            para mejorar la experiencia.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="reasonIndex"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                {ABANDON_REASONS.map((label, index) => (
                  <label
                    key={label}
                    className="flex cursor-pointer items-center gap-3 py-1.5"
                  >
                    <RadioGroupItem value={index} />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />

          {reasonIndex === OTHER_REASON_INDEX && (
            <Controller
              control={form.control}
              name="otherReason"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <textarea
                    {...field}
                    placeholder="Cuéntanos brevemente el motivo…"
                    className="min-h-21 w-full resize-y rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={reasonIndex < 0}
              loading={abandonMutation.isPending}
            >
              Confirmar abandono
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
