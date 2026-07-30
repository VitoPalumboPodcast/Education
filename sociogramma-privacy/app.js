"use strict";

const QUESTIONS = [
    {
        id: "work",
        text: "Con quali persone preferiresti collaborare in un lavoro di gruppo?"
    },
    {
        id: "help",
        text: "A quali persone chiederesti aiuto per affrontare un compito?"
    },
    {
        id: "wellbeing",
        text: "Quali persone contribuiscono maggiormente al benessere del gruppo?"
    }
];

const state = {
    version: 1,
    project: {
        name: "",
        purpose: "groups",
        deletionDate: "",
        createdAt: ""
    },
    participants: [],
    nominations: []
};

let activeStep = "project";
let pendingPasswordAction = null;
let pendingConfirmation = null;
let pendingImportData = null;
let toastTimer = null;
let surveyContext = {
    questionId: QUESTIONS[0].id,
    respondentId: ""
};

const stepButtons = Array.from(document.querySelectorAll(".step-button"));
const stepPanels = Array.from(document.querySelectorAll(".step-panel"));
const projectForm = document.getElementById("project-form");
const projectName = document.getElementById("project-name");
const projectPurpose = document.getElementById("project-purpose");
const participantCount = document.getElementById("participant-count");
const codePrefix = document.getElementById("code-prefix");
const deletionDate = document.getElementById("deletion-date");
const authorizationCheck = document.getElementById("authorization-check");
const participantList = document.getElementById("participant-list");
const questionSelect = document.getElementById("question-select");
const respondentSelect = document.getElementById("respondent-select");
const choiceList = document.getElementById("choice-list");
const choiceCount = document.getElementById("choice-count");
const surveyProgress = document.getElementById("survey-progress");
const analysisQuestion = document.getElementById("analysis-question");
const summaryMetrics = document.getElementById("summary-metrics");
const metricsTable = document.getElementById("metrics-table");
const networkGraph = document.getElementById("network-graph");
const privacyDialog = document.getElementById("privacy-dialog");
const passwordDialog = document.getElementById("password-dialog");
const passwordForm = document.getElementById("password-form");
const passwordTitle = document.getElementById("password-title");
const passwordDescription = document.getElementById("password-description");
const backupPassword = document.getElementById("backup-password");
const passwordError = document.getElementById("password-error");
const confirmDialog = document.getElementById("confirm-dialog");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");
const confirmAction = document.getElementById("confirm-action");
const importFile = document.getElementById("import-file");
const toast = document.getElementById("toast");

function setDefaultDeletionDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    deletionDate.value = date.toISOString().slice(0, 10);
}

