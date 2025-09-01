import fs from 'fs';
import path from 'path';

const REFERENCE_WEIGHTS = {
  direct_quote: 1.0,
  clear_allusion: 0.9,
  parallel_account: 0.95,
  thematic_strong: 0.8,
  thematic_moderate: 0.6,
  word_study: 0.5,
  topical: 0.4
};

const TRADITIONAL_REFERENCES = {
  'matthew_1_1': [
    { verse: 'luke_3_23', type: 'thematic_strong', reason: 'genealogy' },
    { verse: '1_chronicles_3_10', type: 'thematic_moderate', reason: 'davidic_lineage' },
    { verse: 'romans_1_3', type: 'direct_quote', reason: 'son_of_david' }
  ],
  'matthew_1_2': [
    { verse: 'genesis_21_3', type: 'direct_quote', reason: 'abraham_isaac' },
    { verse: 'genesis_25_26', type: 'direct_quote', reason: 'isaac_jacob' },
    { verse: 'genesis_29_35', type: 'thematic_moderate', reason: 'judah_lineage' }
  ],
  'matthew_1_16': [
    { verse: 'luke_1_27', type: 'parallel_account', reason: 'mary_joseph' },
    { verse: 'luke_2_4', type: 'thematic_strong', reason: 'davidic_ancestry' }
  ],
  'matthew_1_18': [
    { verse: 'luke_1_35', type: 'parallel_account', reason: 'virgin_birth' },
    { verse: 'luke_2_5', type: 'thematic_moderate', reason: 'betrothal' }
  ],
  'matthew_1_21': [
    { verse: 'luke_1_31', type: 'parallel_account', reason: 'jesus_name' },
    { verse: 'acts_4_12', type: 'thematic_strong', reason: 'salvation_name' },
    { verse: '1_timothy_1_15', type: 'thematic_strong', reason: 'save_sinners' }
  ],
  'matthew_1_23': [
    { verse: 'isaiah_7_14', type: 'direct_quote', reason: 'immanuel_prophecy' },
    { verse: 'luke_1_31', type: 'thematic_strong', reason: 'virgin_birth' }
  ],
  'matthew_2_1': [
    { verse: 'luke_2_4', type: 'parallel_account', reason: 'bethlehem_birth' },
    { verse: 'micah_5_2', type: 'thematic_strong', reason: 'bethlehem_prophecy' }
  ],
  'matthew_2_2': [
    { verse: 'numbers_24_17', type: 'thematic_strong', reason: 'star_prophecy' },
    { verse: 'revelation_22_16', type: 'thematic_moderate', reason: 'bright_morning_star' }
  ],
  'matthew_2_6': [
    { verse: 'micah_5_2', type: 'direct_quote', reason: 'bethlehem_ruler' },
    { verse: '2_samuel_5_2', type: 'thematic_strong', reason: 'shepherd_israel' }
  ],
  'matthew_2_15': [
    { verse: 'hosea_11_1', type: 'direct_quote', reason: 'egypt_my_son' },
    { verse: 'exodus_4_22', type: 'thematic_strong', reason: 'israel_my_son' }
  ]
};

const THEMATIC_CONNECTIONS = {
  genealogy: ['matthew_1_1', 'matthew_1_2', 'luke_3_23', '1_chronicles_3_10'],
  virgin_birth: ['matthew_1_18', 'matthew_1_23', 'luke_1_27', 'luke_1_35'],
  davidic_covenant: ['matthew_1_1', 'matthew_1_6', '2_samuel_7_12', 'psalm_89_3'],
  messianic_prophecy: ['matthew_1_23', 'matthew_2_6', 'isaiah_7_14', 'micah_5_2'],
  salvation: ['matthew_1_21', 'acts_4_12', '1_timothy_1_15', 'romans_1_16'],
  fulfillment: ['matthew_1_22', 'matthew_2_15', 'matthew_2_17', 'matthew_2_23']
};

