```json
{
  "$id": "https://bondline.app/schema/analytics.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name","props"],
        "properties": {
          "name": {
            "type": "string",
            "enum": ["SessionStart","SessionComplete","SparkUsed","Skip","Softer","CuriosityCue","RedButton"]
          },
          "props": { "type": "object", "additionalProperties": true }
        }
      }
    }
  }
}
```
