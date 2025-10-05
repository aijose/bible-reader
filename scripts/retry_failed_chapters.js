import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Books and their chapter counts
const BOOK_INFO = {
  'luke': 24,
  'acts': 28,
  'romans': 16,
  '1_corinthians': 16,
  '2_corinthians': 13,
  'colossians': 4,
  '1_thessalonians': 5,
  '2_timothy': 4,
  'titus': 3,
  'hebrews': 13,
  'james': 5,
  '1_john': 5,
  '2_john': 1,
  'philemon': 1
};

const API_NAME_MAP = {
  '1_corinthians': '1%20corinthians',
  '2_corinthians': '2%20corinthians',
  '1_thessalonians': '1%20thessalonians',
  '2_timothy': '2%20timothy',
  '1_john': '1%20john',
  '2_john': '2%20john'
};

const DELAY_BETWEEN_CHAPTERS = 1000; // 1s delay - slower than before
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
        console.error(`  ❌ Failed after ${retries} attempts: ${error.message}`);
        return null;
      }
      console.warn(`  ⚠️  Retry ${attempt}/${retries}...`);
      await sleep(2000 * attempt); // Longer backoff
    }
  }
  return null;
}

function getMissingChapters(bookKey) {
  const outputDir = path.join(__dirname, '..', 'data-sources', 'asv_bible');
  const filePath = path.join(outputDir, `${bookKey}.txt`);

  if (!fs.existsSync(filePath)) {
    return Array.from({ length: BOOK_INFO[bookKey] }, (_, i) => i + 1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  const existingChapters = new Set();
  for (const line of lines) {
    const match = line.match(/^(\d+):\d+/);
    if (match) {
      existingChapters.add(parseInt(match[1]));
    }
  }

  const missing = [];
  for (let ch = 1; ch <= BOOK_INFO[bookKey]; ch++) {
    if (!existingChapters.has(ch)) {
      missing.push(ch);
    }
  }

  return missing;
}

async function retryBook(bookKey) {
  const missingChapters = getMissingChapters(bookKey);

  if (missingChapters.length === 0) {
    console.log(`✅ ${bookKey}: All chapters complete`);
    return { success: 0, failed: 0 };
  }

  console.log(`📖 ${bookKey}: Retrying ${missingChapters.length} missing chapters: ${missingChapters.join(', ')}`);

  const outputDir = path.join(__dirname, '..', 'data-sources', 'asv_bible');
  const filePath = path.join(outputDir, `${bookKey}.txt`);

  // Read existing content
  let existingContent = '';
  if (fs.existsSync(filePath)) {
    existingContent = fs.readFileSync(filePath, 'utf-8');
  }

  const apiName = API_NAME_MAP[bookKey] || bookKey;
  const newVerses = [];
  let successCount = 0;
  let failedCount = 0;

  for (const chapter of missingChapters) {
    process.stdout.write(`  Chapter ${chapter}...`);

    const verses = await fetchChapterWithRetry(apiName, chapter);

    if (verses && verses.length > 0) {
      for (const verse of verses) {
        newVerses.push(`${verse.chapter}:${verse.verse} ${verse.text}`);
      }
      console.log(` ✅ (${verses.length} verses)`);
      successCount++;
    } else {
      console.log(` ❌ FAILED`);
      failedCount++;
    }

    await sleep(DELAY_BETWEEN_CHAPTERS);
  }

  // Append new verses to file
  if (newVerses.length > 0) {
    const updatedContent = existingContent.trim() + '\n' + newVerses.join('\n');
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
  }

  return { success: successCount, failed: failedCount };
}

async function retryAllFailed() {
  console.log('🔄 Retrying failed chapters...\n');

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const bookKey of Object.keys(BOOK_INFO)) {
    const result = await retryBook(bookKey);
    totalSuccess += result.success;
    totalFailed += result.failed;
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 RETRY COMPLETE!');
  console.log(`✅ Successfully retrieved: ${totalSuccess} chapters`);
  console.log(`❌ Still failed: ${totalFailed} chapters`);
  console.log('═══════════════════════════════════════');

  if (totalFailed > 0) {
    console.log('\n⚠️  Some chapters still failed. Options:');
    console.log('   1. Wait a few minutes and run this script again');
    console.log('   2. Use an alternative Bible API');
    console.log('   3. Download text files manually from Bible Gateway');
  }
}

retryAllFailed().catch(console.error);
