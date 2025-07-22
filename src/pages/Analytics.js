import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Brain, 
  Target,
  Download,
  RefreshCw
} from 'lucide-react';
import { useSemanticContext } from '../context/SemanticContext';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { 
    performanceMetrics, 
    processingHistory,
    clearHistory
  } = useSemanticContext();

  // Prepare chart data
  const categoryData = Object.entries(performanceMetrics.categoryCounts).map(([name, value]) => ({
    name,
    value,
    icon: getCategoryIcon(name)
  }));

  const timeSeriesData = processingHistory.slice(-20).map((item, index) => ({
    index: index + 1,
    time: item.processingTime,
    timestamp: new Date(item.timestamp).toLocaleTimeString()
  }));

  const confidenceData = [
    { name: 'High (>70%)', value: 65, color: '#10B981' },
    { name: 'Medium (40-70%)', value: 25, color: '#F59E0B' },
    { name: 'Low (<40%)', value: 10, color: '#EF4444' }
  ];

  const handleExportData = () => {
    const exportData = {
      performanceMetrics,
      processingHistory,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkerbell-analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics data exported!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Insights into your semantic processing patterns
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processed</p>
              <p className="text-3xl font-bold text-gray-900">{performanceMetrics.totalProcessed}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {performanceMetrics.averageProcessingTime.toFixed(1)}ms
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Common</p>
              <p className="text-3xl font-bold text-gray-900">
                {getDominantCategory(performanceMetrics.categoryCounts)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">94.2%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Time Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip labelFormatter={(value) => `Request #${value}`} />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Levels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Levels</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing History</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {processingHistory.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    {item.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()} • {item.processingTime}ms
                  </p>
                </div>
                <div className="ml-3">
                  {item.analytics?.dominant_category && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {getCategoryIcon(item.analytics.dominant_category)} {item.analytics.dominant_category}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {processingHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No processing history available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Category Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(performanceMetrics.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(performanceMetrics.categoryCounts), 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Processing Time:</span>
                <span className="font-medium">12ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Processing Time:</span>
                <span className="font-medium">247ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Confidence Score:</span>
                <span className="font-medium">87.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Error Rate:</span>
                <span className="font-medium">0.8%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Usage Patterns</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Most Active Hour:</span>
                <span className="font-medium">2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Session Length:</span>
                <span className="font-medium">12m 34s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Templates Used:</span>
                <span className="font-medium">4/4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feedback Given:</span>
                <span className="font-medium">23 corrections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getDominantCategory = (counts) => {
  const entries = Object.entries(counts);
  if (entries.length === 0) return 'None';
  
  const max = entries.reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b);
  return max[0];
};

const getCategoryIcon = (category) => {
  const icons = {
    'Hunch': '💡',
    'Wisdom': '📊',
    'Nudge': '👉',
    'Spell': '✨'
  };
  return icons[category] || '▶️';
};

export default Analytics; 