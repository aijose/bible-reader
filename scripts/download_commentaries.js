import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NT_BOOKS = [
  { key: 'matthew', name: 'Matthew', abbrev: 'matthew', chapters: 28 },
  { key: 'mark', name: 'Mark', abbrev: 'mark', chapters: 16 },
  { key: 'luke', name: 'Luke', abbrev: 'luke', chapters: 24 },
  { key: 'john', name: 'John', abbrev: 'john', chapters: 21 },
  { key: 'acts', name: 'Acts', abbrev: 'acts', chapters: 28 },
  { key: 'romans', name: 'Romans', abbrev: 'romans', chapters: 16 },
  { key: '1_corinthians', name: '1 Corinthians', abbrev: '1-corinthians', chapters: 16 },
  { key: '2_corinthians', name: '2 Corinthians', abbrev: '2-corinthians', chapters: 13 },
  { key: 'galatians', name: 'Galatians', abbrev: 'galatians', chapters: 6 },
  { key: 'ephesians', name: 'Ephesians', abbrev: 'ephesians', chapters: 6 },
  { key: 'philippians', name: 'Philippians', abbrev: 'philippians', chapters: 4 },
  { key: 'colossians', name: 'Colossians', abbrev: 'colossians', chapters: 4 },
  { key: '1_thessalonians', name: '1 Thessalonians', abbrev: '1-thessalonians', chapters: 5 },
  { key: '2_thessalonians', name: '2 Thessalonians', abbrev: '2-thessalonians', chapters: 3 },
  { key: '1_timothy', name: '1 Timothy', abbrev: '1-timothy', chapters: 6 },
  { key: '2_timothy', name: '2 Timothy', abbrev: '2-timothy', chapters: 4 },
  { key: 'titus', name: 'Titus', abbrev: 'titus', chapters: 3 },
  { key: 'philemon', name: 'Philemon', abbrev: 'philemon', chapters: 1 },
  { key: 'hebrews', name: 'Hebrews', abbrev: 'hebrews', chapters: 13 },
  { key: 'james', name: 'James', abbrev: 'james', chapters: 5 },
  { key: '1_peter', name: '1 Peter', abbrev: '1-peter', chapters: 5 },
  { key: '2_peter', name: '2 Peter', abbrev: '2-peter', chapters: 3 },
  { key: '1_john', name: '1 John', abbrev: '1-john', chapters: 5 },
  { key: '2_john', name: '2 John', abbrev: '2-john', chapters: 1 },
  { key: '3_john', name: '3 John', abbrev: '3-john', chapters: 1 },
  { key: 'jude', name: 'Jude', abbrev: 'jude', chapters: 1 },
  { key: 'revelation', name: 'Revelation', abbrev: 'revelation', chapters: 22 }
];

const DELAY_BETWEEN_CHAPTERS = 1000; // 1 second
const DELAY_BETWEEN_BOOKS = 3000;     // 3 seconds
const MAX_RETRIES = 3;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanHtml(html) {
  if (!html) return '';

  return html
    // Remove HTML tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchGillCommentary(bookName, chapter, retries = MAX_RETRIES) {
  // John Gill's Exposition from StudyLight.org
  const url = `https://www.studylight.org/commentaries/eng/geb/${bookName}-${chapter}.html`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Extract verse commentaries from HTML
      const commentaries = extractGillCommentaries(html, chapter);

      return commentaries;
    } catch (error) {
      if (attempt === retries) {
        console.error(`    ❌ Failed after ${retries} attempts: ${error.message}`);
        return null;
      }
      console.warn(`    ⚠️  Retry ${attempt}/${retries}...`);
      await sleep(2000 * attempt);
    }
  }
  return null;
}

function extractGillCommentaries(html, chapter) {
  const commentaries = [];

  // StudyLight.org format: Look for verse sections
  // This is a simplified parser - may need adjustment based on actual HTML structure
  const versePattern = /Verse\s+(\d+)\s*[\.:\-]?\s*(.*?)(?=Verse\s+\d+|$)/gis;
  const matches = [...html.matchAll(versePattern)];

  for (const match of matches) {
    const verse = parseInt(match[1]);
    const text = cleanHtml(match[2]);

    if (text && text.length > 50) { // Filter out too-short extracts
      commentaries.push({
        verse,
        text: text.substring(0, 5000) // Limit length
      });
    }
  }

  return commentaries;
}

async function fetchHenryCommentary(bookName, chapter, retries = MAX_RETRIES) {
  // Matthew Henry from sacred-texts.com or biblestudytools.com
  const url = `https://www.biblestudytools.com/commentaries/matthew-henry-complete/${bookName}/${chapter}.html`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const commentaries = extractHenryCommentaries(html, chapter);

      return commentaries;
    } catch (error) {
      if (attempt === retries) {
        console.error(`    ❌ Failed after ${retries} attempts: ${error.message}`);
        return null;
      }
      console.warn(`    ⚠️  Retry ${attempt}/${retries}...`);
      await sleep(2000 * attempt);
    }
  }
  return null;
}

