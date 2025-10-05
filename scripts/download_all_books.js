import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const DELAY_BETWEEN_CHAPTERS = 500; // 500ms delay between chapters
const DELAY_BETWEEN_BOOKS = 2000;   // 2s delay between books
const MAX_RETRIES = 3;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchChapterWithRetry(bookName, chapter, retries = MAX_RETRIES) {
  const url = `https://bible-api.com/${bookName}%20${chapter}?translation=asv`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.verses;
    } catch (error) {
      if (attempt === retries) {
        console.error(`❌ Failed ${bookName} ${chapter} after ${retries} attempts: ${error.message}`);
        return null;
      }
      console.warn(`⚠️  Retry ${attempt}/${retries} for ${bookName} ${chapter}`);
      await sleep(1000 * attempt); // Exponential backoff
    }
  }
  return null;
}

function shouldDownloadBook(bookKey) {
  const outputDir = path.join(__dirname, '..', 'data-sources', 'asv_bible');
  const filePath = path.join(outputDir, `${bookKey}.txt`);

  if (!fs.existsSync(filePath)) {
    return true;
  }

  const stats = fs.statSync(filePath);
  return stats.size === 0; // Re-download empty files
}

async function downloadBook(book) {
  const outputDir = path.join(__dirname, '..', 'data-sources', 'asv_bible');
  const outputPath = path.join(outputDir, `${book.key}.txt`);

  // Check if already downloaded
  if (!shouldDownloadBook(book.key)) {
    const stats = fs.statSync(outputPath);
    console.log(`⏭️  Skipping ${book.key} (already downloaded, ${stats.size} bytes)`);
    return { verses: stats.size > 0 ? 1 : 0, skipped: true };
  }

  console.log(`📖 Downloading ${book.key} (${book.chapters} chapters)...`);

  const allVerses = [];
  let totalVerses = 0;
  let failedChapters = 0;

  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    process.stdout.write(`  Chapter ${chapter}/${book.chapters}...`);

    const verses = await fetchChapterWithRetry(book.api_name, chapter);

    if (verses && verses.length > 0) {
      for (const verse of verses) {
        allVerses.push(`${verse.chapter}:${verse.verse} ${verse.text}`);
        totalVerses++;
      }
      process.stdout.write(` ✅ (${verses.length} verses)\n`);
    } else {
      failedChapters++;
      process.stdout.write(` ❌ FAILED\n`);
    }

    // Rate limiting between chapters
    await sleep(DELAY_BETWEEN_CHAPTERS);
  }

  // Save to file
  const bookText = allVerses.join('\n');
  fs.writeFileSync(outputPath, bookText, 'utf-8');

  console.log(`✅ ${book.key}: ${totalVerses} verses saved (${failedChapters} failed chapters)`);

  return { verses: totalVerses, failed: failedChapters };
}

async function downloadAllBooks() {
  console.log('🚀 Starting New Testament Download');
  console.log(`📚 Total books: ${NT_BOOKS.length}`);
  console.log(`⏱️  Rate limiting: ${DELAY_BETWEEN_CHAPTERS}ms per chapter, ${DELAY_BETWEEN_BOOKS}ms per book\n`);

  const outputDir = path.join(__dirname, '..', 'data-sources', 'asv_bible');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalBooksDownloaded = 0;
  let totalBooksSkipped = 0;
  let totalVerses = 0;
  let totalFailedChapters = 0;

  for (const book of NT_BOOKS) {
    const result = await downloadBook(book);

    if (result.skipped) {
      totalBooksSkipped++;
    } else {
      totalBooksDownloaded++;
      totalVerses += result.verses;
      totalFailedChapters += result.failed || 0;

      // Rate limiting between books
      await sleep(DELAY_BETWEEN_BOOKS);
    }

    console.log(''); // Empty line between books
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 DOWNLOAD COMPLETE!');
  console.log(`📚 Books downloaded: ${totalBooksDownloaded}`);
  console.log(`⏭️  Books skipped: ${totalBooksSkipped}`);
  console.log(`📊 Total verses: ${totalVerses}`);
  console.log(`❌ Failed chapters: ${totalFailedChapters}`);
  console.log('═══════════════════════════════════════');

  if (totalFailedChapters > 0) {
    console.log('\n⚠️  Some chapters failed to download. You may want to:');
    console.log('   1. Run this script again to retry failed chapters');
    console.log('   2. Check your internet connection');
    console.log('   3. Try again later if the API is rate limiting');
  }
}

// Run the download
downloadAllBooks().catch(console.error);
