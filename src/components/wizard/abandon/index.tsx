"use client";

import { useState } from "react";

import { AbandonReasonForm } from "./reason-form";

interface AbandonActionProps {
  applicationId: string;
  className?: string;
  children: React.ReactNode;
}

export function AbandonAction({
  applicationId,
  className,
  children,
}: Readonly<AbandonActionProps>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      <AbandonReasonForm
        applicationId={applicationId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
