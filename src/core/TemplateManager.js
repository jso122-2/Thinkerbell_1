/**
 * Template Management System for Thinkerbell Pipeline
 * Handles template loading, substitution, and management
 */

const fs = require('fs').promises;
const path = require('path');

class TemplateManager {
  constructor(templatesDirectory = './templates') {
    this.templatesDirectory = templatesDirectory;
    
    // Default mock templates - will be replaced with real Thinkerbell templates
    this.templates = {
      slide_deck: {
        header: "# {{title}}\n*{{subtitle}}*\n\n---\n\n",
        section: "## {{section_icon}} {{section_title}}\n\n{{section_content}}\n\n---\n\n",
        footer: "*Crafted with ✨ by Thinkerbell*"
      },
      
      strategy_doc: {
        header: "# {{title}}\n\n**Executive Summary**: {{summary}}\n\n",
        section: "### {{section_title}}\n\n{{section_content}}\n\n",
        callout: "> **{{callout_type}}**: {{callout_content}}\n\n",
        footer: "---\n\n*Strategy developed by Thinkerbell | {{date}}*"
      },
      
      measurement_report: {
        header: "# {{title}} | Measurement Report\n\n",
        metric_table: "| Metric | Target | Actual | Variance |\n|--------|--------|--------|----------|\n{{metric_rows}}",
        insight: "**💡 Key Insight**: {{insight_content}}\n\n",
        recommendation: "**👉 Next Action**: {{recommendation_content}}\n\n"
      },
      
      creative_brief: {
        header: "# Creative Brief: {{campaign_name}}\n\n",
        section: "**{{section_title}}**\n{{section_content}}\n\n",
        magic_moment: "✨ **The Magic**: {{magic_content}}\n\n",
        approval_box: "---\n**Approvals**\n- [ ] Strategy Lead\n- [ ] Creative Director\n- [ ] Client\n\n*Date: {{date}}*"
      }
    };

    // Template metadata for guidance
    this.templateMetadata = {
      slide_deck: {
        description: "Presentation format with clear section breaks",
        best_for: ["campaign recaps", "strategy presentations", "client pitches"],
        sections: ["title", "sections", "conclusion"]
      },
      strategy_doc: {
        description: "Long-form strategic document",
        best_for: ["strategy briefs", "planning documents", "frameworks"],
        sections: ["header", "problem", "solution", "tactics"]
      },
      measurement_report: {
        description: "Data-focused reporting format",
        best_for: ["campaign results", "performance analysis", "ROI reports"],
        sections: ["metrics", "insights", "recommendations"]
      },
      creative_brief: {
        description: "Creative development template",
        best_for: ["campaign briefs", "creative direction", "concept approval"],
        sections: ["challenge", "audience", "message", "execution"]
      }
    };
  }

  /**
   * Load template from memory or file system
   * @param {string} templateName - Name of template to load
   * @returns {Object} Template object
   */
  async loadTemplate(templateName) {
    // First check if template is already loaded
    if (this.templates[templateName]) {
      return { ...this.templates[templateName] }; // Return copy to prevent mutation
    }

    // Try to load from file system
    try {
      const templatePath = path.join(this.templatesDirectory, `${templateName}.json`);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const template = JSON.parse(templateContent);
      this.templates[templateName] = template;
      return { ...template };
    } catch (error) {
      throw new Error(`Template '${templateName}' not found in memory or file system`);
    }
  }

  /**
   * Load template synchronously (for immediate use)
   * @param {string} templateName - Name of template to load
   * @returns {Object} Template object
   */
  loadTemplateSync(templateName) {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    return { ...template }; // Return copy to prevent mutation
  }

  /**
   * Replace mock template with real template
   * @param {string} templateName - Name of template to substitute
   * @param {Object} realTemplate - Real template object
   * @returns {TemplateManager} Returns this for chaining
   */
  substituteTemplate(templateName, realTemplate) {
    console.log(`🔄 Substituting template '${templateName}' with real template`);
    this.templates[templateName] = realTemplate;
    return this;
  }

  /**
   * Batch substitute multiple templates
   * @param {Object} templateMap - Map of template names to template objects
   * @returns {TemplateManager} Returns this for chaining
   */
  batchSubstitute(templateMap) {
    Object.entries(templateMap).forEach(([name, template]) => {
      this.substituteTemplate(name, template);
    });
    return this;
  }

