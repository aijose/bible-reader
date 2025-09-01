# Data Collection Procedures

This document outlines the procedures for collecting Bible text and commentary data used in the Bible Reader application.

## Overview

The Bible Reader uses multiple data sources that need to be collected, processed, and integrated:
1. **Bible Text**: American Standard Version (ASV) from public domain sources
2. **Commentary**: Matthew Henry and John Gill commentaries from historical archives
3. **Embeddings**: Generated using sentence-transformers for semantic search

---

## Bible Text Collection

### Data Source
- **Primary**: bible-api.com ASV Bible text
- **Format**: JSON API responses with verse arrays
- **API Endpoint**: `https://bible-api.com/{book}%20{chapter}?translation=asv`

### Collection Process

1. **Setup Download Script**
   ```bash
   cd scripts
   node download_asv_working.js
   ```

2. **API Configuration**
   - bible-api.com provides free access to ASV text
   - Built-in rate limiting (1-2 second delays between requests)
   - Returns structured JSON with verse arrays

3. **Book Coverage Strategy**
   - Downloads books in priority order: Gospels → Epistles → Other books
   - Handles URL encoding for books with spaces (e.g., "1%20corinthians")
   - Continues processing even if some chapters fail

4. **Error Handling**
   - Automatic retries with exponential backoff
   - Logs failed downloads for manual review
   - Graceful handling of missing chapters

### Example Download Output
```
📖 Starting ASV Bible download...
✅ Downloaded Matthew chapter 1 (28 verses)
✅ Downloaded Matthew chapter 2 (23 verses)
⚠️ Rate limit protection: waiting 2 seconds...
✅ Downloaded John chapter 1 (51 verses)
```

### File Structure
```
data-sources/
  asv_bible/
    matthew.txt
    john.txt
    galatians.txt
    ephesians.txt
    philippians.txt
    revelation.txt  # Partial (chapters 20-22 only)
    ...
```

---

## Commentary Collection

### Data Sources

#### Matthew Henry's Commentary
- **Source**: www.sacred-texts.com and archive.org
- **Coverage**: Complete commentary on all Bible books
- **Format**: Verse-by-verse exposition
- **API**: `https://www.sacred-texts.com/chr/mhcc/{book}.htm`

#### John Gill's Exposition
- **Source**: www.studylight.org and public domain archives  
- **Coverage**: Detailed verse-by-verse commentary
- **Format**: Theological exposition with historical context
- **API**: Various endpoints depending on book

### Collection Process

1. **Automated Download (Recommended)**
   Use web scraping tools or APIs where available:
   ```bash
   cd scripts
   # Download Matthew Henry from sacred-texts.com
   # Download John Gill from studylight.org archives
   ```

2. **Manual Collection Strategy**
   Due to varying source formats, commentary collection often requires manual steps:
   
   **For Matthew Henry:**
   - Visit sacred-texts.com/chr/mhcc/ for complete commentaries
   - Download HTML pages and extract text content
   - Clean formatting and save as `data-sources/matthew_henry/{book}.txt`
   
   **For John Gill:**
   - Access studylight.org or archive.org for Gill's Exposition
   - Download verse-by-verse sections
   - Save as `data-sources/john_gill/{book}.txt`

3. **Text Format Requirements**
   Commentary files should follow this format:
   ```
   1:1 [Commentary text for verse 1:1]
   1:2 [Commentary text for verse 1:2]
   2:1 [Commentary text for verse 2:1]
   ```
   
   **Current Successful Formats:**
   - Matthew Henry: Paragraph format with verse-level commentary
   - John Gill: Detailed exposition format with clear verse delineation

### Processing Pipeline

1. **Parse Commentary Files**
   ```bash
   cd scripts
   node process_commentary.js
   ```

2. **Output Generation**
   - Processes all books in `data-sources/matthew_henry/` and `data-sources/john_gill/`
   - Extracts verse-level commentary
   - Adds theological tags (genealogy, messiah, covenant, etc.)
   - Generates preview text (200 character limit)
   - Creates `public/data/commentaries.json`

3. **Quality Assurance**
   - Validates verse references match Bible text
   - Removes duplicate or malformed entries
   - Adds source attribution and metadata

