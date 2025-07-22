/**
 * Semantic Classifier for Thinkerbell Pipeline
 * JavaScript implementation of semantic classification engine
 * Bridges to Python backend when available, falls back to local classification
 */

class SemanticClassifier {
  constructor(options = {}) {
    this.pythonBackendUrl = options.pythonBackendUrl || null;
    this.confidenceThreshold = options.confidenceThreshold || 0.3;
    
    // Semantic anchors - the "brain" of classification
    this.anchors = {
      'Hunch': {
        keywords: ['suspect', 'intuition', 'feeling', 'guess', 'hypothesis', 'theory', 'wonder', 'might', 'could', 'probably', 'think', 'believe'],
        patterns: ['what if', 'i think', 'my gut says', 'feeling like', 'suspicion', 'i suspect', 'probably'],
        weights: { keywords: 1, patterns: 2, contextual: 1.5 },
        description: 'A clever suspicion or idea. Often intuitive and playful, not yet proven.',
        icon: '💡',
        color: 'bg-yellow-100 border-yellow-300'
      },
      'Wisdom': {
        keywords: ['data', 'research', 'study', 'evidence', 'shows', 'proves', 'statistics', 'analysis', 'insight', 'learned', 'findings', 'report'],
        patterns: ['% of', 'research shows', 'data indicates', 'studies prove', 'evidence suggests', 'analysis reveals', 'findings show'],
        weights: { keywords: 1, patterns: 2.5, contextual: 2 },
        description: 'A strategic insight based on data or experience.',
        icon: '📊',
        color: 'bg-blue-100 border-blue-300'
      },
      'Nudge': {
        keywords: ['should', 'recommend', 'suggest', 'action', 'next', 'do', 'try', 'implement', 'consider', 'move', 'focus', 'prioritize'],
        patterns: ['we should', 'recommend', 'next step', 'action item', 'let\'s try', 'suggest we', 'focus on'],
        weights: { keywords: 1, patterns: 2, contextual: 1.5 },
        description: 'A recommended action, often subtle or behaviorally informed.',
        icon: '👉',
        color: 'bg-green-100 border-green-300'
      },
      'Spell': {
        keywords: ['magical', 'surprising', 'unexpected', 'creative', 'innovative', 'unique', 'extraordinary', 'amazing', 'imagine', 'picture'],
        patterns: ['imagine if', 'what if we', 'picture this', 'magical moment', 'surprise twist', 'extraordinary idea'],
        weights: { keywords: 1, patterns: 2.5, contextual: 2 },
        description: 'A surprising creative flourish or magical execution idea.',
        icon: '✨',
        color: 'bg-purple-100 border-purple-300'
      }
    };

    // Contextual indicators for enhanced classification
    this.contextualIndicators = {
      'Hunch': ['uncertain', 'possibility', 'maybe', 'perhaps', 'speculation'],
      'Wisdom': ['proven', 'measured', 'tracked', 'observed', 'documented'],
      'Nudge': ['action', 'step', 'strategy', 'approach', 'recommendation'],
      'Spell': ['creative', 'breakthrough', 'innovation', 'transformation']
    };
  }

  /**
   * Main classification method - tries Python backend first, falls back to local
   * @param {string} sentence - Sentence to classify
   * @returns {Promise<Object>} Classification result with confidence
   */
  async classifySentence(sentence) {
    try {
      // Try Python backend first if available
      if (this.pythonBackendUrl) {
        return await this.classifyWithPython(sentence);
      }
    } catch (error) {
      console.log('Python backend unavailable, using local classification');
    }
    
    // Fallback to local classification
    return this.classifyLocally(sentence);
  }

