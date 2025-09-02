import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BibleReader from './components/BibleReader';
import Commentary from './components/Commentary';
import { loadBibleData, loadCommentaries, clearCache } from './utils/dataLoader';
import ragSystem from './utils/ragSystem';

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
        
        // Force clear cache for debugging Revelation issue
        if (localStorage.getItem('bible_asv_data')) {
          const cached = JSON.parse(localStorage.getItem('bible_asv_data'));
          if (cached.version !== '1.8') {
            console.log('🗑️ Clearing old Bible cache...');
            localStorage.removeItem('bible_asv_data');
          }
        }
        
        const bible = await loadBibleData();
        console.log('📚 Loaded Bible data:', { 
          totalBooks: Object.keys(bible.books || {}).length,
          galatians: bible.books?.galatians ? Object.keys(bible.books.galatians.chapters || {}) : 'not found'
        });
        setBibleData(bible);
        setLoadingProgress({ step: 'Loading commentaries...', progress: 60 });
        
        const commentaryData = await loadCommentaries();
        setCommentaries(commentaryData);
        setLoadingProgress({ step: 'Initializing RAG system...', progress: 80 });
        
        // Initialize RAG system
        try {
          console.log('🔧 Starting RAG system initialization...');
          await ragSystem.initialize();
          console.log('✅ RAG system initialization complete');
        } catch (ragError) {
          console.error('❌ RAG system initialization failed:', ragError);
          // Continue without RAG system
        }
        setLoadingProgress({ step: 'Complete', progress: 100 });
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 200));
        
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
    
    // Auto-navigate to first available chapter for books with non-consecutive chapters
    const bookData = bibleData?.books?.[bookKey];
    if (bookData) {
      const availableChapters = Object.keys(bookData.chapters || {}).map(Number).sort((a, b) => a - b);
      const firstChapter = availableChapters.length > 0 ? Math.min(...availableChapters) : 1;
      if (firstChapter !== 1) {
        setCurrentChapter(firstChapter);
      } else {
        setCurrentChapter(1);
      }
    }
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md mx-4">
          <div className="glass-effect p-8 rounded-2xl">
            {/* Elegant spinner */}
            <div className="relative mb-8">
              <div className="w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold gradient-text mb-3">
              Bible Reader
            </h2>
            <p className="text-gray-600 mb-6 font-medium">{loadingProgress.step}</p>
            
            {/* Elegant progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${loadingProgress.progress}%`,
                  background: 'var(--gradient-primary)'
                }}
              ></div>
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed">
              Preparing your spiritual study experience with commentary and semantic search...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"></div>
        
        <div className="relative z-10 text-center max-w-md mx-4">
          <div className="glass-effect p-8 rounded-2xl border border-red-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mx-auto mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Unable to load Bible Reader</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{error}</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary w-full"
              >
                Reload Application
              </button>
              <button 
                onClick={() => {
                  clearCache();
                  window.location.reload();
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Clear Cache & Reload
              </button>
              <p className="text-xs text-gray-500 leading-relaxed mt-4">
                If this problem persists, ensure all data files are properly generated
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Elegant header */}
      <header className="relative z-10">
        <div className="glass-effect border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold gradient-text mb-2">
                  Bible Reader
                </h1>
                <p className="text-gray-600 text-sm lg:text-base font-medium">
                  Discover Scripture with AI-powered commentary and semantic search
                </p>
              </div>
              
              {/* Elegant mobile sidebar indicator */}
              {selectedVerse && (
                <div className="lg:hidden">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.716-6M3 12a9 9 0 019-9 9.057 9.057 0 016.716 3M12 9v3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
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
      
      <main className="relative z-10 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="card-elevated p-8 lg:p-12">
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