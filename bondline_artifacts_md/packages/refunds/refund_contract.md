# Refund Logic – Developer Contract

**Rule**: auto-approve if request within 24h and **use < 10%**. Use is met if:
- (sparks_used >= 2 AND minutes_active >= 6) OR
- (curiosity_cues >= 1) OR
- (sealed_notes_saved >= 1)

**Host Pass**: refundable only **before** first rotation starts.

**Anti-gaming**: If an account has 3 approved refunds in 90 days, further purchases are non-refundable until manual review.

## Function signature (TypeScript)

```ts
type RefundInput = {
  purchase_ts: string;
  first_refund_request_ts: string;
  product_id: string;
  events: { sparks_used: number; curiosity_cues: number; sealed_notes_saved: number; };
  minutes_active: number;
  prev_refunds_90d: number;
  is_host_pass: boolean;
  rotation_started: boolean;
};

type RefundResult = { eligible: boolean; reason: string };

export function evaluateRefund(i: RefundInput): RefundResult {
  // Implement per schema; return reason like "outside_24h" | "usage_exceeded" | "host_started" | "ok"
  return { eligible: false, reason: "todo" };
}
```
