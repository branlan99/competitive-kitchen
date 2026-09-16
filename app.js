(() => {
  const INGREDIENTS = [
    { id: "bun", name: "Bun", icon: "🍞" },
    { id: "patty", name: "Patty", icon: "🥩" },
    { id: "cheese", name: "Cheese", icon: "🧀" },
    { id: "greens", name: "Greens", icon: "🥬" },
    { id: "tortilla", name: "Tortilla", icon: "🫓" },
    { id: "rice", name: "Rice", icon: "🍚" },
    { id: "egg", name: "Egg", icon: "🥚" },
    { id: "sauce", name: "Sauce", icon: "🫙" },
  ];

  const RECIPES = [
    { name: "Smash Burger", items: ["bun", "patty", "cheese", "greens", "bun"], value: 140 },
    { name: "Cheeseburger", items: ["bun", "patty", "cheese", "bun"], value: 110 },
    { name: "Garden Burger", items: ["bun", "greens", "sauce", "bun"], value: 100 },
    { name: "Street Taco", items: ["tortilla", "patty", "sauce", "greens"], value: 120 },
    { name: "Quesadilla", items: ["tortilla", "cheese", "tortilla"], value: 90 },
    { name: "Breakfast Taco", items: ["tortilla", "egg", "cheese", "sauce"], value: 125 },
    { name: "Rice Bowl", items: ["rice", "patty", "greens", "egg", "sauce"], value: 150 },
    { name: "Omelette Plate", items: ["egg", "cheese", "greens"], value: 95 },
    { name: "Patty Melt", items: ["bun", "patty", "cheese", "bun"], value: 110 },
    { name: "Chef Salad", items: ["greens", "egg", "cheese", "sauce"], value: 115 },
    { name: "Steak Plate", items: ["rice", "patty", "greens", "sauce"], value: 135 },
    { name: "Sunrise Bowl", items: ["rice", "egg", "greens", "sauce"], value: 130 },
  ];

  const SERVICE_MS = 90_000;
  const MAX_TICKETS = 3;
  const BEST_KEY = "ck-best-score";

  const els = {
    boot: document.getElementById("boot"),
    how: document.getElementById("how"),
    service: document.getElementById("service"),
    results: document.getElementById("results"),
    startBtn: document.getElementById("startBtn"),
    howBtn: document.getElementById("howBtn"),
    howClose: document.getElementById("howClose"),
    bestScore: document.getElementById("bestScore"),
    clock: document.getElementById("clock"),
    youScore: document.getElementById("youScore"),
    rivalScore: document.getElementById("rivalScore"),
    combo: document.getElementById("combo"),
    rail: document.getElementById("rail"),
    plate: document.getElementById("plate"),
    bins: document.getElementById("bins"),
    undoBtn: document.getElementById("undoBtn"),
    dumpBtn: document.getElementById("dumpBtn"),
    fireBtn: document.getElementById("fireBtn"),
    toast: document.getElementById("toast"),
    resultKicker: document.getElementById("resultKicker"),
    resultTitle: document.getElementById("resultTitle"),
    finalYou: document.getElementById("finalYou"),
    finalRival: document.getElementById("finalRival"),
    resultStats: document.getElementById("resultStats"),
    againBtn: document.getElementById("againBtn"),
    homeBtn: document.getElementById("homeBtn"),
  };

  const state = {
    screen: "boot",
    startedAt: 0,
    remaining: SERVICE_MS,
    you: 0,
    rival: 0,
    combo: 1,
    plated: [],
    tickets: [],
    served: 0,
    burned: 0,
    missed: 0,
    spawnIn: 0,
    rivalIn: 0,
    raf: 0,
    lastTs: 0,
    toastTimer: 0,
  };

  function ingredientById(id) {
    return INGREDIENTS.find((item) => item.id === id);
  }

  function showScreen(name) {
    state.screen = name;
    for (const screen of [els.boot, els.how, els.service, els.results]) {
      const active = screen.id === name;
      screen.classList.toggle("active", active);
      screen.hidden = !active;
    }
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function toast(message) {
    els.toast.textContent = message;
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      if (els.toast.textContent === message) els.toast.textContent = "";
    }, 1600);
  }

  function renderBest() {
    const best = Number(localStorage.getItem(BEST_KEY) || 0);
    els.bestScore.textContent = best ? `Line record · ${best}` : "No covers on the board yet.";
  }

  function renderHud() {
    els.clock.textContent = formatTime(state.remaining);
    els.youScore.textContent = String(state.you);
    els.rivalScore.textContent = String(state.rival);
    els.combo.textContent = `×${state.combo}`;
  }

  function renderPlate() {
    if (!state.plated.length) {
      els.plate.innerHTML = `<span class="plate-empty">Empty ring — start with the first ingredient</span>`;
      return;
    }
    els.plate.innerHTML = state.plated
      .map((id) => {
        const item = ingredientById(id);
        return `<span class="chip">${item.icon} ${item.name}</span>`;
      })
      .join("");
  }

  function renderRail() {
    if (!state.tickets.length) {
      els.rail.innerHTML = `<article class="ticket"><h3>Quiet pass</h3><p>Tickets incoming.</p></article>`;
      return;
    }
    els.rail.innerHTML = state.tickets
      .map((ticket) => {
        const urgent = ticket.remaining < 7000 ? " urgent" : "";
        const steps = ticket.items
          .map((id) => `<li>${ingredientById(id).icon} ${ingredientById(id).name}</li>`)
          .join("");
        return `<article class="ticket" data-id="${ticket.id}">
          <span class="ticket-time${urgent}">${Math.ceil(ticket.remaining / 1000)}s</span>
          <h3>${ticket.name}</h3>
          <ol>${steps}</ol>
        </article>`;
      })
      .join("");
  }

  function renderBins() {
    els.bins.innerHTML = INGREDIENTS.map(
      (item, index) =>
        `<button class="bin" type="button" data-id="${item.id}" aria-label="${item.name}">
          <span>${item.icon}</span>${item.name}
          <small>${index + 1}</small>
        </button>`
    ).join("");
  }

  function sameRecipe(a, b) {
    return a.length === b.length && a.every((id, i) => id === b[i]);
  }

  function spawnTicket() {
    if (state.tickets.length >= MAX_TICKETS) return;
    const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    const life = 18000 + recipe.items.length * 2200;
    state.tickets.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: recipe.name,
      items: recipe.items.slice(),
      value: recipe.value,
      remaining: life,
    });
    renderRail();
  }

  function addIngredient(id) {
    if (state.screen !== "service") return;
    state.plated.push(id);
    renderPlate();
  }

  function undo() {
    state.plated.pop();
    renderPlate();
  }

  function dump() {
    state.plated = [];
    renderPlate();
    toast("Dumped.");
  }

  function firePlate() {
    if (!state.plated.length) {
      toast("Nothing on the plate.");
      return;
    }
    const match = state.tickets.find((ticket) => sameRecipe(state.plated, ticket.items));
    if (!match) {
      state.burned += 1;
      state.combo = 1;
      state.plated = [];
      els.plate.classList.remove("shake");
      void els.plate.offsetWidth;
      els.plate.classList.add("shake");
      renderPlate();
      renderHud();
      toast("Sent back — that wasn’t on the rail.");
      return;
    }

    const timeBonus = Math.round(match.remaining / 80);
    const earned = Math.round((match.value + timeBonus) * state.combo);
    state.you += earned;
    state.served += 1;
    state.combo = Math.min(5, state.combo + 1);
    state.tickets = state.tickets.filter((ticket) => ticket.id !== match.id);
    state.plated = [];
    renderPlate();
    renderRail();
    renderHud();
    toast(`${match.name} up · +${earned}`);
  }

  function tick(ts) {
    if (!state.lastTs) state.lastTs = ts;
    const dt = Math.min(50, ts - state.lastTs);
    state.lastTs = ts;
    state.remaining -= dt;
    state.spawnIn -= dt;
    state.rivalIn -= dt;

    for (const ticket of state.tickets) ticket.remaining -= dt;
    const expired = state.tickets.filter((ticket) => ticket.remaining <= 0);
    if (expired.length) {
      state.missed += expired.length;
      state.combo = 1;
      state.tickets = state.tickets.filter((ticket) => ticket.remaining > 0);
      toast(expired.length === 1 ? `${expired[0].name} died on the pass.` : "Tickets walked.");
    }

    if (state.spawnIn <= 0) {
      spawnTicket();
      state.spawnIn = 2800 + Math.random() * 1600;
    }

    if (state.rivalIn <= 0) {
      const gain = 70 + Math.floor(Math.random() * 55) + Math.round((SERVICE_MS - state.remaining) / 1800);
      state.rival += gain;
      state.rivalIn = 5200 - Math.min(2200, (SERVICE_MS - state.remaining) / 40);
    }

    renderHud();
    renderRail();

    if (state.remaining <= 0) {
      endService();
      return;
    }
    state.raf = requestAnimationFrame(tick);
  }

  function startService() {
    cancelAnimationFrame(state.raf);
    Object.assign(state, {
      startedAt: performance.now(),
      remaining: SERVICE_MS,
      you: 0,
      rival: 0,
      combo: 1,
      plated: [],
      tickets: [],
      served: 0,
      burned: 0,
      missed: 0,
      spawnIn: 200,
      rivalIn: 4800,
      lastTs: 0,
    });
    showScreen("service");
    spawnTicket();
    spawnTicket();
    renderHud();
    renderPlate();
    renderRail();
    els.toast.textContent = "First tickets are up.";
    state.raf = requestAnimationFrame(tick);
  }

  function endService() {
    cancelAnimationFrame(state.raf);
    state.remaining = 0;
    renderHud();
    const won = state.you >= state.rival;
    const best = Number(localStorage.getItem(BEST_KEY) || 0);
    if (state.you > best) localStorage.setItem(BEST_KEY, String(state.you));
    els.resultKicker.textContent = won ? "Service complete" : "The house took it";
    els.resultTitle.textContent = won ? "Line A takes it" : "Line B wins the pass";
    els.finalYou.textContent = String(state.you);
    els.finalRival.textContent = String(state.rival);
    els.resultStats.textContent = `${state.served} fired · ${state.burned} sent back · ${state.missed} walked`;
    showScreen("results");
    renderBest();
  }

  function onKey(event) {
    if (state.screen === "boot" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      startService();
      return;
    }
    if (state.screen !== "service") return;
    if (event.key === "Enter") {
      event.preventDefault();
      firePlate();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      undo();
    } else if (event.key === "Escape") {
      event.preventDefault();
      dump();
    } else if (/^[1-8]$/.test(event.key)) {
      addIngredient(INGREDIENTS[Number(event.key) - 1].id);
    }
  }

  els.startBtn.addEventListener("click", startService);
  els.againBtn.addEventListener("click", startService);
  els.howBtn.addEventListener("click", () => showScreen("how"));
  els.howClose.addEventListener("click", () => showScreen("boot"));
  els.homeBtn.addEventListener("click", () => {
    cancelAnimationFrame(state.raf);
    showScreen("boot");
  });
  els.undoBtn.addEventListener("click", undo);
  els.dumpBtn.addEventListener("click", dump);
  els.fireBtn.addEventListener("click", firePlate);
  els.bins.addEventListener("click", (event) => {
    const btn = event.target.closest(".bin");
    if (btn) addIngredient(btn.dataset.id);
  });
  document.addEventListener("keydown", onKey);

  renderBins();
  renderBest();
})();
