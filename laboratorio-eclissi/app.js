"use strict";

// Valori fisici usati per le soglie angolari delle eclissi.
const PHYSICS = {
    sunRadiusKm: 696340,
    earthRadiusKm: 6371,
    moonRadiusKm: 1737.4,
    earthSunDistanceKm: 149597870
};

const DEFAULT_STATE = {
    phase: 42,
    inclination: 5.1,
    nodeAngle: 20,
    distanceKm: 384400,
    speed: 12,
    playing: false,
    showShadows: true,
    showLabels: true
};

const state = { ...DEFAULT_STATE };

const spaceCanvas = document.getElementById("space-canvas");
const profileCanvas = document.getElementById("profile-canvas");
const spaceContext = spaceCanvas.getContext("2d");
const profileContext = profileCanvas.getContext("2d");
const playButton = document.getElementById("play-button");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackSymbol = document.getElementById("feedback-symbol");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackText = document.getElementById("feedback-text");

const controls = {
    phase: document.getElementById("phase-slider"),
    inclination: document.getElementById("inclination-slider"),
    nodeAngle: document.getElementById("node-slider"),
    distanceKm: document.getElementById("distance-slider"),
    speed: document.getElementById("speed-slider"),
    showShadows: document.getElementById("shadow-toggle"),
    showLabels: document.getElementById("label-toggle")
};

const outputs = {
    phase: document.getElementById("phase-output"),
    inclination: document.getElementById("inclination-output"),
    nodeAngle: document.getElementById("node-output"),
    distanceKm: document.getElementById("distance-output"),
    speed: document.getElementById("speed-output"),
    phaseName: document.getElementById("phase-name"),
    livePhase: document.getElementById("live-phase"),
    liveLatitude: document.getElementById("live-latitude"),
    liveNodeDistance: document.getElementById("live-node-distance"),
    liveMoonSize: document.getElementById("live-moon-size")
};

const stars = Array.from({ length: 74 }, (_, index) => ({
    x: ((index * 83 + 37) % 997) / 997,
    y: ((index * 47 + 19) % 541) / 541,
    radius: index % 9 === 0 ? 1.35 : 0.75
}));

let lastFrameTime = performance.now();

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

function normalizeDegrees(value) {
    return ((value % 360) + 360) % 360;
}

function angularDistance(a, b) {
    const difference = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
    return Math.min(difference, 360 - difference);
}

function formatNumber(value, digits = 1) {
    return new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }).format(value);
}

function phaseName(phase) {
    const value = normalizeDegrees(phase);
    if (value < 12 || value >= 348) return "Luna nuova";
    if (value < 78) return "Falce crescente";
    if (value < 102) return "Primo quarto";
    if (value < 168) return "Gibbosa crescente";
    if (value < 192) return "Luna piena";
    if (value < 258) return "Gibbosa calante";
    if (value < 282) return "Ultimo quarto";
    return "Falce calante";
}

// Il parametro phase vale 0 alla Luna nuova e 180 alla Luna piena.
function calculateGeometry() {
    const lunarLongitude = normalizeDegrees(180 - state.phase);
    const orbitalArgument = normalizeDegrees(lunarLongitude - state.nodeAngle);
    const inclinationRad = toRadians(state.inclination);
    const latitudeRad = Math.asin(
        Math.sin(inclinationRad) * Math.sin(toRadians(orbitalArgument))
    );
    const latitudeDeg = toDegrees(latitudeRad);
    const nodeDistance = Math.min(
        angularDistance(lunarLongitude, state.nodeAngle),
        angularDistance(lunarLongitude, state.nodeAngle + 180)
    );

    const sunAngularRadius = toDegrees(Math.atan(
        PHYSICS.sunRadiusKm / PHYSICS.earthSunDistanceKm
    ));
    const moonAngularRadius = toDegrees(Math.atan(
        PHYSICS.moonRadiusKm / state.distanceKm
    ));
    const solarLongitudeDistance = angularDistance(state.phase, 0);
    const lunarLongitudeDistance = angularDistance(state.phase, 180);
    const solarSeparation = Math.hypot(solarLongitudeDistance, latitudeDeg);
    const lunarSeparation = Math.hypot(lunarLongitudeDistance, latitudeDeg);
    const solarLimit = sunAngularRadius + moonAngularRadius;

    // Raggio dell'ombra terrestre alla distanza della Luna.
    const umbraRadiusAtMoon = PHYSICS.earthRadiusKm - state.distanceKm * (
        (PHYSICS.sunRadiusKm - PHYSICS.earthRadiusKm) / PHYSICS.earthSunDistanceKm
    );
    const lunarLimit = toDegrees(Math.atan(
        (Math.max(0, umbraRadiusAtMoon) + PHYSICS.moonRadiusKm) / state.distanceKm
    ));
    const lunarTotalLimit = toDegrees(Math.atan(
        Math.max(0, umbraRadiusAtMoon - PHYSICS.moonRadiusKm) / state.distanceKm
    ));

    return {
        lunarLongitude,
        orbitalArgument,
        latitudeDeg,
        nodeDistance,
        sunAngularRadius,
        moonAngularRadius,
        solarSeparation,
        lunarSeparation,
        solarLimit,
        lunarLimit,
        lunarTotalLimit,
        solarEclipse: solarSeparation <= solarLimit,
        lunarEclipse: lunarSeparation <= lunarLimit
    };
}

