import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BibleReader from './components/BibleReader';
import Commentary from './components/Commentary';
import { loadBibleData, loadCommentaries } from './utils/dataLoader';

function App() {
  const [bibleData, setBibleData] = useState(null);
  const [commentaries, setCommentaries] = useState(null);
  const [currentBook, setCurrentBook] = useState('matthew');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [bible, commentaryData] = await Promise.all([
          loadBibleData(),
          loadCommentaries()
        ]);
        
        setBibleData(bible);
        setCommentaries(commentaryData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleVerseSelect = (verseId) => {
    setSelectedVerse(verseId);
    setSidebarOpen(true);
  };

  const handleBookChange = (bookKey) => {
    setCurrentBook(bookKey);
    setSelectedVerse(null);
    setSidebarOpen(false);
  };

  const handleChapterChange = (chapter) => {
    setCurrentChapter(chapter);
    setSelectedVerse(null);
    setSidebarOpen(false);
  };

  const currentBookData = bibleData?.books?.[currentBook];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Bible data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Bible Reader with Commentary
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Select any verse to view commentary and related passages
          </p>
        </div>
      </header>
      
      <Navigation
        currentBook={currentBook}
        currentChapter={currentChapter}
        onBookChange={handleBookChange}
        onChapterChange={handleChapterChange}
        bibleData={bibleData}
      />
      
      <main className={`transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BibleReader
              book={currentBookData}
              chapter={currentChapter}
              onVerseSelect={handleVerseSelect}
              selectedVerse={selectedVerse}
            />
          </div>
        </div>
      </main>
      
      <Commentary
        selectedVerse={selectedVerse}
        commentaries={commentaries}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
}

export default App;