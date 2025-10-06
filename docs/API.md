# Bible Reader API Documentation

This document describes the client-side JavaScript APIs and utility functions available in the Bible Reader application.

## Table of Contents
1. [RAG System API](#rag-system-api)
2. [Data Loader API](#data-loader-api)
3. [Text Selection API](#text-selection-api)
4. [Component APIs](#component-apis)
5. [Data Schemas](#data-schemas)

## RAG System API

Located in `src/utils/ragSystem.js` - Provides semantic search and verse similarity functions.

### `parseVerseId(verseId)`

Parses a verse identifier string into its components.

**Parameters:**
- `verseId` (string): Verse identifier in format "book_chapter_verse" (e.g., "matthew_1_1")

**Returns:**
- `Object`: `{ book, chapter, verse }` or `null` if invalid

**Example:**
```javascript
const verse = ragSystem.parseVerseId("john_3_16");
// Returns: { book: "john", chapter: 3, verse: 16 }
```

---

### `formatVerseReference(verseId)`

Formats a verse ID into a human-readable reference.

**Parameters:**
- `verseId` (string): Verse identifier

**Returns:**
- `string`: Formatted reference (e.g., "John 3:16")

**Example:**
```javascript
const ref = ragSystem.formatVerseReference("john_3_16");
// Returns: "John 3:16"
```

---

### `findRelatedPassages(verseId, count = 5)`

Finds semantically similar passages using RAG.

**Parameters:**
- `verseId` (string): Source verse identifier
- `count` (number): Number of similar passages to return (default: 5)

**Returns:**
- `Promise<Array>`: Array of related passage objects

**Related Passage Object:**
```javascript
{
  verse: "matthew_5_3",        // Verse identifier
  score: 0.85,                 // Similarity score (0-1)
  type: "thematic",            // Connection type
  text: "Blessed are the..."   // Verse text
}
```

**Connection Types:**
- `thematic`: Similar theological themes
- `cross-reference`: Traditional biblical connections
- `parallel`: Same event, different account
- `quotation`: Direct quote
- `allusion`: Indirect reference

**Example:**
```javascript
const related = await ragSystem.findRelatedPassages("john_3_16", 5);
// Returns top 5 most similar verses
```

---

### `getConnectionTypeLabel(type)`

Gets human-readable label for connection type.

**Parameters:**
- `type` (string): Connection type identifier

**Returns:**
- `string`: Formatted label

**Example:**
```javascript
const label = ragSystem.getConnectionTypeLabel("thematic");
// Returns: "Thematic Connection"
```

---

### `getConnectionColor(type)`

Gets TailwindCSS classes for connection type display.

**Parameters:**
- `type` (string): Connection type identifier

**Returns:**
- `string`: Tailwind class names

**Example:**
```javascript
const classes = ragSystem.getConnectionColor("thematic");
// Returns: "bg-blue-100 text-blue-800"
```

---

## Data Loader API

Located in `src/utils/dataLoader.js` - Handles JSON data loading with caching.

### `loadBibleData()`

Loads the complete Bible text data.

**Returns:**
- `Promise<Object>`: Bible data object

**Data Structure:**
```javascript
{
  metadata: {
    version: "American Standard Version",
    scope: "New Testament",
    total_books: 27,
    total_verses: 7217
  },
  [bookName]: {
    metadata: { name, genre, chapters, verses },
    chapters: {
      [chapterNum]: {
        [verseNum]: "verse text..."
      }
    }
  }
}
```

**Example:**
```javascript
const bible = await dataLoader.loadBibleData();
const verse = bible.john.chapters[3][16];
// Returns: "For God so loved the world..."
```

---

### `loadCommentary()`

Loads commentary data for verses.

**Returns:**
- `Promise<Object>`: Commentary data object

**Data Structure:**
```javascript
{
  metadata: {
    sources: ["John Gill", "Matthew Henry"],
    total_commentaries: 4739,
    processing_date: "2025-10-05T..."
  },
  commentaries: {
    [verseId]: {
      john_gill: {
        text: "commentary text...",
        tags: ["theology", "prophecy"],
        length: 1234
      },
      matthew_henry: { ... }
    }
  }
}
```

**Example:**
```javascript
const commentary = await dataLoader.loadCommentary();
const gillCommentary = commentary.commentaries["john_3_16"].john_gill;
```

---

### `loadEmbeddings()`

Loads verse embeddings for RAG system.

**Returns:**
- `Promise<Object>`: Embeddings data

**Data Structure:**
```javascript
{
  metadata: {
    model: "sentence-transformers/all-MiniLM-L6-v2",
    dimension: 384,
    total_verses: 7217
  },
  embeddings: {
    [verseId]: [0.123, -0.456, ...] // 384-dim array
  }
}
```

**Example:**
```javascript
const embeddings = await dataLoader.loadEmbeddings();
const vector = embeddings.embeddings["john_3_16"];
// Returns: Array(384) of float values
```

---

### `loadSimilarityMatrix()`

Loads pre-computed similarity connections.

**Returns:**
- `Promise<Object>`: Similarity matrix data

**Data Structure:**
```javascript
{
  metadata: {
    total_connections: 36096,
    average_per_verse: 5.0,
    computation_date: "2025-10-05T..."
  },
  connections: {
    [verseId]: [
      { verse: "otherVerse", score: 0.85, type: "thematic" },
      ...
    ]
  }
}
```

**Example:**
```javascript
const matrix = await dataLoader.loadSimilarityMatrix();
const connections = matrix.connections["john_3_16"];
// Returns: Array of related verses with scores
```

---

## Text Selection API

Located in `src/utils/textSelection.js` - Handles text selection and verse boundary detection.

### `getSelectedVerse(selection)`

Determines which verse was selected based on text selection.

**Parameters:**
- `selection` (Selection): Browser Selection object

**Returns:**
- `string|null`: Verse ID or null

**Example:**
```javascript
const selection = window.getSelection();
const verseId = textSelection.getSelectedVerse(selection);
// Returns: "john_3_16" or null
```

---

### `clearSelection()`

Clears current text selection.

**Example:**
```javascript
textSelection.clearSelection();
```

---

## Component APIs

### BibleReader Component

**Props:**
```javascript
{
  book: string,              // Current book name
  chapter: number,           // Current chapter number
  onVerseSelect: (verseId) => void,  // Verse selection callback
  selectedVerse: string      // Currently selected verse ID
}
```

**Usage:**
```jsx
<BibleReader
  book="john"
  chapter={3}
  onVerseSelect={handleVerseSelect}
  selectedVerse="john_3_16"
/>
```

---

### Commentary Component

**Props:**
```javascript
{
  selectedVerse: string,          // Verse to show commentary for
  bibleData: Object,              // Full Bible data
  isOpen: boolean,                // Overlay visibility
  onClose: () => void             // Close callback
}
```

**Usage:**
```jsx
<Commentary
  selectedVerse="john_3_16"
  bibleData={bibleData}
  isOpen={isCommentaryOpen}
  onClose={() => setIsCommentaryOpen(false)}
/>
```

---

### RelatedPassages Component

**Props:**
```javascript
{
  selectedVerse: string,          // Source verse for finding relations
  bibleData: Object,              // Full Bible data
  onNavigate: (book, chapter) => void,  // Navigation callback
  isOpen: boolean                 // Panel visibility
}
```

**Usage:**
```jsx
<RelatedPassages
  selectedVerse="john_3_16"
  bibleData={bibleData}
  onNavigate={(book, chapter) => navigate(book, chapter)}
  isOpen={isCommentaryOpen}
/>
```

---

### Navigation Component

**Props:**
```javascript
{
  book: string,                   // Current book
  chapter: number,                // Current chapter
  books: Array<Object>,           // Available books list
  onBookChange: (book) => void,   // Book selection callback
  onChapterChange: (chapter) => void  // Chapter selection callback
}
```

**Book Object:**
```javascript
{
  key: "john",
  name: "John",
  chapters: 21,
  verses: 682
}
```

**Usage:**
```jsx
<Navigation
  book="john"
  chapter={3}
  books={availableBooks}
  onBookChange={setBook}
  onChapterChange={setChapter}
/>
```

---

## Data Schemas

### Verse ID Format

Verse identifiers follow the pattern: `book_chapter_verse`

**Examples:**
- `john_3_16` - John 3:16
- `matthew_5_3` - Matthew 5:3
- `revelation_22_21` - Revelation 22:21

### Book Keys

Book keys use lowercase with underscores for multi-word books:

**Examples:**
- `matthew`, `mark`, `luke`, `john`
- `1_corinthians`, `2_corinthians`
- `1_john`, `2_john`, `3_john`

### Connection Scores

Similarity scores range from 0.0 to 1.0:
- `0.9-1.0`: Extremely similar (nearly identical themes)
- `0.7-0.9`: Highly similar (strong thematic connection)
- `0.5-0.7`: Moderately similar (shared concepts)
- `<0.5`: Not included (filtered out)

### Theological Tags

Commentary entries may include these tags:
- `genealogy`, `messiah`, `covenant`, `prophecy`
- `salvation`, `trinity`, `eschatology`, `ethics`
- `worship`, `discipleship`

---

## Performance Considerations

### Data Loading
- All data files use LocalStorage caching
- First load: ~3 seconds
- Subsequent loads: <100ms (from cache)

### RAG Queries
- Average lookup time: ~250ms
- Uses pre-computed similarity matrix
- No ML inference on client

### Memory Usage
- Bible data: ~1MB in memory
- Commentaries: ~13MB in memory
- Embeddings: ~75MB in memory (loaded on-demand)
- Similarity matrix: ~5.5MB in memory

### Optimization Tips
1. Load embeddings only when needed (first verse selection)
2. Use LocalStorage caching for repeat visits
3. Lazy load commentary data
4. Implement virtual scrolling for long chapters

---

## Error Handling

All async functions may throw errors:

```javascript
try {
  const related = await ragSystem.findRelatedPassages(verseId);
} catch (error) {
  console.error('Failed to load related passages:', error);
  // Handle error appropriately
}
```

Common error scenarios:
- Network failures during JSON loading
- Invalid verse IDs
- Missing data in cache
- Browser storage quota exceeded

---

## Browser Compatibility

### Required Features
- ES6+ (async/await, arrow functions, destructuring)
- LocalStorage API
- Fetch API
- Selection API

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
Not required for modern browsers. For older browsers, consider:
- `core-js` for ES6 features
- `whatwg-fetch` for Fetch API

---

## Development Tools

### Debugging

```javascript
// Enable verbose logging in ragSystem
ragSystem.debug = true;

// Check data loader cache
console.log(localStorage.getItem('bible_data'));

// Inspect embeddings
const embeddings = await dataLoader.loadEmbeddings();
console.log('Embedding dimension:', embeddings.embeddings["john_3_16"].length);
```

### Testing Utilities

```javascript
// Clear all cached data
localStorage.clear();

// Force reload from network
const bible = await dataLoader.loadBibleData(true); // bypass cache

// Validate verse ID format
const isValid = /^[a-z_]+_\d+_\d+$/.test(verseId);
```

---

## License

This API documentation is part of the Bible Reader project.
- Code: Personal/Educational use
- Data: Public domain (ASV Bible, John Gill, Matthew Henry)
