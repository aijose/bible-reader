import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Tag, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import ragSystem from '../utils/ragSystem';

function PassageCard({ passage, bibleData, onNavigate }) {
  const verseData = useMemo(() => ragSystem.parseVerseId(passage.verse), [passage.verse]);
  if (!verseData) return null;

  const bookData = bibleData?.books?.[verseData.book];
  const verseText = bookData?.chapters?.[verseData.chapter]?.[verseData.verse];
  
  const reference = useMemo(() => ragSystem.formatVerseReference(passage.verse), [passage.verse]);
  const connectionLabel = useMemo(() => ragSystem.getConnectionTypeLabel(passage.type), [passage.type]);
  const connectionColor = useMemo(() => ragSystem.getConnectionColor(passage.type), [passage.type]);
  
  const shouldShowFullText = verseText && verseText.length <= 200;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
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
      <div className="mb-3">
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

  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Passages
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Finding related passages...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-500" />
            <p className="text-red-600 mb-2 font-medium">Unable to load related passages</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : relatedPassages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No related passages found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try selecting a different verse
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {relatedPassages.map((passage, index) => (
              <PassageCard
                key={`${passage.verse}-${index}`}
                passage={passage}
                bibleData={bibleData}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
        
        {relatedPassages.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing top {relatedPassages.length} most relevant passages
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RelatedPassages;