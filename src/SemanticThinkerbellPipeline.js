/**
 * Semantic Thinkerbell Pipeline
 * Complete integration of semantic classification with template management
 * Bridges JavaScript frontend with Python backend capabilities
 */

const EnhancedThinkerbellFormatter = require('./core/EnhancedThinkerbellFormatter');
const TemplateManager = require('./core/TemplateManager');
const SemanticClassifier = require('./core/SemanticClassifier');

class SemanticThinkerbellPipeline {
  constructor(options = {}) {
    this.formatter = new EnhancedThinkerbellFormatter({
      pythonBackendUrl: options.pythonBackendUrl,
      confidenceThreshold: options.confidenceThreshold || 0.3
    });
    
    this.templateManager = new TemplateManager(options.templatesDirectory);
    
    // Pipeline configuration
    this.config = {
      defaultTemplate: options.defaultTemplate || 'slide_deck',
      defaultFormat: options.defaultFormat || 'slides',
      enableSemanticRouting: options.enableSemanticRouting !== false,
      enableConfidenceIndicators: options.enableConfidenceIndicators !== false,
      enableContentSuggestions: options.enableContentSuggestions !== false,
      enableValidation: options.enableValidation !== false,
      enableRealTimePreview: options.enableRealTimePreview !== false,
      pythonBackendUrl: options.pythonBackendUrl,
      confidenceThreshold: options.confidenceThreshold || 0.3,
      ...options
    };

    // Real-time preview cache
    this.previewCache = new Map();
    this.previewDebounceTimeout = null;
  }

  /**
   * Main semantic processing pipeline
   * @param {string|Object} inputData - Input data
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Complete processing result
   */
  async process(inputData, options = {}) {
    const {
      templateName = this.config.defaultTemplate,
      outputFormat = this.config.defaultFormat,
      useTemplateSystem = true,
      enableSemanticRouting = this.config.enableSemanticRouting,
      enableConfidenceIndicators = this.config.enableConfidenceIndicators,
      enableContentSuggestions = this.config.enableContentSuggestions,
      enableValidation = this.config.enableValidation,
      includeAnalytics = true,
      includeDebugInfo = false
    } = options;

    const startTime = Date.now();

    try {
      let result;

      if (enableSemanticRouting) {
        // Use enhanced semantic processing
        result = await this.formatter.processEnhanced(inputData, templateName, outputFormat, {
          enableSemanticRouting,
          enableConfidenceIndicators,
          enableContentSuggestions,
          enableValidation,
          includeAnalytics
        });

        // Apply template system for final formatting if requested
        if (useTemplateSystem && result.enhancedData) {
          const templateFormatted = this.templateManager.applyTemplate(
            templateName, 
            result.enhancedData
          );
          result.templateFormatted = templateFormatted;
        }
      } else {
        // Fallback to basic processing
        const parsedData = this.formatter.parseInput(inputData);
        const enhancedData = this.formatter.applyBrandVoice(parsedData);
        
        if (useTemplateSystem) {
          result = {
            formattedOutput: this.templateManager.applyTemplate(templateName, enhancedData),
            enhancedData,
            processing_method: 'template_only'
          };
        } else {
          const template = this.formatter.getTemplate(templateName);
          result = {
            formattedOutput: this.formatter.formatOutput(enhancedData, template, outputFormat),
            enhancedData,
            processing_method: 'basic'
          };
        }
      }

      // Add performance metrics
      result.performance = {
        processing_time_ms: Date.now() - startTime,
        method: result.processing_method || 'semantic_enhanced',
        backend_used: !!this.config.pythonBackendUrl
      };

      // Add debug information if requested
      if (includeDebugInfo) {
        result.debug = {
          config: this.config,
          classifier_stats: this.formatter.getClassifierStats(),
          template_info: this.templateManager.getTemplateInfo(templateName)
        };
      }

      return result;

    } catch (error) {
      console.error('🚨 Semantic pipeline error:', error.message);
      
      // Graceful fallback
      try {
        const fallbackResult = await this.formatter.process(inputData, templateName, outputFormat);
        return {
          formattedOutput: fallbackResult,
          processing_method: 'fallback',
          error: error.message,
          performance: {
            processing_time_ms: Date.now() - startTime,
            method: 'fallback'
          }
        };
      } catch (fallbackError) {
        throw new Error(`Pipeline failed completely: ${error.message} | Fallback: ${fallbackError.message}`);
      }
    }
  }

