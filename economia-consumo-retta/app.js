const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

const incomeSlider = document.getElementById("incomeSlider");
const autonomousSlider = document.getElementById("autonomousSlider");
const propensitySlider = document.getElementById("propensitySlider");
const deltaSlider = document.getElementById("deltaSlider");
const incomeValue = document.getElementById("incomeValue");
const autonomousValue = document.getElementById("autonomousValue");
const propensityValue = document.getElementById("propensityValue");
const deltaValue = document.getElementById("deltaValue");
const consumptionValue = document.getElementById("consumptionValue");
const savingValue = document.getElementById("savingValue");
const statusValue = document.getElementById("statusValue");
const deltaConsumptionValue = document.getElementById("deltaConsumptionValue");
const statusMessage = document.getElementById("statusMessage");
const barIncome = document.getElementById("barIncome");
const barConsumption = document.getElementById("barConsumption");
const barExtra = document.getElementById("barExtra");
const barExtraLabel = document.getElementById("barExtraLabel");
const calculationConsumption = document.getElementById("calculationConsumption");
const calculationSaving = document.getElementById("calculationSaving");
const calculationDelta = document.getElementById("calculationDelta");
const resetBtn = document.getElementById("resetBtn");
const storyBox = document.getElementById("storyBox");

const maxIncome = 6000;
let state = {
  income: 2500,
  autonomous: 650,
  propensity: 0.65,
  delta: 100,
};

let dragging = null;

const scenarios = {
  worker: {
    income: 1000,
    autonomous: 150,
    propensity: 0.82,
    title: "Operaio: reddito più basso, c più alta",
    text: "Con molti bisogni ancora da soddisfare, un aumento di reddito viene spesso consumato quasi tutto. La retta è più inclinata: m, cioè c, è alto.",
  },
  teacher: {
    income: 5000,
    autonomous: 650,
    propensity: 0.35,
    title: "Professore: reddito più alto, c più bassa",
    text: "Con bisogni fondamentali già coperti, una quota maggiore dell'aumento può essere risparmiata. La retta è meno inclinata: m, cioè c, è più basso.",
  },
  debt: {
    income: 700,
    autonomous: 1100,
    propensity: 0.7,
    title: "Debito: quando C supera Y",
    text: "Se il consumo è superiore al reddito, S = Y - C diventa negativo. La famiglia può usare prestiti, rate o risparmi precedenti.",
  },
};

function euro(value) {
  return `${Math.round(value).toLocaleString("it-IT")} €`;
}

