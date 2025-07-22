/**
 * Enhanced Thinkerbell Formatter with Semantic Classification
 * Integrates semantic intelligence with template formatting
 */

const ThinkerbellFormatter = require('./ThinkerbellFormatter');
const SemanticClassifier = require('./SemanticClassifier');

class EnhancedThinkerbellFormatter extends ThinkerbellFormatter {
  constructor(options = {}) {
    super();
    
    this.semanticClassifier = new SemanticClassifier({
      pythonBackendUrl: options.pythonBackendUrl,
      confidenceThreshold: options.confidenceThreshold || 0.3
    });
    
    this.enhancedTemplates = {
      ...this.templates,
      semantic_analysis: {
        structure: ['overview', 'insights', 'recommendations', 'next_steps'],
        format: 'analysis'
      }
    };

    // Enhanced voice patterns with confidence-based application
    this.enhancedVoicePatterns = {
      ...this.voicePatterns,
      confidence_indicators: {
        high: ['🔥', 'precisely', 'clearly', 'definitively'],
        medium: ['🔍', 'likely', 'probably', 'suggests'],
        low: ['💭', 'possibly', 'might', 'could indicate']
      }
    };
  }

  /**
   * Enhanced processing pipeline with semantic intelligence
   * @param {string|Object} inputData - Input data
   * @param {string} templateType - Template type
   * @param {string} outputFormat - Output format
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Enhanced processing result
   */
  async processEnhanced(inputData, templateType, outputFormat = null, options = {}) {
    const {
      enableSemanticRouting = true,
      enableConfidenceIndicators = true,
      enableContentSuggestions = true,
      enableValidation = true,
      includeAnalytics = true
    } = options;

    // 1. Parse input data
    const parsedData = this.parseInput(inputData);
    
    let result = {
      originalData: parsedData,
      processing_method: 'basic'
    };

         if (enableSemanticRouting) {
       // 2. Semantic classification and routing
       let contentText = '';
       if (parsedData.sections) {
         contentText = parsedData.sections
           .map(section => section.content)
           .join('. ');
       } else if (typeof inputData === 'string') {
         contentText = inputData;
       } else if (parsedData.content) {
         contentText = parsedData.content;
       }
       
       const semanticResult = await this.semanticClassifier.routeContent(contentText);
      
      // 3. Merge semantic routing with original structure
      const enhancedData = this.mergeSemanticResults(parsedData, semanticResult);
      
      // 4. Apply enhanced brand voice with confidence indicators
      let processedData = enhancedData;
      if (this.config?.enableBrandVoice !== false) {
        processedData = this.applyEnhancedBrandVoice(enhancedData, enableConfidenceIndicators);
      }

      // 5. Generate content suggestions
      let suggestions = {};
      if (enableContentSuggestions) {
        suggestions = this.semanticClassifier.getContentSuggestions(semanticResult.routed);
      }

      // 6. Validate content balance
      let validation = {};
      if (enableValidation) {
        validation = this.semanticClassifier.validateContentBalance(semanticResult.routed);
      }

      // 7. Format output
      const template = this.getTemplate(templateType);
      const finalFormat = outputFormat || template.format;
      const formattedOutput = this.formatEnhancedOutput(processedData, template, finalFormat, semanticResult);

      result = {
        originalData: parsedData,
        semanticRouting: semanticResult.routed,
        enhancedData: processedData,
        formattedOutput: formattedOutput,
        analytics: includeAnalytics ? semanticResult.analytics : null,
        suggestions: suggestions,
        validation: validation,
        metadata: {
          ...semanticResult.metadata,
          template: templateType,
          format: finalFormat,
          processing_method: 'semantic_enhanced'
        }
      };
    } else {
      // Fallback to basic processing
      const enhancedData = this.applyBrandVoice(parsedData);
      const template = this.getTemplate(templateType);
      const finalFormat = outputFormat || template.format;
      const formattedOutput = this.formatOutput(enhancedData, template, finalFormat);
      
      result = {
        originalData: parsedData,
        enhancedData: enhancedData,
        formattedOutput: formattedOutput,
        processing_method: 'basic_fallback'
      };
    }

    return result;
  }

