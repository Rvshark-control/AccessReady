"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FlaskConical, Menu, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/utils/cn";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/needs", label: "Check my needs" },
  { href: "/compare", label: "Compare clinics" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu when this route is hidden by Activity (Next.js preserves state).
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) => !href.includes("#") && pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md supports-[backdrop-filter]:bg-cream/75">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="rounded-xl" aria-label="AccessReady home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-[0.975rem] font-bold text-ink-soft transition-colors hover:bg-plum-100 hover:text-night-900",
                "aria-[current=page]:bg-plum-100 aria-[current=page]:text-night-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-pumpkin-200 bg-pumpkin-50 px-3 py-1 text-sm font-bold text-pumpkin-800 lg:inline-flex">
            <FlaskConical aria-hidden="true" className="size-4" />
            Fictional demo data
          </span>
          <Link
            href="/needs?demo=1"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-night-900 px-5 text-[0.975rem] font-bold text-cream shadow-soft transition-colors hover:bg-plum-700 sm:inline-flex"
          >
            <Sparkles aria-hidden="true" className="size-4 text-pumpkin-400" />
            Try demo
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-plum-200 bg-white text-night-900 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Main"
        hidden={!open}
        className="border-t border-line bg-cream px-4 pb-5 pt-3 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="flex min-h-12 items-center rounded-2xl px-4 text-lg font-bold text-night-900 hover:bg-plum-100 aria-[current=page]:bg-plum-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/needs?demo=1"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-12 items-center gap-2 rounded-2xl bg-night-900 px-4 text-lg font-bold text-cream"
            >
              <Sparkles aria-hidden="true" className="size-5 text-pumpkin-400" />
              Try the demo
            </Link>
          </li>
        </ul>
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-pumpkin-800">
          <FlaskConical aria-hidden="true" className="size-4" />
          All clinics in this prototype are fictional.
        </p>
      </nav>
    </header>
  );
}
