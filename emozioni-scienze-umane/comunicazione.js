'use strict';
(() => {
  const images = 'images/comunicazione/';
  const paths = [
    {
      id: 'persone', title: 'Chi invia? Chi riceve?', subtitle: 'Persone e messaggi.', count: '4 domande',
      reminder: 'Chi invia è il mittente. Chi riceve è il destinatario.',
      questions: [
        {
          title: 'Chi invia il messaggio?', term: 'Mittente = chi invia.', image: 'scuola.jpg', alt: 'Un altoparlante nel corridoio di una scuola, con alcuni studenti.',
          scene: 'L’insegnante dice alla classe:', message: 'La classe va in aula magna.',
          question: 'Chi invia il messaggio?', options: ['L’insegnante', 'La classe'], answer: 0,
          hint: 'Pensa a chi sta parlando.', explanation: 'L’insegnante parla. È il mittente.'
        },
        {
          title: 'Chi riceve il messaggio?', term: 'Destinatario = chi riceve.', image: 'scuola.jpg', alt: 'Studenti nel corridoio di una scuola.',
          scene: 'L’insegnante dice alla classe:', message: 'La classe va in aula magna.',
          question: 'Chi ascolta questo messaggio?', options: ['L’insegnante', 'La classe'], answer: 1,
          hint: 'Pensa a chi ascolta le parole dell’insegnante.', explanation: 'La classe ascolta. È il destinatario.'
        },
        {
          title: 'Chi scrive?', term: 'Mittente = chi invia.', image: 'telefono.jpg', alt: 'Un telefono con un messaggio sul quaderno di storia.',
          scene: 'Un compagno ti scrive sul telefono:', message: 'Porta il quaderno di storia.',
          question: 'Chi invia questo messaggio?', options: ['Tu', 'Il compagno'], answer: 1,
          hint: 'Tu leggi. Il compagno scrive e invia.', explanation: 'Il compagno scrive. È il mittente.'
        },
        {
          title: 'Che cosa dice?', term: 'Messaggio = quello che viene comunicato.', image: 'telefono.jpg', alt: 'Un telefono con la scritta Porta il quaderno di storia.',
          scene: 'Un compagno ti scrive:', message: 'Porta il quaderno di storia.',
          question: 'Qual è il messaggio?', options: ['Porta il quaderno di storia.', 'Oggi andiamo al mare.'], answer: 0,
          hint: 'Rileggi le parole nel fumetto.', explanation: 'Il messaggio è: «Porta il quaderno di storia».'
        }
      ]
    },
    {
      id: 'mezzi', title: 'Come arriva il messaggio?', subtitle: 'Telefoni, parole e segni.', count: '4 domande',
      reminder: 'Canale = il mezzo. Codice = le parole o i segni usati. Referente = l’argomento.',
      questions: [
        {
          title: 'Il mezzo', term: 'Canale = il mezzo usato.', image: 'telefono.jpg', alt: 'Un messaggio sullo schermo di un telefono.',
          scene: 'Un compagno ti scrive sul telefono:', message: 'Porta il quaderno di storia.',
          question: 'Con quale mezzo arriva il messaggio?', options: ['Con un libro', 'Con il telefono'], answer: 1,
          hint: 'Guarda dove leggi il messaggio.', explanation: 'Il messaggio arriva con il telefono.'
        },
        {
          title: 'Parole e segni', term: 'Codice = parole o segni usati.', image: 'biblioteca.jpg', alt: 'Un cartello in biblioteca con una figura che chiede silenzio e parole scritte.',
          scene: 'In biblioteca c’è un cartello:', message: 'Silenzio, per favore.',
          question: 'Che cosa usa questo cartello?', options: ['Parole e un disegno', 'Solo suoni'], answer: 0,
          hint: 'Sul cartello puoi leggere e guardare una figura.', explanation: 'Il cartello usa parole scritte e un disegno.'
        },
        {
          title: 'La lingua', term: 'Anche la lingua è un codice.', image: 'scuola.jpg', alt: 'Un annuncio dall’altoparlante della scuola.',
          scene: 'Ascolta queste parole:', message: 'La classe va in aula magna.',
          question: 'Quale lingua usa il messaggio?', options: ['Italiano', 'Inglese'], answer: 0,
          hint: '«La classe va in aula magna» sono parole italiane.', explanation: 'Il messaggio usa la lingua italiana.'
        },
        {
          title: 'L’argomento', term: 'Referente = ciò di cui si parla.', image: 'telefono.jpg', alt: 'Un messaggio che chiede di portare un quaderno di storia.',
          scene: 'Un compagno ti scrive:', message: 'Porta il quaderno di storia.',
          question: 'Di che cosa parla il messaggio?', options: ['Di un treno', 'Del quaderno di storia'], answer: 1,
          hint: 'Cerca il nome dell’oggetto nel messaggio.', explanation: 'Il messaggio parla del quaderno di storia.'
        }
      ]
    },
    {
      id: 'scopi', title: 'A che cosa serve?', subtitle: 'Informare, esprimersi, chiedere, contattare.', count: '4 domande',
      reminder: 'Un messaggio può dare una notizia, dire come mi sento, chiedere un’azione o controllare il contatto.',
      questions: [
        {
          title: 'Una notizia', term: 'Informare = dare una notizia.', image: 'treno.jpg', alt: 'Un treno fermo in stazione.',
          scene: 'In stazione senti:', message: 'Il treno parte alle 8.',
          question: 'A che cosa serve questo messaggio?', options: ['A dire come mi sento', 'A dare una notizia'], answer: 1,
          hint: 'Il messaggio dice l’ora di partenza.', explanation: 'Dà una notizia sul treno. Serve a informare.', technical: 'Funzione referenziale'
        },
        {
          title: 'Come mi sento', term: 'Esprimersi = dire ciò che si prova.', image: 'gioia.jpg', alt: 'Una persona sorridente con le braccia alzate.',
          scene: 'Una ragazza dice:', message: 'Che gioia!',
          question: 'Che cosa comunica?', options: ['Come si sente', 'L’orario del treno'], answer: 0,
          hint: 'La gioia è un’emozione.', explanation: 'La ragazza esprime la sua gioia.', technical: 'Funzione emotiva'
        },
        {
          title: 'Una richiesta', term: 'Chiedere = invitare a fare qualcosa.', image: null, symbol: 'door',
          scene: 'Una persona ti dice:', message: 'Chiudi la porta, per favore.',
          question: 'Che cosa ti chiede?', options: ['Di chiudere la porta', 'Di dire come ti senti'], answer: 0,
          hint: 'Cerca l’azione: «chiudi».', explanation: 'Ti chiede di fare un’azione: chiudere la porta.', technical: 'Funzione conativa'
        },
        {
          title: 'Mi senti?', term: 'Contatto = riuscire a comunicare.', image: 'chiamata.jpg', alt: 'Un ragazzo parla al telefono.',
          scene: 'Al telefono dici:', message: 'Pronto, mi senti?',
          question: 'Che cosa vuoi sapere?', options: ['A che ora parte il treno', 'Se l’altra persona ti sente'], answer: 1,
          hint: 'Stai controllando se la telefonata funziona.', explanation: 'Controlli se l’altra persona ti sente.', technical: 'Funzione fàtica'
        }
      ]
    },
    {
      id: 'parole', title: 'Parole e rime', subtitle: 'Due piccoli esempi in più.', count: '2 domande',
      reminder: 'Possiamo spiegare una parola oppure scegliere parole che fanno rima.',
      questions: [
        {
          title: 'Spiegare una parola', term: 'Posso parlare delle parole.', image: 'dizionario.jpg', alt: 'Un dizionario di italiano.',
          scene: 'L’insegnante spiega:', message: '«Casa» è un nome.',
          question: 'Che cosa sta spiegando?', options: ['Una parola', 'Un orario'], answer: 0,
          hint: '«Casa» è la parola che viene spiegata.', explanation: 'Spiega una parola della lingua italiana.', technical: 'Funzione metalinguistica'
        },
        {
          title: 'Una rima', term: 'Una rima fa suonare simili alcune parole.', image: 'tramonto.jpg', alt: 'Un tramonto rosso sul mare.',
          scene: 'Leggi o ascolta:', message: 'Rosso di sera, bel tempo si spera.',
          question: 'Come suonano «sera» e «spera»?', options: ['Molto diverse', 'Simili: fanno rima'], answer: 1,
          hint: 'Ascolta la fine delle parole: séra, spéra.', explanation: '«Sera» e «spera» fanno rima. Qui osserviamo il suono delle parole.', technical: 'Funzione poetica'
        }
      ]
    }
  ];

  const main = document.getElementById('attivita');
  const state = {path: null, index: 0, answered: false, skipped: 0};
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  let reading = '';
  const currentPath = () => paths.find(path => path.id === state.path);
  const currentQuestion = () => currentPath()?.questions[state.index];

  function stopReading() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
  function speak(text) {
    const status = document.getElementById('stato-voce');
    if (!('speechSynthesis' in window)) { status.textContent = 'La lettura ad alta voce non è disponibile in questo browser.'; return; }
    stopReading();
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = 'it-IT'; voice.rate = .8;
    const italian = window.speechSynthesis.getVoices().find(item => item.lang.startsWith('it'));
    if (italian) voice.voice = italian;
    status.textContent = 'Lettura in corso.';
    voice.onend = () => { status.textContent = 'Lettura terminata.'; };
    window.speechSynthesis.speak(voice);
  }
  function heading(title, subtitle) {
    return `<div class="intro com-intro"><div><p class="eyebrow">UN PASSO ALLA VOLTA</p><h1>${title}</h1><p>${subtitle}</p></div><button class="listen" data-action="read">Ascolta la pagina</button></div>`;
  }
  function showMenu() {
    state.path = null;
    reading = 'La comunicazione. Scegli un piccolo percorso. Una domanda alla volta. Puoi ascoltare e riprovare con calma. ' + paths.map(path => `${path.title}. ${path.subtitle}`).join(' ');
    main.innerHTML = heading('La comunicazione', 'Scegli un piccolo percorso. Una domanda alla volta.') +
      `<p class="com-welcome">In ogni domanda trovi <strong>due risposte</strong>. Puoi ascoltare, chiedere un aiuto e riprovare.</p>
      <div class="com-paths">${paths.map((path, i) => `<button class="com-path" data-path="${path.id}"><span class="com-number" aria-hidden="true">${i+1}</span><span><strong>${path.title}</strong><span>${path.subtitle}</span><small>${path.count} · Inizia →</small></span></button>`).join('')}</div>
      <p class="mini">Non c’è un limite di tempo. Puoi fare una pausa quando vuoi.</p>`;
  }
  function door() {
    return `<svg class="com-door" viewBox="0 0 240 190" role="img" aria-label="Una porta da chiudere"><path d="M49 169V21h127v148" fill="#f4dfbc" stroke="#38515e" stroke-width="5"/><path d="M61 162V33h101v129" fill="#d7b37e" stroke="#38515e" stroke-width="4"/><circle cx="141" cy="102" r="6" fill="#38515e"/><path d="M214 82h-35m12-13-13 13 13 13" stroke="#205d59" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M27 169h176" stroke="#38515e" stroke-width="5"/></svg>`;
  }
  function renderQuestion() {
    const path = currentPath();
    if (state.index >= path.questions.length) { showEnd(); return; }
    const q = currentQuestion();
    state.answered = false;
    reading = `${q.title}. ${q.term} ${q.scene} ${q.message}`;
    main.innerHTML = heading(path.title, `Domanda ${state.index+1} di ${path.questions.length}`) +
      `<progress class="com-progress" value="${state.index}" max="${path.questions.length}" aria-label="Domande concluse">${state.index} di ${path.questions.length}</progress>
      <div class="card com-exercise">
        <section class="com-scene" aria-label="La situazione">${q.image ? `<img src="${images+q.image}" alt="${escape(q.alt)}" width="560" height="330">` : door()}
          <p>${q.scene}</p><blockquote>${q.message}</blockquote>
        </section>
        <section class="com-question" aria-labelledby="domanda">
          <p class="com-reminder">${q.term}</p>
          <h2 id="domanda" tabindex="-1">${q.question}</h2>
          <button class="listen" data-action="question">Ascolta domanda e risposte</button>
          <p class="choice-prompt"><strong>Scegli una risposta</strong><span>Premi una delle due opzioni.</span></p>
          <div class="answers" role="group" aria-labelledby="domanda">${q.options.map((option, i) => `<button class="answer" data-answer="${i}" aria-pressed="false"><span class="answer-marker" aria-hidden="true"></span><span class="answer-text">${option}</span><span class="answer-action" aria-hidden="true">Scegli →</span></button>`).join('')}</div>
          <div class="com-feedback" id="risposta" role="status" aria-live="polite" tabindex="-1"></div>
          <div class="tools com-help"><button data-action="hint">Un aiuto</button><button data-action="read-feedback" id="ascolta-risposta" hidden>Ascolta l’aiuto o la risposta</button></div>
          <button class="primary com-next" data-action="next" id="continua" hidden>${state.index === path.questions.length-1 ? 'Concludi il percorso →' : 'Continua →'}</button>
        </section>
      </div>
      <div class="com-bottom"><button data-action="menu">← Tutti i percorsi</button><button data-action="skip" id="passa">Passa questa domanda →</button></div>`;
  }
  function showEnd() {
    const path = currentPath();
    reading = `${path.title}. Hai esplorato questo percorso. Ricordiamo: ${path.reminder}`;
    main.innerHTML = heading('Percorso terminato', 'Puoi ripassare o scegliere un altro percorso.') +
      `<div class="card com-end"><h2>Ricordiamo insieme</h2><p>${path.reminder}</p>${state.skipped ? '<p class="mini">Hai lasciato alcune domande per un altro momento. Puoi tornarci quando vuoi.</p>' : ''}<div class="tools"><button class="primary" data-action="menu">Scegli un altro percorso</button><button data-action="restart">Riprova questo percorso</button></div></div>`;
  }
  function feedback(text, correct = false) {
    const box = document.getElementById('risposta');
    box.textContent = text;
    box.classList.toggle('is-correct', correct);
    document.getElementById('ascolta-risposta').hidden = false;
  }
  function choose(button) {
    if (state.answered) return;
    const q = currentQuestion();
    const correct = Number(button.dataset.answer) === q.answer;
    main.querySelectorAll('[data-answer]').forEach(other => {
      other.classList.remove('correct', 'retry'); other.setAttribute('aria-pressed', 'false');
      other.querySelector('.answer-marker').textContent = ''; other.querySelector('.answer-action').textContent = 'Scegli →';
    });
    button.setAttribute('aria-pressed', 'true');
    button.classList.add(correct ? 'correct' : 'retry');
    button.querySelector('.answer-marker').textContent = correct ? '✓' : '●';
    button.querySelector('.answer-action').textContent = correct ? 'Confermata' : 'Riprova';
    if (correct) {
      state.answered = true;
      feedback(`Sì! ${q.explanation}${q.technical ? ` A lezione: ${q.technical.toLowerCase()}.` : ''}`, true);
      main.querySelectorAll('[data-answer]').forEach(other => { other.disabled = true; });
      document.getElementById('continua').hidden = false;
      document.getElementById('passa').hidden = true;
      main.querySelector('[data-action="hint"]').disabled = true;
      document.getElementById('risposta').focus();
    } else {
      feedback(`Proviamo ancora con calma. ${q.hint}`);
    }
  }
  main.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.path) {
      stopReading(); state.path = button.dataset.path; state.index = 0; state.skipped = 0; renderQuestion(); main.focus(); return;
    }
    if (button.dataset.answer !== undefined) { stopReading(); choose(button); return; }
    const action = button.dataset.action;
    if (action === 'read') speak(reading);
    else if (action === 'question') { const q = currentQuestion(); speak([q.question, ...q.options].join('. ')); }
    else if (action === 'hint') { feedback(currentQuestion().hint, state.answered); }
    else if (action === 'read-feedback') speak(document.getElementById('risposta').textContent);
    else if (action === 'menu') { stopReading(); showMenu(); main.focus(); }
    else if (action === 'restart') { stopReading(); state.index = 0; state.skipped = 0; renderQuestion(); main.focus(); }
    else if ((action === 'next' && state.answered) || action === 'skip') {
      stopReading(); if (action === 'skip') state.skipped++; state.index++; renderQuestion(); main.focus();
    }
  });
  const large = document.getElementById('testo-grande');
  try { document.documentElement.classList.toggle('large', !!JSON.parse(localStorage.getItem('emozioni-in-volto-preferenze') || '{}').large); } catch {}
  large.setAttribute('aria-pressed', String(document.documentElement.classList.contains('large')));
  large.addEventListener('click', () => {
    const selected = document.documentElement.classList.toggle('large');
    large.setAttribute('aria-pressed', String(selected));
  });
  window.addEventListener('pagehide', stopReading);
  showMenu();
})();
