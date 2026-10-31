import {
  ArrowRight,
  AudioLines,
  ClipboardList,
  Contrast,
  Eye,
  GitCompareArrows,
  Keyboard,
  ListChecks,
  MessageSquareText,
  Pause,
  Play,
  ShieldAlert,
} from "lucide-react";
import { Boo } from "@/components/brand/Boo";
import { Sparkle } from "@/components/brand/Decorations";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MatchStatusBadge } from "@/components/ui/StatusBadge";
import type { MatchStatus } from "@/types/api";
import { cn } from "@/utils/cn";
import { MATCH_STATUS_META, TONES } from "@/utils/status";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Tell us your needs",
    body: "Choose the accommodations you need, from a wheelchair-accessible entrance to a sign-language interpreter. No account. Nothing stored.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare accessibility",
    body: "See which clinics confirm each need, which list it as unavailable, and which simply haven't said. Side by side, in plain language.",
  },
  {
    icon: ListChecks,
    title: "Prepare for your appointment",
    body: "Get the exact questions to ask before you go, plus a front-desk card to show at check-in. Copy, download, or print it. Nothing is sent for you.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" id="how-it-works" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="From booked to ready in three steps"
          description="Disabled patients often discover barriers only after they arrive: an exam table that won't lower, no lift for a transfer, no interpreter. AccessReady surfaces them before you go."
        />

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-11 hidden border-t-2 border-dashed border-plum-200 md:block"
          />
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative rounded-3xl border border-line bg-white p-7 shadow-card transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center gap-4">
                  <span className="relative flex size-16 items-center justify-center rounded-2xl bg-night-900 text-pumpkin-400 shadow-soft">
                    <Icon aria-hidden="true" className="size-7" strokeWidth={2.1} />
                    <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-pumpkin-500 text-sm font-bold text-night-900">
                      {index + 1}
                    </span>
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-2xl font-semibold text-night-900">{step.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const STATUS_ORDER: MatchStatus[] = ["READY", "NEEDS_VERIFICATION", "NOT_READY", "INCOMPLETE"];

export function StatusExplainer() {
  return (
    <section aria-labelledby="status-title" className="border-y border-line bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            id="status-title"
            eyebrow="Clear answers"
            title="Four honest verdicts. Never just a color."
            description="Every clinic gets one of four statuses for your needs. Each has its own icon, words, and color, so the meaning never depends on seeing color."
          />
          <div className="mt-8 flex gap-3 rounded-2xl border border-plum-200 bg-plum-50 p-5 text-ink-soft">
            <ShieldAlert aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-plum-700" />
            <p>
              <strong className="text-night-900">“Ready” means confirmed in our demonstration data.</strong>{" "}
              It is not a guarantee of real-world accessibility. Always confirm with the clinic before your
              visit.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {STATUS_ORDER.map((status) => {
            const meta = MATCH_STATUS_META[status];
            const tone = TONES[meta.tone];
            return (
              <li
                key={status}
                className={cn("rounded-3xl border border-l-[6px] bg-white p-6 shadow-soft", tone.accent, "border-line")}
              >
                <MatchStatusBadge status={status} />
                <h3 className="mt-4 text-xl font-bold text-night-900">{meta.headline}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{meta.summary}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const PROMISES = [
  { icon: Keyboard, title: "Fully keyboard operable", body: "Every control works with Tab, Space, and Enter, with a bold focus ring you can always see." },
  { icon: AudioLines, title: "Screen-reader friendly", body: "Semantic structure, labeled controls, and live announcements when results load." },
  { icon: Contrast, title: "Never color alone", body: "Statuses pair color with icons and words. Text meets WCAG AA contrast or better." },
  { icon: Eye, title: "Hyperlegible type", body: "Set in Atkinson Hyperlegible Next, a typeface designed for low-vision readers." },
  { icon: Pause, title: "Calm motion", body: "Animations are subtle and switch off entirely when you prefer reduced motion." },
  { icon: MessageSquareText, title: "Plain language", body: "No jargon. Clear next steps for every result, including what to ask the clinic." },
];

export function AccessibilityPromise() {
  return (
    <section aria-labelledby="promise-title" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="promise-title"
          eyebrow="Built for access"
          title="Accessibility isn't a feature here. It's the product."
          align="center"
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 rounded-3xl border border-line bg-white/80 p-6 shadow-soft">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-plum-100 text-plum-700">
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-night-900">{title}</h3>
                <p className="mt-1 leading-relaxed text-ink-soft">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-paper pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="on-dark relative isolate overflow-hidden rounded-[2.25rem] bg-night px-6 py-12 text-cream shadow-lift sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-14">
          <Sparkle className="absolute right-[38%] top-8 -z-10 size-5 text-pumpkin-300/70 motion-safe:animate-twinkle" />
          <Sparkle className="absolute bottom-10 left-[46%] -z-10 size-3 text-plum-300/70 motion-safe:animate-twinkle [animation-delay:1.2s]" />
          <div className="max-w-xl">
            <h2 id="cta-title" className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              No more surprises at the front desk.
            </h2>
            <p className="mt-4 text-lg text-plum-200">
              Check your next visit in about a minute, or load the demo profile and compare fictional clinics side by side.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/needs" size="lg" trailingIcon={<ArrowRight />}>
                Check my accessibility needs
              </ButtonLink>
              <ButtonLink href="/needs?demo=1" size="lg" variant="dark-outline" icon={<Play className="fill-current" />}>
                Try demo
              </ButtonLink>
            </div>
          </div>
          <div className="mx-auto mt-10 w-52 shrink-0 sm:w-60 lg:mx-0 lg:mt-0">
            <Boo decorative />
          </div>
        </div>
      </div>
    </section>
  );
}
