# DECISIONS.md

How I built this project step by step, and why I made the choices I made.

## Step 1 — Scaffold

Angular 21 (standalone, zoneless) + PrimeNG 21 + Tailwind CSS 4, as required by the case.
I mapped a few PrimeNG theme variables (`--p-surface-*`, `--p-text-color`) to Tailwind
colors in `styles.scss`, so both libraries use the same color system and the UI stays
consistent (`text-content`, `text-muted`, `bg-surface-*` used across all templates come
from this mapping).

## Step 2 — Auth foundation and login

- **Why a signal-based AuthService?** The logged-in user is state that many parts of the
  app need (guards, navbar, interceptor). A root service with signals gives one source of
  truth, and `computed` gives me `isLoggedIn` and `role` for free.
- **Role mapping from username**: the DummyJSON login response has no role field, so I keep
  a small list of admin usernames (`emilys`, `michaelw`) and everyone else is a viewer.
  This is the simplest way to get two roles from an API that has none.
- **Session in localStorage**: token and user are saved on login and read back on app start
  (`hydrate()`), so a page refresh does not log the user out.

## Step 3 — Route protection and layout

- **Functional guards** (`authGuard`), because that is the modern Angular way and they are
  just small functions — easy to read and easy to test.
- Guards return a `UrlTree` instead of calling `router.navigate()`. Returning the redirect
  is cleaner: the router does the navigation, the guard only decides.
- **One layout shell** with the navbar wraps all protected pages, so every page looks the
  same and the navbar logic lives in one place.

## Step 4 — Products page

- **Everything is server-side**: search (`/products/search?q=`), category filter
  (`/products/category/:slug`) and pagination (`limit`/`skip`). The case asks for real
  query-param usage, and it also scales — the client never needs the full list.
- **300ms debounce** on search, so we do not send a request on every keystroke.
- **Search and category reset each other.** DummyJSON cannot combine search and category
  in one call, so the two filters are exclusive. I made that explicit in the UI: picking a
  category clears the search box and the other way around.
- **States order in the template**: loading → error → empty → data. Every page follows the
  same order, so the templates read the same way everywhere.

## Step 5 — Product comparison (Viewer feature)

- **All rules live in `ComparisonService`**: max 3 products, no duplicates, at least 2 to
  compare, removable items. Components only call `toggle()` / `remove()` and read signals.
  Keeping the rules in one service makes them testable and impossible to bypass from the UI.
- The comparison list is persisted to localStorage with the app's only `effect()` — a real
  side effect outside the signal graph, which is exactly what `effect()` is for.

## Step 6 — Role guard and low stock (Admin feature)

- **`roleGuard(role)` is a factory** that returns a guard, so the same code protects
  `/compare` for viewers and `/low-stock` for admins. One implementation, used twice.
- **Admin cannot access comparison.** The case lists comparison as a "(Viewer feature)" and
  the Admin list does not include it, so I read the role lists as exact. If the product
  owner wants admins to compare too, it is a one-line change (remove the guard from the route).
- **Access control is enforced twice**: guards redirect wrong-role visits to `/unauthorized`,
  and the UI also hides what the role cannot use (compare buttons for admin, low-stock nav
  for viewer). Hiding a button is not security — the guard is the real protection.
- **Low stock fetches the full list (`limit=0`)**: DummyJSON cannot filter by stock, and the
  three groups need the whole dataset anyway. Grouping is done with `computed`, so moving
  the threshold slider regroups instantly with no new request.
- **The threshold is not saved on purpose**: it resets to the default (10) on every visit,
  so the default required by the case is always what you see first.

## Step 7 — Polish

- **Shared UI components** (`EmptyState`, `ErrorState`, `LoadingSkeleton`) so every page
  shows the three states the same way, instead of copy-pasting markup.
- **`guestGuard` on `/login`**: a logged-in user who opens `/login` is sent to `/products`.
- **Unauthorized and Not Found are separate pages**: wrong role → `/unauthorized`, unknown
  URL → `/not-found` (`**` route). They answer different questions, so they are not mixed.
- **Mobile pass on the product card**: smaller padding and price size below the `sm`
  breakpoint, shorter button label, and the stock badge wraps under the price — so the
  2-column mobile grid stays clean.
