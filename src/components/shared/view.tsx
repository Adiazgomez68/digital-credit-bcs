import { cn } from "@/lib/utils";

type ViewSize = "narrow" | "form" | "wide";
type ViewTag = "div" | "section";

const SIZE_MAX_WIDTH: Record<ViewSize, string> = {
  narrow: "max-w-xl",
  form: "max-w-2xl",
  wide: "max-w-295",
};

interface ViewProps {
  as?: ViewTag;
  id?: string;
  size?: ViewSize;
  className?: string;
  children: React.ReactNode;
}

export function View({
  as: Tag = "div",
  id,
  size = "form",
  className,
  children,
}: Readonly<ViewProps>) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full px-10 py-12",
        SIZE_MAX_WIDTH[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
