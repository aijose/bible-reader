import fs from 'fs';
import path from 'path';

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

async function downloadMissingRevelationChapters() {
  console.log('📖 Downloading missing Revelation chapters 1-19...');
  
  const existingPath = path.join('..', 'data-sources', 'asv_bible', 'revelation.txt');
  let existingContent = '';
  
  // Read existing chapters 20-22 if they exist
  if (fs.existsSync(existingPath)) {
    existingContent = fs.readFileSync(existingPath, 'utf-8');
    console.log('📄 Found existing Revelation chapters 20-22');
  }
  
  const allVerses = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let chapter = 1; chapter <= 19; chapter++) {
    console.log(`  Fetching Revelation chapter ${chapter}/19...`);
    
    const verses = await fetchChapter('revelation', chapter);
    if (verses && verses.length > 0) {
      for (const verse of verses) {
        allVerses.push(`${verse.chapter}:${verse.verse} ${verse.text}`);
      }
      console.log(`    ✅ Chapter ${chapter}: ${verses.length} verses`);
      successCount++;
    } else {
      console.log(`    ❌ Chapter ${chapter}: Failed to download`);
      failCount++;
    }
    
    // Be respectful to the API - 2 second delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Combine new chapters (1-19) with existing chapters (20-22)
  const newContent = allVerses.join('\n');
  const completeContent = newContent + (existingContent ? '\n' + existingContent : '');
  
  // Write complete Revelation book
  try {
    fs.writeFileSync(existingPath, completeContent, 'utf-8');
    console.log(`\n✅ Revelation download complete!`);
    console.log(`📊 Downloaded chapters 1-19: ${allVerses.length} verses`);
    console.log(`📊 Success rate: ${successCount}/19 chapters`);
    if (failCount > 0) {
      console.log(`⚠️ Failed chapters: ${failCount}`);
    }
    console.log(`📁 Updated: ${existingPath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error saving complete Revelation file:', error);
    return false;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  downloadMissingRevelationChapters()
    .then(success => {
      if (success) {
        console.log('\n🎉 Ready to run: node process_bible.js');
      }
    })
    .catch(error => {
      console.error('💥 Download failed:', error);
    });
}