function eclipseFeedback(geometry) {
    if (geometry.solarEclipse) {
        const centralLimit = Math.abs(geometry.moonAngularRadius - geometry.sunAngularRadius);
        let type = "parziale";
        if (geometry.solarSeparation <= centralLimit) {
            type = geometry.moonAngularRadius >= geometry.sunAngularRadius ? "totale" : "anulare";
        }
        return {
            level: "eclipse",
            symbol: "S",
            title: `Condizioni per un'eclissi solare ${type} raggiunte`,
            text: "La Luna e tra Sole e Terra e attraversa la linea dei nodi: la sua ombra puo raggiungere la superficie terrestre."
        };
    }

    if (geometry.lunarEclipse) {
        const type = geometry.lunarSeparation <= geometry.lunarTotalLimit ? "totale" : "parziale";
        return {
            level: "eclipse",
            symbol: "L",
            title: `Condizioni per un'eclissi lunare ${type} raggiunte`,
            text: "La Terra e tra Sole e Luna e la Luna attraversa il cono d'ombra terrestre vicino a un nodo."
        };
    }

    const closeToNew = angularDistance(state.phase, 0) < 8;
    const closeToFull = angularDistance(state.phase, 180) < 8;
    const closeToNode = geometry.nodeDistance < 6;

    if (closeToNew || closeToFull) {
        return {
            level: "near",
            symbol: "!",
            title: "Allineamento incompleto",
            text: `La fase e adatta, ma la Luna si trova a ${formatNumber(Math.abs(geometry.latitudeDeg), 2)} gradi dal piano dell'eclittica. Avvicinala a un nodo.`
        };
    }

    if (closeToNode) {
        return {
            level: "near",
            symbol: "!",
            title: "Luna vicina a un nodo",
            text: "Il passaggio sul piano eclittico e favorevole, ma serve una Luna nuova per l'eclissi solare o una Luna piena per quella lunare."
        };
    }

    return {
        level: "normal",
        symbol: "i",
        title: "Configurazione senza eclissi",
        text: "La Luna non e contemporaneamente allineata con Sole e Terra e vicina a uno dei nodi orbitali."
    };
}

function resizeCanvas(canvas, context) {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(bounds.width * ratio));
    const height = Math.max(1, Math.round(bounds.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width: bounds.width, height: bounds.height };
}

function drawStars(context, width, height, density = 1) {
    context.fillStyle = "#071521";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(225, 238, 247, 0.72)";
    stars.slice(0, Math.round(stars.length * density)).forEach(star => {
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
        context.fill();
    });
}

function drawLabel(context, text, x, y, width, align = "center") {
    if (!state.showLabels) return;
    context.save();
    context.font = "700 12px system-ui, sans-serif";
    const textWidth = context.measureText(text).width;
    const paddingX = 7;
    const boxWidth = textWidth + paddingX * 2;
    let boxX = x - boxWidth / 2;
    if (align === "left") boxX = x;
    if (align === "right") boxX = x - boxWidth;
    boxX = Math.max(6, Math.min(width - boxWidth - 6, boxX));
    context.fillStyle = "rgba(4, 15, 24, 0.88)";
    context.fillRect(boxX, y - 14, boxWidth, 22);
    context.fillStyle = "#f5f8fa";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, boxX + boxWidth / 2, y - 3);
    context.restore();
}

function drawBody(context, x, y, radius, fill, outline) {
    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = outline;
    context.stroke();
    context.restore();
}

