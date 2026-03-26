# Navigation Proposals — AI Creative Suite
**Role:** Expert Product Manager, Creative Workflow
**Date:** March 2026
**Companion to:** PM_NAVIGATION_ANALYSIS.md

---

## Guiding Principle

Every proposed change serves one goal: **a user should always know where they are, where their creations will go, and how to find them again.** Nothing more.

---

## 1. Sidebar — Reorder and Regroup Nav Items

### Problem
The current order mixes organizational items (Home, Work) with generation tools (Image, Video, Audio, 3D) and utility items (Stock, Spaces) without clear logic. Scanning top to bottom, users encounter: discovery → organization → canvas → generate → generate → generate → generate. There's no coherent mental model.

### Current Order
```
Home
Stock
Work          ← organization
Spaces        ← unclear category
───────────────
Image         ← generate
Video         ← generate
Audio         ← generate
3D            ← generate
```

### Proposed Order
```
Work          ← home base (default landing)
───────────────
Image         ← generate
Video         ← generate
Audio         ← generate
3D            ← generate
Spaces        ← generate / canvas
───────────────
Stock         ← resources / inputs
───────────────
[bottom]
Academy
Notifications
Profile / More
```

### Changes
- **Work moves to the top.** It is the organizational home. This is where users return between sessions. It should be position #1, not position #3.
- **Spaces moves into the generation group.** Spaces is a creation tool (canvas-based generation), not an organizational concept. It belongs next to Image/Video/Audio/3D.
- **Stock moves to the bottom group.** Stock is an input resource, not a creative destination. It doesn't belong alongside generation tools.
- **Home is removed as a primary nav item.** The "Get Started / Learn / Community" content moves under Academy (already in the sidebar bottom). Work becomes the effective landing page.
- **Apps are removed from the primary rail.** Apps (Selfie With Me, Rate My Fit, etc.) become templates accessible from the Create Modal, not a top-level destination.

---

## 2. Work Section — Consolidate the Asset Hierarchy

### Problem
There are two parallel, overlapping route hierarchies for assets:
- `/projects/all-assets`, `/projects/favorites`, `/projects/uploads`, `/projects/trash`
- `/assets/all-assets`, `/assets/favorites`, `/assets/shared-with-me`

No user can intuit the difference. This also fragments the sidebar: ProjectsPanel has asset links AND AssetsPanel has asset links, creating duplicate panels for the same data.

### Proposed: One Hierarchy Under Work

Remove the `/assets` route tree entirely. Everything lives under `/projects`:

```
Work (/)
├── All Projects          /projects/all-projects
├── All Assets            /projects/all-assets       ← single source of truth
├── Favorites             /projects/favorites
├── Shared with me        /projects/shared-with-me
├── Uploads               /projects/uploads
├── My Assets             /projects/my-assets
├── Templates             /projects/templates
├── Trash                 /projects/trash
│
└── [Project]             /projects/[projectId]
    ├── [Folder]          /projects/[projectId]?folder=[name]
    └── [Subfolder]       /projects/[projectId]?folder=[parent]/[child]
```

### Sidebar Panel Changes
- **Remove AssetsPanel entirely.** The Work/Projects panel absorbs all asset navigation.
- The Quick Links section in ProjectsPanel becomes the single entry point for All Assets, Favorites, Trash, etc.

---

## 3. ProjectsPanel — Sidebar Tree Improvements

### Problem
The sidebar folder tree supports unlimited nesting. At 280px wide, a tree 3+ levels deep becomes impossible to read and navigate. There's also no way to act on folders from the sidebar (rename, add subfolder, delete) — users have to navigate to the project page to do that.

### Proposed Changes

**A. Cap visible depth at 2 levels in the sidebar**

Show: Project → Folder → Subfolder. Stop there.
If a subfolder has children, show a "›" indicator that navigates to the full project view (not expands inline).

```
▼ Nike Campaign                    ← level 0: project
    ▼ Characters                   ← level 1: folder
        Finals          ›          ← level 2: subfolder (has children → navigate)
        Concepts                   ← level 2: subfolder (no children → select)
    ▶ Backgrounds                  ← level 1: folder (collapsed)
```

**B. Inline folder actions on hover**

When hovering a project or folder row, reveal:
- `+` to add a subfolder (already exists, keep it)
- `⋯` menu with: Rename, Move, Delete

**C. Drag-to-reorder folders**

Allow dragging folders within their parent to reorder. This is low-effort organizational control that creative people use constantly.

**D. Folder color**

Currently only Projects have a color. Allow folders to have an optional color override — useful for marking status folders (e.g., "Finals" in green, "In Progress" in yellow). No mandatory assignment, just an option.

**E. My Projects / Shared Projects visual separation**

Keep the existing "My Projects" / "Shared Projects" grouping but make the divider more prominent — not just a label, but a visual break. Users should feel these are two distinct zones.

---

## 4. Project Detail Page — Folder Organization UX

