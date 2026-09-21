# E-Commerce Platform

A responsive e-commerce application built with React, TypeScript, and Supabase. It provides a complete browsing and account experience: visitors can discover products, filter the catalogue, view product details, create an account, manage a persistent cart, and leave reviews.

[Live demo](https://e-com.bakwowi.dev/) · [Portfolio](https://portfolio1-rouge-nine.vercel.app) · [Report an issue](https://github.com/B6800/E-Commerce/issues)

## Highlights

- Browse a product catalogue with search, category filtering, sorting, and stock visibility.
- View detailed product information, availability, ratings, and reviews.
- Sign up, sign in, and sign out with Supabase Authentication.
- Maintain a user-specific shopping cart with quantity controls and calculated totals.
- Create, edit, and delete product reviews when signed in.
- Use responsive navigation and layouts across desktop and mobile screens.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Radix UI, Lucide |
| Data and authentication | Supabase (PostgreSQL and Auth) |
| Client state | React Context, TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Tooling | ESLint, PostCSS |

## Architecture

The application is a single-page React client with routes for the catalogue, authentication, cart, product details, and orders. Supabase supplies the data and authentication layer. The main client concerns are separated into reusable components, feature hooks, and React contexts:

```text
src/
├── components/              # Navigation, catalogue, product, and review UI
├── contexts/                # Authentication and shopping-cart state
├── hooks/                   # Product and review data access
├── integrations/supabase/   # Supabase client and generated database types
├── pages/                   # Route-level screens
└── App.tsx                  # Providers and client-side routing
```

## Run locally

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project containing the tables represented in `src/integrations/supabase/types.ts`

### Installation

```bash
git clone https://github.com/B6800/E-Commerce.git
cd E-Commerce
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Current scope

The app includes catalogue browsing, account management, carts, and reviews. The order-history route is intentionally a placeholder; payment processing, shipment tracking, and returns are not implemented yet. A Spring Boot backend is a future enhancement—the current application uses Supabase for its backend services.

## Future improvements

- Add a payment provider and checkout workflow.
- Implement order persistence, order history, and fulfilment status.
- Move client configuration to environment variables and document deployment setup.
- Add automated tests for cart, authentication, and review flows.
- Add an administrator workflow for product and inventory management.

## Author

Built by [Bakwowi Bryan](https://github.com/B6800).
