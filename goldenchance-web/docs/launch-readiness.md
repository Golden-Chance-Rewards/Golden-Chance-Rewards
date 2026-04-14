# Launch Readiness Plan (Monday/Tuesday Team Review)

## Current Status

- Production build passes (`npm run build`).
- Lint passes with warnings only (`npm run lint`).
- App routes are statically prerendered and deployable.

## Monday Plan (Freeze + Deploy Candidate)

1. **Code Freeze Window (AM)**
   - Freeze feature changes to `main`.
   - Allow only hotfixes for launch blockers.

2. **Release Candidate Validation (AM)**
   - Run checks:
     - `npm ci`
     - `npm run lint`
     - `npm run build`
   - Smoke test these pages:
     - `/`
     - `/auth`
     - `/dashboard`
     - `/missions`
     - `/challenges`
     - `/rewards`
     - `/leaderboard`
     - `/wallet`
     - `/profile`
     - `/history`

3. **Deployment (PM)**
   - Deploy to production host (recommended: Vercel for Next.js).
   - Attach custom domain and verify SSL.
   - Confirm no 404/500 responses across key routes.

4. **Observability + Fallback (PM)**
   - Enable runtime logs/alerts.
   - Define rollback plan to previous working build.

## Tuesday Plan (Team Review Day)

1. **Pre-Review Check (Before Meeting)**
   - Confirm site availability and response times.
   - Confirm core navigation and CTA flows.

2. **Team Walkthrough**
   - Demo key user journeys end-to-end.
   - Capture defects and priority tags (`P0`, `P1`, `P2`).

3. **Post-Review Triage**
   - Resolve `P0` items same day.
   - Schedule `P1/P2` items into sprint backlog.

## Go-Live Acceptance Criteria

- `npm run build` succeeds.
- `npm run lint` has zero errors.
- Key routes load on desktop and mobile.
- No broken nav links.
- Domain + SSL working.
- Rollback procedure documented and tested.

## Suggested Owners

- **Release owner:** Merge gate + go/no-go call.
- **Frontend owner:** Smoke tests and visual QA.
- **Ops owner:** Deployment, domain, SSL, rollback.
- **QA owner:** Review checklist and defect triage.

## Open Risks

- Current lint warnings for `<img>` usage may impact image performance (LCP). Not a launch blocker for internal review, but should be addressed before public launch.
