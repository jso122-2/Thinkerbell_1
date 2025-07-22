import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Zap,
  Brain,
  Shield,
  Palette,
  Bell,
  Database,
  Globe
} from 'lucide-react';
import { useSemanticContext } from '../context/SemanticContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, saveSettings, checkAPIConnection } = useSemanticContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveSettings(localSettings);
    setHasUnsavedChanges(false);
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasUnsavedChanges(false);
    toast.success('Settings reset to last saved state');
  };

  const handleResetDefaults = () => {
    const defaults = {
      enableSemanticRouting: true,
      enableConfidenceIndicators: true,
      enableContentSuggestions: true,
      enableValidation: true,
      confidenceThreshold: 0.3,
      realTimePreview: true
    };
    setLocalSettings(defaults);
    setHasUnsavedChanges(true);
    toast.success('Settings reset to defaults');
  };

  const handleTestConnection = async () => {
    try {
      await checkAPIConnection();
      toast.success('Connection test successful!');
    } catch (error) {
      toast.error('Connection test failed: ' + error.message);
    }
  };

  const settingSections = [
    {
      title: 'Semantic Processing',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
      settings: [
        {
          key: 'enableSemanticRouting',
          label: 'Enable Semantic Routing',
          description: 'Automatically classify content into Hunch, Wisdom, Nudge, and Spell categories',
          type: 'toggle'
        },
        {
          key: 'enableConfidenceIndicators',
          label: 'Show Confidence Indicators',
          description: 'Display confidence scores for AI classifications',
          type: 'toggle'
        },
        {
          key: 'confidenceThreshold',
          label: 'Confidence Threshold',
          description: 'Minimum confidence level for classifications (0.0 - 1.0)',
          type: 'slider',
          min: 0,
          max: 1,
          step: 0.1
        }
      ]
    },
    {
      title: 'Content Assistance',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      settings: [
        {
          key: 'enableContentSuggestions',
          label: 'Smart Content Suggestions',
          description: 'Get AI-powered suggestions for improving content balance',
          type: 'toggle'
        },
        {
          key: 'enableValidation',
          label: 'Content Validation',
          description: 'Validate content structure and provide improvement recommendations',
          type: 'toggle'
        },
        {
          key: 'realTimePreview',
          label: 'Real-time Preview',
          description: 'Generate live previews as you type (may impact performance)',
          type: 'toggle'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your Thinkerbell semantic pipeline preferences
          </p>
        </div>
        <div className="flex space-x-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              
              <div className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    </div>
                    <div className="ml-6">
                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => handleSettingChange(setting.key, !localSettings[setting.key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            localSettings[setting.key] 
                              ? 'bg-indigo-600' 
                              : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              localSettings[setting.key] 
                                ? 'translate-x-6' 
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                      
                      {setting.type === 'slider' && (
                        <div className="w-32">
                          <input
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            value={localSettings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="text-center text-xs text-gray-500 mt-1">
                            {localSettings[setting.key]}
                          </div>
                        </div>
                      )}
                      
                      {setting.type === 'select' && (
                        <select
                          value={localSettings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {setting.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Connection Settings</h4>
            <div className="space-y-3">
              <button
                onClick={handleTestConnection}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Test API Connection</span>
              </button>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">API URL:</span> http://localhost:3000</p>
                <p><span className="font-medium">Backend:</span> Python (optional)</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
            <div className="space-y-3">
              <button
                onClick={handleResetDefaults}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Storage:</span> Local Browser</p>
                <p><span className="font-medium">History:</span> 50 items max</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Experimental Features</h4>
              <p className="text-sm text-red-700 mt-1">
                Advanced configuration options are currently in development. 
                Contact your system administrator for custom configurations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Configuration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900">Processing</h4>
            <ul className="text-gray-600 space-y-1 mt-2">
              <li>• Semantic Routing: {localSettings.enableSemanticRouting ? 'Enabled' : 'Disabled'}</li>
              <li>• Confidence Indicators: {localSettings.enableConfidenceIndicators ? 'Enabled' : 'Disabled'}</li>
              <li>• Threshold: {localSettings.confidenceThreshold}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Assistance</h4>
            <ul className="text-gray-600 space-y-1 mt-2">
              <li>• Smart Suggestions: {localSettings.enableContentSuggestions ? 'Enabled' : 'Disabled'}</li>
              <li>• Content Validation: {localSettings.enableValidation ? 'Enabled' : 'Disabled'}</li>
              <li>• Real-time Preview: {localSettings.realTimePreview ? 'Enabled' : 'Disabled'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Performance</h4>
            <ul className="text-gray-600 space-y-1 mt-2">
              <li>• Processing Mode: Hybrid</li>
              <li>• Cache: Browser Local</li>
              <li>• Backend: Optional</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 