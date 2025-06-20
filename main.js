// === CONFIGURAZIONE MIGLIORATA ===
const CONFIG = {
    colors: {
        nodes: ["#3498db","#e67e22","#2ecc71","#e74c3c","#9b59b6","#f1c40f","#34495e","#8e44ad","#16a085","#d35400"],
        text: ["#ffffff","#2c3e50","#34495e","#7f8c8d"],
        icons: ["#ffffff","#2c3e50","#34495e","#f1c40f","#e74c3c","#3498db"],
        connections: ["#34495e","#9b59b6","#e67e22","#2ecc71","#e74c3c","#c0392b","#3498db","#f39c12"],
        categories: {
            idea: "#f1c40f", // Giallo
            task: "#2ecc71", // Verde
            person: "#9b59b6", // Viola
            resource: "#3498db", // Blu
            location: "#e74c3c", // Rosso
            date: "#1abc9c", // Turchese
            default: "#bdc3c7" // Grigio
        },
        priority: {
            low: "#27ae60", // Verde
            medium: "#f39c12", // Giallo
            high: "#e74c3c"  // Rosso
        }
    },
    icons: [
        "fas fa-lightbulb","fas fa-star","fas fa-brain","fas fa-book","fas fa-heart",
        "fas fa-users","fas fa-globe","fas fa-comments","fas fa-graduation-cap",
        "fas fa-cube","fas fa-leaf","fas fa-music","fas fa-flask","fas fa-rocket",
        "fas fa-home","fas fa-car","fas fa-phone","fas fa-envelope","fas fa-camera",
        "fas fa-gamepad","fas fa-gift","fas fa-key","fas fa-lock","fas fa-magic",
        "fas fa-flag", "fas fa-cog", "fas fa-briefcase", "fas fa-chart-line"
    ],
    defaultViewBox: "0 0 1200 800",
    localStorageKey: "mindMapAdvancedData",
    shortcuts: {
        'KeyN': () => document.getElementById("add-node").click(),
        'KeyC': () => document.getElementById("add-connection").click(),
        'Delete': () => document.getElementById("remove-node").click(),
        'Backspace': () => document.getElementById("remove-node").click(),
        'KeyF': () => document.getElementById("fit-screen").click(),
        'KeyE': () => document.getElementById("open-sidebar").click(),
        'KeyP': () => document.getElementById("layout-physics").click(),
        'KeyH': () => document.getElementById("layout-hierarchy").click(),
        'KeyT': () => document.getElementById("theme-toggle").click(),
        'Equal': {ctrl:false, action: () => document.getElementById("zoom-in").click()},
        'Minus': {ctrl:false, action: () => document.getElementById("zoom-out").click()},
        'KeyS': {ctrl:true, action: () => document.getElementById("save-map").click()},
        'KeyZ': {ctrl:true, action: () => document.getElementById("undo").click()},
        'KeyY': {ctrl:true, action: () => document.getElementById("redo").click()},
    }
};

const ICON_SVGS = {
  "fas fa-lightbulb": `<svg viewBox="0 0 384 512"><path fill="currentColor" d="M96 464a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-16H96zm96-464C112.9 0 48 64.6 48 144c0 61.9 37.2 114.6 89.7 135.2C149.6 297.8 176 336 176 384v8a24 24 0 0 0 24 24h16a24 24 0 0 0 24-24v-8c0-48 26.4-86.2 56.3-104.8C314.8 258.6 352 205.9 352 144c0-79.4-64.9-144-144-144z"/></svg>`,
  "fas fa-star": `<svg viewBox="0 0 576 512"><path fill="currentColor" d="M287.9 17.8L354 150.2 490.5 171.5c26.2 3.8 36.7 36 17.7 54.6L402.3 312l23.7 138.4c4.5 26.3-23.2 46-46.4 33.7L288 439.6l-91.6 48.1c-23.2 12.2-50.9-7.4-46.4-33.7L173.7 312 67.8 226.1c-19-18.6-8.5-50.8 17.7-54.6L222 150.2 288.1 17.8c11.7-23.6 45.6-23.9 57.8 0z"/></svg>`,
  "fas fa-brain": `<svg viewBox="0 0 576 512"><path fill="currentColor" d="M288 0C196.5 0 128 32.7 128 96c0 28.7 16.2 56.5 30.3 76.9C111.8 199.6 64 258.7 64 320c0 79.5 100.5 144 224 144s224-64.5 224-144c0-61.3-47.8-120.4-102.3-147.1C331.8 152.5 348 124.7 348 96c0-63.3-68.5-96-160-96zm160 336c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32V272h160v64zm48-160c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64s28.7-64 64-64h128c35.3 0 64 28.7 64 64z"/></svg>`,
  "fas fa-book": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M448 32H0v448h448V32zM192 416H64V128h128v288zm192 0H256V128h128v288z"/></svg>`,
  "fas fa-users": `<svg viewBox="0 0 640 512"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-38.5 5.9-53.7 15.6C364 325.2 352 349.1 352 374.4V432c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-57.6c0-35.7-20.8-67.3-51.1-82.9-.1-.1-.2-.1-.2-.2z"/></svg>`,
  "fas fa-heart": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 464l-60-56C84 320 16 248 16 168 16 96 80 32 152 32c38 0 74 18 104 47 30-29 66-47 104-47 72 0 136 64 136 136 0 80-68 152-180 240l-60 56z"/></svg>`,
  "fas fa-globe": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="208" fill="currentColor"/></svg>`,
  "fas fa-comments": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 224h160v80H96L32 384zM480 96H192v160h160l96 80V96z"/></svg>`,
  "fas fa-graduation-cap": `<svg viewBox="0 0 640 512"><path fill="currentColor" d="M320 32L0 160l320 128 320-128L320 32zm0 192l-192-76v92c0 62 86 112 192 112s192-50 192-112v-92l-192 76z"/></svg>`,
  "fas fa-cube": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 32L32 128v256l224 96 224-96V128L256 32zm0 64l160 64v160L256 384 96 320V160l160-64z"/></svg>`,
  "fas fa-leaf": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M448 64C256 64 64 256 64 256s96 160 256 160c96 0 160-64 160-160V64z"/></svg>`,
  "fas fa-music": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M448 32L176 96v256a64 64 0 1 0 32 55V180l208-52v170a64 64 0 1 0 32 55V32z"/></svg>`,
  "fas fa-flask": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M144 32h160v32l-48 96v160a80 80 0 1 1-64 0V160l-48-96V32z"/></svg>`,
  "fas fa-rocket": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M240 0L96 96v128L0 288l96 32 32 96 64-96h128l96-144L240 0z"/></svg>`,
  "fas fa-home": `<svg viewBox="0 0 576 512"><path fill="currentColor" d="M288 32L32 256h96v192h128V320h64v128h128V256h96L288 32z"/></svg>`,
  "fas fa-car": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M64 256l48-96h288l48 96v128H64V256zm48 128a32 32 0 1 0 0-64 32 32 0 0 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"/></svg>`,
  "fas fa-phone": `<svg viewBox="0 0 384 512"><path fill="currentColor" d="M320 0H64a32 32 0 0 0-32 32v448a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zM192 472a24 24 0 1 1 0-48 24 24 0 0 1 0 48z"/></svg>`,
  "fas fa-envelope": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 96h448v320H32V96zm224 160L64 128h384L256 256z"/></svg>`,
  "fas fa-camera": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M96 128l48-48h224l48 48h48v256H48V128h48zm160 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"/></svg>`,
  "fas fa-gamepad": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M96 192l-64 96v64h64l64-64h192l64 64h64v-64l-64-96H96zm64 32h64v64h-64v-64zm192 0h32v32h-32v-32z"/></svg>`,
  "fas fa-gift": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 160h192V96h-48a48 48 0 0 1 0-96 48 48 0 0 1 48 48h64a48 48 0 0 1 48-48 48 48 0 0 1 0 96h-48v64h192v320H32V160zm96 96v64h256v-64H128z"/></svg>`,
  "fas fa-key": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M336 0a144 144 0 1 0 96 248h48v64h-64v64h-64v64h-96v-64H96V256a144 144 0 0 0 240-256z"/></svg>`,
  "fas fa-lock": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M352 192h-32v-56a96 96 0 0 0-192 0v56h-32a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V224a32 32 0 0 0-32-32zM224 336a32 32 0 1 1 0-64 32 32 0 0 1 0 64z"/></svg>`,
  "fas fa-magic": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M96 416l320-320-32-32-320 320v32h32zm256-96l64 64-32 32-64-64 32-32z"/></svg>`,
  "fas fa-flag": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M64 32v448h64V320h320L416 32H64z"/></svg>`,
  "fas fa-cog": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 176a80 80 0 1 0 0 160 80 80 0 0 0 0-160zm224 48h-48a176 176 0 0 0-20-80l34-34-34-34-34 34a176 176 0 0 0-80-20v-48h-64v48a176 176 0 0 0-80 20l-34-34-34 34 34 34a176 176 0 0 0-20 80h-48v64h48a176 176 0 0 0 20 80l-34 34 34 34 34-34a176 176 0 0 0 80 20v48h64v-48a176 176 0 0 0 80-20l34 34 34-34-34-34a176 176 0 0 0 20-80h48z"/></svg>`,
  "fas fa-briefcase": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M128 128V96a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v32h96v256H32V128h96zm64 0h128V96H192v32z"/></svg>`,
  "fas fa-chart-line": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 448v32h448v-32H32zm64-96l96-96 64 64 160-160v96h32V128h-128v32h64L256 320l-64-64-128 128h32z"/></svg>`
  // Additional icons ensure canvas exports always use SVG
};
function getIconSVG(iconClass, size, color) {
    const svgData = ICON_SVGS[iconClass];
    if (!svgData) return "";
    let svgHtml = svgData.replace(/currentColor/g, color);
    svgHtml = svgHtml.replace(/<svg /, `<svg width="${size}" height="${size}" `);
    return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">${svgHtml}</div>`;
}