function drawSpaceView(geometry) {
    const { width, height } = resizeCanvas(spaceCanvas, spaceContext);
    const context = spaceContext;
    const compact = width < 520;
    drawStars(context, width, height);

    const sun = { x: width * (compact ? 0.16 : 0.13), y: height * 0.5, r: Math.max(26, width * 0.045) };
    const earth = { x: width * (compact ? 0.72 : 0.68), y: height * 0.5, r: Math.max(14, width * 0.022) };
    const orbitRadius = Math.min(width * (compact ? 0.18 : 0.205), height * 0.34);
    const longitudeRad = toRadians(geometry.lunarLongitude);
    const moon = {
        x: earth.x + Math.cos(longitudeRad) * orbitRadius,
        y: earth.y - Math.sin(longitudeRad) * orbitRadius,
        r: Math.max(7, width * 0.009)
    };

    // Raggi solari paralleli nella scala compressa del disegno.
    context.save();
    context.strokeStyle = "rgba(246, 195, 68, 0.2)";
    context.lineWidth = 1;
    for (let offset = -2; offset <= 2; offset += 1) {
        const y = sun.y + offset * height * 0.12;
        context.beginPath();
        context.moveTo(sun.x + sun.r, y);
        context.lineTo(width - 18, y);
        context.stroke();
    }
    context.restore();

    if (state.showShadows) {
        context.save();
        context.fillStyle = "rgba(94, 70, 148, 0.28)";
        context.beginPath();
        context.moveTo(earth.x, earth.y - earth.r * 0.8);
        context.lineTo(width, earth.y - earth.r * 0.17);
        context.lineTo(width, earth.y + earth.r * 0.17);
        context.lineTo(earth.x, earth.y + earth.r * 0.8);
        context.closePath();
        context.fill();

        const vectorX = moon.x - sun.x;
        const vectorY = moon.y - sun.y;
        const length = Math.hypot(vectorX, vectorY) || 1;
        const directionX = vectorX / length;
        const directionY = vectorY / length;
        const normalX = -directionY;
        const normalY = directionX;
        const shadowLength = Math.min(width * 0.23, 190);
        context.fillStyle = "rgba(8, 13, 22, 0.7)";
        context.beginPath();
        context.moveTo(moon.x + normalX * moon.r, moon.y + normalY * moon.r);
        context.lineTo(moon.x + directionX * shadowLength, moon.y + directionY * shadowLength);
        context.lineTo(moon.x - normalX * moon.r, moon.y - normalY * moon.r);
        context.closePath();
        context.fill();
        context.restore();
    }

    context.save();
    context.setLineDash([6, 5]);
    context.strokeStyle = "rgba(159, 191, 209, 0.55)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(earth.x, earth.y, orbitRadius, 0, Math.PI * 2);
    context.stroke();
    context.restore();

    drawBody(context, sun.x, sun.y, sun.r, "#f6c344", "#ffe99d");
    drawBody(context, earth.x, earth.y, earth.r, "#2b8cc4", "#8dd6ef");
    context.save();
    context.beginPath();
    context.arc(earth.x - earth.r * 0.22, earth.y + earth.r * 0.12, earth.r * 0.58, 0, Math.PI * 2);
    context.fillStyle = "#3ca66a";
    context.fill();
    context.restore();
    drawBody(context, moon.x, moon.y, moon.r, "#d6dde2", "#ffffff");

    const latitudeText = `${geometry.latitudeDeg >= 0 ? "+" : ""}${formatNumber(geometry.latitudeDeg, 2)} gradi`;
    drawLabel(context, "Sole", sun.x, sun.y - sun.r - 12, width);
    drawLabel(context, "Terra", earth.x, earth.y - earth.r - 12, width);
    const moonLabel = compact ? `Luna ${latitudeText}` : `Luna | lat. ${latitudeText}`;
    drawLabel(context, moonLabel, moon.x, moon.y - moon.r - 12, width);

    context.save();
    context.fillStyle = "rgba(234, 242, 247, 0.82)";
    context.font = "600 11px system-ui, sans-serif";
    context.textAlign = "left";
    context.fillText(compact ? "Scala compressa" : "Distanze e diametri compressi per la visualizzazione", 12, height - 12);
    context.restore();
}

function drawProfileView(geometry) {
    const { width, height } = resizeCanvas(profileCanvas, profileContext);
    const context = profileContext;
    drawStars(context, width, height, 0.45);

    const center = { x: width * 0.5, y: height * 0.52 };
    const orbitRadius = Math.min(width * 0.37, 330);
    const exaggeration = 6;
    const verticalRadius = Math.max(13, orbitRadius * Math.sin(toRadians(state.inclination)) * exaggeration);
    const argumentRad = toRadians(geometry.orbitalArgument);
    const moon = {
        x: center.x + Math.cos(argumentRad) * orbitRadius,
        y: center.y - Math.sin(argumentRad) * verticalRadius
    };

    context.save();
    context.strokeStyle = "rgba(111, 184, 222, 0.75)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(26, center.y);
    context.lineTo(width - 26, center.y);
    context.stroke();

    context.strokeStyle = "rgba(220, 229, 235, 0.66)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.ellipse(center.x, center.y, orbitRadius, verticalRadius, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();

    const ascending = { x: center.x + orbitRadius, y: center.y };
    const descending = { x: center.x - orbitRadius, y: center.y };
    drawBody(context, ascending.x, ascending.y, 5, "#2ab27b", "#b8ffe2");
    drawBody(context, descending.x, descending.y, 5, "#d68b34", "#ffe1b9");
    drawBody(context, center.x, center.y, Math.max(13, width * 0.016), "#2b8cc4", "#8dd6ef");
    drawBody(context, moon.x, moon.y, Math.max(7, width * 0.008), "#d6dde2", "#ffffff");

    drawLabel(context, "Eclittica", width - 90, center.y - 12, width);
    drawLabel(context, "Terra", center.x, center.y - 26, width);
    drawLabel(context, "Luna", moon.x, moon.y - 18, width);

    context.save();
    context.fillStyle = "rgba(234, 242, 247, 0.8)";
    context.font = "600 10px system-ui, sans-serif";
    context.fillText(`Altezza amplificata x${exaggeration}`, 12, height - 10);
    context.restore();
}

