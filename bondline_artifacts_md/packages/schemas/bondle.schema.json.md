```json
{
  "$id": "https://bondline.app/schema/bondle.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["manifest", "structure", "content", "policies", "signing"],
  "properties": {
    "manifest": {
      "type": "object",
      "required": ["id","version","locales","audiences","duration_minutes","consent_schema_ref"],
      "properties": {
        "id": { "type": "string" },
        "version": { "type": "string" },
        "locales": { "type": "array", "items": { "type": "string" } },
        "audiences": { "type": "array", "items": { "enum": ["Couples","Family","Lounge"] } },
        "duration_minutes": { "type": "integer", "minimum": 5 },
        "consent_schema_ref": { "type": "string" }
      }
    },
    "structure": {
      "type": "object",
      "required": ["phases"],
      "properties": {
        "phases": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["key","timebox_sec","items"],
            "properties": {
              "key": { "enum": ["open","explore","echo"] },
              "timebox_sec": { "type": "integer", "minimum": 60 },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "spark": { "type": "string" },
                    "nudge": { "type": "string" },
                    "curiosity_cue": { "type": "boolean" },
                    "sealed_note_template": { "type": "string" }
                  },
                  "minProperties": 1
                }
              }
            }
          }
        }
      }
    },
    "content": {
      "type": "object",
      "required": ["sparks","nudges"],
      "properties": {
        "sparks": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id","text"],
            "properties": {
              "id": { "type": "string" },
              "text": { "type": "string" },
              "tags": { "type": "array", "items": { "type": "string" } }
            }
          }
        },
        "nudges": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id","type","duration_sec"],
            "properties": {
              "id": { "type": "string" },
              "type": { "type": "string", "enum": ["breathing","synchrony","gratitude","validation_coach","custom"] },
              "duration_sec": { "type": "integer", "minimum": 10 },
              "params": { "type": "object" }
            }
          }
        },
        "audio": { "type": "array", "items": { "type": "object", "properties": {"id":{"type":"string"},"file":{"type":"string"}}}},
        "haptics": { "type": "array", "items": { "type": "object", "properties": {"id":{"type":"string"},"pattern":{"type":"string"}}}}
      }
    },
    "policies": {
      "type": "object",
      "properties": {
        "credentials_required": { "type": "boolean", "default": false },
        "regions_blocked": { "type": "array", "items": { "type": "string" } }
      }
    },
    "signing": {
      "type": "object",
      "properties": {
        "creator_sig": { "type": "string" },
        "checksums": { "type": "object", "additionalProperties": { "type": "string" } }
      }
    }
  }
}
```