function decimal(value) {
  return value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getMaxConsumption() {
  const lineEnd = state.autonomous + state.propensity * maxIncome;
  return Math.ceil(Math.max(6000, lineEnd, state.income, consumptionAt(state.income)) / 1000) * 1000;
}

function consumptionAt(income) {
  return state.autonomous + state.propensity * income;
}

function syncControls() {
  incomeSlider.value = state.income;
  autonomousSlider.value = state.autonomous;
  propensitySlider.value = Math.round(state.propensity * 100);
  deltaSlider.value = state.delta;

  const consumption = consumptionAt(state.income);
  const saving = state.income - consumption;
  const deltaConsumption = state.propensity * state.delta;
  const deltaSaving = state.delta - deltaConsumption;
  const maxBar = Math.max(state.income, consumption, Math.abs(saving), 1);

  incomeValue.textContent = euro(state.income);
  autonomousValue.textContent = euro(state.autonomous);
  propensityValue.textContent = decimal(state.propensity);
  deltaValue.textContent = euro(state.delta);
  consumptionValue.textContent = euro(consumption);
  savingValue.textContent = euro(saving);
  deltaConsumptionValue.textContent = euro(deltaConsumption);

  statusMessage.className = "status-message";
  if (saving > 0) {
    statusValue.textContent = "Risparmio";
    statusValue.style.color = "#148a62";
    statusMessage.textContent = "La famiglia risparmia perché il reddito è maggiore del consumo: Y > C.";
    barExtraLabel.textContent = "Risparmio S";
    barExtra.className = "bar-fill bar-saving";
  } else if (saving < 0) {
    statusValue.textContent = "Debito";
    statusValue.style.color = "#c33d3d";
    statusMessage.classList.add("debt");
    statusMessage.textContent = "La famiglia è in debito perché il consumo è maggiore del reddito: C > Y.";
    barExtraLabel.textContent = "Debito";
    barExtra.className = "bar-fill bar-debt";
  } else {
    statusValue.textContent = "Pareggio";
    statusValue.style.color = "#b27712";
    statusMessage.classList.add("balance");
    statusMessage.textContent = "La famiglia è in pareggio: consuma esattamente tutto il reddito, quindi C = Y.";
    barExtraLabel.textContent = "Saldo";
    barExtra.className = "bar-fill bar-saving";
  }

  barIncome.style.width = `${(state.income / maxBar) * 100}%`;
  barConsumption.style.width = `${(consumption / maxBar) * 100}%`;
  barExtra.style.width = `${(Math.abs(saving) / maxBar) * 100}%`;

  calculationConsumption.textContent = `C = ${Math.round(state.autonomous)} + ${decimal(state.propensity)} × ${Math.round(state.income)} = ${Math.round(consumption)}`;
  calculationSaving.textContent = `S = Y - C = ${Math.round(state.income)} - ${Math.round(consumption)} = ${Math.round(saving)}`;
  calculationDelta.textContent = `ΔC = c × ΔY = ${decimal(state.propensity)} × ${Math.round(state.delta)} = ${Math.round(deltaConsumption)}; resto non consumato = ${Math.round(deltaSaving)}`;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.max(700, Math.round(rect.width * scale));
  canvas.height = Math.max(420, Math.round(rect.height * scale));
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  draw();
}

function metrics() {
  const rect = canvas.getBoundingClientRect();
  const pad = rect.width < 620 ? 48 : 64;
  return {
    width: rect.width,
    height: rect.height,
    left: pad,
    right: rect.width - 24,
    top: 24,
    bottom: rect.height - pad,
  };
}

function toX(income) {
  const m = metrics();
  return m.left + (income / maxIncome) * (m.right - m.left);
}

function toY(consumption) {
  const m = metrics();
  return m.bottom - (consumption / getMaxConsumption()) * (m.bottom - m.top);
}

function fromX(x) {
  const m = metrics();
  return Math.max(0, Math.min(maxIncome, ((x - m.left) / (m.right - m.left)) * maxIncome));
}

function fromY(y) {
  const m = metrics();
  const maxConsumption = getMaxConsumption();
  return Math.max(0, Math.min(maxConsumption, ((m.bottom - y) / (m.bottom - m.top)) * maxConsumption));
}

function linePointForCanvasEnd() {
  const yAtMax = consumptionAt(maxIncome);
  const maxConsumption = getMaxConsumption();
  if (yAtMax <= maxConsumption) return { income: maxIncome, consumption: yAtMax };
  const income = (maxConsumption - state.autonomous) / state.propensity;
  return { income: Math.max(0, income), consumption: maxConsumption };
}

function drawGrid() {
  const m = metrics();
  ctx.clearRect(0, 0, m.width, m.height);
  ctx.fillStyle = "#fbfdff";
  ctx.fillRect(0, 0, m.width, m.height);

  ctx.strokeStyle = "#e2eaf1";
  ctx.lineWidth = 1;
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#617080";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const maxConsumption = getMaxConsumption();
  const ySteps = Math.round(maxConsumption / 1000);
  for (let i = 0; i <= ySteps; i += 1) {
    const value = i * 1000;
    const x = toX(value);
    ctx.beginPath();
    ctx.moveTo(x, m.top);
    ctx.lineTo(x, m.bottom);
    ctx.stroke();
    ctx.fillText(String(value), x, m.bottom + 10);
  }

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 6; i += 1) {
    const value = i * 1000;
    const y = toY(value);
    ctx.beginPath();
    ctx.moveTo(m.left, y);
    ctx.lineTo(m.right, y);
    ctx.stroke();
    ctx.fillText(String(value), m.left - 9, y);
  }

  ctx.strokeStyle = "#16202a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(m.left, m.top);
  ctx.lineTo(m.left, m.bottom);
  ctx.lineTo(m.right, m.bottom);
  ctx.stroke();

  ctx.fillStyle = "#16202a";
  ctx.font = "700 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("Y reddito", m.right, m.bottom + 30);
  ctx.save();
  ctx.translate(16, m.top);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "right";
  ctx.fillText("C consumo", 0, 0);
  ctx.restore();
}

