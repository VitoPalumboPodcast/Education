'use strict';
const printControls={set:document.getElementById('print-set'),style:document.getElementById('print-style'),layout:document.getElementById('print-layout'),labels:document.getElementById('print-labels'),cut:document.getElementById('print-cut')};
const printPages=document.getElementById('print-pages'),printStatus=document.getElementById('print-status'),printButton=document.getElementById('print-now');
const styleNames={icon:'Icone a colori',stylized:'Volti illustrati',realisticTeen:'Volti di ragazzi',realistic:'Volti di adulti'};
let generation=0;
try{const saved=JSON.parse(localStorage.getItem('emozioni-in-volto-preferenze')||'{}');if(styleNames[saved.style])printControls.style.value=saved.style;if(saved.level==='all')printControls.set.value='all';}catch{}
async function renderPrintPages(){
 const current=++generation;printButton.disabled=true;printStatus.classList.remove('error');printStatus.textContent='Caricamento delle immagini…';
 const items=printControls.set.value==='base'?EMOTIONS_DATA.filter(e=>e.base):EMOTIONS_DATA;
 const perPage=Number(printControls.layout.value),style=printControls.style.value;
 const count=Math.ceil(items.length/perPage);let pages='';
 for(let page=0;page<count;page++){
  const slice=items.slice(page*perPage,(page+1)*perPage);
  const cards=slice.map(e=>`<figure class="print-card"><img src="${style==='icon'?`icons/${e.id}.svg`:`images/${e.id}-${style}.jpg`}" alt="${printControls.labels.checked?e.name:'Volto da riconoscere'}" width="512" height="512">${printControls.labels.checked?`<figcaption>${e.name}</figcaption>`:''}</figure>`).join('');
  const blanks=Array.from({length:perPage-slice.length},()=>'<div class="print-card empty" aria-hidden="true"></div>').join('');
  const credits=style==='icon'?'<span>Icone: OpenMoji · HfG Schwäbisch Gmünd, Benedikt Groß, Daniel Utz e collaboratori.</span><span>Colori adattati · CC BY-SA 4.0 · openmoji.org · creativecommons.org/licenses/by-sa/4.0/</span>':'<span>Emozioni in volto · Scienze umane</span>';
  pages+=`<article class="a4-sheet layout-${perPage}${printControls.cut.checked?'':' no-cut'}" aria-label="Foglio A4 ${page+1} di ${count}"><div class="sheet-heading"><h2>Emozioni in volto</h2><span>${styleNames[style]} · ${page+1} / ${count}</span></div><div class="print-card-grid">${cards}${blanks}</div><div class="sheet-footer">${credits}</div></article>`;
 }
 printPages.innerHTML=pages;
 const images=[...printPages.querySelectorAll('img')];
 const results=await Promise.allSettled(images.map(img=>img.decode()));if(current!==generation)return;
 const failed=results.filter(r=>r.status==='rejected').length;
 if(failed){printStatus.classList.add('error');printStatus.textContent=`Non sono state caricate ${failed} immagini. Ricarica la pagina prima di stampare.`;return;}
 printStatus.textContent=`Pronti: ${items.length} carte su ${count} ${count===1?'foglio A4':'fogli A4'}.`;printButton.disabled=false;
}
Object.values(printControls).forEach(control=>control.addEventListener('change',renderPrintPages));
printButton.addEventListener('click',()=>{if(!printButton.disabled)window.print();});
renderPrintPages();
