#!/usr/bin/env node
/**
 * TEMPORARY DEV-ONLY MOCK API. DELETE THIS FOLDER BEFORE THE DEMO.
 *
 * It lets the frontend be built and tested before the real backend (Codex, app/api/**) lands.
 * It is never imported by the app. `next dev` proxies to it only when
 * ACCESSREADY_DEV_MOCK_API is set, and only for /api/* paths with no real route handler.
 *
 * This is NOT the real matching algorithm or dataset. It only mimics the shapes
 * in API_CONTRACT.md. Every clinic name is tagged [DEV MOCK] so it can't be mistaken for real data.
 *
 *   npm run dev:mock-api                              # http://127.0.0.1:4010
 *   ACCESSREADY_DEV_MOCK_API=http://127.0.0.1:4010 npm run dev
 *
 * Options (env): MOCK_PORT=4010  MOCK_DELAY_MS=600  MOCK_FAIL=clinics|match|all
 */
import http from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 4010);
const DELAY_MS = Number(process.env.MOCK_DELAY_MS ?? 600);
const FAIL = process.env.MOCK_FAIL ?? "";

const LABELS = {
  accessible_entrance: "a wheelchair-accessible entrance",
  adjustable_exam_table: "an adjustable examination table",
  transfer_lift: "a patient transfer lift",
  trained_assistance: "trained transfer assistance",
  sign_language_interpreter: "a sign-language interpreter",
  quiet_waiting_area: "a quiet waiting area",
};

const CLINICS = [
  {
    id: "mock-lantern-grove",
    name: "[DEV MOCK] Lantern Grove Health",
    description: "[DEV MOCK] Primary care practice with a recently renovated accessible suite.",
    capabilities: {
      accessible_entrance: "CONFIRMED",
      adjustable_exam_table: "CONFIRMED",
      transfer_lift: "CONFIRMED",
      trained_assistance: "CONFIRMED",
      sign_language_interpreter: "UNKNOWN",
      quiet_waiting_area: "CONFIRMED",
    },
  },
  {
    id: "mock-moonbeam",
    name: "[DEV MOCK] Moonbeam Family Clinic",
    description: "[DEV MOCK] Family medicine office in a shared medical building.",
    capabilities: {
      accessible_entrance: "CONFIRMED",
      adjustable_exam_table: "CONFIRMED",
      transfer_lift: "UNKNOWN",
      trained_assistance: "CONFIRMED",
      sign_language_interpreter: "CONFIRMED",
      quiet_waiting_area: "UNAVAILABLE",
    },
  },
  {
    id: "mock-hollow-creek",
    name: "[DEV MOCK] Hollow Creek Medical",
    description: "[DEV MOCK] Urgent care center in an older two-story building.",
    capabilities: {
      accessible_entrance: "CONFIRMED",
      adjustable_exam_table: "UNAVAILABLE",
      transfer_lift: "UNAVAILABLE",
      trained_assistance: "UNKNOWN",
      sign_language_interpreter: "UNKNOWN",
      quiet_waiting_area: "CONFIRMED",
    },
  },
  {
    id: "mock-willowmere",
    name: "[DEV MOCK] Willowmere Community Clinic",
    description: "[DEV MOCK] New listing. Most accessibility details have not been reported yet.",
    capabilities: {
      accessible_entrance: "UNKNOWN",
    },
  },
];

function evaluate(clinic, requirements) {
  const checks = requirements.map((requirement) => {
    const status = clinic.capabilities[requirement];
    const label = LABELS[requirement];
    if (status === "CONFIRMED")
      return { requirement, status, explanation: `The demonstration record lists ${label} as confirmed.` };
    if (status === "UNAVAILABLE")
      return { requirement, status, explanation: `The demonstration record lists ${label} as not available.` };
    return {
      requirement,
      status: "UNKNOWN",
      explanation: status
        ? `Availability of ${label} has not been verified.`
        : `This record does not include any information about ${label}.`,
    };
  });
  const missing = requirements.some((r) => !(r in clinic.capabilities));
  const confirmedCount = checks.filter((c) => c.status === "CONFIRMED").length;
  const unavailableCount = checks.filter((c) => c.status === "UNAVAILABLE").length;
  const unknownCount = checks.filter((c) => c.status === "UNKNOWN").length;
  const status = missing
    ? "INCOMPLETE"
    : unavailableCount > 0
      ? "NOT_READY"
      : unknownCount > 0
        ? "NEEDS_VERIFICATION"
        : "READY";
  const verificationQuestions = checks
    .filter((c) => c.status !== "CONFIRMED")
    .map((c) =>
      c.status === "UNAVAILABLE"
        ? `Your records list ${LABELS[c.requirement]} as unavailable. Is there an alternative arrangement for my appointment?`
        : `Can you confirm whether ${LABELS[c.requirement]} is available for my appointment?`,
    );
  return {
    clinicId: clinic.id,
    clinicName: clinic.name,
    status,
    confirmedCount,
    unavailableCount,
    unknownCount,
    checks,
    verificationQuestions,
  };
}

function send(res, code, body) {
  setTimeout(() => {
    res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body));
  }, DELAY_MS);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/clinics") {
    if (FAIL === "clinics" || FAIL === "all") return send(res, 503, { error: "Mock clinic service is down." });
    return send(res, 200, { clinics: CLINICS, synthetic: true });
  }

  if (req.method === "POST" && url.pathname === "/api/match") {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      if (FAIL === "match" || FAIL === "all") return send(res, 503, { error: "Mock matching service is down." });
      let body;
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        return send(res, 400, { error: "Request body must be valid JSON." });
      }
      const reqs = body?.requirements;
      if (!Array.isArray(reqs) || reqs.length === 0 || reqs.some((r) => !(r in LABELS))) {
        return send(res, 400, { error: "requirements must be a non-empty array of known requirement IDs" });
      }
      return send(res, 200, { results: CLINICS.map((c) => evaluate(c, reqs)), synthetic: true });
    });
    return;
  }

  send(res, 404, { error: `No mock for ${req.method} ${url.pathname}` });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[dev-mock] AccessReady mock API on http://127.0.0.1:${PORT} (DEV ONLY - delete before demo)`);
});
