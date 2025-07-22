import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { useSemanticContext } from '../context/SemanticContext';
import toast from 'react-hot-toast';

const Templates = () => {
  const { availableTemplates, currentTemplate, updateTemplate } = useSemanticContext();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock template data (in real app, this would come from the API)
  const templates = [
    {
      id: 'slide_deck',
      name: 'Slide Deck',
      description: 'Perfect for presentations and pitch decks',
      category: 'Presentation',
      structure: ['Hunch', 'Wisdom', 'Nudge', 'Spell'],
      format: 'slides',
      lastModified: '2024-01-15',
      author: 'Thinkerbell Team',
      usage: 156,
      preview: `# {{title}}

## 💡 Hunch
{{hunch_content}}

## 📊 Wisdom  
{{wisdom_content}}

## 👉 Nudge
{{nudge_content}}

## ✨ Spell
{{spell_content}}`
    },
    {
      id: 'strategy_doc',
      name: 'Strategy Document',
      description: 'Comprehensive strategic planning format',
      category: 'Strategy',
      structure: ['Challenge', 'Insight', 'Strategy', 'Tactics'],
      format: 'document',
      lastModified: '2024-01-12',
      author: 'Strategy Team',
      usage: 89,
      preview: `# {{title}}

**Challenge**
{{challenge_content}}

---

**Insight**
{{insight_content}}

---

**Strategy**
{{strategy_content}}

---

**Tactics**
{{tactics_content}}`
    },
    {
      id: 'creative_brief',
      name: 'Creative Brief',
      description: 'For campaign concepts and creative direction',
      category: 'Creative',
      structure: ['Problem', 'Audience', 'Message', 'Magic'],
      format: 'bullets',
      lastModified: '2024-01-10',
      author: 'Creative Team',
      usage: 203,
      preview: `# {{title}}

- **Problem**: {{problem_content}}
- **Audience**: {{audience_content}}  
- **Message**: {{message_content}}
- **Magic**: {{magic_content}}`
    },
    {
      id: 'measurement_report',
      name: 'Measurement Framework',
      description: 'Data-driven analysis and metrics reporting',
      category: 'Analytics',
      structure: ['Hypothesis', 'Metrics', 'Targets', 'Timeline'],
      format: 'table',
      lastModified: '2024-01-08',
      author: 'Analytics Team',
      usage: 67,
      preview: `# {{title}}

| Section | Content |
|---------|---------|
| Hypothesis | {{hypothesis_content}} |
| Metrics | {{metrics_content}} |
| Targets | {{targets_content}} |
| Timeline | {{timeline_content}} |`
    }
  ];

  const handleSelectTemplate = (template) => {
    updateTemplate(template.id);
    toast.success(`Template changed to ${template.name}`);
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.preview);
    toast.success('Template copied to clipboard!');
  };

  const handleDownloadTemplate = (template) => {
    const blob = new Blob([template.preview], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}-template.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Presentation': 'bg-blue-100 text-blue-800',
      'Strategy': 'bg-green-100 text-green-800',
      'Creative': 'bg-purple-100 text-purple-800',
      'Analytics': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getFormatIcon = (format) => {
    const icons = {
      'slides': '📊',
      'document': '📄',
      'bullets': '📝',
      'table': '📋'
    };
    return icons[format] || '📄';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Template Library</h1>
          <p className="text-gray-600 mt-2">
            Manage and customize your content templates
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Current Template */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Current Template</h3>
            <p className="text-indigo-100 mt-1">
              {templates.find(t => t.id === currentTemplate)?.name || 'No template selected'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-sm">Last Modified</p>
            <p className="text-lg font-medium">
              {templates.find(t => t.id === currentTemplate)?.lastModified || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
              currentTemplate === template.id 
                ? 'border-indigo-500 ring-2 ring-indigo-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getFormatIcon(template.format)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                </div>
                {currentTemplate === template.id && (
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>

              {/* Structure */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">STRUCTURE</p>
                <div className="flex flex-wrap gap-1">
                  {template.structure.map((section, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Used {template.usage} times</span>
                <span>By {template.author}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSelectTemplate(template)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTemplate === template.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {currentTemplate === template.id ? 'Selected' : 'Use Template'}
                </button>
                <button
                  onClick={() => handlePreviewTemplate(template)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyTemplate(template)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadTemplate(template)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Presentation', 'Strategy', 'Creative', 'Analytics'].map((category) => {
            const count = templates.filter(t => t.category === category).length;
            return (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {category === 'Presentation' && '📊'}
                  {category === 'Strategy' && '🎯'}
                  {category === 'Creative' && '🎨'}
                  {category === 'Analytics' && '📈'}
                </div>
                <h4 className="font-medium text-gray-900">{category}</h4>
                <p className="text-sm text-gray-600">{count} templates</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preview: {selectedTemplate.name}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {selectedTemplate.preview}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => handleSelectTemplate(selectedTemplate)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Use This Template
              </button>
              <button
                onClick={() => handleCopyTemplate(selectedTemplate)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={() => handleDownloadTemplate(selectedTemplate)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates; 