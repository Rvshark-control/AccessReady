import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

/** Consistent page header for the four journey screens. Owns the page's single <h1>. */
export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-8", className)}>
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display mt-3 text-[2.35rem] font-semibold leading-[1.08] text-night-900 sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {description ? (
          <div className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{description}</div>
        ) : null}
      </div>
      {aside ? <div className="hidden shrink-0 lg:block">{aside}</div> : null}
    </div>
  );
}

/** Standard page container for journey screens. */
export function FlowPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-paper flex-1">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">{children}</div>
    </div>
  );
}
