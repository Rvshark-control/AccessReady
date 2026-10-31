<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AccessReady: rules for coding agents

AccessReady is a Next.js 16 (App Router, root-level `app/`, no `src/`) + TypeScript + Tailwind CSS v4 app.
Two agents build it **at the same time in this same working tree**:

- **Claude Code** builds the frontend.
- **Codex** builds the backend.

## File ownership

Only edit files you own. Each agent must leave the other agent's files untouched.

| Path | Owner | Contents |
| --- | --- | --- |
| `app/api/**` | Codex (backend) | Route handlers: `GET /api/clinics`, `POST /api/match` |
| `lib/**` | Codex (backend) | Matching algorithm, data access, validation |
| `data/**` | Codex (backend) | Synthetic (fictional) clinic dataset |
| `tests/**` | Codex (backend) | Backend tests |
| `app/**` except `app/api/**` | Claude (frontend) | Pages, layouts, `globals.css` |
| `components/**` | Claude (frontend) | React components |
| `utils/**` | Claude (frontend) | Frontend-only helpers (API client, display metadata) |
| `public/**` | Claude (frontend) | Static assets, including the Boo mascot |
| `dev-mock/**` | Claude (frontend) | Temporary dev-only mock API. Deleted before the demo. |
| `API_CONTRACT.md`, `types/api.ts` | Shared | Change only with agreement from both sides |
| `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `AGENTS.md`, `README.md` | Shared | Additive edits only. Never rewrite, reorder, or remove the other side's entries. |

## Integration rules

- `API_CONTRACT.md` is the source of truth for request and response shapes. `types/api.ts` mirrors it.
  The backend may import contract types with `import type { MatchResponse } from "@/types/api"`.
- The frontend only calls `GET /api/clinics` and `POST /api/match` with `fetch`. It never recomputes match statuses.
- The `@/*` import alias maps to the repository root, for example `@/lib/...` or `@/components/...`.
- Every clinic is fictional. Responses must include `"synthetic": true`.
- No authentication and no database.

## Shared working tree: safety rules

- Do not run `create-next-app` or reinitialize the project. It already exists.
- Do not run `git checkout`, `git switch`, `git stash`, `git reset`, `git clean`, or anything else
  that rewrites the working tree. The other agent's uncommitted work lives here too. Leave branch and commit management to the human.
- Add dependencies with `npm install <pkg>`. Don't hand-edit dependency lists or delete `package-lock.json`.
- Don't delete or rename files you don't own, even if they look unused.

## Next.js 16 notes for this repo

- `cacheComponents` and `partialPrefetching` are enabled in `next.config.ts`.
- A `GET` route handler that doesn't read the request or any runtime data is prerendered at build time.
  A static JSON dataset response is fine. `POST` handlers always run at request time.
- Don't export `runtime` from route segments. Cache Components doesn't support it.
- Pages read `searchParams` and `params` inside a `<Suspense>` boundary. Never at the top level of a page.

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```
