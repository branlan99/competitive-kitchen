(() => {
  const { PANTRY_GROUPS, INGREDIENTS } = window.CK_DATA;
  const { planWeek, storeById } = window.CK_PLAN;

  const STEPS = [
    { id: "week", label: "Budget" },
    { id: "eat", label: "Eat" },
    { id: "pantry", label: "Pantry" },
    { id: "plan", label: "Plan" },
    { id: "shop", label: "Shop" },
  ];

  const CUISINES = [
    ["mexican", "Mexican"],
    ["italian", "Italian"],
    ["american", "American"],
    ["asian", "Asian"],
    ["mediterranean", "Mediterranean"],
    ["comfort", "Comfort"],
  ];

  const PROTEINS = [
    ["chicken", "Chicken"],
    ["beef", "Beef"],
    ["pork", "Pork"],
    ["fish", "Fish"],
    ["eggs", "Eggs"],
    ["vegetarian", "Beans / veg"],
  ];

  const state = {
    step: "week",
    budget: 70,
    people: 1,
    meals: { breakfast: true, lunch: true, dinner: true },
    cravings: { cuisines: [], proteins: [] },
    pantry: new Set(["salt"]),
    plan: null,
  };

  const views = {
    week: document.getElementById("view-week"),
    eat: document.getElementById("view-eat"),
    pantry: document.getElementById("view-pantry"),
    plan: document.getElementById("view-plan"),
    shop: document.getElementById("view-shop"),
  };

  function money(n) {
    return `$${n.toFixed(2)}`;
  }

  function toggleList(list, value) {
    const next = new Set(list);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return [...next];
  }

  function go(step) {
    state.step = step;
    if (step === "plan" || step === "shop") {
      state.plan = planWeek({
        budget: state.budget,
        people: state.people,
        meals: state.meals,
        cravings: state.cravings,
        pantry: state.pantry,
      });
    }
    render();
  }

  function renderSteps() {
    const at = STEPS.findIndex((step) => step.id === state.step);
    document.getElementById("steps").innerHTML = STEPS.map((step, index) => {
      const current = step.id === state.step ? "current" : "";
      const done = index < at ? "done" : "";
      return `<li><button class="${current} ${done}" type="button" data-step="${step.id}">${index + 1}. ${step.label}</button></li>`;
    }).join("");
  }

  function renderWeek() {
    views.week.innerHTML = `
      <p class="lede">Set the week’s ceiling. Competitive Kitchen builds meals that fit the number, then shops the cheapest store type for each item.</p>
      <div class="card">
        <label class="field">
          <span>Grocery budget for the week</span>
          <input id="budget" type="number" min="20" max="400" step="1" value="${state.budget}" />
        </label>
        <label class="field">
          <span>People eating</span>
          <input id="people" type="number" min="1" max="8" step="1" value="${state.people}" />
        </label>
        <p class="lede" style="margin:0 0 10px">Meals to cover</p>
        <div class="chips" id="mealChips">
          ${["breakfast", "lunch", "dinner"]
            .map(
              (meal) =>
                `<button class="chip ${state.meals[meal] ? "on" : ""}" type="button" data-meal="${meal}">${meal}</button>`
            )
            .join("")}
        </div>
      </div>
      <div class="actions">
        <button class="btn primary" type="button" data-next="eat">What do you want to eat?</button>
      </div>`;
  }

  function renderEat() {
    views.eat.innerHTML = `
      <p class="lede">Pick the flavors and proteins you want this week. Leave a row blank if you don’t care — the planner will fill with whatever stretches the budget.</p>
      <div class="card">
        <p>Cuisines</p>
        <div class="chips">
          ${CUISINES.map(
            ([id, label]) =>
              `<button class="chip ${state.cravings.cuisines.includes(id) ? "on" : ""}" type="button" data-cuisine="${id}">${label}</button>`
          ).join("")}
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <p>Proteins</p>
        <div class="chips">
          ${PROTEINS.map(
            ([id, label]) =>
              `<button class="chip ${state.cravings.proteins.includes(id) ? "on" : ""}" type="button" data-protein="${id}">${label}</button>`
          ).join("")}
        </div>
      </div>
      <div class="actions">
        <button class="btn" type="button" data-next="week">Back</button>
        <button class="btn primary" type="button" data-next="pantry">What’s already in the kitchen?</button>
      </div>`;
  }

  function renderPantry() {
    views.pantry.innerHTML = `
      <p class="lede">Check seasonings, oils, and staples you already have. Those come off the shopping list and free up budget for food you still need to buy.</p>
      ${PANTRY_GROUPS.map(
        (group) => `
        <div class="card" style="margin-bottom:12px">
          <p>${group.title}</p>
          <div class="check-grid">
            ${group.items
              .map((id) => {
                const item = INGREDIENTS[id];
                return `<label><input type="checkbox" data-pantry="${id}" ${state.pantry.has(id) ? "checked" : ""}/> ${item.name}</label>`;
              })
              .join("")}
          </div>
        </div>`
      ).join("")}
      <div class="actions">
        <button class="btn" type="button" data-next="eat">Back</button>
        <button class="btn primary" type="button" data-next="plan">Build this week’s plan</button>
      </div>`;
  }

  function mealLabel(slot) {
    if (!slot.recipe) return `<span class="meal"><b>Open</b>Budget used elsewhere</span>`;
    const leftover = slot.leftover ? `<span class="left">Leftover</span>` : "";
    return `<span class="meal">${leftover}<b>${slot.recipe.name}</b>${slot.meal}</span>`;
  }

  function renderPlan() {
    const plan = state.plan;
    const status = plan.withinBudget ? "ok" : "over";
    const coverage = Math.round(plan.coverage * 100);
    views.plan.innerHTML = `
      <div class="meter">
        <div><span>Plan total</span><br /><strong class="${status}">${money(plan.spent)}</strong> of ${money(plan.budget)}</div>
        <div><span>Meals covered</span><br /><strong>${coverage}%</strong></div>
        <div><span>Pantry saved</span><br /><strong>${money(plan.savedByPantry)}</strong></div>
      </div>
      <p class="lede">${
        plan.withinBudget
          ? `This week fits the ${money(plan.budget)} cap for ${plan.people} ${plan.people === 1 ? "person" : "people"}.`
          : `Couldn’t cover every meal without crossing ${money(plan.budget)}. The board shows what still fits.`
      }</p>
      <div class="week">
        ${plan.days
          .map((day) => {
            const slots = plan.slots.filter((slot) => slot.day === day.key);
            return `<article class="day"><h3>${day.name}<br /><small>${day.date}</small></h3>${slots.map(mealLabel).join("")}</article>`;
          })
          .join("")}
      </div>
      <div class="actions">
        <button class="btn" type="button" data-next="pantry">Back</button>
        <button class="btn primary" type="button" data-next="shop">Where to get the food</button>
      </div>`;
  }

  function renderShop() {
    const plan = state.plan;
    views.shop.innerHTML = `
      <p class="lede">Each ingredient is priced across four store types. The list uses the lowest typical US price, then groups a shopping trip so you are not bouncing around for a $0.40 difference. Prices are estimates, not a live ad feed — tap a store to find one near you.</p>
      ${plan.trips
        .map((trip) => {
          const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.store.mapsQuery)}`;
          return `<div class="card trip">
            <h3>${trip.store.name}</h3>
            <p class="lede">${trip.store.kind}. ${trip.store.blurb}</p>
            <p><a href="${maps}" target="_blank" rel="noopener">Find ${trip.store.mapsQuery} near me</a> · ${money(trip.total)}</p>
            ${trip.items
              .map((line) => {
                const others = line.alts
                  .filter((alt) => alt.storeId !== line.storeId)
                  .sort((a, b) => a.unitPrice - b.unitPrice)
                  .slice(0, 2)
                  .map((alt) => `${storeById(alt.storeId).name} ${money(alt.packCost)}/pack`)
                  .join(" · ");
                return `<div class="shop-line"><div>${line.name}<br /><small>${line.packs} pack${line.packs === 1 ? "" : "s"} · ${line.category}${line.consolidated ? " · kept on this trip" : ""}</small></div><small>${others}</small><strong>${money(line.cost)}</strong></div>`;
              })
              .join("")}
          </div>`;
        })
        .join("")}
      <div class="card">
        <p>Grand total <strong>${money(plan.spent)}</strong> ${plan.withinBudget ? "within budget" : "over budget"}</p>
      </div>
      <div class="actions">
        <button class="btn" type="button" data-next="plan">Back to the week</button>
        <button class="btn" type="button" data-next="week">Start over</button>
      </div>`;
  }

  function render() {
    renderSteps();
    Object.entries(views).forEach(([id, el]) => {
      el.hidden = id !== state.step;
    });
    if (state.step === "week") renderWeek();
    if (state.step === "eat") renderEat();
    if (state.step === "pantry") renderPantry();
    if (state.step === "plan") renderPlan();
    if (state.step === "shop") renderShop();
  }

  document.getElementById("app").addEventListener("click", (event) => {
    const stepBtn = event.target.closest("[data-step]");
    if (stepBtn) {
      const budget = document.getElementById("budget");
      const people = document.getElementById("people");
      if (budget) state.budget = Number(budget.value);
      if (people) state.people = Number(people.value);
      go(stepBtn.dataset.step);
      return;
    }
    const next = event.target.closest("[data-next]");
    if (next) {
      if (state.step === "week") {
        state.budget = Number(document.getElementById("budget").value);
        state.people = Number(document.getElementById("people").value);
      }
      go(next.dataset.next);
      return;
    }
    const meal = event.target.closest("[data-meal]");
    if (meal) {
      const key = meal.dataset.meal;
      const onCount = Object.values(state.meals).filter(Boolean).length;
      if (state.meals[key] && onCount === 1) return;
      state.meals[key] = !state.meals[key];
      renderWeek();
      return;
    }
    const cuisine = event.target.closest("[data-cuisine]");
    if (cuisine) {
      state.cravings.cuisines = toggleList(state.cravings.cuisines, cuisine.dataset.cuisine);
      renderEat();
      return;
    }
    const protein = event.target.closest("[data-protein]");
    if (protein) {
      state.cravings.proteins = toggleList(state.cravings.proteins, protein.dataset.protein);
      renderEat();
    }
  });

  document.getElementById("app").addEventListener("change", (event) => {
    const pantry = event.target.closest("[data-pantry]");
    if (!pantry) return;
    if (event.target.checked) state.pantry.add(pantry.dataset.pantry);
    else state.pantry.delete(pantry.dataset.pantry);
  });

  render();
})();