  /**
   * Merge semantic classification results with original data structure
   * @param {Object} originalData - Original parsed data
   * @param {Object} semanticResult - Semantic classification result
   * @returns {Object} Merged data structure
   */
  mergeSemanticResults(originalData, semanticResult) {
    const enhancedSections = [];

    // Process semantically routed content
    Object.entries(semanticResult.routed).forEach(([category, items]) => {
      if (items.length > 0) {
        // Combine all items in this category
        const combinedContent = items
          .map(item => this.formatItemWithConfidence(item))
          .join('\n\n');

        enhancedSections.push({
          name: category,
          content: combinedContent,
          semantic_data: {
            item_count: items.length,
            avg_confidence: items.reduce((sum, item) => sum + item.confidence, 0) / items.length,
            method: items[0]?.method || 'unknown'
          }
        });
      }
    });

    // Preserve any sections that weren't semantically processed
    const existingSections = originalData.sections || [];
    const preservedSections = existingSections.filter(section => 
      !['Hunch', 'Wisdom', 'Nudge', 'Spell'].includes(section.name)
    );

    return {
      ...originalData,
      sections: [...enhancedSections, ...preservedSections],
      semantic_metadata: semanticResult.metadata
    };
  }

  /**
   * Format individual items with confidence indicators
   * @param {Object} item - Semantic item with confidence
   * @returns {string} Formatted item text
   */
  formatItemWithConfidence(item) {
    const confidenceLevel = item.confidence > 0.7 ? 'high' : 
                           item.confidence > 0.4 ? 'medium' : 'low';
    
    const indicator = this.enhancedVoicePatterns.confidence_indicators[confidenceLevel][0];
    
    return `${indicator} ${item.text}`;
  }

  /**
   * Apply enhanced brand voice with semantic awareness
   * @param {Object} data - Data to enhance
   * @param {boolean} enableConfidenceIndicators - Whether to show confidence
   * @returns {Object} Enhanced data
   */
  applyEnhancedBrandVoice(data, enableConfidenceIndicators = true) {
    const enhanced = JSON.parse(JSON.stringify(data)); // Deep clone
    
    if (enhanced.sections) {
      enhanced.sections = enhanced.sections.map(section => ({
        ...section,
        content: this.enhanceTextWithSemantics(
          section.content, 
          section.name || section.title,
          section.semantic_data,
          enableConfidenceIndicators
        )
      }));
    }
    
    return enhanced;
  }

  /**
   * Enhance text with semantic awareness and confidence indicators
   * @param {string} text - Text to enhance
   * @param {string} sectionType - Section type
   * @param {Object} semanticData - Semantic metadata
   * @param {boolean} enableConfidenceIndicators - Show confidence
   * @returns {string} Enhanced text
   */
  enhanceTextWithSemantics(text, sectionType, semanticData, enableConfidenceIndicators) {
    if (!text) return text;
    
    // Apply base enhancement
    let enhancedText = this.enhanceText(text, sectionType);
    
    // Add semantic enhancements
    if (semanticData && enableConfidenceIndicators) {
      const avgConfidence = semanticData.avg_confidence || 0;
      const method = semanticData.method || 'unknown';
      
      // Add confidence context
      if (avgConfidence > 0.8) {
        enhancedText += '\n\n*High confidence classification*';
      } else if (avgConfidence < 0.4) {
        enhancedText += '\n\n*Consider strengthening this section*';
      }
      
      // Add method indicator for debugging
      if (method === 'python_backend') {
        enhancedText += ' 🧠';
      } else if (method === 'local') {
        enhancedText += ' 🔍';
      }
    }
    
    return enhancedText;
  }

