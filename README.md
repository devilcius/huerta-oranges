# Huerta Oranges

A small web application to manage orange sales.
It allows multiple people to manage buyers, bag orders, picking status, and payment status from different browsers.

The application is built with **React + Vite** and deployed on **Cloudflare Pages**, using **Cloudflare D1** as shared persistence.

---

## Features

* Buyers list with:

  * Buyer name
  * Bags of 10 (€16 each)
  * Bags of 20 (€30 each)
  * Picked status
  * Paid status
* Buyer detail page with:

  * Order summary and total price
  * Inline editing of name and bag quantities
  * Picked / Paid toggles
* Create new buyers
* Live filter by buyer name
* Quick filters:

  * All buyers
  * Needs picking
  * Needs payment
* Shared database (multiple users, different browsers)

---

## Tech stack

* Frontend: React, Vite, Tailwind CSS
* Backend: Cloudflare Pages Functions
* Database: Cloudflare D1 (SQLite)
* Deployment: Cloudflare Pages (GitHub integration)

---

## Local development

### Install dependencies

```bash
npm install
```

### Apply D1 migrations locally

```bash
npx wrangler d1 migrations apply orange_sales --local
```

### Run locally with Pages + Functions

```bash
npx wrangler pages dev --d1 DB -- npm run dev
```

The app will be available at:

```
http://localhost:8788
```

---

## Deployment (Cloudflare Pages)

1. Create a **Pages** project in Cloudflare and connect it to this GitHub repository.
2. Configure build settings:

   * Build command: `npm run build`
   * Output directory: `dist`
   * Deploy command: (leave empty)
3. Add a **D1 binding** in:

   * Pages → Settings → Functions → D1 database bindings
   * Binding name: `DB`
   * Database: `orange_sales`
4. Apply migrations to the remote database:

```bash
npx wrangler d1 migrations apply orange_sales --remote
```

Each push to `main` triggers an automatic deployment.

---

## Notes

* No authentication or authorization is implemented.
* The application is intended for small-scale, trusted usage.
* All pricing logic is derived from bag counts:

  * Bag of 10: €16
  * Bag of 20: €30

---

## License

Private / internal use.
