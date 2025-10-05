import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Single-chapter books with their verse counts
const SINGLE_CHAPTER_BOOKS = [
  { key: 'philemon', api_name: 'philemon', verses: 25 },
  { key: '2_john', api_name: '2%20john', verses: 13 },
  { key: '3_john', api_name: '3%20john', verses: 14 },
  { key: 'jude', api_name: 'jude', verses: 25 }
];

const DELAY_BETWEEN_REQUESTS = 1000; // 1 second between requests
const MAX_RETRIES = 3;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchSingleChapterBook(apiName, verseCount, retries = MAX_RETRIES) {
  // For single-chapter books, we need to request the full verse range
  const url = `https://bible-api.com/${apiName}%201:1-${verseCount}?translation=asv`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  Fetching ${apiName} 1:1-${verseCount}...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`  ✅ Received ${data.verses.length} verses`);
      return data.verses;
    } catch (error) {
      if (attempt === retries) {
        console.error(`  ❌ Failed after ${retries} attempts: ${error.message}`);
        return null;
      }
      console.warn(`  ⚠️  Retry ${attempt}/${retries}...`);
      await sleep(2000 * attempt); // Exponential backoff
    }
  }
  return null;
}

async function downloadSingleChapterBook(book) {
  const outputDir = path.join(__dirname, '..', 'data-sources', 'asv_bible');
  const outputPath = path.join(outputDir, `${book.key}.txt`);

  console.log(`\n📖 Downloading ${book.key} (${book.verses} verses)...`);

  const verses = await fetchSingleChapterBook(book.api_name, book.verses);

  if (!verses || verses.length === 0) {
    console.error(`❌ Failed to download ${book.key}`);
    return false;
  }

  // Format verses as "chapter:verse text"
  const content = verses.map(v => `${v.chapter}:${v.verse} ${v.text}`).join('\n');

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`✅ ${book.key}: ${verses.length} verses saved`);

  return true;
}

async function fixAllSingleChapterBooks() {
  console.log('🔧 Fixing single-chapter books...\n');
  console.log(`📚 Total books: ${SINGLE_CHAPTER_BOOKS.length}`);
  console.log(`⏱️  Rate limiting: ${DELAY_BETWEEN_REQUESTS}ms between requests\n`);

  let successCount = 0;
  let failCount = 0;

  for (const book of SINGLE_CHAPTER_BOOKS) {
    const success = await downloadSingleChapterBook(book);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    await sleep(DELAY_BETWEEN_REQUESTS);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('🎉 DOWNLOAD COMPLETE!');
  console.log(`✅ Successfully downloaded: ${successCount} books`);
  console.log(`❌ Failed: ${failCount} books`);
  console.log('═══════════════════════════════════════\n');

  if (successCount > 0) {
    console.log('📋 Next steps:');
    console.log('   1. cd scripts && node process_bible.js');
    console.log('   2. cd scripts && uv run python generate_embeddings.py');
    console.log('   3. node scripts/build_similarity_matrix.js');
  }
}

// Run the download
fixAllSingleChapterBooks().catch(console.error);
