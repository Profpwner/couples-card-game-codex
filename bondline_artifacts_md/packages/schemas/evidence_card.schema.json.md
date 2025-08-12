```json
{
  "$id": "https://bondline.app/schema/evidence_card.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["text"],
  "properties": {
    "text": { "type": "string" },
    "citations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title","source"],
        "properties": {
          "title": { "type": "string" },
          "source": { "type": "string" },
          "year": { "type": "integer" },
          "url": { "type": "string" }
        }
      }
    }
  }
}
```
