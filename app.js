(() => {
  const { PANTRY_GROUPS, INGREDIENTS, RECIPES, STORES } = window.CK_DATA;
  const { planWeek, storeById } = window.CK_PLAN;

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
    eggs: "🥚", milk: "🥛", yogurt: "🥛", cheddar: "🧀", butter: "🧈",
    chickenThigh: "🍗", chickenBreast: "🍗", groundBeef: "🥩", groundTurkey: "🦃", sausage: "🌭", tuna: "🐟",
    onion: "🧅", garlic: "🧄", carrot: "🥕", celery: "🥬", broccoli: "🥦", spinach: "🥬",
    pepper: "🫑", tomato: "🍅", potato: "🥔", cabbage: "🥬", banana: "🍌", apple: "🍎", lemon: "🍋",
    cannedTomato: "🥫", frozenVeg: "🧊", blackBeans: "🫘", lentils: "🫘", chickpeas: "🫘",
    peanutButter: "🥜", salsa: "🫙", broth: "🥣", oliveOil: "🫒", vegOil: "🛢️", sesameOil: "🫙",
    soy: "🫙", vinegar: "🫙", hotSauce: "🌶️", ketchup: "🍅", salt: "🧂", blackPepper: "🧂",
  };

  const ICONS = {
    plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    meals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16M7 20V9m5 11V4m5 16v-7"/><path d="M4 9h6"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 7 5 4H2"/></svg>',
    prefs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.5-1 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1-1.5 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H8a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V8c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  };

  const saved = JSON.parse(localStorage.getItem("ck-prefs") || "null") || {};

  const state = {
    tab: "plan",
    overlay: null,
    recipe: null,
    budget: saved.budget || 70,
    people: saved.people || 2,
    storeId: saved.storeId || "bargain",
    meals: saved.meals || { breakfast: false, lunch: false, dinner: true },
    cookingDays: saved.cookingDays || { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    cravings: saved.cravings || { cuisines: [], proteins: [] },
    pantry: new Set(saved.pantry || ["salt", "oliveOil", "vegOil"]),
    checked: new Set(),
    plan: null,
  };

  const screen = document.getElementById("screen");
  const tabs = document.getElementById("tabs");

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
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
      })
    );
  }

  function rebuild() {
    const daysOn = Object.values(state.cookingDays).some(Boolean);
    if (!daysOn) state.cookingDays.Mon = true;
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

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function dayCards() {
    const plan = state.plan;
    return plan.days
      .filter((day) => state.cookingDays[day.key])
      .map((day) => {
        const slots = plan.slots.filter((slot) => slot.day === day.key && slot.recipe && !slot.leftover);
        const main = slots.find((slot) => slot.meal === "dinner") || slots[0];
        if (!main) {
          return `<p class="day-label">${day.label}</p><div class="white-card" style="padding:14px;color:#888">Nothing planned — budget used up.</div>`;
        }
        const recipe = main.recipe;
        const leftover = plan.slots.find((slot) => slot.day === day.key && slot.leftover);
        return `
          <p class="day-label">${day.label}</p>
          <button class="meal-card" type="button" data-recipe="${recipe.id}">
            <img alt="" src="${recipe.image || ""}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=70'" />
            <div>
              <h3>${recipe.name}</h3>
              <span class="tag">${recipe.tag || "Weeknight"}</span>
              <div class="meta">${recipe.minutes}m · ${state.people} ${state.people === 1 ? "serving" : "servings"} · ${money(plan.mealPrice(recipe))}${leftover ? " · leftover lunch" : ""}</div>
            </div>
          </button>`;
      })
      .join("");
  }

  function renderPlan() {
    const plan = state.plan;
    const store = storeById(plan.storeId);
    const bought = plan.lines.filter((line) => state.checked.has(line.id)).length;
    return `
      <p class="hello">${greeting()}</p>
      <h1>Chef!</h1>
      <div class="store-pill">planned for ${store.name}</div>
      <div class="stats">
        <div class="stat"><span>Est. cost</span><b>${money(plan.spent)}</b><small> / ${money(plan.budget)}</small></div>
        <button class="stat" type="button" data-tab="shop" style="cursor:pointer;border:0;text-align:left">
          <span>Grocery list</span><b>${bought}/${plan.lines.length}</b><small> items bought</small>
        </button>
      </div>
      ${dayCards()}`;
  }

  function renderMeals() {
    const filter = state.cravings.cuisines[0];
    const list = RECIPES.filter((recipe) => !filter || recipe.cuisines.includes(filter));
    return `
      <h1 class="section-title">explore by cuisine</h1>
      <div class="cuisine-grid">
        ${CUISINES.map(
          ([id, name, blurb, img]) => `
          <button class="cuisine-card" type="button" data-cuisine="${id}">
            <img alt="" src="${img}" />
            <div><strong>${name}</strong><small>${blurb}</small></div>
          </button>`
        ).join("")}
      </div>
      <p class="day-label" style="margin-top:22px">${filter ? CUISINES.find((row) => row[0] === filter)[1] : "All recipes"}</p>
      ${list
        .map(
          (recipe) => `
        <button class="meal-card" type="button" data-recipe="${recipe.id}">
          <img alt="" src="${recipe.image || ""}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=70'" />
          <div>
            <h3>${recipe.name}</h3>
            <span class="tag">${recipe.tag || "Weeknight"}</span>
            <div class="meta">${recipe.minutes}m · ${recipe.kcal || "—"} kcal</div>
          </div>
        </button>`
        )
        .join("")}`;
  }

  function renderPrefs() {
    return `
      <h1 class="section-title">your plan preferences</h1>
      <div class="field"><span>Supermarket</span>
        <select id="store">
          ${STORES.map((store) => `<option value="${store.id}" ${store.id === state.storeId ? "selected" : ""}>${store.name}</option>`).join("")}
        </select>
      </div>
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
              .map((id) => `<label><input type="checkbox" data-pantry="${id}" ${state.pantry.has(id) ? "checked" : ""}/> ${INGREDIENTS[id].name}</label>`)
              .join("")}
          </div>`
        ).join("")}
      </div>
      <button class="btn" type="button" data-rebuild>Rebuild this week</button>`;
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
    return `
      <div class="sheet">
        <button class="back" type="button" data-close>←</button>
        <img class="cover-lg" alt="" src="${recipe.image || ""}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70'" />
        <div class="sheet-body">
          <h1>${recipe.name}</h1>
          <span class="tag">${recipe.tag || "Weeknight"}</span>
          <div class="macros">
            <div><b>${recipe.kcal || "—"}</b><span>kcal</span></div>
            <div><b>${recipe.protein || "—"}g</b><span>Protein</span></div>
            <div><b>${recipe.carbs || "—"}g</b><span>Carbs</span></div>
            <div><b>${recipe.fat || "—"}g</b><span>Fats</span></div>
          </div>
          <p class="meta">Cook time: ${recipe.minutes}m · Serves ${recipe.yield} · ${money(price)} / serving</p>
          <p class="cat">Ingredients</p>
          ${recipe.ingredients
            .map((row) => {
              const item = INGREDIENTS[row.id];
              const have = state.pantry.has(row.id);
              return `<div class="shop-item"><span>${EMOJI[row.id] || ""} ${item.name}</span><span>${row.qty} ${item.unit}${have ? " · in pantry" : ""}</span></div>`;
            })
            .join("")}
        </div>
      </div>`;
  }

  function renderTabs() {
    tabs.hidden = Boolean(state.overlay);
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
    if (!state.plan) rebuild();
    renderTabs();
    if (state.overlay === "recipe" && state.recipe) {
      screen.innerHTML = renderRecipe(state.recipe);
      return;
    }
    if (state.tab === "plan") screen.innerHTML = renderPlan();
    if (state.tab === "meals") screen.innerHTML = renderMeals();
    if (state.tab === "shop") screen.innerHTML = renderShop();
    if (state.tab === "prefs") screen.innerHTML = renderPrefs();
  }

  document.body.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      state.tab = tab.dataset.tab;
      state.overlay = null;
      render();
      return;
    }
    const recipeBtn = event.target.closest("[data-recipe]");
    if (recipeBtn) {
      state.recipe = RECIPES.find((row) => row.id === recipeBtn.dataset.recipe);
      state.overlay = "recipe";
      render();
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
    if (cuisine && state.tab === "prefs") {
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
    if (event.target.closest("[data-rebuild]")) {
      const budget = document.getElementById("budget");
      const store = document.getElementById("store");
      if (budget) state.budget = Number(budget.value);
      if (store) state.storeId = store.value;
      rebuild();
      state.tab = "plan";
      render();
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
  });

  render();
})();
