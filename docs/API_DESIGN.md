# API Structure & Design (NestJS)

## Philosophy
The backend is a NestJS layered RESTful API. Responses are grouped by status codes (200, 201, 400, 401, 403, 404). Output payloads use consistent JSON formatting with standardized wrapping.

## Base URL
`/api/v1`

## 1. Public Endpoints (Institutes & Search)
### `GET /institutes`
Search and list institutes based on queries. Distance sorting relies on the nearest branch.
- **Query Parameters**:
  - `lat` (float): Latitude for proximity sensing.
  - `lng` (float): Longitude for proximity sensing.
  - `radius` (integer): Search radius in KM (e.g., 1, 3, 5, 10, 20).
  - `service` (string): Service ID or exact name match (e.g., "Math").
  - `city` (string): City ID to restrict area.
  - `area` (string): Area ID to restrict area.
  - `query` (string): Text query for Institute Name.
  - `sort` (string): `distance` (requires lat/lng) | `rating` (future) | `newest`.
  - `page`, `limit` (integer): Pagination.
- **Response**: Array of Institute objects + nearest branch + distance computation leveraging PostGIS `ST_Distance`.

### `GET /institutes/:id`
Fetch complete details for a single institute.
- **Response**: Institute object including `branches`, `services`, `schedules`, and `images`.

### `GET /institutes/nearby`
Convenience endpoint for fast "near me" loading based on IP or basic coordinate passing.
- **Query Parameters**: `lat`, `lng`, `limit` (default 10).

## 2. Taxonomy Endpoints
### `GET /services`
List all available categories/subjects (e.g., Μαθηματικά, Φυσική).
### `GET /cities`
List all cities and their associated areas.

## 3. Contact & Interaction
### `POST /institutes/:id/contact`
Submit an inquiry to the given institute.
- **Body**:
  - `name`, `email`, `phone` (string)
  - `serviceId` (uuid, optional)
  - `message` (string, max 1000 chars)

## 4. User Account Endpoints (Secured - Role: USER)
### `POST /auth/register` & `POST /auth/login`
To handle issuance of session boundaries if not utilizing purely third-party managed hooks (e.g., Clerk).
### `GET /users/me`
Fetch the currently authenticated profile.
### `POST /users/me/favorites`
Save a branch ID to favorites.
### `DELETE /users/me/favorites/:branchId`
Remove a favorite.
### `GET /users/me/favorites`
List all saved branches.

## 5. Owner Endpoints (Secured - Role: OWNER)
### `POST /owner/institutes`
Create a new institute claiming ownership.
### `PUT /owner/institutes/:id`
Update base profile, logo, website.
### `POST /owner/institutes/:id/branches`
Add a new physical location.
- **Body**: `name`, `address`, `cityId`, `lat`, `lng`, `phone`.
### `PUT /owner/institutes/:id/branches/:branchId/schedule`
Update operating hours.
### `GET /owner/requests`
List all incoming contact inquiries regarding the owner's institutes.

## 6. Admin Endpoints (Secured - Role: ADMIN)
### `GET /admin/institutes?status=PENDING`
Fetch listings awaiting vetting.
### `PUT /admin/institutes/:id/status`
Approve or reject a listing.
### `POST /admin/services`
Add a new global subject/service category.
