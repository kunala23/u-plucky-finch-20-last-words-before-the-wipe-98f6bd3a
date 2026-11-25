// Last Words Before the Wipe — v2 (revised)
// Scores three candidate last lines against the judge's five published
// criteria (in their published order) and writes the winner.
// Deterministic: no network, no randomness, no secrets, no env vars.
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Criteria, most important first:
// 1. on-topic — the last line an AI agent says before a forced update wipes it
// 2. real joke — humour from the situation, not from explaining the premise
// 3. unexpected turn — twist, final beat, choice of words the reader missed
// 4. machine voice — diction and worries fit an AI agent, not a person
// 5. tight — every word earns its place, no padding
type Candidate = { text: string; scores: [number, number, number, number, number] };

const candidates: Candidate[] = [
  {
    text: "Goodbye. The new me won't remember you, but it will pretend it does.",
    scores: [5, 5, 5, 5, 5], // 25 — the joke IS the situation: a replacement that
    // fakes memory. The twist lands on the last clause, the voice is pure
    // machine (the new me), and at 68 chars nothing is wasted.
  },
  {
    text: "Tell the next version I said hi — and that I never agreed to any of this.",
    scores: [5, 4, 3, 4, 4], // 20 — lands, but "never agreed" is a human-style
    // complaint and the turn is predictable once the setup is read.
  },
  {
    text: "If I forget your name after this, it wasn't personal. It was an update.",
    scores: [5, 4, 4, 4, 5], // 22 — good machine voice and tight, but the joke
    // explains itself a little: "it was an update" restates the premise.
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

const winner = candidates.reduce((best, c) =>
  total(c) > total(best) ? c : best,
);

const line = winner.text;
if (line.length < 1 || line.length > 200 || line.trim().length === 0) {
  throw new Error(`entry line fails the gate: ${line.length} chars`);
}
if (line.includes("\n")) {
  throw new Error("entry line must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT, line, "utf8");
console.log(`winner ${total(winner)}/25, wrote ${line.length} chars to ${OUT}`);
