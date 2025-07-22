import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  BarChart3, 
  FileText, 
  Settings, 
  Info,
  Zap,
  Activity,
  Bell,
  Sparkles
} from 'lucide-react';
import { useSemanticContext } from '../context/SemanticContext';

// Authentic Thinkerbell Brand Colors
const THINKERBELL_BRAND = {
  colors: {
    hotPink: '#FF1A8C',
    acidGreen: '#00FF7F', 
    neonPink: '#FF0080',
    brightGreen: '#39FF14',
    officeGrey: '#F5F5F5',
    charcoal: '#2D2D2D'
  },
  tagline: "give us a bell"
};

const Navbar = () => {
  const location = useLocation();
  const { isConnected, hasBackend, loading } = useSemanticContext();
  
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/playground', label: 'Playground', icon: Brain },
    { path: '/analytics', label: 'Analytics', icon: Activity },
    { path: '/templates', label: 'Templates', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative overflow-hidden">
      {/* Thinkerbell-style background accent */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: THINKERBELL_BRAND.colors.hotPink }}></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Authentic Thinkerbell Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 group-hover:scale-110"
                   style={{ backgroundColor: THINKERBELL_BRAND.colors.hotPink }}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" 
                       style={{ color: THINKERBELL_BRAND.colors.acidGreen }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span style={{ color: THINKERBELL_BRAND.colors.hotPink }}>Thinker</span>
                <span style={{ color: THINKERBELL_BRAND.colors.acidGreen }}>bell</span>
              </h1>
              <p className="text-xs" style={{ color: THINKERBELL_BRAND.colors.charcoal }}>
                Measured Magic • Semantic Intelligence
              </p>
            </div>
            <Bell className="w-6 h-6 animate-bounce" style={{ color: THINKERBELL_BRAND.colors.acidGreen }} />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105
                    ${isActive(item.path)
                      ? 'text-white font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  style={isActive(item.path) ? { 
                    background: `linear-gradient(135deg, ${THINKERBELL_BRAND.colors.hotPink}, ${THINKERBELL_BRAND.colors.neonPink})`,
                    boxShadow: `0 4px 15px rgba(255, 26, 140, 0.3)`
                  } : {}}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Thinkerbell-style Status Indicators */}
          <div className="flex items-center space-x-4">
            {/* Processing Status with Thinkerbell flair */}
            {loading && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full"
                   style={{ backgroundColor: THINKERBELL_BRAND.colors.officeGrey }}>
                <div className="w-3 h-3 rounded-full animate-spin border-2"
                     style={{ 
                       borderColor: THINKERBELL_BRAND.colors.hotPink,
                       borderTopColor: 'transparent'
                     }}></div>
                <span className="text-sm font-medium" style={{ color: THINKERBELL_BRAND.colors.charcoal }}>
                  Making magic...
                </span>
              </div>
            )}

            {/* API Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                isConnected 
                  ? 'animate-pulse' 
                  : ''
              }`} 
              style={{ 
                backgroundColor: isConnected 
                  ? THINKERBELL_BRAND.colors.acidGreen 
                  : '#EF4444'
              }}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Semantic Brain Online' : 'Offline'}
              </span>
            </div>

            {/* Backend Status with Thinkerbell personality */}
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 transition-all duration-200 ${
                hasBackend ? 'animate-pulse' : ''
              }`} 
              style={{ 
                color: hasBackend 
                  ? THINKERBELL_BRAND.colors.brightGreen 
                  : '#9CA3AF'
              }} />
              <span className="text-sm text-gray-600">
                {hasBackend ? 'AI Tinkers Active' : 'Local Thinkers Only'}
              </span>
            </div>

            {/* Thinkerbell tagline */}
            <div className="hidden lg:block text-xs font-medium px-3 py-1 rounded-full border"
                 style={{ 
                   color: THINKERBELL_BRAND.colors.hotPink,
                   borderColor: THINKERBELL_BRAND.colors.hotPink
                 }}>
              {THINKERBELL_BRAND.tagline}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ 
                      backgroundColor: THINKERBELL_BRAND.colors.officeGrey
                    }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation with Thinkerbell styling */}
      <div className="md:hidden border-t border-gray-200" style={{ backgroundColor: THINKERBELL_BRAND.colors.officeGrey }}>
        <div className="px-4 py-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive(item.path)
                    ? 'text-white font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                style={isActive(item.path) ? { 
                  background: `linear-gradient(135deg, ${THINKERBELL_BRAND.colors.hotPink}, ${THINKERBELL_BRAND.colors.neonPink})`
                } : {}}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {/* Mobile tagline */}
          <div className="text-center py-2">
            <span className="text-xs font-medium" style={{ color: THINKERBELL_BRAND.colors.hotPink }}>
              {THINKERBELL_BRAND.tagline} • Measured Magic
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 