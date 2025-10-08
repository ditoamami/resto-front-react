# React Restaurant POS (Material UI) — Frontend only

This project is a React (Create React App-style) frontend skeleton using **Material UI (MUI)**.
It's designed to connect to a **Laravel API** (REST) — authentication via **Laravel Sanctum** is assumed
on the backend. This repo **does not include the backend**. README contains integration notes.

## Features (MVP)
- Auth: Login / Register / Forgot (skeleton)
- Dashboard: Table grid + Quick stats (Material UI Grid & Card)
- Menu: List / Create / Update (skeleton)
- Order: List / Open / Detail (skeleton)
- Payment: Payment / Receipt (skeleton)

## Quick start

1. Extract or clone project and open the folder:
```bash
cd react-restaurant-pos-mui
```

2. Copy environment example and set your API URL:
```bash
cp .env.example .env
# Edit .env and set REACT_APP_API_URL (e.g. http://127.0.0.1:8000/api)
```

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
npm start
```

Open http://localhost:3000

---

## Environment
- Uses `REACT_APP_API_URL` to configure API base URL (see `.env.example`)

Example `.env`:
```
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

---

## Laravel Sanctum integration (notes for backend)

This frontend expects a typical Laravel Sanctum setup where you:
1. Install and configure Laravel Sanctum on backend.
2. Configure `sanctum` middleware and CORS so the frontend origin is allowed.
3. Use the `sanctum` cookie flow:
   - Frontend fetches `/sanctum/csrf-cookie` first (GET) to set the CSRF cookie.
   - Then POST to `/login` with credentials (cookies enabled).
   - Axios requests must include `withCredentials: true` (already set in axiosClient).

Example login flow (frontend):
```js
await axiosClient.get('/sanctum/csrf-cookie')
await axiosClient.post('/login', { email, password })
// then authenticated requests to /api/... will send cookie automatically
```

If you prefer token-based auth (JWT), change `axiosClient` to send `Authorization: Bearer <token>` header after login.

---

## API endpoints (suggested/expected)
These are suggestions — adapt to your Laravel API.

- `POST /login` (or `/api/login`) — login
- `POST /logout` — logout
- `GET /api/tables` — list tables
- `GET /api/tables/:id` — table detail
- `PUT /api/tables/:id` — update table status/info
- `GET /api/menus` — list menus
- `POST /api/menus` — create menu
- `PUT /api/menus/:id` — update menu
- `GET /api/orders` — list orders
- `POST /api/orders` — create order
- `GET /api/orders/:id` — order detail
- `POST /api/payments` — process payment

---

## Folder structure (excerpt)
```
src/
  api/axiosClient.js
  context/AuthContext.js
  components/
    Layout/Header.js
    Layout/Sidebar.js
    TableCard.js
    StatCard.js
  pages/
    auth/LoginPage.js
    dashboard/DashboardPage.js
    menu/MenuListPage.js
    order/OrderListPage.js
    payment/PaymentPage.js
    notfound/NotFound.js
  routes/AppRouter.js
  App.js
  index.js
```

---

## How to integrate with your Laravel API

1. Set `REACT_APP_API_URL` in `.env` to your Laravel API base URL, e.g. `http://localhost:8000/api`.
2. If using Sanctum cookie-based auth:
   - Ensure your backend allows the frontend origin (CORS) and `supports_credentials`.
   - Use `axiosClient.get('/sanctum/csrf-cookie')` before login POST.
   - Keep `axiosClient` configured with `withCredentials: true` (already set).
3. Update endpoints in `src/api/axiosClient.js` or in components to match your API routes.
4. Test endpoints with Postman/curl to confirm they work before wiring UI flows.