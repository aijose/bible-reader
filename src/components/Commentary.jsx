import { useState } from 'react';
import { X, ChevronDown, ChevronRight, User, Tag } from 'lucide-react';

function CommentarySection({ commentary, isExpanded, onToggleExpand }) {
  const showPreview = !isExpanded && commentary.text.length > 200;
  const displayText = showPreview ? commentary.preview : commentary.text;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
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
      
      {commentary.theological_tags && commentary.theological_tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Tag className="h-3 w-3 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {commentary.theological_tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Commentary({ selectedVerse, commentaries, isOpen, onClose }) {
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (source) => {
    setExpandedSections(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };
  
  if (!isOpen) return null;
  
  const verseCommentaries = selectedVerse ? commentaries?.commentaries?.[selectedVerse] : null;
  
  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-gray-50 border-l border-gray-200 transform transition-transform duration-300 z-20 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
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
            {selectedVerse.replace(/_/g, ' ').replace(/(\w+)\s(\d+)\s(\d+)/, '$1 $2:$3')}
          </p>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedVerse ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No verse selected</p>
              <p className="text-sm">Select a verse in the Bible text to view commentary</p>
            </div>
          </div>
        ) : !verseCommentaries || verseCommentaries.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No commentary available</p>
              <p className="text-sm">Commentary for this verse is not yet available</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
      
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <p>Commentary sources: Matthew Henry, John Gill</p>
          <p className="mt-1">Public domain materials</p>
        </div>
      </div>
    </div>
  );
}

export default Commentary;