function expandTraditionalReferences() {
  console.log('Expanding traditional cross-references...');
  
  const expandedRefs = { ...TRADITIONAL_REFERENCES };
  
  for (const [sourceVerse, references] of Object.entries(TRADITIONAL_REFERENCES)) {
    for (const ref of references) {
      if (!expandedRefs[ref.verse]) {
        expandedRefs[ref.verse] = [];
      }
      
      const reverseRef = {
        verse: sourceVerse,
        type: ref.type,
        reason: ref.reason,
        weight: REFERENCE_WEIGHTS[ref.type] || 0.5
      };
      
      const exists = expandedRefs[ref.verse].some(r => r.verse === sourceVerse);
      if (!exists) {
        expandedRefs[ref.verse].push(reverseRef);
      }
    }
  }
  
  return expandedRefs;
}

function buildThematicConnections() {
  console.log('Building thematic connections...');
  
  const thematicRefs = {};
  
  for (const [theme, verses] of Object.entries(THEMATIC_CONNECTIONS)) {
    for (let i = 0; i < verses.length; i++) {
      const sourceVerse = verses[i];
      
      if (!thematicRefs[sourceVerse]) {
        thematicRefs[sourceVerse] = {};
      }
      
      if (!thematicRefs[sourceVerse][theme]) {
        thematicRefs[sourceVerse][theme] = [];
      }
      
      for (let j = 0; j < verses.length; j++) {
        if (i !== j) {
          thematicRefs[sourceVerse][theme].push(verses[j]);
        }
      }
    }
  }
  
  return thematicRefs;
}

function calculateReferenceMetadata(directRefs, thematicRefs) {
  console.log('Calculating reference metadata...');
  
  const metadata = {};
  
  const allVerses = new Set([
    ...Object.keys(directRefs),
    ...Object.keys(thematicRefs)
  ]);
  
  for (const verse of allVerses) {
    const directCount = directRefs[verse] ? directRefs[verse].length : 0;
    const thematicCount = thematicRefs[verse] ? 
      Object.values(thematicRefs[verse]).flat().length : 0;
    
    const strongestWeight = directRefs[verse] ? 
      Math.max(...directRefs[verse].map(r => r.weight || 0.5)) : 0;
    
    const themes = thematicRefs[verse] ? Object.keys(thematicRefs[verse]) : [];
    
    metadata[verse] = {
      total_references: directCount + thematicCount,
      direct_references: directCount,
      thematic_references: thematicCount,
      strongest_connection: strongestWeight,
      primary_themes: themes
    };
  }
  
  return metadata;
}

function buildCrossReferences() {
  console.log('Starting cross-reference compilation...');
  
  const outputPath = path.join(process.cwd(), 'public', 'data', 'cross_references.json');
  
  const directRefs = expandTraditionalReferences();
  const thematicRefs = buildThematicConnections();
  const metadata = calculateReferenceMetadata(directRefs, thematicRefs);
  
  const processedDirectRefs = {};
  for (const [verse, refs] of Object.entries(directRefs)) {
    processedDirectRefs[verse] = refs.map(ref => ({
      verse: ref.verse,
      type: ref.type,
      weight: ref.weight || REFERENCE_WEIGHTS[ref.type] || 0.5,
      reason: ref.reason
    }));
  }
  
  const output = {
    metadata: {
      source: "Traditional study Bible references",
      coverage: "New Testament",
      reference_types: Object.keys(REFERENCE_WEIGHTS),
      thematic_categories: Object.keys(THEMATIC_CONNECTIONS),
      processing_date: new Date().toISOString(),
      total_verses_with_refs: Object.keys(directRefs).length,
      total_thematic_connections: Object.keys(thematicRefs).length
    },
    direct_references: processedDirectRefs,
    thematic_connections: thematicRefs,
    reference_metadata: metadata
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n✅ Cross-reference compilation complete!`);
    console.log(`📊 Verses with direct references: ${Object.keys(processedDirectRefs).length}`);
    console.log(`📊 Verses with thematic connections: ${Object.keys(thematicRefs).length}`);
    console.log(`📁 Output written to: ${outputPath}`);
    console.log(`📏 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB`);
  } catch (error) {
    console.error('Error writing cross-references file:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildCrossReferences();
}