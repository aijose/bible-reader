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
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn(`Error reading cache for ${key}:`, error);
    return null;
  }
}

function setCachedData(key, data) {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn(`Error caching data for ${key}:`, error);
  }
}

async function fetchJsonData(url, cacheKey) {
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`Using cached data for ${cacheKey}`);
    return cached;
  }
  
  try {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
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