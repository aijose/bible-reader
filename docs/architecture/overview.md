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
- Verse embeddings generated offline (7,217 embeddings, 384-dim)
- Similarity matrix pre-computed for speed (36,096 connections)
- Commentary linked at verse level (4,739 verses covered)

### Client Optimization
- Lazy loading for commentary/embeddings
- localStorage caching for repeat visits (95MB total)
- Bundle splitting for optimal loading (192KB initial bundle)

### Mobile Considerations
- Responsive design with stacked layout
- Touch-friendly selection handling
- Optimized for smaller screens
- Bottom sheet on mobile, full-width overlay on desktop (640px+)

## Data Size & Performance

### Static Data Files
```
cross_references.json:    20KB
bible_asv.json:          988KB  (7,217 verses, 27 books)
similarity_matrix.json:  5.5MB  (36,096 connections, avg 5.0/verse)
commentaries.json:        13MB  (4,739 verses with commentary)
embeddings.json:          75MB  (7,217 x 384-dimensional vectors)
Total:                    94.5MB
```

### Performance Metrics
- **Initial Load**: ~2.8 seconds (first visit)
- **Subsequent Loads**: <100ms (from LocalStorage cache)
- **Commentary Lookup**: ~250ms average
- **Related Passages**: <300ms (pre-computed similarity)
- **Bundle Size**: 192KB (optimized and compressed)

### Memory Usage
- **Bible Text**: ~1MB in memory
- **Commentary**: ~13MB in memory
- **Embeddings**: ~75MB (loaded on-demand)
- **Similarity Matrix**: ~5.5MB in memory
- **Total Runtime**: ~20MB typical (95MB with all data loaded)

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