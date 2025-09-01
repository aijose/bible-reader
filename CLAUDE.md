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
**Phase 1 In Progress**: Data processing pipeline development
- ✅ Project setup (React + Vite + TailwindCSS + Lucide React)
- ✅ Directory structure and documentation created
- ✅ Git repository initialized with comprehensive documentation
- 🔄 Building ASV Bible parser script
- ⏳ Commentary parser development
- ⏳ Cross-reference compilation

## Technical Stack
- **Frontend**: React + Vite + TailwindCSS + Lucide React
- **Data**: Static JSON files with client-side processing
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Deployment**: Netlify/Vercel free tier

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Data Processing Commands (when available)
```bash
node scripts/process_bible.js           # Parse ASV Bible text
node scripts/process_commentary.js      # Process commentary sources
python scripts/generate_embeddings.py   # Generate verse embeddings
node scripts/build_similarity_matrix.js # Build similarity matrix
```

## Success Criteria
- Selection-to-commentary display under 500ms
- Initial load under 3 seconds
- Mobile-responsive design
- New Testament complete coverage
- Offline functionality after initial load

## Next Steps for Continuation
1. Complete Phase 1 data processing scripts (currently building Bible parser)
2. Source ASV Bible text and commentary data
3. Generate JSON data files in `public/data/`
4. Move to Phase 2 embedding generation
5. Build Phase 3 React components

## Important Context for Future Sessions
- Project follows PRD specifications exactly
- Architecture designed for extensibility (future OT integration)
- All documentation is comprehensive and up-to-date
- Data pipeline must complete before React development
- Performance targets are strict (500ms for commentary display)
- **IMPORTANT**: Commit changes at key milestones (after each phase completion, major feature additions, or significant progress)

## Git Workflow
- Commit after completing each phase
- Commit after adding major components or scripts
- Commit before switching to different development areas
- Keep commits focused and descriptive
- Update documentation before committing when applicable

**Read `docs/README.md` first for navigation guide to all documentation.**