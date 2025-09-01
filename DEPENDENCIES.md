# Bible Reader - Dependencies and Setup

## System Requirements
- Node.js (v18+ recommended, though current setup uses v18.19.1)
- npm (v9+)
- Git

## Installation Commands

### 1. Initial Setup
```bash
# Initialize git repository
git init

# Create directory structure
mkdir -p src/components src/utils public/data scripts

# Initialize npm project
npm init -y
```

### 2. Core Dependencies
```bash
# Vite and React
npm install vite @vitejs/plugin-react react react-dom

# TailwindCSS (development dependencies)
npm install -D tailwindcss postcss autoprefixer

# Icons
npm install lucide-react
```

### 3. Python Dependencies (for data processing)
```bash
# Required for Phase 2 - Embeddings
pip install sentence-transformers torch numpy
```

## Project Structure
```
bible-reader/
├── public/
│   └── data/                    # Static JSON data files
│       ├── bible_asv.json       # ASV Bible text
│       ├── commentaries.json    # Matthew Henry + John Gill
│       ├── embeddings.json      # Verse embeddings
│       ├── cross_references.json# Traditional cross-references
│       └── similarity_matrix.json# Pre-computed similarities
├── src/
│   ├── components/              # React components
│   │   ├── BibleReader.jsx      # Main text display
│   │   ├── Commentary.jsx       # Commentary sidebar
│   │   ├── RelatedPassages.jsx  # Related verses
│   │   └── Navigation.jsx       # Book/chapter nav
│   ├── utils/                   # Utility modules
│   │   ├── ragSystem.js         # Vector search system
│   │   ├── dataLoader.js        # JSON data loading
│   │   └── textSelection.js     # Selection handling
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # TailwindCSS imports
├── scripts/                     # Data processing scripts
│   ├── process_bible.js         # ASV text parser
│   ├── process_commentary.js    # Commentary parser
│   ├── generate_embeddings.js   # Embedding generation
│   └── build_similarity_matrix.js# Similarity computation
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # TailwindCSS config
├── postcss.config.js            # PostCSS config
└── package.json                 # Dependencies and scripts
```

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Processing Pipeline Commands
```bash
# Phase 1: Process Bible and commentary data
node scripts/process_bible.js
node scripts/process_commentary.js

# Phase 2: Generate embeddings and similarity matrix
python scripts/generate_embeddings.py
node scripts/build_similarity_matrix.js
```

## Deployment Options
- **Netlify**: Connect to Git repository, auto-deploy on push
- **Vercel**: Import Git repository, automatic builds
- **GitHub Pages**: Build and deploy to gh-pages branch

## Configuration Notes
- TailwindCSS configured for all JSX files in src/
- Vite configured with React plugin and port 3000
- Project uses ES modules (type: "module" in package.json)
- Git repository initialized with standard .gitignore

## Version Information
- React: ^19.1.1
- Vite: ^7.1.3
- TailwindCSS: ^4.1.12
- Lucide React: ^0.542.0

This setup provides a complete development environment for the Bible Reader application following the PRD specifications.