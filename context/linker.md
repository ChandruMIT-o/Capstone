Linker — Product Documentation & Knowledge Graph Specification

Linker is a minimalist, keyboard-first link management and digital preservation tool built with React, TypeScript, and Tailwind CSS. It is engineered for high velocity, minimal friction, and deep organization.

1. Core Implemented Features & UX Micro-Interactions

1.1 Omnibar & Keyboard-First Navigation

The entire application can be navigated without touching a pointer device:

/ (Slash Key): Instantly focuses the omnibar search input from anywhere on the screen.

⌘K / Ctrl + K: Opens the quick-capture modal overlay with the input field auto-focused.

J / K (or Down / Up Arrow): Vim-style item selection navigating through filtered cards or list rows.

C: Instantly copies the currently selected link's clean URL with clipboard confirmation toast.

S: Toggles the "Starred" status on the currently selected link.

Enter: Opens the currently focused link directly in a clean browser tab (noopener, noreferrer).

Escape: Dismisses any active modal (Capture dialog, QR Mobile Handoff, or Reader View).

1.2 Heuristic Metadata Sniffer (guessMetadataFromUrl)

When an input URL is pasted:

Automatic Protocol Normalization: Prepends https:// if omitted.

Domain Extraction: Parses the canonical host, stripping www. subdomains.

Heuristic Enrichment:

GitHub: Automatically extracts repo name (user/repo) and suggests #Dev, #Code, #OpenSource.

YouTube: Detects video links and categorizes as #Video, #Media.

X / Twitter: Categorizes as #Social, #Signal.

Figma: Infers canvas workspaces.

Reading Time Estimator: Provides a baseline minute estimation based on source format and content density.

Favicon Resolution: Dynamically fetches crisp multi-resolution favicons via Google's S2 CDN service.

1.3 Mobile Handoff (Procedural Vector QR)

Clicking the QR icon on any bookmark opens an SVG QR-code modal seeded deterministically by the URL.

Allows seamless handoff of articles, long-reads, and documentation from desktop to mobile phones without requiring cross-device browser sync or accounts.

1.4 Distraction-Free Reader Mode

Accessible via the spectacles (Glasses) action icon on any card.

Presents an uncluttered reading view with typographic hierarchy, estimated read time, personal notes, and direct status cycler.

1.5 Reading Queue State Machine

Three-state reading pipeline: unread $\rightarrow$ reading $\rightarrow$ completed $\rightarrow$ unread.

Real-time visual feedback with pulsating status indicators and categorized sidebar filters.

2. Interactive Interconnected Bubble / Graph View Specification

The proposed feature introduces an Obsidian-style 2D force-directed interactive graph where links, tags, and collections coexist as interconnected visual nodes (bubbles).