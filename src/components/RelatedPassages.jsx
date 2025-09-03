import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Tag, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import ragSystem from '../utils/ragSystem';

function PassageCard({ passage, bibleData, onNavigate }) {
  const verseData = useMemo(() => ragSystem.parseVerseId(passage.verse), [passage.verse]);
  if (!verseData) return null;

  const bookData = bibleData?.books?.[verseData.book];
  
  // Skip if we don't have this book's data or if it has no verses
  if (!bookData || !bookData.metadata || bookData.metadata.verses === 0) return null;
  
  const verseText = bookData?.chapters?.[verseData.chapter]?.[verseData.verse];
  
  const reference = useMemo(() => ragSystem.formatVerseReference(passage.verse), [passage.verse]);
  const connectionLabel = useMemo(() => ragSystem.getConnectionTypeLabel(passage.type), [passage.type]);
  const connectionColor = useMemo(() => ragSystem.getConnectionColor(passage.type), [passage.type]);
  
  const shouldShowFullText = verseText && verseText.length <= 200;
  
  return (
    <div className="card-elevated p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer group passage-card"
         onClick={() => onNavigate(verseData.book, verseData.chapter)}>
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-green-700" />
        </div>
        <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors flex-1">{reference}</h4>
        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      
      {/* Connection type and similarity */}
      <div className="mb-3">
        <div className="flex items-center space-x-3 mb-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${connectionColor}`}>
            <Tag className="h-3 w-3 mr-1" />
            {connectionLabel}
          </span>
          <span className="text-xs font-medium text-gray-600">({(passage.score * 100).toFixed(0)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, passage.score * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Verse text */}
      {verseText && (
        <div className="text-gray-700 font-serif leading-relaxed">
          {shouldShowFullText ? (
            <p className="text-sm italic">"{verseText}"</p>
          ) : (
            <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Click to view full verse</p>
          )}
        </div>
      )}
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
    <div className="border-t border-white/30 bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm flex-shrink-0 min-h-96 flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold gradient-text">
              Related Passages
            </h3>
            <p className="text-sm text-gray-600 font-medium">AI-powered semantic connections</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-12 h-12 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-emerald-500 animate-spin"></div>
                </div>
              </div>
              <span className="text-gray-600 font-medium">Discovering connections...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Connection error</h4>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : relatedPassages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">No connections found</h4>
            <p className="text-sm text-gray-600">
              Try selecting a different verse to discover semantic connections
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 animate-scale-in">
              {relatedPassages.map((passage, index) => (
                <PassageCard
                  key={`${passage.verse}-${index}`}
                  passage={passage}
                  bibleData={bibleData}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/40 flex-shrink-0">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-600 font-medium text-center">
                  Showing top {relatedPassages.length} most relevant passages • Powered by AI semantic search
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RelatedPassages;