import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BibleReader from './components/BibleReader';
import Commentary from './components/Commentary';
import { loadBibleData, loadCommentaries, clearCache } from './utils/dataLoader';

function App() {
  const [bibleData, setBibleData] = useState(null);
  const [commentaries, setCommentaries] = useState(null);
  const [currentBook, setCurrentBook] = useState('matthew');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState({ step: '', progress: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setLoadingProgress({ step: 'Loading Bible text...', progress: 20 });
        
        const bible = await loadBibleData();
        setBibleData(bible);
        setLoadingProgress({ step: 'Loading commentaries...', progress: 60 });
        
        const commentaryData = await loadCommentaries();
        setCommentaries(commentaryData);
        setLoadingProgress({ step: 'Initializing...', progress: 90 });
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 200));
        setLoadingProgress({ step: 'Complete', progress: 100 });
        
        setError(null);
      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleVerseSelect = (verseId) => {
    console.log('🎯 Verse selected:', verseId);
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

  const handleNavigateToVerse = (book, chapter) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setSelectedVerse(null);
    setSidebarOpen(false);
  };

  const currentBookData = bibleData?.books?.[currentBook];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bible Reader
          </h2>
          <p className="text-gray-600 mb-4">{loadingProgress.step}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress.progress}%` }}
            ></div>
          </div>
          
          <p className="text-gray-500 text-sm">
            Setting up your Bible reading experience...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load Bible Reader</h2>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Reload Application
              </button>
              <button 
                onClick={() => {
                  clearCache();
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Cache & Reload
              </button>
              <p className="text-xs text-gray-500">
                If this problem persists, ensure all data files are properly generated
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Bible Reader
              </h1>
              <p className="text-gray-600 text-xs lg:text-sm mt-1">
                Select any verse to view commentary and related passages
              </p>
            </div>
            
            {/* Mobile sidebar indicator */}
            {selectedVerse && (
              <div className="lg:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.716-6M3 12a9 9 0 019-9 9.057 9.057 0 016.716 3M12 9v3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <Navigation
        currentBook={currentBook}
        currentChapter={currentChapter}
        onBookChange={handleBookChange}
        onChapterChange={handleChapterChange}
        bibleData={bibleData}
      />
      
      <main className={`transition-all duration-300 ${sidebarOpen ? 'md:mr-96' : ''}`}>
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
        bibleData={bibleData}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigateToVerse}
      />
    </div>
  );
}

export default App;