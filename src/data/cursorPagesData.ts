// src/data/cursorPagesData.ts
// Comprehensive architectural specifications and data models for Volume 3 (Semantic-ETL-Pipeline).

export interface CursorPageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // MULTI-MODAL INGESTION ARCHITECTURE"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Distributed Data Engineering & Multi-Modal ETL"
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

export const cursorPagesData: CursorPageContent[] = [
  // =========================================================================================
  // PAGE 01: GENESIS & MULTI-MODAL INGESTION ARCHITECTURE
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // MULTI-MODAL INGESTION ARCHITECTURE",
    title: "Multi-Modal Semantic Ingestion Architecture",
    subtitle: "Layout-Aware Document Parsing, Vision Language Modeling & Sub-Second Async Ingestion",
    discipline: "Distributed Data Engineering & Multi-Modal ETL",
    thesis: "Legacy enterprise ETL pipelines suffer from catastrophic structural and visual blindness—flattening markdown tables into unparseable noise and discarding diagram bytes. Semantic-ETL-Pipeline unifies layout-aware document extraction, LPU-accelerated Vision Language Models, and deterministic content hashing into an asynchronous, non-blocking ingestion engine.",
    overview:
      "Traditional PDF parsing relies on naive sequential text extraction, resulting in severed markdown tables, discarded architectural diagrams, and fragmented semantic context that degrades downstream dense vector retrieval.\n\n" +
      "Semantic-ETL-Pipeline operates as an enterprise microservice: client ingestion receives an immediate asynchronous HTTP 202 Accepted response with deterministic UUID job tracking, decoupling client ingestion from compute-heavy layout detection and VLM processing.",
    description:
      "### Failure Modes of Legacy Pipelines\n" +
      "Standard PDF-to-text engines extract text sequentially without spatial awareness, collapsing relational tables into unparseable single-column noise and discarding engineering schematics. Naive fixed character slicing (e.g., 1200-character windows) cuts across sentence boundaries and table syntax, severely corrupting dense vector embeddings.\n\n" +
      "### 6-Stage End-to-End Ingestion Lifecycle\n" +
      "Raw multi-modal PDFs traverse deep layout analysis via Docling v2 with RapidOCR (1.5x scale factor), asynchronous parallel VLM transcription (Qwen-27B on Groq LPUs), layout-aware semantic chunking (< 1500 chars), AI metadata synthesis, high-dimensional vectorization (Llama-Text-Embed-v2, 1024-d), and namespaced upserts to Pinecone Serverless.\n\n" +
      "### 5 Core Architectural Invariants\n" +
      "1. Sub-second non-blocking HTTP 202 ingestion with UUID tracking.\n" +
      "2. 100% layout and markdown table boundary preservation.\n" +
      "3. Multi-modal diagram and flowchart transcription via Vision Language Models.\n" +
      "4. Deterministic cryptographic MD5 content hashing for idempotent vector IDs.\n" +
      "5. Strict type-safe Pydantic JSON schema evolution.",
    highlights: [
      "Docling v2 layout engine with RapidOCR (1.5x scale) preserving markdown grid syntax",
      "Parallel Groq LPU Vision Language Modeling (Qwen-27B) converting schematics to technical text",
      "6-stage asynchronous ingestion pipeline decoupling client intake from heavy transformation workers",
      "Deterministic MD5 content hashing eliminating phantom duplicate vectors on pipeline retries"
    ],
    keyMetrics: [
      { label: "Boundary Preservation", value: "100.0%" },
      { label: "Table Fractures", value: "0 Fractures" },
      { label: "Async Ingestion", value: "HTTP 202" },
      { label: "Vector Dimensions", value: "1024-d Dense" }
    ]
  },

  // =========================================================================================
  // PAGE 02: PIPELINE TOPOLOGY & STREAM PROCESSING ARCHITECTURE
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "PIPELINE TOPOLOGY // CONCURRENCY & STREAM ARCHITECTURE",
    title: "Stream Processing & Concurrency Orchestration",
    subtitle: "FastAPI Microservices, Adaptive Backpressure, Redis JobStore & Dead-Letter Queues",
    discipline: "Distributed Systems & Stream Processing",
    thesis: "Heavy multi-modal document transformation creates volatile compute demands that quickly exhaust GPU/LPU resources if unbounded. By combining FastAPI async semaphores, pull-based token bucket backpressure, and deterministic namespace partitioning, the pipeline achieves 14.75x throughput scaling under heavy load with zero dropped requests.",
    overview:
      "The ingestion layer runs on FastAPI with Uvicorn worker pools, supporting both synchronous payloads for interactive evaluation and asynchronous job queues for enterprise production workloads.\n\n" +
      "Job state is tracked monotonically across its lifecycle (queued -> processing -> completed / failed) with real-time percentage metrics (0.0% to 100.0%) and ISO timestamps in a thread-safe JobStore.",
    description:
      "### Event Log & Partitioning Strategy\n" +
      "In distributed environments, document events are partitioned by Tenant ID and Document Namespace hashes (H(Namespace) mod N), ensuring that all chunks and vector payloads originating from a single document sequence are processed deterministically to preserve order.\n\n" +
      "### Adaptive Pull-Based Backpressure\n" +
      "Downstream LPU/GPU inference latency dynamically regulates consumer fetch batch sizes via token bucket rate limiters, preventing worker out-of-memory (OOM) crashes during high-volume document spikes.\n\n" +
      "### Fault Tolerance & Dead-Letter Queue (DLQ)\n" +
      "Malformed PDFs or documents exceeding extraction timeouts (300s) are routed to a dedicated DLQ with full error stack traces and file provenance. Multi-model fallback chains (GPT-OSS-120B -> GPT-OSS-20b -> Allam-2-7b -> Qwen-27B) with exponential backoff (3s, 6s, 9s) guarantee non-stop processing during API quota exhaustion.\n\n" +
      "### Bounded Concurrency Pools\n" +
      "Asynchronous semaphores (asyncio.Semaphore(CONCURRENCY_LIMIT=5)) throttle concurrent VLM and LLM inference calls, preventing HTTP 429 rate-limit errors while maximizing token throughput.",
    highlights: [
      "Monotonic JobLifecycle state engine tracking real-time 0.0%–100.0% progress metrics",
      "Adaptive pull-based backpressure and token-bucket rate limiting preventing worker OOM crashes",
      "Multi-model fallback chain with exponential backoff eliminating 429 rate-limit downtime",
      "Dead-Letter Queue (DLQ) isolation preserving stack traces and raw document provenance"
    ],
    keyMetrics: [
      { label: "Concurrency Scale", value: "14.75x Lift" },
      { label: "Endpoint Success", value: "100.0%" },
      { label: "Timeout Boundary", value: "300s Max" },
      { label: "Cache TTL", value: "1800s Auto" }
    ]
  },

  // =========================================================================================
  // PAGE 03: SEMANTIC ENRICHMENT & LAYOUT-AWARE CHUNKING
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "SEMANTIC ENRICHMENT // LAYOUT-AWARE CHUNKING & VLMs",
    title: "Semantic Boundary Chunking & AI Metadata Synthesis",
    subtitle: "Structural Breakpoint Grouping, Vision Transcriptions & Cryptographic Vector IDs",
    discipline: "Natural Language Processing & Multi-Modal AI",
    thesis: "Fixed-character window slicing breaks grammatical clauses and splits tabular rows across arbitrary boundaries. Grouping text by structural DOM elements and enforcing header breakpoint boundaries ensures that every chunk represents a coherent, self-contained semantic unit with rich contextual metadata.",
    overview:
      "Rather than slicing text by character counts (e.g., 1200 chars with 200 char overlaps), the layout-aware chunker groups elements by DOM types (Header, SectionTitle, TableItem, PictureItem).\n\n" +
      "Embedded diagrams and charts are extracted, Base64-encoded, and transcribed via Groq's Vision Language Model (Qwen-27B), converting visual topologies into dense technical summaries injected directly into the document stream.",
    description:
      "### Structural Breakpoint Chunker Algorithm\n" +
      "The chunker accumulates structured elements until reaching a 1200–1500 character ceiling. If a new Section Header is encountered and the current buffer exceeds 300 characters, a clean structural boundary is triggered immediately.\n\n" +
      "### Element Overlap Mechanics\n" +
      "When a chunk closes, the subsequent chunk inherits an overlap of N >= 1 complete structural elements rather than an arbitrary character slice, preventing sentence truncation and preserving hierarchical context across section boundaries.\n\n" +
      "### AI Metadata Synthesis Contract\n" +
      "Each semantic window is enriched via an asynchronous LLM call producing a strict Pydantic JSON payload containing a one-sentence contextual summary, high-impact technical keywords, a categorical taxonomy (DevOps, Financials, Architecture), and a parent document UUID pointer.\n\n" +
      "### High-Dimensional Vectorization & Deduplication\n" +
      "Chunks and visual descriptions are vectorized into a 1024-dimensional dense space using llama-text-embed-v2 with input_type='passage'. Alphanumeric domain tokens (>= 3 chars) are extracted to form a 50-token lexical search array. Unique deterministic vector IDs are generated via ID = MD5(ChunkContent_UTF8), guaranteeing idempotent re-indexing.",
    highlights: [
      "Structural breakpoint grouping eliminating table fracturing and sentence truncation",
      "Element-level sliding overlap (N >= 1 elements) preserving parent section context",
      "Strict Pydantic JSON schema generating summaries, taxonomy categories, and keyword sets",
      "Deterministic MD5 vector hashing guaranteeing zero duplicate embeddings across re-runs"
    ],
    keyMetrics: [
      { label: "Chunk Window", value: "1200–1500 chars" },
      { label: "Header Trigger", value: "> 300 chars" },
      { label: "Vector Dimensions", value: "1024-d Dense" },
      { label: "Deduplication", value: "MD5 Hashing" }
    ]
  },

  // =========================================================================================
  // PAGE 04: STORAGE TOPOLOGY & VECTOR INDEXING
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "STORAGE TOPOLOGY // HYBRID RETRIEVAL & RERANKING",
    title: "Hybrid Retrieval Engine & Cross-Encoder Reranking",
    subtitle: "Calibrated 70/30 Dense-Lexical Fusion, Pinecone Serverless & Groq LPU Scoring",
    discipline: "Information Retrieval & Vector Search",
    thesis: "Pure dense semantic vector retrieval frequently fails on exact alphanumeric technical identifiers, method names, and error codes, while pure lexical search misses conceptual synonyms. Combining cosine dense scoring (70%) with exact lexical token matching (30%) and a high-speed LPU Cross-Encoder reranker doubles top-1 precision.",
    overview:
      "The storage topology decouples short-lived binary scratchpads (with automated TTL cleanup) from the primary high-dimensional vector store (Pinecone Serverless with cosine distance metric).\n\n" +
      "Queries trigger parallel dense embedding generation and lexical tokenization, retrieving an expanded candidate pool (K_fetch = max(2 * top_k, 16)) for deep Cross-Encoder reranking.",
    description:
      "### Polyglot Storage Architecture\n" +
      "• Scratchpad Tier: Fast file I/O for raw multi-part uploads and extracted PNG image assets, managed with automatic 1800s TTL garbage collection.\n" +
      "• Vector & Metadata Tier: Pinecone Serverless index with 1024-d cosine distance metric partitioned across distinct namespaces (documents, engineering-docs, benchmark-eval-sandbox).\n\n" +
      "### Mathematical Formulation of Hybrid Scoring\n" +
      "Let query Q yield a 1024-d query vector v_Q and token set T_Q. For candidate chunk C_i with embedding v_C_i and token set T_C_i:\n" +
      "S_dense(Q, C_i) = (v_Q · v_C_i) / (|v_Q| |v_C_i|)\n" +
      "S_keyword(Q, C_i) = |T_Q ∩ T_C_i| / |T_Q|\n" +
      "S_hybrid(Q, C_i) = 0.70 * S_dense(Q, C_i) + 0.30 * S_keyword(Q, C_i)\n\n" +
      "### Groq LPU Cross-Encoder Reranking Architecture\n" +
      "Candidate hits are evaluated by a deep Cross-Encoder model (OpenAI/GPT-OSS-120B at temperature 0.0) running on Groq LPUs. The model inspects 800-character context snippets with summaries and categories, assigning granular relevance scores from 0.0 to 10.0 with a digit-decomposition regex fallback parser to guarantee clean ranking order.",
    highlights: [
      "Calibrated 70% dense semantic / 30% lexical token score fusion overcoming the acronym problem",
      "Decoupled polyglot storage combining TTL scratchpad caches with Pinecone serverless namespaces",
      "Groq LPU Cross-Encoder reranking evaluating full context snippets to double top-1 precision",
      "Digit-decomposition fallback parser preventing malformed JSON ranking drops"
    ],
    keyMetrics: [
      { label: "Dense Weight (\u03b1)", value: "0.70 (70%)" },
      { label: "Lexical Weight", value: "0.30 (30%)" },
      { label: "Fetch Expansion", value: "K = max(2k, 16)" },
      { label: "MRR Improvement", value: "+18.87% Lift" }
    ]
  },

  // =========================================================================================
  // PAGE 05: RETRIEVAL QUALITY, SYSTEM RESILIENCE & BENCHMARKS
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "BENCHMARKS // PRODUCTION METRICS & HARDENING",
    title: "Production Benchmarks, Resilience & Grounded RAG",
    subtitle: "Empirical Retrieval Lifts, Ingestion Latency Breakdowns & Zero-Hallucination Guardrails",
    discipline: "Evaluation Engineering & Production Reliability",
    thesis: "High-dimensional semantic pipelines must be validated through rigorous ablation studies. Empirical benchmarks demonstrate a +50.0% Recall@5 lift over naive baselines, 14.75x throughput scaling under concurrency, and zero table fractures across enterprise corpora.",
    overview:
      "The pipeline underwent comprehensive benchmarking in a production environment (Python 3.13, Windows 11, Groq LPUs, Pinecone Serverless).\n\n" +
      "The empirical evaluation validated ingestion latency breakdowns, retrieval ablation metrics (MRR, NDCG@5, Recall@K), concurrency stress curves, and anti-hallucination grounded RAG guardrails.",
    description:
      "### Executive Benchmark Summary\n" +
      "• Chunking Quality: 100% boundary preservation vs. 0.0% in naive baseline (24 table breaks eliminated).\n" +
      "• Retrieval Recall@5: Improved from 0.20 to 0.30 (+50.00% empirical lift).\n" +
      "• Retrieval NDCG@5: Improved from 0.1659 to 0.2084 (+25.62% lift).\n" +
      "• Hybrid + Rerank MRR: Reached 0.2476 MRR (+18.87% lift over dense-only baseline 0.2083).\n" +
      "• Concurrency Scalability: Scaled from 0.04 req/s (c=1) to 0.59 req/s (c=10), a 14.75x throughput increase with 100.0% endpoint success rate.\n\n" +
      "### Ingestion Latency Breakdown (Average: 198.89s)\n" +
      "1. PDF & Layout Extraction (Docling + RapidOCR): 57.31s (28.8%)\n" +
      "2. Multi-modal VLM Analysis (Qwen-27B on Groq): 63.60s (32.0%)\n" +
      "3. Semantic Window Chunking (Layout Engine): 0.001s (< 0.1%)\n" +
      "4. AI Metadata Enrichment (Groq GPT-OSS-120B): 70.32s (35.4%)\n" +
      "5. Dense Vector Embedding & Pinecone Upsert: 7.67s (3.9%)\n\n" +
      "### Grounded RAG Generation & Anti-Hallucination Guardrails\n" +
      "Retrieved context blocks are injected into the SemanticRAGAgent prompt with page provenance and category headers. Operating at low temperature (0.1), the LLM is constrained to answer exclusively from the injected context, stating data absence explicitly if missing and anchoring every claim with exact page citations.",
    highlights: [
      "Comprehensive ablation study proving Cross-Encoder reranking doubles top-1 retrieval precision",
      "Ingestion latency breakdown identifying VLM and metadata enrichment as primary compute centers",
      "Concurrency stress tests demonstrating 14.75x throughput scaling with 100% request success",
      "Grounded RAG agent enforcing strict page provenance citations to eliminate hallucination"
    ],
    keyMetrics: [
      { label: "Recall@5 Lift", value: "+50.00%" },
      { label: "NDCG@5 Lift", value: "+25.62%" },
      { label: "Throughput Scaling", value: "14.75x (c=10)" },
      { label: "Table Fractures", value: "0 (100% Intact)" }
    ]
  }
];

export const CURSOR_PAGES_DATA: Record<string, CursorPageContent> = {
  page01: cursorPagesData[0],
  page02: cursorPagesData[1],
  page03: cursorPagesData[2],
  page04: cursorPagesData[3],
  page05: cursorPagesData[4]
};
