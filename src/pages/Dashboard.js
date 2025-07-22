import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  FileText,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  Bell,
  Coffee,
  Star
} from 'lucide-react';
import { useSemanticContext } from '../context/SemanticContext';

// Authentic Thinkerbell Brand Constants
const THINKERBELL_BRAND = {
  colors: {
    hotPink: '#FF1A8C',
    acidGreen: '#00FF7F', 
    neonPink: '#FF0080',
    brightGreen: '#39FF14',
    officeGrey: '#F5F5F5',
    charcoal: '#2D2D2D'
  },
  philosophy: "Measured Magic",
  tagline: "give us a bell",
  newsletter: "WEIRDO",
  people: ["Thinkers", "Tinkers"],
  actions: ["Stay Sexy", "Stay Kind", "Stay Curious", "Stay With It", "Stay Unicorn"]
};

// Thinkerbell-style quirky messages
const QUIRKY_MESSAGES = [
  "yes, our semantic algorithm's mum is very proud",
  "currently ranked #1 by our odd bunch of clever people",
  "like any good magic show, we don't reveal all our tricks",
  "making the impossible slightly possible since 2024"
];

const Dashboard = () => {
  const { 
    isConnected, 
    hasBackend, 
    performanceMetrics, 
    processingHistory,
    analytics 
  } = useSemanticContext();

  const quickStats = [
    {
      title: 'Total Magic Created',
      value: performanceMetrics.totalProcessed,
      icon: Sparkles,
      color: THINKERBELL_BRAND.colors.hotPink,
      change: '+12%',
      subtitle: 'strategic frameworks'
    },
    {
      title: 'Avg Thinking Time', 
      value: `${performanceMetrics.averageProcessingTime.toFixed(1)}ms`,
      icon: Clock,
      color: THINKERBELL_BRAND.colors.acidGreen,
      change: '-5ms',
      subtitle: 'faster than coffee'
    },
    {
      title: 'Dominant Wisdom',
      value: getDominantCategory(performanceMetrics.categoryCounts),
      icon: Target,
      color: THINKERBELL_BRAND.colors.neonPink,
      change: 'trending',
      subtitle: 'crowd favourite'
    },
    {
      title: 'Thinker Confidence',
      value: '87.3%',
      icon: Brain,
      color: THINKERBELL_BRAND.colors.brightGreen,
      change: '+2.1%',
      subtitle: 'our mums approve'
    }
  ];

  const recentActivity = processingHistory.slice(0, 5);

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Thinkerbell-style background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div 
          className="absolute top-20 right-10 w-32 h-32 rounded-full"
          style={{ backgroundColor: THINKERBELL_BRAND.colors.hotPink }}
        />
        <div 
          className="absolute bottom-20 left-10 w-48 h-48 rounded-full"
          style={{ backgroundColor: THINKERBELL_BRAND.colors.acidGreen }}
        />
      </div>

      {/* Authentic Thinkerbell Header */}
      <div className="text-center space-y-6 relative z-10">
        <div className="flex justify-center items-center space-x-4">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl"
                 style={{ backgroundColor: THINKERBELL_BRAND.colors.hotPink }}>
              <Brain className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 animate-pulse" 
                     style={{ color: THINKERBELL_BRAND.colors.acidGreen }} />
          </div>
          <Bell className="w-8 h-8 animate-bounce" style={{ color: THINKERBELL_BRAND.colors.acidGreen }} />
        </div>
        
        <div>
          <h1 className="text-5xl font-bold mb-4">
            <span style={{ color: THINKERBELL_BRAND.colors.hotPink }}>Thinker</span>
            <span style={{ color: THINKERBELL_BRAND.colors.acidGreen }}>bell</span>
            <span className="text-gray-900"> Intelligence Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            <span className="font-bold" style={{ color: THINKERBELL_BRAND.colors.charcoal }}>
              {THINKERBELL_BRAND.philosophy}
            </span> - The coming together of scientific enquiry and hardcore creativity
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We represent the <strong>odd bunch of clever people</strong> who automatically sort your strategic thinking into 
            <strong> Hunches</strong>, <strong>Wisdom</strong>, <strong>Nudges</strong>, and <strong>Spells</strong> 
            — because that's how <strong>{THINKERBELL_BRAND.people[0]}</strong> and <strong>{THINKERBELL_BRAND.people[1]}</strong> actually think.
          </p>
        </div>
        
        {/* Thinkerbell Status Banner with self-deprecating confidence */}
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full text-sm font-medium border-2 transition-all duration-200 hover:scale-105 ${
          isConnected 
            ? 'text-white shadow-lg' 
            : 'bg-red-100 text-red-800 border-red-300'
        }`}
        style={isConnected ? { 
          background: `linear-gradient(135deg, ${THINKERBELL_BRAND.colors.hotPink}, ${THINKERBELL_BRAND.colors.neonPink})`,
          borderColor: THINKERBELL_BRAND.colors.hotPink
        } : {}}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-white animate-pulse' : 'bg-red-500'}`}></div>
          <span>
            {isConnected ? '🎭 Semantic Brain Online' : '⚠️ Semantic Brain Offline'}
            {hasBackend && ' • AI Tinkers Active'}
          </span>
          <Bell className="w-4 h-4" />
        </div>

        {/* Quirky Thinkerbell subtitle */}
        <div className="text-sm text-gray-500 italic">
          {QUIRKY_MESSAGES[Math.floor(Math.random() * QUIRKY_MESSAGES.length)]}
        </div>
      </div>

      {/* Thinkerbell-styled Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} 
                 className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-gray-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium" style={{ color: stat.color }}>{stat.change}</span>
                    <span className="text-xs text-gray-500">• {stat.subtitle}</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110`}
                     style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid with Thinkerbell personality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Quick Actions - Thinkerbell Style */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" style={{ color: THINKERBELL_BRAND.colors.hotPink }} />
              Quick Magic Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/playground"
                className="block w-full text-white rounded-lg px-4 py-3 text-center font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${THINKERBELL_BRAND.colors.hotPink}, ${THINKERBELL_BRAND.colors.neonPink})`
                }}
              >
                🧠 Try Semantic Classification
              </Link>
              <Link
                to="/analytics"
                className="block w-full text-gray-700 rounded-lg px-4 py-3 text-center font-medium transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: THINKERBELL_BRAND.colors.officeGrey }}
              >
                📊 View the Wisdom
              </Link>
              <Link
                to="/templates"
                className="block w-full text-gray-700 rounded-lg px-4 py-3 text-center font-medium transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: THINKERBELL_BRAND.colors.officeGrey }}
              >
                📋 Browse Magic Templates
              </Link>
            </div>
          </div>

          {/* Thinkerbell Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" style={{ color: THINKERBELL_BRAND.colors.acidGreen }} />
              The Thinkerbell Actions
            </h3>
            <div className="space-y-2">
              {THINKERBELL_BRAND.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full" 
                       style={{ backgroundColor: THINKERBELL_BRAND.colors.hotPink }}></div>
                  <span className="text-sm font-medium text-gray-700">{action}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${THINKERBELL_BRAND.colors.acidGreen}15` }}>
              <p className="text-xs text-gray-600 italic">
                Live by these principles, because that's how our <strong>Thinkers</strong> and <strong>Tinkers</strong> roll.
              </p>
            </div>
          </div>

          {/* Category Distribution with Thinkerbell flair */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Semantic Brilliance</h3>
            <div className="space-y-3">
              {Object.entries(performanceMetrics.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2 text-lg">{getCategoryIcon(category)}</span>
                    {category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          backgroundColor: getCategoryColor(category),
                          width: `${(count / Math.max(...Object.values(performanceMetrics.categoryCounts), 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity with Thinkerbell personality */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" style={{ color: THINKERBELL_BRAND.colors.hotPink }} />
                Recent Semantic Wizardry
              </h3>
              <Link 
                to="/analytics" 
                className="text-sm font-medium transition-colors hover:scale-105"
                style={{ color: THINKERBELL_BRAND.colors.hotPink }}
              >
                View All Magic →
              </Link>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102"
                       style={{ backgroundColor: THINKERBELL_BRAND.colors.officeGrey }}>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{item.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {item.template}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          {item.processingTime}ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {item.analytics?.dominant_category && (
                        <span className="text-xs px-3 py-1 rounded-full text-white font-medium"
                              style={{ backgroundColor: getCategoryColor(item.analytics.dominant_category) }}>
                          {getCategoryIcon(item.analytics.dominant_category)} {item.analytics.dominant_category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4" style={{ color: THINKERBELL_BRAND.colors.acidGreen }} />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Magic Yet!</h4>
                <p className="text-gray-500 mb-4">
                  Our semantic brain is ready to work its magic on your strategic thinking.
                </p>
                <Link
                  to="/playground"
                  className="inline-flex items-center space-x-2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${THINKERBELL_BRAND.colors.hotPink}, ${THINKERBELL_BRAND.colors.neonPink})`
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start the Magic →</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Thinkerbell personality */}
      <div className="text-center py-8 border-t border-gray-200 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-3">
          <Coffee className="w-4 h-4" style={{ color: THINKERBELL_BRAND.colors.hotPink }} />
          <span>Built with measured magic by our odd bunch of clever people</span>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            Subscribe to <strong>{THINKERBELL_BRAND.newsletter}</strong> for more weird brilliance • 
            <span className="mx-2" style={{ color: THINKERBELL_BRAND.colors.hotPink }}>{THINKERBELL_BRAND.tagline}</span> • 
            Part measurement, part magic
          </p>
          <p className="italic">
            Currently ranked Australia's #1 semantic engine by our algorithm's mums 
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper functions with Thinkerbell personality
const getDominantCategory = (counts) => {
  const entries = Object.entries(counts);
  if (entries.length === 0) return 'None Yet';
  
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
  return icons[category] || '🎭';
};

const getCategoryColor = (category) => {
  const colors = {
    'Hunch': THINKERBELL_BRAND.colors.brightGreen,
    'Wisdom': THINKERBELL_BRAND.colors.hotPink,
    'Nudge': THINKERBELL_BRAND.colors.acidGreen,
    'Spell': THINKERBELL_BRAND.colors.neonPink
  };
  return colors[category] || THINKERBELL_BRAND.colors.charcoal;
};

export default Dashboard; 