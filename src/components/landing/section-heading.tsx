import { Heading } from "@/components/shared/heading";

interface SectionHeadingProps {
  kicker: string;
  title: string;
}

export function SectionHeading({
  kicker,
  title,
}: Readonly<SectionHeadingProps>) {
  return (
    <div className="mb-11 max-w-xl">
      <div className="mb-2.5 text-xs font-semibold tracking-wide text-primary uppercase">
        {kicker}
      </div>

      <Heading level={2}>{title}</Heading>
    </div>
  );
}