function updateFeedback(geometry) {
    const feedback = eclipseFeedback(geometry);
    feedbackPanel.classList.toggle("is-eclipse", feedback.level === "eclipse");
    feedbackPanel.classList.toggle("is-near", feedback.level === "near");
    feedbackSymbol.textContent = feedback.symbol;
    feedbackTitle.textContent = feedback.title;
    feedbackText.textContent = feedback.text;
    outputs.livePhase.textContent = phaseName(state.phase);
    outputs.liveLatitude.textContent = `${formatNumber(geometry.latitudeDeg, 2)} gradi`;
    outputs.liveNodeDistance.textContent = `${formatNumber(geometry.nodeDistance, 1)} gradi`;
    outputs.liveMoonSize.textContent = `${formatNumber(geometry.moonAngularRadius * 2, 3)} gradi`;
}

function syncControls() {
    controls.phase.value = state.phase;
    controls.inclination.value = state.inclination;
    controls.nodeAngle.value = state.nodeAngle;
    controls.distanceKm.value = state.distanceKm;
    controls.speed.value = state.speed;
    controls.showShadows.checked = state.showShadows;
    controls.showLabels.checked = state.showLabels;

    outputs.phase.textContent = `${Math.round(state.phase)} gradi`;
    outputs.inclination.textContent = `${formatNumber(state.inclination, 1)} gradi`;
    outputs.nodeAngle.textContent = `${Math.round(state.nodeAngle)} gradi`;
    outputs.distanceKm.textContent = `${new Intl.NumberFormat("it-IT").format(Math.round(state.distanceKm))} km`;
    outputs.speed.textContent = `${Math.round(state.speed)} gradi/s`;
    outputs.phaseName.textContent = phaseName(state.phase);
    controls.phase.setAttribute("aria-valuetext", `${Math.round(state.phase)} gradi, ${phaseName(state.phase)}`);
    playButton.textContent = state.playing ? "Pausa orbita" : "Avvia orbita";
    playButton.setAttribute("aria-pressed", String(state.playing));
}

function render() {
    const geometry = calculateGeometry();
    syncControls();
    drawSpaceView(geometry);
    drawProfileView(geometry);
    updateFeedback(geometry);
}

function applyPreset(name) {
    state.playing = false;
    if (name === "solar") {
        Object.assign(state, {
            phase: 0,
            inclination: 5.1,
            nodeAngle: 180,
            distanceKm: 360000
        });
    } else if (name === "lunar") {
        Object.assign(state, {
            phase: 180,
            inclination: 5.1,
            nodeAngle: 0,
            distanceKm: 384400
        });
    } else {
        Object.assign(state, {
            phase: 42,
            inclination: 5.1,
            nodeAngle: 20,
            distanceKm: 384400
        });
    }
    render();
}

Object.entries(controls).forEach(([key, control]) => {
    control.addEventListener("input", () => {
        state[key] = control.type === "checkbox" ? control.checked : Number(control.value);
        render();
    });
});

playButton.addEventListener("click", () => {
    state.playing = !state.playing;
    syncControls();
});

document.querySelectorAll("[data-preset]").forEach(button => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

document.getElementById("reset-button").addEventListener("click", () => {
    Object.assign(state, DEFAULT_STATE);
    render();
});

function animate(currentTime) {
    const elapsedSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
    lastFrameTime = currentTime;
    if (state.playing) {
        state.phase = normalizeDegrees(state.phase + elapsedSeconds * state.speed);
        render();
    }
    requestAnimationFrame(animate);
}

const resizeObserver = new ResizeObserver(render);
resizeObserver.observe(spaceCanvas);
resizeObserver.observe(profileCanvas);

render();
requestAnimationFrame(animate);
