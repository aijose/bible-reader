# React Component Architecture

## Component Hierarchy

```
App
├── Navigation
│   ├── BookSelector
│   └── ChapterNavigation
├── BibleReader
│   ├── VerseDisplay
│   └── TextSelection
└── Sidebar
    ├── Commentary
    │   ├── CommentarySection (Matthew Henry)
    │   └── CommentarySection (John Gill)
    └── RelatedPassages
        └── PassageList
```

## Component Specifications

### App.jsx
**Purpose**: Root component, layout management, global state
**Props**: None
**State**: 
- `selectedVerse`: Current verse selection
- `sidebarOpen`: Sidebar visibility state
- `currentBook`: Active book
- `currentChapter`: Active chapter

### Navigation.jsx
**Purpose**: Book and chapter navigation controls
**Props**: 
- `currentBook`: Active book
- `currentChapter`: Active chapter
- `onBookChange`: Book selection handler
- `onChapterChange`: Chapter navigation handler
**Features**:
- Book dropdown with NT books
- Previous/Next chapter buttons
- Jump to chapter input

### BibleReader.jsx
**Purpose**: Main Bible text display with selection handling
**Props**:
- `book`: Current book data
- `chapter`: Current chapter data
- `onVerseSelect`: Verse selection callback
**Features**:
- Verse-by-verse rendering
- Text selection detection
- Selection boundary enforcement (single verse)
- Selection indicator popup

### Commentary.jsx
**Purpose**: Commentary display in sidebar
**Props**:
- `selectedVerse`: Verse reference (e.g., "matthew_1_1")
- `commentaries`: Commentary data for selected verse
**Features**:
- Sequential display of both commentaries
- Expandable sections (200 chars + "read more")
- Source attribution
- Theological tags display

### RelatedPassages.jsx
**Purpose**: RAG-powered related passage discovery
**Props**:
- `selectedVerse`: Current verse selection
- `similarities`: Pre-computed similarity data
- `onPassageClick`: Navigation to related passage
**Features**:
- Top 5 related passages
- Passage type indicators (direct, thematic, semantic)
- Context display (≤5 verses show full text)
- Click-to-navigate functionality

## State Management Strategy

### Global State (App Level)
- Current book/chapter/verse selection
- Sidebar visibility
- Data loading states

### Local State (Component Level)
- Commentary expansion states
- Text selection UI states
- Navigation input values

### Data Loading
- Static JSON files loaded via fetch
- localStorage caching for performance
- Lazy loading for commentary and embeddings

## Data Flow Patterns

### Text Selection Flow
1. User selects text in BibleReader
2. Selection handler identifies verse boundaries
3. App state updated with selectedVerse
4. Commentary and RelatedPassages components re-render
5. Sidebar opens with new content

### Navigation Flow
1. User interacts with Navigation component
2. Navigation calls onBookChange/onChapterChange
3. App updates currentBook/currentChapter state
4. BibleReader re-renders with new chapter data
5. URL state updated for deep linking

### RAG Query Flow
1. selectedVerse triggers similarity lookup
2. Pre-computed similarity matrix queried
3. Top 5 results filtered and ranked
4. RelatedPassages renders results with context
5. Click handlers enable navigation to related verses

This architecture ensures clean separation of concerns, efficient re-rendering, and maintainable code structure.