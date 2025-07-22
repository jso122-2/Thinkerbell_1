# Thinkerbell Content Pipeline

A complete content formatting pipeline with template substitution capabilities, designed to transform structured data into polished, brand-consistent outputs with Thinkerbell's signature voice.

## 🎯 Core Features

- **Multi-format input parsing** (JSON, YAML, Markdown)
- **Thinkerbell brand voice application** (playful + sharp + unexpected)
- **Flexible output formats** (slides, documents, tables, bullets)
- **Template-based formatting system** with easy substitution
- **Template validation** with helpful warnings
- **Batch processing** capabilities
- **Cursor integration ready**

## 🚀 Quick Start

### Installation

```bash
npm install
npm run setup
```

### Basic Usage

```javascript
const ThinkerbellPipeline = require('./src/ThinkerbellPipeline');

// Initialize pipeline
const pipeline = new ThinkerbellPipeline({
  enableValidation: true,
  enableBrandVoice: true
});

// Process campaign data
const campaignData = {
  title: "Summer Campaign Results",
  sections: [
    { name: "Hunch", content: "Visual storytelling drives 40% more engagement" },
    { name: "Wisdom", content: "Video content outperformed static by 3:1 ratio" },
    { name: "Nudge", content: "Double down on video for Q4 holiday push" },
    { name: "Spell", content: "Interactive shoppable videos with AR try-on features" }
  ]
};

const output = await pipeline.processWithTemplate(campaignData, 'slide_deck');
console.log(output);
```

### Run Examples

```bash
# Basic usage examples
npm run demo

# Template substitution examples  
npm run demo:templates

# Run all examples
npm test
```

## 📋 Available Templates

### Default Templates (Ready for Substitution)

1. **`slide_deck`** - Presentation format with clear section breaks
   - Best for: campaign recaps, strategy presentations, client pitches

2. **`strategy_doc`** - Long-form strategic document
   - Best for: strategy briefs, planning documents, frameworks

3. **`measurement_report`** - Data-focused reporting format
   - Best for: campaign results, performance analysis, ROI reports

4. **`creative_brief`** - Creative development template
   - Best for: campaign briefs, creative direction, concept approval

## 🔄 Template Substitution

### Replace Single Template

```javascript
const realSlideTemplate = {
  header: "# {{title}} 🎯\n> *{{subtitle}}*\n\n",
  section: "## {{section_icon}} {{section_title}}\n\n{{section_content}}\n\n",
  footer: "*✨ Crafted by Thinkerbell*"
};

pipeline.substituteTemplates({
  slide_deck: realSlideTemplate
});
```

### Batch Template Substitution

```javascript
const realTemplates = {
  slide_deck: realSlideTemplate,
  strategy_doc: realStrategyTemplate,
  creative_brief: realCreativeTemplate
};

pipeline.substituteTemplates(realTemplates);
```

### Load Templates from Files

```javascript
const templatePaths = {
  slide_deck: './templates/real_slide_deck.json',
  strategy_doc: './templates/real_strategy_doc.json'
};

await pipeline.loadRealTemplates(templatePaths);
```

## 🎨 Brand Voice Application

The pipeline automatically applies Thinkerbell's brand voice patterns:

- **Playful**: delightfully, surprisingly, charmingly, wickedly
- **Sharp**: precisely, exactly, directly, clearly  
- **Unexpected**: plot twist, here's the thing, surprise, wait for it

### Section Enhancement

Content is automatically enhanced based on section type:
- **Hunch** sections get 💡 
- **Wisdom** sections get 📊
- **Nudge** sections get 👉
- **Spell** sections get ✨

## 📊 Input Formats

### JSON
```javascript
{
  "title": "Campaign Name",
  "sections": [
    { "name": "Hunch", "content": "Your insight here" }
  ]
}
```

### YAML
```yaml
title: Campaign Name
sections:
  - name: Hunch
    content: Your insight here
```

### Markdown
```markdown
# Campaign Name

## Hunch
Your insight here
```

## 🔧 Advanced Usage

### Custom Templates

```javascript
// Create custom template
const customTemplate = {
  header: "# {{title}} | Custom Format\n\n",
  section: "### {{section_title}}\n{{section_content}}\n\n"
};

pipeline.addTemplate('custom_format', customTemplate);
```

### Batch Processing

```javascript
const batchInputs = [
  { 
    data: campaignData1,
    options: { templateName: 'slide_deck' }
  },
  { 
    data: campaignData2,
    options: { templateName: 'strategy_doc' }
  }
];

const results = await pipeline.batchProcess(batchInputs);
```

### Template Preview

```javascript
// Preview template with sample data
const preview = await pipeline.previewTemplate('slide_deck');
```

### Configuration Management

```javascript
// Export configuration
const config = pipeline.exportConfig();

// Import to new pipeline
const newPipeline = new ThinkerbellPipeline();
newPipeline.importConfig(config);
```

## 📁 Project Structure

```
thinkerbell-content-pipeline/
├── src/
│   ├── core/
│   │   ├── ThinkerbellFormatter.js    # Core formatting logic
│   │   └── TemplateManager.js         # Template system
│   └── ThinkerbellPipeline.js         # Main pipeline integration
├── examples/
│   ├── basic-usage.js                 # Basic usage examples
│   └── template-substitution.js       # Template substitution demos
├── templates/                         # Template storage directory
├── package.json                       # Package configuration
└── README.md                         # This file
```