### Example Commentary Processing Output
```
Starting commentary processing...
Processing Matthew Henry commentary for matthew...
  ✅ Matthew Henry: 6 commentary entries processed
Processing John Gill commentary for john...
  ✅ John Gill: 101 commentary entries processed
Processing Matthew Henry commentary for galatians...
  ✅ Matthew Henry: 149 commentary entries processed

✅ Commentary processing complete!
📊 Total verses with commentary: 516
📁 Output written to: public/data/commentaries.json
📏 File size: 2.1MB
```

---

## Processing Scripts

### Bible Text Processing
```bash
cd scripts
node download_asv_working.js     # Download ASV chapters from bible-api.com
node process_bible.js            # Convert downloaded text to structured JSON
```

### Commentary Processing  
```bash
cd scripts
node process_commentary.js       # Parse commentary files into structured JSON
```

### Embedding Generation
```bash
cd scripts
uv run generate_embeddings.py    # Generate 384-dimensional embeddings for all verses
```

### Complete Pipeline
```bash
# Full data generation pipeline
cd scripts

# 1. Download Bible text
node download_asv_working.js

# 2. Process Bible into JSON structure  
node process_bible.js

# 3. Process commentary sources
node process_commentary.js

# 4. Generate embeddings for semantic search
uv run generate_embeddings.py

# 5. Update cache version to force browser refresh
# Edit src/utils/dataLoader.js and increment version number
```

---

## Current Data Status

### Bible Text Coverage
- ✅ **Complete**: Matthew, John, Galatians, Ephesians, Philippians
- ⚠️ **Partial**: Revelation (chapters 20-22 only)
- ❌ **Missing**: Mark, Luke, Acts, Romans, Corinthians, etc.

### Commentary Coverage  
- ✅ **Matthew**: Matthew Henry + John Gill (12 entries)
- ✅ **John**: John Gill (101 entries)
- ✅ **Galatians**: Matthew Henry + John Gill (235 entries)
- ✅ **Ephesians**: John Gill (155 entries)
- ✅ **Philippians**: John Gill (103 entries)
- ❌ **Missing**: All other NT books

### Embeddings Coverage
- **Total Verses**: 1,681 verses across 6 books
- **Model**: sentence-transformers/all-MiniLM-L6-v2
- **Dimensions**: 384 per verse
- **File Size**: ~5MB

---

## Troubleshooting

### Common Issues

1. **API Rate Limits**
   - **Symptom**: Download script stops or gets 429 errors
   - **Solution**: Increase delays between requests, run in smaller batches
   - **Prevention**: Use conservative rate limiting (2-3 seconds between requests)

2. **Missing Chapters**
   - **Symptom**: Book appears in dropdown but chapters are empty
   - **Cause**: Metadata claims more chapters than actually downloaded
   - **Solution**: Update metadata to match actual chapter count or download missing chapters

3. **Commentary Parsing Errors**
   - **Symptom**: Commentary processing fails or produces empty output
   - **Cause**: Unexpected text format or encoding issues
   - **Solution**: Review source files, adjust parsing patterns in `process_commentary.js`

4. **Cache Issues**
   - **Symptom**: Changes not appearing in browser
   - **Solution**: Update cache version in `dataLoader.js` and clear browser cache

### Data Validation

Before deploying, verify:
- [ ] All intended books have both Bible text and commentary
- [ ] Chapter counts match between metadata and actual data
- [ ] Commentary processing completes without errors
- [ ] Embeddings include all available verses
- [ ] Browser cache version updated after data changes

---

## Scaling Considerations

### Adding New Books
1. Download Bible text using existing scripts
2. Collect commentary sources for both Henry and Gill
3. Run commentary processing pipeline
4. Regenerate embeddings to include new verses
5. Update cache version to force browser refresh

### Data Size Management
- **Bible Text**: ~1MB for complete NT
- **Commentary**: ~2-5MB depending on coverage
- **Embeddings**: ~5MB for complete NT
- **Total**: ~8-11MB for complete application data

The client-side approach scales well but requires careful attention to initial download size and caching strategy.