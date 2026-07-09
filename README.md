# Abay Express — Fleet & Delivery Logistics Management System

Abay Express (internally: FleetStream) is a logistics management system for delivery
companies operating across Ethiopia. Managers can register vehicles, customers, and
delivery routes, and assign drivers to shipments. Drivers use a simplified portal to
view their assigned routes and update shipment status in real time as deliveries
progress from pickup to drop-off.

## Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** PostgreSQL (relational)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs (hashing, 10 salt rounds)
- **Input Validation:** express-validator
- **Rate Limiting:** express-rate-limit
- **Frontend:** Vanilla HTML, CSS, and JavaScript (no framework), served statically by Express
- **Architecture:** MVC (Models, Controllers, Routes) with separate middleware layer

## Features

### Core Requirements
- **Authentication** — Registration and login using hashed passwords and JWTs.
- **Authorization (RBAC)** — Two roles, `manager` and `driver`, with distinct permissions
  enforced at both the route level (role checks) and the resource level (drivers can only
  view/update their own assigned shipments and routes).
- **JWT Sessions** — Tokens issued on login, verified on every protected request via
  middleware, with configurable expiration.
- **Hashing** — Passwords are never stored in plain text; bcrypt hashing is used throughout.
- **Logging** — Every shipment status change is recorded in a dedicated `status_logs` table,
  creating a full audit trail (who changed what, and when).

### Beyond Course Scope
- **Input Validation** — express-validator enforces field-level rules (valid email format,
  minimum password length, valid role values, realistic weight ranges) and returns clear,
  field-specific error messages.
- **Rate Limiting** — A general API rate limiter (100 requests / 15 min per IP) plus a
  stricter login-specific limiter (5 attempts / 15 min per IP) to prevent brute-force
  password guessing.
- **Status Transition Validation** — Shipments must move through a strict lifecycle
  (`pending → assigned → in_transit → delivered`). Skipping steps or reverting to a
  previous status is rejected at the business-logic layer, not just the database layer.
- **Resource-Level Authorization** — Beyond role checks, drivers are blocked from viewing
  or updating shipments/routes that are not assigned to them, even if authenticated.

## Database Schema

Full DDL is available at [`database/schema.sql`](./database/schema.sql).

**Tables:**
- `users` — Stores managers and drivers (`role` constrained to `manager` or `driver`).
- `vehicles` — Fleet vehicles with capacity and availability status.
- `customers` — Delivery recipients (name, address, phone).
- `routes` — A driver + vehicle + date combination; the container for one or more shipments.
- `shipments` — Individual deliveries, linked to a route and a customer, with weight,
  dimensions, and status.
- `status_logs` — Append-only audit trail of every status change on a shipment, including
  who made the change and any notes.

**Key relationships:**
- `routes.driver_id` → `users.id`
- `routes.vehicle_id` → `vehicles.id`
- `shipments.route_id` → `routes.id`
- `shipments.customer_id` → `customers.id`
- `status_logs.shipment_id` → `shipments.id`
- `status_logs.changed_by` → `users.id`

## Setup & Run Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running locally

### 1. Clone the repository
```bash
git clone https://github.com/MuniraYesuf/abay-express-backend.git
cd abay-express-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the database
Create a PostgreSQL database named `abay_express` (via pgAdmin or `psql`):
```sql
CREATE DATABASE abay_express;
```

Then run the schema script against it (via pgAdmin's Query Tool, or `psql`):
```bash
psql -U postgres -d abay_express -f database/schema.sql
```

### 4. Configure environment variables
Create a `.env` file in the project root with the following (adjust values to match your
local PostgreSQL setup):
### 5. Start the server
```bash
npm run dev
```

The API will run at `http://localhost:5000`. The frontend dashboard is served at:
## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new manager or driver |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/vehicles` | Manager, Driver | List all vehicles |
| POST | `/api/vehicles` | Manager | Add a vehicle |
| PATCH | `/api/vehicles/:id/status` | Manager | Update vehicle status |
| DELETE | `/api/vehicles/:id` | Manager | Delete a vehicle |
| GET | `/api/customers` | Manager, Driver | List all customers |
| POST | `/api/customers` | Manager | Add a customer |
| GET | `/api/routes` | Manager | List all routes |
| GET | `/api/routes/mine` | Driver | View routes assigned to the logged-in driver |
| POST | `/api/routes` | Manager | Create a route (assign driver + vehicle) |
| GET | `/api/shipments` | Manager | List all shipments |
| GET | `/api/shipments/mine` | Driver | View shipments on the driver's own routes |
| POST | `/api/shipments` | Manager | Create a shipment |
| PATCH | `/api/shipments/:id/status` | Manager, Driver (own) | Advance shipment status |

## Project Structure
## Known Limitations / Future Improvements

- Route/customer/vehicle selection in the frontend currently uses raw numeric IDs rather
  than dropdown menus populated with names; this was a scope trade-off given project time
  constraints and would be the first UX improvement in a future iteration.
- No refresh token rotation is implemented yet, despite `JWT_REFRESH_SECRET` being present
  in the environment configuration — a direction for future enhancement.
- No automated test suite (unit/integration tests) is included due to time constraints.

## Author

Developed individually as a final capstone project for Web Programming II.