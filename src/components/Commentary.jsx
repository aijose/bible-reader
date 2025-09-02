import { useState } from 'react';
import { X, ChevronDown, ChevronRight, User, Tag } from 'lucide-react';
import RelatedPassages from './RelatedPassages';
import ragSystem from '../utils/ragSystem';

function CommentarySection({ commentary, isExpanded, onToggleExpand }) {
  const showPreview = !isExpanded && commentary.text.length > 200;
  const displayText = showPreview ? commentary.preview : commentary.text;
  
  return (
    <div className="card-elevated p-6 w-full hover:shadow-xl transition-all duration-300">
      <div className="mb-4">
        <h4 className="font-bold text-gray-900 text-lg mb-2">{commentary.source}</h4>
        <div className="flex items-center space-x-2">
          {commentary.theological_tags && commentary.theological_tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="text-gray-800 leading-relaxed font-serif text-base mb-4">
        {displayText}
      </div>
      
      {commentary.text.length > 200 && (
        <button
          onClick={onToggleExpand}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all duration-200 hover:translate-x-1"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" />
              <span>Read more</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function Commentary({ selectedVerse, commentaries, bibleData, isOpen, onClose, onNavigate }) {
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (source) => {
    setExpandedSections(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };
  
  const verseCommentaries = selectedVerse ? commentaries?.commentaries?.[selectedVerse] : null;
  
  console.log('💬 Commentary render:', { selectedVerse, isOpen, hasCommentaries: !!commentaries, verseCommentariesCount: verseCommentaries?.length || 0 });
  
  // Debug: Force visibility for testing
  if (selectedVerse) {
    console.log('🚨 Commentary should be visible! SelectedVerse:', selectedVerse, 'IsOpen:', isOpen);
  } else {
    console.log('⚪ No verse selected, showing placeholder');
  }
  
  return (
    <>
      {/* Elegant Full Width Commentary */}
      {isOpen && (
      <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-t-4 border-gradient-to-r from-blue-500 to-purple-600 min-h-96 flex flex-col max-w-full overflow-hidden">
      
      {/* Beautiful Header */}
      <div className="glass-effect border-b border-white/20 p-6 w-full max-w-full">
        <div className="flex items-center space-x-4 w-full max-w-full overflow-hidden">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold gradient-text truncate">
              Commentary & Insights
            </h3>
            {selectedVerse && (
              <p className="text-sm text-gray-600 font-medium mt-1 truncate">
                {ragSystem.formatVerseReference(selectedVerse)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-200 ml-4"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {!selectedVerse ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Select a verse to explore</h4>
              <p className="text-sm text-gray-600">Click any verse in the Bible text to view commentary and related passages</p>
            </div>
          </div>
        ) : (
          <>
            {/* Commentary Section */}
            <div className="flex-1 overflow-y-auto p-6 w-full">
              {!verseCommentaries || verseCommentaries.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Commentary coming soon</h4>
                    <p className="text-sm text-gray-600">Commentary for this verse is not yet available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 w-full animate-slide-up">
                  {verseCommentaries.map((commentary, index) => (
                    <CommentarySection
                      key={`${commentary.source}-${index}`}
                      commentary={commentary}
                      isExpanded={expandedSections[commentary.source]}
                      onToggleExpand={() => toggleSection(commentary.source)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Related Passages Section - Always show when verse is selected */}
            <RelatedPassages
              selectedVerse={selectedVerse}
              bibleData={bibleData}
              onNavigate={onNavigate}
              isOpen={isOpen && selectedVerse}
            />
          </>
        )}
      </div>
      </div>
      )}
    </>
  );
}

export default Commentary;