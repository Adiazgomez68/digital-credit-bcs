export interface TimelineItem {
  id: string;
  title: string;
  meta: string;
  correlationId?: string;
}

// The traceability line used in every detail screen (client and advisor):
// a dot + connecting line per event, in chronological order.
export function Timeline({ items }: Readonly<{ items: TimelineItem[] }>) {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={item.id} className="relative pb-6 pl-6 last:pb-0">
          <span className="absolute top-1 left-0 size-2 rounded-full bg-primary ring-2 ring-accent" />
          {index < items.length - 1 && (
            <span className="absolute top-3 bottom-0 left-1 w-px bg-border" />
          )}
          <div className="text-sm font-semibold">{item.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {item.meta}
          </div>
          {item.correlationId && (
            <div className="mt-1 font-mono text-xs text-text-faint">
              corr: {item.correlationId}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
