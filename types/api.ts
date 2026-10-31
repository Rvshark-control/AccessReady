/**
 * AccessReady API contract — TypeScript mirror of API_CONTRACT.md.
 *
 * SHARED FILE: owned jointly by the frontend (Claude Code) and backend (Codex).
 * Change it only when API_CONTRACT.md changes, with agreement from both sides.
 * Backend code may import from "@/types/api".
 */

/** Every accommodation a patient can ask about, in display order. */
export const REQUIREMENT_IDS = [
  "accessible_entrance",
  "adjustable_exam_table",
  "transfer_lift",
  "trained_assistance",
  "sign_language_interpreter",
  "quiet_waiting_area",
] as const;

export type RequirementId = (typeof REQUIREMENT_IDS)[number];

/** Per-clinic, per-requirement status from the (fictional) dataset. */
export const CAPABILITY_STATUSES = ["CONFIRMED", "UNAVAILABLE", "UNKNOWN"] as const;

export type CapabilityStatus = (typeof CAPABILITY_STATUSES)[number];

/** Overall compatibility verdict for one clinic against the selected requirements. */
export const MATCH_STATUSES = [
  "READY",
  "NOT_READY",
  "NEEDS_VERIFICATION",
  "INCOMPLETE",
] as const;

export type MatchStatus = (typeof MATCH_STATUSES)[number];

/* ------------------------------------------------------------------ */
/* GET /api/clinics                                                    */
/* ------------------------------------------------------------------ */

export interface Clinic {
  id: string;
  name: string;
  description: string;
  /** Should list all six requirement IDs. */
  capabilities: Record<RequirementId, CapabilityStatus>;
}

export interface ClinicsResponse {
  clinics: Clinic[];
  /** Always true in this prototype: every clinic is fictional. */
  synthetic: true;
}

/* ------------------------------------------------------------------ */
/* POST /api/match                                                     */
/* ------------------------------------------------------------------ */

export interface MatchRequest {
  /** Must be non-empty. An empty list must never produce a READY match. */
  requirements: RequirementId[];
}

export interface RequirementCheck {
  requirement: RequirementId;
  status: CapabilityStatus;
  /** Plain-language explanation shown directly to patients. */
  explanation: string;
}

export interface ClinicMatchResult {
  /** Same value as Clinic.id. */
  clinicId: string;
  clinicName: string;
  status: MatchStatus;
  confirmedCount: number;
  unavailableCount: number;
  unknownCount: number;
  checks: RequirementCheck[];
  /** Questions the patient can ask the clinic. May be empty. */
  verificationQuestions: string[];
}

export interface MatchResponse {
  results: ClinicMatchResult[];
  /** Always true in this prototype: every clinic is fictional. */
  synthetic: true;
}

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

/** Recommended body for non-2xx responses. */
export interface ApiErrorBody {
  error: string;
}