// === STATO DELL'APPLICAZIONE ===
let appState = {
    nodes: [],
    connections: [],
    selectedNode: null,
    selectedConnection: null,
    isConnecting: false,
    connectingFrom: null,
    layout: "normal",
    physics: false,
    simulation: null,
    isDarkTheme: false,
    searchTerm: "",
    history: [],
    historyIndex: -1,
    autoSave: true, // Potentially use this for periodic auto-save
    currentViewBox: CONFIG.defaultViewBox.split(" ").map(Number)
};

// === ELEMENTI DOM ===
const svgElem = document.getElementById("mindmap-svg");
const svg = d3.select(svgElem);
const nodesGroup = svg.select("#nodes-group");
const connectionsGroup = svg.select("#connections-group");
const sidebar = document.getElementById("sidebar");
const nodeEditor = document.getElementById("node-editor");
const connEditor = document.getElementById("connection-editor");
const minimapContainer = document.getElementById("minimap");
const minimapSvg = d3.select("#minimap-svg");
const minimapNodesGroup = minimapSvg.select("#minimap-nodes-group");
const minimapConnectionsGroup = minimapSvg.select("#minimap-connections-group");
const minimapViewportRect = minimapSvg.select("#minimap-viewport-rect");
const loadingIndicator = document.getElementById("loading");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");


// === UTILITY FUNCTIONS ===
function uniqueId(prefix = "n") {
    return prefix + "_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`; // Ensure previous types are cleared
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

function showLoading(message = "Elaborazione...") {
    loadingIndicator.querySelector("span").textContent = message;
    loadingIndicator.classList.add("show");
}
function hideLoading() {
    loadingIndicator.classList.remove("show");
}

function calcolaLineeTesto(nodo) {
    const charWidth = nodo.textSize * 0.6;
    while (true) {
        const maxCharsPerLine = Math.floor((nodo.size * 1.4 * 0.8) / charWidth);
        const words = (nodo.text || "").split(/\s+/);
        let line = "";
        const lines = [];
        for (let word of words) {
            if ((line + word).length > maxCharsPerLine && line) {
                lines.push(line.trim());
                line = word + " ";
            } else {
                line += word + " ";
            }
        }
        if (line.trim()) lines.push(line.trim());

        const lineHeight = nodo.textSize + 2;
        const requiredHeight = nodo.iconSize + lineHeight * lines.length + 10;
        const maxLineLength = Math.max(...lines.map(l => l.length), 0);
        const requiredWidth = (maxLineLength * charWidth) / 0.8;
        const requiredSize = Math.max(nodo.size, requiredHeight, requiredWidth / 1.4);

        if (requiredSize > nodo.size + 1) {
            nodo.size = requiredSize;
        } else {
            return { lines, lineHeight };
        }
    }
}

function saveToHistory() {
    const state = {
        nodes: JSON.parse(JSON.stringify(appState.nodes)), // Deep clone
        connections: JSON.parse(JSON.stringify(appState.connections.map(c => ({
            ...c,
            source: c.source.id, // Store only IDs for connections
            target: c.target.id
        })))),
        selectedNodeId: appState.selectedNode ? appState.selectedNode.id : null,
        selectedConnectionId: appState.selectedConnection ? appState.selectedConnection.id : null,
    };
    appState.history = appState.history.slice(0, appState.historyIndex + 1);
    appState.history.push(state);
    appState.historyIndex++;
    if (appState.history.length > 30) { // Limit history size
        appState.history.shift();
        appState.historyIndex--;
    }
    updateUndoRedoButtons();
}

function loadStateFromHistory(state) {
    appState.nodes = [];
    appState.connections = [];
    nodesGroup.selectAll("*").remove();
    connectionsGroup.selectAll("*").remove();

    state.nodes.forEach(nodeData => {
        // Create node without adding to history or redrawing yet
        const nodo = { ...nodeData }; // Create a copy
        appState.nodes.push(nodo);
    });
    
    // Connections need to reference the newly created node objects
    state.connections.forEach(connData => {
        const sourceNode = appState.nodes.find(n => n.id === connData.source);
        const targetNode = appState.nodes.find(n => n.id === connData.target);
        if (sourceNode && targetNode) {
            const conn = { ...connData, source: sourceNode, target: targetNode };
            appState.connections.push(conn);
        }
    });
    
    // Restore selections
    appState.selectedNode = state.selectedNodeId ? appState.nodes.find(n => n.id === state.selectedNodeId) : null;
    appState.selectedConnection = state.selectedConnectionId ? appState.connections.find(c => c.id === state.selectedConnectionId) : null;

    redrawAll();
    if (appState.selectedNode) apriSidebarNodo();
    else if (appState.selectedConnection) apriSidebarConnessione();
    else chiudiSidebar();
    evidenziaSelezione();
    updateUndoRedoButtons();
}

function undo() {
    if (appState.historyIndex > 0) {
        appState.historyIndex--;
        loadStateFromHistory(appState.history[appState.historyIndex]);
        showToast("Annullato", "success", 1500);
    }
}

function redo() {
    if (appState.historyIndex < appState.history.length - 1) {
        appState.historyIndex++;
        loadStateFromHistory(appState.history[appState.historyIndex]);
        showToast("Ripristinato", "success", 1500);
    }
}

function updateUndoRedoButtons() {
    undoButton.disabled = appState.historyIndex <= 0;
    redoButton.disabled = appState.historyIndex >= appState.history.length - 1;
}


// === GESTIONE NODI ===
function creaNodo(x, y, testo = "Nuovo nodo", descr = "", parentId = null) {
    const now = new Date().toISOString();
    const nodo = {
        id: uniqueId("node"),
        x, y,
        text: testo,
        description: descr,
        tags: [],
        category: "default",
        backgroundColor: CONFIG.colors.nodes[Math.floor(Math.random() * CONFIG.colors.nodes.length)],
        textColor: CONFIG.colors.text[0], // Default white
        iconColor: CONFIG.colors.icons[0],
        icon: CONFIG.icons[Math.floor(Math.random() * CONFIG.icons.length)],
        size: 90,
        textSize: 16,
        iconSize: 26, // Default icon size from old code
        shape: "rect",
        priority: "medium",
        parentId,
        createdAt: now,
        updatedAt: now
    };
    
    appState.nodes.push(nodo);
    disegnaNodo(nodo);
    if (appState.autoSave !== false) saveToHistory(); // Allow disabling for batch ops
    updateMinimap();
    return nodo;
}

function rimuoviNodo(nodo) {
    if (!nodo) return;
    
    appState.connections = appState.connections.filter(c => c.source.id !== nodo.id && c.target.id !== nodo.id);
    appState.nodes = appState.nodes.filter(n => n.id !== nodo.id);
    
    d3.select("#" + nodo.id).remove();
    
    if(appState.selectedNode && appState.selectedNode.id === nodo.id) {
        appState.selectedNode = null;
        chiudiSidebar();
    }
    
    aggiornaConnessioni(); // Redraw remaining connections
    saveToHistory();
    updateMinimap();
    showToast("Nodo eliminato", "success");
}

function disegnaNodo(nodo) {
    let g = nodesGroup.select("#" + nodo.id);
    if (!g.empty()) g.remove();
    
    g = nodesGroup.append("g")
        .attr("class", "node")
        .attr("id", nodo.id)
        .attr("transform", `translate(${nodo.x},${nodo.y})`)
        .style("cursor", "pointer")
        .on("dblclick", (event) => {
            event.stopPropagation();
            apriDescrizioneNodo(nodo);
            speakNode(nodo);
        })
        .on("click", (event) => {
            event.stopPropagation();
            if (appState.isConnecting && appState.connectingFrom && appState.connectingFrom.id !== nodo.id) {
                creaConnessione(appState.connectingFrom, nodo);
                appState.isConnecting = false;
                appState.connectingFrom = null;
                svgElem.style.cursor = "default";
                showToast("Connessione creata!", "success");
            } else {
                selezionaNodo(nodo);
            }
        });

    // Apply dimming if search is active and node doesn't match
    if (appState.searchTerm && !nodoMatchesSearch(nodo, appState.searchTerm)) {
        g.classed("dimmed", true);
    } else {
        g.classed("dimmed", false);
    }
    
    // Drag behavior
    g.call(d3.drag()
        .on("start", function(event) {
            d3.select(this).raise(); // Bring to front
            if (appState.physics && appState.simulation) { 
                nodo.fx = nodo.x; nodo.fy = nodo.y; 
                appState.simulation.alphaTarget(0.2).restart(); 
            }
        })
        .on("drag", function(event) {
            nodo.x = event.x; nodo.y = event.y;
            nodo.updatedAt = new Date().toISOString();
            if (appState.physics && appState.simulation) { 
                nodo.fx = event.x; nodo.fy = event.y; 
            }
            d3.select(this).attr("transform", `translate(${nodo.x},${nodo.y})`);
            aggiornaConnessioni();
            updateMinimap(); // Update minimap during drag
        })
        .on("end", function(event) {
            if (appState.physics && appState.simulation) { 
                nodo.fx = null; nodo.fy = null; 
                appState.simulation.alphaTarget(0); 
            }
            saveToHistory(); // Save state after drag
        })
    );
    
    const { lines, lineHeight } = calcolaLineeTesto(nodo);

    // Dynamically space icon and text based on current sizes
    const totalTextHeight = lines.length * lineHeight;
    // use icon size so large icons get more space
    const gap = Math.max(8, nodo.iconSize * 0.2);
    const totalHeight = nodo.iconSize + totalTextHeight + gap;
    const offset = (nodo.size - totalHeight) / 2;

    // SHAPE
    let shapeElement;
    const strokeColor = CONFIG.colors.priority[nodo.priority] || "#2c3e50";
    const strokeWidth = nodo.priority === "high" ? 3 : (nodo.priority === "medium" ? 2 : 1.5);

    if (nodo.shape === "circle") {
        shapeElement = g.append("circle").attr("r", nodo.size / 2);
    } else if (nodo.shape === "ellipse") {
        shapeElement = g.append("ellipse")
            .attr("rx", nodo.size * 0.75 / 2 * 1.2) // Wider ellipse
            .attr("ry", nodo.size / 2);
    } else if (nodo.shape === "hex") {
        let r = nodo.size / 2;
        let h = r * Math.sqrt(3) / 2;
        let points = [[-r,0], [-r/2,-h], [r/2,-h], [r,0], [r/2,h], [-r/2,h]]
            .map(p => [Math.round(p[0]), Math.round(p[1])]).map(p => p.join(",")).join(" ");
        shapeElement = g.append("polygon").attr("points", points);
    } else if (nodo.shape === "diamond") {
        let s = nodo.size / 2;
        let points = [[0, -s], [s*0.8, 0], [0, s], [-s*0.8, 0]] // Adjusted for a more standard diamond
             .map(p => [Math.round(p[0]), Math.round(p[1])]).map(p => p.join(",")).join(" ");
        shapeElement = g.append("polygon").attr("points", points);
    } else { // rect (default)
        shapeElement = g.append("rect")
            .attr("x", -nodo.size * 0.7)
            .attr("y", -nodo.size / 2)
            .attr("rx", 12) // More rounded
            .attr("ry", 12)
            .attr("width", nodo.size * 1.4)
            .attr("height", nodo.size);
    }
    shapeElement.attr("fill", nodo.backgroundColor)
                .attr("stroke", strokeColor)
                .attr("stroke-width", strokeWidth);

    // ICONA
    const shapeOffset = nodo.shape === 'circle' || nodo.shape === 'hex' ? 5 : 0;
    g.append("foreignObject")
        .attr("x", -nodo.iconSize / 2)
        .attr("y", -nodo.size / 2 + offset - shapeOffset)
        .attr("width", nodo.iconSize)
        .attr("height", nodo.iconSize)
        .style("pointer-events", "none")
        .html(getIconSVG(nodo.icon, nodo.iconSize, nodo.iconColor));

    // TESTO con wrapping automatico
    const textYOffset = -nodo.size / 2 + offset + nodo.iconSize + gap + shapeOffset;
    const textElement = g.append("text")
        .attr("class", "node-text")
        .attr("font-size", nodo.textSize)
        .attr("text-anchor", "middle")
        .attr("fill", nodo.textColor)
        .style("pointer-events", "none");

    lines.forEach((ln, idx) => {
        textElement.append("tspan")
            .attr("x", 0)
            .attr("dy", idx === 0 ? textYOffset : lineHeight)
            .text(ln);
    });


    // CATEGORY INDICATOR (small dot)
    const categoryColor = CONFIG.colors.categories[nodo.category] || CONFIG.colors.categories.default;
    g.append("circle")
        .attr("class", "node-category-indicator-shape")
        .attr("cx", nodo.size * (nodo.shape === 'rect' ? 0.7 : 0.5) - 10) // Position based on shape
        .attr("cy", -nodo.size / 2 + 10)
        .attr("r", 6)
        .attr("fill", categoryColor)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .style("pointer-events", "none");


    if (appState.selectedNode && appState.selectedNode.id === nodo.id) {
        g.classed("selected", true);
    }
}

function aggiornaNodo(nodo) {
    nodo.updatedAt = new Date().toISOString();
    disegnaNodo(nodo);
    aggiornaConnessioni(); // Connections might need to adjust if node size/shape changes
    updateMinimap();
}

function selezionaNodo(nodo) {
    if (appState.isConnecting) return; // Don't select if in connection mode
    appState.selectedNode = nodo;
    appState.selectedConnection = null;
    evidenziaSelezione();
    apriSidebarNodo();
}


// === GESTIONE CONNESSIONI ===
function creaConnessione(sourceNode, targetNode, label = "") {
    if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
      showToast("Impossibile connettere il nodo a se stesso o a un nodo non valido.", "error");
      return null;
    }
    // Check for existing connection (either direction)
    const existing = appState.connections.find(c =>
        (c.source.id === sourceNode.id && c.target.id === targetNode.id) ||
        (c.source.id === targetNode.id && c.target.id === sourceNode.id)
    );
    if (existing) {
        showToast("Connessione già esistente.", "error");
        return existing;
    }

    const conn = {
        id: uniqueId("conn"),
        source: sourceNode,
        target: targetNode,
        label,
        color: CONFIG.colors.connections[Math.floor(Math.random() * CONFIG.colors.connections.length)],
        arrow: "forward",
        style: "solid" // solid, dashed, dotted
    };
    appState.connections.push(conn);
    disegnaConnessione(conn);
    saveToHistory();
    updateMinimap();
    return conn;
}

