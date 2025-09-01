# Development Setup Guide

## Prerequisites

### System Requirements
- Node.js v18+ (v20+ recommended)
- npm v9+
- Python 3.8+ (for embedding generation)
- Git

### Environment Setup
```bash
# Verify installations
node --version
npm --version
python --version
git --version
```

## Project Setup

### 1. Clone and Initialize
```bash
git clone <repository-url>
cd bible_reader
npm install
```

### 2. Python Environment (for embeddings)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install Python dependencies
pip install sentence-transformers torch numpy pandas
```

### 3. Verify Setup
```bash
# Test React development server
npm run dev

# Should open at http://localhost:3000
```

## Development Workflow

### Daily Startup
1. Activate Python environment: `source venv/bin/activate`
2. Start development server: `npm run dev`
3. Open browser to `http://localhost:3000`

### Before Committing
1. Run build test: `npm run build`
2. Check for errors in console
3. Test key functionality manually
4. Update relevant documentation in `docs/` if needed
5. Update `CLAUDE.md` status section if major progress made

### Git Workflow
- Commit at end of each work session
- Commit after completing phases or major milestones
- Commit before switching development focus areas
- Use descriptive commit messages following established patterns

## Data Processing Setup

### Phase 1: Source Data Collection
Create `data-sources/` directory (not tracked by git):
```bash
mkdir data-sources
cd data-sources

# Download ASV Bible text
# Download Matthew Henry commentary
# Download John Gill commentary
# Download cross-reference data
```

### Phase 2: Processing Pipeline
```bash
# Process Bible text
node scripts/process_bible.js

# Process commentaries  
node scripts/process_commentary.js

# Generate cross-references
node scripts/build_cross_references.js

# Generate embeddings (requires Python)
python scripts/generate_embeddings.py

# Build similarity matrix
node scripts/build_similarity_matrix.js
```

## Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

### Browser Developer Tools
- React Developer Tools extension
- Performance profiling for 500ms target
- Network tab for data loading analysis
- Console for error monitoring

## Debugging

### Common Issues
1. **Node Version Warnings**: Upgrade to Node v20+ if possible
2. **TailwindCSS Not Loading**: Check PostCSS configuration
3. **Import Errors**: Verify file paths and extensions
4. **Data Loading Fails**: Check JSON file validity and paths

### Performance Monitoring
- Use browser Performance tab
- Monitor bundle size with `npm run build`
- Check localStorage usage
- Verify 500ms response time target

## Testing Strategy

### Manual Testing Checklist
- [ ] Bible text displays correctly
- [ ] Text selection works within verse boundaries
- [ ] Commentary loads for selected verses
- [ ] Related passages appear within 500ms
- [ ] Navigation works smoothly
- [ ] Mobile layout is usable
- [ ] Offline functionality after initial load

### Data Validation
- [ ] All NT verses present (7,957 total)
- [ ] Commentary linked to correct verses
- [ ] Cross-references are accurate
- [ ] Embeddings generate for all verses
- [ ] Similarity scores are reasonable

This setup guide ensures consistent development environment across machines and team members.