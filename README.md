# 🌸 Flower Fairy Admin Dashboard

A comprehensive, enterprise-grade administrative dashboard built with **Next.js 15**, **TypeScript**, and **Shadcn UI**. This application provides store owners and administrators with full control over their e-commerce operations, including product inventory, order tracking, and multi-tenant store management.

🔗 **[Live Demo](https://flower-fairy-admin.vercel.app)** | 🖥️ **[GitHub Repository](https://github.com/gusainDeekshu/flower-fairy-admin)**

---

## ✨ Features

* **🔐 Secure Authentication:** Admin login system with protected routes and role-based access control.
* **📦 Inventory Management:** Comprehensive interface to add, edit, and delete products with complex attributes and variants.
* **📋 Order Monitoring:** Real-time dashboard to track incoming orders, update fulfillment status (PAID, SHIPPED, DELIVERED), and view customer details.
* **🏗️ Multi-Store Control:** Manage different storefront configurations, industry settings, and branding metadata from a single interface.
* **📊 Data Synchronization:** Seamless integration with the backend API using **TanStack Query** for efficient caching and optimistic updates.
* **🌙 Professional UI:** Modern design featuring a sidebar-based navigation, data tables, and dynamic modals for administrative tasks.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **State Management** | TanStack Query + Zustand (Auth State) |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Authentication** | Custom JWT Integration |
| **API Client** | Axios (configured with interceptors) |

---

## 📂 Folder Structure Overview

```text
src/
├── app/            # Next.js pages: Login, Dashboard, Orders, and Products
│   └── api/        # NextAuth and backend proxy routes
├── components/     # Admin-specific components (Sidebar, Product Modals)
├── hooks/          # Custom hooks for managing administrative data
├── lib/            # API client and global utility functions
├── services/       # Domain-specific API services (Orders, Products, Stores)
├── store/          # Global state management using Zustand
└── types/          # Shared TypeScript interfaces and type definitions

```

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js** (v20+ recommended)
* **npm** or **pnpm**
* Access to a running [Flower Fairy Backend](https://www.google.com/search?q=https://github.com/gusainDeekshu/flower-fairy-backend)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/gusainDeekshu/flower-fairy-admin.git
cd flower-fairy-admin

# Install dependencies
npm install

```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXTAUTH_SECRET="your_nextauth_secret"

```

### 4. Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build
npm run start

```

---

## 👤 Author

**Deekshant Gusain**

* **GitHub**: [@gusainDeekshu](https://www.google.com/search?q=https://github.com/gusainDeekshu)
* **Portfolio**: [beastdrive.in](https://beastdrive.in)

---

## 📄 License

This project is licensed under the **MIT License**.