### Problem
The project detail page shows folders as cards in a grid. Once you have 10+ folders, there's no way to sort, filter, or group them. The "New Folder" action isn't persistent — you have to scroll to find the add card or use the CreateModal.

### Proposed Changes

**A. Persistent "New Folder" inline button**

At the top of the Folders section, a persistent `+ New Folder` button that creates inline (editable title, press Enter to confirm). Don't require the CreateModal for something as simple as creating a folder.

**B. Sort folders**

Add a sort control to the Folders section header:
- Manual (drag to reorder)
- Name A–Z
- Date modified
- Asset count

**C. Folder right-click context menu**

Right-clicking any folder card shows: Rename, Move to Project, Duplicate, Delete, Change Color.

**D. Breadcrumb within project stays consistent**

When navigating into a subfolder, the breadcrumb should always show the full path:
```
Work  >  Nike Campaign  >  Characters  >  Finals
```
Not truncated. Within a project, path depth rarely exceeds 4 items, and every item is meaningful context.

---

## 5. Asset Destination Selector — Increase Visibility and Feedback

### Problem
The `ProjectFolderBreadcrumb` in tool pages is the right concept but the wrong placement and weight. It sits centered in the header styled as a ghost pill — visually equivalent to a page subtitle. Many users will not notice it until their assets go somewhere unexpected.

### Proposed Changes

**A. Move the selector into the tool interface**

Place the project/folder selector directly above or below the Generate button — inside the tool's input panel, not in the page header. This puts the "where will this go" decision right next to the "generate this" action. Spatial proximity = intentional decision.

```
┌──────────────────────────────────────┐
│  Prompt                              │
│  ┌────────────────────────────────┐  │
│  │ Enter a prompt...              │  │
│  └────────────────────────────────┘  │
│                                      │
│  Save to  [● Nike Campaign / Finals ▾]│
│                                      │
│  [         Generate         ]        │
└──────────────────────────────────────┘
```

**B. Give it stronger visual styling**

The selector should use the project's color dot + a clearly bordered button. Not a ghost pill. It should look like a form field, not a label.

**C. Post-generation confirmation toast**

After generation completes, show a brief toast notification:
```
✓  Saved to  Nike Campaign / Finals  →  View
```
The "View" link navigates to that folder. This closes the feedback loop and builds trust that assets are going where the user expects.

**D. "Recently used" quick-switch**

The selector dropdown should show a "Recent" section at the top (last 3 destinations used) before listing all projects. Most users generate in batches within the same project — this eliminates re-selecting every session.

```
┌─────────────────────────┐
│ 🔍 Search projects...   │
├─────────────────────────┤
│ Recent                  │
│  ● Nike / Characters    │
│  ● Personal / Scenes    │
├─────────────────────────┤
│ My Projects             │
│  ▶ Personal             │
│  ▶ Product Shots        │
│  ...                    │
└─────────────────────────┘
```

---

## 6. Spaces — Define Clear Ownership

### Problem
Spaces appear as: a top-level sidebar nav item, a section in the Work overview, and as card types inside project detail pages. Users cannot form a clear mental model of what a Space is relative to a Project.

### Proposed Decision: Spaces Are a Creation Tool, Not an Org Container

**Spaces live in the generation group** (alongside Image, Video, Audio, 3D) because they are a creation surface — an infinite canvas where you compose and generate. They are not a project type.

**Within projects**, Spaces are a type of asset — like an image or video file, but canvas-shaped. A project can contain Spaces the same way it contains images.

**Consequence for the Work overview page:**
- Remove the "Spaces" section from the Work overview. The work overview shows Projects and Assets. Spaces appear as asset cards within projects (with a distinct card style).
- The Spaces top-level nav opens the Spaces creation tool, not a list of all spaces.

**Consequence for the sidebar:**
- SpacesPanel (accessible from sidebar) changes from showing a list of spaces to showing Space creation options — templates, recent canvases, and a "New Space" CTA. Similar to how AiSuitePanel shows image generation tools.

---

## 7. Tags — Add a Cross-Cutting Organization Layer

### Problem
The only way to organize assets is by which folder they live in. An asset can only be in one folder. Creative work is cross-cutting: the same character asset might be used across Product Shots, Nike Campaign, and Personal projects.

### Proposed: Asset Tags

**Simple tag system:**
- Any asset can have 0–N tags (free-text labels).
- Tags are account-scoped (not project-scoped) — so the same tag works across projects.
- Tags surface in the All Assets filter bar alongside the existing Project and Owner filters.

**Tag examples:** `hero`, `approved`, `draft`, `Q2-campaign`, `character`, `background`, `retouch-needed`

**Where tags appear:**
- Asset card: small colored dot or label on hover (not always-visible, to keep cards clean)
- Asset detail panel: editable tag list
- All Assets filter: filter by one or more tags
- Sidebar AssetsPanel: optional "Saved Tags" shortcuts (pinnable, like bookmarks)

**Smart collections (phase 2):**
A saved filter combination (e.g., "tag: approved + project: Nike Campaign") becomes a named Collection that appears in the sidebar under the project. These are virtual — no files are moved.

---

