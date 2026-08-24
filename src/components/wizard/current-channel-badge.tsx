"use client";

import { useApplicationStore } from "@/providers/application-store-provider";

import { ChannelBadge } from "./channel-badge";

export function CurrentChannelBadge() {
  const channel = useApplicationStore((store) => store.channel);
  const advisorId = useApplicationStore((store) => store.advisorId);

  if (!channel) return null;

  return <ChannelBadge channel={channel} advisorId={advisorId} />;
}
