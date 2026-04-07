/**
 * errorCodes.demo.js
 *
 * Demonstrates explicit error codes from StructuralValidator.
 * Run: node src/errorCodes.demo.js
 *
 * Shows { code, message } shape for every failure type.
 */

import { validateStructure, ERROR_CODES } from "./StructuralValidator.js";

const AGENTS = {
  textSummarizer:     { id: 1, name: "Text Summarizer",     lifecycle_state: "Active" },
  dataFormatter:      { id: 2, name: "Data Formatter",      lifecycle_state: "Active" },
  riskEvaluator:      { id: 3, name: "Risk Evaluator",      lifecycle_state: "Active" },
  docClassifier:      { id: 4, name: "Document Classifier", lifecycle_state: "Suspended" },
  workflowRouter:     { id: 6, name: "Workflow Router",     lifecycle_state: "Active" },
};

const CASES = [
  {
    label: "AGENT_SUSPENDED — suspended agent in chain",
    code: ERROR_CODES.AGENT_SUSPENDED,
    chain: [AGENTS.docClassifier],
  },
  {
    label: "DUPLICATE_AGENTS — same agent appears twice",
    code: ERROR_CODES.DUPLICATE_AGENTS,
    chain: [AGENTS.textSummarizer, AGENTS.textSummarizer],
  },
  {
    label: "INVALID_CHAIN — Risk Evaluator → Text Summarizer",
    code: ERROR_CODES.INVALID_CHAIN,
    chain: [AGENTS.riskEvaluator, AGENTS.textSummarizer],
  },
  {
    label: "INVALID_CHAIN — Workflow Router → Data Formatter",
    code: ERROR_CODES.INVALID_CHAIN,
    chain: [AGENTS.workflowRouter, AGENTS.dataFormatter],
  },
];

console.log("\nExported ERROR_CODES:\n", ERROR_CODES, "\n");

for (const { label, chain } of CASES) {
  const { valid, errors } = validateStructure(chain);
  console.log("─".repeat(55));
  console.log("Case:   ", label);
  console.log("valid:  ", valid);
  console.log("errors: ", JSON.stringify(errors, null, 2));
}

console.log("─".repeat(55));