function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function goToStep(step) {
    if (!["project", "participants", "survey", "analysis"].includes(step)) return;
    if (step !== "project" && state.participants.length < 3) {
        showToast("Genera almeno tre codici prima di continuare.");
        step = "project";
    }

    activeStep = step;
    stepButtons.forEach(button => {
        const selected = button.dataset.step === step;
        button.classList.toggle("is-active", selected);
        if (selected) {
            button.setAttribute("aria-current", "step");
        } else {
            button.removeAttribute("aria-current");
        }
    });
    stepPanels.forEach(panel => {
        const selected = panel.id === `step-${step}`;
        panel.hidden = !selected;
        panel.classList.toggle("is-active", selected);
    });

    if (step === "participants") renderParticipants();
    if (step === "survey") renderSurvey();
    if (step === "analysis") renderAnalysis();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function createParticipantCodes(count, prefix) {
    const width = Math.max(2, String(count).length);
    return Array.from({ length: count }, (_, index) => ({
        id: `${prefix.toUpperCase()}${String(index + 1).padStart(width, "0")}`
    }));
}

function generateProject(event) {
    event.preventDefault();
    const count = Number(participantCount.value);
    const prefix = codePrefix.value.trim();

    if (!authorizationCheck.checked) {
        showToast("Conferma prima l'autorizzazione e l'informativa.");
        authorizationCheck.focus();
        return;
    }
    if (!Number.isInteger(count) || count < 3 || count > 40) {
        showToast("Inserisci un numero di partecipanti compreso tra 3 e 40.");
        participantCount.focus();
        return;
    }
    if (!/^[A-Za-z]{1,3}$/.test(prefix)) {
        showToast("Il prefisso deve contenere da una a tre lettere.");
        codePrefix.focus();
        return;
    }

    const applyGeneration = () => {
        state.project = {
            name: projectName.value.trim(),
            purpose: projectPurpose.value,
            deletionDate: deletionDate.value,
            createdAt: new Date().toISOString()
        };
        state.participants = createParticipantCodes(count, prefix);
        state.nominations = [];
        goToStep("participants");
        showToast("Codici generati. Nessun nome e stato salvato.");
    };

    if (state.nominations.length > 0) {
        requestConfirmation(
            "Rigenerare i codici?",
            "Le scelte gia registrate verranno eliminate.",
            applyGeneration
        );
    } else {
        applyGeneration();
    }
}

function renderParticipants() {
    participantList.replaceChildren();
    state.participants.forEach(participant => {
        const item = document.createElement("div");
        item.className = "code-item";

        const code = document.createElement("strong");
        code.textContent = participant.id;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", `Rimuovi ${participant.id}`);
        remove.title = `Rimuovi ${participant.id}`;
        remove.textContent = "\u00d7";
        remove.addEventListener("click", () => removeParticipant(participant.id));

        item.append(code, remove);
        participantList.appendChild(item);
    });
}

function addParticipant() {
    if (state.participants.length >= 40) {
        showToast("Il limite e di 40 codici.");
        return;
    }
    const firstId = state.participants[0]?.id || "P01";
    const prefix = firstId.match(/^[A-Za-z]+/)?.[0] || "P";
    const used = new Set(state.participants.map(item => item.id));
    let number = state.participants.length + 1;
    let id = `${prefix}${String(number).padStart(2, "0")}`;
    while (used.has(id)) {
        number += 1;
        id = `${prefix}${String(number).padStart(2, "0")}`;
    }
    state.participants.push({ id });
    renderParticipants();
}

function removeParticipant(id) {
    if (state.participants.length <= 3) {
        showToast("Servono almeno tre codici.");
        return;
    }
    const related = state.nominations.some(item => item.from === id || item.to === id);
    const remove = () => {
        state.participants = state.participants.filter(item => item.id !== id);
        state.nominations = state.nominations.filter(item => item.from !== id && item.to !== id);
        renderParticipants();
        showToast(`${id} rimosso.`);
    };
    if (related) {
        requestConfirmation(
            `Rimuovere ${id}?`,
            "Verranno eliminate anche le scelte collegate a questo codice.",
            remove
        );
    } else {
        remove();
    }
}

function populateSelect(select, options, currentValue) {
    select.replaceChildren();
    options.forEach(option => {
        const element = document.createElement("option");
        element.value = option.value;
        element.textContent = option.label;
        select.appendChild(element);
    });
    if (options.some(option => option.value === currentValue)) {
        select.value = currentValue;
    }
}

function renderSurvey() {
    const currentQuestion = questionSelect.value || QUESTIONS[0].id;
    const currentRespondent = respondentSelect.value || state.participants[0]?.id;
    populateSelect(
        questionSelect,
        QUESTIONS.map(question => ({ value: question.id, label: question.text })),
        currentQuestion
    );
    populateSelect(
        respondentSelect,
        state.participants.map(participant => ({ value: participant.id, label: participant.id })),
        currentRespondent
    );
    surveyContext = {
        questionId: questionSelect.value,
        respondentId: respondentSelect.value
    };
    renderChoices();
    updateSurveyProgress();
}

function getCurrentSelections() {
    return new Set(
        state.nominations
            .filter(item => item.questionId === questionSelect.value && item.from === respondentSelect.value)
            .map(item => item.to)
    );
}

function renderChoices() {
    const selected = getCurrentSelections();
    choiceList.replaceChildren();

    state.participants
        .filter(participant => participant.id !== respondentSelect.value)
        .forEach(participant => {
            const label = document.createElement("label");
            label.className = "choice-option";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = participant.id;
            input.checked = selected.has(participant.id);
            input.addEventListener("change", enforceChoiceLimit);

            const text = document.createElement("span");
            text.textContent = participant.id;

            label.append(input, text);
            choiceList.appendChild(label);
        });

    updateChoiceCount();
}

function enforceChoiceLimit(event) {
    const checked = Array.from(choiceList.querySelectorAll("input:checked"));
    if (checked.length > 3) {
        event.target.checked = false;
        showToast("Puoi scegliere al massimo tre codici.");
    }
    updateChoiceCount();
}

function updateChoiceCount() {
    const selectedCount = choiceList.querySelectorAll("input:checked").length;
    choiceCount.textContent = `${selectedCount} di 3 selezionati`;
}

function saveCurrentSelections() {
    saveSelectionsFor(questionSelect.value, respondentSelect.value);
}

function saveSelectionsFor(questionId, from) {
    if (!questionId || !from) return;
    const selected = Array.from(choiceList.querySelectorAll("input:checked")).map(input => input.value);

    state.nominations = state.nominations.filter(
        item => !(item.questionId === questionId && item.from === from)
    );
    selected.forEach(to => state.nominations.push({ questionId, from, to }));
    updateSurveyProgress();
}

function handleSurveyContextChange() {
    saveSelectionsFor(surveyContext.questionId, surveyContext.respondentId);
    surveyContext = {
        questionId: questionSelect.value,
        respondentId: respondentSelect.value
    };
    renderChoices();
}

function saveAndNext() {
    saveCurrentSelections();
    const currentIndex = state.participants.findIndex(item => item.id === respondentSelect.value);
    if (currentIndex < state.participants.length - 1) {
        respondentSelect.value = state.participants[currentIndex + 1].id;
        surveyContext.respondentId = respondentSelect.value;
        renderChoices();
        showToast("Scelte salvate.");
        return;
    }

    const questionIndex = QUESTIONS.findIndex(item => item.id === questionSelect.value);
    if (questionIndex < QUESTIONS.length - 1) {
        questionSelect.value = QUESTIONS[questionIndex + 1].id;
        respondentSelect.value = state.participants[0].id;
        surveyContext = {
            questionId: questionSelect.value,
            respondentId: respondentSelect.value
        };
        renderChoices();
        showToast("Domanda completata. Passaggio alla successiva.");
        return;
    }

    showToast("Rilevazione completata.");
    goToStep("analysis");
}

function updateSurveyProgress() {
    const completedPairs = new Set(
        state.nominations.map(item => `${item.questionId}:${item.from}`)
    );
    const total = QUESTIONS.length * state.participants.length;
    const percentage = total ? Math.round((completedPairs.size / total) * 100) : 0;
    surveyProgress.textContent = `${percentage}%`;
}

function getFilteredNominations() {
    const questionId = analysisQuestion.value;
    return questionId === "all"
        ? [...state.nominations]
        : state.nominations.filter(item => item.questionId === questionId);
}

function calculateMetrics(nominations) {
    const byCode = new Map(
        state.participants.map(participant => [
            participant.id,
            { id: participant.id, received: 0, expressed: 0, reciprocal: 0 }
        ])
    );
    const edges = new Set(nominations.map(item => `${item.from}>${item.to}`));

    nominations.forEach(item => {
        byCode.get(item.from).expressed += 1;
        byCode.get(item.to).received += 1;
        if (edges.has(`${item.to}>${item.from}`)) {
            byCode.get(item.from).reciprocal += 1;
        }
    });

    return Array.from(byCode.values()).sort(
        (a, b) => b.received - a.received || b.reciprocal - a.reciprocal || a.id.localeCompare(b.id)
    );
}

function renderAnalysis() {
    populateSelect(
        analysisQuestion,
        [
            { value: "all", label: "Tutte le domande" },
            ...QUESTIONS.map(question => ({ value: question.id, label: question.text }))
        ],
        analysisQuestion.value || "all"
    );
    const nominations = getFilteredNominations();
    const metrics = calculateMetrics(nominations);
    renderSummary(nominations, metrics);
    renderMetricsTable(metrics);
    renderNetwork(nominations, metrics);
}

function renderSummary(nominations, metrics) {
    const edgeSet = new Set(nominations.map(item => `${item.from}>${item.to}`));
    const mutualPairs = new Set(
        nominations
            .filter(item => edgeSet.has(`${item.to}>${item.from}`))
            .map(item => [item.from, item.to].sort().join("<>"))
    ).size;
    const participantsReached = metrics.filter(item => item.received > 0).length;
    const respondents = new Set(nominations.map(item => item.from)).size;

    const values = [
        { value: state.participants.length, label: "Codici attivi" },
        { value: nominations.length, label: "Scelte registrate" },
        { value: mutualPairs, label: "Coppie reciproche" },
        { value: participantsReached, label: "Codici raggiunti" }
    ];

    summaryMetrics.replaceChildren(
        ...values.map(item => {
            const box = document.createElement("div");
            box.className = "metric";
            const value = document.createElement("strong");
            value.textContent = item.value;
            const label = document.createElement("span");
            label.textContent = item.label;
            box.append(value, label);
            return box;
        })
    );

    if (respondents === 0) {
        showToast("Non sono ancora presenti scelte per questa vista.");
    }
}

function renderMetricsTable(metrics) {
    metricsTable.replaceChildren(
        ...metrics.map(item => {
            const row = document.createElement("tr");
            [item.id, item.received, item.expressed, item.reciprocal].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            return row;
        })
    );
}

function svgElement(name, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
}

function renderNetwork(nominations, metrics) {
    networkGraph.replaceChildren();
    const defs = svgElement("defs");
    const marker = svgElement("marker", {
        id: "arrow",
        viewBox: "0 0 10 10",
        refX: "9",
        refY: "5",
        markerWidth: "6",
        markerHeight: "6",
        orient: "auto-start-reverse"
    });
    marker.appendChild(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#7894a7" }));
    defs.appendChild(marker);
    networkGraph.appendChild(defs);

    const centerX = 380;
    const centerY = 260;
    const radiusX = 305;
    const radiusY = 205;
    const positions = new Map();
    state.participants.forEach((participant, index) => {
        const angle = (Math.PI * 2 * index) / state.participants.length - Math.PI / 2;
        positions.set(participant.id, {
            x: centerX + Math.cos(angle) * radiusX,
            y: centerY + Math.sin(angle) * radiusY
        });
    });

    const uniqueNominations = Array.from(
        new Map(nominations.map(item => [`${item.from}>${item.to}`, item])).values()
    );
    const edgeSet = new Set(uniqueNominations.map(item => `${item.from}>${item.to}`));
    uniqueNominations.forEach(item => {
        const start = positions.get(item.from);
        const end = positions.get(item.to);
        if (!start || !end) return;
        const mutual = edgeSet.has(`${item.to}>${item.from}`);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.hypot(dx, dy) || 1;
        const offset = 24;
        const line = svgElement("line", {
            x1: start.x + (dx / length) * offset,
            y1: start.y + (dy / length) * offset,
            x2: end.x - (dx / length) * offset,
            y2: end.y - (dy / length) * offset,
            "marker-end": "url(#arrow)",
            class: `graph-edge${mutual ? " is-mutual" : ""}`
        });
        networkGraph.appendChild(line);
    });

    const metricMap = new Map(metrics.map(item => [item.id, item]));
    state.participants.forEach(participant => {
        const position = positions.get(participant.id);
        const group = svgElement("g", {
            class: "graph-node",
            transform: `translate(${position.x} ${position.y})`
        });
        group.appendChild(svgElement("circle", { r: "23" }));

        const code = svgElement("text", { y: "-2" });
        code.textContent = participant.id;
        group.appendChild(code);

        const count = svgElement("text", { y: "12", class: "node-count" });
        count.textContent = `ricevute ${metricMap.get(participant.id)?.received || 0}`;
        group.appendChild(count);
        networkGraph.appendChild(group);
    });
}

function requestConfirmation(title, message, action) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    pendingConfirmation = action;
    confirmDialog.showModal();
}

function resetState() {
    state.project = {
        name: "",
        purpose: "groups",
        deletionDate: "",
        createdAt: ""
    };
    state.participants = [];
    state.nominations = [];
    pendingImportData = null;
    participantList.replaceChildren();
    choiceList.replaceChildren();
    respondentSelect.replaceChildren();
    questionSelect.replaceChildren();
    analysisQuestion.replaceChildren();
    summaryMetrics.replaceChildren();
    metricsTable.replaceChildren();
    networkGraph.replaceChildren();
    choiceCount.textContent = "0 di 3 selezionati";
    surveyProgress.textContent = "0%";
    projectForm.reset();
    participantCount.value = "12";
    codePrefix.value = "P";
    setDefaultDeletionDate();
    goToStep("project");
}

function openPasswordDialog(mode) {
    pendingPasswordAction = mode;
    passwordForm.reset();
    passwordError.textContent = "";
    backupPassword.autocomplete = mode === "export" ? "new-password" : "current-password";
    passwordTitle.textContent = mode === "export" ? "Proteggi il backup" : "Apri il backup";
    passwordDescription.textContent = mode === "export"
        ? "Usa almeno 10 caratteri. La password non viene salvata e non puo essere recuperata."
        : "Inserisci la password usata quando il backup e stato creato.";
    passwordDialog.showModal();
    window.setTimeout(() => backupPassword.focus(), 50);
}

function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

function base64ToBytes(value) {
    const binary = atob(value);
    return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function deriveEncryptionKey(password, salt, usages) {
    const material = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 250000,
            hash: "SHA-256"
        },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        usages
    );
}