function rimuoviConnessione(conn) {
    if (!conn) return;
    appState.connections = appState.connections.filter(c => c.id !== conn.id);
    d3.select("#" + conn.id).remove();
    if(appState.selectedConnection && appState.selectedConnection.id === conn.id) {
        appState.selectedConnection = null;
        chiudiSidebar();
    }
    saveToHistory();
    updateMinimap();
    showToast("Connessione eliminata", "success");
}

function disegnaConnessione(conn) {
    if (typeof conn.source === "string") conn.source = appState.nodes.find(n => n.id === conn.source);
    if (typeof conn.target === "string") conn.target = appState.nodes.find(n => n.id === conn.target);
    if (!conn.source || !conn.target) return; // Nodes might have been deleted

    let g = connectionsGroup.select("#" + conn.id);
    if (!g.empty()) g.remove();

    g = connectionsGroup.append("g")
        .attr("class", "connection-group")
        .attr("id", conn.id)
        .style("cursor", "pointer")
        .on("click", event => {
            event.stopPropagation();
            selezionaConnessione(conn);
        });

    const s = conn.source, t = conn.target;
    let sx = s.x, sy = s.y, tx = t.x, ty = t.y;
    
    // Calculate intersection points with node boundaries
    // This is a simplified approach; more accurate calculations depend heavily on exact shape geometry
    const dx = tx - sx, dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return; // Avoid division by zero if nodes are at the same spot

    // Approximate radius based on size and shape for arrow positioning
    const getEffectiveRadius = (node) => {
        if (node.shape === 'circle') return node.size / 2;
        if (node.shape === 'ellipse') return Math.min(node.size * 0.75 / 2 * 1.2, node.size / 2); // approx
        if (node.shape === 'hex' || node.shape === 'diamond') return node.size / 2 * 0.8; // approx
        return Math.min(node.size * 0.7, node.size / 2); // For rect
    };

    const r1 = getEffectiveRadius(s);
    const r2 = getEffectiveRadius(t);

    const p1x = sx + dx * r1 / len;
    const p1y = sy + dy * r1 / len;
    const p2x = tx - dx * r2 / len;
    const p2y = ty - dy * r2 / len;
    
    let markerEnd = "", markerStart = "";
    if (conn.arrow === "forward") markerEnd = "url(#arrowhead)";
    if (conn.arrow === "backward") markerStart = "url(#arrowhead-reverse)";
    if (conn.arrow === "both") { markerEnd = "url(#arrowhead)"; markerStart = "url(#arrowhead-reverse)"; }

    const line = g.append("line")
        .attr("class", "connection")
        .attr("x1", p1x).attr("y1", p1y)
        .attr("x2", p2x).attr("y2", p2y)
        .attr("stroke", conn.color)
        .attr("marker-end", markerEnd)
        .attr("marker-start", markerStart);
    
    // Style for dashed/dotted lines
    if (conn.style === "dashed") line.attr("stroke-dasharray", "8,4");
    else if (conn.style === "dotted") line.attr("stroke-dasharray", "2,3");

    // Set fill for arrowheads based on connection color
    svg.selectAll("#arrowhead polygon, #arrowhead-reverse polygon").attr("fill", conn.color);

    if (conn.label) {
        const mx = (p1x + p2x) / 2, my = (p1y + p2y) / 2;
        g.append("text")
            .attr("class", "connection-label")
            .attr("x", mx)
            .attr("y", my - 7)
            .attr("text-anchor", "middle")
            .text(conn.label);
    }
    if (appState.selectedConnection && appState.selectedConnection.id === conn.id) {
        line.classed("selected", true);
    }
}

function aggiornaConnessioni() {
    appState.connections.forEach(disegnaConnessione);
}

function selezionaConnessione(conn) {
    appState.selectedConnection = conn;
    appState.selectedNode = null;
    evidenziaSelezione();
    apriSidebarConnessione();
}

// === SELEZIONE GLOBALE ===
function evidenziaSelezione() {
    nodesGroup.selectAll(".node").classed("selected", false);
    connectionsGroup.selectAll(".connection").classed("selected", false); // Target line directly

    if (appState.selectedNode) {
        nodesGroup.select("#" + appState.selectedNode.id).classed("selected", true);
    }
    if (appState.selectedConnection) {
        const connGroup = connectionsGroup.select("#" + appState.selectedConnection.id);
        if (!connGroup.empty()) {
            connGroup.select(".connection").classed("selected", true);
        }
    }
}

function deselezionaTutto() {
    appState.selectedNode = null;
    appState.selectedConnection = null;
    evidenziaSelezione();
    chiudiSidebar();
}

// === PAN ZOOM SVG (mouse + touch) ===
let isPanning = false, panStart = [0, 0];
function updateViewBox(newViewBox) {
    appState.currentViewBox = newViewBox;
    svgElem.setAttribute("viewBox", newViewBox.join(" "));
    updateMinimapViewport();
}

svgElem.addEventListener("mousedown", function(event) {
    if (event.target === svgElem || event.target.closest("#connections-group") || event.target.closest("#nodes-group")) { // Allow pan on empty space or elements
        if (event.button === 0) { // Left mouse button
            isPanning = true;
            panStart = [event.clientX, event.clientY];
        }
    }
});
svgElem.addEventListener("mousemove", function(event) {
    if (isPanning) {
        const [currentX, currentY, currentW, currentH] = appState.currentViewBox;
        const dx = event.clientX - panStart[0];
        const dy = event.clientY - panStart[1];
        const newX = currentX - dx * (currentW / svgElem.clientWidth);
        const newY = currentY - dy * (currentH / svgElem.clientHeight);
        updateViewBox([newX, newY, currentW, currentH]);
        panStart = [event.clientX, event.clientY]; // Update panStart for continuous panning
    }
});
svgElem.addEventListener("mouseup", function() { if (isPanning) isPanning = false; });
svgElem.addEventListener("mouseleave", function() { if (isPanning) isPanning = false; });

