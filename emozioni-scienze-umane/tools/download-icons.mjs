import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const icons=[
 ['happy','Gioia','1F603','#F9D55C'],['sad','Tristezza','1F622','#79B4E1'],
 ['angry','Rabbia','1F620','#F07872'],['scared','Paura','1F628','#B99AE5'],
 ['disgusted','Disgusto','1F922','#94C96F'],['surprised','Sorpresa','1F632','#FDB578'],
 ['calm','Calma','1F60C','#81D0C3'],['worried','Preoccupazione','1F61F','#D8A3B6'],
 ['bored','Noia','1F611','#B3BCC7'],['excited','Entusiasmo','1F929','#F2BA55'],
 ['nervous','Tensione','1F62C','#CEB5EA'],['embarrassed','Vergogna','1F633','#EDABC2'],
 ['proud','Orgoglio','1F60A','#DEAF79'],['disappointed','Delusione','1F61E','#A5B6DB']
];
async function get(url){const r=await fetch(url,{headers:{'User-Agent':'Education-emotions-library'}});if(!r.ok)throw Error(`${r.status}: ${url}`);return r.text();}
const release=JSON.parse(await get('https://api.github.com/repos/hfg-gmuend/openmoji/releases/latest')).tag_name;
const dir=path.join(root,'icons');await fs.mkdir(dir,{recursive:true});
const sources=[];
for(const [id,label,code,color] of icons){const url=`https://raw.githubusercontent.com/hfg-gmuend/openmoji/${release}/color/svg/${code}.svg`;let svg=await get(url);if(!svg.includes('<svg')||/<script|<foreignObject|https?:\/\//i.test(svg.replace(/xmlns="[^"]*"/g,'')))throw Error(`SVG inatteso: ${id}`);
 // Replace only face colours. Mouths, eyes, tears and other details keep their original colours.
 const replacements=svg.match(/#(?:fcea2b|f4aa41|b1cc33|b1cc34|92d3f5|61b2e4|f1b31c)\b/gi)||[];
 svg=svg.replace(/#(?:fcea2b|f4aa41|b1cc33|b1cc34|92d3f5|61b2e4|f1b31c)\b/gi,color);
 if(!replacements.length)throw Error(`Nessun colore del volto trovato: ${id}`);
 await fs.writeFile(path.join(dir,id+'.svg'),svg);
 sources.push({id,label,unicode:code,color,source:url,modified:'Face palette recoloured for this educational app.'});
}
await fs.writeFile(path.join(dir,'LICENSE-OpenMoji.txt'),await get(`https://raw.githubusercontent.com/hfg-gmuend/openmoji/${release}/LICENSE.txt`));
await fs.writeFile(path.join(dir,'SOURCES.json'),JSON.stringify({project:'OpenMoji',version:release,authors:'HfG Schwäbisch Gmünd, Benedikt Groß, Daniel Utz, students and contributors',website:'https://openmoji.org/',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',adaptationsLicense:'CC BY-SA 4.0',icons:sources},null,2)+'\n');
console.log({release,downloaded:sources.length});