  /**
   * Local JavaScript classification using enhanced keyword/pattern matching
   * @param {string} sentence - Sentence to classify
   * @returns {Object} Classification result
   */
  classifyLocally(sentence) {
    const scores = {};
    const lowerSentence = sentence.toLowerCase();
    const words = lowerSentence.split(/\s+/);
    
    Object.entries(this.anchors).forEach(([category, anchor]) => {
      let score = 0;
      
      // Keyword matching with position weighting
      anchor.keywords.forEach(keyword => {
        const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = (lowerSentence.match(keywordRegex) || []).length;
        score += matches * anchor.weights.keywords;
        
        // Bonus for keywords at sentence start
        if (lowerSentence.startsWith(keyword)) {
          score += 0.5;
        }
      });
      
      // Pattern matching (higher weight)
      anchor.patterns.forEach(pattern => {
        if (lowerSentence.includes(pattern)) {
          score += anchor.weights.patterns;
        }
      });
      
      // Contextual indicators
      this.contextualIndicators[category]?.forEach(indicator => {
        if (lowerSentence.includes(indicator)) {
          score += anchor.weights.contextual;
        }
      });
      
      // Sentence structure analysis
      score += this.analyzeStructure(sentence, category);
      
      scores[category] = score;
    });
    
    // Normalize scores to get confidence
    const maxScore = Math.max(...Object.values(scores));
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    if (maxScore === 0) {
      return {
        category: 'Hunch',
        confidence: 0.2,
        scores: scores,
        method: 'local_fallback'
      };
    }
    
    const bestCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const confidence = Math.min(maxScore / (totalScore + 1), 1.0); // Normalize and cap at 1.0
    
    return {
      category: confidence > this.confidenceThreshold ? bestCategory : 'Hunch',
      confidence: confidence,
      scores: scores,
      method: 'local',
      explanation: this.generateExplanation(sentence, bestCategory, confidence, scores)
    };
  }

