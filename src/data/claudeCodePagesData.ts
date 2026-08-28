// src/data/claudeCodePagesData.ts
// Comprehensive architectural specifications and data models for Volume 5 (Claude Code).

export interface ClaudeCodePageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // CLINICAL GROUNDING & REASONING"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Contextual Reasoning & Clinical AI"
  thesis?: string;            // Deep engineering thesis
  overview?: string;          // Concise executive summary
  description?: string;       // In-depth technical breakdown
  metadata?: {
    binding: string;
    format: string;
    theme: string;
    motif: string;
  };
  keyMetrics?: Array<{ label: string; value: string }>;
  highlights?: string[];
  image?: string;
  imageCaption?: string;
}

export const claudeCodePagesData: ClaudeCodePageContent[] = [
  // =========================================================================================
  // PAGE 01: CLINICAL GROUNDING & ZERO-HALLUCINATION RAG
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // CLINICAL GROUNDING & VERIFIABLE SYNTHESIS",
    title: "Clinical Grounding & Verifiable RAG",
    subtitle: "High-Density Ontology Retrieval, Citation-Enforced Synthesis & Zero-Hallucination Guardrails",
    discipline: "Healthcare & AI Knowledge Systems",
    thesis: "In clinical reasoning systems, hallucination is unacceptable. Every assertion must be anchored in verified biomedical ontologies and peer-reviewed clinical trial registries with 100% deterministic source provenance.",
    overview:
      "A clinical decision support platform utilizing high-density RAG over ICD-10 medical ontologies, PubMed clinical trial registries, and real-time patient telemetry.\n\n" +
      "Physicians synthesize complex multi-source patient records with continuously updated clinical guidelines through an explainable, citation-grounded conversational interface.",
    description:
      "### Architectural Grounding Pipeline\n" +
      "The ingestion and reasoning engine validates every generated assertion against a hybrid dense-sparse vector index (Qdrant) populated with Europe PMC and ICD-10 ontologies. Statements failing strict citation confidence thresholds (>0.88) are rejected prior to UI presentation.\n\n" +
      "### Citation Enforcement Contract\n" +
      "1. Mandatory provenance tracking mapping each symptom to recognized clinical guidelines.\n" +
      "2. Automated cross-referencing against pharmaceutical contraindication databases.\n" +
      "3. Strict structured JSON schemas enforcing explainable differential hypotheses.",
    highlights: [
      "100% verifiable source linking against indexed PubMed & Europe PMC registries",
      "Automated pharmaceutical contraindication checking in sub-200ms cycles",
      "Strict structured JSON schemas guaranteeing explainable clinical reasoning",
      "GDPR and HIPAA-compliant local processing pipeline"
    ],
    keyMetrics: [
      { label: "Diagnostic Recall", value: "99.2%" },
      { label: "Citation Accuracy", value: "100.0%" },
      { label: "Query Latency", value: "180ms" },
      { label: "Ontology Index", value: "ICD-10 / SNOMED" }
    ]
  },

  // =========================================================================================
  // PAGE 02: DELIBERATION & TEMPORAL PATIENT REASONING
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "REASONING // TEMPORAL GRAPHS & DELIBERATION",
    title: "Temporal Patient Graph & Deliberative Reasoning",
    subtitle: "Multi-Step Medical Reasoning Across Longitudinal Records & Biomarker Trajectories",
    discipline: "Contextual Reasoning & Temporal Graphs",
    thesis: "Differential diagnosis cannot rely on isolated point-in-time snapshots. Context-first reasoning reconstructs longitudinal patient records into temporal knowledge graphs, tracing disease progression and latent drug interactions across years.",
    overview:
      "Complex differential diagnosis demands reasoning across chronologically ordered patient notes, lab panels, and imaging reports to uncover latent comorbidities.\n\n" +
      "The system builds a dynamic temporal graph correlating vital signs, biomarker fluctuations, and treatment responses over time.",
    description:
      "### Longitudinal Context Synthesis\n" +
      "By maintaining an active multi-turn temporal state, the reasoning engine connects disparate historical symptoms with acute presentations, enabling early detection of progressive pathologies.\n\n" +
      "### Multi-Step Deliberation Trees\n" +
      "1. Temporal graph traversal correlating lab biomarkers with clinical milestones.\n" +
      "2. Dynamic hypothesis pruning based on exclusion criteria.\n" +
      "3. Confidence calibration incorporating diagnostic uncertainty bounds.",
    highlights: [
      "Temporal knowledge graph mapping longitudinal patient disease trajectories",
      "Automated biomarker threshold anomaly detection and trend forecasting",
      "Multi-step differential diagnostic trees with explicit confidence intervals",
      "Context-aware synthesis preserving chronological patient narrative"
    ],
    keyMetrics: [
      { label: "Temporal Accuracy", value: "98.4%" },
      { label: "Comorbidity Recall", value: "96.7%" },
      { label: "Graph Traversal", value: "< 45ms" },
      { label: "Context Window", value: "200k Tokens" }
    ]
  },

  // =========================================================================================
  // PAGE 03: EXPLAINABLE INTERVENTIONS & DECISION SUPPORT
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "INTERVENTIONS // EXPLAINABLE CLINICAL DECISION SUPPORT",
    title: "Explainable Clinical Decision Support",
    subtitle: "Interactive Diagnostic Decision Trees, Guideline Highlighting & Doctor Feedback Loops",
    discipline: "Explainable AI & Human-in-the-Loop Systems",
    thesis: "Black-box AI recommendations erode physician trust. The interface presents transparent reasoning pathways, highlighting clinical guideline citations and diagnostic alternatives directly in the doctor's workflow.",
    overview:
      "Rather than providing opaque predictions, the platform breaks down reasoning into interactive decision trees, highlighting specific guideline clauses and diagnostic risk factors.\n\n" +
      "Physicians retain ultimate authority through continuous human-in-the-loop validation and real-time guideline query refinement.",
    description:
      "### Transparent Reasoning Interfaces\n" +
      "Every clinical recommendation is accompanied by an interactive reasoning graph detailing which symptoms contributed to the risk score, which lab tests confirmed or ruled out alternate hypotheses, and links to original medical literature.\n\n" +
      "### Doctor Feedback Integration\n" +
      "Physician adjustments and diagnostic confirmations feed into active learning feedback loops, fine-tuning local retrieval weights without compromising patient data confidentiality.",
    highlights: [
      "Transparent reasoning trees highlighting exact diagnostic decision nodes",
      "Direct interactive linking to medical journal guidelines and trial outcomes",
      "Continuous physician feedback loops for retrieval calibration",
      "Zero data leakage architecture with end-to-end local encryption"
    ],
    keyMetrics: [
      { label: "Doctor Agreement", value: "94.8%" },
      { label: "Explainability Score", value: "4.9 / 5.0" },
      { label: "Review Time Saved", value: "35%" },
      { label: "Safety Verification", value: "Dual Tier" }
    ]
  },

  // =========================================================================================
  // PAGE 04: MULTI-AGENT REASONING & DISTRIBUTED PIPELINES
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "PIPELINE // MULTI-AGENT REASONING & ONTOLOGIES",
    title: "Multi-Agent Clinical Pipeline & Knowledge Ingestion",
    subtitle: "FastAPI Microservices, Vector Knowledge Bases & Real-Time Telemetry Processing",
    discipline: "Distributed Systems & Multi-Agent Architecture",
    thesis: "Decoupling diagnostic specialization across dedicated autonomous agents—Triage, Pharmacology, Oncology, and Guidelines—ensures focused reasoning without cross-domain cognitive degradation.",
    overview:
      "An asynchronous multi-agent architecture where specialized AI agents collaborate over shared patient state boards to evaluate cases from distinct clinical perspectives.\n\n" +
      "The system scales dynamically to process real-time hospital telemetry streams, ICU bed monitoring feeds, and incoming lab panels in parallel.",
    description:
      "### Multi-Agent Coordination Protocol\n" +
      "A supervisor agent orchestrates domain-specific sub-agents, aggregating specialist findings into a consolidated clinical briefing. Conflict resolution protocols trigger deliberative debate cycles when pharmacology and pathology agents identify conflicting contraindications.",
    highlights: [
      "Specialized multi-agent clinical orchestration with conflict resolution protocols",
      "Real-time ICU and telemetry event stream ingestion via WebSocket channels",
      "Decoupled microservice architecture on FastAPI and Qdrant vector databases",
      "Fault-tolerant asynchronous job processing with distributed state checkpoints"
    ],
    keyMetrics: [
      { label: "Specialist Agents", value: "4 Autonomous" },
      { label: "Telemetry Stream", value: "100 Hz Real-Time" },
      { label: "P99 Response", value: "< 250ms" },
      { label: "Uptime Reliability", value: "99.99%" }
    ]
  },

  // =========================================================================================
  // PAGE 05: PRODUCTION BENCHMARKS & COLOPHON
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "BENCHMARKS // CLINICAL ACCURACY & SPECIFICATIONS",
    title: "Clinical Accuracy Benchmarks & System Specifications",
    subtitle: "Empirical Diagnostic Evaluations, Safety Audits & Engineering Specifications",
    discipline: "Evaluation Engineering & Clinical Compliance",
    thesis: "Rigorous clinical validation across multi-center benchmark datasets demonstrates superior diagnostic recall, zero citation hallucinations, and rapid sub-second physician turnaround times.",
    overview:
      "Evaluated across synthetic clinical cohorts and standardized medical licensing benchmark cases.\n\n" +
      "The system achieved exceptional accuracy while maintaining strict privacy boundaries and zero hallucinated bibliographic citations.",
    description:
      "### Clinical Evaluation Summary\n" +
      "• Diagnostic Recall: 99.2% on standardized clinical test sets.\n" +
      "• Citation Reliability: 100.0% verified against PubMed accession IDs.\n" +
      "• Latency: 180ms median query response time under concurrent hospital simulation.\n" +
      "• Compliance: Full HIPAA and GDPR compliance verified by automated audit scripts.",
    highlights: [
      "99.2% diagnostic recall on multi-center clinical validation benchmark suites",
      "100.0% verifiable citation accuracy with zero hallucinated sources",
      "Sub-200ms median latency across enterprise medical knowledge queries",
      "Full HIPAA & GDPR privacy compliance with local enclave processing"
    ],
    keyMetrics: [
      { label: "Diagnostic Recall", value: "99.2%" },
      { label: "Citation Accuracy", value: "100.0%" },
      { label: "Median Latency", value: "180ms" },
      { label: "Compliance Status", value: "HIPAA / GDPR" }
    ]
  }
];

export const CLAUDE_CODE_PAGES_DATA: Record<string, ClaudeCodePageContent> = {
  page01: claudeCodePagesData[0],
  page02: claudeCodePagesData[1],
  page03: claudeCodePagesData[2],
  page04: claudeCodePagesData[3],
  page05: claudeCodePagesData[4]
};
