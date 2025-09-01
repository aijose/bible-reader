import { useState } from 'react';
import { X, ChevronDown, ChevronRight, User, Tag } from 'lucide-react';
import RelatedPassages from './RelatedPassages';
import ragSystem from '../utils/ragSystem';

function CommentarySection({ commentary, isExpanded, onToggleExpand }) {
  const showPreview = !isExpanded && commentary.text.length > 200;
  const displayText = showPreview ? commentary.preview : commentary.text;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-600" />
          <h4 className="font-semibold text-gray-900">{commentary.source}</h4>
        </div>
        <div className="text-xs text-gray-500">
          {commentary.length} characters
        </div>
      </div>
      
      <div className="text-gray-800 leading-relaxed mb-3">
        {displayText}
      </div>
      
      {commentary.text.length > 200 && (
        <button
          onClick={onToggleExpand}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-3 w-3" />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronRight className="h-3 w-3" />
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
      {/* Full Width Commentary */}
      {isOpen && (
      <div className="w-full bg-gray-50 border-t-4 border-blue-500 min-h-96 flex flex-col" style={{ width: '100vw', minWidth: '100vw' }}>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-900">
            Commentary
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {selectedVerse && (
          <p className="text-sm text-gray-600 mt-2">
            {ragSystem.formatVerseReference(selectedVerse)}
          </p>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {!selectedVerse ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No verse selected</p>
              <p className="text-sm">Select a verse in the Bible text to view commentary</p>
            </div>
          </div>
        ) : (
          <>
            {/* Commentary Section */}
            <div className="flex-1 overflow-y-auto p-4 w-full">
              {!verseCommentaries || verseCommentaries.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">No commentary available</p>
                    <p className="text-sm">Commentary for this verse is not yet available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 w-full">
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