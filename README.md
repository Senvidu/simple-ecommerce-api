# Simple E-commerce Platform API (Node.js + Express + MongoDB)

Implements the backend assignment requirements: JWT auth with roles (Admin/Customer), product management with pagination/sorting/filtering, cart management, and atomic order processing that decrements stock and prevents overselling.

## Features
- **Auth**: `/auth/register`, `/auth/login` (JWT)
- **Roles**
  - **Admin**: create/update/delete products, view all orders
  - **Customer**: browse products, manage cart, place orders, view own orders
- **Products**
  - `GET /products` supports pagination, sorting by price, filtering by category
  - Admin-only: `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
- **Cart**
  - `GET /cart`, `POST /cart/items`, `PUT /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart/clear`
- **Orders**
  - `POST /orders` places an order (from request body items OR from cart)
  - Stock decremented **atomically** per item to handle race conditions
  - `GET /orders/my-orders` (customer)
  - `GET /admin/orders` (admin)
- **Validation** via `express-validator`
- **Logging** via `morgan` + `winston`
- **Swagger** docs at `/docs`

## Quick Start

### 1) Install dependencies
```bash
npm install / npm i
```

### 2) Configure environment variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 3) Start MongoDB
Local MongoDB example:
```bash
mongod
```

### 4) Run the API
Dev:
```bash
npm run dev
```
Prod:
```bash
npm start
```

API will run on `http://localhost:4000` by default.

## Swagger
Open:
- `http://localhost:4000/docs`

## Postman
Import the collection:
- `postman/Simple-Ecommerce-API.postman_collection.json`

It contains requests for all endpoints and uses collection variables:
- `baseUrl`, `adminToken`, `customerToken`, `productId`, `productId2`

## Notes
- To register an **Admin**, call `POST /auth/register` with `adminSecret` equal to `ADMIN_REGISTER_SECRET` from `.env`.
- Order placement is safe against race conditions by using conditional atomic updates on stock (`stockQuantity >= qty`).
