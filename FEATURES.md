# Features

Code-derived inventory of what this repo implements. Bullets and key file paths —
the mechanism lives in `docs/how-it-works.md`, the walkthrough in `docs/demo-script.md`.

_Last generated: 2026-09-02 by feature-doc._

This repo (`integration-views`, package name `order-tracker`) is a set of Merchant
Center **Custom Views** (`connect.yaml`, `applicationType: merchant-center-custom-view`)
built from scratch — it is not a fork of any storefront starter, so no provenance tags
apply. Each view is a `CustomPanel` that Merchant Center embeds directly inside an
existing MC screen at a configured "locator," reading and writing the current record
through the commercetools GraphQL API. It ships two production-configured views —
Customer and Order — plus a third, Category, that exists in code but is only wired up
for local development.

## Customer view — `customers.customer_details.general`

Embeds a tabbed panel (`integration-views/src/components/customer/customer.tsx`) into
the customer detail screen's General tab.

- Customer Dashboard tab renders a mock external-systems overview: loyalty program
  balance, order-status summary, preferred-category donut chart, payment-method donut
  chart, and a contact-history timeline — all hardcoded sample data meant to stand in
  for real CRM/loyalty/OMS/PSP integrations
  (`integration-views/src/components/customer-dashboard/customer-dashboard.tsx`,
  `info-card/info-card.tsx`, `donut-chart/donut-chart.tsx`)
- Carts tab lists the customer's carts in a sortable, paginated table filtered by
  `customerId`, with "Freeze Cart" / "Unfreeze" toggling `TCartState`, cart deletion,
  discount-code add/remove, Direct Discount application, and the pricing breakdown,
  line items and shipping/billing addresses panel — real reads/writes against
  commercetools carts
  (`components/customer-carts/customer-carts.tsx`, `components/customer-cart/customer-cart.tsx`)
- Cart detail header cross-links to the order the cart converted into, if any, by
  querying orders where `cart(id=...)`
  (`components/cart-details-general-info-header/cart-details-general-info-header.tsx`)
- Shopping List tab lists the customer's shopping lists, and each list opens into an
  editor that adds a product variant (via a product/variant search field), removes a
  line item, changes a line item's quantity, or deletes the whole list — real
  commercetools Shopping List mutations
  (`components/customer-shopping-lists/customer-shopping-lists.tsx`,
  `components/customer-shopping-list/customer-shopping-list.tsx`)
- Customer Actions tab appears only when the customer's email is unverified; a "Verify
  now" button generates an email-verification token and immediately confirms it,
  bypassing the actual email step (`components/customer-actions/customer-actions.tsx`)
- Manage-scope actions (freeze/unfreeze, discounts, shopping-list edits) are gated
  behind `useIsAuthorized` on the view's own custom-view permission, not just the
  standard MC role

## Order view — `orders.order_details.general`

A single full-width info page (`integration-views/src/components/order/order.tsx`)
embedded in the order detail screen's General tab, framed as an external Order
Management System / carrier tracking screen.

- Renders the order's line items (thumbnail + name) alongside order ID and a hardcoded
  "Carrier: DHL" field
- A fixed 6-step fulfillment stepper (Ordered → Picking → Picked → Ready To Ship → In
  Transit → Delivered) always shown pinned at "In Transit," backed by a hardcoded
  timeline of delivery events — demo data, not derived from real order/delivery state
  (`commercetools-demo-shared-stepper` package, `order-details-item.tsx`)
- Embeds a live Google Maps "directions" iframe from a configurable fake sender address
  (`GOOGLE_MAP_ORIGIN`) to the order's shipping address, using a `GOOGLE_MAP_KEY`
  supplied via `connect.yaml`/environment — a real Google Maps embed standing in for a
  real carrier-tracking map
- Mock "Open in OMS," "Log Complaint," and "Export as XLS" buttons are rendered but not
  wired to any handler — placeholders illustrating where an external OMS/CRM/export
  integration would hook in (same pattern repeated on the Customer view's header)

## Category view — dev-only, not in the shipped locators list

`components/category/category.tsx`, routed but **not** listed in
`custom-view-config.mjs`'s `locators` (only `customers.customer_details.general` and
`orders.order_details.general` are configured for production) — reachable only via the
`categories` route mapping and a commented-out dev `hostUriPath`.

- Reads and writes a free-text "predicate" custom field
  (`dynamic-category-assignment` type, `predicateField`) on a category, via a
  predicate-builder form field
  (`category-predicate-field.tsx`, `commercetools-demo-shared-predicate-builder`
  package)
- Shows an explicit "Missing Type" notice if the `dynamic-category-assignment` custom
  type isn't present on the project, rather than failing silently

## Built but not wired up

- A bulk cart-action confirmation dialog (freeze / unfreeze / delete across multiple
  selected carts, `components/customer-carts-update/customer-carts-update.tsx`) exists
  and calls the same cart mutation hooks as the single-cart flow, but no other component
  imports or renders it — the carts list only supports per-row cart actions today

## Data layer and shared packages

- All commercetools reads/writes go through the shared, cross-demo packages
  `commercetools-demo-shared-data-fetching-hooks` (Apollo-backed fetch/update/delete
  hooks for customers, carts, orders, shopping lists, categories, types),
  `commercetools-demo-shared-cart-handling` (cart/shopping-list table columns, item
  renderers, pricing breakdown, addresses panel, discounts panel), and
  `commercetools-demo-shared-entity-selectors` (product/variant search field) — this
  repo owns only the view-level composition, not the underlying CT data access
- GraphQL types are generated from the live schema into
  `src/types/generated/ctp.ts` via `graphql-codegen` (`generate-types:ctp` script,
  `codegen.ctp.yml`, `schemas/ctp.json`)
- Localized strings for `en`/`de` under `src/i18n/data/`, extracted via
  `extract-intl` (`formatjs`)

## Demo tooling and deployment

- `connect.yaml` declares this as a `merchant-center-custom-view` commercetools Connect
  deployment, with configuration for the Custom View ID, cloud region
  (`CLOUD_IDENTIFIER`), and the fake sender address/API key for the Order view's Google
  Maps embed
- `netlify.toml` provides an alternate static-hosting path (SPA catch-all redirect) for
  the compiled bundle
- Local development points at a configurable commercetools project
  (`initialProjectKey`) and a specific customer/order/category record
  (`hostUriPath`) in `integration-views/custom-view-config.mjs`, so a developer can load
  the custom view against any project/record without deploying
- `oAuthScopes` request both `view_*` and `manage_*` scopes for orders, customers,
  shopping lists, products, types and categories — the view can both read and mutate
  each of those resource types
