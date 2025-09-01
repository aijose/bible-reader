# Bible Reader with Commentary - Product Requirements Document

## Project Overview

A web-based Bible reading application that provides intelligent commentary explanations and related passage discovery through RAG (Retrieval-Augmented Generation) when users select text.

### Target User
Personal use, single user, desktop-primary with mobile compatibility.

### Core Value Proposition
Quick access to scholarly commentary and related biblical passages through simple text selection, enhancing Bible study with contextual insights.

## Technical Specifications

### Tech Stack (All Free)
- **Frontend**: React + Vite + TailwindCSS
- **Deployment**: Netlify/Vercel free tier
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Data Processing**: Node.js scripts
- **Storage**: Static JSON files + localStorage caching
- **Icons**: Lucide React

### Bible Text
- **Version**: American Standard Version (ASV) - public domain
- **Scope**: New Testament only (v1), extensible to Old Testament
- **Structure**: Verse-level granularity with book/chapter/verse addressing

### Commentary Sources
- **Primary**: Matthew Henry's Commentary
- **Secondary**: John Gill's Exposition
- **Extension**: Architecture supports additional commentaries
- **Storage**: Verse-linked with source attribution

## Functional Requirements

### Core Features

#### 1. Bible Reader Interface
- Clean, readable text display
- Chapter navigation (previous/next, jump to chapter)
- Book selection dropdown
- Responsive design (desktop primary, mobile compatible)

#### 2. Text Selection & Commentary
- **Selection**: Single verse maximum per selection
- **Trigger**: Text selection shows small popup/indicator
- **Display**: Commentary appears in slide-out sidebar
- **Content**: Both commentaries displayed sequentially
- **Length**: First 200 characters + expandable "read more"

#### 3. Related Passages (RAG System)
- **Retrieval**: Top 5 related passages per selection
- **Sources**: Direct references (weight 1.0), semantic similarity (weight 0.7), theological concepts (weight 0.8)
- **Display**: Reference + full text if ≤5 verses, otherwise reference only
- **Types**: Direct references, cross-references, thematic connections, prophetic fulfillments

#### 4. Genre-Aware Processing
- **Gospels**: Emphasize parallel passages, Jesus's teachings
- **Epistles**: Focus on doctrinal connections
- **Prophecy**: Highlight fulfillment patterns
- **Historical**: Context and cultural background

### User Interaction Flow
1. User reads Bible text in main panel
2. User selects text (single verse limit)
3. Small selection indicator appears
4. User clicks indicator
5. Sidebar opens with commentary and related passages
6. User can expand commentary sections or navigate to related passages

## Data Architecture

### Bible Text Schema
```json
{
  "books": {
    "matthew": {
      "metadata": {
        "name": "Matthew",
        "genre": "gospel",
        "chapters": 28
      },
      "chapters": {
        "1": {
          "1": "verse text here",
          "2": "verse text here"
        }
      }
    }
  }
}
```

### Commentary Schema
```json
{
  "matthew_1_1": [
    {
      "source": "Matthew Henry",
      "text": "commentary text",
      "theological_tags": ["genealogy", "messiah", "davidic_covenant"]
    },
    {
      "source": "John Gill",
      "text": "commentary text",
      "theological_tags": ["genealogy", "jewish_context"]
    }
  ]
}
```

### Embeddings Schema
```json
{
  "verse_embeddings": {
    "matthew_1_1": [0.1, 0.2, 0.3, ...],
    "matthew_1_2": [0.2, 0.1, 0.4, ...]
  },
  "similarity_matrix": {
    "matthew_1_1": {
      "luke_3_23": {"score": 0.85, "type": "thematic"},
      "romans_1_3": {"score": 0.92, "type": "direct_reference"}
    }
  }
}
```

### Cross-References Schema
```json
{
  "direct_references": {
    "matthew_1_1": [
      "2_samuel_7_12",
      "genesis_22_18",
      "romans_1_3"
    ]
  }
}
```

## Implementation Phases

### Phase 1: Data Processing Pipeline
**Duration**: 2-3 days
**Components**:
- ASV Bible text parser and JSON converter
- Commentary parser (Matthew Henry + John Gill)
- Cross-reference data compilation
- Basic verse-to-verse mapping

**Deliverables**:
- `bible_asv.json`
- `commentaries.json` 
- `cross_references.json`
- Processing scripts in `/scripts` directory

### Phase 2: Embedding Generation
**Duration**: 1-2 days
**Components**:
- Embedding model integration (all-MiniLM-L6-v2)
- Verse embedding generation
- Similarity matrix pre-computation
- Weighted scoring system

