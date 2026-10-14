import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const elements=new Map();
const control=()=>({value:'',checked:false,innerText:'UN PASSO ALLA VOLTA. Ascolta la pagina. Continua. Testo di servizio.',classList:{toggle(){}},querySelectorAll:()=>[],addEventListener(){},setAttribute(){},focus(){}});
const spoken=[];let click;
const context=vm.createContext({console,localStorage:{getItem:()=>null},window:{speechSynthesis:{}},speechSynthesis:{cancel(){},getVoices:()=>[],speak:u=>spoken.push(u.text)},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},document:{getElementById(id){if(!elements.has(id))elements.set(id,control());return elements.get(id);},documentElement:{classList:{toggle(){}}},querySelectorAll:()=>[],addEventListener(type,fn){if(type==='click')click=fn;}}});
vm.runInContext(fs.readFileSync(new URL('../emotions-data.js',import.meta.url),'utf8'),context);
vm.runInContext(fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),context);
function readPage(){spoken.length=0;click({target:{closest:()=>({dataset:{action:'read'}})}});assert.equal(spoken.length,1);assert.doesNotMatch(spoken[0],/UN PASSO ALLA VOLTA|Ascolta la pagina|Testo di servizio|Continua|Tutti gli argomenti/);return spoken[0];}
assert.match(readPage(),/^Gioia\./);
for(let index=0;index<7;index++){
 vm.runInContext(`state.view='lesson';state.topic=${index}`,context);
 const reading=readPage();
 assert.ok(reading.includes(vm.runInContext('topics[state.topic].text',context)));
 assert.ok(!reading.includes(vm.runInContext('topics[state.topic].question',context)));
}
vm.runInContext("state.topic=4",context);assert.match(readPage(),/Corpo\. Il cuore batte forte/);assert.match(readPage(),/Azione\. Mi avvicino/);
spoken.length=0;click({target:{closest:()=>({dataset:{action:'read-lesson-question'}})}});assert.match(spoken[0],/Il cuore che batte forte riguarda/);assert.match(spoken[0],/il corpo\. il pensiero/);
vm.runInContext("state.view='recognize';startExercise()",context);assert.equal(readPage(),'Quale emozione rappresenta il volto? Osserva gli occhi e la bocca.');
vm.runInContext("state.view='situations';startExercise()",context);assert.ok(readPage().includes(vm.runInContext('state.exercise.questions[0].entry.text',context)));
vm.runInContext("state.view='feel';state.feel='pass'",context);assert.equal(readPage(),'Va bene passare. Puoi tornare quando vuoi.');
console.log('Lettura principale e domanda separata: verificati tutti gli argomenti e le sezioni.');
