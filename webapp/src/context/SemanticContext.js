import React, { createContext, useContext, useState, useEffect } from 'react';
import { semanticAPI } from '../services/api';
import toast from 'react-hot-toast';

const SemanticContext = createContext();

export const useSemanticContext = () => {
  const context = useContext(SemanticContext);
  if (!context) {
    throw new Error('useSemanticContext must be used within a SemanticProvider');
  }
  return context;
};

export const SemanticProvider = ({ children }) => {
  const [state, setState] = useState({
    // API Status
    apiConnected: false,
    pythonBackendConnected: false,
    loading: false,
    
    // Current Content
    currentContent: '',
    currentTemplate: 'slide_deck',
    
    // Processing Results
    lastResult: null,
    routing: {},
    analytics: null,
    suggestions: {},
    
    // Real-time Preview
    preview: '',
    previewLoading: false,
    
    // Templates
    availableTemplates: [],
    
    // Settings
    settings: {
      enableSemanticRouting: true,
      enableConfidenceIndicators: true,
      enableContentSuggestions: true,
      enableValidation: true,
      confidenceThreshold: 0.3,
      realTimePreview: true
    },
    
    // Analytics Data
    processingHistory: [],
    performanceMetrics: {
      averageProcessingTime: 0,
      totalProcessed: 0,
      categoryCounts: {
        Hunch: 0,
        Wisdom: 0,
        Nudge: 0,
        Spell: 0
      }
    }
  });

  // Check API connection on mount
  useEffect(() => {
    checkAPIConnection();
    loadTemplates();
    loadSettings();
  }, []);

  const checkAPIConnection = async () => {
    try {
      const health = await semanticAPI.health();
      setState(prev => ({
        ...prev,
        apiConnected: true,
        pythonBackendConnected: health.backend_connected
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        apiConnected: false,
        pythonBackendConnected: false
      }));
      toast.error('API connection failed. Make sure the server is running.');
    }
  };

  const loadTemplates = async () => {
    try {
      const templates = await semanticAPI.getTemplates();
      setState(prev => ({
        ...prev,
        availableTemplates: templates.templates || []
      }));
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('thinkerbell-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          settings: { ...prev.settings, ...settings }
        }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  };

  const saveSettings = (newSettings) => {
    const updated = { ...state.settings, ...newSettings };
    setState(prev => ({
      ...prev,
      settings: updated
    }));
    localStorage.setItem('thinkerbell-settings', JSON.stringify(updated));
  };

  const processContent = async (content, templateName = null) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await semanticAPI.process({
        content,
        template_name: templateName || state.currentTemplate,
        options: {
          enableSemanticRouting: state.settings.enableSemanticRouting,
          enableConfidenceIndicators: state.settings.enableConfidenceIndicators,
          enableContentSuggestions: state.settings.enableContentSuggestions,
          enableValidation: state.settings.enableValidation,
          includeAnalytics: true
        }
      });

      // Update processing history
      const historyEntry = {
        id: Date.now(),
        content: content.substring(0, 100) + '...',
        template: templateName || state.currentTemplate,
        timestamp: new Date().toISOString(),
        processingTime: result.metadata?.processing_time || 0,
        analytics: result.result.analytics
      };

      setState(prev => ({
        ...prev,
        loading: false,
        lastResult: result.result,
        routing: result.result.semanticRouting || {},
        analytics: result.result.analytics,
        suggestions: result.result.suggestions || {},
        processingHistory: [historyEntry, ...prev.processingHistory.slice(0, 49)], // Keep last 50
        performanceMetrics: updatePerformanceMetrics(prev.performanceMetrics, historyEntry)
      }));

      toast.success('Content processed successfully!');
      return result.result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast.error('Processing failed: ' + error.message);
      throw error;
    }
  };

  const generatePreview = async (content, templateName = null) => {
    if (!state.settings.realTimePreview || !content.trim()) {
      return;
    }

    setState(prev => ({ ...prev, previewLoading: true }));
    
    try {
      const result = await semanticAPI.preview({
        content,
        template_name: templateName || state.currentTemplate
      });

      setState(prev => ({
        ...prev,
        previewLoading: false,
        preview: result.preview?.preview || '',
        routing: result.preview?.routing || {},
        analytics: result.preview?.analytics,
        suggestions: result.preview?.suggestions || {}
      }));
    } catch (error) {
      setState(prev => ({ ...prev, previewLoading: false }));
      console.error('Preview failed:', error);
    }
  };

  const explainClassification = async (sentence) => {
    try {
      const result = await semanticAPI.explain({ sentence });
      return result.explanation;
    } catch (error) {
      toast.error('Explanation failed: ' + error.message);
      throw error;
    }
  };

  const getSmartSuggestions = async (content) => {
    try {
      const result = await semanticAPI.getSuggestions({ content });
      return result.suggestions;
    } catch (error) {
      toast.error('Failed to get suggestions: ' + error.message);
      throw error;
    }
  };

  const updatePerformanceMetrics = (current, newEntry) => {
    const newTotal = current.totalProcessed + 1;
    const newAverage = (current.averageProcessingTime * current.totalProcessed + newEntry.processingTime) / newTotal;
    
    const newCategoryCounts = { ...current.categoryCounts };
    if (newEntry.analytics?.distribution) {
      Object.entries(newEntry.analytics.distribution).forEach(([category, data]) => {
        newCategoryCounts[category] = (newCategoryCounts[category] || 0) + data.count;
      });
    }

    return {
      averageProcessingTime: newAverage,
      totalProcessed: newTotal,
      categoryCounts: newCategoryCounts
    };
  };

  const clearHistory = () => {
    setState(prev => ({
      ...prev,
      processingHistory: [],
      performanceMetrics: {
        averageProcessingTime: 0,
        totalProcessed: 0,
        categoryCounts: { Hunch: 0, Wisdom: 0, Nudge: 0, Spell: 0 }
      }
    }));
    toast.success('History cleared');
  };

  const updateContent = (content) => {
    setState(prev => ({ ...prev, currentContent: content }));
    
    // Debounced preview generation
    if (state.settings.realTimePreview) {
      clearTimeout(window.previewTimeout);
      window.previewTimeout = setTimeout(() => {
        generatePreview(content);
      }, 500);
    }
  };

  const updateTemplate = (template) => {
    setState(prev => ({ ...prev, currentTemplate: template }));
  };

  const value = {
    ...state,
    
    // Actions
    processContent,
    generatePreview,
    explainClassification,
    getSmartSuggestions,
    updateContent,
    updateTemplate,
    saveSettings,
    clearHistory,
    checkAPIConnection,
    
    // Utilities
    isConnected: state.apiConnected,
    hasBackend: state.pythonBackendConnected,
    canProcess: state.apiConnected && !state.loading
  };

  return (
    <SemanticContext.Provider value={value}>
      {children}
    </SemanticContext.Provider>
  );
}; 