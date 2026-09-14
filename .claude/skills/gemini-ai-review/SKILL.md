# Gemini AI Review

Use Gemini to pre-triage student submissions and to generate per-lab quiz questions, without weakening human review or breaking the core submission flow.

## Core principle: advisory, not authoritative

- Gemini output is a **suggestion** attached to a submission: a verdict, written feedback, and a confidence level.
- The human instructor makes the final `status` decision. Never let an AI call silently set the authoritative `status` on a submission.
- If the Gemini request fails, times out, or returns malformed output, the submission must still save successfully. AI review is an enhancement, never a blocking dependency.

## Calling Gemini from Cloudflare Workers

- Call the REST endpoint directly with the Workers-native `fetch`; avoid Node-only SDKs that assume a non-Workers runtime.
- Endpoint shape: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}`.
- Store the key as a Worker secret (`wrangler secret put GEMINI_API_KEY`) and in `.dev.vars` for local development. Never commit it or log it.
- Always set a request timeout (for example, `AbortSignal.timeout(...)`) so a slow AI call cannot stall the request pipeline.
- Wrap the call in a try/catch at the service layer; on failure, return a neutral fallback result (e.g. `{ verdict: 'needs_review', feedback: null, confidence: null }`) rather than throwing past the route handler.

## Grading context and prompting

- Ground the model with structured context: lab title, description, an instructor-authored rubric or expected-outcome notes (not just the raw description), and the student's submitted solution.
- Ask for structured output (a small JSON object: verdict, feedback, confidence) and parse defensively; do not trust the model to always return valid JSON on the first try.
- Keep prompts focused on technical assessment of the submitted content only. Do not include unrelated user PII beyond what's needed to grade the submission.

## Quiz question generation

- Prefer pre-generating a small pool of questions per lab (stored in the database) over calling Gemini on every page view. This controls cost, latency, and keeps questions consistent across students.
- Serve a random question from the stored pool using the database's native random ordering, and only regenerate the pool through an explicit instructor/admin action.

## Failure and rate-limit handling

- Treat Gemini API errors, rate limits, and timeouts as expected conditions, not exceptional bugs. Log them, but always let the underlying submission or lab operation continue.
- Avoid retry loops on the request path; a single fast attempt with a fallback is better than blocking the user on retries.
