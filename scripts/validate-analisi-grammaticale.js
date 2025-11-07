#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'analisi-grammaticale-sentences.json');

function loadData(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Impossibile analizzare il file JSON ${filePath}: ${error.message}`);
  }
}

function ensureAnswerInChoices(step, context) {
  if (!Array.isArray(step.choices)) {
    return `Le scelte per ${context} non sono un array.`;
  }
  if (!step.choices.includes(step.answer)) {
    return `La risposta «${step.answer}» non è presente tra le opzioni per ${context}.`;
  }
  return null;
}

function findStep(token, predicate) {
  return token.steps.find(predicate);
}

function validateDataset(data) {
  const errors = [];

  data.forEach((sentence) => {
    const sentenceId = sentence.id || '<senza-id>';
    (sentence.tokens || []).forEach((token) => {
      const tokenId = token.id || '<senza-id>';
      const tokenLabel = token.label || tokenId;
      const baseContext = `la voce «${tokenLabel}» (frase ${sentenceId})`;

      (token.steps || []).forEach((step, index) => {
        const stepContext = `${baseContext}, domanda ${index + 1} (${step.question})`;
        const issue = ensureAnswerInChoices(step, stepContext);
        if (issue) {
          errors.push(issue);
        }
      });

      if (tokenLabel === 'è') {
        const personaStep = findStep(token, (step) => step.question && step.question.includes('Che persona e numero esprime'));
        if (!personaStep) {
          errors.push(`Manca la domanda sulla persona/numero per ${baseContext}.`);
        } else if (personaStep.answer !== '3ª singolare') {
          errors.push(`La persona/numero di «è» dovrebbe essere 3ª singolare ma è «${personaStep.answer}».`);
        }
      }

      if (tokenLabel === 'dici') {
        const partStep = findStep(token, (step) => step.question && step.question.includes('Qual è la parte del discorso'));
        if (!partStep) {
          errors.push(`Manca la domanda sulla parte del discorso per ${baseContext}.`);
        } else if (partStep.answer !== 'Verbo') {
          errors.push(`La parte del discorso di «dici» dovrebbe essere "Verbo" ma è «${partStep.answer}».`);
        }
      }

      if (tokenLabel === 'verde' || tokenLabel === 'marrone') {
        const numberStep = findStep(token, (step) => step.question && step.question.includes('numero di'));
        if (!numberStep) {
          errors.push(`Manca la domanda sul numero flesso per ${baseContext}.`);
        } else if (numberStep.answer !== 'Singolare') {
          errors.push(`Il numero di ${baseContext} dovrebbe essere "Singolare" ma è «${numberStep.answer}».`);
        }

        const variabilityStep = findStep(token, (step) => step.question && step.question.includes('Che caratteristica di numero'));
        if (!variabilityStep) {
          errors.push(`Manca la domanda sulla variabilità del numero per ${baseContext}.`);
        } else if (variabilityStep.answer !== 'Variabile') {
          errors.push(`La variabilità del numero per ${baseContext} dovrebbe essere "Variabile" ma è «${variabilityStep.answer}».`);
        }
      }
    });
  });

  return errors;
}

function main() {
  const data = loadData(dataPath);
  const errors = validateDataset(data);

  if (errors.length > 0) {
    console.error('Sono stati trovati errori nel dataset di analisi grammaticale:');
    errors.forEach((error) => {
      console.error(` - ${error}`);
    });
    process.exit(1);
  }

  console.log('Dataset di analisi grammaticale verificato con successo.');
}

main();