**Deliverables**:
- `embeddings.json`
- `similarity_matrix.json`
- Embedding generation scripts

### Phase 3: Core React Application
**Duration**: 3-4 days
**Components**:
- Bible reader component with text display
- Text selection handling
- Basic sidebar for commentary display
- Chapter/book navigation

**Deliverables**:
- Working Bible reader
- Text selection functionality
- Commentary display (static data)

### Phase 4: RAG Integration
**Duration**: 2-3 days
**Components**:
- Client-side vector search
- Related passage retrieval
- Scoring and ranking system
- Sidebar enhancement for related passages

**Deliverables**:
- Complete RAG functionality
- Related passage display
- Integrated user experience

### Phase 5: Polish & Optimization
**Duration**: 1-2 days
**Components**:
- Loading states and error handling
- Mobile responsiveness
- Performance optimization
- Browser caching strategy

**Deliverables**:
- Production-ready application
- Deployment configuration

## Technical Decisions & Rationale

### Simplified Solutions Chosen

1. **Verse Addressing**: Use ASV canonical numbering, map other sources to it
2. **Commentary Storage**: Per-verse storage for simplicity
3. **Selection Boundaries**: Single verse only (avoids complexity)
4. **Mobile UI**: Stack sidebar below on mobile (simpler than overlay)
5. **Cross-References**: Traditional chain references (well-established)
6. **Similarity Threshold**: Top 5 results above 0.3 score (simple ranking)
7. **Commentary Disagreement**: Sequential display (let user compare)
8. **Search**: Not in v1 (reduces complexity)
9. **Offline**: Not in v1 (localStorage only for caching)

### Performance Considerations

- **Bundle Size**: NT-only keeps initial load reasonable
- **Data Loading**: Preload Bible text, lazy-load commentary/embeddings
- **Caching**: localStorage for repeat visits
- **Embeddings**: Pre-computed for speed over flexibility

## Success Criteria

### Functional Success
- [ ] User can select any NT verse and get relevant commentary
- [ ] Related passages appear within 500ms of selection
- [ ] Commentary from both sources displays correctly
- [ ] Related passages show appropriate context (5 verses or less)
- [ ] Mobile interface remains usable

### Technical Success
- [ ] Initial load under 3 seconds on broadband
- [ ] Selection-to-commentary display under 500ms
- [ ] No JavaScript errors in normal usage
- [ ] Works offline after initial load
- [ ] Data integrity: commentary matches verses correctly

### User Experience Success
- [ ] Intuitive text selection process
- [ ] Commentary provides meaningful insight
- [ ] Related passages feel genuinely connected
- [ ] Navigation between chapters is smooth
- [ ] Sidebar doesn't interfere with reading flow

## Future Extensibility

### Planned Extensions (Post-v1)
1. **Old Testament Integration**: Same architecture, expanded data
2. **Additional Commentaries**: Barnes' Notes, Jamieson-Fausset-Brown
3. **Server-Side Migration**: API endpoints for data serving
4. **Advanced Search**: Full-text search across Bible and commentary
5. **Persistent Annotations**: User notes and highlights

### Architecture Considerations for Extensions
- Component structure supports additional data sources
- RAG system can incorporate new embedding models
- Commentary display component accepts variable numbers of sources
- Data schemas extensible without breaking changes

## File Structure
```
bible-reader/
├── public/
│   ├── data/
│   │   ├── bible_asv.json
│   │   ├── commentaries.json
│   │   ├── embeddings.json
│   │   └── cross_references.json
├── src/
│   ├── components/
│   │   ├── BibleReader.jsx
│   │   ├── Commentary.jsx
│   │   ├── RelatedPassages.jsx
│   │   └── Navigation.jsx
│   ├── utils/
│   │   ├── ragSystem.js
│   │   ├── dataLoader.js
│   │   └── textSelection.js
│   └── App.jsx
├── scripts/
│   ├── process_bible.js
│   ├── process_commentary.js
│   ├── generate_embeddings.js
│   └── build_similarity_matrix.js
└── package.json
```

## Development Notes

### Data Sources
- ASV Bible: Available from multiple public domain sources
- Matthew Henry: Available from CCEL (Christian Classics Ethereal Library)
- John Gill: Available from public domain archives
- Cross-references: Traditional study Bible reference systems

### Embedding Model Justification
**sentence-transformers/all-MiniLM-L6-v2**:
- Compact size (~90MB) suitable for client-side
- Strong performance on semantic similarity tasks
- Good balance of quality vs. size for personal use
- Proven performance on religious/biblical text

This PRD provides complete specifications for building the Bible reader application with Claude Code while maintaining flexibility for future enhancements.