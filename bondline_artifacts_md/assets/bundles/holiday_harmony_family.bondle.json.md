```json\n{
  "manifest": {
    "id": "com.bondline.family.holiday_harmony.v1",
    "version": "1.0.0",
    "locales": [
      "en-US"
    ],
    "audiences": [
      "Family"
    ],
    "duration_minutes": 30,
    "consent_schema_ref": "consent.json"
  },
  "structure": {
    "phases": [
      {
        "key": "open",
        "timebox_sec": 480,
        "items": [
          {
            "nudge": "celebrate_win_60"
          },
          {
            "spark": "fspk_001"
          }
        ]
      },
      {
        "key": "explore",
        "timebox_sec": 900,
        "items": [
          {
            "spark": "fspk_010"
          },
          {
            "nudge": "gratitude_60"
          }
        ]
      },
      {
        "key": "echo",
        "timebox_sec": 420,
        "items": [
          {
            "spark": "fspk_020"
          }
        ]
      }
    ]
  },
  "content": {
    "sparks": [
      {
        "id": "fspk_001",
        "text": "Share one small win from this week. What helped it happen?",
        "tags": [
          "capitalization"
        ]
      },
      {
        "id": "fspk_010",
        "text": "Tell a family story that makes you smile.",
        "tags": [
          "story"
        ]
      },
      {
        "id": "fspk_020",
        "text": "What new weekly ritual should we try for the next month?",
        "tags": [
          "ritual"
        ]
      }
    ],
    "nudges": [
      {
        "id": "celebrate_win_60",
        "type": "validation_coach",
        "duration_sec": 60,
        "params": {
          "style": "active_constructive"
        }
      },
      {
        "id": "gratitude_60",
        "type": "gratitude",
        "duration_sec": 60,
        "params": {
          "prompt": "Say thank you for one thing someone did this week."
        }
      }
    ],
    "audio": [
      {
        "id": "vo_en_intro",
        "file": "vo/en/intro_01.mp3"
      }
    ],
    "haptics": []
  },
  "policies": {
    "credentials_required": false,
    "regions_blocked": []
  },
  "signing": {
    "creator_sig": "ed25519:PLACEHOLDER",
    "checksums": {}
  }
}\n```\n