async function createEncryptedBackup(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveEncryptionKey(password, salt, ["encrypt"]);
    const payload = new TextEncoder().encode(JSON.stringify({
        ...state,
        exportedAt: new Date().toISOString()
    }));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload);
    return {
        format: "sociogramma-riservato",
        version: 1,
        encryption: {
            algorithm: "AES-GCM",
            derivation: "PBKDF2-SHA256",
            iterations: 250000,
            salt: bytesToBase64(salt),
            iv: bytesToBase64(iv)
        },
        data: bytesToBase64(new Uint8Array(encrypted))
    };
}

async function decryptBackup(fileData, password) {
    if (
        fileData?.format !== "sociogramma-riservato" ||
        fileData?.version !== 1 ||
        !fileData?.encryption ||
        !fileData?.data
    ) {
        throw new Error("Formato non riconosciuto.");
    }
    const salt = base64ToBytes(fileData.encryption.salt);
    const iv = base64ToBytes(fileData.encryption.iv);
    const encrypted = base64ToBytes(fileData.data);
    const key = await deriveEncryptionKey(password, salt, ["decrypt"]);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
    return JSON.parse(new TextDecoder().decode(decrypted));
}

function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function validateImportedProject(data) {
    if (
        data?.version !== 1 ||
        !data?.project ||
        !Array.isArray(data?.participants) ||
        !Array.isArray(data?.nominations)
    ) {
        throw new Error("Il contenuto del progetto non e valido.");
    }
    if (data.participants.length < 3 || data.participants.length > 40) {
        throw new Error("Numero di codici non valido.");
    }
    const ids = new Set();
    data.participants.forEach(participant => {
        if (!participant || typeof participant.id !== "string" || !/^[A-Za-z]{1,3}\d{2,3}$/.test(participant.id)) {
            throw new Error("Uno o piu codici non sono validi.");
        }
        if (ids.has(participant.id)) throw new Error("Sono presenti codici duplicati.");
        ids.add(participant.id);
    });
    data.nominations.forEach(item => {
        if (
            !QUESTIONS.some(question => question.id === item.questionId) ||
            !ids.has(item.from) ||
            !ids.has(item.to) ||
            item.from === item.to
        ) {
            throw new Error("Sono presenti scelte non valide.");
        }
    });
}