  /**
   * Load real templates from file system
   * @param {Object} templatePaths - Map of template names to file paths
   */
  async loadRealTemplates(templatePaths) {
    console.log('🔄 Loading real templates from file system...');
    
    const loadPromises = Object.entries(templatePaths).map(async ([name, filePath]) => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        let template;
        
        // Support different file formats
        if (filePath.endsWith('.json')) {
          template = JSON.parse(content);
        } else if (filePath.endsWith('.md') || filePath.endsWith('.txt')) {
          template = this.parseTemplateFile(content);
        } else {
          template = { content: content };
        }
        
        return [name, template];
      } catch (error) {
        console.warn(`⚠️ Failed to load template '${name}' from '${filePath}':`, error.message);
        return null;
      }
    });

    const results = await Promise.all(loadPromises);
    const successfulLoads = results.filter(Boolean);
    
    this.batchSubstitute(Object.fromEntries(successfulLoads));
    console.log(`✅ Loaded ${successfulLoads.length} real templates`);
  }

  /**
   * Parse template file content into structured template
   * @param {string} content - Template file content
   * @returns {Object} Parsed template
   */
  parseTemplateFile(content) {
    // Simple parser for markdown-based templates
    // Look for sections marked with <!-- SECTION: name -->
    const sections = {};
    const sectionRegex = /<!-- SECTION: (\w+) -->(.*?)(?=<!-- SECTION: \w+ -->|$)/gs;
    
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      const sectionName = match[1];
      const sectionContent = match[2].trim();
      sections[sectionName] = sectionContent;
    }

    // If no sections found, use entire content as main template
    if (Object.keys(sections).length === 0) {
      sections.main = content;
    }

    return sections;
  }

  /**
   * Apply template to data
   * @param {string} templateName - Name of template to use
   * @param {Object} data - Data to populate template with
   * @param {Object} sectionMapping - Optional custom section mapping
   * @returns {string} Rendered template
   */
  applyTemplate(templateName, data, sectionMapping = null) {
    const template = this.loadTemplateSync(templateName);
    let output = '';

    // Apply header
    if (template.header && data.title) {
      output += this.interpolate(template.header, {
        title: data.title,
        subtitle: data.subtitle || '',
        summary: data.summary || '',
        date: new Date().toLocaleDateString(),
        campaign_name: data.campaign_name || data.title
      });
    }

    // Apply sections
    if (data.sections && template.section) {
      data.sections.forEach(section => {
        const sectionData = {
          section_title: section.name || section.title,
          section_content: section.content,
          section_icon: this.getSectionIcon(section.name || section.title),
          ...section // Include any additional section data
        };
        
        output += this.interpolate(template.section, sectionData);
      });
    }

    // Apply special formats based on template type
    if (templateName === 'measurement_report' && data.metrics) {
      output += this.formatMetricsTable(data.metrics, template);
    }

    if (template.magic_moment && data.magic) {
      output += this.interpolate(template.magic_moment, { magic_content: data.magic });
    }

    // Apply footer
    if (template.footer) {
      output += this.interpolate(template.footer, {
        date: new Date().toLocaleDateString()
      });
    }

    return output;
  }

  /**
   * Simple template interpolation with variable substitution
   * @param {string} template - Template string with {{variables}}
   * @param {Object} data - Data object with values
   * @returns {string} Interpolated string
   */
  interpolate(template, data) {
    let result = template;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    });
    return result;
  }

  /**
   * Get appropriate icon for section type
   * @param {string} sectionName - Name of section
   * @returns {string} Icon emoji
   */
  getSectionIcon(sectionName) {
    const iconMap = {
      'hunch': '💡',
      'wisdom': '📊', 
      'nudge': '👉',
      'spell': '✨',
      'challenge': '🎯',
      'insight': '🧠',
      'strategy': '🗺️',
      'tactics': '⚡',
      'problem': '❓',
      'audience': '👥',
      'message': '💬',
      'execution': '🚀',
      'magic': '✨'
    };
    
    const lowerName = sectionName.toLowerCase();
    return iconMap[lowerName] || '▶️';
  }

  /**
   * Format metrics into table
   * @param {Array} metrics - Array of metric objects
   * @param {Object} template - Template object
   * @returns {string} Formatted metrics table
   */
  formatMetricsTable(metrics, template) {
    if (!template.metric_table) return '';
    
    const rows = metrics.map(metric => 
      `| ${metric.name} | ${metric.target} | ${metric.actual} | ${metric.variance} |`
    ).join('\n');
    
    return this.interpolate(template.metric_table, { metric_rows: rows });
  }

  /**
   * Get list of available templates
   * @returns {Array} Array of template names
   */
  getAvailableTemplates() {
    return Object.keys(this.templates);
  }

  /**
   * Get template metadata
   * @param {string} templateName - Name of template
   * @returns {Object} Template metadata
   */
  getTemplateInfo(templateName) {
    return this.templateMetadata[templateName];
  }

  /**
   * Validate template against data
   * @param {string} templateName - Name of template
   * @param {Object} data - Data to validate against
   * @returns {Object} Validation result
   */
  validateTemplate(templateName, data) {
    const template = this.loadTemplateSync(templateName);
    const metadata = this.getTemplateInfo(templateName);
    
    const warnings = [];
    
    // Check for required fields
    if (template.header && !data.title) {
      warnings.push("Missing 'title' field for header");
    }
    
    if (template.section && !data.sections) {
      warnings.push("Missing 'sections' array for content");
    }
    
    return {
      valid: warnings.length === 0,
      warnings: warnings
    };
  }

  /**
   * Save template to file system
   * @param {string} templateName - Name of template
   * @param {Object} template - Template object to save
   */
  async saveTemplate(templateName, template) {
    const templatePath = path.join(this.templatesDirectory, `${templateName}.json`);
    await fs.writeFile(templatePath, JSON.stringify(template, null, 2));
    console.log(`💾 Template '${templateName}' saved to ${templatePath}`);
  }
}

module.exports = TemplateManager; 