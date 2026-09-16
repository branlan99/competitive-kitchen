window.CK_PLAN = (() => {
  const { STORES, INGREDIENTS, RECIPES } = window.CK_DATA;

  function storeById(id) {
    return STORES.find((store) => store.id === id);
  }

  function bestBuy(ingredientId) {
    const item = INGREDIENTS[ingredientId];
    let best = null;
    for (const store of STORES) {
      const unitPrice = item.prices[store.id];
      if (unitPrice == null) continue;
      if (!best || unitPrice < best.unitPrice) {
        best = { storeId: store.id, unitPrice };
      }
    }
    return best;
  }

  function packsFor(qty, pack) {
    return Math.max(0, Math.ceil(qty / pack - 1e-9));
  }

  function priceAt(ingredientId, storeId) {
    const item = INGREDIENTS[ingredientId];
    if (storeId && item.prices[storeId] != null) {
      return { storeId, unitPrice: item.prices[storeId] };
    }
    return bestBuy(ingredientId);
  }

  function shoppingFromBatches(batches, pantry, people, storeId) {
    const need = {};
    for (const { recipe } of batches) {
      for (const row of recipe.ingredients) {
        if (pantry.has(row.id)) continue;
        need[row.id] = (need[row.id] || 0) + row.qty * people;
      }
    }

    return Object.entries(need)
      .map(([id, qty]) => {
        const item = INGREDIENTS[id];
        const buy = priceAt(id, storeId);
        const packs = packsFor(qty, item.pack);
        const cost = +(packs * item.pack * buy.unitPrice).toFixed(2);
        const alts = STORES.map((store) => ({
          storeId: store.id,
          store: store.name,
          unitPrice: item.prices[store.id],
          packCost: +(item.pack * item.prices[store.id]).toFixed(2),
        }));
        return {
          id,
          name: item.name,
          unit: item.unit,
          category: item.category,
          qty: +qty.toFixed(2),
          packs,
          packSize: item.pack,
          storeId: buy.storeId,
          unitPrice: buy.unitPrice,
          cost,
          alts,
        };
      })
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }

  function totalCost(lines) {
    return +lines.reduce((sum, line) => sum + line.cost, 0).toFixed(2);
  }

  function consolidateTrips(lines) {
    const primary = {};
    for (const line of lines) {
      const bucket = (primary[line.storeId] ||= { storeId: line.storeId, items: [], total: 0 });
      bucket.items.push(line);
      bucket.total += line.cost;
    }

    const mainId = Object.values(primary).sort((a, b) => b.items.length - a.items.length)[0]?.storeId;
    if (!mainId) return [];

    for (const line of lines) {
      if (line.storeId === mainId) continue;
      const here = line.alts.find((alt) => alt.storeId === mainId);
      if (!here) continue;
      const movedCost = +(line.packs * here.packCost).toFixed(2);
      const delta = movedCost - line.cost;
      const groupSize = primary[line.storeId]?.items.length || 0;
      if (groupSize <= 2 && delta <= Math.max(1.25, line.cost * 0.18)) {
        primary[line.storeId].items = primary[line.storeId].items.filter((row) => row !== line);
        primary[line.storeId].total -= line.cost;
        line.storeId = mainId;
        line.cost = movedCost;
        line.consolidated = true;
        primary[mainId].items.push(line);
        primary[mainId].total += movedCost;
      }
    }

    return Object.values(primary)
      .filter((group) => group.items.length)
      .map((group) => ({
        ...group,
        total: +group.total.toFixed(2),
        store: storeById(group.storeId),
      }))
      .sort((a, b) => b.total - a.total);
  }

  function recipeCost(recipe, pantry, people, storeId) {
    return totalCost(shoppingFromBatches([{ recipe }], pantry, people, storeId));
  }

  function cravingScore(recipe, cravings) {
    let score = 1;
    if (cravings.cuisines.length) {
      score += recipe.cuisines.some((tag) => cravings.cuisines.includes(tag)) ? 5 : -1;
    }
    if (cravings.proteins.length) {
      score += recipe.proteins.some((tag) => cravings.proteins.includes(tag)) ? 5 : -2;
    }
    return score;
  }

  function weekDays() {
    const start = new Date();
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return names.map((name, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        key: name,
        name,
        label: labels[index],
        date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      };
    });
  }

  function emptySlots(days, meals, cookingDays) {
    const activeDays = cookingDays ? days.filter((day) => cookingDays[day.key]) : days;
    const types = ["breakfast", "lunch", "dinner"].filter((meal) => meals[meal]);
    const slots = [];
    for (const day of activeDays) {
      for (const meal of types) {
        slots.push({ day: day.key, date: day.date, meal, recipe: null, leftover: false });
      }
    }
    return slots;
  }

  function assignRecipe(slots, recipe) {
    const unused = slots.filter((slot) => !slot.recipe);
    let order = [];
    if (recipe.meal === "breakfast") {
      order = unused.filter((slot) => slot.meal === "breakfast");
    } else {
      const daysSeen = [];
      for (const slot of unused) {
        if (!daysSeen.includes(slot.day)) daysSeen.push(slot.day);
      }
      for (const day of daysSeen) {
        const primary = unused.find((slot) => slot.day === day && slot.meal === recipe.meal);
        const extra =
          recipe.leftover && unused.find((slot) => slot.day === day && slot.meal === recipe.leftover);
        if (primary) order.push(primary);
        if (extra) order.push(extra);
      }
    }
    const taken = order.slice(0, recipe.yield);
    if (!taken.length) return [];
    taken.forEach((slot) => {
      slot.recipe = recipe;
      slot.leftover = slot.meal !== recipe.meal;
    });
    return taken;
  }

  function unassign(taken) {
    for (const slot of taken) {
      slot.recipe = null;
      slot.leftover = false;
    }
  }

  function planWeek({ budget, people, meals, cravings, pantry, storeId, cookingDays }) {
    const headcount = Math.max(1, Number(people) || 1);
    const cap = Math.max(15, Number(budget) || 70);
    const days = weekDays();
    const slots = emptySlots(days, meals, cookingDays);
    const pantrySet = pantry instanceof Set ? pantry : new Set(pantry || []);
    const batches = [];
    const shopStore = storeId || "bargain";

    const ranked = RECIPES.map((recipe) => ({
      recipe,
      score: cravingScore(recipe, cravings),
      cost: recipeCost(recipe, pantrySet, headcount, shopStore),
    })).sort((a, b) => b.score - a.score || a.cost / a.recipe.yield - b.cost / b.recipe.yield);

    const tryAdd = (recipe, allowDup = false) => {
      const copies = batches.filter((row) => row.recipe.id === recipe.id).length;
      if (!allowDup && copies) return false;
      if (allowDup && copies >= 2) return false;
      const taken = assignRecipe(slots, recipe);
      if (!taken.length) return false;
      batches.push({ recipe });
      if (totalCost(shoppingFromBatches(batches, pantrySet, headcount, shopStore)) > cap + 0.049) {
        batches.pop();
        unassign(taken);
        return false;
      }
      return true;
    };

    const breakfasts = ranked.filter((row) => row.recipe.meal === "breakfast");
    const dinners = ranked.filter((row) => row.recipe.meal === "dinner");
    const lunches = ranked.filter((row) => row.recipe.meal === "lunch");
    const tight = cap / headcount < 40;

    const waves = tight
      ? [dinners, lunches, breakfasts]
      : [breakfasts, dinners, lunches];
    for (const wave of waves) {
      for (const row of wave) {
        if (slots.some((slot) => !slot.recipe)) tryAdd(row.recipe);
      }
    }

    const cheap = [...ranked].sort((a, b) => a.cost / a.recipe.yield - b.cost / b.recipe.yield);
    for (const row of cheap) {
      if (slots.every((slot) => slot.recipe)) break;
      tryAdd(row.recipe, true);
    }

    const lines = shoppingFromBatches(batches, pantrySet, headcount, shopStore);
    const trips = consolidateTrips(lines);
    const spent = totalCost(lines);
    const filled = slots.filter((slot) => slot.recipe).length;
    const mealPrice = (recipe) => +(recipeCost(recipe, pantrySet, headcount, shopStore) / recipe.yield).toFixed(2);

    return {
      days,
      slots,
      batches: batches.map((row) => row.recipe),
      lines,
      trips,
      spent,
      budget: cap,
      people: headcount,
      storeId: shopStore,
      withinBudget: spent <= cap + 0.049,
      coverage: slots.length ? filled / slots.length : 1,
      savedByPantry: estimatePantrySavings(batches, pantrySet, headcount, shopStore),
      mealPrice,
    };
  }

  function estimatePantrySavings(batches, pantry, people, storeId) {
    const withPantry = totalCost(shoppingFromBatches(batches, pantry, people, storeId));
    const without = totalCost(shoppingFromBatches(batches, new Set(), people, storeId));
    return +Math.max(0, without - withPantry).toFixed(2);
  }

  return { planWeek, bestBuy, storeById, recipeCost, STORES };
})();
