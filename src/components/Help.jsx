import { X, BookOpen, MessageSquare, Network, Info } from 'lucide-react';

function Help({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-t-4 border-gradient-to-r from-blue-500 to-purple-600 min-h-96 flex flex-col max-w-full overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 p-6 w-full max-w-full">
        <div className="flex items-center space-x-4 w-full max-w-full overflow-hidden">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold gradient-text">Help & Guide</h3>
            <p className="text-sm text-gray-600 font-medium mt-1">Learn how to use Bible Reader</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-200 mr-4"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 w-full">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
            {/* Welcome Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Welcome to Bible Reader</h3>
              <p className="text-gray-700 leading-relaxed">
                Bible Reader is a modern web application designed to help you explore Scripture with
                AI-powered commentary and semantic search. Discover connections between verses and
                gain deeper insights through expert biblical commentary.
              </p>
            </section>

            {/* Features Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Complete New Testament</h4>
                    <p className="text-gray-600 text-sm">
                      Access all 27 books of the New Testament in the American Standard Version (ASV)
                      with 7,217 verses ready to explore.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Biblical Commentary</h4>
                    <p className="text-gray-600 text-sm">
                      Read John Gill's Exposition of the Bible with theological insights for 4,739 verses.
                      Click any verse to view detailed commentary and historical context.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Network className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Related Passages</h4>
                    <p className="text-gray-600 text-sm">
                      Discover semantically related verses using AI embeddings. Our system helps you
                      find thematically similar passages, cross-references, and parallel accounts.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Use Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Navigate to a Passage</h4>
                  <p className="text-blue-800 text-sm">
                    Use the dropdown menus at the top to select a book and chapter. Browse through
                    the New Testament to find the passage you want to study.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">2. Click a Verse</h4>
                  <p className="text-purple-800 text-sm">
                    Click on any verse to view detailed commentary and related passages. The verse
                    will be highlighted, and a sidebar will appear with additional information.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 mb-2">3. Explore Connections</h4>
                  <p className="text-green-800 text-sm">
                    View the top 5 most semantically similar passages to discover related themes,
                    cross-references, parallel passages, and quotations. Click on any related verse
                    to navigate directly to it.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">4. Read Commentary</h4>
                  <p className="text-orange-800 text-sm">
                    Dive deeper into the meaning with John Gill's theological exposition. Commentary
                    includes word studies, historical context, and doctrinal insights.
                  </p>
                </div>
              </div>
            </section>

            {/* Tips Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips for Better Study</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm">Use related passages to gain a fuller understanding of themes and doctrines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm">Compare parallel gospel accounts to see different perspectives on the same event</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm">Read commentary to understand historical and cultural context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm">Follow cross-references to trace themes throughout Scripture</span>
                </li>
              </ul>
            </section>

            {/* About Section */}
            <section className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">About This Project</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                Bible Reader combines traditional biblical scholarship with modern AI technology
                to create an enhanced Scripture study experience. Built with React and powered by
                semantic embeddings, this app helps you discover connections and insights you
                might have missed.
              </p>
              <p className="text-gray-600 text-xs">
                Translation: American Standard Version (1901) • Commentary: John Gill's Exposition
                • AI Model: sentence-transformers/all-MiniLM-L6-v2
              </p>
            </section>
        </div>
      </div>
    </div>
  );
}

export default Help;