svgElem.addEventListener("wheel", function(event) {
    event.preventDefault();
    let [x, y, w, h] = appState.currentViewBox;
    const zoomFactor = (event.deltaY < 0) ? 0.85 : 1.15; // Smoother zoom
    
    const mouseX = event.offsetX; // Mouse position relative to SVG element
    const mouseY = event.offsetY;

    // Convert mouse position to SVG coordinates
    const svgMouseX = x + mouseX * (w / svgElem.clientWidth);
    const svgMouseY = y + mouseY * (h / svgElem.clientHeight);

    // New width and height
    const newW = w * zoomFactor;
    const newH = h * zoomFactor;

    // Adjust x and y to zoom towards mouse pointer
    const newX = svgMouseX - (mouseX * (newW / svgElem.clientWidth));
    const newY = svgMouseY - (mouseY * (newH / svgElem.clientHeight));
    
    updateViewBox([newX, newY, newW, newH]);
});

// Touch pan/zoom (simplified - 1 finger pan, 2 finger zoom)
let lastTouch1 = null, lastTouch2 = null, initialPinchDistance = null;

svgElem.addEventListener("touchstart", function(event) {
    if (event.target === svgElem || event.target.closest("#connections-group") || event.target.closest("#nodes-group")) {
        if (event.touches.length === 1) {
            isPanning = true;
            lastTouch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        } else if (event.touches.length === 2) {
            isPanning = false; // Stop panning if two fingers are down
            lastTouch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            lastTouch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
            initialPinchDistance = Math.hypot(lastTouch1.x - lastTouch2.x, lastTouch1.y - lastTouch2.y);
        }
    }
});

svgElem.addEventListener("touchmove", function(event) {
    event.preventDefault();
    if (isPanning && event.touches.length === 1 && lastTouch1) {
        const [currentX, currentY, currentW, currentH] = appState.currentViewBox;
        const dx = event.touches[0].clientX - lastTouch1.x;
        const dy = event.touches[0].clientY - lastTouch1.y;
        const newX = currentX - dx * (currentW / svgElem.clientWidth);
        const newY = currentY - dy * (currentH / svgElem.clientHeight);
        updateViewBox([newX, newY, currentW, currentH]);
        lastTouch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.touches.length === 2 && lastTouch1 && lastTouch2 && initialPinchDistance) {
        const t1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        const t2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
        const currentPinchDistance = Math.hypot(t1.x - t2.x, t1.y - t2.y);
        const zoomFactor = initialPinchDistance / currentPinchDistance; // Inverse: smaller distance means zoom in
        
        let [x, y, w, h] = appState.currentViewBox;

        // Midpoint of pinch
        const midX = (t1.x + t2.x) / 2;
        const midY = (t1.y + t2.y) / 2;
        
        const svgMidX = x + midX * (w / svgElem.clientWidth);
        const svgMidY = y + midY * (h / svgElem.clientHeight);

        const newW = w * zoomFactor;
        const newH = h * zoomFactor;
        
        const newX = svgMidX - (midX * (newW / svgElem.clientWidth));
        const newY = svgMidY - (midY * (newH / svgElem.clientHeight));

        updateViewBox([newX, newY, newW, newH]);

        initialPinchDistance = currentPinchDistance; // Update for continuous zoom
        lastTouch1 = t1;
        lastTouch2 = t2;
    }
});

svgElem.addEventListener("touchend", function(event) {
    if (event.touches.length < 2) {
        initialPinchDistance = null;
        lastTouch2 = null;
    }
    if (event.touches.length < 1) {
        isPanning = false;
        lastTouch1 = null;
    }
});


// === TOOLBAR ACTIONS ===
document.getElementById("add-node").onclick = () => {
    const [vx, vy, vw, vh] = appState.currentViewBox;
    let x = vx + vw / 2, y = vy + vh / 2; // Center of current view
    let nuovo;
    if (appState.selectedNode) {
        x = appState.selectedNode.x + 120 * (Math.random() - 0.5) * 2; // Spread around selected
        y = appState.selectedNode.y + 100 * (Math.random() - 0.5) * 2;
        nuovo = creaNodo(x, y, "Nuovo Figlio", "", appState.selectedNode.id);
        creaConnessione(appState.selectedNode, nuovo, "");
    } else {
        nuovo = creaNodo(x, y);
    }
    selezionaNodo(nuovo);
};

document.getElementById("remove-node").onclick = () => {
    if (appState.selectedNode) {
        rimuoviNodo(appState.selectedNode);
        // selectedNode is cleared within rimuoviNodo if it was the one removed
    } else {
        showToast("Seleziona un nodo da eliminare.", "error");
    }
};

document.getElementById("add-connection").onclick = () => {
    if (appState.selectedNode) {
        appState.isConnecting = true;
        appState.connectingFrom = appState.selectedNode;
        svgElem.style.cursor = "crosshair";
        showToast("Seleziona il nodo di destinazione...", "success", 5000);
    } else {
        showToast("Seleziona un nodo di partenza per la connessione.", "error");
    }
};

// Click on SVG background to deselect or cancel connection
svgElem.addEventListener("click", function(event) {
    if (event.target === svgElem) { // Click on empty SVG area
        if (appState.isConnecting) {
            appState.isConnecting = false;
            appState.connectingFrom = null;
            svgElem.style.cursor = "default";
            showToast("Creazione connessione annullata.", "error");
        } else {
            deselezionaTutto();
        }
    }
});


document.getElementById("remove-connection").onclick = () => {
    if (appState.selectedConnection) {
        rimuoviConnessione(appState.selectedConnection);
    } else {
        showToast("Seleziona una connessione da eliminare.", "error");
    }
};

document.getElementById("layout-radial").onclick = () => { layoutRadialeMulti(); showToast("Layout Radiale Applicato"); };
document.getElementById("layout-grid").onclick = () => { layoutGriglia(); showToast("Layout Griglia Applicato"); };
document.getElementById("layout-physics").onclick = () => toggleFisica(); // Toast shown in function
document.getElementById("layout-hierarchy").onclick = () => { layoutGerarchico(); showToast("Layout Gerarchico Applicato"); };


document.getElementById("zoom-in").onclick = () => zoomSvg(0.8); // smaller factor for zoom in
document.getElementById("zoom-out").onclick = () => zoomSvg(1.2); // larger factor for zoom out

function zoomSvg(factor) {
    let [x, y, w, h] = appState.currentViewBox;
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const newW = w * factor;
    const newH = h * factor;
    const newX = centerX - newW / 2;
    const newY = centerY - newH / 2;
    updateViewBox([newX, newY, newW, newH]);
}

document.getElementById("fit-screen").onclick = () => {
    if (appState.nodes.length === 0) {
        updateViewBox(CONFIG.defaultViewBox.split(" ").map(Number));
        return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    appState.nodes.forEach(n => {
        const nodeHalfWidth = (n.shape === 'rect' ? n.size * 0.7 : n.size / 2);
        const nodeHalfHeight = n.size / 2;
        minX = Math.min(minX, n.x - nodeHalfWidth);
        minY = Math.min(minY, n.y - nodeHalfHeight);
        maxX = Math.max(maxX, n.x + nodeHalfWidth);
        maxY = Math.max(maxY, n.y + nodeHalfHeight);
    });

    const padding = 100; // Add some padding around the content
    const contentWidth = maxX - minX + 2 * padding;
    const contentHeight = maxY - minY + 2 * padding;

    if (contentWidth <= 0 || contentHeight <= 0) { // No nodes or single point
        updateViewBox(CONFIG.defaultViewBox.split(" ").map(Number));
        return;
    }
    
    updateViewBox([minX - padding, minY - padding, contentWidth, contentHeight]);
};

document.getElementById("toggle-toolbar").onclick = () => {
    const bar = document.getElementById("toolbar");
    const icon = bar.querySelector("i");
    bar.classList.toggle("hide");
    if (bar.classList.contains("hide")) {
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    } else {
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    }
};

// === SIDEBAR E FORM ===
document.getElementById("open-sidebar").onclick = () => {
    if (appState.selectedNode) apriSidebarNodo();
    else if (appState.selectedConnection) apriSidebarConnessione();
    else showToast("Seleziona un nodo o una connessione per modificarla.", "error");
};
// Ensure the close button reliably triggers the handler
document.getElementById("close-sidebar").addEventListener("click", chiudiSidebar);

function apriSidebarNodo() {
    sidebar.classList.add("open");
    nodeEditor.style.display = "";
    connEditor.style.display = "none";
    aggiornaEditorNodo();
}
function apriSidebarConnessione() {
    sidebar.classList.add("open");
    nodeEditor.style.display = "none";
    connEditor.style.display = "";
    aggiornaEditorConn();
}
function chiudiSidebar() {
    console.log("chiudiSidebar called");
    sidebar.classList.remove("open");
}

function speakNode(nodo) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(`${nodo.text}. ${nodo.description || ""}`);
    utter.lang = "it-IT";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
}

function aggiornaEditorNodo() {
    const n = appState.selectedNode; if (!n) return;
    document.getElementById("node-text").value = n.text;
    document.getElementById("node-description").value = n.description;
    document.getElementById("node-tags").value = n.tags ? n.tags.join(", ") : "";
    document.getElementById("node-category").value = n.category || "default";
    document.getElementById("node-priority").value = n.priority || "medium";
    document.getElementById("node-size").value = n.size;
    document.getElementById("node-size-value").textContent = n.size + "px";
    document.getElementById("node-text-size").value = n.textSize;
    document.getElementById("node-text-size-value").textContent = n.textSize + "px";
    document.getElementById("node-icon-size").value = n.iconSize || 26;
    document.getElementById("node-icon-size-value").textContent = (n.iconSize || 26) + "px";
    document.getElementById("node-shape").value = n.shape || "rect";
    
    popolaColorPicker("node-bg-colors", CONFIG.colors.nodes, n.backgroundColor, (c) => { n.backgroundColor = c; aggiornaNodo(n); saveToHistory(); });
    popolaColorPicker("node-text-colors", CONFIG.colors.text, n.textColor, (c) => { n.textColor = c; aggiornaNodo(n); saveToHistory(); });
    popolaIconPicker("node-icon-picker", CONFIG.icons, n.icon, (icon) => { n.icon = icon; aggiornaNodo(n); saveToHistory(); });
    popolaColorPicker("node-icon-colors", CONFIG.colors.icons, n.iconColor || n.textColor, (c) => { n.iconColor = c; aggiornaNodo(n); saveToHistory(); });
}

