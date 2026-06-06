# Backend Explanation (WebGIS - Laravel API)

## 1) High-level architecture

This is a **Laravel API-only style backend** (still uses Laravel app bootstrap and routes), built around:

- **Routing**: `routes/api.php` defines public/authenticated/admin endpoints.
- **Authentication**: **Laravel Sanctum tokens** (Bearer tokens).
- **Authorization**: a custom `admin` middleware that checks the authenticated user’s role.
- **Validation**: dedicated `FormRequest` classes for input validation.
- **Repository pattern**: controllers depend on repository interfaces, bound via DI in `RepositoryServiceProvider`.
- **Persistence**: Eloquent models (`User`, `Provider`, `Report`) map to DB tables via migrations.
- **File upload**: report photo is stored via Laravel Filesystem disk `public`, and the path is saved to `reports.photo_path`.

---

## 2) Entry point and routing

### Application bootstrapping

- `bootstrap/app.php` registers routing:
    - `web` routes: `routes/web.php`
    - `api` routes: `routes/api.php`
- It also registers middleware aliases:
    - `admin` → `App\Http\Middleware\AdminMiddleware`

### API routes

File: `routes/api.php`

Endpoints are grouped like this:

#### Public (no auth)

- `POST /register` → `AuthController@register`
- `POST /login` → `AuthController@login`

#### Authenticated (Sanctum)

All endpoints in this group require a valid Sanctum token:

- `GET /user` → `AuthController@user`
- `POST /logout` → `AuthController@logout`

Authenticated CRUD-like operations:

- Reports:
    - `GET /reports` → `ReportController@index`
    - `POST /reports` → `ReportController@store` (includes photo upload)
    - `GET /reports/{id}` → `ReportController@show`
- Providers:
    - `GET /providers` → `ProviderController@index`

#### Admin-only

Admin endpoints require BOTH:

- authentication (`auth:sanctum` is on the parent group), and
- `admin` middleware (role check)

Admin endpoints:

Reports management:

- `PUT /reports/{id}/status` → `ReportController@updateStatus`
- `DELETE /reports/{id}` → `ReportController@destroy`

Providers management:

- `POST /providers` → `ProviderController@store`
- `PUT /providers/{id}` → `ProviderController@update`
- `DELETE /providers/{id}` → `ProviderController@destroy`

---

## 3) Authentication flow (Sanctum token)

### Controller: `app/Http/Controllers/Api/AuthController.php`

#### Register: `POST /register`

1. Request is validated by `RegisterRequest` (`app/Http/Requests/RegisterRequest.php`).
2. A new user is created:
    - `role` is forced to `field_officer` by default.
3. Sanctum token is created:
    - `$token = $user->createToken('auth_token')->plainTextToken`
4. Response includes:
    - the created user
    - `access_token`
    - `token_type: Bearer`

#### Login: `POST /login`

1. Request is validated by `LoginRequest`.
2. It fetches user by email.
3. Password is checked via `Hash::check`.
4. If invalid, returns `401` with message.
5. Before issuing a new token:
    - deletes previous tokens: `$user->tokens()->delete()`
6. Creates and returns a new Sanctum token.

#### Get current user: `GET /user`

- Returns `$request->user()` (the authenticated user loaded by Sanctum).

#### Logout: `POST /logout`

- Deletes the current access token:
    - `$request->user()->currentAccessToken()->delete()`

---

## 4) Admin authorization flow

### Middleware: `app/Http/Middleware/AdminMiddleware.php`

On each admin-protected request:

1. Checks if the request has an authenticated user.
2. Calls:
    - `$request->user()->isAdmin()`
3. If not admin, returns:
    - HTTP `403`
    - JSON message: “Akses ditolak. Hanya admin yang diizinkan.”
4. Otherwise, request continues (`return $next($request)`).

### Role logic: `app/Models/User.php`

- `isAdmin()` returns `true` only if:
    - `$this->role === 'admin'`

### How role is set

- `AdminSeeder` seeds a user with role `admin`.
- `AuthController@register` seeds new users with role `field_officer`.

