# Data Processing Pipeline

## Overview

The data pipeline transforms raw biblical text and commentary sources into optimized JSON files for the React application.

## Pipeline Stages

### Stage 1: Raw Data Collection
**Input**: External data sources
**Output**: Raw text files in `data-sources/`
**Duration**: Manual (1-2 hours)

```bash
data-sources/
├── asv_bible/
│   ├── matthew.txt
│   ├── mark.txt
│   └── ...
├── matthew_henry/
│   ├── matthew.txt
│   └── ...
└── john_gill/
    ├── matthew.txt
    └── ...
```

### Stage 2: Bible Text Processing
**Script**: `scripts/process_bible.js`
**Input**: `data-sources/asv_bible/*.txt`
**Output**: `public/data/bible_asv.json`

```javascript
// Key processing steps:
1. Parse book/chapter/verse structure
2. Clean text formatting
3. Validate verse numbering
4. Generate metadata (genres, counts)
5. Create hierarchical JSON structure
```

### Stage 3: Commentary Processing
**Script**: `scripts/process_commentary.js`
**Input**: `data-sources/matthew_henry/*.txt`, `data-sources/john_gill/*.txt`
**Output**: `public/data/commentaries.json`

```javascript
// Key processing steps:
1. Parse commentary by verse
2. Extract theological themes
3. Generate preview text (200 chars)
4. Link to verse references
5. Combine both sources per verse
```

### Stage 4: Cross-Reference Compilation
**Script**: `scripts/build_cross_references.js`
**Input**: Traditional reference databases
**Output**: `public/data/cross_references.json`

```javascript
// Key processing steps:
1. Aggregate traditional references
2. Categorize by reference type
3. Assign weights by connection strength
4. Validate verse connections
5. Generate thematic groupings
```

### Stage 5: Embedding Generation
**Script**: `scripts/generate_embeddings.py`
**Input**: `public/data/bible_asv.json`
**Output**: `public/data/embeddings.json`

```python
# Key processing steps:
1. Load sentence-transformers model
2. Generate embeddings for each verse
3. Normalize vectors for similarity search
4. Store in efficient JSON format
5. Validate embedding quality
```

### Stage 6: Similarity Matrix
**Script**: `scripts/build_similarity_matrix.js`
**Input**: `public/data/embeddings.json`, `public/data/cross_references.json`
**Output**: `public/data/similarity_matrix.json`

```javascript
// Key processing steps:
1. Compute cosine similarity between all verses
2. Apply reference type weights
3. Filter by similarity threshold (>0.3)
4. Keep top 5 results per verse
5. Optimize for client-side loading
```

## Script Dependencies

### Node.js Scripts
```json
{
  "fs": "File system operations",
  "path": "Path utilities", 
  "readline": "Text file processing"
}
```

### Python Scripts
```python
# requirements.txt
sentence-transformers==2.2.2
torch>=1.9.0
numpy>=1.21.0
pandas>=1.3.0
```

## Data Quality Assurance

### Validation Checks
1. **Completeness**: All 7,957 NT verses processed
2. **Accuracy**: Verse text matches source
3. **Consistency**: Uniform formatting across books
4. **Linking**: Commentary properly linked to verses
5. **Performance**: File sizes optimized for web delivery

### Error Handling
- Missing verses logged and flagged
- Malformed commentary sections skipped with warnings
- Invalid cross-references filtered out
- Embedding generation failures reported

## Performance Considerations

### File Size Targets
- `bible_asv.json`: ~500KB (compressed)
- `commentaries.json`: ~2MB (with compression)
- `embeddings.json`: ~12MB (384-dim × 7,957 verses)
- `similarity_matrix.json`: ~3MB (top 5 per verse)

### Optimization Strategies
- JSON minification
- Gzip compression on serve
- Lazy loading for large files
- localStorage caching

## Pipeline Execution

### Full Pipeline Run
```bash
# Ensure data sources are ready
ls data-sources/

# Run complete pipeline
node scripts/process_bible.js
node scripts/process_commentary.js  
node scripts/build_cross_references.js
python scripts/generate_embeddings.py
node scripts/build_similarity_matrix.js

# Verify outputs
ls -la public/data/
```

### Incremental Updates
- Individual scripts can be run independently
- Dependency order: Bible → Commentary → Cross-refs → Embeddings → Similarity
- Changes to source data require full re-processing

This pipeline design ensures reliable, repeatable data processing while maintaining data quality and performance requirements.