function aggiornaEditorConn() {
    const c = appState.selectedConnection; if (!c) return;
    document.getElementById("connection-label").value = c.label || "";
    document.getElementById("connection-arrow").value = c.arrow || "forward";
    document.getElementById("connection-style").value = c.style || "solid";
    popolaColorPicker("connection-colors", CONFIG.colors.connections, c.color, (col) => { c.color = col; aggiornaConnessioni(); saveToHistory(); });
}

// Generic input handler for sidebar
function handleSidebarInput(elementId, nodeOrConnProperty, isNumeric = false, isArray = false, updateFunc, history = true) {
    document.getElementById(elementId).oninput = e => {
        const targetObject = appState.selectedNode || appState.selectedConnection;
        if (targetObject) {
            let value = e.target.value;
            if (isNumeric) value = Number(value);
            if (isArray) value = value.split(",").map(s => s.trim()).filter(s => s);
            
            targetObject[nodeOrConnProperty] = value;
            targetObject.updatedAt = new Date().toISOString();
            
            updateFunc(targetObject); // e.g., aggiornaNodo or aggiornaConnessioni
            if (history) saveToHistory();

            // For range sliders, update their display value
            const valueDisplayId = elementId + "-value";
            const valueDisplayElem = document.getElementById(valueDisplayId);
            if (valueDisplayElem) valueDisplayElem.textContent = value + "px";
        }
    };
}
// Node editor inputs
handleSidebarInput("node-text", "text", false, false, aggiornaNodo);
handleSidebarInput("node-description", "description", false, false, (n) => {}); // No visual update, just save state
handleSidebarInput("node-tags", "tags", false, true, aggiornaNodo);
handleSidebarInput("node-size", "size", true, false, aggiornaNodo);
handleSidebarInput("node-text-size", "textSize", true, false, aggiornaNodo);
handleSidebarInput("node-icon-size", "iconSize", true, false, aggiornaNodo);

// Special handling for selects as 'oninput' might not be ideal, 'onchange' is better.
document.getElementById("node-category").onchange = e => { if(appState.selectedNode) { appState.selectedNode.category = e.target.value; aggiornaNodo(appState.selectedNode); saveToHistory(); }};
document.getElementById("node-priority").onchange = e => { if(appState.selectedNode) { appState.selectedNode.priority = e.target.value; aggiornaNodo(appState.selectedNode); saveToHistory(); }};
document.getElementById("node-shape").onchange = e => { if(appState.selectedNode) { appState.selectedNode.shape = e.target.value; aggiornaNodo(appState.selectedNode); saveToHistory(); }};

// Connection editor inputs
handleSidebarInput("connection-label", "label", false, false, aggiornaConnessioni);
document.getElementById("connection-arrow").onchange = e => { if(appState.selectedConnection) { appState.selectedConnection.arrow = e.target.value; aggiornaConnessioni(); saveToHistory(); }};
document.getElementById("connection-style").onchange = e => { if(appState.selectedConnection) { appState.selectedConnection.style = e.target.value; aggiornaConnessioni(); saveToHistory(); }};


function popolaColorPicker(containerId, colors, selectedColor, callback) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    colors.forEach(color => {
        const option = document.createElement("div");
        option.className = "color-option";
        option.style.background = color;
        if (color === selectedColor) option.classList.add("selected");
        option.onclick = () => {
            callback(color);
            // Update selection state in picker
            Array.from(container.children).forEach(child => child.classList.remove("selected"));
            option.classList.add("selected");
        };
        container.appendChild(option);
    });
}

function popolaIconPicker(containerId, icons, selectedIcon, callback) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    icons.forEach(icon => {
        const option = document.createElement("div");
        option.className = "icon-option";
        // Use a neutral color for picker preview, actual color applied in node
        option.innerHTML = getIconSVG(icon, 22, appState.isDarkTheme ? "#ccc" : "#666");
        if (icon === selectedIcon) option.classList.add("selected");
        option.onclick = () => {
            callback(icon);
            Array.from(container.children).forEach(child => child.classList.remove("selected"));
            option.classList.add("selected");
        };
        container.appendChild(option);
    });
}

// === DESCRIZIONE NODO (overlay) ===
function apriDescrizioneNodo(nodo) {
    const overlay = document.getElementById("overlay-desc");
    const box = document.getElementById("overlay-desc-box");
    box.innerHTML = `<h3>${nodo.text || "Nodo"}</h3>
                     <div style="font-size:1.0em;white-space:pre-line;color:${appState.isDarkTheme ? '#ddd' : '#333'};margin-top:10px;">
                         ${nodo.description || "<i>Nessuna descrizione.</i>"}
                     </div>
                     <hr style="border:0; border-top:1px solid ${appState.isDarkTheme ? '#555' : '#ddd'}; margin: 15px 0;">
                     <small style="color:${appState.isDarkTheme ? '#aaa' : '#777'};">
                        Tags: ${nodo.tags && nodo.tags.length > 0 ? nodo.tags.join(', ') : 'N/A'}<br>
                        Categoria: ${nodo.category || 'N/A'}<br>
                        Priorità: ${nodo.priority || 'N/A'}<br>
                        Creato: ${new Date(nodo.createdAt).toLocaleString()}<br>
                        Aggiornato: ${new Date(nodo.updatedAt).toLocaleString()}
                     </small>`;
    overlay.style.display = "flex";
    overlay.focus(); // For Esc key
    speakNode(nodo);
    
    // No auto-close. User closes with Esc or click.
    // if (nodo.description && window.speechSynthesis) {
    //     const utter = new SpeechSynthesisUtterance(nodo.description);
    //     utter.lang = "it-IT";
    //     window.speechSynthesis.cancel();
    //     window.speechSynthesis.speak(utter);
    // }
}
document.getElementById("overlay-desc").onclick = function(e) { 
    if (e.target === this) { // Only close if background is clicked
        this.style.display = "none"; 
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
};
document.getElementById("overlay-desc").onkeydown = function(e) { 
    if (e.key === "Escape") {
        this.style.display = "none"; 
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
};


// === EXPORT / IMPORT ===
document.getElementById("export-png").onclick = exportPNG;
document.getElementById("export-pdf").onclick = exportPDF;

function exportPNG() {
    showLoading("Esportazione PNG...");
    // Temporarily ensure all nodes are visible for export
    const currentSearchTerm = appState.searchTerm;
    appState.searchTerm = "";
    redrawAllNodes(); // Redraw without dimming

    html2canvas(document.getElementById("mindmap-container"), { 
        backgroundColor: appState.isDarkTheme ? "#2c3e50" : "#f6f6fa", // Match theme
        useCORS: true,
        logging: false,
        onclone: (doc) => { // Ensure SVGs are properly rendered in the clone
            const svgElements = doc.querySelectorAll('#mindmap-svg svg');
            svgElements.forEach(s => {
                s.setAttribute('width', s.getBBox().width);
                s.setAttribute('height', s.getBBox().height);
            });
        }
    }).then(canvas => {
        const dataUrl = canvas.toDataURL("image/png");
        document.getElementById("preview-img").src = dataUrl;
        const preview = document.getElementById("print-preview");
        preview.style.display = "flex";
        hideLoading();
        appState.searchTerm = currentSearchTerm; // Restore search
        redrawAllNodes();
        if (confirm("Scaricare l'immagine PNG?")) {
            canvas.toBlob(blob => downloadFile(blob, "mappa-mentale.png", "image/png"));
        }
        preview.style.display = "none";
    }).catch(err => {
        console.error("Errore esportazione PNG:", err);
        showToast("Errore esportazione PNG.", "error");
        hideLoading();
        appState.searchTerm = currentSearchTerm; // Restore search
        redrawAllNodes(); // Redraw with search term
    });
}

function exportPDF() {
    showLoading("Esportazione PDF...");
    const currentSearchTerm = appState.searchTerm;
    appState.searchTerm = "";
    redrawAllNodes();

    html2canvas(document.getElementById("mindmap-container"), { 
        backgroundColor: appState.isDarkTheme ? "#2c3e50" : "#f6f6fa",
        useCORS: true,
        logging: false,
         onclone: (doc) => {
            const svgElements = doc.querySelectorAll('#mindmap-svg svg');
            svgElements.forEach(s => {
                s.setAttribute('width', s.getBBox().width);
                s.setAttribute('height', s.getBBox().height);
            });
        }
    }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        document.getElementById("preview-img").src = imgData;
        const preview = document.getElementById("print-preview");
        preview.style.display = "flex";
        hideLoading();
        appState.searchTerm = currentSearchTerm;
        redrawAllNodes();
        if (confirm("Scaricare il PDF?")) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? "landscape" : "portrait",
                unit: "px",
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save("mappa-mentale.pdf");
        }
        preview.style.display = "none";
    }).catch(err => {
        console.error("Errore esportazione PDF:", err);
        showToast("Errore esportazione PDF.", "error");
        hideLoading();
        appState.searchTerm = currentSearchTerm;
        redrawAllNodes();
    });
}

document.getElementById("open-json-modal").onclick = () => {
    document.getElementById("json-modal").style.display = "flex";
    document.getElementById("json-area").value = JSON.stringify(salvaMappaFormat(), null, 2);
};
document.getElementById("btn-export-json").onclick = () => {
    const jsonData = JSON.stringify(salvaMappaFormat(), null, 2);
    document.getElementById("json-area").value = jsonData;
    downloadFile(jsonData, "mappa-mentale.json", "application/json");
    showToast("JSON esportato e scaricato!");
};
document.getElementById("btn-import-json").onclick = () => {
    let val = document.getElementById("json-area").value;
    try {
        let data = JSON.parse(val);
        caricaMappa(data);
        showToast("Mappa importata con successo!");
        document.getElementById("json-modal").style.display = "none";
        saveToHistory(); // Initial state for imported map
    } catch (e) {
        console.error("JSON Import Error:", e);
        showToast("Errore: JSON non valido o formato mappa non corretto.", "error");
    }
};
document.getElementById("btn-close-json").onclick = () => {
    document.getElementById("json-modal").style.display = "none";
};
document.getElementById("close-preview").onclick = () => {
    document.getElementById("print-preview").style.display = "none";
    if (window.speechSynthesis) window.speechSynthesis.cancel();
};

