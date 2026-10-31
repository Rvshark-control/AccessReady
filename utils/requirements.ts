import {
  ArrowUpFromLine,
  BedSingle,
  DoorOpen,
  HandHelping,
  Languages,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { REQUIREMENT_IDS, type RequirementId } from "@/types/api";

export type RequirementCategory = "Mobility" | "Communication" | "Sensory";

export interface RequirementMeta {
  id: RequirementId;
  label: string;
  /** Short label for dense layouts such as table headers. */
  shortLabel: string;
  description: string;
  category: RequirementCategory;
  icon: LucideIcon;
  /**
   * What the patient asks the front desk for. Phrased from the patient's own need,
   * so it never depends on (or implies) a clinic's compatibility result.
   */
  request: string;
}

/** Display metadata only. Statuses and matching always come from the backend. */
export const REQUIREMENTS: Record<RequirementId, RequirementMeta> = {
  accessible_entrance: {
    id: "accessible_entrance",
    label: "Wheelchair-accessible entrance",
    shortLabel: "Accessible entrance",
    description:
      "A step-free route from arrival to the exam room, with doorways wide enough for a wheelchair.",
    category: "Mobility",
    icon: DoorOpen,
    request: "Please tell me which entrance is step-free, and keep the route to the exam room clear.",
  },
  adjustable_exam_table: {
    id: "adjustable_exam_table",
    label: "Adjustable examination table",
    shortLabel: "Adjustable exam table",
    description: "A table that lowers to wheelchair-seat height so you can transfer safely.",
    category: "Mobility",
    icon: BedSingle,
    request: "Please book an exam room with a height-adjustable examination table.",
  },
  transfer_lift: {
    id: "transfer_lift",
    label: "Patient transfer lift",
    shortLabel: "Transfer lift",
    description:
      "A mechanical lift that safely moves you between your wheelchair and the exam table.",
    category: "Mobility",
    icon: ArrowUpFromLine,
    request: "Please have a patient transfer lift ready in the exam room before my exam.",
  },
  trained_assistance: {
    id: "trained_assistance",
    label: "Trained transfer assistance",
    shortLabel: "Transfer assistance",
    description: "Staff trained to help you transfer safely, following your direction.",
    category: "Mobility",
    icon: HandHelping,
    request: "Please have staff trained in safe transfers available to help me, following my direction.",
  },
  sign_language_interpreter: {
    id: "sign_language_interpreter",
    label: "Sign-language interpreter",
    shortLabel: "Sign-language interpreter",
    description: "A qualified interpreter, in person or by video, for your entire visit.",
    category: "Communication",
    icon: Languages,
    request: "Please arrange a qualified sign-language interpreter for my whole appointment.",
  },
  quiet_waiting_area: {
    id: "quiet_waiting_area",
    label: "Quiet waiting area",
    shortLabel: "Quiet waiting area",
    description: "A calm, low-stimulation place to wait, away from noise and crowds.",
    category: "Sensory",
    icon: VolumeX,
    request: "Please let me wait somewhere quiet and low-stimulation until I'm called.",
  },
};

/** The demo profile: a wheelchair user who needs a full, assisted transfer. */
export const DEMO_REQUIREMENTS: readonly RequirementId[] = [
  "accessible_entrance",
  "adjustable_exam_table",
  "transfer_lift",
  "trained_assistance",
];

export function isRequirementId(value: unknown): value is RequirementId {
  return typeof value === "string" && (REQUIREMENT_IDS as readonly string[]).includes(value);
}

/** Dedupe and sort into the canonical display order. */
export function orderRequirements(ids: Iterable<RequirementId>): RequirementId[] {
  const set = new Set(ids);
  return REQUIREMENT_IDS.filter((id) => set.has(id));
}

/** Label for any requirement ID, including ones the frontend doesn't know yet. */
export function requirementLabel(id: string): string {
  if (isRequirementId(id)) return REQUIREMENTS[id].label;
  const words = id.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function requirementShortLabel(id: string): string {
  return isRequirementId(id) ? REQUIREMENTS[id].shortLabel : requirementLabel(id);
}
