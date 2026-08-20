# Backend API Contract

This document describes the HTTP API currently implemented by the Spring Boot backend. It is intended for frontend
contributors, presenters, and anyone integrating with the local or development deployment.

The contract reflects the current code in `backend/src/main/java/com/optum/tdpbootcamp/`. It documents current behavior,
including limitations. It is not a promise of future API behavior.

## Contents

- [API conventions](#api-conventions)
- [Authentication and authorization](#authentication-and-authorization)
- [Common types](#common-types)
- [Authentication endpoints](#authentication-endpoints)
- [People endpoints](#people-endpoints)
- [Referral endpoints](#referral-endpoints)
- [Administrator endpoints](#administrator-endpoints)
- [Notification endpoint](#notification-endpoint)
- [Errors](#errors)
- [Representative flows](#representative-flows)
- [Contract limitations](#contract-limitations)

## API conventions

| Environment | Base URL |
| --- | --- |
| Local backend | `http://localhost:8080` |
| Local browser | `http://localhost:5173`, with Vite proxying `/api` and `/actuator/` to the backend |
| Deployed application | The application host configured by the development Kubernetes Ingress |

Requests with a body use `Content-Type: application/json`. Successful responses use JSON unless otherwise noted.
Dates are represented as strings. Date-only fields use `YYYY-MM-DD`; timestamp fields are serialized as ISO-8601
date-time values.

The API does not currently expose a version prefix, pagination contract, sorting contract, or OpenAPI document.

## Authentication and authorization

### Bearer tokens

Login returns a JSON Web Token (JWT). Send it on protected requests:

```http
Authorization: Bearer <token>
```

The token contains the user's email as `sub` and also includes `role`, `name`, `externalId`, `iat`, and `exp` claims.
The expiration duration is configured by the backend. There is currently no refresh-token endpoint.

### Public routes

The following routes do not require a JWT:

- `/api/auth/**`
- `GET /actuator/health`
- `GET /`, `/index.html`, `/assets/**`, and `/fonts/**`

All other routes require a valid JWT.

### Roles

| Role | Meaning |
| --- | --- |
| `ADM` | Administrator |
| `CRD` | Care coordinator |
| `AUD` | Auditor |
| `MBR` | Member; represented in the data model but not allowed to log in to the portal |

The security configuration applies these additional restrictions:

| Operation | Required role |
| --- | --- |
| `/api/admin/**` | `ADM` |
| `POST /api/members` | `ADM` |
| `POST /api/coordinators` | `ADM` |
| `POST /api/referrals` | `ADM` |
| `PUT /api/referrals/{id}/assign` | `ADM` |
| `PUT /api/referrals/{id}/status` | `CRD` or `ADM` |
| `PUT /api/referrals/{id}/priority` | `CRD` or `ADM` |
| `POST /api/referrals/{id}/sla-extension-requests` | `CRD` or `ADM` |
| Other protected routes | Any authenticated role, subject to service-level business rules |

## Common types

### Referral values

| Field | Values currently used |
| --- | --- |
| `status` | `CREATED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `registration status` | `PENDING`, `APPROVED`, `REJECTED` |
| `SLA extension status` | `PENDING`, `APPROVED`, `REJECTED` |

Referral types currently seeded or supported by the application include `SpecialistVisit`, `BehavioralHealth`,
`HomeHealth`, `LabWork`, `PhysicalTherapy`, `SocialServices`, `Transportation`, `NutritionSupport`, `DmeRequest`,
`CaseManagement`, and `SkilledNursing`.

External identifiers are returned as strings, for example `REF-...` for referrals and `CC-...` for coordinators. Clients
should treat identifiers as opaque values rather than generating them.

## Authentication endpoints

### `POST /api/auth/login`

Authenticate an existing account.

Request:

```json
{
  "email": "admin@optum.com",
  "password": "admin123"
}
```

Successful response: `200 OK`

```json
{
  "token": "<jwt>",
  "role": "ADM",
  "name": "Administrator",
  "externalId": "ADM-001"
}
```

Invalid credentials or login restrictions are reported by the service layer as an error response.

### `POST /api/auth/register/request`

Submit a request for an auditor or coordinator account. The requested role must be `AUD` or `CRD`.

Request fields: `firstName`, `lastName`, `dateOfBirth`, `gender`, `phone`, `email`, and `requestedRole`.

Successful response: `201 Created`, with a `MessageResponse` containing a `message` field.

### `GET /api/auth/register/status/{email}`

Return the registration status for an email address.

Successful response: `200 OK`

```json
{
  "email": "new.user@example.com",
  "status": "PENDING",
  "rejectedAt": null
}
```

`rejectedAt` is populated only for a rejected request.

### `POST /api/auth/register/complete`

Set the password for an approved registration request.

Request fields: `email`, `password`, and `confirmPassword`. Passwords must match and must be at least eight
characters long.

Successful response: `200 OK`, with a `MessageResponse`.

## People endpoints

All people endpoints require an authenticated user.

### Members

#### `GET /api/members`

Return all members with the member role. Successful response: `200 OK` with an array of `MemberDto` objects.

Each member contains `memberId`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `phone`, and `email`.

#### `POST /api/members`

Create a member. Request fields: `firstName`, `lastName`, `dateOfBirth`, `gender`, `phone`, and `email`.

Successful response: `201 Created` with the created `MemberDto`.

### Coordinators

#### `GET /api/coordinators`

Return coordinators and their active case counts. Successful response: `200 OK` with an array of objects containing
`coordinatorId`, `name`, `avatar`, `activeCases`, `phone`, and `email`.

#### `POST /api/coordinators`

Create a coordinator. Request fields: `firstName`, `lastName`, `dateOfBirth`, `gender`, `phone`, `email`, and `avatar`.

Successful response: `201 Created` with the created `CoordinatorDto`.

### Auditors

#### `GET /api/auditors`

Return auditors. Successful response: `200 OK` with an array of `AuditorDto` objects.

## Referral endpoints

### `GET /api/referrals`

List referrals. Optional filters can be combined:

| Query parameter | Meaning |
| --- | --- |
| `status` | Filter by referral status |
| `assignedTo` | Filter by coordinator identifier |
| `overdue` | Filter by overdue state using a boolean value |

Successful response: `200 OK` with an array of `ReferralDto` objects.

### `GET /api/referrals/{id}`

Return one referral by external identifier. The response includes the referral's `auditHistory`.

`ReferralDto` fields are `referralId`, `memberId`, `memberName`, `memberDob`, `referralType`, `priority`, `status`,
`assignedTo`, `createdDate`, `dueDate`, `lastUpdated`, `notes`, and `auditHistory`.

Each audit entry contains `timestamp`, `action`, `performedBy`, and `details`.

### `POST /api/referrals`

Create a referral. Request fields:

```json
{
  "memberId": "MBR-102938",
  "referralType": "LabWork",
  "priority": "HIGH",
  "assignedTo": "CC-101",
  "dueDate": "2026-08-20",
  "notes": "Local API validation referral"
}
```

The referenced member and coordinator must exist. Successful response: `201 Created` with a `ReferralDto`.

### `PUT /api/referrals/{id}/status`

Update the referral lifecycle status.

Request:

```json
{
  "status": "IN_PROGRESS",
  "performedBy": "CC-101"
}
```

Successful response: `200 OK` with the updated `ReferralDto`.

### `PUT /api/referrals/{id}/due-date`

Change the due date and record the reason in the referral audit history.

Request fields: `dueDate`, `reason`, `notes`, and `performedBy`.

Successful response: `200 OK` with the updated `ReferralDto`.

### `PUT /api/referrals/{id}/assign`

Reassign a referral. This operation requires `ADM`.

Request:

```json
{
  "coordinatorId": "CC-102",
  "performedBy": "ADM-001"
}
```

The target must be a coordinator. Successful response: `200 OK` with the updated `ReferralDto`.

### `PUT /api/referrals/{id}/priority`

Change referral priority. This operation requires `CRD` or `ADM`.

Request fields: `priority`, `reason`, and `performedBy`. A reason is required, the priority must actually change, and
completed or cancelled referrals cannot be reprioritized.

Successful response: `200 OK` with the updated `ReferralDto`.

### `GET /api/referrals/{id}/sla-extension-requests`

List SLA-extension requests for a referral. Successful response: `200 OK` with an array of `SlaExtensionRequestDto`
objects.

### `POST /api/referrals/{id}/sla-extension-requests`

Submit an SLA-extension request. This operation requires `CRD` or `ADM`.

Request fields: `requestedDueDate`, `reason`, `notes`, and `performedBy`.

The current due date is not changed when the request is submitted. Only one request may be pending for a referral.
Successful response: `201 Created` with an `SlaExtensionRequestDto`.

## Administrator endpoints

Every endpoint in this section requires `ADM`.

### `GET /api/admin/registration-requests`

Return pending registration requests. Successful response: `200 OK` with an array containing `id`, `firstName`,
`lastName`, `email`, `requestedRole`, and `createdAt`.

### `POST /api/admin/registration-requests/{id}/approve`

Approve a registration request. Successful response: `200 OK` with a `MessageResponse`.

### `POST /api/admin/registration-requests/{id}/reject`

Reject a registration request. Successful response: `200 OK` with a `MessageResponse`.

### `GET /api/admin/sla-extension-requests`

List SLA-extension requests. The optional `status` query parameter filters by `PENDING`, `APPROVED`, or `REJECTED`.

Successful response: `200 OK` with an array of `SlaExtensionRequestDto` objects.

### `POST /api/admin/sla-extension-requests/{id}/approve`

Approve an SLA-extension request and apply the requested due date.

The request body is optional. When provided, it may contain `reviewNotes` and `performedBy`.

Successful response: `200 OK` with the updated `SlaExtensionRequestDto`. A request that is already approved or rejected
returns a conflict response.

### `POST /api/admin/sla-extension-requests/{id}/reject`

Reject an SLA-extension request without changing the referral due date.

The request body is optional and may contain `reviewNotes` and `performedBy`. Successful response: `200 OK` with the
updated `SlaExtensionRequestDto`.

## Notification endpoint

### `GET /api/notifications?since={epochMilliseconds}`

Return notification events for the authenticated user after the supplied UTC timestamp. The `since` query parameter is
required, must be a non-negative integer, and is interpreted as milliseconds since the Unix epoch.

Successful response: `200 OK` with an array of notification objects sorted newest first. Each object contains:

- `type`: event type such as `STATUS_CHANGED`, `ASSIGNED`, `SLA_EXTENSION_APPROVED`, `SLA_EXTENSION_REJECTED`,
  `DUE_DATE_CHANGED`, `PRIORITY_CHANGED`, or `REFERRAL_CREATED`;
- `message`: human-readable event description;
- `referralId`: related referral external identifier; and
- `occurredAt`: event timestamp.

The service limits results to events relevant to the authenticated user. Delivery behavior is documented in
[Frontend Documentation](FRONTEND.md#notifications).

## Errors

The backend currently raises errors through Spring service exceptions and does not define one documented, application-wide
error JSON schema. Clients should use the HTTP status first and treat the response body as implementation-dependent until a
central error handler is introduced.

The status codes used by the current service include:

| Status | Typical meaning |
| --- | --- |
| `400 Bad Request` | Invalid input, unsupported value, missing business-required value, or invalid related record |
| `401 Unauthorized` | Missing, malformed, expired, or invalid JWT |
| `403 Forbidden` | Valid authentication without the required role, or a registration/login restriction |
| `404 Not Found` | Referenced referral, person, or request does not exist |
| `409 Conflict` | Duplicate registration state or an SLA-extension request is already dispositioned/pending |
| `429 Too Many Requests` | Registration retry is blocked by the rejected-request cooldown |
| `5xx` | Unexpected server or infrastructure failure |

## Representative flows

### Authenticated referral request

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"jordan.lee@optum-style.com","password":"coordinator123"}' \
  | jq -r '.token')

curl -i -X POST http://localhost:8080/api/referrals \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "memberId": "MBR-102938",
    "referralType": "LabWork",
    "priority": "HIGH",
    "assignedTo": "CC-101",
    "dueDate": "2026-08-20",
    "notes": "Synthetic local validation referral"
  }'
```

The example uses synthetic local demonstration credentials and data only.

## Contract limitations

- There is no OpenAPI/Swagger document.
- List endpoints do not currently expose pagination or sorting parameters.
- There is no refresh-token or logout endpoint.
- Referral audit history is included in referral detail responses; there is no standalone audit endpoint.
- Error bodies are not standardized through a shared `@RestControllerAdvice` contract.
- The API has no explicit version prefix or published deprecation policy.a