"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import type { ClinicsResponse, MatchResponse, RequirementId } from "@/types/api";
import {
  ApiError,
  fetchClinics,
  isAbortError,
  postMatch,
  toApiError,
} from "@/utils/api-client";

export type ApiState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; data: T };

interface Settled<T> {
  key: string;
  state: ApiState<T>;
}

/**
 * Minimal fetch-on-mount hook with abort and retry. No caching layer needed for this MVP.
 * Loading state is derived (no synchronous setState inside the effect).
 */
function useApiResource<T>(
  resourceKey: string,
  load: (signal: AbortSignal) => Promise<T>,
): { state: ApiState<T>; retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const requestKey = `${resourceKey}#${attempt}`;

  const run = useEffectEvent((signal: AbortSignal) => load(signal));

  useEffect(() => {
    const controller = new AbortController();
    run(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setSettled({ key: requestKey, state: { status: "success", data } });
        }
      },
      (error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setSettled({ key: requestKey, state: { status: "error", error: toApiError(error) } });
      },
    );
    return () => controller.abort();
  }, [requestKey]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const state: ApiState<T> =
    settled && settled.key === requestKey ? settled.state : { status: "loading" };

  return { state, retry };
}

export function useClinics() {
  return useApiResource<ClinicsResponse>("clinics", fetchClinics);
}

export function useMatch(needs: readonly RequirementId[]) {
  const key = needs.join(",");
  return useApiResource<MatchResponse>(`match:${key}`, (signal) => postMatch(needs, signal));
}
