# Claude.md - Bible Reader Project Context

## Project Overview
Bible Reader with Commentary - A modern web-based application providing AI-powered semantic search, comprehensive biblical commentary, and intelligent related passage discovery through RAG (Retrieval Augmented Generation).

## Key Project Files
- `README.md` - Main project documentation and quick start guide
- `bible-reader-prd.md` - Complete Product Requirements Document
- `IMPLEMENTATION_PLAN.md` - 5-phase implementation roadmap
- `DEPENDENCIES.md` - Setup instructions and dependency list
- `docs/` - Comprehensive project documentation (see below)

## Documentation Structure
The `docs/` directory contains organized project documentation:

### `docs/architecture/`
- `overview.md` - High-level system architecture and data flow
- `data-schemas.md` - JSON schema specifications for all data files
- `components.md` - React component architecture and state management

### `docs/data-sources/`
- `bible-text.md` - ASV Bible text specifications and processing requirements
- `commentary-sources.md` - Matthew Henry + John Gill commentary details and sources
- `cross-references.md` - Traditional reference systems and weighting strategies

### `docs/development/`
- `setup-guide.md` - Complete development environment setup and workflow
- `data-pipeline.md` - Data processing workflow, scripts, and quality assurance
- `testing-strategy.md` - Testing approach, criteria, and success metrics

## Current Status
**✅ Phase 5 Complete**: Full Bible Reader application with RAG system

### Completed Features
- ✅ Complete React application with all core components
- ✅ **Complete New Testament**: All 27 books, 7,217 verses (ASV translation)
- ✅ **RAG System**: Semantic search with 36,096 similarity connections
- ✅ **Commentary Integration**: 4,739 verses with John Gill's Exposition
- ✅ Full-width commentary overlay with proper scrolling and height management
- ✅ Mobile-responsive design with desktop sidebar and mobile bottom sheet
- ✅ Comprehensive error handling and loading states
- ✅ Performance optimizations and offline support (PWA capabilities)
- ✅ Production deployment configurations (Netlify/Vercel)

### Current Project Statistics

| Metric | Value |
|--------|-------|
| **Bible Verses** | 7,217 (Complete NT) |
| **Books** | 27 (All NT books) |
| **Commentary Verses** | 4,739 |
| **Embeddings** | 7,217 (384-dimensional) |
| **Similarity Connections** | 36,096 |
| **Avg Connections/Verse** | 5.0 |
| **Bundle Size** | 192KB (optimized) |
| **Total Data Size** | 94.5MB |

### Data Files
```
public/data/cross_references.json:    20KB
public/data/bible_asv.json:          988KB  (7,217 verses)
public/data/similarity_matrix.json:  5.5MB  (36,096 connections)
public/data/commentaries.json:        13MB  (4,739 verses)
public/data/embeddings.json:          75MB  (7,217 embeddings)
```

## Technical Stack
- **Frontend**: React 19 + Vite 5 + TailwindCSS 4 + Lucide React
- **Data**: Static JSON files with client-side processing
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2 (384-dimensional)
- **Deployment**: Netlify/Vercel free tier
- **Performance**: <3s initial load, <500ms commentary lookup

## Development Commands
```bash
npm run dev      # Start development server (http://localhost:3001)
npm run build    # Build for production with bundle analysis
npm run preview  # Preview production build
```

## Data Processing Commands
```bash
# Download complete New Testament (all 27 books)
node scripts/download_all_books.js

# Fix single-chapter books (Jude, Philemon, 2&3 John)
node scripts/fix_single_chapter_books.js

# Download John Gill commentary
node scripts/download_commentaries.js

# Process raw data into JSON format
node scripts/process_bible.js           # Parse ASV Bible text
node scripts/process_commentary.js      # Process commentary sources

# Generate embeddings (requires Python uv environment)
cd scripts
uv run python generate_embeddings.py

# Build similarity matrix
cd ..
node scripts/build_similarity_matrix.js
```

## Python Environment Setup
```bash
uv venv                    # Create virtual environment
source .venv/bin/activate  # Activate environment (Windows: .venv\Scripts\activate)
uv pip install -r requirements.txt  # Install dependencies
```

## Success Criteria (All Met ✅)
- ✅ Selection-to-commentary display under 500ms (achieved: ~250ms)
- ✅ Initial load under 3 seconds (achieved: ~2.8s)
- ✅ Mobile-responsive design
- ✅ New Testament complete coverage (27 books, 7,217 verses)
- ✅ Offline functionality after initial load

## Features Completed
1. **Bible Text Display**: Clean verse-by-verse reading with intuitive navigation
2. **Commentary System**: John Gill's Exposition with theological tagging
3. **RAG System**: Semantic search with 7,217 verse embeddings
4. **Related Passages**: Top 5 similarity matches with connection types and scores
5. **Full-Width Commentary**: Overlay spans entire browser width with proper scrolling
6. **Responsive Design**: Desktop overlay (640px+) and mobile bottom sheet
7. **Performance**: Service worker, caching, lazy loading, 192KB bundle
8. **Error Handling**: Comprehensive loading states and retry mechanisms

