import type {
  CapabilityStatus,
  Clinic,
  ClinicMatchResult,
  ClinicsResponse,
  MatchResponse,
  MatchStatus,
  RequirementCheck,
  RequirementId,
} from "@/types/api";

/**
 * Frontend client for the backend contract in API_CONTRACT.md.
 * It only fetches and validates. It never computes match results.
 */

export type ApiErrorKind = "network" | "http" | "invalid-response" | "invalid-request";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  /** Technical detail for developers; shown in a collapsed "Technical details" area. */
  readonly detail: string;

  constructor(message: string, kind: ApiErrorKind, detail: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.detail = detail;
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return new ApiError("Something unexpected went wrong. Please try again.", "network", detail);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function fetchClinics(signal?: AbortSignal): Promise<ClinicsResponse> {
  return requestJson("GET", "/api/clinics", undefined, signal, parseClinicsResponse);
}

export function postMatch(
  requirements: readonly RequirementId[],
  signal?: AbortSignal,
): Promise<MatchResponse> {
  if (requirements.length === 0) {
    return Promise.reject(
      new ApiError(
        "Choose at least one accessibility need before checking compatibility.",
        "invalid-request",
        "postMatch called with an empty requirements list; request not sent.",
      ),
    );
  }
  return requestJson(
    "POST",
    "/api/match",
    { requirements: [...requirements] },
    signal,
    parseMatchResponse,
  );
}

/* ------------------------------------------------------------------ */
/* Transport                                                           */
/* ------------------------------------------------------------------ */

async function requestJson<T>(
  method: "GET" | "POST",
  path: string,
  body: unknown,
  signal: AbortSignal | undefined,
  parse: (json: unknown) => T,
): Promise<T> {
  const label = `${method} ${path}`;
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError(
      "We couldn't reach the AccessReady service. Check your connection, then try again.",
      "network",
      `${label} failed before a response: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const text = await response.text();
  let json: unknown = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = undefined;
    }
  }

  if (!response.ok) {
    const serverMessage = readErrorMessage(json);
    throw new ApiError(
      friendlyHttpMessage(response.status, serverMessage),
      "http",
      `${label} returned HTTP ${response.status}${serverMessage ? `: ${serverMessage}` : ""}`,
      response.status,
    );
  }

  if (json === undefined) {
    throw new ApiError(
      "The service sent a response we couldn't read. Please try again.",
      "invalid-response",
      `${label} returned HTTP ${response.status} with a body that isn't JSON.`,
      response.status,
    );
  }

  try {
    return parse(json);
  } catch (error) {
    throw new ApiError(
      "The service sent data in an unexpected format. Please try again in a moment.",
      "invalid-response",
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
      response.status,
    );
  }
}

function readErrorMessage(json: unknown): string | undefined {
  if (!isRecord(json)) return undefined;
  const { error, message } = json;
  if (typeof error === "string" && error.trim()) return error.trim();
  if (isRecord(error) && typeof error.message === "string" && error.message.trim()) {
    return error.message.trim();
  }
  if (typeof message === "string" && message.trim()) return message.trim();
  return undefined;
}

function friendlyHttpMessage(status: number, serverMessage?: string): string {
  if (status === 400 || status === 422) {
    return serverMessage
      ? `The service couldn't use that request: ${serverMessage}`
      : "The service couldn't use that request. Check your selected needs and try again.";
  }
  if (status === 404) {
    return "This part of the AccessReady service isn't available right now.";
  }
  if (status >= 500) {
    return "The AccessReady service had a problem. Please try again in a moment.";
  }
  return `The request didn't go through (error ${status}). Please try again.`;
}

/* ------------------------------------------------------------------ */
/* Runtime validation (keeps the UI honest if the contract drifts)     */
/* ------------------------------------------------------------------ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string") throw new Error(`expected ${path} to be a string`);
  return value;
}

function expectCount(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`expected ${path} to be a non-negative number`);
  }
  return value;
}

export function parseClinicsResponse(json: unknown): ClinicsResponse {
  if (!isRecord(json) || !Array.isArray(json.clinics)) {
    throw new Error("expected { clinics: [...] }");
  }
  const clinics: Clinic[] = json.clinics.map((raw, i) => {
    const path = `clinics[${i}]`;
    if (!isRecord(raw)) throw new Error(`expected ${path} to be an object`);
    const capabilities = isRecord(raw.capabilities) ? raw.capabilities : {};
    const cleaned: Record<string, CapabilityStatus> = {};
    for (const [key, value] of Object.entries(capabilities)) {
      if (typeof value === "string") cleaned[key] = value as CapabilityStatus;
    }
    return {
      id: expectString(raw.id, `${path}.id`),
      name: expectString(raw.name, `${path}.name`),
      description: typeof raw.description === "string" ? raw.description : "",
      capabilities: cleaned as Clinic["capabilities"],
    };
  });
  return { clinics, synthetic: true };
}

export function parseMatchResponse(json: unknown): MatchResponse {
  if (!isRecord(json) || !Array.isArray(json.results)) {
    throw new Error("expected { results: [...] }");
  }
  const results: ClinicMatchResult[] = json.results.map((raw, i) => {
    const path = `results[${i}]`;
    if (!isRecord(raw)) throw new Error(`expected ${path} to be an object`);
    if (!Array.isArray(raw.checks)) throw new Error(`expected ${path}.checks to be an array`);
    const checks: RequirementCheck[] = raw.checks.map((check, j) => {
      const checkPath = `${path}.checks[${j}]`;
      if (!isRecord(check)) throw new Error(`expected ${checkPath} to be an object`);
      return {
        requirement: expectString(check.requirement, `${checkPath}.requirement`) as RequirementId,
        status: expectString(check.status, `${checkPath}.status`) as CapabilityStatus,
        explanation: typeof check.explanation === "string" ? check.explanation : "",
      };
    });
    const questions = Array.isArray(raw.verificationQuestions)
      ? raw.verificationQuestions.filter((q): q is string => typeof q === "string" && q.trim() !== "")
      : [];
    return {
      clinicId: expectString(raw.clinicId, `${path}.clinicId`),
      clinicName: expectString(raw.clinicName, `${path}.clinicName`),
      status: expectString(raw.status, `${path}.status`) as MatchStatus,
      confirmedCount: expectCount(raw.confirmedCount, `${path}.confirmedCount`),
      unavailableCount: expectCount(raw.unavailableCount, `${path}.unavailableCount`),
      unknownCount: expectCount(raw.unknownCount, `${path}.unknownCount`),
      checks,
      verificationQuestions: questions,
    };
  });
  return { results, synthetic: true };
}
