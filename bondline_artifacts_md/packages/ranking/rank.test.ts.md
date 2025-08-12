```ts
import { rankScore, ProductSignals } from "./rank";

const w = { w1:0.4, w2:0.2, w3:0.2, w4:0.1, w5:0.05, w6:0.05 };

test("ranking order is stable on fixture", () => {
  const p1: ProductSignals = {completion_rate:0.78, repeat_use_30d:0.42, helpful_ratio:0.65, refund_rate:0.02, flag_rate:0.001, recency_days:3};
  const p2: ProductSignals = {completion_rate:0.55, repeat_use_30d:0.30, helpful_ratio:0.58, refund_rate:0.03, flag_rate:0.002, recency_days:10};
  const p3: ProductSignals = {completion_rate:0.66, repeat_use_30d:0.25, helpful_ratio:0.60, refund_rate:0.01, flag_rate:0.001, recency_days:1};
  const s1 = rankScore(p1, w);
  const s2 = rankScore(p2, w);
  const s3 = rankScore(p3, w);
  expect(s1).toBeGreaterThan(s2);
  expect(s3).toBeGreaterThan(s2);
});
```
