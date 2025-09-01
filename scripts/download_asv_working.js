import fs from 'fs';
import path from 'path';

const NT_BOOKS = [
  { key: 'matthew', api_name: 'matthew', chapters: 28 },
  { key: 'mark', api_name: 'mark', chapters: 16 },
  { key: 'luke', api_name: 'luke', chapters: 24 },
  { key: 'john', api_name: 'john', chapters: 21 },
  { key: 'acts', api_name: 'acts', chapters: 28 },
  { key: 'romans', api_name: 'romans', chapters: 16 },
  { key: '1_corinthians', api_name: '1%20corinthians', chapters: 16 },
  { key: '2_corinthians', api_name: '2%20corinthians', chapters: 13 },
  { key: 'galatians', api_name: 'galatians', chapters: 6 },
  { key: 'ephesians', api_name: 'ephesians', chapters: 6 },
  { key: 'philippians', api_name: 'philippians', chapters: 4 },
  { key: 'colossians', api_name: 'colossians', chapters: 4 },
  { key: '1_thessalonians', api_name: '1%20thessalonians', chapters: 5 },
  { key: '2_thessalonians', api_name: '2%20thessalonians', chapters: 3 },
  { key: '1_timothy', api_name: '1%20timothy', chapters: 6 },
  { key: '2_timothy', api_name: '2%20timothy', chapters: 4 },
  { key: 'titus', api_name: 'titus', chapters: 3 },
  { key: 'philemon', api_name: 'philemon', chapters: 1 },
  { key: 'hebrews', api_name: 'hebrews', chapters: 13 },
  { key: 'james', api_name: 'james', chapters: 5 },
  { key: '1_peter', api_name: '1%20peter', chapters: 5 },
  { key: '2_peter', api_name: '2%20peter', chapters: 3 },
  { key: '1_john', api_name: '1%20john', chapters: 5 },
  { key: '2_john', api_name: '2%20john', chapters: 1 },
  { key: '3_john', api_name: '3%20john', chapters: 1 },
  { key: 'jude', api_name: 'jude', chapters: 1 },
  { key: 'revelation', api_name: 'revelation', chapters: 22 }
];

async function fetchChapter(bookName, chapter) {
  const url = `https://bible-api.com/${bookName}%20${chapter}?translation=asv`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error(`Error fetching ${bookName} ${chapter}:`, error.message);
    return null;
  }
}

async function downloadBook(book) {
  console.log(`Downloading ${book.key}...`);
  
  const allVerses = [];
  let totalVerses = 0;
  
  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    console.log(`  Fetching chapter ${chapter}/${book.chapters}`);
    
    const verses = await fetchChapter(book.api_name, chapter);
    if (verses) {
      for (const verse of verses) {
        allVerses.push(`${verse.chapter}:${verse.verse} ${verse.text}`);
        totalVerses++;
      }
    }
    
    // Be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  const bookText = allVerses.join('\n');
  const outputPath = path.join('data-sources', 'asv_bible', `${book.key}.txt`);
  
  try {
    fs.writeFileSync(outputPath, bookText, 'utf-8');
    console.log(`✅ ${book.key}: ${totalVerses} verses saved`);
    return totalVerses;
  } catch (error) {
    console.error(`Error saving ${book.key}:`, error.message);
    return 0;
  }
}

async function downloadASVBible() {
  console.log('Starting ASV Bible download via bible-api.com...');
  
  let totalBooks = 0;
  let totalVerses = 0;
  
  // Clear existing files first
  const outputDir = path.join('data-sources', 'asv_bible');
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    files.forEach(file => {
      if (file.endsWith('.txt')) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    });
  }
  
  // Download first few books to test
  const testBooks = NT_BOOKS.slice(0, 3); // Matthew, Mark, Luke
  
  for (const book of testBooks) {
    const verseCount = await downloadBook(book);
    if (verseCount > 0) {
      totalBooks++;
      totalVerses += verseCount;
    }
  }
  
  console.log(`\n🎉 Test download complete!`);
  console.log(`📚 Books downloaded: ${totalBooks}/${testBooks.length}`);
  console.log(`📊 Total verses: ${totalVerses}`);
  
  if (totalBooks === testBooks.length) {
    console.log(`\n✅ Test successful! Ready to download all ${NT_BOOKS.length} NT books`);
    console.log(`To download all books, run this script again with full=true`);
  }
}

// Check if we should download all books
const shouldDownloadAll = process.argv.includes('--full');

if (import.meta.url === `file://${process.argv[1]}`) {
  if (shouldDownloadAll) {
    // Download all books
    console.log('Downloading complete New Testament...');
    const totalBooks = NT_BOOKS.length;
    let completedBooks = 0;
    let totalVerses = 0;
    
    for (const book of NT_BOOKS) {
      const verseCount = await downloadBook(book);
      if (verseCount > 0) {
        completedBooks++;
        totalVerses += verseCount;
      }
    }
    
    console.log(`\n🎉 Complete download finished!`);
    console.log(`📚 Books downloaded: ${completedBooks}/${totalBooks}`);
    console.log(`📊 Total verses: ${totalVerses}`);
  } else {
    downloadASVBible().catch(console.error);
  }
}