## Available Content
- **Complete New Testament**: All 27 books from Matthew to Revelation
- **7,217 verses**: Complete ASV translation coverage
- **4,739 verses with commentary**: John Gill's Exposition
- **36,096 semantic connections**: AI-powered related passage discovery
- **All single-chapter books fixed**: Jude (25v), Philemon (25v), 2 John (13v), 3 John (14v)

## Next Steps for Future Development
1. **Old Testament Integration**: Add 39 OT books (~23,000 verses)
2. **Matthew Henry Commentary**: Fix HTML parsing for complete integration
3. **Additional Translations**: ESV, NIV, NKJV support
4. **User Features**: Bookmarks, notes, reading plans
5. **Enhanced Search**: Full-text search across all content
6. **Study Tools**: Maps, timelines, concordance integration

## Important Context for Future Sessions
- **WORKING APPLICATION**: Fully functional Bible Reader at http://localhost:3001
- **Complete NT Data**: All 27 books with full embeddings and commentary
- **Architecture Proven**: Ready for expansion (OT, additional features)
- **Performance Targets Met**: Sub-500ms commentary, <3s initial load
- **Production Ready**: Deployable to Netlify/Vercel

## Git Workflow
- Commit after completing each major feature or phase
- Commit after adding significant components or scripts
- Commit before switching to different development areas
- Keep commits focused and descriptive with clear messages
- Update documentation before committing when applicable
- **Recent commits include**: Single-chapter book fixes, related passages display fix

## Architecture Highlights

### Why Client-Side?
- Zero server costs (free CDN deployment)
- Fast response times (no backend latency)
- Offline capability after initial load
- Simple deployment and scaling
- No database management overhead

### Why Pre-Computed Embeddings?
- Instant semantic search (<500ms)
- No ML inference on client
- Consistent similarity scoring
- Enables offline functionality
- Predictable performance

### Data Pipeline
```
Raw Sources → Processing Scripts → Static JSON → React App
     ↓               ↓                  ↓            ↓
ASV Bible       Bible Parser      bible_asv.json   BibleReader
Commentaries    Commentary Proc   commentaries.json Commentary
Cross-refs      Embedding Gen     embeddings.json   RAG System
                Similarity Build  similarity_matrix.json
```

## Component Structure
```
src/
├── components/
│   ├── BibleReader.jsx       # Main text display with verse selection
│   ├── Commentary.jsx         # Full-width commentary overlay
│   ├── RelatedPassages.jsx    # AI-powered related verse discovery
│   └── Navigation.jsx         # Book/chapter navigation
├── utils/
│   ├── ragSystem.js           # Vector search & similarity scoring
│   ├── dataLoader.js          # JSON loading with caching
│   └── textSelection.js       # Selection handling
└── App.jsx                    # Main application entry point
```

## RAG System Details

### Embedding Generation
- **Model**: sentence-transformers/all-MiniLM-L6-v2
- **Dimensions**: 384
- **Coverage**: All 7,217 verses
- **Processing Time**: ~2 minutes for complete NT
- **Batch Size**: 100 verses per batch

### Similarity Computation
- **Algorithm**: Cosine similarity on 384-dim vectors
- **Threshold**: 0.5 minimum similarity
- **Top-K**: 5 most similar passages per verse
- **Total Connections**: 36,096
- **Average per Verse**: 5.0 connections
- **Performance**: <250ms average lookup

### Connection Types
- **Thematic**: Similar theological concepts and themes
- **Cross-Reference**: Traditional biblical cross-references
- **Parallel Passage**: Same event in different gospels
- **Quotation**: Direct OT quotes in NT
- **Allusion**: Indirect references and echoes

## Performance Optimizations
- **Bundle Splitting**: Optimized chunks for faster initial load
- **Lazy Loading**: Commentary and embeddings load on-demand
- **LocalStorage Caching**: Instant repeat visits
- **Service Worker**: PWA with offline support
- **Image Optimization**: Compressed documentation screenshots

## Troubleshooting Common Issues

### Single-Chapter Books
- **Issue**: Jude, Philemon, 2&3 John initially had only 1 verse
- **Root Cause**: Bible API requires explicit verse ranges for single-chapter books
- **Solution**: Use `fix_single_chapter_books.js` script with verse range format

### Commentary Processing
- **Issue**: Commentary files can be large and processing-intensive
- **Solution**: Process incrementally, use caching, check for existing files

### Embedding Generation
- **Issue**: Requires Python environment with sentence-transformers
- **Solution**: Use `uv` for fast, isolated Python environment setup

## Project Health Indicators
- ✅ **Code Quality**: Clean React components with proper separation of concerns
- ✅ **Performance**: Meets all speed and size targets
- ✅ **Data Integrity**: Complete NT with proper verse counting
- ✅ **Documentation**: Comprehensive docs for continuity
- ✅ **Deployment**: Production-ready configuration
- ✅ **Maintainability**: Well-organized codebase with clear patterns

**Read `README.md` first for quick start, then explore `docs/` for detailed information.**
