# AccessReady

**Healthcare access, confirmed before you arrive.**

AccessReady helps patients with disabilities verify if medical facilities meet their needs before arriving. By matching patient requirements with facility accommodations, it identifies barriers and builds personalized checklists—eliminating surprises and making healthcare inclusive and stress-free.

Built for HackGwinnett 6.0. Every clinic in this prototype is **fictional**.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server            |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | Generate route types, then run `tsc --noEmit` |

## How it works

1. **Tell us your needs.** Pick accommodations such as an accessible entrance or a transfer lift.
2. **Compare accessibility.** See which fictional clinics confirm, lack, or haven't reported each need.
3. **Prepare for your appointment.** Get a checklist of questions to ask the clinic, then copy it or download it as text.

## Project structure

Root-level `app/` directory (no `src/`). See [`AGENTS.md`](AGENTS.md) for who owns which files.

```
app/                 Pages and layouts (frontend)
app/api/             Route handlers: GET /api/clinics, POST /api/match (backend)
components/          React components (frontend)
utils/               Frontend helpers: API client, display metadata (frontend)
lib/                 Matching algorithm, data access (backend)
data/                Synthetic clinic dataset (backend)
tests/               Backend tests (backend)
types/api.ts         Shared TypeScript mirror of the API contract
API_CONTRACT.md      Shared API contract (source of truth)
public/              Static assets, including the Boo mascot
dev-mock/            TEMPORARY dev-only mock API. Delete before the demo.
```

## API

See [`API_CONTRACT.md`](API_CONTRACT.md).

- `GET /api/clinics` lists fictional clinics and their accessibility capabilities.
- `POST /api/match` with `{ "requirements": [...] }` returns a per-clinic compatibility result and verification questions.

## Important

`READY` means the selected requirements are confirmed **in the demonstration dataset**.
It does not guarantee real-world accessibility. Always confirm accommodations with the clinic.
AccessReady never contacts clinics or sends messages for you.