  /**
   * Enhanced output formatting with semantic insights
   * @param {Object} data - Data to format
   * @param {Object} template - Template configuration
   * @param {string} format - Output format
   * @param {Object} semanticResult - Semantic classification result
   * @returns {string} Formatted output
   */
  formatEnhancedOutput(data, template, format, semanticResult) {
    let output = this.formatOutput(data, template, format);
    
    // Add semantic insights footer
    if (semanticResult && format === 'slides') {
      output += '\n\n---\n\n## 🧠 Semantic Analysis\n\n';
      
      // Add analytics summary
      if (semanticResult.analytics) {
        const analytics = semanticResult.analytics;
        output += `**Content Distribution:**\n`;
        Object.entries(analytics.distribution).forEach(([category, data]) => {
          output += `- ${category}: ${data.count} items (${data.percentage}%)\n`;
        });
        
        output += `\n**Confidence Levels:**\n`;
        if (analytics.confidence_levels) {
          output += `- High confidence: ${analytics.confidence_levels.high} items\n`;
          output += `- Medium confidence: ${analytics.confidence_levels.medium} items\n`;
          output += `- Low confidence: ${analytics.confidence_levels.low} items\n`;
        }
        
        output += `\n**Dominant Category:** ${analytics.dominant_category}\n`;
      }
      
      // Add processing method
      if (semanticResult.metadata) {
        output += `\n*Processed using ${semanticResult.metadata.backend_method || 'local'} classification*\n`;
      }
    }
    
    return output;
  }

  /**
   * Generate real-time preview with semantic routing visualization
   * @param {string} content - Content to preview
   * @param {string} templateType - Template type
   * @returns {Promise<Object>} Preview data with routing visualization
   */
  async generatePreview(content, templateType = 'slide_deck') {
    if (!content || content.trim().length < 10) {
      return {
        preview: 'Enter content to see real-time semantic classification...',
        routing: {},
        suggestions: {}
      };
    }

    // Quick semantic routing for preview
    const semanticResult = await this.semanticClassifier.routeContent(content);
    
    // Generate quick preview
    const previewData = {
      title: 'Real-time Preview',
      sections: Object.entries(semanticResult.routed)
        .filter(([_, items]) => items.length > 0)
        .map(([category, items]) => ({
          name: category,
          content: items.slice(0, 2).map(item => item.text).join('. ')
        }))
    };

    const template = this.getTemplate(templateType);
    const preview = this.formatOutput(previewData, template, template.format);
    
    return {
      preview: preview,
      routing: semanticResult.routed,
      analytics: semanticResult.analytics,
      suggestions: this.semanticClassifier.getContentSuggestions(semanticResult.routed),
      validation: this.semanticClassifier.validateContentBalance(semanticResult.routed)
    };
  }

  /**
   * Explain classification for debugging/learning
   * @param {string} sentence - Sentence to explain
   * @returns {Promise<Object>} Detailed explanation
   */
  async explainClassification(sentence) {
    return await this.semanticClassifier.classifySentence(sentence);
  }

  /**
   * Train/improve classification with user feedback
   * @param {string} sentence - Original sentence
   * @param {string} correctCategory - User-corrected category
   * @param {string} reason - User's reason for correction
   * @returns {Object} Learning result
   */
  addLearningData(sentence, correctCategory, reason = '') {
    // Store for future fine-tuning
    const learningEntry = {
      sentence: sentence,
      correct_category: correctCategory,
      reason: reason,
      timestamp: new Date().toISOString(),
      source: 'user_correction'
    };

    // In a real implementation, this would be sent to the backend for training
    console.log('Learning data collected:', learningEntry);
    
    return {
      status: 'recorded',
      entry: learningEntry,
      message: 'Thank you! This correction will improve future classifications.'
    };
  }

  /**
   * Get semantic classification statistics
   * @returns {Object} Current classifier statistics
   */
  getClassifierStats() {
    return {
      anchors: Object.keys(this.semanticClassifier.anchors),
      confidence_threshold: this.semanticClassifier.confidenceThreshold,
      python_backend: !!this.semanticClassifier.pythonBackendUrl,
      voice_patterns: Object.keys(this.enhancedVoicePatterns)
    };
  }
}

module.exports = EnhancedThinkerbellFormatter; 