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

The clinic screens need the backend routes in `app/api/` (built on the `codex-backennd` branch).
Without them, the frontend shows its error states instead of data.

**For the live demo, run the production build** (`npm run build && npm run start`). It's faster
and serves its assets to any origin. If you use `npm run dev` through a cloud editor's
forwarded port and the page looks unstyled, the dev server is blocking that hostname. Add
it to `allowedDevOrigins` in `next.config.ts`.

### 60-second demo script

1. Open the home page and select **Try demo**. Four mobility needs are preselected.
2. Select **Continue to clinic comparison** to see every fictional clinic side by side.
3. Select **Check compatibility for my 4 needs**. Clinics are ranked Ready, Needs verification, then Not ready, with the reason for every need.
4. Select **Build checklist** on a clinic that needs verification. Copy or download the questions, or open the front-desk card full screen.

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
```

## API

See [`API_CONTRACT.md`](API_CONTRACT.md).

- `GET /api/clinics` lists fictional clinics and their accessibility capabilities.
- `POST /api/match` with `{ "requirements": [...] }` returns a per-clinic compatibility result and verification questions.

## Important

`READY` means the selected requirements are confirmed **in the demonstration dataset**.
It does not guarantee real-world accessibility. Always confirm accommodations with the clinic.
AccessReady never contacts clinics or sends messages for you.
