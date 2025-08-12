```ts
export type ProductSignals = {
  completion_rate: number;
  repeat_use_30d: number;
  helpful_ratio: number;
  refund_rate: number;
  flag_rate: number;
  recency_days: number;
};

export type Weights = {
  w1: number; w2: number; w3: number; w4: number; w5: number; w6: number;
};

export function rankScore(p: ProductSignals, w: Weights): number {
  const freshness = Math.max(0, 1 - p.recency_days / 30);
  return (
    w.w1 * p.completion_rate +
    w.w2 * p.repeat_use_30d +
    w.w3 * p.helpful_ratio -
    w.w4 * p.refund_rate -
    w.w5 * p.flag_rate +
    w.w6 * freshness
  );
}
```
