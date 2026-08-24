import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3;

// The only place the serif font is used — everything else stays on the
// default sans-serif. Pick a level, don't reach for a raw <h1>/<h2>/<h3>.
const LEVEL_CONFIG: Record<
  HeadingLevel,
  { tag: "h1" | "h2" | "h3"; className: string }
> = {
  1: { tag: "h1", className: "text-3xl" },
  2: { tag: "h2", className: "text-2xl" },
  3: { tag: "h3", className: "text-lg" },
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
}

export function Heading({
  level,
  className,
  children,
  ...props
}: Readonly<HeadingProps>) {
  const { tag: Tag, className: sizeClassName } = LEVEL_CONFIG[level];

  return (
    <Tag
      className={cn("font-heading font-medium", sizeClassName, className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
