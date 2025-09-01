import { loadSimilarityMatrix, loadCrossReferences } from './dataLoader';

class RAGSystem {
  constructor() {
    this.similarityMatrix = null;
    this.crossReferences = null;
    this.isLoaded = false;
    this.queryCache = new Map();
    this.maxCacheSize = 100; // Limit cache to 100 queries
  }

  async initialize() {
    if (this.isLoaded) return;

    try {
      console.log('🔧 Loading RAG system data...');
      const [similarities, crossRefs] = await Promise.all([
        loadSimilarityMatrix(),
        loadCrossReferences()
      ]);

      if (!similarities?.similarities) {
        throw new Error('Similarity matrix data is missing or invalid');
      }

      if (!crossRefs) {
        console.warn('⚠️ Cross-references data not available, continuing with similarities only');
      }

      this.similarityMatrix = similarities;
      this.crossReferences = crossRefs;
      this.isLoaded = true;
      
      const simCount = Object.keys(similarities.similarities || {}).length;
      const refCount = Object.keys(crossRefs?.direct_references || {}).length;
      console.log(`✅ RAG system initialized: ${simCount} similarity entries, ${refCount} cross-references`);
    } catch (error) {
      console.error('❌ Error initializing RAG system:', error);
      this.isLoaded = false;
      throw new Error(`RAG system initialization failed: ${error.message}`);
    }
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

      // Get semantic similarities
      const semanticSimilarities = this.similarityMatrix?.similarities?.[verseId] || [];
      
      // Get direct cross-references
      const directRefs = this.crossReferences?.direct_references?.[verseId] || [];
      
      // Get thematic connections
      const thematicConnections = this.crossReferences?.thematic_connections?.[verseId] || {};

    // Combine all results with weights
    const allResults = new Map();

    // Add semantic similarities
    for (const sim of semanticSimilarities) {
      allResults.set(sim.verse, {
        verse: sim.verse,
        score: sim.score,
        type: 'semantic',
        reason: 'textual_similarity',
        source: 'embeddings'
      });
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