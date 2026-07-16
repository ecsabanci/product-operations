# Product Operations

A product operations dashboard built as a case study: product listing with server-side search/filter/pagination, role-based access (admin/viewer), product comparison and low-stock monitoring, backed by the [DummyJSON](https://dummyjson.com) API.

## How to run

```bash
npm install
npm start
```

Open `http://localhost:4200`.

### Demo accounts

Authentication is real (`POST /auth/login` on DummyJSON). Roles are mapped locally from the username, since DummyJSON returns no role field.

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | `emilys` | `emilyspass` | Products + Low Stock Monitoring |
| Viewer | `sophiab` | `sophiabpass` | Products + Product Comparison |

`emilys` and `michaelw` are mapped to admin; every other DummyJSON user is a viewer.

## Versions

| Package | Version |
|---------|---------|
| Angular (standalone, zoneless) | 21.2 |
| PrimeNG (Aura theme) | 21.1 |
| Tailwind CSS | 4.3 |

## Project structure

```
src/app/
├── core/                  # App-wide singletons, no UI
│   ├── api/               # Generic typed HTTP wrapper around DummyJSON
│   ├── guards/            # authGuard, guestGuard, roleGuard(role)
│   ├── interceptors/      # Bearer token interceptor
│   ├── models/            # Product, User, Role interfaces + role mapping
│   └── services/          # AuthService (signal state + localStorage session)
├── features/              # One folder per screen, lazy-loaded via routes
│   ├── login/
│   ├── products/          # List + search/filter/pagination, ProductCard
│   ├── comparison/        # ComparisonService holds the comparison rules
│   └── low-stock/         # LowStockService groups products by threshold
├── pages/                 # Standalone pages: not-found, unauthorized
└── shared/
    ├── layout/            # App shell with role-aware navbar
    └── ui/                # EmptyState, ErrorState, LoadingSkeleton
```

Design notes:

- **State lives in signal-based services.** Components read signals and call service methods; derived state (`totalPages`, stock groups, `canCompare`, …) is `computed`. `effect()` is used only for side effects outside the signal graph: persisting the comparison list to localStorage.
- **All product data operations are server-side** via DummyJSON query params (`/products/search?q=`, `/products/category/:slug`, `limit`/`skip` pagination), with a 300ms debounce on search. The one exception is low stock: DummyJSON cannot filter by stock, so that screen fetches the full list (`limit=0`) once and groups it client-side with `computed`.
- **Strict role separation** is enforced twice: route guards redirect wrong-role access to `/unauthorized`, and role-specific UI (compare buttons, low-stock nav) is hidden per role.
- **Comparison rules** (max 3, no duplicates, min 2 to compare, removable) live in `ComparisonService` as plain testable logic.
- **The stock threshold is not saved on purpose.** It resets to the default (10) on every page visit, so the default value asked by the case is always the first thing you see. Only the comparison list is persisted to localStorage.

## What I would improve with more time

- **Handle expired tokens (401)**: DummyJSON tokens expire after a while. On a 401 response the app should log the user out and send them back to the login page, instead of showing a generic error.
- **Unit tests for the service logic**: the comparison rules, stock grouping and role mapping already live in services as plain logic, so writing tests for them would be cheap and valuable.
- **Better login error messages**: show a different message for wrong credentials and for network/server problems, instead of one generic message.
- **Fallback image for products**: if a product thumbnail fails to load, show a placeholder image instead of a broken image icon.
- **Dark mode**: the PrimeNG theme already supports it; I would add a toggle in the navbar and map the Tailwind colors to follow it.
- **Return URL after login**: if a logged-out user opens a deep link (for example `/low-stock`), send them back to that page after they log in.
- **Translations (i18n)**: UI texts are hard-coded in Turkish. Moving them into translation files would make the app ready for other languages.