---

## 5) Repository pattern (dependency direction)

Controllers do not directly write complex Eloquent queries.
They depend on repository interfaces.

### DI bindings: `app/Providers/RepositoryServiceProvider.php`

In `register()`:

- `ProviderRepositoryInterface` → `ProviderRepository`
- `ReportRepositoryInterface` → `ReportRepository`

So when a controller constructor requests the interface, Laravel resolves the implementation.

---

## 6) Provider flow (list + admin management)

### Controller: `ProviderController`

File: `app/Http/Controllers/Api/ProviderController.php`

#### `GET /providers` (authenticated)

1. Calls `$this->providerRepository->getAll()`
2. Repository returns providers ordered by `name`.
3. Response: `{ providers: [...] }`

#### Admin: `POST /providers`

1. The controller validates input via `$request->validate([...])`.
2. It calls `$this->providerRepository->create($validated)`.
3. Response includes created provider.

Validation rules used here:

- `name`: required string max 255
- `contact_email`: nullable email
- `color_code`: required and must match `^#[0-9A-Fa-f]{6}$`

#### Admin: `PUT /providers/{id}`

1. Validates fields (uses `sometimes|required` style for optional updates).
2. Calls repository `update($id, $validated)`.
3. Returns updated provider.

#### Admin: `DELETE /providers/{id}`

- Calls repository `delete($id)`.
- Returns success JSON.

### Repository: `ProviderRepository`

File: `app/Repositories/ProviderRepository.php`

- `getAll()` → `orderBy('name')->get()`
- `getById()` uses `findOrFail`
- `create()` uses `$model->create($data)`
- `update()` finds then updates, returns `$provider->fresh()`
- `delete()` deletes model found by id

### Model: `Provider`

File: `app/Models/Provider.php`

- Fillable: `name`, `contact_email`, `color_code`
- Relationship: `reports()` is a `hasMany(Report::class)`

---

## 7) Report flow (list + upload + admin status/update)

### Controller: `ReportController`

File: `app/Http/Controllers/Api/ReportController.php`

#### `GET /reports` (authenticated)

1. Reads filters from query string:
    - `status`, `provider_id`, `date_from`, `date_to`, `user_id`
2. Calls:
    - `$this->reportRepository->getAll($filters)`
3. Response:
    - `{ reports: [...], total: <count> }`

#### `POST /reports` (authenticated)

1. Input validated by `StoreReportRequest`.
2. Photo upload:
    - `$photoPath = $request->file('photo')->store('reports', 'public');`
    - This writes the file to the `public` disk under folder `reports/`.
3. Creates report using repository with fields:
    - `user_id` = authenticated user id
    - `latitude`, `longitude`
    - `photo_path` = stored path string
    - `description`
    - `provider_id`
    - `status` defaults to `'pending'`
4. Response returns the created report with relationships loaded:
    - `user:id,name,email`
    - `provider:id,name,color_code`

**Important validation rules** (from `StoreReportRequest`):

- `latitude`: numeric between -90 and 90
- `longitude`: numeric between -180 and 180
- `photo`: required image, mimes `jpeg,png,jpg,webp`, max 5MB
- `provider_id`: nullable, must exist in `providers`

#### `GET /reports/{id}` (authenticated)

- Calls repository `getById($id)`.
- Returns `{ report: ... }` with relationships.

#### Admin: `PUT /reports/{id}/status`

1. Validated by `UpdateReportStatusRequest`:
    - `status` in: `pending,investigating,resolved`
2. Calls repository `updateStatus($id, $request->status)`.
3. Returns updated report.

#### Admin: `DELETE /reports/{id}`

1. Loads the report via repository.
2. If `photo_path` exists:
    - deletes the photo from `public` disk:
        - `Storage::disk('public')->delete($report->photo_path);`
3. Deletes report record via repository.
4. Returns success JSON.

### Repository: `ReportRepository`

File: `app/Repositories/ReportRepository.php`

#### `getAll(array $filters = [])`

