import { cn } from "@/utils/cn";

export function Eyebrow({
  children,
  className,
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-sm font-bold uppercase tracking-[0.16em]",
        onDark ? "text-pumpkin-300" : "text-wine-700",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className="font-display mt-3 text-[2.15rem] font-semibold leading-[1.1] text-night-900 sm:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{description}</p>
      ) : null}
    </div>
  );
}
