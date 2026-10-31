import Link from "next/link";
import { FlaskConical, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BatFlock } from "@/components/brand/Decorations";

export function SiteFooter() {
  return (
    <footer className="on-dark relative mt-auto overflow-hidden bg-night-900 text-plum-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-block rounded-xl" aria-label="AccessReady home">
            <Logo onDark />
          </Link>
          <p className="mt-4 text-[0.975rem] leading-relaxed">
            Healthcare access, confirmed before you arrive. A HackGwinnett 6.0 prototype.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-cream">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-[0.975rem]">
            <li>
              <Link className="rounded underline-offset-4 hover:text-cream hover:underline" href="/needs">
                Check my accessibility needs
              </Link>
            </li>
            <li>
              <Link className="rounded underline-offset-4 hover:text-cream hover:underline" href="/compare">
                Compare fictional clinics
              </Link>
            </li>
            <li>
              <Link className="rounded underline-offset-4 hover:text-cream hover:underline" href="/needs?demo=1">
                Try the guided demo
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4 text-[0.975rem] leading-relaxed">
          <p className="flex gap-2.5">
            <FlaskConical aria-hidden="true" className="mt-1 size-5 shrink-0 text-pumpkin-400" />
            <span>
              <strong className="text-cream">Every clinic here is fictional.</strong> Statuses come from a
              synthetic demonstration dataset, not real facilities.
            </span>
          </p>
          <p className="flex gap-2.5">
            <ShieldAlert aria-hidden="true" className="mt-1 size-5 shrink-0 text-pumpkin-400" />
            <span>
              <strong className="text-cream">“Ready” isn&apos;t a guarantee.</strong> Always confirm
              accommodations with the clinic. AccessReady never contacts clinics for you.
            </span>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-sm text-plum-300">
            Not medical advice. Built with care for disabled patients, their families, and caregivers.
          </p>
          <BatFlock className="pointer-events-none hidden w-24 shrink-0 opacity-40 sm:block" />
        </div>
      </div>
    </footer>
  );
}
