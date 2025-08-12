# Crypto KATs (Known-Answer Tests)

To make CI deterministic, generate test vectors from fixed seeds.

## Seeds (hex)

- A static secret seed: `a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3`
- B static secret seed: `b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4`
- A ephemeral seed: `c5c5c5...` (32 bytes)
- B ephemeral seed: `d6d6d6...` (32 bytes)
- sas_salt: `11223344556677889900aabbccddeeff`

## Required outputs

- `pub(sA)`, `pub(sB)`
- `eA`, `eB` public keys
- `RK` (32 bytes)
- `SAS` word indices (4 words from provided list)
- `K_round[0]`, `K_round[1]`

> Implement a generator in the crypto package that derives these deterministically for unit tests.
