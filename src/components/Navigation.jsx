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
  const availableChapters = currentBookData ? Object.keys(currentBookData.chapters || {}).map(Number).sort((a, b) => a - b) : [];
  const maxChapter = availableChapters.length > 0 ? Math.max(...availableChapters) : 1;
  
  const isBookAvailable = (bookKey) => {
    const book = bibleData?.books?.[bookKey];
    return book && book.metadata.verses > 0;
  };
  
  const handlePrevChapter = () => {
    const currentIndex = availableChapters.indexOf(currentChapter);
    if (currentIndex > 0) {
      // Go to previous available chapter in same book
      onChapterChange(availableChapters[currentIndex - 1]);
    } else if (currentBook) {
      // Go to previous available book's last chapter
      const bookIndex = NT_BOOKS.findIndex(b => b.key === currentBook);
      for (let i = bookIndex - 1; i >= 0; i--) {
        const prevBook = NT_BOOKS[i];
        if (isBookAvailable(prevBook.key)) {
          const prevBookData = bibleData?.books?.[prevBook.key];
          const prevBookChapters = prevBookData ? Object.keys(prevBookData.chapters || {}).map(Number).sort((a, b) => a - b) : [];
          const lastChapter = prevBookChapters.length > 0 ? Math.max(...prevBookChapters) : 1;
          onBookChange(prevBook.key);
          onChapterChange(lastChapter);
          break;
        }
      }
    }
  };
  
  const handleNextChapter = () => {
    const currentIndex = availableChapters.indexOf(currentChapter);
    if (currentIndex >= 0 && currentIndex < availableChapters.length - 1) {
      // Go to next available chapter in same book
      onChapterChange(availableChapters[currentIndex + 1]);
    } else if (currentBook) {
      // Go to next available book's first chapter
      const bookIndex = NT_BOOKS.findIndex(b => b.key === currentBook);
      for (let i = bookIndex + 1; i < NT_BOOKS.length; i++) {
        const nextBook = NT_BOOKS[i];
        if (isBookAvailable(nextBook.key)) {
          const nextBookData = bibleData?.books?.[nextBook.key];
          const nextBookChapters = nextBookData ? Object.keys(nextBookData.chapters || {}).map(Number).sort((a, b) => a - b) : [];
          const firstChapter = nextBookChapters.length > 0 ? Math.min(...nextBookChapters) : 1;
          onBookChange(nextBook.key);
          onChapterChange(firstChapter);
          break;
        }
      }
    }
  };
  
  const currentChapterIndex = availableChapters.indexOf(currentChapter);
  const canGoPrev = currentChapterIndex > 0 || 
    (currentBook && NT_BOOKS.findIndex(b => b.key === currentBook) > 0 && 
     NT_BOOKS.slice(0, NT_BOOKS.findIndex(b => b.key === currentBook)).some(book => isBookAvailable(book.key)));
  
  const canGoNext = currentChapterIndex >= 0 && currentChapterIndex < availableChapters.length - 1 || 
    (currentBook && NT_BOOKS.findIndex(b => b.key === currentBook) < NT_BOOKS.length - 1 &&
     NT_BOOKS.slice(NT_BOOKS.findIndex(b => b.key === currentBook) + 1).some(book => isBookAvailable(book.key)));
  
  return (
    <div className="sticky top-0 z-20 glass-effect border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          
          {/* Book Selection */}
          <div className="flex items-center space-x-4 flex-1 lg:flex-none">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
              <Book className="h-6 w-6 text-blue-700" />
            </div>
            <select
              value={currentBook || ''}
              onChange={(e) => {
                onBookChange(e.target.value);
                onChapterChange(1);
              }}
              className="flex-1 lg:flex-none border-2 border-gray-200 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-8 text-gray-900 font-semibold shadow-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-300 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
              style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px"}}
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
          
          
          {/* Elegant Chapter Navigation */}
          {currentBook && (
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <button
                onClick={handlePrevChapter}
                disabled={!canGoPrev}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  canGoPrev
                    ? 'bg-white/80 hover:bg-white text-gray-700 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm'
                    : 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Previous</span>
              </button>
              
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <span className="text-sm font-medium text-gray-600">Chapter</span>
                <select
                  value={currentChapter}
                  onChange={(e) => onChapterChange(parseInt(e.target.value))}
                  className="border-0 bg-transparent text-lg font-bold text-gray-900 focus:ring-0 focus:outline-none cursor-pointer"
                >
                  {availableChapters.map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-500">of {availableChapters.length}</span>
              </div>
              
              <button
                onClick={handleNextChapter}
                disabled={!canGoNext}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  canGoNext
                    ? 'bg-white/80 hover:bg-white text-gray-700 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm'
                    : 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
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