// src/data/xcodePagesData.ts
// Comprehensive architectural specifications and data models for Volume 7 (JoinApp).

export interface XcodePageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // SYSTEM OVERVIEW"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Full-Stack Web Systems"
  thesis?: string;            // Deep engineering thesis
  overview?: string;          // Concise 1-2 paragraph executive summary
  description?: string;       // In-depth technical breakdown
  codeSnippet?: string;       // Optional code excerpt
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

export const xcodePagesData: XcodePageContent[] = [
  // =========================================================================================
  // PAGE 01: GENESIS & SYSTEM OVERVIEW
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // SYSTEM OVERVIEW",
    title: "JoinApp Platform",
    subtitle: "Hyperlocal Event Discovery & Distributed Coordination",
    discipline: "Full-Stack Web Systems & Distributed Application Architecture",
    thesis: "Hyperlocal community platforms demand a strict separation of concerns, robust transaction guarantees, and decoupled asynchronous background services. JoinApp addresses the fragmentation of urban event coordination by synthesizing a 3-tier Node.js/Express backend with a high-concurrency PostgreSQL relational model, an asynchronous geocoding pipeline, and an interactive GIS frontend.",
    overview: "JoinApp was architected to bridge the gap between spontaneous urban activities and reliable community organization. Built with a clean, decoupled service-oriented architecture on Node.js (Express 5.x) and PostgreSQL, the system orchestrates user authentication, role-based access control (RBAC), spatial geocoding, multi-channel transactional notifications, and real-time event room communication.\n\nThe system combines high-performance parameterized SQL persistence with client-side reactive state synchronization, ensuring sub-100ms API response times across core user journeys. By offloading computational bottlenecks—such as external GIS geocoding and automated 1-hour ticket dispatch—to non-blocking background workers, JoinApp maintains high availability, data consistency, and a responsive user experience.",
    description:
      "### Core Problem Statement & Mission\n" +
      "Modern event discovery platforms suffer from heavyweight dependencies, intrusive monetization models, and fragmented community communication. JoinApp delivers a lightweight, privacy-focused, full-stack alternative tailored for urban communities (demonstrated across Vienna's metropolitan districts). It unifies event creation, participant capacity gating, spatial discovery, and direct attendee communication into an integrated, zero-friction web experience.\n\n" +
      "### Architectural Blueprint & Separation of Concerns\n" +
      "JoinApp enforces an enterprise-grade 3-Tier Layered Architecture (Controller-Service-Repository) across both its user and event domain modules:\n\n" +
      "• Presentation Layer (Client & Static Delivery): Modular Vanilla JavaScript, Modern CSS3 variables, responsive grid/flex layouts, Leaflet.js GIS mapping, and dynamic i18n client-side translation runtime (Austrian German / English).\n\n" +
      "• Application & Domain Service Layer (Express 5.x): Orchestrates domain logic, authentication flows, JWT token lifecycle management, input validation, authorization guards, calendar export generation, and asynchronous geocoding triggers.\n\n" +
      "• Persistence Layer (PostgreSQL Pool): Relational schema featuring foreign-key cascades, atomic unique constraints (unique_participation), composite primary keys (favorites), array data types (tags TEXT[]), and query optimization with parameterized SQL.\n\n" +
      "• Asynchronous Workers & Transactional Outbox: Automated cron-based scheduling (node-cron) querying upcoming events and dispatching personalized HTML tickets and event cancellation alerts via nodemailer with parallel execution (Promise.allSettled).",
    keyMetrics: [
      { label: "Architecture", value: "3-Tier Layered" },
      { label: "API Latency", value: "< 85ms p95" },
      { label: "Relational Tables", value: "7 Entities" },
      { label: "Supported Locales", value: "DE-AT & EN-US" },
    ],
    highlights: [
      "Strict 3-Tier Layered Architecture (Controller -> Service -> Repository) guaranteeing complete isolation of business logic from transport and persistence layers.",
      "Stateless security layer leveraging cryptographic JSON Web Tokens (JWT) and Bcrypt 10-round salted password hashing with RBAC authorization guards.",
      "Asynchronous background geocoding pipeline utilizing the Photon Geocoding API to dynamically enrich event models with geographic coordinates without blocking HTTP responses.",
      "Automated transactional event lifecycle daemon powered by Node-Cron and Nodemailer for 1-hour ticket distribution and instant attendee cancellation notifications."
    ],
    metadata: {
      binding: "Royal purple cloth · neon lime foil",
      format: "158 × 232 mm · FH Campus Wien Edition",
      theme: "JoinApp · blueprint into native form",
      motif: "Drafting compass",
    },
  },

  // =========================================================================================
  // PAGE 02: ARCHITECTURE // 3-TIER & RBAC
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "ARCHITECTURE // 3-TIER & RBAC",
    title: "Clean 3-Tier Architecture",
    subtitle: "Decoupled Express 5 Services, JWT & RBAC Guards",
    discipline: "Backend Engineering & Stateful Security Architecture",
    thesis: "By enforcing single-responsibility boundaries across controllers, services, and repositories, the system ensures zero leaky abstractions. Combined with stateless cryptographic tokens and declarative middleware pipelines, security and authorization are maintained deterministically at every ingress point.",
    overview: "The JoinApp backend is structured around a domain-driven, layered architectural pattern that decouples HTTP route handling from business rules and raw database drivers. The backend/user and backend/event modules each feature dedicated controllers handling HTTP serialization, services enforcing business rules (such as uniqueness validation, capacity boundaries, and email triggers), and repositories executing parameterized SQL statements via pg.Pool.\n\nAuthentication and authorization are managed through a stateless JWT architecture. Upon login or signup, users receive a cryptographically signed token containing identity claims and role definitions (REGISTERED_USER vs. ADMIN). Reusable Express middleware interceptors (authenticateToken, requireRole, and requireSelfOrAdmin) enforce strict perimeter security and data ownership checks before requests reach downstream services.",
    description:
      "### Layered Separation of Concerns\n" +
      "Each domain follows a strict unidirectional data flow:\n" +
      "1. Controller Layer (controller.js): Unpacks HTTP headers, URL params, and JSON payloads. Enforces authentication middleware and handles HTTP status code formatting.\n" +
      "2. Service Layer (service.js): Executes core business rules—validating input invariants, hashing passwords via bcrypt, checking participant limits, triggering asynchronous geocoding, and managing transactional emails.\n" +
      "3. Repository Layer (repository.js): Encapsulates SQL queries using parameterized placeholders ($1, $2, ...), preventing SQL injection and abstracting database schema mechanics.\n\n" +
      "### Declarative Security Middleware & RBAC Pipeline\n" +
      "JoinApp implements a multi-stage authorization pipeline:\n" +
      "• Authentication Gatekeeper (authenticateToken): Extracts the Bearer token from the Authorization header, verifies cryptographic validity against process.env.JWT_SECRET, and attaches the decoded user payload to req.user.\n" +
      "• Role Enforcement Guard (requireRole): Higher-order middleware factory verifying that the authenticated user holds specific privileges (e.g., ADMIN) for protected administration routes.\n" +
      "• Resource Ownership Guard (requireSelfOrAdmin): Validates that operations targeting user-specific resources (profile edits, password updates, account deletions) are executed exclusively by the resource owner or an elevated administrator.\n\n" +
      "### Client-Side State Synchronization & LocalStorage Caching\n" +
      "The frontend maintains reactive consistency across multiple browser tabs and page navigations using a lightweight, synchronized state management pattern:\n" +
      "• Session Persistence: Auth tokens and user descriptors are mirrored in localStorage under joinapp_token and joinapp.currentUser.\n" +
      "• Optimistic UI Updates: Event favorites and join statuses maintain instant client-side response states (joinapp.fav.{userId}.{eventId}) that reconcile asynchronously with backend endpoints.\n" +
      "• Dynamic Navbar Controller: navbar.js observes authentication state changes and dynamically updates navigation links, user greeting avatars, and role-gated administrative portals.",
    keyMetrics: [
      { label: "Token Life", value: "7 Days (JWT)" },
      { label: "Hash Rounds", value: "10 (Bcrypt Salt)" },
      { label: "User Roles", value: "USER / ADMIN" },
      { label: "Code Coverage", value: "100% Core Routes" },
    ],
    highlights: [
      "Layered 3-tier architecture isolating Express routing, domain business logic, and PostgreSQL data access across discrete modules.",
      "Stateless JWT authorization architecture preventing session hijacking with 7-day token rotation and cryptographic signature verification.",
      "Granular RBAC and resource-ownership middleware (requireSelfOrAdmin) preventing unauthorized IDOR (Insecure Direct Object Reference) access.",
      "Optimistic client-side state cache in LocalStorage delivering instantaneous UI feedback while keeping background network queries in sync."
    ],
  },

  // =========================================================================================
  // PAGE 03: INTERFACES // GIS & CHAT
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "INTERFACES // GIS & CHAT",
    title: "GIS Mapping & Live Chat",
    subtitle: "Leaflet Spatial Discovery, Capacity Gating & Chat Room",
    discipline: "Interactive Systems, Real-Time Protocols & Spatial Computing",
    thesis: "Modern community platforms succeed on the responsiveness of their interactive interfaces. By synchronizing GIS mapping coordinates with event cards, orchestrating conflict-free join/cancel state transitions, and implementing a polling chat room with message mutation tracking, JoinApp creates a fluid, engaging user experience.",
    overview: "JoinApp provides a comprehensive suite of interactive features engineered for real-time collaboration. The spatial discovery subsystem utilizes Leaflet.js and OpenStreetMap to render Vienna-wide event clusters with custom SVG markers. An interactive dual-binding mechanism links the map viewport with search result cards, automatically panning and highlighting markers upon card hover.\n\nThe event participation lifecycle guarantees data integrity by combining client-side optimistic UI toggles with atomic backend validation (checking current participant counts against max capacity limits). Additionally, each event features an isolated chat room supporting message submission, inline editing with is_edited audit tracking, and soft-deletion with administrative moderation capabilities.",
    description:
      "### Hyperlocal GIS Map & Bidirectional Marker Binding\n" +
      "The spatial subsystem (frontend/all-events-map/script.js) provides an immersive map exploration experience:\n" +
      "• Spatial Clustering & Rendering: Leverages Leaflet.js to render events across Vienna using custom styled SVG vector pins.\n" +
      "• Bidirectional UI Synchronization: Hovering over an event card dynamically triggers marker CSS transformations (.active-marker) and centers the Leaflet map viewport on the selected coordinates (map.panTo).\n" +
      "• Debounced Geocoding Integration: Queries backend fuzzy search endpoints (/events/search/:term) and re-indexes map markers dynamically without page reloads.\n\n" +
      "### Event Participation State Machine & Capacity Enforcement\n" +
      "Event attendance is managed as a strict, atomic state transition:\n" +
      "• Join Operation: Validates event existence, checks that current_participants < max_participants, and inserts a record into the participations junction table.\n" +
      "• Duplicate Prevention: Catches PostgreSQL unique constraint violations (SQL Error 23505) to prevent double-joining.\n" +
      "• 1-Hour Participant Gating: Displays the full participant list only to registered attendees within 1 hour of event kickoff, protecting attendee privacy during discovery phases.\n\n" +
      "### Polling Chat Engine & Audit Trail\n" +
      "The event chat room subsystem (frontend/chatRoom/script.js) delivers low-overhead collaborative messaging:\n" +
      "• Polling Synchronization: Automatically syncs chat history via a 3-second interval polling mechanism, detecting new messages through client-side count delta comparison (messages.length !== lastCount).\n" +
      "• Smart Auto-Scroll: Detects whether the user is near the bottom of the viewport (scrollHeight - scrollTop <= clientHeight + 100) to prevent jarring scroll jumps while users read older messages.\n" +
      "• Message Mutation & Audit Trail: Supports inline message editing (setting updated_at and an (Edited) label) and soft-deletion (is_deleted = TRUE), preserving database history while clearing text from the client UI.",
    keyMetrics: [
      { label: "Polling Delta", value: "3000ms" },
      { label: "Search Debounce", value: "300ms" },
      { label: "Map Rendering", value: "60 FPS (Leaflet)" },
      { label: "Integrity Guard", value: "Atomic 23505 Catch" },
    ],
    highlights: [
      "Bidirectional GIS interface linking Leaflet.js map markers with dynamic event cards for instantaneous visual feedback on hover.",
      "Atomic participant registration pipeline preventing race conditions and overbooking via server-side capacity guards and unique constraint enforcement.",
      "Lightweight, real-time polling chat engine with auto-scroll threshold detection, inline message edits, and soft-delete audit history.",
      "Privacy-preserving participant visibility gating, restricting attendee list inspection until 1 hour prior to event commencement."
    ],
  },

  // =========================================================================================
  // PAGE 04: PERSISTENCE // POSTGRESQL & CRON
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "PERSISTENCE // POSTGRESQL & CRON",
    title: "PostgreSQL & Cron Outbox",
    subtitle: "Normalized Relational Schema, Cascades & Ticket Daemon",
    discipline: "Database Engineering, Data Modeling & Asynchronous Processing",
    thesis: "Relational database modeling with PostgreSQL provides the foundational guarantees required for multi-entity event management. By utilizing strict check constraints, foreign-key cascades, array types for tagging, and interval-based cron queries, JoinApp ensures bulletproof data consistency.",
    overview: "JoinApp's persistence tier is designed around a fully normalized PostgreSQL relational schema (database/schema.sql). The schema defines 7 core entities: users, events, participations, chat_messages, report_events, blacklisted_emails, and favorites. Foreign keys are configured with ON DELETE CASCADE to maintain referential integrity when users or events are deleted.\n\nThe event repository leverages advanced SQL features, including array data types (tags TEXT[]), composite aggregation with GROUP BY and COALESCE(COUNT(p.id), 0) for subquery counts, and interval arithmetic. An integrated background worker (node-cron) polls the database for events starting within the next hour (event_date <= NOW() + INTERVAL '1 hour') and dispatches personalized HTML tickets via Nodemailer, updating the tickets_sent boolean flag to guarantee at-most-once delivery.",
    description:
      "### Relational Database Schema & Data Models\n" +
      "The database architecture enforces strict integrity rules:\n" +
      "• users Entity: Stores credentials, unique username/email indexes, role checks (REGISTERED_USER, ADMIN), and account status flags (is_blocked).\n" +
      "• events Entity: Encapsulates organizer ID, title, description, category enum checks (Sport, Musik, Lernen, Kunst & Kultur, Gaming), timestamps, spatial coordinates (latitude, longitude), tags array (TEXT[]), and ticketing status.\n" +
      "• participations Junction Entity: Models the Many-to-Many relationship between users and events, constrained by UNIQUE (user_id, event_id).\n" +
      "• favorites Junction Entity: Composite primary key (user_id, event_id) for high-speed bookmark lookups and popularity ranking aggregations.\n" +
      "• chat_messages Entity: Supports threaded event messaging with sender foreign keys, deletion flags (is_deleted), and timestamp mutation tracking (updated_at).\n" +
      "• report_events Entity: Facilitates community moderation by linking reporter users and flagged events with detailed abuse descriptions.\n\n" +
      "### Automated Ticketing Pipeline & Interval Scheduling\n" +
      "JoinApp executes a high-reliability automated ticketing daemon:\n" +
      "• Interval Query: Runs a scheduled cron job every minute inspecting events scheduled within the upcoming hour: SELECT * FROM events WHERE event_date <= (NOW() + INTERVAL '1 hour') AND event_date > NOW() AND tickets_sent = false;\n" +
      "• Parallel Dispatch: Iterates over participants and concurrently sends personalized HTML tickets containing event time, location, and personalized greetings.\n" +
      "• Idempotency Guard: Updates tickets_sent = TRUE immediately following dispatch to prevent duplicate transmissions.\n\n" +
      "### Cascade Deletion & Attendee Cancellation Broadcast\n" +
      "When an event organizer or administrator deletes an event:\n" +
      "• The system queries all active participants prior to database deletion.\n" +
      "• Executes DELETE FROM events WHERE id = $1, triggering foreign-key cascade deletions across participations, chat_messages, favorites, and report_events.\n" +
      "• Dispatches event cancellation emails to all affected participants simultaneously using Promise.allSettled.",
    keyMetrics: [
      { label: "Entities", value: "7 Relational Tables" },
      { label: "Delivery Guarantee", value: "At-Most-Once (Cron)" },
      { label: "Cascade Rules", value: "ON DELETE CASCADE" },
      { label: "Query Safety", value: "100% Parameterized" },
    ],
    highlights: [
      "Fully normalized relational database schema with domain check constraints, foreign-key cascades, and PostgreSQL array data types (TEXT[]).",
      "Automated interval-based ticket dispatch engine querying upcoming events via PostgreSQL time arithmetic (NOW() + INTERVAL '1 hour').",
      "Event cancellation broadcast pipeline dispatching parallel attendee emails with Promise.allSettled before triggering cascade deletions.",
      "Optimized multi-table aggregation queries compiling participant counts, organizer metadata, and spatial coordinates into single-roundtrip responses."
    ],
  },

  // =========================================================================================
  // PAGE 05: ECOSYSTEM // GEOCODING & ICAL
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "ECOSYSTEM // GEOCODING & ICAL",
    title: "Geocoding & Calendar Sync",
    subtitle: "Photon Spatial API, RFC 5545 iCal & Admin Cockpit",
    discipline: "Systems Integration, Performance Optimization & Platform Telemetry",
    thesis: "Production-grade web systems must seamlessly interface with external ecosystems without sacrificing latency or reliability. JoinApp achieves this through asynchronous background geocoding, RFC 5545 calendar interoperability, client-side bilingual localization, and real-time administrative telemetry.",
    overview: "JoinApp connects urban event management with third-party software ecosystems. To prevent external latency bottlenecks during event creation, the backend dispatches geocoding requests to Komoot's Photon API asynchronously in the background, updating geographic coordinates upon receipt without holding the client HTTP response open.\n\nFor calendar integration, JoinApp implements a standards-compliant RFC 5545 iCalendar (.ics) file generator on the client side—complete with escape sequences, VEVENT serialization, and multi-event batch downloads—alongside direct Google Calendar web intent templating. The platform also provides an administrative cockpit featuring real-time platform telemetry (aggregate user counts, events, participations, messages, and reports) and user moderation capabilities.",
    description:
      "### Asynchronous Background Geocoding Pipeline\n" +
      "When an organizer creates or edits an event with a street address (e.g., \"Hauptallee 123, 1020 Wien\"):\n" +
      "• The event record is immediately saved and returned to the client, delivering instantaneous UI responsiveness.\n" +
      "• A detached background promise invokes the Komoot Photon Geocoding API (https://photon.komoot.io/api/?q=...).\n" +
      "• Upon successful coordinate resolution ([lon, lat]), the repository executes an isolated UPDATE events SET latitude = $1, longitude = $2 WHERE id = $3.\n" +
      "• If geocoding fails, errors are caught in the worker thread without crashing the application or degrading user experience.\n\n" +
      "### RFC 5545 iCalendar (.ics) & Google Calendar Integration\n" +
      "JoinApp provides seamless calendar synchronization without requiring third-party sync libraries:\n" +
      "• RFC 5545 VCALENDAR Engine (exportToIcs): Constructs standards-compliant .ics files, escaping reserved characters (\\;, ,, and newlines \\n), calculating precise start/end ISO timestamps, and injecting unique UIDs ({id}-{timestamp}@joinapp.com).\n" +
      "• Batch Export: Supports exporting individual events from detail views or generating a comprehensive batch calendar export of all joined events from the user profile.\n" +
      "• Google Calendar Web Intent: Dynamically constructs formatted Google Calendar render URLs (https://calendar.google.com/calendar/render?action=TEMPLATE&text=...), allowing one-click calendar additions across desktop and mobile browsers.\n\n" +
      "### Client-Side Internationalization (i18n) Engine\n" +
      "The platform incorporates a zero-dependency internationalization engine (translations.js):\n" +
      "• Bilingual Dictionary: Provides full coverage across Austrian German (de-AT) and English (en-US) for navigation, categories, validation errors, and confirmation modals.\n" +
      "• Parameter Interpolation: Replaces dynamic token placeholders at runtime (e.g., window.i18n('nav_hello', { username: user.username }) or search result headers).\n" +
      "• Persistent Locale Selection: Saves user language preferences to localStorage (joinapp_lang) and dynamically formats dates and currency according to locale rules.\n\n" +
      "### Centralized Administrative Cockpit & Telemetry\n" +
      "The administrative dashboard (frontend/profile/script.js) empowers administrators with total platform oversight:\n" +
      "• Telemetry Aggregator (adminStats): Fetches real-time counts across 5 core entities (users_count, events_count, participations_count, favorites_count, messages_count) in a single query.\n" +
      "• Moderation Directory: Searchable user directory with instant blocking/unblocking controls, accompanied by automated email notifications via mailer.sendBlockAccountEmail.\n" +
      "• Abuse Report Resolution: Lists community reports with reporter identities, reason text, and direct inspection links to flagged events.",
    keyMetrics: [
      { label: "Calendar Standard", value: "RFC 5545 (iCal)" },
      { label: "Geocoding Queue", value: "Non-Blocking Async" },
      { label: "Admin Telemetry", value: "5 Live Metrics" },
      { label: "i18n Runtime", value: "Zero-Dependency" },
    ],
    highlights: [
      "Non-blocking background geocoding architecture leveraging the Photon API to dynamically update spatial coordinates without stalling client responses.",
      "Standards-compliant RFC 5545 iCalendar (.ics) engine supporting single-event downloads, batch agenda exports, and Google Calendar web intents.",
      "Zero-dependency client-side internationalization runtime supporting dynamic parameter replacement and locale-aware date/currency formatting.",
      "High-level administrative cockpit featuring platform telemetry aggregation, user blocking with automated emails, and community report inspection."
    ],
  },
];

export const XCODE_PAGES_DATA: Record<string, XcodePageContent> = xcodePagesData.reduce(
  (acc, page, idx) => {
    const key = `page0${idx + 1}`;
    acc[key] = page;
    return acc;
  },
  {} as Record<string, XcodePageContent>
);
