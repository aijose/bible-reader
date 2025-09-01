import { useEffect, useRef, useState } from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';
import { setupTextSelectionHandler } from '../utils/textSelection';

function BibleReader({ book, chapter, onVerseSelect, selectedVerse }) {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);
  
  console.log('📖 BibleReader debug:', { book, chapter });
  
  useEffect(() => {
    if (containerRef.current && onVerseSelect) {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      
      cleanupRef.current = setupTextSelectionHandler(
        containerRef.current,
        onVerseSelect
      );
    }
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [onVerseSelect, book, chapter]);

  useEffect(() => {
    if (book && chapter) {
      setIsRendering(true);
      const timer = setTimeout(() => setIsRendering(false), 100);
      return () => clearTimeout(timer);
    }
  }, [book, chapter]);
  
  if (!book || !chapter) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Select a book and chapter to begin reading</p>
          <p className="text-sm mt-2">Use the navigation above to choose a passage</p>
        </div>
      </div>
    );
  }
  
  const verses = book.chapters?.[chapter];
  if (!verses) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="text-lg">Chapter not available</p>
          <p className="text-sm mt-2 text-gray-600">
            {book.metadata?.name} Chapter {chapter} is not yet available
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Try selecting a different chapter or book
          </p>
        </div>
      </div>
    );
  }

  if (isRendering) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }
  
  const verseNumbers = Object.keys(verses).sort((a, b) => parseInt(a) - parseInt(b));
  
  console.log('📖 Rendering verses:', verseNumbers.length, 'verses for', book.metadata.name, chapter);
  
  return (
    <div 
      ref={containerRef}
      className="prose prose-lg max-w-none leading-relaxed"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {book.metadata.name} {chapter}
        </h2>
        
        <div className="space-y-2">
          {verseNumbers.map(verseNum => {
            const verseId = `${book.metadata.name.toLowerCase().replace(/\s+/g, '_')}_${chapter}_${verseNum}`;
            const isSelected = selectedVerse === verseId;
            
            return (
              <div
                key={verseNum}
                data-verse-id={verseId}
                onClick={(e) => {
                  e.stopPropagation();
                  onVerseSelect(verseId);
                }}
                className={`verse-container ${
                  isSelected 
                    ? 'bg-blue-50 border-l-4 border-blue-500 pl-4 py-2 rounded-r' 
                    : 'hover:bg-gray-50 active:bg-gray-100 py-1'
                } transition-colors cursor-pointer select-text touch-manipulation`}
              >
                <span className="verse-number inline-block text-sm font-medium text-gray-500" style={{marginRight: '8px', minWidth: '32px'}}>
                  {verseNum}
                </span>
                <span className="verse-text text-gray-900">
                  {verses[verseNum]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-8 pt-4 border-t">
        <p>Select any verse to view commentary and related passages</p>
        <p className="mt-1">American Standard Version (1901) - Public Domain</p>
      </div>
    </div>
  );
}

export default BibleReader;