# Book Rental App

This is a Book Rental App built with Next.js and Prisma.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. **Clone the repository:**

   ```bash
   https://github.com/Gedion-01/book-r.git
   ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Generate Prisma client:**
    ```bash
    npx prisma generate
    ```
4. **Push the Prisma schema to the database:**
    ```bash
    npx prisma db push
    ```
5. **Seed the database with initial data:**
    ```bash
    node scripts/seed.ts
    ```
6. **Run the development server:**
    ```bash
    npm run dev
    ```
The app will be available at [http://localhost:3000](http://localhost:3000).
