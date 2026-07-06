# SwiftShift

A TMS (transportation management system) / load board built for small-to-mid size carriers and brokers who are tired of running their operation out of spreadsheets and group texts.

I built this after spending time on the carrier side of freight and seeing how much of the day-to-day (assigning drivers, chasing down paperwork, tracking which loads are actually profitable) still runs on manual processes. SwiftShift is my attempt at fixing that.

## What it does

- **Load management** — post, edit, and track loads from pickup to delivery
- **Driver assignment** — match drivers to loads and see availability at a glance
- **Dispatch board** — kanban-style view so dispatchers can see the status of every load without digging through a spreadsheet
- **Digital BOL/POD** — drivers upload bills of lading and proof of delivery from their phone, brokers can review and approve without waiting on a fax machine or email chain
- **Fuel card management** — track fuel card assignments and usage per driver
- **Route visualization** — Mapbox-powered maps show routes with real geocoding, not just a straight line between two dots
- **FAQ chatbot** — answers common driver/broker questions without a human having to jump in

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** PostgreSQL via Prisma
- **Auth:** Custom auth with bcrypt for hashing and Zod for validation
- **Maps:** Mapbox (Directions API + geocoding)
- **Hosting:** Vercel

## Why these choices

Next.js App Router because I wanted server components where it made sense (loads, driver data) without giving up the ability to build out interactive pieces like the dispatch board. Prisma + Postgres because the data model (loads, drivers, carriers, brokers, documents) is relational enough that an ORM with real migrations beats hand-rolled SQL or a NoSQL workaround.

## Status

Actively in development. This started as a portfolio project but the more I build it out, the more it feels like something that could actually be useful to a small carrier. Right now it's a demonstration of what a modern TMS could look like if it were built by someone who's actually worked freight, not just someone who read about it.

## Running it locally

```bash
git clone <repo-url>
cd swiftshift
npm install
```

Set up your `.env` with a Postgres connection string and Mapbox token, then:

```bash
npx prisma migrate dev
npm run dev
```

## Roadmap

- Broker-side load posting and bidding
- Better fuel card reconciliation
- Driver mobile experience improvements
- Reporting/analytics on load profitability

---

Built by Alexandre — CDL-A holder turned software engineer, trying to build the tools he wishes existed on the trucking side.
