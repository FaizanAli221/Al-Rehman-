# Al Rehman Biryani API

A clean, production-style REST API for a Karachi biryani & fast-food delivery
platform. Built with Express, validated with Zod, hardened with Helmet/CORS,
and deployable as a zero-config serverless function on Vercel.

## Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4, exported as a serverless handler for `@vercel/node`
- **Validation:** Zod
- **Security:** `helmet`, `cors`
- **Data layer:** In-memory catalog (`src/data/menu.js`) — swap for a real
  database without touching the routes, since the shape is already normalized.

## Project structure

```
├── api/
│   └── index.js          # Express app, wrapped for Vercel serverless
├── src/
│   ├── data/menu.js       # Categories & product catalog (PKR pricing)
│   ├── routes/menu.js     # /api/categories, /api/products
│   ├── routes/order.js    # /api/orders/calculate, /api/orders/whatsapp
│   ├── middleware/
│   │   ├── cors.js        # CORS allow-list configuration
│   │   └── errorHandler.js
│   └── utils/
│       ├── pricing.js     # Server-side price calculation (never trusts client prices)
│       └── validation.js  # Zod request schemas
├── vercel.json
└── package.json
```

## Local development

```bash
npm install
npm run dev      # nodemon, http://localhost:3000
# or
npm start        # node, no auto-reload
```

## Deploying to Vercel

```bash
npm i -g vercel
vercel            # first deploy, follow prompts
vercel --prod     # promote to production
```

No further configuration is required — `vercel.json` rewrites every
`/api/*` request into the single Express handler in `api/index.js`, which
does its own internal routing.

## API Reference

All responses are JSON and follow the shape `{ success: boolean, data?, error? }`.

### `GET /api/health`

```json
{
  "success": true,
  "status": "ok",
  "uptime": 12.4,
  "timestamp": "2026-09-11T10:00:00.000Z",
  "version": "1.0.0"
}
```

### `GET /api/categories`

Returns the four active categories (`biryani`, `pulao`, `desserts`,
`side-orders`) with display titles and banner metadata for the storefront.

### `GET /api/products`

Query params (all optional, combinable):

| Param      | Example              | Behavior                          |
|------------|----------------------|------------------------------------|
| `category` | `?category=biryani`  | Filter by category id              |
| `search`   | `?search=aloo`       | Case-insensitive name/description match |
| `tag`      | `?tag=hot-selling`   | Filter by tag                      |

### `GET /api/products/:id`

Returns a single product, including `basePrice`, `variants` (if any, e.g.
`single`/`double` boti), `weight`, and `description`.

### `POST /api/orders/calculate`

Request:

```json
{
  "items": [
    { "id": 2, "quantity": 2, "variant": "double" },
    { "id": 7, "quantity": 1 }
  ]
}
```

The server looks up every `id` and `variant` against the catalog — client
supplied prices are never trusted. Response:

```json
{
  "success": true,
  "data": {
    "items": [
      { "id": 2, "name": "Chicken Biryani Box", "variant": "double", "variantLabel": "Double Boti", "quantity": 2, "unitPrice": 750, "lineTotal": 1500 },
      { "id": 7, "name": "Salad", "variant": null, "variantLabel": null, "quantity": 1, "unitPrice": 50, "lineTotal": 50 }
    ],
    "subtotal": 1550,
    "deliveryFee": 0,
    "freeDeliveryThreshold": 1000,
    "total": 1550,
    "currency": "PKR"
  }
}
```

Delivery is a flat Rs. 100 and waived automatically once the subtotal
reaches Rs. 1000.

### `POST /api/orders/whatsapp`

Request:

```json
{
  "name": "Ayesha Khan",
  "phone": "03001234567",
  "address": "House 12, Street 4, Kharadar, Karachi",
  "items": [{ "id": 1, "quantity": 1 }]
}
```

Response includes a ready-to-open WhatsApp deep link with a pre-filled,
itemized order message:

```json
{
  "success": true,
  "data": {
    "url": "https://wa.me/923142961604?text=...",
    "message": "*New Order — Al Rehman Biryani*\n\nName: Ayesha Khan\n...",
    "summary": { "...": "same shape as /orders/calculate" }
  }
}
```

## Error format

```json
{ "success": false, "error": "Invalid variant \"large\" for \"Chicken Biryani Box\". Valid options: single, double" }
```

Validation errors return `400`, unknown routes/products return `404`,
unhandled failures return `500`.
