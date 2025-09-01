import fs from 'fs';
import path from 'path';

const NT_BOOKS = [
  { key: 'matthew', name: 'Matthew', genre: 'gospel', chapters: 28 },
  { key: 'mark', name: 'Mark', genre: 'gospel', chapters: 16 },
  { key: 'luke', name: 'Luke', genre: 'gospel', chapters: 24 },
  { key: 'john', name: 'John', genre: 'gospel', chapters: 21 },
  { key: 'acts', name: 'Acts', genre: 'history', chapters: 28 },
  { key: 'romans', name: 'Romans', genre: 'epistle', chapters: 16 },
  { key: '1_corinthians', name: '1 Corinthians', genre: 'epistle', chapters: 16 },
  { key: '2_corinthians', name: '2 Corinthians', genre: 'epistle', chapters: 13 },
  { key: 'galatians', name: 'Galatians', genre: 'epistle', chapters: 6 },
  { key: 'ephesians', name: 'Ephesians', genre: 'epistle', chapters: 6 },
  { key: 'philippians', name: 'Philippians', genre: 'epistle', chapters: 4 },
  { key: 'colossians', name: 'Colossians', genre: 'epistle', chapters: 4 },
  { key: '1_thessalonians', name: '1 Thessalonians', genre: 'epistle', chapters: 5 },
  { key: '2_thessalonians', name: '2 Thessalonians', genre: 'epistle', chapters: 3 },
  { key: '1_timothy', name: '1 Timothy', genre: 'epistle', chapters: 6 },
  { key: '2_timothy', name: '2 Timothy', genre: 'epistle', chapters: 4 },
  { key: 'titus', name: 'Titus', genre: 'epistle', chapters: 3 },
  { key: 'philemon', name: 'Philemon', genre: 'epistle', chapters: 1 },
  { key: 'hebrews', name: 'Hebrews', genre: 'epistle', chapters: 13 },
  { key: 'james', name: 'James', genre: 'epistle', chapters: 5 },
  { key: '1_peter', name: '1 Peter', genre: 'epistle', chapters: 5 },
  { key: '2_peter', name: '2 Peter', genre: 'epistle', chapters: 3 },
  { key: '1_john', name: '1 John', genre: 'epistle', chapters: 5 },
  { key: '2_john', name: '2 John', genre: 'epistle', chapters: 1 },
  { key: '3_john', name: '3 John', genre: 'epistle', chapters: 1 },
  { key: 'jude', name: 'Jude', genre: 'epistle', chapters: 1 },
  { key: 'revelation', name: 'Revelation', genre: 'prophecy', chapters: 22 }
];

function parseVerseReference(line) {
  const match = line.match(/^(\d+):(\d+)\s+(.+)$/);
  if (match) {
    return {
      chapter: parseInt(match[1]),
      verse: parseInt(match[2]),
      text: match[3].trim()
    };
  }
  return null;
}

function cleanVerseText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function processBibleText() {
  console.log('Starting ASV Bible text processing...');
  
  const projectRoot = path.dirname(process.cwd());
  const dataSourcesDir = path.join(projectRoot, 'data-sources', 'asv_bible');
  const outputPath = path.join(projectRoot, 'public', 'data', 'bible_asv.json');
  
  if (!fs.existsSync(dataSourcesDir)) {
    console.error(`Data sources directory not found: ${dataSourcesDir}`);
    console.log('Please create data-sources/asv_bible/ and add Bible text files');
    console.log('Expected files: matthew.txt, mark.txt, luke.txt, etc.');
    return;
  }

  const bibleData = {
    metadata: {
      version: "American Standard Version",
      scope: "New Testament",
      total_books: NT_BOOKS.length,
      total_verses: 0
    },
    books: {}
  };

  let totalVerses = 0;

  for (const book of NT_BOOKS) {
    console.log(`Processing ${book.name}...`);
    
    const filePath = path.join(dataSourcesDir, `${book.key}.txt`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath} - skipping ${book.name}`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      const bookData = {
        metadata: {
          name: book.name,
          genre: book.genre,
          chapters: book.chapters,
          verses: 0
        },
        chapters: {}
      };

      let currentChapter = null;
      let verseCount = 0;

      for (const line of lines) {
        const verseRef = parseVerseReference(line);
        if (verseRef) {
          if (book.key === 'galatians') {
            console.log(`📝 Galatians verse: ${verseRef.chapter}:${verseRef.verse}`);
          }
          
          if (verseRef.chapter !== currentChapter) {
            currentChapter = verseRef.chapter;
            if (!bookData.chapters[currentChapter]) {
              bookData.chapters[currentChapter] = {};
            }
          }
          
          const cleanText = cleanVerseText(verseRef.text);
          bookData.chapters[currentChapter][verseRef.verse] = cleanText;
          verseCount++;
          totalVerses++;
        }
      }

      bookData.metadata.verses = verseCount;
      bibleData.books[book.key] = bookData;
      
      console.log(`  ✅ ${book.name}: ${verseCount} verses processed`);
      
    } catch (error) {
      console.error(`Error processing ${book.name}:`, error.message);
    }
  }

  bibleData.metadata.total_verses = totalVerses;

  try {
    fs.writeFileSync(outputPath, JSON.stringify(bibleData, null, 2));
    console.log(`\n✅ Bible processing complete!`);
    console.log(`📊 Total verses processed: ${totalVerses}`);
    console.log(`📁 Output written to: ${outputPath}`);
    console.log(`📏 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB`);
  } catch (error) {
    console.error('Error writing output file:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processBibleText();
}