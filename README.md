# Bible Reader with AI-Powered Commentary

A modern, intelligent Bible reading application featuring AI-powered semantic search, comprehensive commentary, and related passage discovery.

![Bible Reader Interface](docs/images/bible_reader_chapter.png)

## ✨ Features

### 📖 Complete New Testament
- **7,217 verses** from all 27 NT books (ASV translation)
- Clean, verse-by-verse reading interface
- Book and chapter navigation
- Mobile-responsive design

### 🤖 AI-Powered Related Passages
- **Semantic search** using sentence-transformers embeddings
- **36,096 similarity connections** across all verses
- Top 5 most relevant passages for any selected verse
- Connection strength scoring (0-100%)
- Automatic connection type classification

![Commentary and Related Passages](docs/images/bible_reader_commentary_and_related_passages.png)

### 📚 Comprehensive Commentary
- **John Gill's Exposition** - Detailed theological commentary
- **Matthew Henry Commentary** - Practical spiritual insights
- **4,739 verses** with commentary coverage
- Theological tagging system
- Expandable commentary sections

### ⚡ Performance Optimized
- **<3s initial load time**
- **<500ms** commentary/passage lookup
- **192KB optimized bundle**
- Service worker for offline support
- LocalStorage caching for repeat visits
- Progressive web app capabilities

### 📱 Responsive Design
- **Desktop**: Full-width commentary overlay (640px+)
- **Mobile**: Bottom sheet with touch-friendly controls
- **Adaptive layout** with proper scrolling
- **Accessible** keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ with uv (for data processing only)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bible_reader

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see the app in action.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Verses** | 7,217 (Complete NT) |
| **Books** | 27 (All NT books) |
| **Commentary Verses** | 4,739 |
| **Embeddings** | 7,217 (384-dimensional) |
| **Similarity Connections** | 36,096 |
| **Bundle Size** | 192KB (optimized) |
| **Data Size** | 94.5MB total |

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + Vite 5
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Deployment**: Netlify/Vercel ready

### Data Pipeline
```
Raw Sources → Processing Scripts → Static JSON → Client App
     ↓               ↓                  ↓            ↓
  ASV Bible    Bible Parser      bible_asv.json   React
  Commentaries Commentary Proc   commentaries.json Components
  Cross-refs   Embedding Gen     embeddings.json   RAG System
               Similarity Build  similarity_matrix.json
```

### Client-Side Architecture
- **Static JSON files** for predictable performance
- **Pre-computed embeddings** for instant semantic search
- **LocalStorage caching** for offline capability
- **Lazy loading** for optimal initial load
- **Service worker** for PWA functionality

## 📖 Usage

### Basic Reading
1. Select a book from the navigation dropdown
2. Choose a chapter
3. Read verses in a clean, distraction-free interface

### Discovering Commentary
1. Click any verse to select it
2. Commentary panel opens automatically
3. View John Gill and Matthew Henry insights
4. Expand/collapse sections as needed

### Finding Related Passages
1. Select any verse
2. Related Passages section appears below commentary
3. See top 5 most semantically similar verses
4. Click any related passage to navigate to it
5. View similarity scores and connection types

## 🛠️ Development

### Project Structure
```
bible_reader/
├── src/
│   ├── components/          # React components
│   │   ├── BibleReader.jsx  # Main text display
│   │   ├── Commentary.jsx   # Commentary overlay
│   │   ├── RelatedPassages.jsx  # RAG-powered suggestions
│   │   └── Navigation.jsx   # Book/chapter nav
│   ├── utils/
│   │   ├── ragSystem.js     # Vector search & similarity
│   │   ├── dataLoader.js    # JSON loading & caching
│   │   └── textSelection.js # Selection handling
│   └── App.jsx              # Main application
├── public/data/             # Static JSON data files
├── scripts/                 # Data processing scripts
├── docs/                    # Comprehensive documentation
└── README.md               # This file
```

### Data Processing

```bash
# Download Bible text (all 27 NT books)
node scripts/download_all_books.js

# Download commentaries (John Gill)
node scripts/download_commentaries.js

# Process raw data into JSON
node scripts/process_bible.js
node scripts/process_commentary.js

# Generate embeddings (requires Python + uv)
cd scripts
uv run python generate_embeddings.py

# Build similarity matrix
cd ..
node scripts/build_similarity_matrix.js
```

### Python Environment Setup

```bash
# Create virtual environment
uv venv

# Activate environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Getting Started](docs/README.md)** - Quick reference and navigation
- **[Architecture](docs/architecture/)** - System design and component structure
- **[Data Sources](docs/data-sources/)** - Bible text and commentary information
- **[Development](docs/development/)** - Setup guides and data pipeline
- **[Deployment](docs/DEPLOYMENT.md)** - Production deployment instructions

### Key Documentation Files
- `CLAUDE.md` - AI assistant context file
- `bible-reader-prd.md` - Product Requirements Document
- `IMPLEMENTATION_PLAN.md` - Development roadmap
- `DEPENDENCIES.md` - Dependency information

## 🎯 Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Initial Load | <3s | ✅ 2.8s |
| Commentary Lookup | <500ms | ✅ 250ms |
| Bundle Size | <200KB | ✅ 192KB |
| Mobile Responsive | Yes | ✅ Full support |
| Offline Support | Yes | ✅ After first visit |

## 🔄 RAG System Details

### Embedding Generation
- Model: `sentence-transformers/all-MiniLM-L6-v2`
- Dimension: 384
- Coverage: All 7,217 verses
- Processing: Batch size 100, ~2min total time

### Similarity Computation
- Algorithm: Cosine similarity
- Threshold: 0.5 minimum similarity
- Top-K: 5 most similar passages per verse
- Average connections: 5.0 per verse

### Connection Types
- **Thematic**: Similar theological themes
- **Cross-Reference**: Traditional biblical connections
- **Parallel Passage**: Same event, different gospel
- **Quotation**: OT quoted in NT
- **Allusion**: Indirect reference

## 🚢 Deployment

### Netlify Deployment
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# None required (static site)
```

### Vercel Deployment
```bash
# Automatic deployment from Git
# Framework: Vite
# Build command: npm run build
# Output directory: dist
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational and personal use.

### Attribution
- **ASV Bible Text**: Public domain
- **John Gill's Exposition**: Public domain
- **Matthew Henry Commentary**: Public domain
- **Sentence Transformers**: Apache 2.0 License

## 🔗 Links

- **Documentation**: See `docs/` directory
- **Data Processing**: See `scripts/` directory
- **Component Examples**: See `src/components/`

## 📞 Support

For issues or questions:
1. Check the [documentation](docs/)
2. Review existing code comments
3. See `CLAUDE.md` for project context

## 🎉 Acknowledgments

Built with:
- React and Vite for fast development
- TailwindCSS for beautiful styling
- Sentence Transformers for AI embeddings
- Public domain biblical texts and commentaries

---

**Made with ❤️ for Bible study and spiritual growth**
