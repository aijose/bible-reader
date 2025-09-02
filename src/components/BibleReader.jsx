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
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Bible Reader</h3>
          <p className="text-gray-600 mb-1">Select a book and chapter to begin your study</p>
          <p className="text-sm text-gray-500">Use the navigation above to choose a passage</p>
        </div>
      </div>
    );
  }
  
  const verses = book.chapters?.[chapter];
  if (!verses) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="h-10 w-10 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chapter not available</h3>
          <p className="text-gray-600 mb-1">
            {book.metadata?.name} Chapter {chapter} is not yet available
          </p>
          <p className="text-sm text-gray-500">
            Try selecting a different chapter or book from the navigation above
          </p>
        </div>
      </div>
    );
  }

  if (isRendering) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading chapter...</p>
        </div>
      </div>
    );
  }
  
  const verseNumbers = Object.keys(verses).sort((a, b) => parseInt(a) - parseInt(b));
  
  console.log('📖 Rendering verses:', verseNumbers.length, 'verses for', book.metadata.name, chapter);
  
  return (
    <div 
      ref={containerRef}
      className="max-w-4xl mx-auto"
    >
      {/* Beautiful chapter header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold gradient-text mb-2 font-serif">
          {book.metadata.name}
        </h2>
        <div className="flex items-center justify-center space-x-3 max-w-sm mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
          <span className="text-base font-semibold text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
            Chapter {chapter}
          </span>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
        </div>
      </div>
      
      {/* Beautiful verse display */}
      <div className="space-y-1 animate-fade-in">
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
              className={`verse-container group ${
                isSelected 
                  ? 'verse-highlight pl-6 pr-4 py-3 rounded-2xl' 
                  : 'hover:bg-white/60 hover:shadow-sm active:bg-white/80 py-2 px-2 rounded-xl'
              } transition-all duration-300 cursor-pointer select-text touch-manipulation`}
            >
              <div className="flex items-start space-x-3">
                <span className={`verse-number inline-flex items-center justify-center w-7 h-7 text-sm font-bold rounded-lg flex-shrink-0 transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                }`}>
                  {verseNum}
                </span>
                <span className="verse-text text-gray-900 font-serif text-base leading-relaxed flex-1">
                  {verses[verseNum]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Elegant footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-3 shadow-sm">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Click any verse for commentary & insights</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-xs text-gray-500 font-medium">American Standard Version (1901)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BibleReader;