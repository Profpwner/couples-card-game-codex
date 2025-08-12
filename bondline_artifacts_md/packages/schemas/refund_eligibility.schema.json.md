```json
{
  "$id": "https://bondline.app/schema/refund_eligibility.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Refund Eligibility Contract",
  "type": "object",
  "required": ["purchase_ts","first_refund_request_ts","product_id","events","minutes_active","prev_refunds_90d","is_host_pass","rotation_started"],
  "properties": {
    "purchase_ts": { "type": "string", "format": "date-time" },
    "first_refund_request_ts": { "type": "string", "format": "date-time" },
    "product_id": { "type": "string" },
    "events": {
      "type": "object",
      "properties": {
        "sparks_used": { "type": "integer", "minimum": 0 },
        "curiosity_cues": { "type": "integer", "minimum": 0 },
        "sealed_notes_saved": { "type": "integer", "minimum": 0 }
      }
    },
    "minutes_active": { "type": "number", "minimum": 0 },
    "prev_refunds_90d": { "type": "integer", "minimum": 0 },
    "is_host_pass": { "type": "boolean" },
    "rotation_started": { "type": "boolean" }
  },
  "refund_rule": "Eligible if (request within 24h) AND ( (sparks_used>=2 AND minutes_active>=6) OR (curiosity_cues>=1) OR (sealed_notes_saved>=1) ) is FALSE; Host Pass refundable only if rotation_started==false.",
  "output": {
    "type": "object",
    "properties": {
      "eligible": { "type": "boolean" },
      "reason": { "type": "string" }
    }
  }
}
```
