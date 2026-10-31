import type { RequirementId } from "@/types/api";
import { isRequirementId, orderRequirements } from "@/utils/requirements";

/**
 * Selected needs travel between screens in the URL (?needs=a,b,c), not in a global store.
 * Reloading, sharing a link, and going back all just work.
 */
export const NEEDS_PARAM = "needs";

type ParamValue = string | string[] | undefined | null;

export function parseNeeds(value: ParamValue): RequirementId[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  return orderRequirements(
    raw
      .split(",")
      .map((part) => part.trim())
      .filter(isRequirementId),
  );
}

export function serializeNeeds(needs: readonly RequirementId[]): string {
  return orderRequirements(needs).join(",");
}

/** Build an in-app href that carries the selected needs plus optional extra params. */
export function hrefWithNeeds(
  path: string,
  needs: readonly RequirementId[],
  extra: Record<string, string | undefined> = {},
): string {
  const parts: string[] = [];
  if (needs.length > 0) parts.push(`${NEEDS_PARAM}=${serializeNeeds(needs)}`);
  for (const [key, value] of Object.entries(extra)) {
    if (value !== undefined && value !== "") {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return parts.length > 0 ? `${path}?${parts.join("&")}` : path;
}

/** Read a single string from a Next.js searchParams record. */
export function firstParam(value: ParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}