  /**
   * Analyze sentence structure for classification hints
   * @param {string} sentence - Sentence to analyze
   * @param {string} category - Category being scored
   * @returns {number} Structure score
   */
  analyzeStructure(sentence, category) {
    let score = 0;
    
    // Question vs statement analysis
    if (sentence.includes('?')) {
      if (category === 'Hunch') score += 1; // Questions often indicate hunches
    } else if (sentence.includes('.') || sentence.includes('!')) {
      if (category === 'Wisdom' || category === 'Nudge') score += 0.5; // Statements for wisdom/nudges
    }
    
    // Numbers and percentages favor Wisdom
    if (category === 'Wisdom' && /\d+%|\d+\.\d+|statistics|metrics/.test(sentence)) {
      score += 1.5;
    }
    
    // Imperative mood favors Nudge
    if (category === 'Nudge' && /^(let's|we need|should|must|try|focus)/i.test(sentence.trim())) {
      score += 1;
    }
    
    // Creative language favors Spell
    if (category === 'Spell' && /imagine|picture|creative|magical|extraordinary/i.test(sentence)) {
      score += 1;
    }
    
    return score;
  }

  /**
   * Generate explanation for classification decision
   * @param {string} sentence - Original sentence
   * @param {string} category - Predicted category
   * @param {number} confidence - Confidence score
   * @param {Object} scores - All category scores
   * @returns {string} Human-readable explanation
   */
  generateExplanation(sentence, category, confidence, scores) {
    const anchor = this.anchors[category];
    const triggeredKeywords = anchor.keywords.filter(kw => 
      sentence.toLowerCase().includes(kw)
    );
    const triggeredPatterns = anchor.patterns.filter(pattern => 
      sentence.toLowerCase().includes(pattern)
    );
    
    let explanation = `Classified as '${category}' with ${(confidence * 100).toFixed(1)}% confidence. `;
    
    if (triggeredKeywords.length > 0) {
      explanation += `Keywords: ${triggeredKeywords.join(', ')}. `;
    }
    if (triggeredPatterns.length > 0) {
      explanation += `Patterns: ${triggeredPatterns.join(', ')}. `;
    }
    
    return explanation;
  }

  /**
   * Call Python backend for semantic classification
   * @param {string} sentence - Sentence to classify
   * @returns {Promise<Object>} Classification result
   */
  async classifyWithPython(sentence) {
    const response = await fetch(`${this.pythonBackendUrl}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence: sentence })
    });
    
    if (!response.ok) {
      throw new Error('Python backend classification failed');
    }
    
    const result = await response.json();
    return {
      category: result.predicted_category,
      confidence: result.confidence,
      scores: result.all_similarities,
      method: 'python_backend',
      explanation: result.reasoning,
      backend_data: result
    };
  }

  /**
   * Route content into semantic buckets
   * @param {string} content - Content to route
   * @returns {Promise<Object>} Routed content with metadata
   */
  async routeContent(content) {
    const sentences = this.splitIntoSentences(content);
    const routed = {
      'Hunch': [],
      'Wisdom': [],
      'Nudge': [],
      'Spell': []
    };
    
    const classifications = [];
    
    for (const sentence of sentences) {
      if (sentence.trim().length < 10) continue; // Skip very short sentences
      
      const classification = await this.classifySentence(sentence);
      classifications.push(classification);
      
      routed[classification.category].push({
        text: sentence.trim(),
        confidence: classification.confidence,
        explanation: classification.explanation,
        method: classification.method,
        scores: classification.scores
      });
    }
    
    // Sort by confidence within each category
    Object.keys(routed).forEach(category => {
      routed[category].sort((a, b) => b.confidence - a.confidence);
    });
    
    return {
      routed: routed,
      analytics: this.generateAnalytics(routed, classifications),
      metadata: {
        total_sentences: sentences.length,
        processed_sentences: classifications.length,
        average_confidence: classifications.reduce((sum, c) => sum + c.confidence, 0) / classifications.length || 0,
        backend_method: classifications.find(c => c.method === 'python_backend') ? 'hybrid' : 'local'
      }
    };
  }

  /**
   * Generate analytics about the classification
   * @param {Object} routed - Routed content
   * @param {Array} classifications - All classifications
   * @returns {Object} Analytics data
   */
  generateAnalytics(routed, classifications) {
    const totalItems = Object.values(routed).reduce((sum, items) => sum + items.length, 0);
    
    if (totalItems === 0) {
      return { error: 'No content to analyze' };
    }
    
    const distribution = {};
    const avgConfidence = {};
    
    Object.entries(routed).forEach(([category, items]) => {
      distribution[category] = {
        count: items.length,
        percentage: (items.length / totalItems * 100).toFixed(1)
      };
      
      avgConfidence[category] = items.length > 0
        ? items.reduce((sum, item) => sum + item.confidence, 0) / items.length
        : 0;
    });
    
    const dominantCategory = Object.keys(distribution)
      .reduce((a, b) => distribution[a].count > distribution[b].count ? a : b);
    
    return {
      distribution,
      average_confidence: avgConfidence,
      dominant_category: dominantCategory,
      total_sentences: totalItems,
      confidence_levels: {
        high: classifications.filter(c => c.confidence > 0.7).length,
        medium: classifications.filter(c => c.confidence > 0.4 && c.confidence <= 0.7).length,
        low: classifications.filter(c => c.confidence <= 0.4).length
      }
    };
  }

  /**
   * Split text into meaningful sentences
   * @param {string} text - Text to split
   * @returns {Array} Array of sentences
   */
  splitIntoSentences(text) {
    // Enhanced sentence splitting that preserves meaning
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  /**
   * Get content suggestions for empty categories
   * @param {Object} routed - Current routed content
   * @returns {Object} Suggestions for each category
   */
  getContentSuggestions(routed) {
    const suggestions = {};
    
    Object.entries(this.anchors).forEach(([category, anchor]) => {
      if (!routed[category] || routed[category].length === 0) {
        suggestions[category] = [
          `Consider adding a ${category.toLowerCase()} about your main hypothesis`,
          `What ${category.toLowerCase()} supports your strategy?`,
          `Include a ${category.toLowerCase()} that enhances your argument`,
          anchor.description
        ];
      }
    });
    
    return suggestions;
  }

  /**
   * Validate content balance across categories
   * @param {Object} routed - Routed content
   * @returns {Object} Validation results with recommendations
   */
  validateContentBalance(routed) {
    const counts = Object.fromEntries(
      Object.entries(routed).map(([cat, items]) => [cat, items.length])
    );
    
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const warnings = [];
    const recommendations = [];
    
    // Check for missing categories
    Object.keys(this.anchors).forEach(category => {
      if (counts[category] === 0) {
        warnings.push(`Missing ${category} content`);
        recommendations.push(`Add ${category.toLowerCase()} to strengthen your argument`);
      }
    });
    
    // Check for imbalanced content
    const maxCount = Math.max(...Object.values(counts));
    const minCount = Math.min(...Object.values(counts));
    
    if (maxCount > minCount * 3 && total > 4) {
      warnings.push('Content distribution is unbalanced');
      recommendations.push('Consider redistributing content more evenly across categories');
    }
    
    return {
      valid: warnings.length === 0,
      warnings,
      recommendations,
      distribution: Object.fromEntries(
        Object.entries(counts).map(([cat, count]) => [
          cat, 
          { count, percentage: total > 0 ? (count / total * 100).toFixed(1) : 0 }
        ])
      )
    };
  }
}

module.exports = SemanticClassifier; 