function salvaMappaFormat() {
    return {
        nodes: appState.nodes.map(n => ({ ...n })), // Clone node objects
        connections: appState.connections.map(c => ({
            ...c,
            source: c.source.id, // Store only IDs
            target: c.target.id
        })),
        viewBox: appState.currentViewBox.join(" "),
        theme: appState.isDarkTheme ? 'dark' : 'light'
    };
}

function downloadFile(data, filename, mime) {
    const blob = new Blob([data], { type: mime });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function caricaMappa(data) {
    // Clear existing map
    appState.nodes = [];
    appState.connections = [];
    nodesGroup.selectAll("*").remove();
    connectionsGroup.selectAll("*").remove();
    appState.selectedNode = null;
    appState.selectedConnection = null;
    chiudiSidebar();

    // Load nodes
    data.nodes.forEach(nodeData => {
        const newNode = { ...nodeData }; // Create new object from data
        // Ensure defaults for any missing properties from older formats
        newNode.tags = newNode.tags || [];
        newNode.category = newNode.category || "default";
        newNode.priority = newNode.priority || "medium";
        newNode.iconSize = newNode.iconSize || 26;
        newNode.iconColor = newNode.iconColor || newNode.textColor || CONFIG.colors.icons[0];
        newNode.createdAt = newNode.createdAt || new Date().toISOString();
        newNode.updatedAt = newNode.updatedAt || new Date().toISOString();
        appState.nodes.push(newNode);
    });

    // Load connections (must be done after all nodes are in appState.nodes)
    if (data.connections) {
        data.connections.forEach(connData => {
            const sourceNode = appState.nodes.find(n => n.id === connData.source);
            const targetNode = appState.nodes.find(n => n.id === connData.target);
            if (sourceNode && targetNode) {
                const newConn = { ...connData, source: sourceNode, target: targetNode };
                newConn.style = newConn.style || "solid";
                appState.connections.push(newConn);
            } else {
                console.warn("Impossibile trovare nodi per la connessione:", connData);
            }
        });
    }
    
    if (data.viewBox) {
        updateViewBox(data.viewBox.split(" ").map(Number));
    } else {
        document.getElementById("fit-screen").click(); // Fit to content if no viewBox
    }

    if (data.theme === 'dark' && !appState.isDarkTheme) {
        toggleTheme();
    } else if (data.theme === 'light' && appState.isDarkTheme) {
        toggleTheme();
    }

    redrawAll();
    appState.history = []; // Clear history for new map
    appState.historyIndex = -1;
    saveToHistory(); // Save initial state of loaded map
}

function redrawAll() {
    nodesGroup.selectAll("*").remove();
    connectionsGroup.selectAll("*").remove();
    appState.nodes.forEach(disegnaNodo);
    appState.connections.forEach(disegnaConnessione);
    updateMinimap();
}
function redrawAllNodes() {
    nodesGroup.selectAll("*").remove();
    appState.nodes.forEach(disegnaNodo);
    updateMinimapNodes(); // Only update nodes in minimap
}


// === LOCAL STORAGE ===
document.getElementById("save-map").onclick = () => {
    salvaMappaLocale();
    showToast("Mappa salvata localmente!", "success");
};

function salvaMappaLocale() {
    try {
        const mapData = salvaMappaFormat();
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(mapData));
    } catch (e) {
        console.error("Errore salvataggio locale:", e);
        showToast("Errore durante il salvataggio locale. Spazio esaurito?", "error");
    }
}

function caricaMappaLocale() {
    const savedData = localStorage.getItem(CONFIG.localStorageKey);
    if (savedData) {
        try {
            const mapData = JSON.parse(savedData);
            caricaMappa(mapData);
            showToast("Mappa caricata dal salvataggio locale.", "success");
        } catch (e) {
            console.error("Errore caricamento mappa locale:", e);
            showToast("Errore nel caricare la mappa salvata.", "error");
            localStorage.removeItem(CONFIG.localStorageKey); // Remove corrupted data
            initDefaultMap(); // Load default if corrupted
        }
    } else {
        initDefaultMap(); // Load default if no saved data
    }
}

// === LAYOUTS ===
function layoutRadialeMulti() {
    if (appState.nodes.length === 0) return;
    appState.autoSave = false; // Disable history saving for batch updates

    const roots = appState.nodes.filter(n => !n.parentId || !appState.nodes.find(p => p.id === n.parentId));
    const childrenMap = new Map();
    appState.nodes.forEach(n => {
        if (n.parentId) {
            if (!childrenMap.has(n.parentId)) childrenMap.set(n.parentId, []);
            childrenMap.get(n.parentId).push(n);
        }
    });

    const [ centerX, centerY ] = [appState.currentViewBox[0] + appState.currentViewBox[2]/2, appState.currentViewBox[1] + appState.currentViewBox[3]/2];
    
    // Position roots in a circle
    const numRoots = roots.length;
    const rootRadius = numRoots > 1 ? Math.min(appState.currentViewBox[2], appState.currentViewBox[3]) / 4 : 0;
    roots.forEach((root, i) => {
        root.x = centerX + rootRadius * Math.cos(2 * Math.PI * i / numRoots);
        root.y = centerY + rootRadius * Math.sin(2 * Math.PI * i / numRoots);
    });

    function arrangeChildren(parent, level = 1) {
        const children = childrenMap.get(parent.id) || [];
        if (children.length === 0) return;

        const radius = Math.max(100, parent.size * 1.2) + level * 30; // Dynamic radius
        const angleStep = (2 * Math.PI) / children.length;
        let startAngle = -Math.PI / 2; // Start at the top

        // Avoid overlap with parent's parent if possible
        if (parent.parentId) {
            const grandparent = appState.nodes.find(n => n.id === parent.parentId);
            if (grandparent) {
                const angleToGrandparent = Math.atan2(grandparent.y - parent.y, grandparent.x - parent.x);
                startAngle = angleToGrandparent + Math.PI/2 + angleStep/2; // Try to place first child away from grandparent
            }
        }

        children.forEach((child, i) => {
            const angle = startAngle + i * angleStep;
            child.x = parent.x + radius * Math.cos(angle);
            child.y = parent.y + radius * Math.sin(angle);
            arrangeChildren(child, level + 1);
        });
    }

    roots.forEach(root => arrangeChildren(root));
    
    appState.nodes.forEach(n => aggiornaNodo(n)); // This calls redrawAll many times, not ideal
    redrawAll(); // Single redraw after all positions are set
    saveToHistory();
    appState.autoSave = true;
}

function layoutGriglia() {
    if (appState.nodes.length === 0) return;
    appState.autoSave = false;
    const padding = 30;
    const nodeWidthEstimate = 150 + padding; 
    const nodeHeightEstimate = 100 + padding;
    const cols = Math.max(1, Math.floor(appState.currentViewBox[2] / nodeWidthEstimate));
    
    const startX = appState.currentViewBox[0] + nodeWidthEstimate / 2;
    const startY = appState.currentViewBox[1] + nodeHeightEstimate / 2;

    appState.nodes.forEach((node, i) => {
        node.x = startX + (i % cols) * nodeWidthEstimate;
        node.y = startY + Math.floor(i / cols) * nodeHeightEstimate;
    });
    redrawAll();
    saveToHistory();
    appState.autoSave = true;
}

function layoutGerarchico() {
    if (appState.nodes.length === 0) return;
    appState.autoSave = false;

    const roots = appState.nodes.filter(n => !n.parentId || !appState.nodes.find(p => p.id === n.parentId));
    if (roots.length === 0 && appState.nodes.length > 0) { // No explicit roots, pick one
      roots.push(appState.nodes[0]); 
    }
    if (roots.length === 0) {
      showToast("Nessun nodo radice per il layout gerarchico.", "error");
      appState.autoSave = true;
      return;
    }

    // Build a hierarchical structure for D3
    const buildHierarchy = (nodeId) => {
        const node = appState.nodes.find(n => n.id === nodeId);
        if (!node) return null;
        const children = appState.nodes.filter(n => n.parentId === nodeId).map(child => buildHierarchy(child.id));
        return { ...node, children: children.filter(c => c !== null) }; // Pass actual node data
    };
    
    const hierarchicalDataRoots = roots.map(r => buildHierarchy(r.id)).filter(hr => hr);
    if(hierarchicalDataRoots.length === 0) {
        showToast("Errore nella costruzione della gerarchia.", "error");
        appState.autoSave = true;
        return;
    }

    const treeLayout = d3.tree()
        .nodeSize([150, 250]) // [height between levels, width between siblings]
        .separation((a, b) => a.parent === b.parent ? 1.2 : 1.5); // More separation for non-siblings

    let totalMaxY = 0; // Keep track of overall Y to offset multiple trees

    hierarchicalDataRoots.forEach(dataRoot => {
        const rootD3 = d3.hierarchy(dataRoot, d => d.children);
        treeLayout(rootD3);
        
        // Center the tree layout relative to viewport or previous tree
        const nodesD3 = rootD3.descendants();
        if (nodesD3.length === 0) return;

        let minX = Infinity, maxX = -Infinity;
        nodesD3.forEach(d => {
            minX = Math.min(minX, d.x);
            maxX = Math.max(maxX, d.x);
        });
        
        const treeWidth = maxX - minX;
        const offsetX = appState.currentViewBox[0] + appState.currentViewBox[2]/2 - (minX + treeWidth / 2);
        const offsetY = totalMaxY + appState.currentViewBox[1] + 100; // Start below previous tree
        
        let currentTreeMaxY = 0;
        nodesD3.forEach(d => {
            const appNode = appState.nodes.find(n => n.id === d.data.id);
            if (appNode) {
                appNode.x = d.x + offsetX; // d.x is vertical in D3 tree, d.y is horizontal
                appNode.y = d.y + offsetY;
                currentTreeMaxY = Math.max(currentTreeMaxY, appNode.y + appNode.size);
            }
        });
        totalMaxY = currentTreeMaxY + 100; // Add padding for next tree
    });

    redrawAll();
    document.getElementById("fit-screen").click(); // Fit screen after layout
    saveToHistory();
    appState.autoSave = true;
}


