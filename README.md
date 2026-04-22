# QR Event Management Platform 

A full-stack, enterprise-grade event management platform designed to allow event organizers to create tracking pages, generate securely encrypted QR codes, and quickly serve public-facing event details smoothly out to physical attendees.

## 🧠 Project Vision & Architecture

This project was built to explore and implement modern web dev architectures, specifically focusing on connecting a strict Node backend with a serverless React frontend, tied together through a serverless Postgres database. 

### Why These Specific Technologies?

| Domain | Technology / Package | The "Why" |
| ------ | ----------- | ------- |
| **Frontend** | **Next.js 15** (App Router) | We use Next.js instead of plain React so we can utilize Server-Side Rendering (SSR). This prevents loading heavy blank javascript bundles to an attendee's phone. Scanned QR pages load instantly with excellent SEO. |
| **Backend** | **NestJS 11** | Instead of putting API logic inside Next.js, we separated the backend using NestJS. NestJS forces an elite "Enterprise" architecture out-of-the-box (Controllers, Services, Modules, Dependency Injection), making the codebase hyper-scalable and secure. |
| **Database** | **Neon PostgreSQL** | Traditional databases require paying for 24/7 idle servers. Neon scales to zero when nobody is using it, saving significant costs, and boots up instantly over standard HTTPS. |
| **ORM** | **Prisma 7** | We avoid writing raw SQL strings (`SELECT *...`) because they are vulnerable to typos and injection attacks. Prisma translates TypeScript logic into safe SQL, and using Prisma 7's lightweight `adapter-pg` driver guarantees seamless connection to Neon. |
| **Styling** | **Vanilla CSS** (`globals.css`) | We achieved custom "Glassmorphism" patterns without Tailwind bloat, ensuring absolute control over gradients, blurring, and modern UI. |

---

## 📂 Folder Structure & How The Code Works

The repository is radically split into two standalone sub-projects: `/backend` and `/frontend`. 

### `backend/` (The NestJS API Engine)
This operates fully independently on `localhost:4000`.
- **`src/main.ts`**: The brainstem. It boots the API, configures Cross-Origin Resource Sharing (`CORS`) so only Next.js can talk to it, adds HTTP security headers (`helmet`), and enforces strict Global Validation.
- **`src/app.module.ts`**: The root dashboard that connects Database logic, Rate Limiting (`@nestjs/throttler`), and the Events module.
- **`src/events/events.controller.ts`**: Acts as the gatekeeper. It defines endpoints like `POST /api/events` or `GET /api/events/scan/:hash` and listens for frontend Axios calls.
- **`src/events/events.service.ts`**: The heavy lifter! It contains the math calculating our SHA-256 Hashes and HMAC Signatures, and executes all `prisma.event.find...` database requests.
- **`src/events/dto/`**: Data Transfer Objects (DTOs). These define exact blueprints using `class-validator` (e.g. "Ticket price must be a positive number under 2 decimal places"). Any malformed frontend requests are rejected automatically.

### `frontend/` (The Next.js Client)
This operates the UI on `localhost:3000`.
- **`src/app/layout.tsx`**: The global HTML shell. It loads the Google `Inter` font, your navigation bar, and houses the background styling.
- **`src/lib/api.ts`**: Instead of writing `fetch("http...")` deeply everywhere, we built structured Axios wrapper functions like `eventsApi.getAll()`.
- **`src/components/EventForm.tsx` & `EventCard.tsx`**: Reusable interactive React blocks.
- **`src/components/QRCodeDisplay.tsx`**: Uses the `qrcode` NPM package to directly paint the QR image pixels onto the browser's HTML Canvas, omitting the need to statically save images on your server.
- **`src/app/scan/[hash]/page.tsx`**: The dynamic page attendees land on when snapping a QR code. It parses the URL variables and requests event details.

---

## 🛡️ Security Deep Dive: "How is the QR Code secure?"

A common question is: *"If I can see the QR on my dashboard screen, where is the security?"* 

The security does not lie in hiding the physical QR image, but rather **how the URL encoded inside the QR is structurally protected from hackers and scraping bots**.

### ❌ The Bad Way
If your QR code just stored `http://localhost:3000/events/2`, any bot or malicious user could look at that, realize your code iterates by 1, and simply script their browser to scrape `/events/3`, `/events/4`, etc., stealing your entire database.

### ✅ The NestJS EventQR Way
1. **The Hash:** When the event is created, the NestJS service takes the title, current timestamp, and a random cryptographic `salt` and crushes it down using `SHA-256`. Producing unguessable strings like `c6b8f...a1d`.
2. **The Signature:** Taking that hash, NestJS combines it with an extremely secret hidden string sitting only in your backend `QR_HMAC_SECRET` `.env` variable. This computes an **HMAC Signature** (`f4e...8x`).
3. **The URL Check:** The QR code encodes: `http://localhost:3000/scan/c6b8f...a1d?sig=f4e...8x`. 
When scanned, Next.js sends that exact URL parameter list to NestJS. NestJS mathematically re-runs the HMAC signature calculation. If a hacker tampers with the hash to try to view someone else's private event, the signature fails to compute, and their request is instantly rejected (Scrape-Proof!).

---

## 💻 Getting Started Quick Guide

### 1. Requirements
Ensure you have `Node.js 20+` and `npm` installed.

### 2. Configure Environment Configurations
Navigate into the `backend/` directory, open `.env.example`, make a copy named `.env`, and assign your variables:
```env
DATABASE_URL="postgresql://neondb_owner:npg_wYHcG1Euoq0b@ep-young-surf-aof403ag-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"
PORT=4000
QR_HMAC_SECRET="your_custom_secret_key"
FRONTEND_URL="http://localhost:3000"
```

### 3. Install & Run
Start both servers by navigating to each directory in separate terminals.

**Terminal 1 (Start the NestJS Backend):**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```
*API will securely lock onto `http://localhost:4000`*


**Terminal 2 (Start the Next.js Frontend):**
```bash
cd frontend
npm install
npm run dev
```
*The App will hot-reload on `http://localhost:3000`. Navigate here to experience the platform.*
