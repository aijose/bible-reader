const CACHE_KEYS = {
  BIBLE: 'bible_asv_data',
  COMMENTARIES: 'commentaries_data',
  CROSS_REFS: 'cross_references_data',
  EMBEDDINGS: 'embeddings_data',
  SIMILARITY: 'similarity_matrix_data'
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp, version = '1.0' } = JSON.parse(cached);
    const now = Date.now();
    
    // Check version compatibility (invalidate old cache formats)
    if (version !== '1.4') {
      localStorage.removeItem(key);
      return null;
    }
    
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn(`⚠️ Error reading cache for ${key}:`, error);
    localStorage.removeItem(key);
    return null;
  }
}

function setCachedData(key, data) {
  try {
    // Check available storage space
    const testKey = `test_${Date.now()}`;
    try {
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (e) {
      console.warn(`⚠️ localStorage full, clearing old cache for ${key}`);
      clearCache();
    }

    const cacheEntry = {
      data,
      timestamp: Date.now(),
      version: '1.4'
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    console.log(`💾 Cached ${key} (${(JSON.stringify(cacheEntry).length / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.warn(`⚠️ Error caching data for ${key}:`, error);
  }
}

async function fetchJsonData(url, cacheKey) {
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`✅ Using cached data for ${cacheKey}`);
    return cached;
  }
  
  try {
    console.log(`📦 Fetching ${url}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Data file not found: ${url}. Please ensure all data files are generated.`);
      } else if (response.status >= 500) {
        throw new Error(`Server error (${response.status}): Unable to load ${url}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      throw new Error(`Empty or invalid data received from ${url}`);
    }
    
    setCachedData(cacheKey, data);
    console.log(`✅ Successfully loaded ${cacheKey}`);
    
    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    
    if (error.name === 'SyntaxError') {
      throw new Error(`Invalid JSON data in ${url}. Please regenerate the data files.`);
    }
    
    throw error;
  }
}

export async function loadBibleData() {
  return fetchJsonData('/data/bible_asv.json', CACHE_KEYS.BIBLE);
}

export async function loadCommentaries() {
  return fetchJsonData('/data/commentaries.json', CACHE_KEYS.COMMENTARIES);
}

export async function loadCrossReferences() {
  return fetchJsonData('/data/cross_references.json', CACHE_KEYS.CROSS_REFS);
}

export async function loadEmbeddings() {
  return fetchJsonData('/data/embeddings.json', CACHE_KEYS.EMBEDDINGS);
}

export async function loadSimilarityMatrix() {
  return fetchJsonData('/data/similarity_matrix.json', CACHE_KEYS.SIMILARITY);
}

export function clearCache() {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('Cache cleared');
}

export function getCacheStatus() {
  const status = {};
  Object.entries(CACHE_KEYS).forEach(([name, key]) => {
    const cached = getCachedData(key);
    status[name] = cached ? 'cached' : 'not_cached';
  });
  return status;
}