function drawLine() {
  const start = { income: 0, consumption: state.autonomous };
  const end = linePointForCanvasEnd();
  const sx = toX(start.income);
  const sy = toY(start.consumption);
  const ex = toX(end.income);
  const ey = toY(end.consumption);

  ctx.strokeStyle = "#2468d8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  ctx.fillStyle = "#2468d8";
  ctx.font = "800 15px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(`C = ${Math.round(state.autonomous)} + ${decimal(state.propensity)}Y`, sx + 14, Math.max(24, sy - 12));

  drawPoint(sx, sy, "#b27712", "q = c₀");
}

function drawSavingGuide() {
  const income = state.income;
  const consumption = consumptionAt(income);
  const x = toX(income);
  const yC = toY(consumption);
  const yY = toY(income);
  const base = toY(0);
  const saving = income - consumption;
  const color = saving >= 0 ? "#148a62" : "#c33d3d";

  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = "#7b8794";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.lineTo(x, Math.min(yC, yY));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x + 12, yC);
  ctx.lineTo(x + 12, yY);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(saving >= 0 ? "S = Y - C" : "Debito", x + 20, (yC + yY) / 2);

  drawPoint(x, yC, "#2468d8", "P(Y, C)");
  drawPoint(x, yY, color, "Y");
}

function drawIdentityLine() {
  const end = { income: maxIncome, consumption: maxIncome };
  ctx.strokeStyle = "#9eabb8";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(0));
  ctx.lineTo(toX(end.income), toY(end.consumption));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#617080";
  ctx.font = "700 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("C = Y", toX(5600), toY(5600) - 10);
}

function drawPoint(x, y, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#16202a";
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(label, x + 11, y - 8);
}

function draw() {
  drawGrid();
  drawIdentityLine();
  drawLine();
  drawSavingGuide();
}

function updateFromControls() {
  state.income = Number(incomeSlider.value);
  state.autonomous = Number(autonomousSlider.value);
  state.propensity = Number(propensitySlider.value) / 100;
  state.delta = Number(deltaSlider.value);
  syncControls();
  draw();
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function nearestHandle(pos) {
  const incomePoint = { x: toX(state.income), y: toY(consumptionAt(state.income)) };
  const interceptPoint = { x: toX(0), y: toY(state.autonomous) };
  const distanceIncome = Math.hypot(pos.x - incomePoint.x, pos.y - incomePoint.y);
  const distanceIntercept = Math.hypot(pos.x - interceptPoint.x, pos.y - interceptPoint.y);
  if (distanceIncome < 22) return "income";
  if (distanceIntercept < 22) return "intercept";
  return null;
}

function applyDrag(pos) {
  if (dragging === "income") {
    state.income = Math.round(fromX(pos.x) / 50) * 50;
  }

  if (dragging === "intercept") {
    state.autonomous = Math.round(fromY(pos.y) / 50) * 50;
  }

  syncControls();
  draw();
}

function setScenario(name) {
  const selected = scenarios[name];
  state = {
    income: selected.income,
    autonomous: selected.autonomous,
    propensity: selected.propensity,
    delta: state.delta,
  };

  document.querySelectorAll(".scenario").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === name);
  });

  storyBox.innerHTML = `<h3>${selected.title}</h3><p>${selected.text}</p>`;
  syncControls();
  draw();
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(`${button.dataset.tab}Panel`).classList.add("active");
  });
});

document.querySelectorAll(".scenario").forEach((button) => {
  button.addEventListener("click", () => setScenario(button.dataset.scenario));
});

[incomeSlider, autonomousSlider, propensitySlider, deltaSlider].forEach((slider) => {
  slider.addEventListener("input", updateFromControls);
});

resetBtn.addEventListener("click", () => {
  state = { income: 2500, autonomous: 650, propensity: 0.65, delta: 100 };
  syncControls();
  draw();
});

canvas.addEventListener("pointerdown", (event) => {
  const pos = pointerPosition(event);
  dragging = nearestHandle(pos) || "income";
  canvas.setPointerCapture(event.pointerId);
  applyDrag(pos);
});

canvas.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  applyDrag(pointerPosition(event));
});

canvas.addEventListener("pointerup", () => {
  dragging = null;
});

canvas.addEventListener("pointerleave", () => {
  dragging = null;
});

window.addEventListener("resize", resizeCanvas);

setScenario("worker");
resizeCanvas();
