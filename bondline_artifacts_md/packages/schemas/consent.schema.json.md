```json
{
  "$id": "https://bondline.app/schema/consent.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["age_gate","gates"],
  "properties": {
    "age_gate": { "type": "string", "enum": ["Everyone","Teen+","Adult"] },
    "gates": {
      "type": "object",
      "properties": {
        "touch":  { "type": "object", "properties": { "default": {"type":"boolean"}, "required": {"type":"boolean"} } },
        "adult":  { "type": "object", "properties": { "default": {"type":"boolean"}, "required": {"type":"boolean"} } },
        "trauma": { "type": "object", "properties": { "default": {"type":"boolean"}, "required": {"type":"boolean"} } },
        "faith":  { "type": "object", "properties": { "default": {"type":"boolean"}, "required": {"type":"boolean"} } }
      }
    },
    "runtime_overrides": {
      "type": "object",
      "properties": {
        "heavy_prompt_interval_sec_min": { "type": "integer", "minimum": 0 },
        "require_regulation_after_heavy": { "type": "boolean" },
        "red_button_persistent": { "type": "boolean" }
      }
    }
  }
}
```
