import { loadEmbeddings, loadCrossReferences } from './dataLoader';

class RAGSystem {
  constructor() {
    this.embeddings = null;
    this.crossReferences = null;
    this.isLoaded = false;
    this.queryCache = new Map();
    this.maxCacheSize = 100; // Limit cache to 100 queries
  }

  async initialize() {
    if (this.isLoaded) return;

    try {
      console.log('🔧 Loading RAG system data...');
      
      let embeddingsData, crossRefs;
      try {
        embeddingsData = await loadEmbeddings();
        console.log('✅ Embeddings loaded successfully');
      } catch (embError) {
        console.error('❌ Failed to load embeddings:', embError);
        throw embError;
      }
      
      try {
        crossRefs = await loadCrossReferences();
        console.log('✅ Cross-references loaded successfully');
      } catch (refError) {
        console.warn('⚠️ Cross-references failed to load:', refError);
        crossRefs = null;
      }

      if (!embeddingsData?.verse_embeddings) {
        throw new Error('Embeddings data is missing or invalid');
      }

      if (!crossRefs) {
        console.warn('⚠️ Cross-references data not available, continuing with embeddings only');
      }

      this.embeddings = embeddingsData.verse_embeddings;
      this.crossReferences = crossRefs;
      this.isLoaded = true;
      
      const embCount = Object.keys(this.embeddings || {}).length;
      const refCount = Object.keys(crossRefs?.direct_references || {}).length;
      console.log(`✅ RAG system initialized: ${embCount} verse embeddings, ${refCount} cross-references`);
    } catch (error) {
      console.error('❌ Error initializing RAG system:', error);
      this.isLoaded = false;
      throw new Error(`RAG system initialization failed: ${error.message}`);
    }
  }

  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    
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

  async findRelatedPassages(verseId, maxResults = 5) {
    if (!verseId) {
      throw new Error('Verse ID is required');
    }

    // Check cache first
    const cacheKey = `${verseId}_${maxResults}`;
    if (this.queryCache.has(cacheKey)) {
      console.log(`💾 Using cached results for ${verseId}`);
      return this.queryCache.get(cacheKey);
    }

    if (!this.isLoaded) {
      await this.initialize();
    }

    try {
      const results = [];

      // Get query verse embedding
      const queryEmbedding = this.embeddings[verseId];
      console.log('🔍 RAG Debug:', { 
        verseId, 
        hasEmbedding: !!queryEmbedding, 
        totalEmbeddings: Object.keys(this.embeddings).length,
        sampleKeys: Object.keys(this.embeddings).slice(0, 5)
      });
      
      if (!queryEmbedding) {
        console.warn(`No embedding found for verse: ${verseId}`);
        return [];
      }

      // Compute similarities on-demand
      const similarities = [];
      const threshold = 0.3;
      
      for (const [candidateVerse, candidateEmbedding] of Object.entries(this.embeddings)) {
        if (candidateVerse === verseId) continue;
        
        const similarity = this.cosineSimilarity(queryEmbedding, candidateEmbedding);
        if (similarity > threshold) {
          similarities.push({
            verse: candidateVerse,
            score: similarity,
            type: 'semantic',
            reason: 'textual_similarity',
            source: 'embeddings'
          });
        }
      }

      // Sort by similarity score and take top results
      similarities.sort((a, b) => b.score - a.score);
      const topSimilarities = similarities.slice(0, maxResults);
      
      // Get direct cross-references
      const directRefs = this.crossReferences?.direct_references?.[verseId] || [];
      
      // Get thematic connections
      const thematicConnections = this.crossReferences?.thematic_connections?.[verseId] || {};
      
      // Combine all results with weights
      const allResults = new Map();

      // Add semantic similarities
      for (const sim of topSimilarities) {
        allResults.set(sim.verse, sim);
      }

    // Add direct references (higher weight)
    for (const ref of directRefs) {
      const existing = allResults.get(ref.verse);
      if (!existing || ref.weight > existing.score) {
        allResults.set(ref.verse, {
          verse: ref.verse,
          score: ref.weight,
          type: ref.type,
          reason: ref.reason,
          source: 'cross_references'
        });
      }
    }

    // Add thematic connections
    for (const [theme, verses] of Object.entries(thematicConnections)) {
      for (const verse of verses) {
        const existing = allResults.get(verse);
        const thematicScore = 0.8; // Weight for thematic connections
        
        if (!existing || thematicScore > existing.score) {
          allResults.set(verse, {
            verse: verse,
            score: thematicScore,
            type: 'thematic',
            reason: theme,
            source: 'thematic_analysis'
          });
        }
      }
    }

      // Sort by score and return top results
      const sortedResults = Array.from(allResults.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);

      const semanticCount = sortedResults.filter(r => r.source === 'embeddings').length;
      const crossRefCount = sortedResults.filter(r => r.source === 'cross_references').length;
      const thematicCount = sortedResults.filter(r => r.source === 'thematic_analysis').length;
      
      console.log(`🔍 Found ${sortedResults.length} related passages for ${verseId} (${semanticCount} semantic, ${crossRefCount} cross-ref, ${thematicCount} thematic)`);
      
      // Cache the results
      if (this.queryCache.size >= this.maxCacheSize) {
        const firstKey = this.queryCache.keys().next().value;
        this.queryCache.delete(firstKey);
      }
      this.queryCache.set(cacheKey, sortedResults);
      
      return sortedResults;
    } catch (error) {
      console.error(`❌ Error finding related passages for ${verseId}:`, error);
      throw new Error(`Unable to find related passages: ${error.message}`);
    }
  }

  parseVerseId(verseId) {
    const parts = verseId.split('_');
    if (parts.length >= 3) {
      return {
        book: parts[0],
        chapter: parseInt(parts[1]),
        verse: parseInt(parts[2])
      };
    }
    return null;
  }

  formatVerseReference(verseId) {
    const parsed = this.parseVerseId(verseId);
    if (!parsed) return verseId;

    const bookName = parsed.book.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `${bookName} ${parsed.chapter}:${parsed.verse}`;
  }

  getConnectionTypeLabel(type) {
    const labels = {
      'direct_quote': 'Direct Quote',
      'clear_allusion': 'Clear Allusion',
      'parallel_account': 'Parallel Account',
      'thematic_strong': 'Strong Theme',
      'thematic_moderate': 'Related Theme',
      'semantic': 'Textual Similarity',
      'thematic': 'Thematic Connection',
      'word_study': 'Word Study'
    };
    return labels[type] || type.replace('_', ' ');
  }

  getConnectionColor(type) {
    const colors = {
      'direct_quote': 'bg-red-100 text-red-800',
      'clear_allusion': 'bg-orange-100 text-orange-800',
      'parallel_account': 'bg-purple-100 text-purple-800',
      'thematic_strong': 'bg-blue-100 text-blue-800',
      'thematic_moderate': 'bg-indigo-100 text-indigo-800',
      'semantic': 'bg-green-100 text-green-800',
      'thematic': 'bg-teal-100 text-teal-800',
      'word_study': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }
}

// Singleton instance
const ragSystem = new RAGSystem();

export default ragSystem;