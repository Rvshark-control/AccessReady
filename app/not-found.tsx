import { ArrowRight, House } from "lucide-react";
import { Boo } from "@/components/brand/Boo";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-paper flex flex-1 items-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-20 text-center sm:flex-row sm:text-left">
        <div className="w-52 shrink-0">
          <Boo decorative />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-wine-700">Error 404</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
            This page vanished into thin air.
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Even Boo couldn&apos;t find it. The link may be broken, or the page may have moved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" icon={<House />}>
              Go to the home page
            </ButtonLink>
            <ButtonLink href="/needs" variant="secondary" trailingIcon={<ArrowRight />}>
              Check my accessibility needs
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