function extractHenryCommentaries(html, chapter) {
  const commentaries = [];

  // Matthew Henry format varies by source
  // This is a simplified parser
  const versePattern = /(?:Verses?\s+|V\.\s*)(\d+(?:-\d+)?)[\.:\-\s]+(.*?)(?=(?:Verses?\s+|V\.\s*)\d+|$)/gis;
  const matches = [...html.matchAll(versePattern)];

  for (const match of matches) {
    const verseRange = match[1];
    const text = cleanHtml(match[2]);

    if (text && text.length > 50) {
      // Handle verse ranges (e.g., "1-3")
      const [start, end] = verseRange.split('-').map(v => parseInt(v));
      const verses = end ? Array.from({length: end - start + 1}, (_, i) => start + i) : [start];

      for (const verse of verses) {
        commentaries.push({
          verse,
          text: text.substring(0, 5000)
        });
      }
    }
  }

  return commentaries;
}

function shouldDownloadBook(bookKey, source) {
  const outputDir = path.join(__dirname, '..', 'data-sources', source === 'gill' ? 'john_gill' : 'matthew_henry');
  const filePath = path.join(outputDir, `${bookKey}.txt`);

  if (!fs.existsSync(filePath)) {
    return true;
  }

  const stats = fs.statSync(filePath);
  return stats.size < 1000; // Re-download if less than 1KB (likely empty/failed)
}

async function downloadBookCommentary(book, source = 'gill') {
  const outputDir = path.join(__dirname, '..', 'data-sources', source === 'gill' ? 'john_gill' : 'matthew_henry');
  const outputPath = path.join(outputDir, `${book.key}.txt`);

  // Create directory if needed
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if already downloaded
  if (!shouldDownloadBook(book.key, source)) {
    const stats = fs.statSync(outputPath);
    console.log(`⏭️  Skipping ${book.name} (${source}) - already downloaded (${(stats.size / 1024).toFixed(1)}KB)`);
    return { verses: 0, skipped: true };
  }

  console.log(`📖 Downloading ${book.name} (${source}) - ${book.chapters} chapters...`);

  const allCommentaries = [];
  let totalVerses = 0;
  let failedChapters = 0;

  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    process.stdout.write(`  Chapter ${chapter}/${book.chapters}...`);

    const commentaries = source === 'gill'
      ? await fetchGillCommentary(book.abbrev, chapter)
      : await fetchHenryCommentary(book.abbrev, chapter);

    if (commentaries && commentaries.length > 0) {
      for (const comm of commentaries) {
        allCommentaries.push(`${chapter}:${comm.verse} ${comm.text}`);
        totalVerses++;
      }
      process.stdout.write(` ✅ (${commentaries.length} verses)\n`);
    } else {
      failedChapters++;
      process.stdout.write(` ❌ FAILED\n`);
    }

    await sleep(DELAY_BETWEEN_CHAPTERS);
  }

  // Save to file
  const content = allCommentaries.join('\n\n');
  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`✅ ${book.name} (${source}): ${totalVerses} verses saved (${failedChapters} failed chapters)`);

  return { verses: totalVerses, failed: failedChapters };
}

async function downloadAllCommentaries() {
  console.log('🚀 Starting Commentary Download');
  console.log(`📚 Total books: ${NT_BOOKS.length}`);
  console.log(`⏱️  Rate limiting: ${DELAY_BETWEEN_CHAPTERS}ms per chapter, ${DELAY_BETWEEN_BOOKS}ms per book\n`);

  const sources = ['gill', 'henry'];

  for (const source of sources) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📖 ${source === 'gill' ? 'JOHN GILL' : 'MATTHEW HENRY'} COMMENTARY`);
    console.log('='.repeat(60));

    let totalBooksDownloaded = 0;
    let totalBooksSkipped = 0;
    let totalVerses = 0;
    let totalFailedChapters = 0;

    for (const book of NT_BOOKS) {
      const result = await downloadBookCommentary(book, source);

      if (result.skipped) {
        totalBooksSkipped++;
      } else {
        totalBooksDownloaded++;
        totalVerses += result.verses;
        totalFailedChapters += result.failed || 0;

        await sleep(DELAY_BETWEEN_BOOKS);
      }

      console.log('');
    }

    console.log('═══════════════════════════════════════');
    console.log(`🎉 ${source.toUpperCase()} DOWNLOAD COMPLETE!`);
    console.log(`📚 Books downloaded: ${totalBooksDownloaded}`);
    console.log(`⏭️  Books skipped: ${totalBooksSkipped}`);
    console.log(`📊 Total verses: ${totalVerses}`);
    console.log(`❌ Failed chapters: ${totalFailedChapters}`);
    console.log('═══════════════════════════════════════\n');
  }

  console.log('\n✨ ALL COMMENTARIES DOWNLOADED!');
  console.log('📋 Next step: cd scripts && node process_commentary.js');
}

// Run the download
downloadAllCommentaries().catch(console.error);
