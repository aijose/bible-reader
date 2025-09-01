import fs from 'fs';
import path from 'path';

const THEOLOGICAL_TAGS = {
  genealogy: ['genealogy', 'lineage', 'ancestry', 'generation'],
  messiah: ['messiah', 'christ', 'anointed', 'savior'],
  covenant: ['covenant', 'promise', 'davidic', 'abrahamic'],
  prophecy: ['prophecy', 'fulfillment', 'prediction', 'foretold'],
  salvation: ['salvation', 'redemption', 'forgiveness', 'grace'],
  trinity: ['trinity', 'father', 'son', 'spirit', 'godhead'],
  eschatology: ['judgment', 'resurrection', 'eternal', 'kingdom'],
  ethics: ['ethics', 'moral', 'righteousness', 'sin'],
  worship: ['worship', 'prayer', 'praise', 'glory'],
  discipleship: ['disciple', 'follow', 'obedience', 'faithful']
};

function extractVerseReference(line) {
  const patterns = [
    /(\w+)\s+(\d+):(\d+)/,
    /(\d+):(\d+)/,
    /Ver?\.\s*(\d+)/,
    /Verse\s+(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      if (match.length === 4) {
        return { book: match[1].toLowerCase(), chapter: parseInt(match[2]), verse: parseInt(match[3]) };
      } else if (match.length === 3) {
        return { chapter: parseInt(match[1]), verse: parseInt(match[2]) };
      } else {
        return { verse: parseInt(match[1]) };
      }
    }
  }
  return null;
}

function identifyTheologicalTags(text) {
  const tags = [];
  const lowerText = text.toLowerCase();
  
  for (const [tag, keywords] of Object.entries(THEOLOGICAL_TAGS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
        break;
      }
    }
  }
  
  return tags;
}

function createPreviewText(text, maxLength = 200) {
  if (text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength * 0.8 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

function parseCommentaryFile(filePath, source, bookKey) {
  console.log(`Processing ${source} commentary for ${bookKey}...`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Commentary file not found: ${filePath}`);
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const commentary = {};
  let currentVerse = null;
  let currentChapter = 1;
  let verseCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    const verseRef = extractVerseReference(line);
    if (verseRef) {
      if (verseRef.chapter) currentChapter = verseRef.chapter;
      currentVerse = verseRef.verse;
      
      // Extract commentary text that follows the verse reference
      const verseRefMatch = line.match(/^\d+:\d+\s+(.*)$/);
      const commentaryText = verseRefMatch ? verseRefMatch[1] : '';
      
      if (commentaryText.trim()) {
        const verseKey = `${bookKey}_${currentChapter}_${currentVerse}`;
        const cleanText = commentaryText.trim();
        
        if (!commentary[verseKey]) {
          commentary[verseKey] = [];
        }
        
        commentary[verseKey].push({
          source: source,
          text: cleanText,
          preview: createPreviewText(cleanText),
          theological_tags: identifyTheologicalTags(cleanText),
          length: cleanText.length
        });
        
        verseCount++;
        console.log(`  Processed ${source} commentary for ${verseKey}`);
      }
    }
  }
  
  console.log(`  ✅ ${source}: ${verseCount} commentary entries processed`);
  return commentary;
}

function processCommentaries() {
  console.log('Starting commentary processing...');
  
  const dataSourcesDir = path.join(process.cwd(), 'data-sources');
  const henryDir = path.join(dataSourcesDir, 'matthew_henry');
  const gillDir = path.join(dataSourcesDir, 'john_gill');
  const outputPath = path.join(process.cwd(), 'public', 'data', 'commentaries.json');
  
  if (!fs.existsSync(henryDir) && !fs.existsSync(gillDir)) {
    console.error('Commentary source directories not found');
    console.log('Please create:');
    console.log('  data-sources/matthew_henry/');
    console.log('  data-sources/john_gill/');
    console.log('And add commentary text files');
    return;
  }

  const allCommentaries = {};
  
  const NT_BOOK_KEYS = [
    'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
    '1_corinthians', '2_corinthians', 'galatians', 'ephesians',
    'philippians', 'colossians', '1_thessalonians', '2_thessalonians',
    '1_timothy', '2_timothy', 'titus', 'philemon', 'hebrews',
    'james', '1_peter', '2_peter', '1_john', '2_john', '3_john',
    'jude', 'revelation'
  ];

  for (const bookKey of NT_BOOK_KEYS) {
    const henryFile = path.join(henryDir, `${bookKey}.txt`);
    const gillFile = path.join(gillDir, `${bookKey}.txt`);
    
    const henryCommentary = fs.existsSync(henryFile) ? 
      parseCommentaryFile(henryFile, 'Matthew Henry', bookKey) : {};
    
    const gillCommentary = fs.existsSync(gillFile) ? 
      parseCommentaryFile(gillFile, 'John Gill', bookKey) : {};
    
    for (const verseKey of Object.keys(henryCommentary)) {
      if (!allCommentaries[verseKey]) {
        allCommentaries[verseKey] = [];
      }
      allCommentaries[verseKey].push(...henryCommentary[verseKey]);
    }
    
    for (const verseKey of Object.keys(gillCommentary)) {
      if (!allCommentaries[verseKey]) {
        allCommentaries[verseKey] = [];
      }
      allCommentaries[verseKey].push(...gillCommentary[verseKey]);
    }
  }

  const metadata = {
    sources: ['Matthew Henry', 'John Gill'],
    total_commentaries: Object.keys(allCommentaries).length,
    processing_date: new Date().toISOString(),
    theological_tags: Object.keys(THEOLOGICAL_TAGS)
  };

  const output = {
    metadata,
    commentaries: allCommentaries
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n✅ Commentary processing complete!`);
    console.log(`📊 Total verses with commentary: ${Object.keys(allCommentaries).length}`);
    console.log(`📁 Output written to: ${outputPath}`);
    console.log(`📏 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(1)}MB`);
  } catch (error) {
    console.error('Error writing commentary file:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processCommentaries();
}