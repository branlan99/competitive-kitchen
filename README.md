# Competitive Kitchen

A phone meal planner: make this week's food plan, pick a store and budget, say what you already have, get breakfast / lunch / dinner plus a checkable grocery list.

Live: [competitive-kitchen.vercel.app](https://competitive-kitchen.vercel.app)

## First screen

**Make this week's food plan** — supermarket, weekly budget, household size, breakfast / lunch / dinner, cooking days, cravings, and pantry. Then the app builds the week.

## Tabs after you plan

- **Plan** — estimated cost vs budget, breakfast / lunch / dinner cards for each cooking day, leftover lunches noted
- **Meals** — browse by meal type and cuisine, open a recipe for ingredients and steps
- **List** — grocery list sorted by category, typical price at your store, maps link
- **Prefs** — same planning controls, rebuild the week

## Stores and prices

Typical 2026 US everyday prices for **Aldi**, **Walmart**, **Kroger**, **ShopRite**, and **Whole Foods**. These are estimates, not a live local ad feed.

## Recipes without a food database

The app does not host a giant recipe catalog. When you tap **Make this week's plan**, it pulls recipes on demand from [TheMealDB](https://www.themealdb.com/) (free, no API key) and maps ingredients onto the priced grocery list. A small set of breakfast, lunch, and dinner staples is kept as a fallback if the network is down.