## 8. Asset Status — Lightweight Progress Indicator

### Problem
Assets have no status. A folder of 20 images looks the same whether they're raw generations, retouched drafts, or client-approved finals.

### Proposed: 3-State Status on Asset Cards

Status is optional (no status = neutral). Set by right-clicking an asset or using a hover action.

| Status | Color | Label |
|--------|-------|-------|
| None | — | — |
| In Progress | yellow | Working |
| Final | green | Final |
| Approved | blue | Approved |

**Display:**
- Small colored dot in the top-right corner of the asset card (always visible, minimal footprint)
- Bulk-set: select multiple assets → right-click → Set status

**Filter:** Add Status to the All Assets filter bar.

---

## 9. Create Button — Promote It

### Problem
The `+` create button is in the sidebar icon rail, styled similarly to the search button and other utility icons. For a creative generation platform, the primary CTA should be unmissable.

### Proposed Changes

**Option A (conservative):** Give the Create button a filled background in the brand CTA color (already done via `ctaColor`) and make it slightly larger than the other nav icons — enough to break the visual rhythm without redesigning the sidebar.

**Option B (bolder):** Move Create outside the sidebar icon rail entirely. Place it as a fixed floating button in the bottom-right corner of the main content area, visible on every page. This is the pattern used by Notion, Linear, and Figma for their primary creation actions.

At minimum, **Option A** should be implemented immediately. The button is too important to be a peer of the Notifications bell.

---

## 10. Work Overview — Tighten the "Hub" Concept

### Problem
The Work overview currently shows: Recent Projects + Spaces + Assets. With Spaces moving out of this view (see Proposal 6), and Assets meaning all assets across all projects, the page needs a clearer shape.

### Proposed Layout

```
Work
───────────────────────────────────────────────

  Recent Projects                  All projects →
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │      │ │      │ │      │ │ + New│
  └──────┘ └──────┘ └──────┘ └──────┘

───────────────────────────────────────────────

  Recent Creations                  All assets →
  [filter: All types ▾]  [filter: All projects ▾]
  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │    │ │    │ │    │ │    │ │    │ │    │
  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │    │ │    │ │    │ │    │ │    │ │    │
  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘

───────────────────────────────────────────────

  Team Activity                               ←  new
  Adrián added 3 assets to Nike / Characters · 2h ago
  Martin updated Product Shots / Lifestyle · 1d ago
```

**Changes:**
- Remove Spaces section from Work overview
- Rename "Assets" section to "Recent Creations" — more accurate framing
- Add inline filters on Recent Creations (type, project) without navigating away
- Add Team Activity section at the bottom — shows recent changes by collaborators on shared projects

---

## 11. Breadcrumb — Fix Deep Path Truncation

### Problem
Truncation to `[First] > ... > [Last 2]` loses middle context that is often the most relevant (e.g., you're in "Finals" inside "Characters" inside "Nike Campaign" — losing "Characters" loses the folder context).

### Proposed: Scroll Instead of Truncate

Replace ellipsis truncation with a horizontally scrollable breadcrumb. The full path is always present, just potentially scrolled. A left fade-gradient indicates hidden items to the left.

```
← Nike Campaign  >  Characters  >  Finals  >  Approved
   [fade]
```

Alternatively: on hover over any truncated breadcrumb, show the full path as a tooltip. Low-cost fix.

For the project detail page specifically, never truncate within the project — all paths start at the project level and depth is always manageable.

---

## Summary — Change Map

| Area | Change | Impact |
|------|--------|--------|
| Sidebar nav order | Work first, Spaces into generate group, Stock to bottom | Reduces scanning time, clarifies categories |
| Remove /assets routes | Consolidate everything under /projects | Eliminates duplicate destinations |
| Remove Home from primary nav | Merge into Academy | Frees prime sidebar real estate |
| ProjectsPanel max depth | 2 levels visible, navigate for deeper | Keeps sidebar readable at scale |
| ProjectsPanel actions | Hover to reveal rename/delete/color | Removes need to leave sidebar for folder management |
| Folder sort + right-click | Sort controls + context menu on folder cards | Reduces project page friction |
| Project selector placement | Move to inside tool panel, near Generate | Spatial proximity = intentional destination choice |
| Project selector styling | Stronger visual treatment, not ghost pill | Discoverability before assets go missing |
| Post-generation toast | "Saved to X / Y → View" | Closes the feedback loop |
| Selector recent destinations | Last 3 used shown first | Eliminates re-selecting same project every session |
| Spaces ownership | Generation tool, not organizational container | Resolves the 3-location ambiguity |
| Tags system | Free-text tags on assets, cross-project | Enables organization without moving files |
| Asset status | 3-state dot on cards (Working / Final / Approved) | Visual progress without extra UI |
| Create button prominence | CTA color + size differentiation or floating button | Primary action earns primary visual weight |
| Work overview | Remove Spaces section, add Team Activity | More accurate hub for returning users |
| Breadcrumb truncation | Horizontal scroll or tooltip for full path | No context lost in deep folders |
