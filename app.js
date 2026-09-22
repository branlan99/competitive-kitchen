(() => {
  const { PANTRY_GROUPS } = window.CK_DATA;
  const { planWeek, storeById } = window.CK_PLAN;

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const MEALS = [
    ["breakfast", "Breakfast"],
    ["lunch", "Lunch"],
    ["dinner", "Dinner"],
  ];
  const CUISINES = [
    ["italian", "Italian", "Pasta · marinara · sausage", "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a7?auto=format&fit=crop&w=800&q=70"],
    ["asian", "Asian", "Noodles · curry · stir-fry", "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=70"],
    ["mexican", "Mexican", "Tacos · burritos · beans", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=70"],
    ["indian", "Indian", "Curry · lentils", "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=70"],
    ["mediterranean", "Mediterranean", "Lemon chicken · bowls", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=70"],
    ["american", "American", "Chili · potatoes · toast", "https://images.unsplash.com/photo-1547592166-23acba8896fb?auto=format&fit=crop&w=800&q=70"],
  ];

  const EMOJI = {
    oats: "🥣", rice: "🍚", pasta: "🍝", bread: "🍞", tortillas: "🫓", flour: "🌾",
    eggs: "🥚", milk: "🥛", yogurt: "🥛", cheddar: "🧀", mozzarella: "🧀", parmesan: "🧀",
    sourCream: "🥛", butter: "🧈",
    chickenThigh: "🍗", chickenBreast: "🍗", groundBeef: "🥩", groundTurkey: "🦃",
    sausage: "🌭", bacon: "🥓", pork: "🥩", lamb: "🥩", tuna: "🐟", shrimp: "🦐",
    salmon: "🐟", tofu: "🧈",
    onion: "🧅", garlic: "🧄", carrot: "🥕", celery: "🥬", broccoli: "🥦", spinach: "🥬",
    pepper: "🫑", tomato: "🍅", potato: "🥔", cabbage: "🥬", banana: "🍌", apple: "🍎",
    lemon: "🍋", lime: "🍋", avocado: "🥑", cucumber: "🥒", lettuce: "🥬", zucchini: "🥒",
    mushroom: "🍄", ginger: "🫚",
    cannedTomato: "🥫", frozenVeg: "🧊", blackBeans: "🫘", lentils: "🫘", chickpeas: "🫘",
    corn: "🌽", coconutMilk: "🥥", peanutButter: "🥜", salsa: "🫙", broth: "🥣", honey: "🍯",
    oliveOil: "🫒", vegOil: "🛢️", sesameOil: "🫙",
    soy: "🫙", vinegar: "🫙", hotSauce: "🌶️", ketchup: "🍅", mayo: "🫙", mustard: "🫙",
    salt: "🧂", blackPepper: "🧂",
  };

  const ICONS = {
    plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    meals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16M7 20V9m5 11V4m5 16v-7"/><path d="M4 9h6"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 7 5 4H2"/></svg>',
    prefs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.5-1 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1-1.5 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H8a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V8c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  };

  const saved = JSON.parse(localStorage.getItem("ck-prefs") || "null") || {};
  if (window.CK_RECIPES) window.CK_RECIPES.hydrateFromCache();

  function thisWeekStart() {
    const start = new Date();
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - mondayOffset);
    return start.getTime();
  }

  const hasPlanThisWeek = Boolean(saved.plannedAt && saved.plannedAt >= thisWeekStart());
  const legacyDinnerOnly =
    saved.meals && saved.meals.dinner && !saved.meals.breakfast && !saved.meals.lunch && !saved.plannedAt;

  const state = {
    tab: hasPlanThisWeek ? "plan" : "setup",
    overlay: null,
    recipe: null,
    budget: saved.budget || 90,
    people: saved.people || 2,
    storeId: saved.storeId || "bargain",
    meals: legacyDinnerOnly || !saved.meals ? { breakfast: true, lunch: true, dinner: true } : saved.meals,
    cookingDays: saved.cookingDays || { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    cravings: saved.cravings || { cuisines: [], proteins: [] },
    pantry: new Set(saved.pantry || ["salt", "oliveOil", "vegOil"]),
    mealFilter: "",
    checked: new Set(),
    plan: null,
    loading: false,
    loadError: "",
    plannedAt: saved.plannedAt || 0,
  };

  const screen = document.getElementById("screen");
  const tabs = document.getElementById("tabs");

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function data() {
    return window.CK_DATA;
  }

  function persist() {
    localStorage.setItem(
      "ck-prefs",
      JSON.stringify({
        budget: state.budget,
        people: state.people,
        storeId: state.storeId,
        meals: state.meals,
        cookingDays: state.cookingDays,
        cravings: state.cravings,
        pantry: [...state.pantry],
        plannedAt: state.plannedAt,
      })
    );
  }

  function readForm() {
    const budget = document.getElementById("budget");
    const store = document.getElementById("store");
    if (budget) state.budget = Number(budget.value) || state.budget;
    if (store) state.storeId = store.value;
  }

  function rebuild() {
    const daysOn = Object.values(state.cookingDays).some(Boolean);
    if (!daysOn) state.cookingDays.Mon = true;
    const mealsOn = Object.values(state.meals).some(Boolean);
    if (!mealsOn) state.meals.dinner = true;
    state.plan = planWeek({
      budget: state.budget,
      people: state.people,
      meals: state.meals,
      cravings: state.cravings,
      pantry: state.pantry,
      storeId: state.storeId,
      cookingDays: state.cookingDays,
    });
    state.checked = new Set();
    persist();
  }

  async function makePlan({ force = true } = {}) {
    if (state.loading) return;
    readForm();
    state.loading = true;
    state.loadError = "";
    render();
    try {
      if (window.CK_RECIPES) {
        await window.CK_RECIPES.fetchWeekRecipes({
          meals: state.meals,
          cuisines: state.cravings.cuisines,
          force,
        });
      }
    } catch (err) {
      state.loadError = "Could not reach the recipe library. Built the week from kitchen staples instead.";
    }
    rebuild();
    state.plannedAt = Date.now();
    persist();
    state.loading = false;
    state.tab = "plan";
    state.overlay = null;
    render();
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function mealLabel(meal) {
    return MEALS.find((row) => row[0] === meal)?.[1] || meal;
  }

  function photo(src) {
    return src || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70";
  }

  function recipeButton(recipe, extra = "") {
    const plan = state.plan;
    return `
      <button class="meal-card" type="button" data-recipe="${recipe.id}">
        <img alt="" src="${photo(recipe.image)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=70'" />
        <div>
          <h3>${recipe.name}</h3>
          <span class="tag">${extra || recipe.tag || "Weeknight"}</span>
          <div class="meta">${recipe.minutes}m · ${state.people} ${state.people === 1 ? "serving" : "servings"}${plan ? ` · ${money(plan.mealPrice(recipe))}` : ""}</div>
        </div>
      </button>`;
  }

  function dayCards() {
    const plan = state.plan;
    const mealTypes = MEALS.filter(([id]) => state.meals[id]).map(([id]) => id);
    return plan.days
      .filter((day) => state.cookingDays[day.key])
      .map((day) => {
        const slots = mealTypes.map((meal) => plan.slots.find((slot) => slot.day === day.key && slot.meal === meal));
        return `
          <p class="day-label">${day.label} · ${day.date}</p>
          ${slots
            .map((slot) => {
              if (!slot || !slot.recipe) {
                return `<div class="white-card empty-slot">${mealLabel(slot?.meal || "meal")} — nothing planned. Raise the budget or add pantry items.</div>`;
              }
              const tag = slot.leftover ? "Leftovers" : mealLabel(slot.meal);
              return recipeButton(slot.recipe, tag);
            })
            .join("")}`;
      })
      .join("");
  }

  function storeCards(selectedId) {
    return `<div class="store-grid">
      ${data()
        .STORES.map(
          (store) => `
        <button type="button" class="store-card ${store.id === selectedId ? "on" : ""}" data-store="${store.id}">
          <strong>${store.name}</strong>
          <small>${store.kind}</small>
        </button>`
        )
        .join("")}
    </div>`;
  }

  function mealToggles() {
    return `<div class="chips">
      ${MEALS.map(
        ([id, name]) =>
          `<button class="chip ${state.meals[id] ? "on" : ""}" type="button" data-meal-toggle="${id}">${name}</button>`
      ).join("")}
    </div>`;
  }

  function renderSetup() {
    const hasPlan = state.plannedAt && state.plannedAt >= thisWeekStart();
    return `
      <div class="hero-green">
        <div class="logo-row">
          <div class="logo-mark">🥗</div>
          <div class="wordmark">Kitchen</div>
        </div>
        <h1>Make this week's food plan</h1>
        <p class="hero-sub">Choose a store, a budget, and breakfast / lunch / dinner. We pull recipes on demand — no giant food database on the server.</p>
      </div>
      <div class="field"><span>Where are you shopping?</span>${storeCards(state.storeId)}</div>
      <div class="field"><span>Weekly budget</span>
        <input id="budget" type="number" min="20" max="400" value="${state.budget}" />
      </div>
      <div class="field"><span>Household size</span>
        <div class="stepper">
          <button type="button" data-people="-1">−</button>
          <b>${state.people} ${state.people === 1 ? "person" : "people"}</b>
          <button type="button" data-people="1">+</button>
        </div>
      </div>
      <div class="field"><span>Meals to plan</span>${mealToggles()}</div>
      <div class="field"><span>Cooking days</span>
        <div class="days">
          ${DAYS.map((day) => `<button type="button" class="${state.cookingDays[day] ? "on" : ""}" data-day="${day}">${day}</button>`).join("")}
        </div>
      </div>
      <div class="field"><span>What are you craving?</span>
        <div class="chips">
          ${CUISINES.map(([id, name]) => `<button class="chip ${state.cravings.cuisines.includes(id) ? "on" : ""}" type="button" data-cuisine="${id}">${name}</button>`).join("")}
        </div>
      </div>
      <div class="field"><span>Already in the kitchen?</span>
        ${PANTRY_GROUPS.map(
          (group) => `
          <p class="cat">${group.title}</p>
          <div class="check-grid">
            ${group.items
              .map((id) => `<label><input type="checkbox" data-pantry="${id}" ${state.pantry.has(id) ? "checked" : ""}/> ${data().INGREDIENTS[id].name}</label>`)
              .join("")}
          </div>`
        ).join("")}
      </div>
      ${state.loadError ? `<p class="notice">${state.loadError}</p>` : ""}
      <button class="btn" type="button" data-make-plan ${state.loading ? "disabled" : ""}>${state.loading ? "Finding recipes…" : "Make this week's plan"}</button>
      ${hasPlan ? `<button class="btn ghost" type="button" data-tab="plan" style="margin-top:10px">View this week's plan</button>` : ""}`;
  }

  function renderPlan() {
    const plan = state.plan;
    const store = storeById(plan.storeId);
    const bought = plan.lines.filter((line) => state.checked.has(line.id)).length;
    const mealCount = plan.slots.filter((slot) => slot.recipe).length;
    return `
      <p class="hello">${greeting()}</p>
      <h1>This week's food plan</h1>
      <div class="store-pill">${store.name} · ${mealCount} meals</div>
      <div class="stats">
        <div class="stat"><span>Est. cost</span><b>${money(plan.spent)}</b><small> / ${money(plan.budget)}</small></div>
        <button class="stat" type="button" data-tab="shop" style="cursor:pointer;border:0;text-align:left">
          <span>Grocery list</span><b>${bought}/${plan.lines.length}</b><small> items to buy</small>
        </button>
      </div>
      <p class="fine-print">Typical ${store.name} prices, not a live ad feed. Recipes from TheMealDB plus kitchen staples.</p>
      ${dayCards()}
      <button class="btn ghost" type="button" data-tab="setup" style="margin-top:18px">Make a new plan</button>`;
  }

  function renderMeals() {
    const cuisine = state.cravings.cuisines[0];
    const list = data().RECIPES.filter((recipe) => {
      if (state.mealFilter && recipe.meal !== state.mealFilter) return false;
      if (cuisine && !recipe.cuisines.includes(cuisine)) return false;
      return true;
    });
    return `
      <h1 class="section-title">Recipes</h1>
      <div class="chips" style="margin-bottom:12px">
        <button class="chip ${!state.mealFilter ? "on" : ""}" type="button" data-meal-filter="">All</button>
        ${MEALS.map(([id, name]) => `<button class="chip ${state.mealFilter === id ? "on" : ""}" type="button" data-meal-filter="${id}">${name}</button>`).join("")}
      </div>
      <div class="cuisine-grid">
        ${CUISINES.map(
          ([id, name, blurb, img]) => `
          <button class="cuisine-card" type="button" data-cuisine="${id}">
            <img alt="" src="${img}" />
            <div><strong>${name}</strong><small>${blurb}</small></div>
          </button>`
        ).join("")}
      </div>
      <p class="day-label" style="margin-top:22px">${state.mealFilter ? mealLabel(state.mealFilter) : "All meals"}</p>
      ${list.map((recipe) => recipeButton(recipe, mealLabel(recipe.meal))).join("") || '<p class="meta">No recipes in this filter yet. Make a new plan to pull more.</p>'}`;
  }

  function renderPrefs() {
    return `
      <h1 class="section-title">Plan preferences</h1>
      <div class="field"><span>Supermarket</span>${storeCards(state.storeId)}</div>
      <div class="field"><span>Weekly budget</span>
        <input id="budget" type="number" min="20" max="400" value="${state.budget}" />
      </div>
      <div class="field"><span>Household size</span>
        <div class="stepper">
          <button type="button" data-people="-1">−</button>
          <b>${state.people} ${state.people === 1 ? "person" : "people"}</b>
          <button type="button" data-people="1">+</button>
        </div>
      </div>
      <div class="field"><span>Meals to plan</span>${mealToggles()}</div>
      <div class="field"><span>Cooking days</span>
        <div class="days">
          ${DAYS.map((day) => `<button type="button" class="${state.cookingDays[day] ? "on" : ""}" data-day="${day}">${day}</button>`).join("")}
        </div>
      </div>
      <div class="field"><span>What do you want to eat?</span>
        <div class="chips">
          ${CUISINES.map(([id, name]) => `<button class="chip ${state.cravings.cuisines.includes(id) ? "on" : ""}" type="button" data-cuisine="${id}">${name}</button>`).join("")}
        </div>
      </div>
      <div class="field"><span>What’s already in the kitchen?</span>
        ${PANTRY_GROUPS.map(
          (group) => `
          <p class="cat">${group.title}</p>
          <div class="check-grid">
            ${group.items
              .map((id) => `<label><input type="checkbox" data-pantry="${id}" ${state.pantry.has(id) ? "checked" : ""}/> ${data().INGREDIENTS[id].name}</label>`)
              .join("")}
          </div>`
        ).join("")}
      </div>
      <button class="btn" type="button" data-make-plan>Rebuild this week</button>`;
  }

  function renderShop() {
    const plan = state.plan;
    const store = storeById(plan.storeId);
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
    const bought = plan.lines.filter((line) => state.checked.has(line.id)).length;
    const groups = {};
    for (const line of plan.lines) (groups[line.category] ||= []).push(line);
    return `
      <p class="hello">This week</p>
      <h1 class="section-title">Grocery list</h1>
      <div class="store-pill">${store.name} · ${bought}/${plan.lines.length} done</div>
      <p class="meta" style="margin:0 0 12px"><a href="${maps}" target="_blank" rel="noopener">Find ${store.name} near me</a> · ${money(plan.spent)}</p>
      ${Object.entries(groups)
        .map(
          ([cat, items]) => `
        <p class="cat">${cat}</p>
        ${items
          .map((line) => {
            const done = state.checked.has(line.id) ? "done" : "";
            const cheaper = line.alts
              .filter((alt) => alt.storeId !== line.storeId && alt.packCost < line.cost - 0.2)
              .sort((a, b) => a.packCost - b.packCost)[0];
            return `<label class="shop-item ${done}">
              <input type="checkbox" data-check="${line.id}" ${done ? "checked" : ""} />
              <span><b>${EMOJI[line.id] || "🛒"} ${line.name}</b><br />${line.qty} ${line.unit} needed${cheaper ? ` · ${storeById(cheaper.storeId).name} cheaper` : ""}</span>
              <b>${money(line.cost)}</b>
            </label>`;
          })
          .join("")}`
        )
        .join("")}`;
  }

  function renderRecipe(recipe) {
    const plan = state.plan;
    const price = plan ? plan.mealPrice(recipe) : 0;
    const steps = recipe.instructions && recipe.instructions.length ? recipe.instructions : ["No written steps for this one — cook from the ingredient list."];
    return `
      <div class="sheet">
        <button class="back" type="button" data-close>←</button>
        <img class="cover-lg" alt="" src="${photo(recipe.image)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70'" />
        <div class="sheet-body">
          <h1>${recipe.name}</h1>
          <span class="tag">${recipe.tag || mealLabel(recipe.meal)}</span>
          <div class="macros">
            <div><b>${recipe.kcal || "—"}</b><span>kcal</span></div>
            <div><b>${recipe.protein || "—"}g</b><span>Protein</span></div>
            <div><b>${recipe.carbs || "—"}g</b><span>Carbs</span></div>
            <div><b>${recipe.fat || "—"}g</b><span>Fats</span></div>
          </div>
          <p class="meta">${mealLabel(recipe.meal)} · ${recipe.minutes}m · Serves ${recipe.yield} · ${money(price)} / serving</p>
          <p class="cat">Ingredients</p>
          ${recipe.ingredients
            .map((row) => {
              const item = data().INGREDIENTS[row.id];
              if (!item) return "";
              const have = state.pantry.has(row.id);
              return `<div class="shop-item"><span>${EMOJI[row.id] || ""} ${item.name}</span><span>${row.qty} ${item.unit}${have ? " · in pantry" : ""}</span></div>`;
            })
            .join("")}
          <p class="cat">How to make it</p>
          <ol class="steps">
            ${steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
          ${recipe.video ? `<p class="meta"><a href="${recipe.video}" target="_blank" rel="noopener">Watch the recipe</a></p>` : ""}
        </div>
      </div>`;
  }

  function renderTabs() {
    tabs.hidden = Boolean(state.overlay) || state.tab === "setup";
    tabs.innerHTML = [
      ["plan", "plan"],
      ["meals", "meals"],
      ["shop", "list"],
      ["prefs", "prefs"],
    ]
      .map(
        ([id, label]) =>
          `<button class="${state.tab === id ? "on" : ""}" type="button" data-tab="${id}">${ICONS[id]}${label}</button>`
      )
      .join("");
  }

  function render() {
    if (!state.plan && state.tab !== "setup") rebuild();
    renderTabs();
    if (state.overlay === "recipe" && state.recipe) {
      screen.innerHTML = renderRecipe(state.recipe);
      return;
    }
    if (state.tab === "setup") screen.innerHTML = renderSetup();
    if (state.tab === "plan") screen.innerHTML = renderPlan();
    if (state.tab === "meals") screen.innerHTML = renderMeals();
    if (state.tab === "shop") screen.innerHTML = renderShop();
    if (state.tab === "prefs") screen.innerHTML = renderPrefs();
  }

  document.body.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      readForm();
      state.tab = tab.dataset.tab;
      state.overlay = null;
      if (state.tab !== "setup" && !state.plan) rebuild();
      render();
      return;
    }
    const storeBtn = event.target.closest("[data-store]");
    if (storeBtn) {
      state.storeId = storeBtn.dataset.store;
      persist();
      render();
      return;
    }
    const mealToggle = event.target.closest("[data-meal-toggle]");
    if (mealToggle) {
      const id = mealToggle.dataset.mealToggle;
      state.meals[id] = !state.meals[id];
      persist();
      render();
      return;
    }
    const mealFilter = event.target.closest("[data-meal-filter]");
    if (mealFilter) {
      state.mealFilter = mealFilter.dataset.mealFilter;
      render();
      return;
    }
    const recipeBtn = event.target.closest("[data-recipe]");
    if (recipeBtn) {
      state.recipe = data().RECIPES.find((row) => row.id === recipeBtn.dataset.recipe);
      if (state.recipe) {
        state.overlay = "recipe";
        render();
      }
      return;
    }
    if (event.target.closest("[data-close]")) {
      state.overlay = null;
      render();
      return;
    }
    const cuisine = event.target.closest("[data-cuisine]");
    if (cuisine && state.tab === "meals") {
      const id = cuisine.dataset.cuisine;
      state.cravings.cuisines = state.cravings.cuisines[0] === id ? [] : [id];
      persist();
      render();
      return;
    }
    if (cuisine && (state.tab === "prefs" || state.tab === "setup")) {
      const id = cuisine.dataset.cuisine;
      const set = new Set(state.cravings.cuisines);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      state.cravings.cuisines = [...set];
      persist();
      render();
      return;
    }
    const people = event.target.closest("[data-people]");
    if (people) {
      state.people = Math.min(8, Math.max(1, state.people + Number(people.dataset.people)));
      persist();
      render();
      return;
    }
    const day = event.target.closest("[data-day]");
    if (day) {
      state.cookingDays[day.dataset.day] = !state.cookingDays[day.dataset.day];
      persist();
      render();
      return;
    }
    if (event.target.closest("[data-make-plan]") || event.target.closest("[data-rebuild]")) {
      makePlan({ force: true });
    }
  });

  document.body.addEventListener("change", (event) => {
    const pantry = event.target.closest("[data-pantry]");
    if (pantry) {
      if (event.target.checked) state.pantry.add(pantry.dataset.pantry);
      else state.pantry.delete(pantry.dataset.pantry);
      persist();
      return;
    }
    const check = event.target.closest("[data-check]");
    if (check) {
      if (event.target.checked) state.checked.add(check.dataset.check);
      else state.checked.delete(check.dataset.check);
      render();
    }
    if (event.target.id === "budget") {
      state.budget = Number(event.target.value) || state.budget;
      persist();
    }
  });

  render();
})();
