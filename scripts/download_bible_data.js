import fs from 'fs';
import path from 'path';

const NT_BOOKS = [
  { key: 'matthew', name: 'Matthew', api_name: 'matthew' },
  { key: 'mark', name: 'Mark', api_name: 'mark' },
  { key: 'luke', name: 'Luke', api_name: 'luke' },
  { key: 'john', name: 'John', api_name: 'john' },
  { key: 'acts', name: 'Acts', api_name: 'acts' },
  { key: 'romans', name: 'Romans', api_name: 'romans' },
  { key: '1_corinthians', name: '1 Corinthians', api_name: '1-corinthians' },
  { key: '2_corinthians', name: '2 Corinthians', api_name: '2-corinthians' },
  { key: 'galatians', name: 'Galatians', api_name: 'galatians' },
  { key: 'ephesians', name: 'Ephesians', api_name: 'ephesians' },
  { key: 'philippians', name: 'Philippians', api_name: 'philippians' },
  { key: 'colossians', name: 'Colossians', api_name: 'colossians' },
  { key: '1_thessalonians', name: '1 Thessalonians', api_name: '1-thessalonians' },
  { key: '2_thessalonians', name: '2 Thessalonians', api_name: '2-thessalonians' },
  { key: '1_timothy', name: '1 Timothy', api_name: '1-timothy' },
  { key: '2_timothy', name: '2 Timothy', api_name: '2-timothy' },
  { key: 'titus', name: 'Titus', api_name: 'titus' },
  { key: 'philemon', name: 'Philemon', api_name: 'philemon' },
  { key: 'hebrews', name: 'Hebrews', api_name: 'hebrews' },
  { key: 'james', name: 'James', api_name: 'james' },
  { key: '1_peter', name: '1 Peter', api_name: '1-peter' },
  { key: '2_peter', name: '2 Peter', api_name: '2-peter' },
  { key: '1_john', name: '1 John', api_name: '1-john' },
  { key: '2_john', name: '2 John', api_name: '2-john' },
  { key: '3_john', name: '3 John', api_name: '3-john' },
  { key: 'jude', name: 'Jude', api_name: 'jude' },
  { key: 'revelation', name: 'Revelation', api_name: 'revelation' }
];

const CHAPTER_COUNTS = {
  matthew: 28, mark: 16, luke: 24, john: 21, acts: 28, romans: 16,
  '1-corinthians': 16, '2-corinthians': 13, galatians: 6, ephesians: 6,
  philippians: 4, colossians: 4, '1-thessalonians': 5, '2-thessalonians': 3,
  '1-timothy': 6, '2-timothy': 4, titus: 3, philemon: 1, hebrews: 13,
  james: 5, '1-peter': 5, '2-peter': 3, '1-john': 5, '2-john': 1,
  '3-john': 1, jude: 1, revelation: 22
};

async function fetchChapter(book, chapter) {
  const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-asv/books/${book}/chapters/${chapter}.json`;
  
  try {
    console.log(`Fetching ${book} ${chapter}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${book} ${chapter}:`, error.message);
    return null;
  }
}

function formatVerseText(verses) {
  return verses.map(verse => `${verse.number}:${verse.verse_id} ${verse.text}`).join('\n');
}

async function downloadBook(book) {
  console.log(`\nDownloading ${book.name}...`);
  
  const chapters = [];
  const chapterCount = CHAPTER_COUNTS[book.api_name];
  
  for (let i = 1; i <= chapterCount; i++) {
    const chapterData = await fetchChapter(book.api_name, i);
    if (chapterData && chapterData.verses) {
      chapters.push(formatVerseText(chapterData.verses));
    }
    
    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const bookText = chapters.join('\n');
  const outputPath = path.join('data-sources', 'asv_bible', `${book.key}.txt`);
  
  try {
    fs.writeFileSync(outputPath, bookText, 'utf-8');
    console.log(`✅ ${book.name} saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error saving ${book.name}:`, error.message);
    return false;
  }
}

async function downloadAllBibleData() {
  console.log('Starting complete ASV New Testament download...');
  
  // Ensure directory exists
  const outputDir = path.join('data-sources', 'asv_bible');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let successCount = 0;
  let totalVerses = 0;
  
  for (const book of NT_BOOKS) {
    const success = await downloadBook(book);
    if (success) {
      successCount++;
      
      // Count verses in downloaded file
      const filePath = path.join(outputDir, `${book.key}.txt`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const verseCount = content.split('\n').filter(line => line.trim()).length;
      totalVerses += verseCount;
      
      console.log(`  📊 ${book.name}: ${verseCount} verses`);
    }
  }
  
  console.log(`\n🎉 Download complete!`);
  console.log(`📚 Books downloaded: ${successCount}/${NT_BOOKS.length}`);
  console.log(`📊 Total verses: ${totalVerses}`);
  console.log(`📁 Files saved to: ${outputDir}`);
  
  if (successCount === NT_BOOKS.length) {
    console.log(`\n✅ Ready to run: node scripts/process_bible.js`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  downloadAllBibleData().catch(console.error);
}