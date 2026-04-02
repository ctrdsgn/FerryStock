## 1. Project Overview
* **Project Name:** OnStock CBD
* **Developer Context:** Dumai-based IT Solutions (Joki Coding Dumai)
* **Core Objective:** A high-performance, real-time inventory management system for SMEs, leveraging **Next.js 15**, **TailAdmin (Free)**, and **Supabase**.
* **Folder Strategy:** * Static assets (Images, Icons, Fonts) from TailAdmin are located in the `/public` directory.
    * Application logic, UI components, and styles are located in the `/src` directory.

---

## 2. Technical Stack & Infrastructure
* **Framework:** Next.js 15 (App Router)
* **UI Library:** TailAdmin (Free Version) with Tailwind CSS
* **Database:** Supabase (PostgreSQL)
* **ORM:** Prisma
* **Authentication:** Supabase Auth (Email/Password)

### 2.1 Connection Configuration (`.env`)
The database is hosted on Supabase. Use the following connection strings:
```env
# Transaction Mode (Port 6543) - For Application Usage
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.qaavddkeeboepnpcrknd.supabase.co:6543/postgres?pgbouncer=true"

# Session Mode (Port 5432) - For Prisma Migrations
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.qaavddkeeboepnpcrknd.supabase.co:5432/postgres"

# Supabase Client Credentials
NEXT_PUBLIC_SUPABASE_URL="https://db.qaavddkeeboepnpcrknd.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

---

## 3. Database Schema (Prisma)
The schema is designed for **Atomic Data Integrity**. All stock changes must be mirrored in the `StockLog` table.

```prisma
// file: prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Product {
  id           String     @id @default(cuid())
  sku          String     @unique // Unique Barcode/Product Code
  name         String
  description  String?    @db.Text
  price        Decimal    @db.Decimal(12, 2)
  stock        Int        @default(0)
  minStock     Int        @default(5) // Threshold for Low Stock Alerts
  category     String?    @default("General")
  imageUrl     String?    // Link to Supabase Storage Bucket
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  logs         StockLog[]
}

model StockLog {
  id        String    @id @default(cuid())
  productId String
  type      StockType // ENUM: IN, OUT, ADJUST
  quantity  Int       // Amount of change
  prevStock Int       // Stock count before the transaction
  nextStock Int       // Stock count after the transaction
  note      String?   // Reason for adjustment or reference (e.g., "Supplier A Receipt")
  createdAt DateTime  @default(now())
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
}

enum StockType {
  IN
  OUT
  ADJUST
}
```

---

## 4. Functional Requirements

### 4.1 Real-time Dashboard
* **KPI Widgets:** Display "Total Stock Value," "Total SKUs," and "Critically Low Items."
* **Real-time Updates:** Integrate `supabase.channel()` to listen for `UPDATE` events on the `Product` table, ensuring the UI updates without a manual page refresh.

### 4.2 Stock Management Workflows
* **Inbound (Stock In):** * Increments `Product.stock`.
    * Creates a `StockLog` entry with type `IN`.
    * **Logic:** Must use a Prisma Transaction (`$transaction`) to ensure both updates succeed or fail together.
* **Outbound (Stock Out):** * Validates stock availability (prevents negative stock).
    * Decrements `Product.stock`.
    * Creates a `StockLog` entry with type `OUT`.
* **Adjustment:** * Allows manual correction of stock levels with a mandatory justification note.

---

## 5. UI/UX Implementation (TailAdmin)
* **Navigation:** Sidebar must include links for "Dashboard," "Inventory List," and "Transaction History."
* **Components:** * Use TailAdmin’s `TableOne` or `TableTwo` for the Inventory List.
    * Implement "Badge" components to indicate `Low Stock` status (Red for `stock <= minStock`).
* **Mobile Readiness:** Ensure all forms (Add Product, Edit Stock) are fully responsive for warehouse staff using mobile devices.

---

## 6. Execution Steps for AI Agent
1.  **Database Synchronization:** Execute `npx prisma db push` to synchronize the schema with the live Supabase instance.
2.  **Server Actions:** Generate Next.js Server Actions for `createProduct`, `updateStock`, and `getInventorySummary`.
3.  **Real-time Integration:** Implement a React Hook for real-time stock monitoring using the Supabase JS Client.
4.  **Error Handling:** Implement robust error boundaries for database connection failures.

---

## 7. Future Considerations (Wildcard Features)
* **AI Forecasting:** Future integration of machine learning to predict stock depletion based on `StockLog` trends.
* **Barcode Scanning:** Utilizing the device camera to scan SKUs directly into the search bar.

---

### **Action Required**
Run the following command to finalize the database setup:
```bash
npx prisma db push
```