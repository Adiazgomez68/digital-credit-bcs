import { formatChannelLabel } from "@/lib/format";
import type { Channel } from "@/types/application";

interface ChannelBadgeProps {
  channel: Channel;
  advisorId?: string;
}

export function ChannelBadge({
  channel,
  advisorId,
}: Readonly<ChannelBadgeProps>) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-secondary px-3 text-xs font-medium text-muted-foreground">
      Canal: {formatChannelLabel(channel, advisorId)}
    </span>
  );
}
