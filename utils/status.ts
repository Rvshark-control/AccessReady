import {
  CircleCheck,
  CircleDashed,
  CircleQuestionMark,
  CircleX,
  ShieldCheck,
  ShieldQuestionMark,
  ShieldX,
  type LucideIcon,
} from "lucide-react";
import type { CapabilityStatus, MatchStatus } from "@/types/api";

export type Tone = "ready" | "blocked" | "verify" | "incomplete";

export interface ToneClasses {
  /** Filled chip: soft background, strong text, border. */
  chip: string;
  /** Icon color on light surfaces. */
  icon: string;
  /** Soft panel background with border. */
  panel: string;
  /** Strong text color. */
  text: string;
  /** Solid fill for meters (decorative). */
  fill: string;
  /** Left accent border. */
  accent: string;
}

export const TONES: Record<Tone, ToneClasses> = {
  ready: {
    chip: "bg-ready-50 text-ready-800 border-ready-200",
    icon: "text-ready-700",
    panel: "bg-ready-50 border-ready-200",
    text: "text-ready-800",
    fill: "bg-ready-600",
    accent: "border-l-ready-600",
  },
  blocked: {
    chip: "bg-blocked-50 text-blocked-800 border-blocked-200",
    icon: "text-blocked-700",
    panel: "bg-blocked-50 border-blocked-200",
    text: "text-blocked-800",
    fill: "bg-blocked-500",
    accent: "border-l-blocked-500",
  },
  verify: {
    chip: "bg-verify-50 text-verify-800 border-verify-200",
    icon: "text-verify-700",
    panel: "bg-verify-50 border-verify-200",
    text: "text-verify-800",
    fill: "bg-verify-500",
    accent: "border-l-verify-500",
  },
  incomplete: {
    chip: "bg-incomplete-50 text-incomplete-800 border-incomplete-200",
    icon: "text-incomplete-700",
    panel: "bg-incomplete-50 border-incomplete-200",
    text: "text-incomplete-800",
    fill: "bg-incomplete-500",
    accent: "border-l-incomplete-500",
  },
};

export interface MatchStatusMeta {
  label: string;
  headline: string;
  summary: string;
  icon: LucideIcon;
  tone: Tone;
  /** Lower sorts first when ordering clinics for display. */
  rank: number;
}

export const MATCH_STATUS_META: Record<MatchStatus, MatchStatusMeta> = {
  READY: {
    label: "Ready",
    headline: "All your needs are confirmed",
    summary: "Every need you selected is confirmed in the demonstration data.",
    icon: ShieldCheck,
    tone: "ready",
    rank: 0,
  },
  NEEDS_VERIFICATION: {
    label: "Needs verification",
    headline: "Call ahead to confirm",
    summary: "Nothing is listed as unavailable, but some needs aren't confirmed yet.",
    icon: ShieldQuestionMark,
    tone: "verify",
    rank: 1,
  },
  NOT_READY: {
    label: "Not ready",
    headline: "Barrier detected",
    summary: "At least one need you selected is listed as unavailable.",
    icon: ShieldX,
    tone: "blocked",
    rank: 2,
  },
  INCOMPLETE: {
    label: "Incomplete",
    headline: "Not enough information",
    summary: "This clinic's record doesn't have enough information to assess your needs.",
    icon: CircleDashed,
    tone: "incomplete",
    rank: 3,
  },
};

const UNRECOGNIZED_MATCH_STATUS: MatchStatusMeta = {
  label: "Unrecognized status",
  headline: "Status not recognized",
  summary: "The service returned a status this version of AccessReady doesn't recognize.",
  icon: CircleDashed,
  tone: "incomplete",
  rank: 4,
};

export function getMatchStatusMeta(status: string): MatchStatusMeta {
  return status in MATCH_STATUS_META
    ? MATCH_STATUS_META[status as MatchStatus]
    : UNRECOGNIZED_MATCH_STATUS;
}

export interface CapabilityStatusMeta {
  label: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
}

/** "NOT_LISTED" is a display-only state for a capability key missing from a record. */
export type CapabilityDisplayStatus = CapabilityStatus | "NOT_LISTED";

export const CAPABILITY_STATUS_META: Record<CapabilityDisplayStatus, CapabilityStatusMeta> = {
  CONFIRMED: {
    label: "Confirmed",
    description: "Listed as available in the demo record",
    icon: CircleCheck,
    tone: "ready",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    description: "Listed as not available in the demo record",
    icon: CircleX,
    tone: "blocked",
  },
  UNKNOWN: {
    label: "Unknown",
    description: "Not verified. Ask the clinic.",
    icon: CircleQuestionMark,
    tone: "verify",
  },
  NOT_LISTED: {
    label: "Not listed",
    description: "The record doesn't mention this",
    icon: CircleDashed,
    tone: "incomplete",
  },
};

export function getCapabilityStatusMeta(status: string | undefined): CapabilityStatusMeta {
  if (status && status in CAPABILITY_STATUS_META) {
    return CAPABILITY_STATUS_META[status as CapabilityDisplayStatus];
  }
  return CAPABILITY_STATUS_META.NOT_LISTED;
}
