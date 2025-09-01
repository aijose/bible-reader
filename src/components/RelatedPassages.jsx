import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Tag, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import ragSystem from '../utils/ragSystem';

function PassageCard({ passage, bibleData, onNavigate }) {
  const verseData = useMemo(() => ragSystem.parseVerseId(passage.verse), [passage.verse]);
  if (!verseData) return null;

  const bookData = bibleData?.books?.[verseData.book];
  
  // Skip if we don't have this book's data
  if (!bookData) return null;
  
  const verseText = bookData?.chapters?.[verseData.chapter]?.[verseData.verse];
  
  const reference = useMemo(() => ragSystem.formatVerseReference(passage.verse), [passage.verse]);
  const connectionLabel = useMemo(() => ragSystem.getConnectionTypeLabel(passage.type), [passage.type]);
  const connectionColor = useMemo(() => ragSystem.getConnectionColor(passage.type), [passage.type]);
  
  const shouldShowFullText = verseText && verseText.length <= 200;
  
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
         onClick={() => onNavigate(verseData.book, verseData.chapter)}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-gray-600" />
          <h4 className="font-semibold text-gray-900">{reference}</h4>
        </div>
        <ExternalLink className="h-3 w-3 text-gray-400" />
      </div>
      
      {/* Connection type */}
      <div className="mb-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${connectionColor}`}>
          <Tag className="h-3 w-3 mr-1" />
          {connectionLabel}
        </span>
      </div>
      
      {/* Verse text */}
      {verseText && (
        <div className="text-gray-700 text-sm leading-relaxed">
          {shouldShowFullText ? (
            <p>"{verseText}"</p>
          ) : (
            <p className="italic">Click to view verse</p>
          )}
        </div>
      )}
      
      {/* Similarity score */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Similarity: {(passage.score * 100).toFixed(1)}%</span>
          <span className="capitalize">{passage.source}</span>
        </div>
      </div>
    </div>
  );
}

function RelatedPassages({ selectedVerse, bibleData, onNavigate, isOpen }) {
  const [relatedPassages, setRelatedPassages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function loadRelatedPassages() {
      if (!selectedVerse || !isOpen) {
        setRelatedPassages([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const startTime = Date.now();
        const passages = await ragSystem.findRelatedPassages(selectedVerse, 5);
        const endTime = Date.now();
        
        console.log(`🔍 RAG query completed in ${endTime - startTime}ms`);
        setRelatedPassages(passages);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('❌ Error loading related passages:', err);
        setError(err.message);
        setRelatedPassages([]);
      } finally {
        setLoading(false);
      }
    }

    // Debounce RAG queries by 300ms to avoid excessive calls
    const timeoutId = setTimeout(loadRelatedPassages, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedVerse, isOpen, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  console.log('🔗 RelatedPassages render:', { selectedVerse, isOpen, passagesCount: relatedPassages.length, loading, error });
  
  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0 h-40 flex flex-col">
      <div className="p-3 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Related Passages
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 text-sm">Finding related passages...</span>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
            <p className="text-red-600 mb-1 font-medium text-sm">Unable to load related passages</p>
            <p className="text-gray-600 text-xs mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
        ) : relatedPassages.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No related passages found</p>
            <p className="text-gray-400 text-xs mt-1">
              Try selecting a different verse
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {relatedPassages.map((passage, index) => (
                <PassageCard
                  key={`${passage.verse}-${index}`}
                  passage={passage}
                  bibleData={bibleData}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200 flex-shrink-0">
              <p className="text-xs text-gray-500">
                Showing top {relatedPassages.length} most relevant passages
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RelatedPassages;