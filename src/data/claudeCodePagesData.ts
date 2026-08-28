// src/data/claudeCodePagesData.ts
// Comprehensive architectural specifications and data models for Volume 5 (Cat Breed Recognition).

export interface ClaudeCodePageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // FINE-GRAINED VISION & BASELINES"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Vision & Deep Learning"
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
  // PAGE 01: GENESIS // FINE-GRAINED VISION & BASELINES
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // FINE-GRAINED VISION & BASELINES",
    title: "Fine-Grained Classification & Baselines",
    subtitle: "Oxford-IIIT Pet Dataset, ImageNet Transfer Learning & Multi-Model Benchmarking",
    discipline: "Vision & Deep Learning",
    thesis: "Cat breed identification is a fine-grained visual classification (FGVC) task where subtle variations in ear shape, fur texture, and facial structure must be distinguished across diverse poses, lighting, and backgrounds.",
    overview:
      "Fine-grained image classification of 12 cat breeds using transfer learning on the Oxford-IIIT Pet Dataset (2,400 images, 200 per breed, 80/20 train/val split).\n\n" +
      "We systematically benchmarked three ImageNet-1k pretrained CNN architectures under identical baseline training budgets to establish an empirical performance frontier.",
    description:
      "### Architectural Benchmark Setup\n" +
      "Three models were fine-tuned with AdamW (lr=1e-4, weight decay=1e-2, 5 epochs, batch size 32, cross-entropy loss, standard augmentation):\n\n" +
      "1. **ResNet50 (~25.6M params)**: Standard transfer learning reference baseline (90.00% val accuracy, 0.7911 loss, 149.8s/epoch).\n" +
      "2. **EfficientNet-B2 (~5.3M params)**: Compound scaled lightweight network matching ResNet50 accuracy (90.00%) with 5x fewer parameters and much lower loss (0.3041 vs 0.7911, 42.1s/epoch).\n" +
      "3. **ConvNeXt-tiny (~28.6M params)**: Modern ViT-inspired hybrid architecture achieving 95.42% accuracy and 0.1507 val loss (102.3s/epoch), outperforming both baselines by over 5%.\n\n" +
      "ConvNeXt-tiny borrows design choices from Vision Transformers (larger 7x7 depthwise kernels, inverted bottleneck, LayerNorm, GELU) while retaining CNN efficiency—a powerful combination for fine-grained feature discrimination.",
    highlights: [
      "Systematic comparison across ResNet50, EfficientNet-B2, and ConvNeXt-tiny",
      "ConvNeXt-tiny achieves 95.42% baseline accuracy, beating ResNet50 by +5.42%",
      "EfficientNet-B2 delivers 5x parameter efficiency with lower loss than ResNet50",
      "Standardized 80/20 train/val split on 2,400 Oxford-IIIT Pet images"
    ],
    keyMetrics: [
      { label: "ConvNeXt Acc", value: "95.42%" },
      { label: "ResNet50 Acc", value: "90.00%" },
      { label: "EfficientNet Acc", value: "90.00%" },
      { label: "Breeds", value: "12 Classes" }
    ]
  },

  // =========================================================================================
  // PAGE 02: OPTIMIZATION // REGULARIZATION & GENERALIZATION
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "OPTIMIZATION // REGULARIZATION & GENERALIZATION",
    title: "Iterative Regularization Pass",
    subtitle: "Overfitting Mitigation via Dropout, Label Smoothing & Random Erasing",
    discipline: "Deep Learning Optimization & Regularization",
    thesis: "On small, high-dimensional fine-grained datasets, regularization strategy dominates raw scale. Strong stochastic regularization prevents early memorization and forces deep invariant feature discovery.",
    overview:
      "Selected ConvNeXt-tiny as the primary architecture and engineered an iterative improvement pass focused on reducing overfitting and enhancing real-world generalization across image variability.\n\n" +
      "Incorporated aggressive regularization and augmented training schedules to push classification accuracy beyond the 96% boundary.",
    description:
      "### Regularization Enhancements\n" +
      "• **Weight Decay:** Scaled from 1e-2 → 5e-2 for tighter kernel norm bounding.\n" +
      "• **Dropout & Head Tuning:** Injected dropout (0.4) prior to the 12-class linear classifier.\n" +
      "• **Label Smoothing:** Applied ε=0.1 label smoothing to prevent overconfident target distribution fitting.\n" +
      "• **Data Augmentation:** Expanded rotation, zoom, color jitter, and injected Random Erasing (p=0.2).\n" +
      "• **Extended Training:** Doubled budget to 10 epochs.\n\n" +
      "### Metric Leap\n" +
      "Validation accuracy climbed from 95.42% to **96.67%**, weighted F1 reached **0.9666**, Precision reached **0.9685**, and Recall reached **0.9667**.\n\n" +
      "The validation loss increased (0.15 → 0.65) despite better accuracy—an expected characteristic of label smoothing, which softens target distributions so even confident correct predictions carry non-zero loss.",
    highlights: [
      "Validation accuracy elevated to 96.67% with 0.9666 weighted F1",
      "Label smoothing (0.1) softens overconfident logit distributions",
      "Random erasing (p=0.2) forces spatial occlusive robustness",
      "Dropout (0.4) + weight decay (5e-2) eliminates validation overfitting"
    ],
    keyMetrics: [
      { label: "Val Accuracy", value: "96.67%" },
      { label: "F1 (Weighted)", value: "0.9666" },
      { label: "Precision", value: "0.9685" },
      { label: "Recall", value: "0.9667" }
    ]
  },

  // =========================================================================================
  // PAGE 03: EXPLAINABILITY // GRAD-CAM SPATIAL VISUALIZATION
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "EXPLAINABILITY // GRAD-CAM SPATIAL VISUALIZATION",
    title: "Grad-CAM Explainability & Attribution",
    subtitle: "Verifying Morphological Attention & Eliminating Spurious Correlations",
    discipline: "Explainable AI (XAI) & Interpretability",
    thesis: "Black-box classification in fine-grained vision risks learning spurious background or pose shortcuts. Gradient-weighted Class Activation Mapping (Grad-CAM) proves the network grounds its decisions on feline facial morphology.",
    overview:
      "We integrated Grad-CAM heatmaps into the inference pipeline, generating spatial activation maps that highlight the exact image regions responsible for each breed prediction.\n\n" +
      "This provides visual explainability for veterinary triage, shelter intake labeling, and curious pet owners.",
    description:
      "### Spatial Attention Verification\n" +
      "Grad-CAM heatmaps consistently localize over the head, muzzle, and ear geometry—the ground-truth morphological markers for feline breed differentiation.\n\n" +
      "### Error Topology & Diffuse Activations\n" +
      "In the rare misclassified instances, activation heatmaps noticeably diffuse away from facial centers toward body silhouettes and backgrounds, directly correlating with lower softmax confidence.",
    highlights: [
      "Consistent facial and ear region localization for correct classifications",
      "Visual proof that background and pose artifacts are ignored by the model",
      "Diffuse activation topology directly flags low-confidence predictions",
      "Inference confidence scores paired with intuitive visual heatmap overlays"
    ],
    keyMetrics: [
      { label: "Facial Focus", value: "> 95%" },
      { label: "Explainability", value: "Grad-CAM" },
      { label: "Heatmap Resolution", value: "LayerNorm Target" },
      { label: "Confidence Metric", value: "Softmax + CAM" }
    ]
  },

  // =========================================================================================
  // PAGE 04: ANALYSIS // ERROR TOPOLOGY & TAKEAWAYS
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "ANALYSIS // ERROR TOPOLOGY & TAKEAWAYS",
    title: "Confusion Topology & Architectural Insights",
    subtitle: "Morphological Boundary Analysis & The Primacy of Architectural Design",
    discipline: "Error Analysis & Computer Vision Takeaways",
    thesis: "Fine-grained error topologies reflect true biological taxonomy. Persistent confusion between visually near-identical breeds demonstrates that model limits mirror human veterinary discernment.",
    overview:
      "Detailed confusion matrix analysis across all 12 breeds revealed near-clean diagonal separation, with specific insights into morphological ambiguities and training dynamics.\n\n" +
      "The results validate that architectural design and targeted regularization trump raw parameter scaling on specialized datasets.",
    description:
      "### The Ragdoll vs. Birman Boundary\n" +
      "**Ragdoll vs. Birman** remained the one persistent confusion pair across all three baseline architectures and the improved model. Because both breeds share color-point coats, sapphire eyes, and semi-longhair morphology, this confusion reflects genuine visual overlap rather than model deficiency.\n\n" +
      "### Core Engineering Insights\n" +
      "1. **Architecture over Parameter Scale:** ConvNeXt-tiny (28.6M params) beat ResNet50 (25.6M params) by +5.42% accuracy under identical budgets due to 7x7 depthwise convolutions and LayerNorm.\n" +
      "2. **Regularization Drives Progress:** Strong regularization in pass 2 provided the final accuracy boost without requiring extra dataset collection.\n" +
      "3. **Loss Comparison Nuance:** Label smoothing increased nominal cross-entropy loss (0.15 → 0.65) while measurably improving classification accuracy and calibration.",
    highlights: [
      "Near-clean diagonal confusion matrix across 12 distinct feline breeds",
      "Ragdoll vs. Birman identified as universal biological ambiguity point",
      "ConvNeXt-tiny ViT hybrid outperforms standard residual CNNs",
      "Label smoothing properly calibrated target distributions"
    ],
    keyMetrics: [
      { label: "Breeds Analyzed", value: "12 Distinct" },
      { label: "Accuracy Advantage", value: "+5.42% vs ResNet" },
      { label: "Training Epochs", value: "10 Epochs" },
      { label: "Batch Size", value: "32 Images" }
    ]
  },

  // =========================================================================================
  // PAGE 05: SPECIFICATIONS // BENCHMARK MATRIX & TECH STACK
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "SPECIFICATIONS // BENCHMARK MATRIX & TECH STACK",
    title: "Production Benchmark Matrix & Tech Stack",
    subtitle: "Comprehensive Metric Matrix, Project Team & Open-Source Pipeline Specifications",
    discipline: "Machine Learning Engineering & Production Specs",
    thesis: "An end-to-end reproducible PyTorch and timm pipeline delivering high-accuracy fine-grained classification with explainable visual attribution.",
    overview:
      "Project engineered at FH Campus Wien by Stefan Auer, Mohammad Kashefirad, and Kilian Lorenz.\n\n" +
      "Delivering fine-grained classification for veterinary triage, shelter intake labeling, and feline health predisposition awareness.",
    description:
      "### Full Benchmark Comparison Matrix\n" +
      "• **ResNet50:** 90.00% Val Acc · 0.7911 Val Loss · 0.8993 F1 · 149.84s/epoch · 25.6M Params\n" +
      "• **EfficientNet-B2:** 90.00% Val Acc · 0.3041 Val Loss · 0.8994 F1 · 42.05s/epoch · 5.3M Params\n" +
      "• **ConvNeXt-tiny (Base):** 95.42% Val Acc · 0.1507 Val Loss · 0.9538 F1 · 102.32s/epoch · 28.6M Params\n" +
      "• **ConvNeXt-tiny (Improved):** 96.67% Val Acc · 0.6530 Val Loss · 0.9666 F1 · 0.9685 Precision · 0.9667 Recall\n\n" +
      "### Software & Hardware Stack\n" +
      "• **Frameworks:** Python, PyTorch, timm (PyTorch Image Models), Torchvision\n" +
      "• **Metrics & XAI:** scikit-learn (Weighted F1, Precision, Recall), Grad-CAM\n" +
      "• **Visualization:** Matplotlib, Seaborn\n" +
      "• **Dataset:** Oxford-IIIT Pet Dataset (Parkhi et al., 2012)",
    highlights: [
      "Team: Stefan Auer, Mohammad Kashefirad, Kilian Lorenz",
      "PyTorch + timm + scikit-learn + Grad-CAM stack",
      "96.67% validation accuracy / 0.9666 weighted F1 score",
      "Application: Shelter intake, health awareness & veterinary diagnostics"
    ],
    keyMetrics: [
      { label: "Top-1 Accuracy", value: "96.67%" },
      { label: "Weighted F1", value: "0.9666" },
      { label: "Precision", value: "0.9685" },
      { label: "Recall", value: "0.9667" }
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

