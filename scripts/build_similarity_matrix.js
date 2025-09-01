import fs from 'fs';
import path from 'path';

function loadJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have same dimension');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function computeSimilarityMatrix(embeddings) {
  console.log('Computing similarity matrix...');
  
  const verseIds = Object.keys(embeddings);
  const similarities = {};
  const threshold = 0.3;
  const topK = 5;
  
  for (let i = 0; i < verseIds.length; i++) {
    const sourceVerse = verseIds[i];
    const sourceEmbedding = embeddings[sourceVerse];
    const verseSimilarities = [];
    
    for (let j = 0; j < verseIds.length; j++) {
      if (i === j) continue;
      
      const targetVerse = verseIds[j];
      const targetEmbedding = embeddings[targetVerse];
      
      const similarity = cosineSimilarity(sourceEmbedding, targetEmbedding);
      
      if (similarity > threshold) {
        verseSimilarities.push({
          verse: targetVerse,
          score: similarity,
          type: 'semantic',
          reason: 'textual_similarity'
        });
      }
    }
    
    // Sort by similarity score and keep top K
    verseSimilarities.sort((a, b) => b.score - a.score);
    similarities[sourceVerse] = verseSimilarities.slice(0, topK);
    
    if ((i + 1) % 10 === 0) {
      console.log(`Processed ${i + 1}/${verseIds.length} verses`);
    }
  }
  
  return similarities;
}

function mergeCrossReferences(similarities, crossRefs) {
  console.log('Merging cross-references with semantic similarities...');
  
  if (!crossRefs || !crossRefs.direct_references) {
    console.warn('No cross-references found, using semantic similarities only');
    return similarities;
  }
  
  const merged = { ...similarities };
  
  for (const [sourceVerse, refs] of Object.entries(crossRefs.direct_references)) {
    if (!merged[sourceVerse]) {
      merged[sourceVerse] = [];
    }
    
    // Add direct references with high weights
    for (const ref of refs) {
      const existingIndex = merged[sourceVerse].findIndex(s => s.verse === ref.verse);
      
      if (existingIndex >= 0) {
        // Update existing entry if cross-reference has higher weight
        if (ref.weight > merged[sourceVerse][existingIndex].score) {
          merged[sourceVerse][existingIndex] = {
            verse: ref.verse,
            score: ref.weight,
            type: ref.type,
            reason: ref.reason
          };
        }
      } else {
        // Add new cross-reference
        merged[sourceVerse].push({
          verse: ref.verse,
          score: ref.weight,
          type: ref.type,
          reason: ref.reason
        });
      }
    }
    
    // Re-sort and keep top K
    merged[sourceVerse].sort((a, b) => b.score - a.score);
    merged[sourceVerse] = merged[sourceVerse].slice(0, 5);
  }
  
  return merged;
}

function buildSimilarityMatrix() {
  console.log('Starting similarity matrix construction...');
  
  const embeddingsPath = path.join(process.cwd(), 'public', 'data', 'embeddings.json');
  const crossRefsPath = path.join(process.cwd(), 'public', 'data', 'cross_references.json');
  const outputPath = path.join(process.cwd(), 'public', 'data', 'similarity_matrix.json');
  
  // Load embeddings
  const embeddingsData = loadJsonFile(embeddingsPath);
  if (!embeddingsData) {
    console.error('Failed to load embeddings. Please run generate_embeddings.py first');
    return;
  }
  
  // Load cross-references (optional)
  const crossRefsData = loadJsonFile(crossRefsPath);
  
  const embeddings = embeddingsData.verse_embeddings;
  console.log(`Loaded embeddings for ${Object.keys(embeddings).length} verses`);
  
  // Compute semantic similarities
  const semanticSimilarities = computeSimilarityMatrix(embeddings);
  
  // Merge with cross-references
  const finalSimilarities = mergeCrossReferences(semanticSimilarities, crossRefsData);
  
  // Calculate statistics
  const totalConnections = Object.values(finalSimilarities).reduce((sum, arr) => sum + arr.length, 0);
  const avgConnections = totalConnections / Object.keys(finalSimilarities).length;
  
  const output = {
    metadata: {
      model: embeddingsData.metadata.model,
      dimension: embeddingsData.metadata.dimension,
      similarity_threshold: 0.3,
      top_k_results: 5,
      scoring_weights: {
        direct_references: 1.0,
        semantic_similarity: 0.7,
        theological_concepts: 0.8
      },
      processing_date: new Date().toISOString(),
      total_verses: Object.keys(embeddings).length,
      total_connections: totalConnections,
      avg_connections_per_verse: Math.round(avgConnections * 100) / 100
    },
    similarities: finalSimilarities
  };
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    const fileSizeMB = fs.statSync(outputPath).size / (1024 * 1024);
    
    console.log('\n✅ Similarity matrix construction complete!');
    console.log(`📊 Total verse connections: ${totalConnections}`);
    console.log(`📊 Average connections per verse: ${avgConnections.toFixed(1)}`);
    console.log(`📁 Output written to: ${outputPath}`);
    console.log(`📏 File size: ${fileSizeMB.toFixed(1)}MB`);
    
  } catch (error) {
    console.error('Error writing similarity matrix:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildSimilarityMatrix();
}