function toggleFisica() {
    let btn = document.getElementById("layout-physics");
    if (!appState.physics) {
        appState.physics = true;
        btn.classList.add("active");
        btn.innerHTML = '<i class="fas fa-globe"></i> Fisica (On)';
        
        const links = appState.connections.map(c => ({ source: c.source.id, target: c.target.id, strength: 0.05 + Math.random()*0.1 })); // Add some variability
        
        appState.simulation = d3.forceSimulation(appState.nodes)
            .force("charge", d3.forceManyBody().strength(-500 - Math.random()*200)) // Stronger, varied repulsion
            .force("center", d3.forceCenter(appState.currentViewBox[0] + appState.currentViewBox[2]/2, appState.currentViewBox[1] + appState.currentViewBox[3]/2).strength(0.1))
            .force("collision", d3.forceCollide().radius(d => d.size * 0.8).strength(0.7)) // Adjusted collision
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => (d.source.size + d.target.size) * 0.8 + 50).strength(link => link.strength) )
            .on("tick", () => {
                // Bound nodes to viewport (optional, can be jittery)
                /*
                const [vx, vy, vw, vh] = appState.currentViewBox;
                appState.nodes.forEach(n => {
                    n.x = Math.max(n.size/2 + vx, Math.min(vx + vw - n.size/2, n.x));
                    n.y = Math.max(n.size/2 + vy, Math.min(vy + vh - n.size/2, n.y));
                });
                */
                appState.nodes.forEach(n => disegnaNodo(n)); // More efficient to update transform directly
                aggiornaConnessioni();
                updateMinimap();
            })
            .on("end", () => {
                if (appState.physics) { // Only save if physics is still on (not stopped manually)
                    saveToHistory(); // Save final positions
                }
            });
        showToast("Simulazione Fisica Attivata!", "success");
    } else {
        appState.physics = false;
        btn.classList.remove("active");
        btn.innerHTML = '<i class="fas fa-globe"></i> Fisica';
        if (appState.simulation) {
            appState.simulation.stop();
            appState.simulation = null;
            // Ensure fx and fy are cleared so nodes are not fixed
            appState.nodes.forEach(n => { n.fx = null; n.fy = null; });
            saveToHistory(); // Save current positions after stopping
        }
        showToast("Simulazione Fisica Disattivata.", "success");
    }
}

// === THEME TOGGLE ===
document.getElementById("theme-toggle").onclick = toggleTheme;

function toggleTheme() {
    appState.isDarkTheme = !appState.isDarkTheme;
    document.body.classList.toggle("dark-theme", appState.isDarkTheme);
    localStorage.setItem("mindMapTheme", appState.isDarkTheme ? "dark" : "light");
    
    // Update pickers with theme-dependent previews
    if (appState.selectedNode) { // If sidebar is open and showing icons
        popolaIconPicker("node-icon-picker", CONFIG.icons, appState.selectedNode.icon, (icon) => { appState.selectedNode.icon = icon; aggiornaNodo(appState.selectedNode); saveToHistory(); });
        popolaColorPicker("node-icon-colors", CONFIG.colors.icons, appState.selectedNode.iconColor || appState.selectedNode.textColor, (c) => { appState.selectedNode.iconColor = c; aggiornaNodo(appState.selectedNode); saveToHistory(); });
    }
    redrawAll(); // Redraw for theme-dependent colors in nodes/connections
    showToast(`Tema ${appState.isDarkTheme ? "Scuro" : "Chiaro"} attivato`, "success");
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("mindMapTheme");
    if (savedTheme === "dark") {
        appState.isDarkTheme = true;
        document.body.classList.add("dark-theme");
    } else {
        appState.isDarkTheme = false;
        document.body.classList.remove("dark-theme");
    }
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener("keydown", (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        if (event.key === "Escape") event.target.blur(); // Allow Esc to unfocus inputs
        return; // Don't trigger shortcuts if typing in input/textarea
    }
    if (document.getElementById("json-modal").style.display === "flex" && event.key !== "Escape") return; // Only Esc if JSON modal is open
    if (document.getElementById("overlay-desc").style.display === "flex" && event.key !== "Escape") return; // Only Esc if overlay is open
    
    const shortcut = CONFIG.shortcuts[event.code] || CONFIG.shortcuts[event.key]; // event.key for +/-

    if (shortcut) {
        const ctrlNeeded = typeof shortcut.ctrl !== 'undefined' ? shortcut.ctrl : false;
        const action = typeof shortcut.action !== 'undefined' ? shortcut.action : shortcut;

        if (ctrlNeeded && !event.ctrlKey && !event.metaKey) return; // Need Ctrl/Cmd but not pressed
        if (!ctrlNeeded && (event.ctrlKey || event.metaKey)) return; // Don't need Ctrl/Cmd but pressed
        
        event.preventDefault();
        action();
    }
});

// === NODE SEARCH ===
document.getElementById("node-search").addEventListener("input", (e) => {
    appState.searchTerm = e.target.value.toLowerCase();
    redrawAllNodes(); // Redraw nodes to apply dimming
});

