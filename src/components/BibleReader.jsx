import { useEffect, useRef } from 'react';
import { setupTextSelectionHandler } from '../utils/textSelection';

function BibleReader({ book, chapter, onVerseSelect, selectedVerse }) {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);
  
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
  
  if (!book || !chapter) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
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
          <p className="text-lg">Chapter not found</p>
          <p className="text-sm mt-2">Please select a valid chapter</p>
        </div>
      </div>
    );
  }
  
  const verseNumbers = Object.keys(verses).sort((a, b) => parseInt(a) - parseInt(b));
  
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
                className={`verse-container ${
                  isSelected 
                    ? 'bg-blue-50 border-l-4 border-blue-500 pl-4 py-2 rounded-r' 
                    : 'hover:bg-gray-50 py-1'
                } transition-colors cursor-pointer select-text`}
              >
                <span className="verse-number inline-block w-8 text-sm font-medium text-gray-500 mr-2">
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