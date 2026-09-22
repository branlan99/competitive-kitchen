window.CK_RECIPES = (() => {
  const API = "https://www.themealdb.com/api/json/v1/1";
  const CACHE_KEY = "ck-remote-recipes";
  const CACHE_MS = 1000 * 60 * 60 * 12;

  const SKIP = /^(water|ice|ice cubes?|salt and pepper)$/i;
  const FRACTIONS = {
    "1/8": 0.125,
    "1/4": 0.25,
    "1/3": 0.333,
    "3/8": 0.375,
    "1/2": 0.5,
    "5/8": 0.625,
    "2/3": 0.667,
    "3/4": 0.75,
    "7/8": 0.875,
  };

  const ALIASES = {
    oats: "oats",
    oatmeal: "oats",
    "rolled oats": "oats",
    porridge: "oats",
    rice: "rice",
    "white rice": "rice",
    "basmati rice": "rice",
    "jasmine rice": "rice",
    "brown rice": "rice",
    pasta: "pasta",
    spaghetti: "pasta",
    penne: "pasta",
    linguine: "pasta",
    fettuccine: "pasta",
    macaroni: "pasta",
    noodles: "pasta",
    "egg noodles": "pasta",
    lasagne: "pasta",
    lasagna: "pasta",
    bread: "bread",
    "white bread": "bread",
    "bread rolls": "bread",
    baguette: "bread",
    tortillas: "tortillas",
    tortilla: "tortillas",
    "flour tortillas": "tortillas",
    wraps: "tortillas",
    flour: "flour",
    "plain flour": "flour",
    "all-purpose flour": "flour",
    egg: "eggs",
    eggs: "eggs",
    milk: "milk",
    "whole milk": "milk",
    "semi-skimmed milk": "milk",
    yogurt: "yogurt",
    yoghurt: "yogurt",
    "greek yogurt": "yogurt",
    "plain yogurt": "yogurt",
    cheddar: "cheddar",
    "cheddar cheese": "cheddar",
    cheese: "cheddar",
    mozzarella: "mozzarella",
    parmesan: "parmesan",
    "parmesan cheese": "parmesan",
    "sour cream": "sourCream",
    butter: "butter",
    "chicken thighs": "chickenThigh",
    "chicken thigh": "chickenThigh",
    "chicken legs": "chickenThigh",
    chicken: "chickenThigh",
    "chicken breast": "chickenBreast",
    "chicken breasts": "chickenBreast",
    "boneless chicken": "chickenBreast",
    "chicken stock": "broth",
    "chicken broth": "broth",
    "vegetable stock": "broth",
    "beef stock": "broth",
    "ground beef": "groundBeef",
    "minced beef": "groundBeef",
    "beef mince": "groundBeef",
    "ground mince": "groundBeef",
    beef: "groundBeef",
    "minced steak": "groundBeef",
    "ground turkey": "groundTurkey",
    turkey: "groundTurkey",
    sausage: "sausage",
    sausages: "sausage",
    "smoked sausage": "sausage",
    bacon: "bacon",
    "bacon lardons": "bacon",
    pork: "pork",
    "pork chops": "pork",
    "pork shoulder": "pork",
    "pork mince": "pork",
    lamb: "lamb",
    "lamb mince": "lamb",
    tuna: "tuna",
    "canned tuna": "tuna",
    "tinned tuna": "tuna",
    shrimp: "shrimp",
    prawns: "shrimp",
    prawn: "shrimp",
    salmon: "salmon",
    tofu: "tofu",
    onion: "onion",
    onions: "onion",
    "red onion": "onion",
    "yellow onion": "onion",
    shallots: "onion",
    shallot: "onion",
    garlic: "garlic",
    "garlic clove": "garlic",
    "garlic cloves": "garlic",
    carrot: "carrot",
    carrots: "carrot",
    celery: "celery",
    broccoli: "broccoli",
    spinach: "spinach",
    "baby spinach": "spinach",
    "bell pepper": "pepper",
    "red pepper": "pepper",
    "green pepper": "pepper",
    peppers: "pepper",
    "red peppers": "pepper",
    tomato: "tomato",
    tomatoes: "tomato",
    "cherry tomatoes": "tomato",
    potato: "potato",
    potatoes: "potato",
    "russet potatoes": "potato",
    cabbage: "cabbage",
    banana: "banana",
    bananas: "banana",
    apple: "apple",
    apples: "apple",
    lemon: "lemon",
    lemons: "lemon",
    "lemon juice": "lemon",
    lime: "lime",
    limes: "lime",
    avocado: "avocado",
    avocados: "avocado",
    cucumber: "cucumber",
    lettuce: "lettuce",
    zucchini: "zucchini",
    courgette: "zucchini",
    mushroom: "mushroom",
    mushrooms: "mushroom",
    ginger: "ginger",
    "fresh ginger": "ginger",
    "canned tomatoes": "cannedTomato",
    "chopped tomatoes": "cannedTomato",
    "tinned tomatoes": "cannedTomato",
    "plum tomatoes": "cannedTomato",
    "tomato puree": "cannedTomato",
    "tomato paste": "cannedTomato",
    "passata": "cannedTomato",
    "frozen vegetables": "frozenVeg",
    "mixed vegetables": "frozenVeg",
    "black beans": "blackBeans",
    "kidney beans": "blackBeans",
    lentils: "lentils",
    "red lentils": "lentils",
    chickpeas: "chickpeas",
    "garbanzo beans": "chickpeas",
    corn: "corn",
    "sweetcorn": "corn",
    "coconut milk": "coconutMilk",
    "peanut butter": "peanutButter",
    salsa: "salsa",
    broth: "broth",
    stock: "broth",
    honey: "honey",
    "olive oil": "oliveOil",
    "vegetable oil": "vegOil",
    "sunflower oil": "vegOil",
    oil: "vegOil",
    "sesame oil": "sesameOil",
    "soy sauce": "soy",
    "light soy sauce": "soy",
    vinegar: "vinegar",
    "white vinegar": "vinegar",
    "red wine vinegar": "vinegar",
    "balsamic vinegar": "vinegar",
    "hot sauce": "hotSauce",
    "chili sauce": "hotSauce",
    "chilli sauce": "hotSauce",
    ketchup: "ketchup",
    mayonnaise: "mayo",
    mayo: "mayo",
    mustard: "mustard",
    salt: "salt",
    "sea salt": "salt",
    pepper: "blackPepper",
    "black pepper": "blackPepper",
    "garlic powder": "garlicPowder",
    cumin: "cumin",
    "ground cumin": "cumin",
    "chili powder": "chiliPowder",
    "chilli powder": "chiliPowder",
    paprika: "paprika",
    "smoked paprika": "paprika",
    "italian seasoning": "italian",
    oregano: "italian",
    "dried oregano": "italian",
    cinnamon: "cinnamon",
    sugar: "sugar",
    "caster sugar": "sugar",
    "brown sugar": "sugar",
  };

  const AREA_CUISINE = {
    italian: "italian",
    mexican: "mexican",
    indian: "indian",
    chinese: "asian",
    thai: "asian",
    japanese: "asian",
    vietnamese: "asian",
    malaysian: "asian",
    greek: "mediterranean",
    moroccan: "mediterranean",
    spanish: "mediterranean",
    tunisian: "mediterranean",
    egyptian: "mediterranean",
    american: "american",
    british: "american",
    canadian: "american",
    french: "american",
  };

  const CUISINE_AREAS = {
    italian: ["Italian"],
    mexican: ["Mexican"],
    indian: ["Indian"],
    asian: ["Chinese", "Thai", "Japanese", "Vietnamese"],
    mediterranean: ["Greek", "Moroccan", "Spanish"],
    american: ["American", "British"],
  };

  function normalizeName(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/\(.*?\)/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function mapIngredientName(name) {
    const key = normalizeName(name);
    if (!key || SKIP.test(key)) return null;
    if (ALIASES[key]) return ALIASES[key];
    const parts = key.split(" ").filter((word) => word.length > 2);
    for (let i = parts.length; i > 0; i--) {
      const slice = parts.slice(-i).join(" ");
      if (ALIASES[slice]) return ALIASES[slice];
    }
    for (const [alias, id] of Object.entries(ALIASES)) {
      if (key.includes(alias) && alias.length > 3) return id;
    }
    return null;
  }

  function parseAmount(measure) {
    const text = String(measure || "").toLowerCase().trim();
    if (!text || /pinch|to taste|garnish|optional|for serving|handful|dash/.test(text)) return { qty: 0, unit: "" };
    let qty = 0;
    const mixed = text.match(/(\d+)\s+(\d+\/\d+)/);
    const frac = text.match(/(\d+\/\d+)/);
    const decimal = text.match(/(\d+(?:\.\d+)?)/);
    if (mixed) qty = Number(mixed[1]) + (FRACTIONS[mixed[2]] || 0);
    else if (frac && FRACTIONS[frac[1]]) qty = FRACTIONS[frac[1]];
    else if (decimal) qty = Number(decimal[1]);
    if (!qty) qty = 1;
    return { qty, unit: text };
  }

  function convertQty(mappedId, amount, rawName) {
    const item = window.CK_DATA.INGREDIENTS[mappedId];
    if (!item) return 1;
    const { qty, unit } = amount;
    const u = unit;
    const target = item.unit;

    if (/kg|kilogram/.test(u)) return target === "lb" ? qty * 2.2 : qty;
    if (/\bg\b|gram/.test(u) && !/garlic/.test(u)) return target === "lb" ? qty / 454 : target === "oz" ? qty / 28.35 : qty;
    if (/\blb\b|pound/.test(u)) return target === "lb" ? qty : target === "oz" ? qty * 16 : qty;
    if (/\boz\b|ounce/.test(u)) {
      if (target === "oz") return qty;
      if (target === "lb") return qty / 16;
      return qty;
    }
    if (/cup/.test(u)) {
      if (target === "oz") return qty * 8;
      if (target === "lb") return qty * 0.35;
      if (target === "gal") return qty / 16;
      if (target === "can") return Math.max(1, Math.round(qty / 2));
      return qty;
    }
    if (/tbsp|tablespoon/.test(u)) {
      if (target === "oz") return qty * 0.5;
      if (target === "lb") return qty * 0.03;
      return Math.max(0.1, qty * 0.1);
    }
    if (/tsp|teaspoon/.test(u)) {
      if (target === "oz") return qty * 0.17;
      return Math.max(0.05, qty * 0.05);
    }
    if (/clove/.test(u) || /garlic/.test(normalizeName(rawName))) {
      return target === "each" ? Math.max(0.15, qty / 8) : qty;
    }
    if (/can|tin|jar/.test(u) && target === "can") return Math.max(1, qty);
    if (/pack|bunch|loaf|head/.test(u)) return Math.max(1, qty);
    if (/medium|large|small|whole/.test(u) && (target === "each" || target === "lb")) return Math.max(1, qty);
    if (target === "each" || target === "can" || target === "loaf" || target === "pack" || target === "bunch") {
      return Math.max(1, Math.round(qty) || 1);
    }
    return qty;
  }

  function estimatePrices(base) {
    return {
      bargain: +Math.max(0.15, base * 0.82).toFixed(2),
      value: +base.toFixed(2),
      harbor: +(base * 1.15).toFixed(2),
      shoprite: +(base * 1.18).toFixed(2),
      grove: +(base * 1.85).toFixed(2),
    };
  }

  function guessDynamicItem(name) {
    const key = normalizeName(name);
    const id = `dyn-${key.replace(/\s+/g, "-")}`.slice(0, 40);
    let category = "Other";
    let unit = "each";
    let pack = 1;
    let base = 2.49;
    if (/cheese|cream|yogurt|yoghurt|butter|milk/.test(key)) {
      category = "Dairy";
      unit = "lb";
      base = 5.49;
    } else if (/chicken|beef|pork|lamb|bacon|sausage|turkey|fish|salmon|shrimp|prawn|steak/.test(key)) {
      category = "Meat";
      unit = "lb";
      base = 6.49;
    } else if (/oil/.test(key)) {
      category = "Oils";
      unit = "oz";
      pack = 12;
      base = 0.28;
    } else if (/sauce|paste|ketchup|mayo|mustard|vinegar|soy/.test(key)) {
      category = "Condiments";
      unit = "oz";
      pack = 12;
      base = 0.18;
    } else if (/spice|powder|cumin|paprika|chili|oregano|basil|thyme|cinnamon|pepper|salt/.test(key)) {
      category = "Seasonings";
      unit = "oz";
      pack = 2;
      base = 0.7;
    } else if (/bean|lentil|rice|flour|sugar|pasta|oat|noodle/.test(key)) {
      category = "Pantry";
      unit = "lb";
      base = 1.69;
    } else if (/frozen/.test(key)) {
      category = "Frozen";
      unit = "lb";
      base = 2.29;
    } else {
      category = "Produce";
      unit = "each";
      base = 1.49;
    }
    return {
      id,
      item: {
        name: name.replace(/\b\w/g, (ch) => ch.toUpperCase()),
        unit,
        pack,
        category,
        prices: estimatePrices(base),
        dynamic: true,
      },
    };
  }

  function cuisineFromArea(area) {
    return AREA_CUISINE[String(area || "").toLowerCase()] || "american";
  }

  function classifyMeal(meal, preferred) {
    const category = String(meal.strCategory || "").toLowerCase();
    const name = String(meal.strMeal || "").toLowerCase();
    const tags = String(meal.strTags || "").toLowerCase();
    if (preferred) return preferred;
    if (category === "breakfast" || /breakfast|pancake|omelette|oatmeal|granola|toast/.test(`${name} ${tags}`)) {
      return "breakfast";
    }
    if (category === "starter" || category === "side" || /salad|sandwich|wrap|soup|quesadilla/.test(name)) {
      return "lunch";
    }
    return "dinner";
  }

  function splitSteps(text) {
    return String(text || "")
      .split(/\r?\n+/)
      .map((line) => line.replace(/^\s*\d+[.)]\s*/, "").trim())
      .filter((line) => line.length > 2);
  }

  function proteinsFrom(ids) {
    const out = [];
    if (ids.some((id) => /chicken|turkey/.test(id))) out.push("chicken");
    if (ids.some((id) => /beef|lamb/.test(id))) out.push("beef");
    if (ids.some((id) => /pork|sausage|bacon/.test(id))) out.push("pork");
    if (ids.some((id) => /tuna|salmon|shrimp/.test(id))) out.push("fish");
    if (ids.includes("eggs")) out.push("eggs");
    if (!out.length) out.push("vegetarian");
    return out;
  }

  function fromMeal(meal, preferredMeal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (!name || !String(name).trim()) continue;
      if (SKIP.test(name.trim())) continue;
      let id = mapIngredientName(name);
      if (!id) {
        const dyn = guessDynamicItem(name);
        id = dyn.id;
        window.CK_DATA.addIngredient(dyn.id, dyn.item);
      }
      const qty = convertQty(id, parseAmount(measure), name);
      if (qty <= 0) continue;
      const existing = ingredients.find((row) => row.id === id);
      if (existing) existing.qty = +(existing.qty + qty).toFixed(2);
      else ingredients.push({ id, qty: +qty.toFixed(2) });
    }
    if (!ingredients.length) return null;

    const mealType = classifyMeal(meal, preferredMeal);
    const minutes = mealType === "breakfast" ? 20 : mealType === "lunch" ? 25 : 40;
    return {
      id: `meal-${meal.idMeal}`,
      name: meal.strMeal,
      meal: mealType,
      leftover: mealType === "dinner" ? "lunch" : null,
      yield: mealType === "breakfast" ? 5 : 4,
      minutes,
      cuisines: [cuisineFromArea(meal.strArea)],
      proteins: proteinsFrom(ingredients.map((row) => row.id)),
      ingredients,
      instructions: splitSteps(meal.strInstructions),
      image: meal.strMealThumb,
      sourceUrl: meal.strSource || "",
      video: meal.strYoutube || "",
      tag: mealType === "breakfast" ? "Breakfast" : meal.strArea || "Weeknight",
      source: "themealdb",
      kcal: null,
      protein: null,
      carbs: null,
      fat: null,
    };
  }

  async function getJson(url) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  async function listMeals(kind, value) {
    const param = kind === "area" ? "a" : "c";
    const json = await getJson(`${API}/filter.php?${param}=${encodeURIComponent(value)}`);
    return json.meals || [];
  }

  async function lookupMeal(id) {
    const json = await getJson(`${API}/lookup.php?i=${encodeURIComponent(id)}`);
    return (json.meals && json.meals[0]) || null;
  }

  function readCache() {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function writeCache(recipes, extras) {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        recipes,
        extras,
      })
    );
  }

  function extraIngredients() {
    const extras = {};
    for (const [id, item] of Object.entries(window.CK_DATA.INGREDIENTS)) {
      if (item.dynamic) extras[id] = item;
    }
    return extras;
  }

  function hydrateFromCache() {
    const cache = readCache();
    if (!cache || !Array.isArray(cache.recipes)) return [];
    for (const [id, item] of Object.entries(cache.extras || {})) {
      window.CK_DATA.addIngredient(id, item);
    }
    window.CK_DATA.addRecipes(cache.recipes);
    return cache.recipes;
  }

  function cacheIsFresh(cache, meals, cuisines) {
    if (!cache || Date.now() - cache.savedAt > CACHE_MS) return false;
    const recipes = cache.recipes || [];
    const needed = ["breakfast", "lunch", "dinner"].filter((meal) => meals[meal]);
    return needed.every((meal) => recipes.some((recipe) => recipe.meal === meal));
  }

  async function fetchWeekRecipes({ meals, cuisines, force } = {}) {
    const wantedMeals = meals || { breakfast: true, lunch: true, dinner: true };
    const wantedCuisines = cuisines || [];
    const cache = readCache();
    if (!force && cacheIsFresh(cache, wantedMeals, wantedCuisines)) {
      hydrateFromCache();
      return { recipes: cache.recipes, fromCache: true };
    }

    const picks = [];
    const seen = new Set();
    const addPick = (row, preferred) => {
      if (!row || seen.has(row.idMeal)) return;
      seen.add(row.idMeal);
      picks.push({ id: row.idMeal, preferred });
    };

    const jobs = [];
    if (wantedMeals.breakfast) jobs.push(listMeals("category", "Breakfast").then((rows) => rows.forEach((row) => addPick(row, "breakfast"))).catch(() => {}));
    if (wantedMeals.lunch) {
      jobs.push(listMeals("category", "Starter").then((rows) => rows.forEach((row) => addPick(row, "lunch"))).catch(() => {}));
      jobs.push(listMeals("category", "Side").then((rows) => rows.forEach((row) => addPick(row, "lunch"))).catch(() => {}));
      jobs.push(listMeals("category", "Vegetarian").then((rows) => rows.forEach((row) => addPick(row, "lunch"))).catch(() => {}));
    }
    if (wantedMeals.dinner) {
      jobs.push(listMeals("category", "Chicken").then((rows) => rows.forEach((row) => addPick(row, "dinner"))).catch(() => {}));
      jobs.push(listMeals("category", "Beef").then((rows) => rows.forEach((row) => addPick(row, "dinner"))).catch(() => {}));
      jobs.push(listMeals("category", "Pasta").then((rows) => rows.forEach((row) => addPick(row, "dinner"))).catch(() => {}));
      jobs.push(listMeals("category", "Pork").then((rows) => rows.forEach((row) => addPick(row, "dinner"))).catch(() => {}));
    }
    for (const cuisine of wantedCuisines) {
      for (const area of CUISINE_AREAS[cuisine] || []) {
        jobs.push(listMeals("area", area).then((rows) => rows.forEach((row) => addPick(row, wantedMeals.dinner ? "dinner" : null))).catch(() => {}));
      }
    }

    await Promise.all(jobs);
    const grouped = { breakfast: [], lunch: [], dinner: [] };
    for (const pick of picks) (grouped[pick.preferred] || grouped.dinner).push(pick);
    const sampled = [
      ...shuffle(grouped.breakfast).slice(0, 5),
      ...shuffle(grouped.lunch).slice(0, 5),
      ...shuffle(grouped.dinner).slice(0, 6),
    ];
    const looked = await Promise.all(sampled.map((row) => lookupMeal(row.id).then((meal) => ({ meal, preferred: row.preferred })).catch(() => null)));
    const recipes = looked
      .map((row) => row && row.meal && fromMeal(row.meal, row.preferred))
      .filter(Boolean)
      .filter((recipe) => recipe.ingredients.length <= 14);

    window.CK_DATA.addRecipes(recipes);
    writeCache(recipes, extraIngredients());
    return { recipes, fromCache: false };
  }

  return { fetchWeekRecipes, hydrateFromCache, mapIngredientName };
})();
