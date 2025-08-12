```yaml
version: 1
age_ratings:
  teen_plus:
    allow: ["light romance","family emotions"]
    block: ["explicit sexual detail","graphic violence"]
gated_categories:
  requires_credentials:
    - suicide_self_harm
    - abuse_recovery
    - addiction_recovery
    - eating_disorders
    - trauma_ptsd
    - sexual_dysfunction_treatment
    - diagnose_treat_prevent_claims
runtime_defaults:
  sensitive:
    safety_brief: true
    persistent_red_button: true
    require_regulation_after_heavy: true
    touch_default: false
  adult:
    age_gate: "Adult"
prohibited:
  - hate_or_harassment
  - medical_advice_without_license
  - personal data collection
iarc_mapping:
  "Adult": "Mature 17+"
  "Teen+": "Teen"
```