- Starts with:
    - `$query = $this->model->with(['user:id,name,email', 'provider:id,name,color_code']);`
- Applies filters if provided:
    - `status` → `where('status', ...)`
    - `provider_id` → `where('provider_id', ...)`
    - `date_from` → `whereDate('created_at', '>=', ...)`
    - `date_to` → `whereDate('created_at', '<=', ...)`
    - `user_id` → `where('user_id', ...)`
- Orders:
    - `orderBy('created_at','desc')`
- Returns `get()` (collection)

#### `getById(int $id)`

- `with()`:
    - `user:id,name,email`
    - `provider:id,name,color_code,contact_email`
- Uses `findOrFail($id)`

#### `create(array $data)`

- `$this->model->create($data)`

#### `update(int $id, array $data)`

- Finds report, updates, returns fresh.

#### `updateStatus(int $id, string $status)`

- Finds report, updates only `status`.
- Returns fresh report with `user` and `provider` (including color code).

#### `delete(int $id)`

- Finds and deletes the report.

### Model: `Report`

File: `app/Models/Report.php`

- Fillable: `user_id`, `latitude`, `longitude`, `photo_path`, `description`, `provider_id`, `status`
- Status constants:
    - `pending`, `investigating`, `resolved`
- Casts:
    - `latitude` and `longitude` use `decimal:7`
- Relationships:
    - `user()` belongsTo(User::class)
    - `provider()` belongsTo(Provider::class)

---

## 8) Database direction (migrations + relationships)

### `users` table

Migration: `database/migrations/0001_01_01_000000_create_users_table.php`

- `role` enum: `admin`, `field_officer` (default `field_officer`)

### `providers` table

Migration: `2026_04_18_100000_create_providers_table.php`

- `name`
- `contact_email` nullable
- `color_code` default `#FF0000`

### `reports` table

Migration: `2026_04_18_100001_create_reports_table.php`

- `user_id` FK → users (cascade delete)
- `provider_id` nullable FK → providers (set null)
- `latitude`, `longitude`
- `photo_path` string
- `description` nullable
- `status` enum: `pending`, `investigating`, `resolved` default `pending`

---

## 9) CORS direction

CORS config: `config/cors.php`

- Applies to paths:
    - `api/*`
    - `sanctum/csrf-cookie`
- Allowed origins:
    - `http://localhost:5173`
    - `http://webgis-madiun.test`
- Allows all methods and headers.
- Supports credentials.

---

## 10) File upload direction (report photos)

The backend stores uploaded photos here:

- `ReportController@store` → `store('reports', 'public')`

And the DB stores the returned relative path into:

- `reports.photo_path`

When deleting a report:

- `ReportController@destroy` deletes the file from the same disk (`public`) using `photo_path`.

---

## 11) Summary: end-to-end flow

### Example: user creates a report

1. Client calls `POST /reports` with `Authorization: Bearer <token>` and multipart form data.
2. Laravel verifies Sanctum token → sets authenticated `$request->user()`.
3. `StoreReportRequest` validates fields.
4. Controller stores photo on `public` disk.
5. Controller calls `ReportRepository->create(...)`.
6. Eloquent inserts into `reports` table.
7. Controller returns created report + loaded relations.

### Example: admin updates report status

1. Client calls `PUT /reports/{id}/status` with token.
2. Sanctum auth passes.
3. `admin` middleware runs:
    - checks `user.role === 'admin'`.
4. `UpdateReportStatusRequest` validates status.
5. Controller calls `ReportRepository->updateStatus`.
6. DB updates `reports.status`.
7. Controller returns updated report.

---

## 12) Where to extend/change behavior

- Add/change endpoints: `routes/api.php`.
- Change auth behavior/token handling: `AuthController`.
- Change admin rules: `User::isAdmin()` and/or `AdminMiddleware`.
- Add/adjust filters or DB query logic: repositories (`ReportRepository`, `ProviderRepository`).
- Add validation rules: corresponding `FormRequest` classes.
- Add new data fields: update migrations + model `$fillable` + controller/repository create/update data.
