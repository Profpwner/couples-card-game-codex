```json\n{
  "manifest": {
    "id": "com.bondline.couples.new_connection.v1",
    "version": "1.0.0",
    "locales": [
      "en-US"
    ],
    "audiences": [
      "Couples"
    ],
    "duration_minutes": 45,
    "consent_schema_ref": "consent.json"
  },
  "structure": {
    "phases": [
      {
        "key": "open",
        "timebox_sec": 600,
        "items": [
          {
            "nudge": "breath_60"
          },
          {
            "spark": "spk_001"
          }
        ]
      },
      {
        "key": "explore",
        "timebox_sec": 1200,
        "items": [
          {
            "spark": "spk_014"
          },
          {
            "curiosity_cue": true
          },
          {
            "nudge": "mirror_45"
          },
          {
            "spark": "spk_018"
          }
        ]
      },
      {
        "key": "echo",
        "timebox_sec": 900,
        "items": [
          {
            "spark": "spk_028"
          },
          {
            "sealed_note_template": "sn_later_24h"
          }
        ]
      }
    ]
  },
  "content": {
    "sparks": [
      {
        "id": "spk_001",
        "text": "What about my world would surprise your past self?",
        "tags": [
          "story",
          "assumption"
        ]
      },
      {
        "id": "spk_014",
        "text": "Describe a moment you felt seen by me. What made it feel safe?",
        "tags": [
          "bonding"
        ]
      },
      {
        "id": "spk_018",
        "text": "What small risk could we try together this week?",
        "tags": [
          "novelty"
        ]
      },
      {
        "id": "spk_028",
        "text": "What did you learn about me tonight\u2014and what did it change?",
        "tags": [
          "reflection"
        ]
      }
    ],
    "nudges": [
      {
        "id": "breath_60",
        "type": "breathing",
        "duration_sec": 60,
        "params": {
          "rate_cpm": 6
        }
      },
      {
        "id": "mirror_45",
        "type": "synchrony",
        "duration_sec": 45,
        "params": {
          "mode": "hands"
        }
      }
    ],
    "audio": [
      {
        "id": "vo_en_intro",
        "file": "vo/en/intro_01.mp3"
      }
    ],
    "haptics": [
      {
        "id": "h_breath_6cpm",
        "pattern": "..."
      }
    ]
  },
  "policies": {
    "credentials_required": false,
    "regions_blocked": []
  },
  "signing": {
    "creator_sig": "ed25519:PLACEHOLDER",
    "checksums": {
      "vo/en/intro_01.mp3": "sha256:PLACEHOLDER"
    }
  }
}\n```\n