async function handlePasswordSubmit(event) {
    event.preventDefault();
    const password = backupPassword.value;
    if (password.length < 10) {
        passwordError.textContent = "Usa almeno 10 caratteri.";
        return;
    }

    const button = document.getElementById("password-confirm");
    button.disabled = true;
    passwordError.textContent = "";
    try {
        if (pendingPasswordAction === "export") {
            const backup = await createEncryptedBackup(password);
            const date = new Date().toISOString().slice(0, 10);
            downloadJson(backup, `sociogramma-${date}.socio`);
            passwordDialog.close();
            showToast("Backup cifrato creato.");
        } else if (pendingPasswordAction === "import") {
            const imported = await decryptBackup(pendingImportData, password);
            validateImportedProject(imported);
            state.project = imported.project;
            state.participants = imported.participants;
            state.nominations = imported.nominations;
            pendingImportData = null;
            syncFormFromState();
            passwordDialog.close();
            goToStep("participants");
            showToast("Backup aperto soltanto in memoria.");
        }
    } catch (error) {
        passwordError.textContent = pendingPasswordAction === "import"
            ? "Password errata o file non valido."
            : "Non e stato possibile creare il backup.";
    } finally {
        button.disabled = false;
    }
}

function syncFormFromState() {
    projectName.value = state.project.name || "";
    projectPurpose.value = state.project.purpose || "groups";
    deletionDate.value = state.project.deletionDate || "";
    participantCount.value = state.participants.length;
    codePrefix.value = state.participants[0]?.id.match(/^[A-Za-z]+/)?.[0] || "P";
    authorizationCheck.checked = true;
}