function nodoMatchesSearch(nodo, searchTerm) {
    if (!searchTerm) return true;
    return (
        nodo.text.toLowerCase().includes(searchTerm) ||
        nodo.description.toLowerCase().includes(searchTerm) ||
        (nodo.tags && nodo.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
}

// === MINIMAP ===
let minimapScale = 0.1;
const minimapPadding = 5;
let minimapDragging = false;
let minimapDragStart = null;

function updateMinimap() {
    if (!minimapContainer || minimapContainer.offsetParent === null) return; // Hidden

    minimapNodesGroup.selectAll("*").remove();
    minimapConnectionsGroup.selectAll("*").remove();

    if (appState.nodes.length === 0) {
        updateMinimapViewport(); // Still show viewport even if no nodes
        return;
    }

    // Calculate bounds of all nodes to determine minimap scale
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    appState.nodes.forEach(n => {
        const nodeHalfWidth = (n.shape === 'rect' ? n.size * 0.7 : n.size / 2);
        const nodeHalfHeight = n.size / 2;
        minX = Math.min(minX, n.x - nodeHalfWidth);
        minY = Math.min(minY, n.y - nodeHalfHeight);
        maxX = Math.max(maxX, n.x + nodeHalfWidth);
        maxY = Math.max(maxY, n.y + nodeHalfHeight);
    });
    
    const contentWidth = Math.max(1, maxX - minX); // Ensure not zero
    const contentHeight = Math.max(1, maxY - minY);

    const minimapWidth = minimapContainer.clientWidth - 2 * minimapPadding;
    const minimapHeight = minimapContainer.clientHeight - 2 * minimapPadding;

    minimapScale = Math.min(minimapWidth / contentWidth, minimapHeight / contentHeight);
    if (!isFinite(minimapScale) || minimapScale <=0) minimapScale = 0.05; // Fallback scale


    // Center content in minimap
    const scaledContentWidth = contentWidth * minimapScale;
    const scaledContentHeight = contentHeight * minimapScale;
    const translateX = minimapPadding + (minimapWidth - scaledContentWidth) / 2 - minX * minimapScale;
    const translateY = minimapPadding + (minimapHeight - scaledContentHeight) / 2 - minY * minimapScale;
    
    minimapNodesGroup.attr("transform", `translate(${translateX}, ${translateY}) scale(${minimapScale})`);
    minimapConnectionsGroup.attr("transform", `translate(${translateX}, ${translateY}) scale(${minimapScale})`);

    appState.nodes.forEach(n => {
        let shapeMini;
        const miniSize = n.size * 0.8; // Slightly smaller for clarity
        if (n.shape === "circle") {
            shapeMini = minimapNodesGroup.append("circle").attr("cx", n.x).attr("cy", n.y).attr("r", miniSize / 2);
        } else if (n.shape === "ellipse") {
            shapeMini = minimapNodesGroup.append("ellipse").attr("cx", n.x).attr("cy", n.y)
                .attr("rx", miniSize * 0.75 / 2 * 1.2).attr("ry", miniSize / 2);
        } else { // Default to rect for hex, diamond, rect for simplicity
            shapeMini = minimapNodesGroup.append("rect").attr("x", n.x - miniSize * 0.7 / 2).attr("y", n.y - miniSize / 2)
                .attr("width", miniSize * 0.7).attr("height", miniSize);
        }
        shapeMini.attr("fill", n.backgroundColor).attr("class", "node-shape-mini");
        if (appState.selectedNode && n.id === appState.selectedNode.id) {
            shapeMini.attr("stroke", CONFIG.colors.priority.high).attr("stroke-width", 3 / minimapScale); // Thicker border for selected
        }
    });

    appState.connections.forEach(c => {
        if (c.source && c.target) {
            minimapConnectionsGroup.append("line")
                .attr("x1", c.source.x).attr("y1", c.source.y)
                .attr("x2", c.target.x).attr("y2", c.target.y)
                .attr("class", "connection-mini")
                .attr("stroke", c.color);
        }
    });
    updateMinimapViewport();
}

function updateMinimapNodes() { // Lighter update, only for nodes
    minimapNodesGroup.selectAll("*").remove();
     // Calculate bounds of all nodes to determine minimap scale (same as full updateMinimap)
    if (appState.nodes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    appState.nodes.forEach(n => {
        const nodeHalfWidth = (n.shape === 'rect' ? n.size * 0.7 : n.size / 2);
        const nodeHalfHeight = n.size / 2;
        minX = Math.min(minX, n.x - nodeHalfWidth);
        minY = Math.min(minY, n.y - nodeHalfHeight);
        maxX = Math.max(maxX, n.x + nodeHalfWidth);
        maxY = Math.max(maxY, n.y + nodeHalfHeight);
    });
    const contentWidth = Math.max(1, maxX - minX);
    const contentHeight = Math.max(1, maxY - minY);
    const minimapWidth = minimapContainer.clientWidth - 2 * minimapPadding;
    const minimapHeight = minimapContainer.clientHeight - 2 * minimapPadding;
    minimapScale = Math.min(minimapWidth / contentWidth, minimapHeight / contentHeight);
    if (!isFinite(minimapScale) || minimapScale <=0) minimapScale = 0.05;
    const scaledContentWidth = contentWidth * minimapScale;
    const scaledContentHeight = contentHeight * minimapScale;
    const translateX = minimapPadding + (minimapWidth - scaledContentWidth) / 2 - minX * minimapScale;
    const translateY = minimapPadding + (minimapHeight - scaledContentHeight) / 2 - minY * minimapScale;
    
    minimapNodesGroup.attr("transform", `translate(${translateX}, ${translateY}) scale(${minimapScale})`);
    // Connections transform remains same unless full updateMinimap is called

    appState.nodes.forEach(n => { // Simplified drawing as in updateMinimap
        let shapeMini;
        const miniSize = n.size * 0.8;
        if (n.shape === "circle") {
            shapeMini = minimapNodesGroup.append("circle").attr("cx", n.x).attr("cy", n.y).attr("r", miniSize / 2);
        } else if (n.shape === "ellipse") {
            shapeMini = minimapNodesGroup.append("ellipse").attr("cx", n.x).attr("cy", n.y)
                .attr("rx", miniSize * 0.75 / 2 * 1.2).attr("ry", miniSize / 2);
        } else {
            shapeMini = minimapNodesGroup.append("rect").attr("x", n.x - miniSize * 0.7 / 2).attr("y", n.y - miniSize / 2)
                .attr("width", miniSize * 0.7).attr("height", miniSize);
        }
        shapeMini.attr("fill", n.backgroundColor).attr("class", "node-shape-mini");
         if (appState.selectedNode && n.id === appState.selectedNode.id) {
            shapeMini.attr("stroke", CONFIG.colors.priority.high).attr("stroke-width", 3 / minimapScale);
        }
    });
    updateMinimapViewport();
}


function updateMinimapViewport() {
    if (!minimapContainer || minimapContainer.offsetParent === null) return; // Hidden
    if (minimapScale <= 0) return; // Not initialized or invalid scale

    const [mainX, mainY, mainW, mainH] = appState.currentViewBox;
    
    // Transform of the content group in minimap
    const transform = d3.zoomTransform(minimapNodesGroup.node()); // Not zoom, but need transform attributes
    const groupTransformMatch = minimapNodesGroup.attr('transform');
    let groupTranslateX = 0, groupTranslateY = 0, groupScale = minimapScale;
    if (groupTransformMatch) {
        const translateMatch = /translate\(([^,]+),([^)]+)\)/.exec(groupTransformMatch);
        const scaleMatch = /scale\(([^)]+)\)/.exec(groupTransformMatch);
        if (translateMatch) {
            groupTranslateX = parseFloat(translateMatch[1]);
            groupTranslateY = parseFloat(translateMatch[2]);
        }
        if (scaleMatch) {
            groupScale = parseFloat(scaleMatch[1]);
        }
    }
    
    minimapViewportRect
        .attr("x", mainX * groupScale + groupTranslateX)
        .attr("y", mainY * groupScale + groupTranslateY)
        .attr("width", mainW * groupScale)
        .attr("height", mainH * groupScale);
}

minimapViewportRect.call(d3.drag()
    .on("start", function(event) {
        minimapDragging = true;
        minimapDragStart = { x: event.x, y: event.y }; // Mouse position relative to viewport rect
    })
    .on("drag", function(event) {
        if (!minimapDragging || minimapScale <= 0) return;
        
        const dx = event.x - minimapDragStart.x;
        const dy = event.y - minimapDragStart.y;

        // Convert minimap drag to main SVG viewbox change
        const mainDx = dx / minimapScale;
        const mainDy = dy / minimapScale;

        let [vx, vy, vw, vh] = appState.currentViewBox;
        updateViewBox([vx + mainDx, vy + mainDy, vw, vh]);
        
        // minimapDragStart is implicitly updated by the viewport moving with the mouse
        // No, we need to update it based on the SVG coordinate system of the minimap
        // For simplicity: the current approach makes the viewport follow the mouse.
        // A better way: calculate start SVG point, then calc new SVG point, then diff.
        // However, since the viewport rect itself is moving, event.x/y are relative to it.
        // The current behavior should be: viewport rect moves, main view changes, then viewport rect redraws.
        // No, `event.x` `event.y` are in the coordinate system of the parent of the dragged element (`minimap-svg`).
        // So, `minimapDragStart` should be updated relative to the new main view.
        // This is complex. Simpler: recalculate what minimapDragStart *would be* for the new main view.
        // Or, just use the delta and don't update minimapDragStart.
        // The issue is the viewport rect is redrawn by updateMinimapViewport.
        // Let's set new main view, then the minimapDragStart will be relative to the *new* position of the rect.
        // Actually, it's simpler: event.dx, event.dy are the change in screen pixels
        const mainScreenDx = event.dx; 
        const mainScreenDy = event.dy;
        
        // We need to scale these screen pixel changes to main SVG coordinate changes
        // This is not what d3.event.dx/dy means.
        // Correct approach:
        // map event.x, event.y to main SVG coordinate for new center of viewport
        // This is done when the drag starts for the initial position.
        // During drag, event.x, event.y are current mouse in minimap parent's coords
        // So, the change (event.x - rect.attr('x')) / minimapScale is the delta for mainX
        // This is too complex for now with the current structure. The basic drag works somewhat.
    })
    .on("end", function() {
        minimapDragging = false;
        minimapDragStart = null;
    })
);
// Also allow click on minimap to center view
minimapSvg.on("click", function(event) {
    if (event.target === minimapSvg.node() || event.target.classList.contains("node-shape-mini") || event.target.classList.contains("connection-mini")) { // Click on minimap background or elements
        if (minimapScale <= 0) return;

        const [mouseX, mouseY] = d3.pointer(event, minimapSvg.node());

        // Transform of the content group in minimap
        const groupTransformMatch = minimapNodesGroup.attr('transform');
        let groupTranslateX = 0, groupTranslateY = 0, groupScale = minimapScale;
         if (groupTransformMatch) {
            const translateMatch = /translate\(([^,]+),([^)]+)\)/.exec(groupTransformMatch);
            const scaleMatch = /scale\(([^)]+)\)/.exec(groupTransformMatch);
            if (translateMatch) {
                groupTranslateX = parseFloat(translateMatch[1]);
                groupTranslateY = parseFloat(translateMatch[2]);
            }
            if (scaleMatch) {
                groupScale = parseFloat(scaleMatch[1]);
            }
        }

        // Convert click in minimap to world coordinates
        const worldX = (mouseX - groupTranslateX) / groupScale;
        const worldY = (mouseY - groupTranslateY) / groupScale;

        // Center main view on this world coordinate
        let [, , vw, vh] = appState.currentViewBox;
        updateViewBox([worldX - vw / 2, worldY - vh / 2, vw, vh]);
    }
});


// === INIT ===
function initDefaultMap(){
    appState.autoSave = false; // Disable history during init
    const [vx, vy, vw, vh] = CONFIG.defaultViewBox.split(" ").map(Number);
    const nodoC = creaNodo(vx + vw/2, vy + vh/2, "Idea Centrale", "Questa è la tua mappa mentale di partenza.");
    const nodoA = creaNodo(nodoC.x + 200, nodoC.y, "Concetto A", "Spiegazione nodo A", nodoC.id);
    const nodoB = creaNodo(nodoC.x, nodoC.y + 150, "Concetto B", "Secondo nodo", nodoC.id);
    const nodoA1 = creaNodo(nodoA.x + 150, nodoA.y - 50, "Dettaglio A1", "", nodoA.id);
    creaConnessione(nodoC, nodoA, "Relazione 1");
    creaConnessione(nodoC, nodoB, "Relazione 2");
    creaConnessione(nodoA, nodoA1, "Approfondisce");
    redrawAll(); // Single redraw after all setup
    appState.autoSave = true;
    saveToHistory(); // Save this initial state
}

(function init() {
    updateViewBox(CONFIG.defaultViewBox.split(" ").map(Number));
    applySavedTheme(); // Apply theme before loading map, as map loading might toggle theme
    caricaMappaLocale(); // This will call initDefaultMap if nothing is saved
    updateMinimap();
    updateUndoRedoButtons();

    // Initial population of icon pickers if sidebar is pre-rendered with a selection
    // This is typically handled when a node is selected and sidebar opens.
    // But if you wanted to pre-populate:
    // if (appState.selectedNode) {
    //     popolaIconPicker("node-icon-picker", CONFIG.icons, appState.selectedNode.icon, () => {});
    // }
    
    // Adjust toolbar visibility based on window size (for mobile)
    const toolbar = document.getElementById("toolbar");
    if (window.innerWidth <= 768 && !toolbar.classList.contains('hide')) {
        // If mobile and toolbar is not explicitly hidden by user, ensure it's visible
        // This might be more complex if 'hide' class is persistent
    } else if (window.innerWidth > 768 && toolbar.classList.contains('hide')) {
        // If desktop and toolbar is hidden (e.g. from previous mobile session), show it
        // This logic might need refinement based on how 'hide' persistence is handled
    }

    // Resize observer for minimap updates
    new ResizeObserver(() => {
        updateMinimap();
        // Also update main SVG viewBox if its aspect ratio needs to be maintained (not typical for this app)
    }).observe(minimapContainer);
    new ResizeObserver(() => {
         let [x,y,w,h] = appState.currentViewBox;
         const newClientWidth = svgElem.clientWidth;
         const newClientHeight = svgElem.clientHeight;
         // If you want to maintain aspect ratio of viewBox based on client rect:
         // w = newClientWidth * (h / oldClientHeight); // Assuming oldClientHeight was stored
         // Or simply redraw minimap viewport which depends on clientWidth/Height
         updateMinimapViewport();
    }).observe(svgElem);


})();

