# Bondline – Codegen Artifacts (Markdown Pack)

This folder contains **machine-readable artifacts** for web & mobile code generation.
Files use `*.md` wrappers so you can download & view them easily. Each `*.md` file
contains a single code block with the true file contents in its native format (YAML/JSON/TS/SQL/etc.).

> **How to use with CLI tools**
> - If your tool expects the native extension (e.g. `.yaml`, `.json`, `.ts`), strip the trailing `.md` when saving.
> - The content inside the fenced code block is the source of truth.

## Contents

- `docs/openapi.yaml.md` – REST API (OpenAPI 3.1)
- `docs/asyncapi.yaml.md` – Lounge realtime channels (AsyncAPI 3.0)
- `packages/schemas/*.schema.json.md` – JSON Schemas for bundles, consent, evidence, analytics, refunds
- `services/db/schema.sql.md` – Postgres DDL
- `services/db/prisma.schema.prisma.md` – Prisma schema mapping
- `docs/security/noise_xx.md` – Pairing protocol (Noise_XX) & per‑round ratchet
- `docs/security/crypto_kats.md` – KAT spec for crypto (test vector seeds)
- `docs/llm/*.md` – Prompts & JSON contracts for LLM evaluator & helpers
- `docs/policies/*.md` – DPA (LLM provider), Creator Agreement, Marketplace Terms, Privacy Policy
- `docs/policies/moderation_rules.yaml.md` – Machine‑readable policy
- `assets/bundles/*.bondle.json.md` – Example Game bundles
- `assets/audio/audio_manifest.json.md` – Audio asset manifest
- `assets/haptics/haptic_breath_6cpm.json.md` – Haptics pattern
- `packages/ranking/*` – Ranking harness (CSV + TS + tests)
- `packages/refunds/refund_contract.md` – Refund logic spec & interface
- `.github/workflows/*.yml.md` – CI pipelines
- `docs/tokens.json.md` – Design tokens (UI)

> Security invariants (for all codegen):
> - Session content is **E2EE**; servers never see plaintext.
> - Pairing uses **Noise_XX** (X25519/ChaCha20‑Poly1305/BLAKE2s) + SAS words.
> - Round keys derive from `K_round[i] = HKDF(RK, "round" || i)`; no nonce reuse.
> - No ads; analytics are **opt‑in** and **counts‑only**.
