import { ChevronLeft, ChevronRight, Book, AlertTriangle } from 'lucide-react';

const NT_BOOKS = [
  { key: 'matthew', name: 'Matthew', chapters: 28 },
  { key: 'mark', name: 'Mark', chapters: 16 },
  { key: 'luke', name: 'Luke', chapters: 24 },
  { key: 'john', name: 'John', chapters: 21 },
  { key: 'acts', name: 'Acts', chapters: 28 },
  { key: 'romans', name: 'Romans', chapters: 16 },
  { key: '1_corinthians', name: '1 Corinthians', chapters: 16 },
  { key: '2_corinthians', name: '2 Corinthians', chapters: 13 },
  { key: 'galatians', name: 'Galatians', chapters: 6 },
  { key: 'ephesians', name: 'Ephesians', chapters: 6 },
  { key: 'philippians', name: 'Philippians', chapters: 4 },
  { key: 'colossians', name: 'Colossians', chapters: 4 },
  { key: '1_thessalonians', name: '1 Thessalonians', chapters: 5 },
  { key: '2_thessalonians', name: '2 Thessalonians', chapters: 3 },
  { key: '1_timothy', name: '1 Timothy', chapters: 6 },
  { key: '2_timothy', name: '2 Timothy', chapters: 4 },
  { key: 'titus', name: 'Titus', chapters: 3 },
  { key: 'philemon', name: 'Philemon', chapters: 1 },
  { key: 'hebrews', name: 'Hebrews', chapters: 13 },
  { key: 'james', name: 'James', chapters: 5 },
  { key: '1_peter', name: '1 Peter', chapters: 5 },
  { key: '2_peter', name: '2 Peter', chapters: 3 },
  { key: '1_john', name: '1 John', chapters: 5 },
  { key: '2_john', name: '2 John', chapters: 1 },
  { key: '3_john', name: '3 John', chapters: 1 },
  { key: 'jude', name: 'Jude', chapters: 1 },
  { key: 'revelation', name: 'Revelation', chapters: 22 }
];

function Navigation({ 
  currentBook, 
  currentChapter, 
  onBookChange, 
  onChapterChange,
  bibleData 
}) {
  const currentBookData = currentBook ? bibleData?.books?.[currentBook] : null;
  const maxChapter = currentBookData ? Object.keys(currentBookData.chapters || {}).length : 1;
  
  const isBookAvailable = (bookKey) => {
    const book = bibleData?.books?.[bookKey];
    return book && book.metadata.verses > 0;
  };
  
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      onChapterChange(currentChapter - 1);
    } else if (currentBook) {
      // Go to previous available book's last chapter
      const currentIndex = NT_BOOKS.findIndex(b => b.key === currentBook);
      for (let i = currentIndex - 1; i >= 0; i--) {
        const prevBook = NT_BOOKS[i];
        if (isBookAvailable(prevBook.key)) {
          const prevBookData = bibleData?.books?.[prevBook.key];
          const lastChapter = prevBookData ? Object.keys(prevBookData.chapters || {}).length : 1;
          onBookChange(prevBook.key);
          onChapterChange(lastChapter);
          break;
        }
      }
    }
  };
  
  const handleNextChapter = () => {
    if (currentChapter < maxChapter) {
      onChapterChange(currentChapter + 1);
    } else if (currentBook) {
      // Go to next available book's first chapter
      const currentIndex = NT_BOOKS.findIndex(b => b.key === currentBook);
      for (let i = currentIndex + 1; i < NT_BOOKS.length; i++) {
        const nextBook = NT_BOOKS[i];
        if (isBookAvailable(nextBook.key)) {
          onBookChange(nextBook.key);
          onChapterChange(1);
          break;
        }
      }
    }
  };
  
  const canGoPrev = currentChapter > 1 || 
    (currentBook && NT_BOOKS.findIndex(b => b.key === currentBook) > 0 && 
     NT_BOOKS.slice(0, NT_BOOKS.findIndex(b => b.key === currentBook)).some(book => isBookAvailable(book.key)));
  
  const canGoNext = currentChapter < maxChapter || 
    (currentBook && NT_BOOKS.findIndex(b => b.key === currentBook) < NT_BOOKS.length - 1 &&
     NT_BOOKS.slice(NT_BOOKS.findIndex(b => b.key === currentBook) + 1).some(book => isBookAvailable(book.key)));
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          
          {/* Book Selection */}
          <div className="flex items-center space-x-4 flex-1 lg:flex-none">
            <Book className="h-5 w-5 text-gray-600" />
            <select
              value={currentBook || ''}
              onChange={(e) => {
                onBookChange(e.target.value);
                onChapterChange(1);
              }}
              className="flex-1 lg:flex-none border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a book...</option>
              <optgroup label="Gospels">
                {NT_BOOKS.slice(0, 4).map(book => (
                  <option 
                    key={book.key} 
                    value={book.key}
                    disabled={!isBookAvailable(book.key)}
                  >
                    {book.name} {!isBookAvailable(book.key) ? '(not available)' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="History">
                <option 
                  value="acts"
                  disabled={!isBookAvailable('acts')}
                >
                  Acts {!isBookAvailable('acts') ? '(not available)' : ''}
                </option>
              </optgroup>
              <optgroup label="Pauline Epistles">
                {NT_BOOKS.slice(5, 18).map(book => (
                  <option 
                    key={book.key} 
                    value={book.key}
                    disabled={!isBookAvailable(book.key)}
                  >
                    {book.name} {!isBookAvailable(book.key) ? '(not available)' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="General Epistles">
                {NT_BOOKS.slice(18, 26).map(book => (
                  <option 
                    key={book.key} 
                    value={book.key}
                    disabled={!isBookAvailable(book.key)}
                  >
                    {book.name} {!isBookAvailable(book.key) ? '(not available)' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Prophecy">
                <option 
                  value="revelation"
                  disabled={!isBookAvailable('revelation')}
                >
                  Revelation {!isBookAvailable('revelation') ? '(not available)' : ''}
                </option>
              </optgroup>
            </select>
          </div>
          
          {/* Availability Status */}
          {bibleData && (
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-600">
              <span>{Object.keys(bibleData.books || {}).length} of {NT_BOOKS.length} books available</span>
              {Object.keys(bibleData.books || {}).length < NT_BOOKS.length && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          )}
          
          {/* Chapter Navigation */}
          {currentBook && (
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <button
                onClick={handlePrevChapter}
                disabled={!canGoPrev}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  canGoPrev
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Previous</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Chapter</span>
                <select
                  value={currentChapter}
                  onChange={(e) => onChapterChange(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: maxChapter }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-400">of {maxChapter}</span>
              </div>
              
              <button
                onClick={handleNextChapter}
                disabled={!canGoNext}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  canGoNext
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-sm">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Navigation;