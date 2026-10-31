"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Expand, IdCard, Minimize } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import type { RequirementId } from "@/types/api";
import { REQUIREMENTS } from "@/utils/requirements";

/**
 * A digital summary card the patient can show at check-in (full screen on a phone)
 * or print. It lists plain requests based on the patient's own needs.
 */
export function FrontDeskCard({ clinicName, needs }: { clinicName: string; needs: readonly RequirementId[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const [note, setNote] = useState("");

  // When full screen ends (Escape, back gesture, or the Exit button), return focus to the opener.
  useEffect(() => {
    function onChange() {
      if (!document.fullscreenElement) {
        setNote("");
        openButtonRef.current?.focus();
      }
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function exitFullScreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
  }

  async function showFullScreen() {
    const card = cardRef.current;
    if (!card || typeof card.requestFullscreen !== "function" || !document.fullscreenEnabled) {
      setNote("Full screen isn't available in this browser. You can print the card, or zoom in on it instead.");
      return;
    }
    try {
      await card.requestFullscreen();
      card.focus();
      setNote("Showing the card full screen. Press Escape to exit.");
    } catch {
      setNote("Full screen was blocked by the browser. You can print the card instead.");
    }
  }

  return (
    <section aria-labelledby="front-desk-title" className="flex flex-col gap-4">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="front-desk-title" className="font-display flex items-center gap-2.5 text-3xl font-semibold text-night-900">
            <IdCard aria-hidden="true" className="size-7 text-plum-700" />
            Front-desk card
          </h2>
          <p className="mt-1.5 max-w-2xl text-ink-soft">
            A summary of your requests to show staff when you check in. Open it full screen on your phone, or print it.
          </p>
        </div>
        <Button ref={openButtonRef} variant="secondary" icon={<Expand />} onClick={showFullScreen} className="shrink-0">
          Show card full screen
        </Button>
      </div>

      <div
        ref={cardRef}
        tabIndex={-1}
        aria-label={`Front-desk card for ${clinicName}`}
        role="group"
        className="front-desk-card relative overflow-hidden rounded-[1.75rem] border-2 border-plum-300 bg-white p-6 shadow-card outline-none sm:p-8 print:shadow-none"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--color-plum-600),var(--color-pumpkin-500))]" />
        <Button
          variant="purple"
          icon={<Minimize />}
          onClick={exitFullScreen}
          className="front-desk-exit"
        >
          Exit full screen
        </Button>
        <div className="flex items-center gap-3">
          <LogoMark className="size-10" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-pumpkin-700">Accessibility requests</p>
            <p className="font-bold text-night-900">{clinicName}</p>
          </div>
        </div>
        <p className="font-display mt-6 text-2xl font-semibold leading-snug text-night-900 sm:text-[1.75rem]">
          Hello! For my appointment today, I&apos;ll need:
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {needs.map((id) => {
            const Icon = REQUIREMENTS[id].icon;
            return (
              <li key={id} className="flex gap-3.5 rounded-2xl bg-plum-50 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-plum-600 text-white">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold text-night-900">{REQUIREMENTS[id].label}</span>
                  <span className="block leading-relaxed text-ink-soft">{REQUIREMENTS[id].request}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 flex items-start gap-2.5 text-lg font-bold text-night-900">
          <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-ready-700" strokeWidth={3} />
          If anything isn&apos;t available, please tell me before my exam begins. Thank you!
        </p>
        <p className="mt-4 text-sm text-ink-muted">Prepared with the AccessReady prototype · fictional clinic data</p>
      </div>

      <p role="status" className="no-print min-h-6 text-[0.95rem] font-bold text-plum-800">
        {note}
      </p>
    </section>
  );
}
