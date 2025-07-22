import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  FileText, 
  TrendingUp,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Sparkles,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react';
import { useSemanticContext } from '../context/SemanticContext';
import toast from 'react-hot-toast';

const Playground = () => {
  const {
    currentContent,
    currentTemplate,
    routing,
    analytics,
    suggestions,
    preview,
    previewLoading,
    lastResult,
    availableTemplates,
    canProcess,
    loading,
    updateContent,
    updateTemplate,
    processContent,
    explainClassification
  } = useSemanticContext();

  const [selectedSentence, setSelectedSentence] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const examples = [
    {
      name: "Strategy Brief",
      content: `Our brand strategy needs a major overhaul. I suspect that consumers are becoming more conscious about sustainability. Recent studies indicate that 68% of millennials are willing to pay more for sustainable products. We should pivot our messaging to emphasize our eco-friendly practices. Picture this: an interactive sustainability tracker that gamifies eco-conscious purchasing decisions.`
    },
    {
      name: "Campaign Analysis", 
      content: `The new product launch feels risky without more user research. I think our audience responds better to authentic storytelling than polished marketing. Data shows that behind-the-scenes content gets 3x more engagement. We should focus on employee takeovers and office culture posts. Imagine if each employee became a mini-influencer for the brand.`
    },
    {
      name: "Social Strategy",
      content: `Social media engagement is declining across platforms. I believe we're posting too much corporate content. Analytics show that user-generated content performs 300% better than branded posts. We recommend shifting to customer story campaigns. What if we created a platform where customers become our brand storytellers?`
    }
  ];

  const handleProcess = async () => {
    if (!currentContent.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    try {
      await processContent(currentContent, currentTemplate);
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  const handleExplain = async () => {
    if (!selectedSentence.trim()) {
      toast.error('Please select a sentence to explain');
      return;
    }

    try {
      const result = await explainClassification(selectedSentence);
      setExplanation(result);
      setShowExplanation(true);
    } catch (error) {
      console.error('Explanation failed:', error);
    }
  };

  const handleCopy = async () => {
    if (lastResult?.formattedOutput) {
      await navigator.clipboard.writeText(lastResult.formattedOutput);
      toast.success('Output copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (lastResult?.formattedOutput) {
      const blob = new Blob([lastResult.formattedOutput], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thinkerbell-${currentTemplate}-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('File downloaded!');
    }
  };

  const getSentences = (content) => {
    return content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Semantic Playground</h1>
          <p className="text-xl text-gray-600 mt-2">
            Experience real-time AI content classification
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Content Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Content Input
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={currentTemplate}
                  onChange={(e) => updateTemplate(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="slide_deck">Slide Deck</option>
                  <option value="strategy_doc">Strategy Document</option>
                  <option value="creative_brief">Creative Brief</option>
                  <option value="measurement_report">Measurement Report</option>
                </select>
              </div>
            </div>
            
            <textarea
              value={currentContent}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Enter your strategy content, campaign ideas, or any unstructured text..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            
            {/* Example Buttons */}
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => updateContent(example.content)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-indigo-500" />
              Actions
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleProcess}
                disabled={!canProcess || !currentContent.trim()}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Process with AI</span>
                  </>
                )}
              </button>
              
              {lastResult && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Classification */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
              Real-time Classification
              {previewLoading && <RefreshCw className="w-4 h-4 ml-2 animate-spin text-indigo-500" />}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {['Hunch', 'Wisdom', 'Nudge', 'Spell'].map((category) => {
                const count = routing[category]?.length || 0;
                const icon = getCategoryIcon(category);
                const color = getCategoryColor(category);
                
                return (
                  <motion.div
                    key={category}
                    className={`p-4 rounded-lg border-2 ${color}`}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: count > 0 ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{icon}</div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">{category}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {analytics && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Dominant:</span> {analytics.dominant_category} • 
                  <span className="font-medium ml-2">Sentences:</span> {analytics.total_sentences} • 
                  <span className="font-medium ml-2">High Confidence:</span> {analytics.confidence_levels?.high || 0}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {/* Formatted Output */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              Enhanced Output
            </h3>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap">
                {lastResult?.formattedOutput || preview || 'Enhanced content will appear here...'}
              </pre>
            </div>
          </div>

          {/* Smart Suggestions */}
          {Object.keys(suggestions).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Smart Suggestions
              </h3>
              
              <div className="space-y-3">
                {Object.entries(suggestions).map(([category, suggestionList]) => (
                  <div key={category} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800 mb-1">
                      {getCategoryIcon(category)} {category}
                    </div>
                    <div className="text-sm text-yellow-700">
                      {suggestionList[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentence Explanation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
              Classification Explanation
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a sentence to explain:
                </label>
                <select
                  value={selectedSentence}
                  onChange={(e) => setSelectedSentence(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose a sentence...</option>
                  {getSentences(currentContent).map((sentence, index) => (
                    <option key={index} value={sentence.trim()}>
                      {sentence.trim().substring(0, 60)}...
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleExplain}
                disabled={!selectedSentence}
                className="w-full bg-indigo-100 text-indigo-700 rounded-lg px-4 py-2 font-medium hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Explain Classification
              </button>
              
              {showExplanation && explanation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-2">
                    <div><span className="font-medium">Category:</span> {explanation.category}</div>
                    <div><span className="font-medium">Confidence:</span> {(explanation.confidence * 100).toFixed(1)}%</div>
                    <div><span className="font-medium">Method:</span> {explanation.method}</div>
                    <div><span className="font-medium">Explanation:</span> {explanation.explanation}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    'Hunch': '💡',
    'Wisdom': '📊', 
    'Nudge': '👉',
    'Spell': '✨'
  };
  return icons[category] || '▶️';
};

const getCategoryColor = (category) => {
  const colors = {
    'Hunch': 'bg-yellow-100 border-yellow-300',
    'Wisdom': 'bg-blue-100 border-blue-300',
    'Nudge': 'bg-green-100 border-green-300',
    'Spell': 'bg-purple-100 border-purple-300'
  };
  return colors[category] || 'bg-gray-100 border-gray-300';
};

export default Playground; 