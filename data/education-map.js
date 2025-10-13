window.DEFAULT_EDUCATION_MAP = {
  "viewBox": "0 0 1200 800",
  "theme": "light",
  "nodes": [
    {
      "id": "node-system",
      "x": 600,
      "y": 220,
      "text": "Sistema educativo italiano",
      "description": "Quadro complessivo del sistema di istruzione e formazione nazionale coordinato dal Ministero dell'Istruzione e del Merito e dal Ministero dell'Università e della Ricerca.",
      "category": "support",
      "backgroundColor": "#2c3e50",
      "textColor": "#ffffff",
      "icon": "fas fa-graduation-cap",
      "iconColor": "#ffffff",
      "iconSize": 36,
      "textSize": 18,
      "size": 140,
      "shape": "hex",
      "priority": "high",
      "tags": ["MIUR", "ordinamento", "istruzione"],
      "sources": [
        {
          "label": "Ministero dell'Istruzione e del Merito",
          "url": "https://www.miur.gov.it/istruzione",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-infanzia",
      "x": 360,
      "y": 120,
      "text": "Scuola dell'infanzia",
      "description": "Percorso educativo non obbligatorio rivolto ai bambini dai 3 ai 6 anni, focalizzato sullo sviluppo cognitivo, relazionale e motorio.",
      "category": "foundation",
      "backgroundColor": "#f6b93b",
      "textColor": "#2c3e50",
      "icon": "far fa-smile",
      "iconColor": "#2c3e50",
      "iconSize": 30,
      "textSize": 16,
      "size": 120,
      "shape": "ellipse",
      "priority": "medium",
      "tags": ["infanzia", "3-6 anni"],
      "sources": [
        {
          "label": "Scheda MIUR",
          "url": "https://www.miur.gov.it/scuola-dell-infanzia",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-primaria",
      "x": 360,
      "y": 230,
      "text": "Scuola primaria",
      "description": "Primo ciclo obbligatorio della durata di cinque anni, con obiettivi di alfabetizzazione e sviluppo delle competenze di base.",
      "category": "foundation",
      "backgroundColor": "#ffeaa7",
      "textColor": "#2c3e50",
      "icon": "fas fa-book",
      "iconColor": "#2c3e50",
      "iconSize": 30,
      "textSize": 16,
      "size": 120,
      "shape": "rect",
      "priority": "medium",
      "tags": ["primaria", "5 anni"],
      "sources": [
        {
          "label": "Percorso MIUR",
          "url": "https://www.miur.gov.it/scuola-primaria",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-secondaria1",
      "x": 360,
      "y": 340,
      "text": "Secondaria di I grado",
      "description": "Triennio obbligatorio per studenti dagli 11 ai 14 anni, concluso dall'esame di Stato che consente l'accesso al secondo ciclo.",
      "category": "lower_secondary",
      "backgroundColor": "#6ab04c",
      "textColor": "#ffffff",
      "icon": "fas fa-chalkboard-teacher",
      "iconColor": "#ffffff",
      "iconSize": 30,
      "textSize": 16,
      "size": 120,
      "shape": "rect",
      "priority": "medium",
      "tags": ["secondaria", "esame di Stato"],
      "sources": [
        {
          "label": "Approfondimento MIUR",
          "url": "https://www.miur.gov.it/scuola-secondaria-di-primo-grado",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-licei",
      "x": 600,
      "y": 380,
      "text": "Licei",
      "description": "Percorsi quinquennali orientati alla formazione culturale generale (classico, scientifico, linguistico, artistico, musicale, scienze umane).",
      "category": "upper_secondary",
      "backgroundColor": "#4c6ef5",
      "textColor": "#ffffff",
      "icon": "fas fa-lightbulb",
      "iconColor": "#ffffff",
      "iconSize": 32,
      "textSize": 16,
      "size": 120,
      "shape": "rect",
      "priority": "medium",
      "tags": ["licei", "secondo ciclo"],
      "sources": [
        {
          "label": "Portale Licei",
          "url": "https://www.miur.gov.it/licei",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-tecnici",
      "x": 780,
      "y": 330,
      "text": "Istituti tecnici",
      "description": "Percorsi quinquennali con indirizzi tecnologici ed economici che integrano teoria e laboratori per l'accesso al lavoro o all'università.",
      "category": "vocational",
      "backgroundColor": "#ff6b6b",
      "textColor": "#ffffff",
      "icon": "fas fa-cog",
      "iconColor": "#ffffff",
      "iconSize": 30,
      "textSize": 16,
      "size": 120,
      "shape": "rect",
      "priority": "medium",
      "tags": ["tecnici", "laboratori"],
      "sources": [
        {
          "label": "Scheda istituti tecnici",
          "url": "https://www.miur.gov.it/istituti-tecnici",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-professionali",
      "x": 780,
      "y": 410,
      "text": "Istituti professionali",
      "description": "Secondo ciclo orientato alle professioni nei settori servizi e industria-artigianato, con forte componente laboratoriale.",
      "category": "vocational",
      "backgroundColor": "#ff7675",
      "textColor": "#ffffff",
      "icon": "fas fa-briefcase",
      "iconColor": "#ffffff",
      "iconSize": 30,
      "textSize": 16,
      "size": 120,
      "shape": "rect",
      "priority": "medium",
      "tags": ["professionali", "laboratori"],
      "sources": [
        {
          "label": "Guida MIUR",
          "url": "https://www.miur.gov.it/istituti-professionali",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-iefp",
      "x": 940,
      "y": 260,
      "text": "IeFP regionale",
      "description": "Percorsi triennali e quadriennali di istruzione e formazione professionale gestiti dalle Regioni con qualifiche riconosciute a livello nazionale.",
      "category": "vocational",
      "backgroundColor": "#ff9f43",
      "textColor": "#2c3e50",
      "icon": "fas fa-clipboard",
      "iconColor": "#2c3e50",
      "iconSize": 28,
      "textSize": 15,
      "size": 115,
      "shape": "rect",
      "priority": "medium",
      "tags": ["IeFP", "qualifiche"],
      "sources": [
        {
          "label": "Approfondimento ANPAL",
          "url": "https://www.anpal.gov.it/istruzione-e-formazione-professionale",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-its",
      "x": 940,
      "y": 340,
      "text": "ITS Academy",
      "description": "Percorsi terziari professionalizzanti biennali o triennali in aree tecnologiche strategiche, con forte integrazione impresa-formazione.",
      "category": "higher",
      "backgroundColor": "#6c5ce7",
      "textColor": "#ffffff",
      "icon": "fas fa-atom",
      "iconColor": "#ffffff",
      "iconSize": 30,
      "textSize": 16,
      "size": 120,
      "shape": "rect",
      "priority": "high",
      "tags": ["ITS", "terziario professionalizzante"],
      "sources": [
        {
          "label": "Portale ITS Academy",
          "url": "https://www.miur.gov.it/its",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-universita",
      "x": 600,
      "y": 120,
      "text": "Università",
      "description": "Sistema universitario articolato in lauree triennali, magistrali e percorsi di dottorato, con 11 aree disciplinari e autonomia statutaria.",
      "category": "higher",
      "backgroundColor": "#2d98da",
      "textColor": "#ffffff",
      "icon": "fas fa-laptop-code",
      "iconColor": "#ffffff",
      "iconSize": 32,
      "textSize": 16,
      "size": 125,
      "shape": "rect",
      "priority": "high",
      "tags": ["università", "lauree", "dottorato"],
      "sources": [
        {
          "label": "Universitaly",
          "url": "https://www.universitaly.it/",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-afam",
      "x": 720,
      "y": 160,
      "text": "AFAM",
      "description": "Alta Formazione Artistica, Musicale e Coreutica: conservatori, accademie e istituti superiori per le arti applicate e lo spettacolo.",
      "category": "higher",
      "backgroundColor": "#9b59b6",
      "textColor": "#ffffff",
      "icon": "fas fa-palette",
      "iconColor": "#ffffff",
      "iconSize": 30,
      "textSize": 16,
      "size": 115,
      "shape": "ellipse",
      "priority": "medium",
      "tags": ["AFAM", "arti", "musica"],
      "sources": [
        {
          "label": "Portale AFAM",
          "url": "https://www.miur.gov.it/afam",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-apprendistato",
      "x": 940,
      "y": 430,
      "text": "Apprendistato",
      "description": "Contratti che combinano formazione e lavoro per giovani e adulti, articolati nelle tipologie per la qualifica, professionalizzante e di alta formazione e ricerca.",
      "category": "vocational",
      "backgroundColor": "#ff9f1a",
      "textColor": "#2c3e50",
      "icon": "fas fa-key",
      "iconColor": "#2c3e50",
      "iconSize": 28,
      "textSize": 15,
      "size": 115,
      "shape": "rect",
      "priority": "medium",
      "tags": ["apprendistato", "contratti"],
      "sources": [
        {
          "label": "Guida ANPAL",
          "url": "https://www.anpal.gov.it/apprendistato",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-formazione-continua",
      "x": 600,
      "y": 520,
      "text": "Formazione continua",
      "description": "Insieme di iniziative per l'aggiornamento delle competenze dei lavoratori e la riqualificazione professionale lungo tutto l'arco della vita.",
      "category": "adult",
      "backgroundColor": "#1dd1a1",
      "textColor": "#2c3e50",
      "icon": "fas fa-recycle",
      "iconColor": "#2c3e50",
      "iconSize": 28,
      "textSize": 15,
      "size": 120,
      "shape": "rect",
      "priority": "medium",
      "tags": ["lifelong learning", "aggiornamento"],
      "sources": [
        {
          "label": "Scheda ANPAL",
          "url": "https://www.anpal.gov.it/formazione-continua",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-diritto-studio",
      "x": 420,
      "y": 460,
      "text": "Diritto allo studio",
      "description": "Servizi e interventi (borse di studio, trasporti, mense, alloggi) per garantire accesso equo ai percorsi formativi su tutto il territorio.",
      "category": "support",
      "backgroundColor": "#74b9ff",
      "textColor": "#2c3e50",
      "icon": "fas fa-hands-helping",
      "iconColor": "#2c3e50",
      "iconSize": 28,
      "textSize": 15,
      "size": 115,
      "shape": "rect",
      "priority": "medium",
      "tags": ["borse di studio", "servizi"],
      "sources": [
        {
          "label": "Interventi MIUR",
          "url": "https://www.miur.gov.it/diritto-allo-studio",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "node-orientamento",
      "x": 780,
      "y": 500,
      "text": "Orientamento e tutorato",
      "description": "Azioni di supporto alle transizioni scolastiche e professionali con sportelli, tutor e piattaforme digitali di accompagnamento.",
      "category": "support",
      "backgroundColor": "#a29bfe",
      "textColor": "#2c3e50",
      "icon": "fas fa-project-diagram",
      "iconColor": "#2c3e50",
      "iconSize": 28,
      "textSize": 15,
      "size": 115,
      "shape": "rect",
      "priority": "medium",
      "tags": ["orientamento", "tutorato"],
      "sources": [
        {
          "label": "Piattaforme orientamento",
          "url": "https://www.miur.gov.it/orientamento",
          "icon": "fas fa-book"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "connections": [
    {"id": "conn-1", "source": "node-system", "target": "node-infanzia", "label": "Percorso 3-6 anni", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-2", "source": "node-system", "target": "node-primaria", "label": "Primo ciclo", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-3", "source": "node-primaria", "target": "node-secondaria1", "label": "Accesso automatico", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-4", "source": "node-secondaria1", "target": "node-licei", "label": "Scelta liceale", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-5", "source": "node-secondaria1", "target": "node-tecnici", "label": "Indirizzi tecnici", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-6", "source": "node-secondaria1", "target": "node-professionali", "label": "Indirizzi professionali", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-7", "source": "node-secondaria1", "target": "node-iefp", "label": "Canale regionale", "color": "#34495e", "arrow": "forward", "style": "dashed", "labelSize": 12},
    {"id": "conn-8", "source": "node-licei", "target": "node-universita", "label": "Accesso università", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-9", "source": "node-licei", "target": "node-afam", "label": "Indirizzi artistici", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-10", "source": "node-tecnici", "target": "node-universita", "label": "Prosecuzione accademica", "color": "#34495e", "arrow": "forward", "style": "dashed", "labelSize": 12},
    {"id": "conn-11", "source": "node-tecnici", "target": "node-its", "label": "Percorsi terziari", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-12", "source": "node-professionali", "target": "node-iefp", "label": "Qualifiche regionali", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-13", "source": "node-iefp", "target": "node-apprendistato", "label": "Titoli e lavoro", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-14", "source": "node-its", "target": "node-apprendistato", "label": "Inserimento nelle imprese", "color": "#34495e", "arrow": "forward", "style": "dashed", "labelSize": 12},
    {"id": "conn-15", "source": "node-apprendistato", "target": "node-formazione-continua", "label": "Aggiornamento competenze", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-16", "source": "node-universita", "target": "node-formazione-continua", "label": "Master e corsi", "color": "#34495e", "arrow": "forward", "style": "dashed", "labelSize": 12},
    {"id": "conn-17", "source": "node-system", "target": "node-diritto-studio", "label": "Supporti economici", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-18", "source": "node-system", "target": "node-orientamento", "label": "Servizi di accompagnamento", "color": "#34495e", "arrow": "forward", "style": "solid", "labelSize": 12},
    {"id": "conn-19", "source": "node-orientamento", "target": "node-licei", "label": "Supporto alla scelta", "color": "#34495e", "arrow": "forward", "style": "dashed", "labelSize": 12},
    {"id": "conn-20", "source": "node-orientamento", "target": "node-tecnici", "label": "Consulenza tecnica", "color": "#34495e", "arrow": "forward", "style": "dashed", "labelSize": 12}
  ]
};
