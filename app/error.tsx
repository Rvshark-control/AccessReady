"use client";

import { useEffect, useRef } from "react";
import { House, RotateCcw } from "lucide-react";
import { Boo } from "@/components/brand/Boo";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    headingRef.current?.focus();
  }, [error]);

  return (
    <div className="bg-paper flex flex-1 items-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-20 text-center sm:flex-row sm:text-left">
        <div className="w-48 shrink-0">
          <Boo decorative />
        </div>
        <div role="alert">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-4xl font-semibold leading-tight text-night-900 outline-none sm:text-5xl"
          >
            Something went wrong on this page.
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            It&apos;s not you. Please try again. Your selections are saved in the page address, so nothing is lost.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset} icon={<RotateCcw />}>
              Try again
            </Button>
            <ButtonLink href="/" variant="secondary" icon={<House />}>
              Go to the home page
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
