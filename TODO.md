# TODO - KLV/KLA rename + tracker connectivity fixes

- [ ] Rename all remaining `KLA_*` / `kla_*` site variables to `KLV_*` and ensure SetupWizard embeds `window.KLV_SITE_ID` + `window.KLV_API_URL`.
- [ ] Fix tracker.js init detection: remove dependency on old globals as needed; ensure it uses only `window.KLV_*`.
- [ ] Verify tracking script posts to the correct endpoint (no wrong host/paths) and includes required payload fields.
- [ ] Patch backend `analytics-track` validation/DB columns mismatch if found (event_type/session columns naming).
- [ ] Run TypeScript check/build and basic lint/test commands if available.
- [ ] Smoke-test: ensure browser fetch/sendBeacon gets non-4xx/5xx responses (debug via browser console instructions).
- [ ] Fix SetupWizard indentation regression (trackingCode block got over-indented).
