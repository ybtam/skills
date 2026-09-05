# Behavioral guidance for instruction audits

Source: OpenAI, [Using GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra), fetched 2026-09-05. These notes paraphrase its prompting guidance for instruction audits. They do not cover API migration. Model-specific observations describe the documentation at that date, not a guarantee about every run or another model.

The article describes Astra as sensitive to instruction details and more likely to ask questions when an answer could change the result. It also discusses detailed writing, delegation frequency, and thorough verification. Use these observations to form hypotheses about the target instructions; inspect the actual sources before proposing changes.

## Initiative and follow-through

Check whether instructions distinguish missing information from missing permission. Repeated requests for approval can arise when a generic rule such as “always ask before proceeding” applies even after the user authorized the work. A possible scoped replacement is: “Complete work already authorized by the user. Ask when a missing decision materially changes the result or an explicit approval boundary is reached.”

Preserve the difference between an action request and a question. “Can you fix this error?” requests work; “Can you explain this code?” requests an explanation. Do not use the article's action-oriented examples to turn all questions into edit permission.

For an external action that requires approval, prepare the concrete reviewable result first when that preparation is authorized. If the project requires a plan review before implementation, that is the applicable boundary: autonomy guidance must preserve it. Likewise, an article example mentioning worktrees does not override a user's worktree prohibition.

## Instruction following and conflicts

Map the instructions that apply to the relevant files and task. An apparent conflict may be a narrow rule refining a broader default. Prefer clarifying scope over deleting either instruction blindly. The host's instruction hierarchy still applies; a skill cannot grant itself authority over higher-priority instructions.

The article recommends respecting explicit user instructions over skill guidelines and naming the exact skill instruction when it causes a pause. Make that distinction visible in findings. “This file requires approval” and “I inferred approval would be useful” are different claims.

Example: a root letter says “ask before deployment,” while a skill says “ask before every reversible change.” Propose limiting the skill's approval language to the agreed external-action boundary. If the user explicitly requires review before implementation, retain that earlier gate instead.

Repeated rules can drift apart. Keep one authoritative definition and use precise pointers that say when to read it. Do not collapse important distinctions just to shorten the document.

## Personality and writing style

The article notes a tendency toward detailed, formatted responses and recurring phrases. Check whether the user's preferred length, audience, structure, and tone are stated clearly enough to guide useful output.

A suitable preference might be: “Lead with the result, then explain the evidence the reader needs. Use concise paragraphs; use lists or tables when they make parallel information easier to compare.” Adapt this to the user's format, such as a letter-style AGENTS.md. Avoid replacing the user's voice with an exhaustive list of banned words or a generic personality template.

## Delegation

The article suggests explicitly describing when and how to delegate. It does not require maximal delegation for every project. Preserve the user's chosen models, cost constraints, and single-pass exceptions.

Look for a useful decision rule: delegate a bounded independent task when it can improve quality or save time, while the parent has meaningful work to do. A small edit may not justify another agent. Do not invent unavailable agent capabilities, silently switch models, or label an intentional low-delegation policy as broken.

## Testing and verification

Check whether the rules identify evidence required by the change or demand a broad suite after every edit. Prefer “Run the checks needed for the change and complete required gates; broaden testing when failures, new changes, or unresolved concerns justify it” over an unconditional instruction to run everything repeatedly.

Proportional testing does not mean skipping required CI, dropping a failing test, or declaring incomplete work finished. Keep behavior-based tests and relevant integration checks. Avoid new tests that only assert the replacement prose contains particular phrases.

## Interpreting evidence

A reported pause is a symptom, not proof that a particular sentence caused it. Label source-based explanations as hypotheses unless a reproducible evaluation confirms them. When editing is authorized, compare behavior using representative requests and the relevant instruction set. State whether evaluation was executed, simulated, or only reviewed by reasoning.

When refreshing guidance, fetch the exact official model page. If it has changed or cannot be reached, preserve the local task's explicit requirements and explain which recommendations come from these bundled notes. An offline source audit can still proceed. No API key or live model call is needed to inspect local instructions.
