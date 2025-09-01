# Claude.md - Bible Reader Project Context

## Project Overview
Bible Reader with Commentary - A web-based application providing intelligent commentary and related passage discovery through RAG when users select Bible text.

## Key Project Files
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
**Phase 5 Complete**: Full Bible Reader application with RAG system
- ✅ Complete React application with all core components
- ✅ ASV Bible text (Matthew & Mark) with 1,198 verses embedded
- ✅ RAG system with semantic search and 6,011 similarity connections
- ✅ Mobile-responsive design with desktop sidebar and mobile bottom sheet
- ✅ Comprehensive error handling and loading states
- ✅ Performance optimizations and offline support
- ✅ Production deployment configurations (Netlify/Vercel)
- ✅ Working commentary and related passage discovery

## Technical Stack
- **Frontend**: React + Vite + TailwindCSS + Lucide React
- **Data**: Static JSON files with client-side processing
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Deployment**: Netlify/Vercel free tier

## Development Commands
```bash
npm run dev      # Start development server (http://localhost:3001)
npm run build    # Build for production with bundle analysis
npm run preview  # Preview production build
```

## Data Processing Commands
```bash
# Download Bible data (rate limited)
node scripts/download_asv_working.js

# Generate embeddings (requires Python uv environment)
cd scripts && uv run python generate_embeddings.py

# Build similarity matrix
node scripts/build_similarity_matrix.js

# Legacy scripts (if needed)
node scripts/process_bible.js           # Parse ASV Bible text
node scripts/process_commentary.js      # Process commentary sources
```

## Python Environment Setup
```bash
uv venv                    # Create virtual environment
source .venv/bin/activate  # Activate environment
uv pip install -r requirements.txt  # Install dependencies
```

## Success Criteria
- Selection-to-commentary display under 500ms
- Initial load under 3 seconds
- Mobile-responsive design
- New Testament complete coverage
- Offline functionality after initial load

## Features Completed
1. **Bible Text Display**: Clean verse-by-verse reading with Matthew & Mark
2. **Commentary System**: Matthew Henry and John Gill commentary integration
3. **RAG System**: Semantic search with 1,198 verse embeddings
4. **Related Passages**: Top 5 similarity matches with connection types
5. **Responsive Design**: Desktop sidebar and mobile bottom sheet
6. **Performance**: Service worker, caching, lazy loading, 192KB bundle
7. **Error Handling**: Comprehensive loading states and retry mechanisms

## Next Steps for Future Development
1. Download remaining NT books (John through Revelation) with rate limiting
2. Implement genre-aware processing for different biblical genres  
3. Add Old Testament integration (future phases)
4. Enhanced commentary sources and cross-references
5. User preferences and bookmarking features

## Important Context for Future Sessions
- **WORKING APPLICATION**: Fully functional Bible Reader at http://localhost:3001
- Project implements complete PRD specifications with RAG-powered commentary
- Current data: Matthew & Mark (2 of 27 NT books) with full embeddings
- Architecture proven and ready for expansion to remaining books
- Performance targets met (sub-500ms commentary, <3s initial load)
- **IMPORTANT**: Continue incremental git commits for all changes

## Git Workflow
- Commit after completing each phase
- Commit after adding major components or scripts
- Commit before switching to different development areas
- Keep commits focused and descriptive
- Update documentation before committing when applicable

**Read `docs/README.md` first for navigation guide to all documentation.**