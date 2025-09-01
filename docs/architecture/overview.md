# System Architecture Overview

## High-Level Architecture

The Bible Reader application follows a client-side architecture with pre-processed data files for optimal performance and simplicity.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Data Sources  │    │  Processing      │    │  React App      │
│                 │    │  Scripts         │    │                 │
│  • ASV Bible    │───▶│  • Bible Parser  │───▶│  • BibleReader  │
│  • M. Henry     │    │  • Commentary    │    │  • Commentary   │
│  • J. Gill      │    │  • Embeddings    │    │  • Related      │
│  • Cross-refs   │    │  • Similarity    │    │  • Navigation   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Component Architecture

### Core Components
- **BibleReader**: Main text display with verse-level selection
- **Commentary**: Slide-out sidebar with expandable commentary sections
- **RelatedPassages**: RAG-powered related verse discovery
- **Navigation**: Book/chapter navigation controls

### Utility Modules
- **ragSystem.js**: Client-side vector search and similarity scoring
- **dataLoader.js**: JSON data loading with localStorage caching
- **textSelection.js**: Text selection handling with verse boundaries

## Data Flow

1. **Static Data**: JSON files served from `public/data/`
2. **Client Loading**: Data loaded on-demand with caching
3. **Text Selection**: User selects verse → triggers commentary lookup
4. **RAG Processing**: Vector search finds related passages
5. **Display**: Commentary and related passages shown in sidebar

## Performance Strategy

### Pre-computation
- Verse embeddings generated offline
- Similarity matrix pre-computed for speed
- Commentary linked at verse level

### Client Optimization
- Lazy loading for commentary/embeddings
- localStorage caching for repeat visits
- Bundle splitting for optimal loading

### Mobile Considerations
- Responsive design with stacked layout
- Touch-friendly selection handling
- Optimized for smaller screens

## Technology Decisions

### Why Client-Side?
- No server costs (free deployment)
- Offline capability after initial load
- Simple deployment to CDN
- Fast response times for interactions

### Why Static JSON?
- Predictable performance
- Simple caching strategy
- Easy to version and update
- No database complexity

### Why Pre-computed Embeddings?
- Sub-500ms response requirement
- Avoids ML inference on client
- Consistent similarity scoring
- Enables offline functionality

This architecture prioritizes simplicity, performance, and cost-effectiveness while maintaining extensibility for future enhancements.