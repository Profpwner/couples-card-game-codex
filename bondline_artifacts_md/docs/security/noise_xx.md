# Noise_XX Pairing Protocol (Bondline)

This document describes the pairing and key schedule used for sessions.

```text
Pattern: Noise_XX_25519_ChaChaPoly_BLAKE2s
Out-of-band: QR or 6-word code -> { room_id, pub(sA), sas_salt }
```

## Steps

1. Host (A) generates ephemeral static keypair `sA`; encodes `pub(sA)` with `room_id` and `sas_salt` into QR.
2. Joiner (B) scans; generates `sB`.
3. **Msg1 (B→A)**: `eB`
4. **Msg2 (A→B)**: `eA`, `enc(payloadA)`
5. **Msg3 (B→A)**: `enc(payloadB)`

## Key Derivation

```
dh1 = ECDH(eB, sA)
dh2 = ECDH(eA, eB)
dh3 = ECDH(sA, eB)
RK  = HKDF_BLAKE2s(dh1 || dh2 || dh3, "session")
SAS = HKDF_BLAKE2s(RK, "sas" || sas_salt) -> 2–4 word list
K_round[i] = HKDF_BLAKE2s(RK, "round" || i)
```

- AEAD: ChaCha20-Poly1305 per content object under `K_round[i]`.
- Nonces must be unique per (key, message) pair; use a counter per round item.

## Security Properties

- Mutual key agreement (both ephemeral keys unknown to server).
- Forward secrecy after ratchets.
- MITM resistance via SAS phrase verbal confirmation.

See `crypto_kats.md` for test vector seeds and CI requirements.