async function readImportFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showToast("Il file supera il limite di 2 MB.");
        return;
    }
    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (parsed?.format !== "sociogramma-riservato") {
            throw new Error("Formato non valido");
        }
        pendingImportData = parsed;
        openPasswordDialog("import");
    } catch (error) {
        pendingImportData = null;
        showToast("Il file selezionato non e un backup valido.");
    }
}

function closeDialog(button) {
    const dialog = button.closest("dialog");
    if (!dialog) return;
    if (dialog === passwordDialog) {
        pendingImportData = null;
    }
    dialog.close();
}

stepButtons.forEach(button => {
    button.addEventListener("click", () => goToStep(button.dataset.step));
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        if (activeStep === "survey") saveCurrentSelections();
        goToStep(button.dataset.go);
    });
});

document.querySelectorAll("[data-close-dialog]").forEach(button => {
    button.addEventListener("click", () => closeDialog(button));
});

projectForm.addEventListener("submit", generateProject);
document.getElementById("add-participant").addEventListener("click", addParticipant);
questionSelect.addEventListener("change", handleSurveyContextChange);
respondentSelect.addEventListener("change", handleSurveyContextChange);
document.getElementById("save-and-next").addEventListener("click", saveAndNext);
analysisQuestion.addEventListener("change", renderAnalysis);
document.getElementById("print-analysis").addEventListener("click", () => window.print());
document.getElementById("print-report").addEventListener("click", () => {
    if (state.participants.length < 3) {
        showToast("Crea prima un progetto.");
        return;
    }
    goToStep("analysis");
    window.setTimeout(() => window.print(), 100);
});
document.getElementById("open-privacy-note").addEventListener("click", () => privacyDialog.showModal());
document.getElementById("new-project").addEventListener("click", () => {
    if (state.participants.length > 0) {
        requestConfirmation(
            "Creare un nuovo progetto?",
            "Tutti i dati presenti in memoria verranno cancellati.",
            resetState
        );
    } else {
        resetState();
    }
});
document.getElementById("delete-project").addEventListener("click", () => {
    if (state.participants.length === 0) {
        showToast("Non ci sono dati da cancellare.");
        return;
    }
    requestConfirmation(
        "Cancellare tutti i dati?",
        "Il progetto sara rimosso dalla memoria e non potra essere recuperato senza un backup.",
        () => {
            resetState();
            showToast("Dati cancellati dalla memoria.");
        }
    );
});
document.getElementById("export-project").addEventListener("click", () => {
    if (state.participants.length < 3) {
        showToast("Crea prima un progetto.");
        return;
    }
    openPasswordDialog("export");
});
document.getElementById("import-project").addEventListener("click", () => importFile.click());
importFile.addEventListener("change", readImportFile);
passwordForm.addEventListener("submit", handlePasswordSubmit);
confirmAction.addEventListener("click", () => {
    const action = pendingConfirmation;
    pendingConfirmation = null;
    confirmDialog.close();
    action?.();
});

window.addEventListener("beforeunload", event => {
    if (state.participants.length > 0 || state.nominations.length > 0) {
        event.preventDefault();
        event.returnValue = "";
    }
});

setDefaultDeletionDate();
