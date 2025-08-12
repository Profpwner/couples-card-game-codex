```yaml
name: contract-tests
on: [push, pull_request]
jobs:
  contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate OpenAPI & Schemas
        run: |
          npx @redocly/cli lint docs/openapi.yaml || true
          node scripts/validate-schemas.js
```