## 🔌 Cursor Integration

The pipeline is designed for easy Cursor integration:

### Module Import
```javascript
const ThinkerbellPipeline = require('./src/ThinkerbellPipeline');
```

### File System Integration
```javascript
// Load templates from file system
await pipeline.loadRealTemplates({
  slide_deck: './path/to/real_template.json'
});
```

### Template File Format
```json
{
  "header": "# {{title}}\n*{{subtitle}}*\n\n",
  "section": "## {{section_title}}\n{{section_content}}\n\n",
  "footer": "*Crafted by Thinkerbell*"
}
```

## 🛠️ Template Variables

Available template variables:
- `{{title}}` - Content title
- `{{subtitle}}` - Content subtitle  
- `{{section_title}}` - Section name/title
- `{{section_content}}` - Section content
- `{{section_icon}}` - Auto-generated section icon
- `{{date}}` - Current date
- `{{campaign_name}}` - Campaign name

## 📈 Pipeline Statistics

```javascript
const stats = pipeline.getStats();
console.log(stats);
// Output: Available templates, voice patterns, configuration
```

## 🚨 Error Handling

The pipeline includes comprehensive error handling:
- Input validation
- Template validation with warnings
- Graceful fallbacks for missing templates
- Batch processing error isolation

## 🎭 Brand Voice Patterns

### Playful Enhancements
- Adds delightful language variations
- Incorporates surprising elements
- Uses charming and witty phrasing

### Sharp Communication
- Precise, direct messaging
- Clear, exact language
- Focused content delivery

### Unexpected Twists
- "Plot twist:" introductions
- "Here's the thing:" insights
- "Wait for it:" build-ups

## 🧠 Semantic Intelligence Integration

### **Complete Semantic-First Pipeline**

I've successfully integrated your semantic classification design with the JavaScript pipeline:

#### **🔬 Semantic Features**
- ✅ **Real-time classification** with confidence scoring
- ✅ **Enhanced keyword/pattern matching** with contextual analysis
- ✅ **Python backend bridge** for advanced sentence transformers
- ✅ **Content validation** and smart suggestions
- ✅ **Real-time preview** with semantic routing visualization
- ✅ **User learning system** for continuous improvement
- ✅ **Batch processing** with semantic intelligence

#### **🎯 Quick Semantic Demo**
```bash
# Run the complete semantic demo
npm run demo:semantic

# Try interactive classification
npm run semantic:interactive

# Start the API bridge
npm run api:start

# Test Python backend connection
npm run semantic:backend
```

#### **⚡ API Integration**
The system now includes a RESTful API bridge at `http://localhost:3000`:

```bash
# Health check
GET /health

# Process content with semantics
POST /process
{
  "content": "Your strategy content...",
  "template_name": "slide_deck"
}

# Real-time preview
POST /preview
{
  "content": "Partial content...",
  "template_name": "strategy_doc"
}

# Explain classifications
POST /explain
{
  "sentence": "Research shows 73% prefer authentic brands"
}
```

#### **🎨 Frontend Demo**
Open `frontend/semantic-demo.html` in your browser to see the complete system:
- **Real-time semantic classification** as you type
- **Visual routing display** showing Hunch/Wisdom/Nudge/Spell distribution  
- **Smart content suggestions** for missing categories
- **Interactive explanation** of classification decisions

#### **🔧 Semantic Pipeline Usage**
```javascript
const SemanticThinkerbellPipeline = require('./src/SemanticThinkerbellPipeline');

// Initialize with semantic intelligence
const pipeline = new SemanticThinkerbellPipeline({
  enableSemanticRouting: true,
  enableConfidenceIndicators: true,
  enableContentSuggestions: true,
  enableValidation: true,
  pythonBackendUrl: 'http://localhost:8000' // Optional
});

// Process with semantic intelligence
const result = await pipeline.processWithSemantics(content, 'slide_deck');
console.log(result.analytics); // Semantic insights
console.log(result.suggestions); // Content improvement suggestions
console.log(result.formattedOutput); // Enhanced output
```

#### **🎭 Enhanced Output Features**
- **Confidence indicators**: 🔥 (high), 🔍 (medium), 💭 (low)
- **Semantic routing**: Automatic Hunch/Wisdom/Nudge/Spell classification
- **Content suggestions**: Smart recommendations for missing categories
- **Validation warnings**: Balance and quality alerts
- **Real-time preview**: Live classification as you type

## 🔮 Next Steps

1. **🔗 Connect Python Backend** - For advanced sentence transformer models
2. **🎭 Replace Mock Templates** - With real Thinkerbell templates
3. **🧠 Implement Learning Loop** - Fine-tune based on user corrections
4. **🔌 Frontend Integration** - Connect to React/Vue components
5. **📊 Analytics Dashboard** - Visualize semantic classification trends

## 💡 Support

For questions about template integration or customization, refer to the examples in the `examples/` directory or check the inline documentation in the source code.

---

*✨ Crafted with strategic magic by Thinkerbell* # Thinkerbell_1
# Thinkerbell_1