  /**
   * Process with semantic intelligence (main method)
   * @param {string|Object} inputData - Input data
   * @param {string} templateName - Template to use
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Semantic processing result
   */
  async processWithSemantics(inputData, templateName, options = {}) {
    return this.process(inputData, {
      templateName,
      useTemplateSystem: true,
      enableSemanticRouting: true,
      ...options
    });
  }

  /**
   * Real-time preview with semantic routing
   * @param {string} content - Content to preview
   * @param {string} templateName - Template for preview
   * @param {number} debounceMs - Debounce delay
   * @returns {Promise<Object>} Preview result
   */
  async generateRealTimePreview(content, templateName = 'slide_deck', debounceMs = 300) {
    if (!this.config.enableRealTimePreview) {
      return { preview: 'Real-time preview disabled', routing: {} };
    }

    // Debounce rapid requests
    if (this.previewDebounceTimeout) {
      clearTimeout(this.previewDebounceTimeout);
    }

    return new Promise((resolve) => {
      this.previewDebounceTimeout = setTimeout(async () => {
        const cacheKey = `${content.substring(0, 100)}_${templateName}`;
        
        // Check cache
        if (this.previewCache.has(cacheKey)) {
          resolve(this.previewCache.get(cacheKey));
          return;
        }

        try {
          const preview = await this.formatter.generatePreview(content, templateName);
          
          // Cache result
          this.previewCache.set(cacheKey, preview);
          
          // Clean cache if it gets too large
          if (this.previewCache.size > 50) {
            const firstKey = this.previewCache.keys().next().value;
            this.previewCache.delete(firstKey);
          }
          
          resolve(preview);
        } catch (error) {
          resolve({
            preview: 'Preview error: ' + error.message,
            routing: {},
            error: error.message
          });
        }
      }, debounceMs);
    });
  }

  /**
   * Explain why content was classified a certain way
   * @param {string} sentence - Sentence to explain
   * @returns {Promise<Object>} Detailed explanation
   */
  async explainClassification(sentence) {
    return await this.formatter.explainClassification(sentence);
  }

  /**
   * Add learning data from user corrections
   * @param {string} sentence - Original sentence
   * @param {string} correctCategory - Correct category
   * @param {string} reason - Reason for correction
   * @returns {Object} Learning result
   */
  addUserCorrection(sentence, correctCategory, reason = '') {
    return this.formatter.addLearningData(sentence, correctCategory, reason);
  }

  /**
   * Batch process multiple inputs with semantic intelligence
   * @param {Array} inputs - Array of input objects
   * @returns {Promise<Array>} Array of processing results
   */
  async batchProcessWithSemantics(inputs) {
    console.log(`🧠 Processing ${inputs.length} items with semantic intelligence...`);
    
    const promises = inputs.map(async (input, index) => {
      try {
        const result = await this.processWithSemantics(
          input.data, 
          input.templateName || this.config.defaultTemplate,
          input.options || {}
        );
        return { index, success: true, result };
      } catch (error) {
        console.error(`❌ Semantic batch item ${index} failed:`, error.message);
        return { index, success: false, error: error.message };
      }
    });

    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success).length;
    
    console.log(`✅ Semantic batch complete: ${successful}/${inputs.length} successful`);
    
