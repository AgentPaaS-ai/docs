---
id: trust-model
title: Trust model
sidebar_label: Trust model
---

This page describes what AgentPaaS publisher signatures prove, what they do
not prove, and how receivers should establish trust.

For the overall security threat model, see [threat model](./threat-model). For
accepted gaps, see [known limitations](./known-limitations).

## 1. What a publisher signature proves

A publisher signature on a lock file proves exactly one thing:

> The holder of the private key corresponding to the displayed fingerprint
> signed these bytes.

Technically: the signature is an ECDSA P-256 signature over the canonical map
of the lock file (every field except the signature fields themselves).
Verifying the signature confirms that:

- The lock bytes were produced by someone who controlled the private key at
  signing time.
- The bytes have not been modified since signing (integrity).
- The publisher block embedded in the lock is self-consistent (the PEM-encoded
  public key's fingerprint matches the stored fingerprint field).

Provenance entries are individually signed by their respective publishers, so
a verified provenance chain confirms that each intermediate publisher signed a
claim about their parent artifact. The last-signer rule ties the chain to the
artifact.

## 2. What a publisher signature does NOT prove

A valid signature establishes cryptographic integrity from a key holder. It
does NOT establish any of the following:

- **Safety.** The signed agent may contain harmful behaviour, exfiltrate data,
  or request overly broad credentials. The signature says nothing about what
  the code does. It says only that the key holder produced it and it has not been
  tampered with in transit.
- **Authorship of intent.** The key holder may have signed a bundle they did
  not write, did not understand, or were socially engineered into signing.
- **Absence of malice.** A publisher with a known-good reputation can ship a
  malicious agent. Trust in the person behind the key is a social decision.
- **Key custody.** The publisher's private key may be compromised. There is no
  revocation mechanism in the current release.
- **Binary-level tamper-proofing.** The signature covers the lock file and
  provenance entries. Image layers are verified through digest chaining during
  install. A signed lock with a tampered image payload fails at the
  digest-verification stage, not at signature verification.

## 3. TOFU and out-of-band fingerprint verification

AgentPaaS uses **Trust-On-First-Use (TOFU)** for publisher keys.

1. A receiver obtains a bundle.
2. The receiver runs `agentpaas install <bundle>`.
3. On a never-before-seen publisher fingerprint, AgentPaaS displays the
   consent card with the fingerprint in display form
   (`a1b2 c3d4 e5f6 7890 …`).
4. The receiver must **verify the fingerprint out-of-band**. Read it aloud on
   a call, compare it against a trusted channel, or check a team registry.
5. Only after confirming the match does the receiver approve the install.
   AgentPaaS records the fingerprint in the trust store at
   `~/.agentpaas/trust/publishers.json`.

TOFU without out-of-band verification is **not trust**. If a receiver clicks
through the consent card without checking the fingerprint, an impersonator who
substituted their own key passes the check.

Once a fingerprint is pinned, subsequent bundles from the same publisher are
recognized automatically. If the publisher rotates their key, the old
fingerprint is no longer valid and AgentPaaS **hard-fails** rather than
silently accepting a new key for a known publisher.

## 4. Key rotation consequences

Publisher key rotation (`agentpaas identity init --force-rotate`) generates a
new ECDSA P-256 keypair with a new fingerprint.

- New bundles are signed with the new key. Old bundles still verify against
  the old public key if the receiver has it pinned.
- Receivers who pinned the old key **hard-fail** on bundles signed with the
  new key and must re-verify the new fingerprint out-of-band.
- There is no automatic key transition or trust delegation in the current
  release. Key rotation is a **trust reset**.

Best practice: avoid unnecessary rotation. Treat the publisher keypair like a
long-lived identity credential and keep an encrypted offline backup
(`agentpaas identity export`).

## 5. Provenance chains and forks

Forked and re-exported bundles carry a **provenance chain**: an ordered list
of signed entries in the lock, each from a publisher who claims how their
artifact relates to a parent (digest + policy delta summary).

### What a chain proves

- **Per-hop parent claims.** Each entry is signed by that hop's publisher and
  claims the identity and integrity of the parent lock.
- **Final artifact integrity.** The lock you hold is signed by the **tail**
  publisher; signature verification ties the chain's last entry to that key.
- **Policy deltas (signer-claimed).** Each hop can record how policy changed
  relative to the claimed parent. These are assertions by the signer, not
  independently verified unless you hold the parent artifacts and compare.

### What a chain does NOT prove

- **Parent content.** The chain embeds digests and delta summaries, not parent
  source or full parent locks.
- **Absence of deleted lineage.** A publisher may omit a parent reference and
  claim original authorship. This is an unavoidable property of any
  redistribution model.
- **Safety of any hop.** Each signer attests to their own packaging step, not
  that the agent is safe to run.

### Tail-anchor trust rule

Anchor your trust decision on the **final signer**, the publisher whose key
signed the lock you are installing. Earlier signers are lineage claims, not a
substitute for reviewing the tail signature and policy.

Chains are limited to **32 entries** to bound lock size and receiver work.
Beyond the cap, `pack` fails with advice to publish as a new original.

## 6. Documentation language rules

All AgentPaaS documentation, CLI output, consent cards, and plugin messages
follow these rules when describing signatures and provenance:

| Never say | Always say |
|-----------|------------|
| "verified safe" or "safe to run" | "from `<publisher>`, unmodified since signing" |
| "trusted publisher means" | Describe what the signature proves (section 1) separately from what it does not (section 2) |
| "guaranteed safe" or "secure" alone | "cryptographically signed" or "integrity-verified" |

The word **signed** must always co-occur with wording that clarifies what the
signature establishes (integrity + key possession) and does not establish
(safety, intent). These rules exist because **signing is not a safety
guarantee**, and any language that implies otherwise trains users to click
through a security boundary without understanding what they are consenting to.

## 7. Trust store file

The trust store lives at `~/.agentpaas/trust/publishers.json` (mode 0600,
directory 0700). Each entry records the fingerprint (the canonical identity),
an optional local alias, the public key PEM, first-seen and last-used
timestamps, and the source. Fingerprints are the identity; aliases are local
conveniences, and collisions are warnings, not errors.

## Related

- [Threat model](./threat-model)
- [Known limitations](./known-limitations)
- [How enforcement works](./how-enforcement-works)
