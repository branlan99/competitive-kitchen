# Competitive Kitchen

A weekly food planner. It asks what you want to eat, what is already in your kitchen, and how much you want to spend. Then it builds a week of meals, prices each ingredient across store types, and tells you where to shop.

Live: [competitive-kitchen.vercel.app](https://competitive-kitchen.vercel.app)

## What it does

1. **Budget** — e.g. $70 for the week, plus how many people and which meals.
2. **Eat** — cuisines and proteins you want.
3. **Pantry** — seasonings, oils, staples, and fridge items you already have.
4. **Plan** — a Mon–Sun board that fits the budget, with leftovers labeled.
5. **Shop** — best typical price per item, grouped into store trips, with a maps link to find that store type near you.

Prices are typical US grocery estimates by store type (discount, big-box, supermarket, premium), not a live local ad feed.

## Deploy

Static files at the repo root. Push to `main` and Vercel updates production.
