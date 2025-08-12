```yaml
asyncapi: 3.0.0
info:
  title: Bondline Lounge Realtime
  version: 0.1.0
defaultContentType: application/json
servers:
  production:
    url: wss://rt.bondline.app
    protocol: wss
channels:
  lounge.{roomId}.control:
    messages:
      hostTick:
        payload:
          type: object
          properties:
            t:
              type: string
              enum: [ROUND_START, ROUND_END, PAUSE, RESUME]
            round: { type: integer }
            ts: { type: string, format: date-time }
  lounge.{roomId}.presence:
    messages:
      join:
        payload:
          type: object
          properties:
            userId: { type: string }
            ts: { type: string, format: date-time }
      leave:
        payload:
          type: object
          properties:
            userId: { type: string }
            ts: { type: string, format: date-time }
```