    return results;
  }

  /**
   * Generate content suggestions based on semantic analysis
   * @param {string} partialContent - Partial content
   * @param {string} templateName - Target template
   * @returns {Promise<Object>} Content suggestions
   */
  async getSmartSuggestions(partialContent, templateName = 'slide_deck') {
    try {
      const preview = await this.generateRealTimePreview(partialContent, templateName, 100);
      
      return {
        suggestions: preview.suggestions || {},
        routing: preview.routing || {},
        validation: preview.validation || {},
        recommendations: this.generateSmartRecommendations(preview)
      };
    } catch (error) {
      return {
        suggestions: {},
        error: error.message
      };
    }
  }

  /**
   * Generate smart recommendations based on content analysis
   * @param {Object} previewData - Preview analysis data
   * @returns {Array} Array of recommendations
   */
  generateSmartRecommendations(previewData) {
    const recommendations = [];
    
    if (previewData.validation && !previewData.validation.valid) {
      previewData.validation.recommendations.forEach(rec => {
        recommendations.push({
          type: 'balance',
          priority: 'medium',
          message: rec
        });
      });
    }

    if (previewData.analytics) {
      const analytics = previewData.analytics;
      
      // Check confidence levels
      if (analytics.confidence_levels) {
        const lowConfidence = analytics.confidence_levels.low || 0;
        const total = Object.values(analytics.confidence_levels).reduce((a, b) => a + b, 0);
        
        if (lowConfidence / total > 0.4) {
          recommendations.push({
            type: 'confidence',
            priority: 'high',
            message: 'Consider strengthening weak classifications with more specific language'
          });
        }
      }

      // Check distribution
      if (analytics.distribution) {
        const counts = Object.values(analytics.distribution).map(d => d.count);
        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);
        
        if (maxCount > minCount * 4) {
          recommendations.push({
            type: 'distribution',
            priority: 'medium',
            message: 'Consider balancing content across all four categories'
          });
        }
      }
    }

    return recommendations;
  }

  /**
   * Connect to Python backend for advanced semantic processing
   * @param {string} backendUrl - Python backend URL
   * @returns {Promise<boolean>} Connection success
   */
  async connectToPythonBackend(backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        this.config.pythonBackendUrl = backendUrl;
        this.formatter.semanticClassifier.pythonBackendUrl = backendUrl;
        console.log('✅ Connected to Python semantic backend');
        return true;
      } else {
        throw new Error('Backend health check failed');
      }
    } catch (error) {
      console.warn('⚠️ Python backend connection failed:', error.message);
      return false;
    }
  }

  /**
   * Test semantic classification on sample content
   * @returns {Promise<Object>} Test results
   */
  async runSemanticTest() {
    const testContent = `
      I suspect that our audience responds better to authentic stories than polished marketing.
      Research shows that 73% of consumers prefer brands that feel genuine.
      We should focus on user-generated content and real customer testimonials.
      Imagine if we created a platform where customers become brand storytellers themselves.
    `;

    console.log('🧪 Running semantic classification test...');
    
    const result = await this.processWithSemantics(testContent, 'slide_deck', {
      includeAnalytics: true,
      includeDebugInfo: true
    });

    console.log('✅ Test complete');
    return {
      test_content: testContent,
      result: result,
      performance: result.performance,
      method: result.processing_method
    };
  }

  /**
   * Export semantic processing configuration
   * @returns {Object} Complete configuration
   */
  exportSemanticConfig() {
    return {
      config: this.config,
      classifier_stats: this.formatter.getClassifierStats(),
      templates: this.templateManager.getAvailableTemplates(),
      backend_status: !!this.config.pythonBackendUrl
    };
  }

  /**
   * Get semantic pipeline statistics
   * @returns {Object} Pipeline statistics
   */
  getSemanticStats() {
    return {
      ...this.formatter.getClassifierStats(),
      cache_size: this.previewCache.size,
      backend_connected: !!this.config.pythonBackendUrl,
      features_enabled: {
        semantic_routing: this.config.enableSemanticRouting,
        confidence_indicators: this.config.enableConfidenceIndicators,
        content_suggestions: this.config.enableContentSuggestions,
        validation: this.config.enableValidation,
        real_time_preview: this.config.enableRealTimePreview
      }
    };
  }

  /**
   * Clear preview cache
   */
  clearPreviewCache() {
    this.previewCache.clear();
    console.log('🧹 Preview cache cleared');
  }
}

module.exports = SemanticThinkerbellPipeline; 