/**
 * Enhanced Thinkerbell Pipeline
 * Complete integration of content formatting and template management
 */

const ThinkerbellFormatter = require('./core/ThinkerbellFormatter');
const TemplateManager = require('./core/TemplateManager');

class ThinkerbellPipeline {
  constructor(options = {}) {
    this.formatter = new ThinkerbellFormatter();
    this.templateManager = new TemplateManager(options.templatesDirectory);
    
    // Pipeline configuration
    this.config = {
      defaultTemplate: options.defaultTemplate || 'slide_deck',
      defaultFormat: options.defaultFormat || 'slides',
      enableValidation: options.enableValidation !== false,
      enableBrandVoice: options.enableBrandVoice !== false,
      ...options
    };
  }

  /**
   * Process content through the complete pipeline
   * @param {string|Object} inputData - Input data in various formats
   * @param {Object} options - Processing options
   * @returns {Promise<string>} Processed and formatted output
   */
  async process(inputData, options = {}) {
    const {
      templateName = this.config.defaultTemplate,
      outputFormat = this.config.defaultFormat,
      customMapping = null,
      useTemplateSystem = true
    } = options;

    try {
      // 1. Parse input data
      const parsedData = this.formatter.parseInput(inputData);
      
      // 2. Validate if enabled
      if (this.config.enableValidation && useTemplateSystem) {
        const validation = this.templateManager.validateTemplate(templateName, parsedData);
        if (!validation.valid) {
          console.warn('⚠️ Template validation warnings:', validation.warnings);
        }
      }

      // 3. Apply brand voice if enabled
      let processedData = parsedData;
      if (this.config.enableBrandVoice) {
        processedData = this.formatter.applyBrandVoice(parsedData);
      }

      // 4. Choose processing path
      if (useTemplateSystem) {
        // Use template system for advanced formatting
        return this.templateManager.applyTemplate(templateName, processedData, customMapping);
      } else {
        // Use basic formatter
        return this.formatter.process(inputData, templateName, outputFormat);
      }

    } catch (error) {
      console.error('🚨 Pipeline processing error:', error.message);
      throw new Error(`Pipeline failed: ${error.message}`);
    }
  }

  /**
   * Process with template system (recommended)
   * @param {string|Object} inputData - Input data
   * @param {string} templateName - Template to use
   * @param {Object} customMapping - Optional custom mapping
   * @returns {Promise<string>} Formatted output
   */
  async processWithTemplate(inputData, templateName, customMapping = null) {
    return this.process(inputData, {
      templateName,
      useTemplateSystem: true,
      customMapping
    });
  }

  /**
   * Process with basic formatter
   * @param {string|Object} inputData - Input data
   * @param {string} templateType - Template type
   * @param {string} outputFormat - Output format
   * @returns {Promise<string>} Formatted output
   */
  async processBasic(inputData, templateType, outputFormat) {
    return this.process(inputData, {
      templateName: templateType,
      outputFormat,
      useTemplateSystem: false
    });
  }

  /**
   * Load real templates from file system
   * @param {Object} templatePaths - Map of template names to file paths
   */
  async loadRealTemplates(templatePaths) {
    await this.templateManager.loadRealTemplates(templatePaths);
    console.log('✅ Real templates loaded successfully');
  }

  /**
   * Substitute templates with real ones
   * @param {Object} templateMap - Map of template names to template objects
   */
  substituteTemplates(templateMap) {
    this.templateManager.batchSubstitute(templateMap);
    console.log(`✅ Substituted ${Object.keys(templateMap).length} templates`);
  }

  /**
   * Add custom template
   * @param {string} name - Template name
   * @param {Object} template - Template object
   * @param {Object} metadata - Optional metadata
   */
  addTemplate(name, template, metadata = null) {
    this.templateManager.substituteTemplate(name, template);
    if (metadata) {
      this.templateManager.templateMetadata[name] = metadata;
    }
    console.log(`✅ Added custom template: ${name}`);
  }

  /**
   * Get available templates
   * @returns {Array} Array of template names with metadata
   */
  getAvailableTemplates() {
    const templates = this.templateManager.getAvailableTemplates();
    return templates.map(name => ({
      name,
      info: this.templateManager.getTemplateInfo(name)
    }));
  }

  /**
   * Preview template with sample data
   * @param {string} templateName - Template to preview
   * @param {Object} sampleData - Sample data for preview
   * @returns {Promise<string>} Preview output
   */
  async previewTemplate(templateName, sampleData = null) {
    const defaultSampleData = {
      title: "Sample Campaign",
      subtitle: "Template Preview",
      sections: [
        { name: "Hunch", content: "This is a sample hunch section" },
        { name: "Wisdom", content: "This shows how wisdom appears" },
        { name: "Nudge", content: "Sample nudge content here" },
        { name: "Spell", content: "Magic happens in this section" }
      ]
    };

    const data = sampleData || defaultSampleData;
    return this.processWithTemplate(data, templateName);
  }

  /**
   * Batch process multiple inputs
   * @param {Array} inputs - Array of input objects with data and options
   * @returns {Promise<Array>} Array of processed outputs
   */
  async batchProcess(inputs) {
    console.log(`🔄 Processing ${inputs.length} items in batch...`);
    
    const promises = inputs.map(async (input, index) => {
      try {
        const result = await this.process(input.data, input.options || {});
        return { index, success: true, result };
      } catch (error) {
        console.error(`❌ Batch item ${index} failed:`, error.message);
        return { index, success: false, error: error.message };
      }
    });

    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Batch complete: ${successful}/${inputs.length} successful`);
    
    return results;
  }

  /**
   * Export configuration and templates
   * @returns {Object} Complete pipeline configuration
   */
  exportConfig() {
    return {
      config: this.config,
      templates: this.templateManager.templates,
      metadata: this.templateManager.templateMetadata,
      voicePatterns: this.formatter.voicePatterns
    };
  }

  /**
   * Import configuration and templates
   * @param {Object} configData - Configuration to import
   */
  importConfig(configData) {
    if (configData.config) {
      this.config = { ...this.config, ...configData.config };
    }
    
    if (configData.templates) {
      this.templateManager.batchSubstitute(configData.templates);
    }
    
    if (configData.metadata) {
      this.templateManager.templateMetadata = {
        ...this.templateManager.templateMetadata,
        ...configData.metadata
      };
    }
    
    if (configData.voicePatterns) {
      this.formatter.voicePatterns = {
        ...this.formatter.voicePatterns,
        ...configData.voicePatterns
      };
    }
    
    console.log('✅ Configuration imported successfully');
  }

  /**
   * Generate pipeline statistics
   * @returns {Object} Pipeline usage statistics
   */
  getStats() {
    return {
      availableTemplates: this.templateManager.getAvailableTemplates().length,
      templateTypes: Object.keys(this.templateManager.templateMetadata),
      voicePatterns: Object.keys(this.formatter.voicePatterns),
      config: this.config
    };
  }
}

module.exports = ThinkerbellPipeline; 