```yaml
openapi: 3.1.0
info:
  title: Bondline API
  version: 0.1.0
servers:
  - url: https://api.bondline.app/v1
paths:
  /auth/anon:
    post:
      summary: Create an anonymous pseudo-identity
      operationId: createAnon
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id: { type: string }
                  token: { type: string }
  /pair/create:
    post:
      summary: Create a room for a session (Couples, Family, Lounge)
      operationId: createRoom
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [audience]
              properties:
                audience: { type: string, enum: [Couples, Family, Lounge] }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  room_id: { type: string }
                  pairing_qr: { type: string, description: "QR payload (room_id + host pubkey + sas_salt)" }
  /pair/join:
    post:
      summary: Join a room using QR/code (handshake occurs p2p; server just signals presence)
      operationId: joinRoom
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [room_id]
              properties:
                room_id: { type: string }
      responses:
        '200': { description: OK }
  /entitlements:
    get:
      summary: List a user's owned products/memberships
      operationId: listEntitlements
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  entitlements:
                    type: array
                    items:
                      $ref: '#/components/schemas/Entitlement'
  /receipts/validate:
    post:
      summary: Validate an in-app or web store receipt
      operationId: validateReceipt
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PurchaseReceipt'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Entitlement'
  /store/search:
    get:
      summary: Search the marketplace
      operationId: searchStore
      parameters:
        - in: query
          name: q
          schema: { type: string }
        - in: query
          name: facets
          schema: { type: string, description: "comma separated: audience:Couples|Family|Lounge;language:xx-YY;consent:touch|adult|trauma|faith" }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      $ref: '#/components/schemas/Listing'
  /listings/{id}:
    get:
      summary: Get a product listing
      operationId: getListing
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Listing'
  /studio/bundle:
    post:
      summary: Upload a creator bundle (.bondle) for validation/storage
      operationId: uploadBundle
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                bondle: { type: object }
      responses:
        '200': { description: OK }
  /studio/submit:
    post:
      summary: Submit bundle for review/publish
      operationId: submitForReview
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                product_id: { type: string }
      responses:
        '200': { description: OK }
  /studio/evaluate:
    post:
      summary: LLM risk & resources evaluation for a draft bundle
      operationId: evaluateRisk
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RiskEvalInput'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RiskEvalOutput'
  /flags:
    post:
      summary: Report a listing for review
      operationId: flagListing
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [listing_id, reason_code]
              properties:
                listing_id: { type: string }
                reason_code: { type: string }
                note: { type: string }
      responses:
        '200': { description: OK }
  /creators/{id}/payouts:
    get:
      summary: Get creator payout statements
      operationId: listPayouts
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  payouts:
                    type: array
                    items:
                      $ref: '#/components/schemas/Payout'
  /analytics/events:
    post:
      summary: Submit aggregated analytics events (opt-in; counts only)
      operationId: postEvents
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyticsEvents'
      responses:
        '200': { description: OK }

components:
  schemas:
    Entitlement:
      type: object
      properties:
        product_id: { type: string }
        channel: { type: string, enum: [iOS, Android, Web] }
        expires_at: { type: string, format: date-time, nullable: true }
    PurchaseReceipt:
      type: object
      properties:
        channel: { type: string, enum: [iOS, Android, Web] }
        payload: { type: object }
    Listing:
      type: object
      properties:
        product_id: { type: string }
        title: { type: string }
        synopsis: { type: string }
        audience: { type: array, items: { type: string } }
        languages: { type: array, items: { type: string } }
        price: { type: number }
        evidence_cards: { type: array, items: { $ref: '#/components/schemas/EvidenceCard' } }
        credential_badge: { $ref: '#/components/schemas/CredentialBadge' }
        consent_profile: { type: array, items: { type: string } }
    EvidenceCard:
      type: object
      properties:
        text: { type: string }
        citations:
          type: array
          items:
            type: object
            properties:
              title: { type: string }
              source: { type: string }
              year: { type: integer }
    CredentialBadge:
      type: object
      properties:
        credential_type: { type: string }
        jurisdiction: { type: string }
        verified_at: { type: string, format: date-time }
        expires_at: { type: string, format: date-time }
    Payout:
      type: object
      properties:
        period: { type: string }
        currency: { type: string }
        total_net_receipts: { type: number }
        creator_share: { type: number }
        adjustments: { type: number }
    AnalyticsEvents:
      type: object
      properties:
        events:
          type: array
          items:
            type: object
            properties:
              name: { type: string }
              props: { type: object }
    RiskEvalInput:
      type: object
      required: [bondle, audience]
      properties:
        bondle: { type: object }
        resourcesCard: { type: object }
        audience: { type: string }
        credential_status: { type: string, enum: [none, verified_clinical, verified_pastoral, verified_educator] }
    RiskEvalOutput:
      type: object
      properties:
        risk_level: { type: integer, minimum: 0, maximum: 3 }
        risk_types: { type: array, items: { type: string } }
        required_gates: { type: array, items: { type: string } }
        missing_resources: { type: array, items: { type: object } }
        mitigations: { type: array, items: { type: object } }
        rewrites: { type: array, items: { type: object } }
        compliance_flags: { type: array, items: { type: string } }
```
