const DEFAULT_MODEL = 'gemini-3.6-flash';
const REQUEST_TIMEOUT_MS = 20_000;
const THINKING_BUDGET = 128;
const VERDICTS = new Set(['approved', 'rejected', 'needs_review']);

function buildEndpoint(model, apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
}

async function callGemini(env, prompt) {
  const apiKey = env?.GEMINI_API_KEY;
  if (!apiKey) return null;
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;

  try {
    const response = await fetch(buildEndpoint(model, apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingBudget: THINKING_BUDGET },
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const text = parts.find((part) => !part.thought && typeof part.text === 'string' && part.text.trim())?.text;
    if (!text) return null;

    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function reviewSubmission(env, { lab, solution }) {
  const prompt = [
    'You are grading a hands-on technical lab submission for a training platform.',
    `Lab title: ${lab.title}`,
    `Lab category: ${lab.category}`,
    `Lab difficulty: ${lab.difficulty}`,
    `Lab description: ${lab.description}`,
    lab.rubric ? `Grading rubric / expected outcome: ${lab.rubric}` : '',
    `Student submission:\n${solution}`,
    'Judge whether the submission reasonably solves the lab.',
    'Respond with ONLY a JSON object of this exact shape: {"verdict": "approved" | "rejected" | "needs_review", "feedback": string, "confidence": number between 0 and 1}.',
    'Use "needs_review" when you are not confident enough to decide, or the submission is ambiguous, partially correct, or missing context a human reviewer would need.',
    'Keep feedback specific, constructive, and under 80 words.',
  ].filter(Boolean).join('\n\n');

  const result = await callGemini(env, prompt);
  if (!result || !VERDICTS.has(result.verdict)) {
    return { verdict: 'needs_review', feedback: null, confidence: null };
  }

  const confidence = typeof result.confidence === 'number' && Number.isFinite(result.confidence)
    ? Math.min(1, Math.max(0, result.confidence))
    : null;

  return {
    verdict: result.verdict,
    feedback: typeof result.feedback === 'string' ? result.feedback.trim().slice(0, 2000) : null,
    confidence,
  };
}

export async function generateQuizQuestion(env, lab) {
  const prompt = [
    'You are creating a single short conceptual practice question for a hands-on technical lab.',
    `Lab title: ${lab.title}`,
    `Lab category: ${lab.category}`,
    `Lab difficulty: ${lab.difficulty}`,
    `Lab description: ${lab.description}`,
    'Respond with ONLY a JSON object of this exact shape: {"question": string}.',
    'The question should test understanding of the lab topic, be answerable in a sentence or two, and must not repeat the lab description verbatim.',
  ].join('\n\n');

  const result = await callGemini(env, prompt);
  if (!result || typeof result.question !== 'string' || !result.question.trim()) {
    return { question: null };
  }
  return { question: result.question.trim().slice(0, 600) };
}
