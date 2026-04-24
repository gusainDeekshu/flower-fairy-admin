# 🌸 Flower Fairy Admin 


The **AE Naturals Admin 
** is a scalable, enterprise-level administrative platform designed to manage modern e-commerce operations efficiently. Built with **Next.js 15**, **TypeScript**, **Shadcn UI**, **TanStack Query**, and **Zod**, the 
 provides a centralized control panel for administrators to manage products, orders, customers, and multi-store configurations.

The system is engineered with a **type-safe, modular, and performance-focused architecture**, enabling reliable data handling, efficient server-state management, and a responsive user experience suitable for both operational teams and store owners.

This 
 acts as the **core operational interface** for the AE Naturals ecosystem, integrating seamlessly with the backend API and supporting scalable business workflows.

🔗 **Live Demo:** [https://flower-fairy-admin.vercel.app](https://flower-fairy-admin.vercel.app)
🖥️ **GitHub Repository:** [https://github.com/gusainDeekshu/flower-fairy-admin](https://github.com/gusainDeekshu/flower-fairy-admin)

---

# 🎯 Project Objectives

The primary goal of this admin platform is to deliver:

• Centralized control over e-commerce operations
• Efficient product and inventory management
• Real-time order monitoring and fulfillment workflows
• Multi-store administration from a single interface
• Secure role-based access management
• High-performance data synchronization with backend systems

The 
 is designed to be **extensible**, allowing future modules such as analytics, marketing tools, and automation systems to be integrated easily.

---

# 🏗️ System Architecture Overview

The application follows a **layered architecture** to ensure maintainability and scalability.

### Presentation Layer

Built using:

* Next.js App Router
* Shadcn UI components
* Tailwind CSS

Responsibilities:

* UI rendering
* Form interactions
* Admin workflows
* 
 navigation

---

### State Management Layer

Two major state types are used:

**Client State**
Managed with:

* Zustand

Used for:

* Authentication state
* UI preferences
* session information

**Server State**
Managed with:

* TanStack Query

Handles:

* API caching
* background synchronization
* automatic refetching
* optimistic UI updates

---

### Data Validation Layer

All forms and API payloads are validated using:

Zod

This ensures:

• Type-safe validation
• API contract enforcement
• Reduced runtime errors
• Predictable data handling

Examples include:

* Product creation validation
* Order update validation
* Store configuration validation

---

### API Integration Layer

Communication with the backend is handled through:

Axios Client (centralized configuration)

Key capabilities:

• Token injection
• Request/response interceptors
• Automatic error handling
• Session-aware API calls

---

# ✨ Core Features

## 🔐 Secure Authentication & Role-Based Access

The 
 implements a secure authentication system with protected routes and role-aware UI rendering.

Key capabilities:

• JWT-based authentication
• Protected 
 routes
• Session validation
• Role-based feature access

Example roles:

Admin
Store Manager
Operations Team

This ensures sensitive operations such as product edits or order status changes remain controlled.

---

## 📖 System Overview

The platform is split into three distinct, specialized applications:
1. **The Storefront (Frontend):** A Next.js application tailored for premium customer shopping experiences.
2. **The Command Center (Admin):** A secure Next.js dashboard for full operational, catalog, and logistics management.
3. **The Core API (Backend):** A robust NestJS monolith handling complex business logic, multi-tenancy, and background processing.

---

## ✨ Features

### 🛒 The Storefront (Frontend)
* **Intelligent Cart Syncing:** Zustand-powered guest carts that seamlessly merge with the database upon user login.
* **Dynamic A+ Content:** Product detail pages that dynamically render rich JSON content blocks (Banners, Grids, Split Text) assembled by the Admin.
* **Resilient Authentication:** Passwordless OTP flow with Axios interceptors that seamlessly use an `HttpOnly` refresh cookie to restore expired sessions.

### 🎛️ The Command Center (Admin Panel)
* **Modular A+ Content Builder:** A custom UI allowing admins to construct rich product descriptions using text blocks, banners, and image grids directly integrated with Cloudinary.
* **Provider Configurations:** A dedicated dashboard to hot-swap API keys and toggle gateways (Stripe, Razorpay, Shiprocket, Twilio) without changing backend code.
* **Logistics & Dispatch:** Advanced order management featuring a dispatch modal to trigger fulfillment routing and tracking.
* **Content Management System:** Built-in CMS for managing blog posts, categories, and dynamic product "Feature Highlights" (e.g., Best Seller, Organic).

### ⚙️ The Core Engine (Backend)
* **Multi-Tenant Architecture:** Host multiple brands/stores on a single database with isolated data.
* **Dynamic Provider Factory:** Resolves payment and notification strategies at runtime based on the encrypted Admin configurations.
* **Real-Time Inventory Safety:** BullMQ and Redis reserve stock during checkout and automatically release it if the payment fails or times out.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend (Storefront)** | Next.js 15, TypeScript, Tailwind, Zustand, TanStack Query |
| **Admin Dashboard** | Next.js 15, NextAuth.js, Shadcn UI, Zod, React Hook Form |
| **Backend API** | NestJS, PostgreSQL, Prisma ORM, Redis, BullMQ |
| **External Services** | Cloudinary (Media), Shiprocket (Shipping), AWS SES/Fast2SMS |

---

## 📂 Architecture & Folder Structure

```text
📦 AE Naturals Ecosystem
├── 📂 ae-naturals-backend/          # NestJS API
│   ├── src/providers/               # Dynamic Factory logic (Payments, SMS, Shipping)
│   ├── src/orders/                  # Order lifecycles and BullMQ event processors
│   └── src/inventory/               # Redis stock reservation and CRON cleanups
│
├── 📂 ae-naturals/                  # Next.js Customer Storefront
│   ├── src/components/product/      # Galleries, sticky carts, A+ Content Renderer
│   ├── src/store/                   # Zustand local storage for Guest Carts
│   └── src/lib/api-client.ts        # Axios interceptors for silent token refreshes
│
└── 📂 ae-naturals-admin/            # Next.js Admin Dashboard
    ├── src/app/api/auth/            # NextAuth integration with Backend JWT
    ├── src/components/admin/aplus/  # Advanced UI Builder for A+ Content
    └── src/components/admin/providers/ # Interface to manage API Keys safely
```

---

## 🚀 Installation & Getting Started

### 1. Backend Setup
```bash
git clone [https://github.com/aenaturalsit-dotcom/ae-naturals-backend.git](https://github.com/aenaturalsit-dotcom/ae-naturals-backend.git)
cd ae-naturals-backend
npm install
npx prisma generate && npx prisma migrate dev
npm run start:dev # Runs on http://localhost:4000
```

### 2. Storefront Setup
```bash
git clone [https://github.com/gusainDeekshu/ae-naturals.git](https://github.com/gusainDeekshu/ae-naturals.git)
cd ae-naturals
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local
npm run dev # Runs on http://localhost:3000
```

### 3. Admin Panel Setup
```bash
git clone [https://github.com/gusainDeekshu/flower-fairy-admin.git](https://github.com/gusainDeekshu/flower-fairy-admin.git)
cd flower-fairy-admin
npm install
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local
echo "NEXT_PUBLIC_NEXTAUTH_SECRET=your_secure_random_string" >> .env.local
npm run dev # Runs on http://localhost:3001
```

---

## 👨‍💻 Author
**Deekshant Gusain**
* GitHub: [@gusainDeekshu](https://github.com/gusainDeekshu)
* Portfolio: [Deekshant Gusain](https://deekshantportfoliosite.netlify.app)

********************************************************************************
*****************************************************************************
