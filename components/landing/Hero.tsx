import { ArrowRight, CircleCheck, CircleQuestionMark, CircleX, FlaskConical, Play } from "lucide-react";
import { Boo } from "@/components/brand/Boo";
import { Cobweb, DriftingBat, GhostHem, Sparkle, StarField } from "@/components/brand/Decorations";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-night text-cream">
      {/* Stars stay clear of the text column so they never sit behind copy. */}
      <StarField className="-z-10 opacity-80 [mask-image:linear-gradient(to_right,transparent_0%,transparent_46%,black_62%)] max-lg:[mask-image:linear-gradient(to_bottom,black_0%,black_8%,transparent_14%,transparent_100%)]" />
      <Cobweb className="pointer-events-none absolute -left-1 -top-1 -z-10 w-32 text-plum-300/25 sm:w-40" />
      <DriftingBat className="top-28 -z-10" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-8 lg:pb-10 lg:pt-20">
        <div className="motion-safe:animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-3.5 py-1.5 text-sm font-bold text-plum-200">
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-full rounded-full bg-pumpkin-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-pumpkin-400" />
            </span>
            Accessibility check for medical visits
          </p>

          <h1
            id="hero-title"
            className="font-display mt-6 text-[2.75rem] font-semibold leading-[1.02] text-cream sm:text-6xl lg:text-[4.35rem]"
          >
            Your appointment is booked.{" "}
            <span className="relative block text-pumpkin-400">
              But is it accessible?
              <Sparkle className="absolute -right-2 -top-3 hidden size-6 text-pumpkin-300 motion-safe:animate-twinkle sm:block" />
            </span>
          </h1>

          <p className="mt-6 text-xl font-bold text-cream sm:text-2xl">
            Healthcare access, confirmed before you arrive.
          </p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-plum-200">
            Tell AccessReady what you need, like a step-free entrance, a lift for transfers, or a
            sign-language interpreter. We show which clinics have each one confirmed, which list it as
            unavailable, and exactly what to ask before you go.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/needs" size="lg" trailingIcon={<ArrowRight />}>
              Check my accessibility needs
            </ButtonLink>
            <ButtonLink
              href="/needs?demo=1"
              size="lg"
              variant="dark-outline"
              icon={<Play className="fill-current" />}
            >
              Try demo
            </ButtonLink>
          </div>

          <p className="mt-7 inline-flex items-start gap-2.5 rounded-2xl border border-pumpkin-400/30 bg-pumpkin-500/10 px-4 py-2.5 text-[0.975rem] text-pumpkin-100">
            <FlaskConical aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-pumpkin-400" />
            <span>
              <strong className="font-bold text-cream">Prototype notice:</strong> all clinics in this
              prototype are fictional.
            </span>
          </p>
        </div>

        <HeroIllustration />
      </div>

      <GhostHem className="-mb-px" />
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
      {/* Moon glow behind Boo */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[44%] -z-10 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(255_234_219/0.95)_0%,rgb(255_214_179/0.55)_38%,rgb(132_98_189/0.25)_62%,transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[44%] -z-10 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25"
      />

      <div className="relative mx-auto w-[82%] max-w-[26rem] motion-safe:animate-float">
        <Boo />
      </div>

      {/* Illustrative example chips. The real product shows these per clinic. */}
      <div aria-hidden="true">
        <ExampleChip
          className="left-0 top-[10%] motion-safe:[animation-delay:0.2s] lg:-left-4"
          tone="ready"
          label="Accessible entrance"
          status="Confirmed"
        />
        <ExampleChip
          className="-right-1 bottom-[24%] motion-safe:[animation-delay:0.4s] sm:-right-2 lg:-right-6"
          tone="verify"
          label="Transfer lift"
          status="Needs verification"
        />
        <ExampleChip
          className="bottom-[3%] left-[-2%] motion-safe:[animation-delay:0.6s] lg:-left-6"
          tone="blocked"
          label="Adjustable exam table"
          status="Unavailable"
        />
      </div>
    </div>
  );
}

const CHIP_TONES = {
  ready: { icon: CircleCheck, iconClass: "text-ready-700 bg-ready-50", text: "text-ready-800" },
  verify: { icon: CircleQuestionMark, iconClass: "text-verify-700 bg-verify-50", text: "text-verify-800" },
  blocked: { icon: CircleX, iconClass: "text-blocked-700 bg-blocked-50", text: "text-blocked-800" },
} as const;

function ExampleChip({
  className,
  tone,
  label,
  status,
}: {
  className?: string;
  tone: keyof typeof CHIP_TONES;
  label: string;
  status: string;
}) {
  const t = CHIP_TONES[tone];
  const Icon = t.icon;
  return (
    <div
      className={cn(
        "absolute flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 py-2.5 pl-2.5 pr-4 text-night-900 shadow-lift backdrop-blur motion-safe:animate-fade-up",
        className,
      )}
    >
      <span className={cn("flex size-9 items-center justify-center rounded-xl", t.iconClass)}>
        <Icon className="size-5" strokeWidth={2.4} />
      </span>
      <span className="leading-tight">
        <span className="block text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</span>
        <span className={cn("block text-[0.95rem] font-bold", t.text)}>{status}</span>
      </span>
    </div>
  );
}
