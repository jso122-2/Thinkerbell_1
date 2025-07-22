/**
 * Thinkerbell Content Formatting Pipeline
 * Converts structured data into polished, witty outputs with brand voice
 */

class ThinkerbellFormatter {
  constructor() {
    // Default templates - can be substituted with real Thinkerbell templates
    this.templates = {
      campaign_recap: {
        structure: ['hunch', 'wisdom', 'nudge', 'spell'],
        format: 'slides'
      },
      strategy_brief: {
        structure: ['challenge', 'insight', 'strategy', 'tactics'],
        format: 'document'
      },
      measurement_framework: {
        structure: ['hypothesis', 'metrics', 'targets', 'timeline'],
        format: 'table'
      },
      creative_brief: {
        structure: ['problem', 'audience', 'message', 'magic'],
        format: 'bullets'
      }
    };

    // Thinkerbell brand voice patterns
    this.voicePatterns = {
      playful: ['delightfully', 'surprisingly', 'charmingly', 'wickedly'],
      sharp: ['precisely', 'exactly', 'directly', 'clearly'],
      unexpected: ['plot twist:', 'here\'s the thing:', 'surprise:', 'wait for it:']
    };
  }

  /**
   * Main processing pipeline
   * @param {string|Object} inputData - Input data in various formats
   * @param {string} templateType - Type of template to use
   * @param {string} outputFormat - Optional output format override
   * @returns {string} Formatted output
   */
  process(inputData, templateType, outputFormat = null) {
    // 1. Parse input data
    const parsedData = this.parseInput(inputData);
    
    // 2. Get template
    const template = this.getTemplate(templateType);
    
    // 3. Apply Thinkerbell voice
    const enhancedData = this.applyBrandVoice(parsedData);
    
    // 4. Format output
    const outputFormat_final = outputFormat || template.format;
    const formattedOutput = this.formatOutput(enhancedData, template, outputFormat_final);
    
    return formattedOutput;
  }

  /**
   * Parse input from various formats
   * @param {string|Object} input - Input to parse
   * @returns {Object} Parsed data
   */
  parseInput(input) {
    if (typeof input === 'string') {
      try {
        // Try JSON first
        return JSON.parse(input);
      } catch {
        try {
          // Try YAML parsing (simplified)
          return this.parseYAML(input);
        } catch {
          // Treat as markdown
          return this.parseMarkdown(input);
        }
      }
    }
    return input;
  }

