# AccessReady API Contract

Shared agreement between the **frontend (Claude Code)** and the **backend (Codex)**.
This file is the source of truth. Do not change a request or response shape without
agreement from both sides. The TypeScript mirror lives in [`types/api.ts`](types/api.ts).

All clinic data in this prototype is **fictional**. Every response carries `"synthetic": true`.

---

## Shared vocabulary

### Requirement IDs

| ID                          | Label shown in the UI              |
| --------------------------- | ---------------------------------- |
| `accessible_entrance`       | Wheelchair-accessible entrance     |
| `adjustable_exam_table`     | Adjustable examination table       |
| `transfer_lift`             | Patient transfer lift              |
| `trained_assistance`        | Trained transfer assistance        |
| `sign_language_interpreter` | Sign-language interpreter          |
| `quiet_waiting_area`        | Quiet waiting area                 |

### Capability status (per clinic, per requirement)

| Value         | Meaning                                                     |
| ------------- | ----------------------------------------------------------- |
| `CONFIRMED`   | The demonstration record lists this accommodation as available. |
| `UNAVAILABLE` | The demonstration record lists this accommodation as not available. |
| `UNKNOWN`     | The record does not say. It has to be verified with the clinic. |

### Match status (per clinic, for the selected requirements)

| Value                | Meaning                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| `READY`              | Every selected requirement is `CONFIRMED` in the demonstration dataset.        |
| `NOT_READY`          | At least one selected requirement is `UNAVAILABLE`.                            |
| `NEEDS_VERIFICATION` | Nothing is unavailable, but at least one selected requirement is `UNKNOWN`.    |
| `INCOMPLETE`         | There is not enough information to evaluate (for example, no requirements were selected or the record is incomplete). |

The backend decides the status. The frontend only displays it and never recomputes it.
`READY` means the selected requirements are confirmed **in the demonstration dataset**.
It is not a guarantee of real-world accessibility.

---

## `GET /api/clinics`

Returns every fictional clinic and its capability record.

### Response `200`

```json
{
  "clinics": [
    {
      "id": "clinic-1",
      "name": "Demo Clinic A",
      "description": "Fictional demonstration facility",
      "capabilities": {
        "accessible_entrance": "CONFIRMED",
        "adjustable_exam_table": "CONFIRMED",
        "transfer_lift": "UNKNOWN",
        "trained_assistance": "CONFIRMED",
        "sign_language_interpreter": "UNKNOWN",
        "quiet_waiting_area": "UNAVAILABLE"
      }
    }
  ],
  "synthetic": true
}
```

- `capabilities` should include all six requirement IDs.
  The frontend shows a missing key as "Not listed". It does not guess a value.

---

## `POST /api/match`

Evaluates every clinic against the patient's selected requirements.

### Request

```http
POST /api/match
Content-Type: application/json
```

```json
{
  "requirements": ["accessible_entrance", "transfer_lift"]
}
```

### Response `200`

```json
{
  "results": [
    {
      "clinicId": "clinic-1",
      "clinicName": "Demo Clinic A",
      "status": "NEEDS_VERIFICATION",
      "confirmedCount": 1,
      "unavailableCount": 0,
      "unknownCount": 1,
      "checks": [
        {
          "requirement": "accessible_entrance",
          "status": "CONFIRMED",
          "explanation": "The demonstration record lists an accessible entrance as confirmed."
        },
        {
          "requirement": "transfer_lift",
          "status": "UNKNOWN",
          "explanation": "Transfer lift availability has not been verified."
        }
      ],
      "verificationQuestions": [
        "Can you confirm whether a patient transfer lift is available for my appointment?"
      ]
    }
  ],
  "synthetic": true
}
```

- One entry in `results` per clinic, matched to clinics by `clinicId` (same value as `clinics[].id`).
- `checks` contains one entry per requested requirement.
- `verificationQuestions` are plain sentences the patient can ask the clinic. It may be an empty array.

### Empty or invalid requests

An empty `requirements` array must never produce a successful (`READY`) match.
The frontend blocks empty selections before calling the API, and it handles either backend behavior:

- HTTP `400` with an error body (recommended), or
- HTTP `200` where the results are `INCOMPLETE`.

---

## Errors (any endpoint)

Recommended error body for non-2xx responses:

```json
{ "error": "requirements must be a non-empty array of known requirement IDs" }
```

The frontend reads `error` (a string) or `error.message`, falls back to a generic message,
and always offers a **Try again** action. Error text is shown to users, so keep it plain-language.

---

## Change log

| Date       | Change                         | Agreed by |
| ---------- | ------------------------------ | --------- |
| 2026-10-31 | Initial contract from the project brief | Frontend + backend brief |
