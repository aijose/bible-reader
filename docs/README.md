# Bible Reader Documentation

This directory contains comprehensive documentation for the Bible Reader with Commentary project.

## Documentation Structure

### 📁 `architecture/`
Technical architecture and system design documentation

- `overview.md` - High-level system architecture and component relationships
- `data-schemas.md` - JSON schema specifications for all data files
- `components.md` - React component architecture and data flow

### 📁 `data-sources/`
Information about biblical text and commentary sources

- `bible-text.md` - ASV Bible text specifications and structure
- `commentary-sources.md` - Matthew Henry and John Gill commentary details
- `cross-references.md` - Traditional cross-reference systems and mapping

### 📁 `development/`
Development guides and processes

- `setup-guide.md` - Complete development environment setup
- `data-pipeline.md` - Data processing workflow and scripts
- `testing-strategy.md` - Testing approach and success criteria

## Quick Reference

### Key Project Files
- `../bible-reader-prd.md` - Product Requirements Document
- `../IMPLEMENTATION_PLAN.md` - 5-phase development roadmap
- `../DEPENDENCIES.md` - Setup instructions and dependencies
- `../CLAUDE.md` - Context file for AI assistants

### Current Status
**✅ COMPLETE**: Fully functional Bible Reader application with RAG-powered commentary system

### Application Features
- **Bible Text**: ASV Bible with partial NT coverage (see Available Content below)
- **Commentary**: Matthew Henry and John Gill commentary integration
- **RAG System**: Semantic search with 1,198 verse embeddings and 6,011 connections
- **Related Passages**: Top 5 similarity matches with connection types and scores
- **Full-Width Commentary**: Overlay spans entire browser width with proper scrolling
- **Responsive Design**: Desktop overlay (640px+) and mobile bottom sheet with height constraints
- **Performance**: 192KB optimized bundle, service worker, comprehensive caching
- **Error Handling**: Loading states, retry mechanisms, offline support

### Available Content
- **Matthew**: Chapters 1-21 (21/28 chapters) - Full functionality
- **Mark**: Chapters 1-9 (9/16 chapters) - Full functionality
- **Luke**: No chapters (API rate limited)
- **John-Revelation**: 24 books pending (API rate limits)

### Quick Start
```bash
npm run dev    # Start at http://localhost:3001
```

### Usage
1. Select book (Matthew chapters 1-21 or Mark chapters 1-9) from navigation
2. Click any verse to view commentary and related passages
3. Related passages show semantic similarity scores and connection types
4. Commentary includes Matthew Henry and John Gill insights
5. **Note**: Luke and other books show "(not available)" due to API rate limits

### Development References
1. Check `../CLAUDE.md` for complete project context
2. Review `DEPLOYMENT.md` for production deployment
3. See `../UV_SETUP.md` for Python environment setup

This documentation is designed to enable seamless project continuation across different development sessions.