  /**
   * Simple YAML parser for basic structures
   * @param {string} yamlString - YAML content
   * @returns {Object} Parsed YAML
   */
  parseYAML(yamlString) {
    const lines = yamlString.split('\n');
    const result = {};
    let currentKey = null;
    let currentSection = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes(':') && !trimmed.startsWith('-') && !line.startsWith('  ')) {
        const [key, value] = trimmed.split(':');
        currentKey = key.trim();
        result[currentKey] = value ? value.trim() : [];
      } else if (trimmed.startsWith('- name:')) {
        // Start of a new section
        const name = trimmed.split('name:')[1]?.trim();
        if (name && currentKey) {
          if (!Array.isArray(result[currentKey])) {
            result[currentKey] = [];
          }
          currentSection = { name: name };
          result[currentKey].push(currentSection);
        }
      } else if (trimmed.startsWith('content:') && currentSection) {
        // Add content to current section
        const content = trimmed.split('content:')[1]?.trim();
        if (content) {
          currentSection.content = content;
        }
      } else if (trimmed.startsWith('-') && currentKey && !currentSection) {
        // Simple list item
        if (!Array.isArray(result[currentKey])) {
          result[currentKey] = [];
        }
        result[currentKey].push(trimmed.substring(1).trim());
      }
    }
    return result;
  }

  /**
   * Extract sections from markdown
   * @param {string} mdString - Markdown content
   * @returns {Object} Parsed markdown structure
   */
  parseMarkdown(mdString) {
    const sections = mdString.split('\n## ').map(section => {
      const lines = section.split('\n');
      const title = lines[0].replace('#', '').trim();
      const content = lines.slice(1).join('\n').trim();
      return { title, content };
    });
    return { sections };
  }

  /**
   * Get template configuration
   * @param {string} templateType - Template type identifier
   * @returns {Object} Template configuration
   */
  getTemplate(templateType) {
    return this.templates[templateType] || this.templates.campaign_recap;
  }

  /**
   * Apply Thinkerbell brand voice to content
   * @param {Object} data - Data to enhance
   * @returns {Object} Enhanced data with brand voice
   */
  applyBrandVoice(data) {
    const enhanced = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // Enhance content with brand voice
    if (enhanced.sections) {
      enhanced.sections = enhanced.sections.map(section => ({
        ...section,
        content: this.enhanceText(section.content, section.name || section.title)
      }));
    }
    
    return enhanced;
  }

  /**
   * Enhance text with appropriate voice patterns
   * @param {string} text - Text to enhance
   * @param {string} sectionType - Type of section for context
   * @returns {string} Enhanced text
   */
  enhanceText(text, sectionType) {
    if (!text) return text;
    
    const lowerType = (sectionType || '').toString().toLowerCase();
    
    // Add Thinkerbell flair based on section type
    if (lowerType.includes('hunch')) {
      return `💡 ${text}`;
    } else if (lowerType.includes('wisdom')) {
      return `📊 ${text}`;
    } else if (lowerType.includes('nudge')) {
      return `👉 ${text}`;
    } else if (lowerType.includes('spell')) {
      return `✨ ${text}`;
    }
    
    return text;
  }

  /**
   * Format output in specified format
   * @param {Object} data - Data to format
   * @param {Object} template - Template configuration
   * @param {string} format - Output format
   * @returns {string} Formatted output
   */
  formatOutput(data, template, format) {
    switch (format) {
      case 'slides':
        return this.formatAsSlides(data, template);
      case 'document':
        return this.formatAsDocument(data, template);
      case 'table':
        return this.formatAsTable(data, template);
      case 'bullets':
        return this.formatAsBullets(data, template);
      default:
        return this.formatAsSlides(data, template);
    }
  }

  /**
   * Format as presentation slides
   */
  formatAsSlides(data, template) {
    let output = '';
    
    if (data.title) {
      output += `# ${data.title}\n\n`;
    }
    
    if (data.sections) {
      data.sections.forEach(section => {
        output += `## ${section.name || section.title}\n`;
        output += `${section.content}\n\n`;
      });
    }
    
    return output;
  }

  /**
   * Format as structured document
   */
  formatAsDocument(data, template) {
    let output = '';
    
    if (data.title) {
      output += `# ${data.title}\n\n`;
    }
    
    if (data.sections) {
      data.sections.forEach((section, index) => {
        output += `**${section.name || section.title}**\n\n`;
        output += `${section.content}\n\n`;
        if (index < data.sections.length - 1) {
          output += '---\n\n';
        }
      });
    }
    
    return output;
  }

  /**
   * Format as data table
   */
  formatAsTable(data, template) {
    if (!data.sections) return 'No data to format as table';
    
    let output = '| Section | Content |\n';
    output += '|---------|----------|\n';
    
    data.sections.forEach(section => {
      const cleanContent = (section.content || '').replace(/\n/g, ' ').replace(/\|/g, '\\|');
      output += `| ${section.name || section.title} | ${cleanContent} |\n`;
    });
    
    return output;
  }

  /**
   * Format as bullet points
   */
  formatAsBullets(data, template) {
    let output = '';
    
    if (data.title) {
      output += `# ${data.title}\n\n`;
    }
    
    if (data.sections) {
      data.sections.forEach(section => {
        output += `- **${section.name || section.title}**: ${section.content}\n`;
      });
    }
    
    return output;
  }
}

module.exports = ThinkerbellFormatter; 