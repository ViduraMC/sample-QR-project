# QR Event Management Platform 🎫📲

A robust, full-stack event management platform designed to allow event organizers to create tracking pages, generate securely encrypted QR codes for their events, and quickly serve public-facing event details upon being scanned.

## 🚀 Key Features

- **Secure QR Generation:** Generates SHA-256 hashed QR paths paired with an HMAC signature. This ensures QR URLs cannot be scraped, forged, or guessed by bots.
- **Microservices-Level Backend:** Powered by NestJS utilizing `class-validator` for strict payload validation, `@nestjs/throttler` for rate limiting, and `helmet` for header security.
- **Serverless PostgreSQL Database:** Rapid NeonDB connectivity, natively bridged via Prisma 7's lightweight driver adapters (`pg`).
- **Dynamic Next.js 15 App Router Frontend:** Provides blazing-fast Server Component rendering, dynamic URL routing, and a sleek, framework-agnostic "Glassmorphism" UI purely operating on custom Vanilla CSS properties.

---

## 🛠️ Technology Stack

| Domain | Technology / Package | Purpose |
| ------ | ----------- | ------- |
| **Frontend Core** | Next.js 15 | App Router for SSR, Page Routing |
| **Backend Core** | NestJS 11 | Enterprise-grade REST API structured in Typescript |
| **Database** | Neon Postgres | Scalable Serverless Database infrastructure |
| **ORM** | Prisma 7 | Schema definitions, migrations, and typed querying |
| **Styling** | Vanilla CSS (`globals.css`) | Custom Glassmorphism patterns without Tailwind bloat |
| **QR Code Rendering**| `qrcode` | Generating the Canvas Data URL instantly on the client |
| **Security** | `crypto`, `@nestjs/throttler`, `helmet` | SHA/HMAC encryption, brute-force mitigation, HTTP security |

---

## 💻 Getting Started Quick Guide

### 1. Requirements
Ensure you have `Node.js 20+` and `npm` installed.

### 2. Configure Environment (Backend)
Navigate into the `backend/` directory, open `.env.example`, make a copy named `.env`, and assign your variables:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=verify-full"
PORT=4000
QR_HMAC_SECRET="your_custom_secret_key"
FRONTEND_URL="http://localhost:3000"
```

### 3. Install & Run
Start both servers by navigating to each directory in separate terminals.

**Start the NestJS Backend (`/backend`):**
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```
*API will run on `http://localhost:4000`*


**Start the Next.js Frontend (`/frontend`):**
```bash
cd frontend
npm install
npm run dev
```
*App will run on `http://localhost:3000`. Navigate here to experience the platform.*

---

## 🛡️ "Where is the security?"

You might ask: *"If I can see the QR on the screen, where is the security?"*

The QR Code security does not lie in hiding the code. The security lies in **how the URL encoded inside the QR is validated**. 

Instead of generating a sequential URL like `/events/1`, our engine combines your event data and a random salt, then generates a **SHA-256 Hash**. The backend then cryptographically signs that hash using a backend-only secret key (HMAC signature). 

When someone scans your QR, they go to:
`http://localhost:3000/scan/c6b8f...a1d?sig=f4e...8x`

The server takes the hash, checks its secret key, and sees if the signature successfully recalculates. If a hacker alters the hash to try to view someone else's private event, the signature fails to compute, and their request is instantly permanently rejected! It's completely scrape-proof.
