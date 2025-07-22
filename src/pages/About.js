import React from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  Users,
  Code,
  Heart,
  ExternalLink,
  Github,
  Book,
  Mail
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Classification',
      description: 'Advanced semantic analysis using sentence transformers and natural language processing to categorize content into strategic frameworks.'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant content analysis and formatting with live previews, smart suggestions, and confidence scoring for immediate feedback.'
    },
    {
      icon: Target,
      title: 'Strategic Frameworks',
      description: 'Purpose-built templates for Hunch, Wisdom, Nudge, and Spell categorization to enhance strategic thinking and communication.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Designed for strategic teams, consultants, and content creators who need consistent, high-quality framework-based outputs.'
    }
  ];

  const techStack = [
    { name: 'React 18', description: 'Modern frontend framework with hooks and context' },
    { name: 'Node.js', description: 'JavaScript runtime for the semantic processing pipeline' },
    { name: 'Express.js', description: 'Web framework for RESTful API endpoints' },
    { name: 'Python (Optional)', description: 'Advanced AI backend with sentence transformers' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework for modern design' },
    { name: 'Framer Motion', description: 'Animation library for smooth user interactions' }
  ];

  const team = [
    {
      role: 'AI & Strategy',
      name: 'Thinkerbell Intelligence Team',
      description: 'Developing semantic classification algorithms and strategic frameworks'
    },
    {
      role: 'Product Engineering',
      name: 'Full-Stack Development',
      description: 'Building scalable web applications and API infrastructure'
    },
    {
      role: 'User Experience',
      name: 'Design & Interaction',
      description: 'Creating intuitive interfaces for complex AI-powered workflows'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Thinkerbell Semantic Intelligence</h1>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Transform unstructured content into strategic frameworks using AI-powered semantic classification. 
            Built for modern teams who think in terms of insights, strategies, and actionable recommendations.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            v1.0.0
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Production Ready
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 mt-2">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Input Content</h3>
            <p className="text-sm text-gray-600">Paste or type your unstructured content, ideas, or strategic thoughts</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Semantic classification engine analyzes and categorizes each sentence</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Routing</h3>
            <p className="text-sm text-gray-600">Content is routed to appropriate framework sections with confidence scores</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Formatted Output</h3>
            <p className="text-sm text-gray-600">Receive polished, structured content ready for presentations or documents</p>
          </div>
        </div>
      </div>

      {/* Strategic Framework */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-8">The Thinkerbell Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-xl font-semibold mb-2">Hunch</h3>
            <p className="text-indigo-100">Initial insights, hypotheses, and gut feelings that spark strategic thinking</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Wisdom</h3>
            <p className="text-indigo-100">Data-driven insights, research findings, and evidence-based conclusions</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">👉</div>
            <h3 className="text-xl font-semibold mb-2">Nudge</h3>
            <p className="text-indigo-100">Actionable recommendations and specific next steps to drive results</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-semibold mb-2">Spell</h3>
            <p className="text-indigo-100">Creative solutions, innovative approaches, and transformative ideas</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Technology Stack</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Code className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">{tech.name}</h4>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Development Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{member.role}</h3>
              <p className="text-indigo-600 font-medium mb-2">{member.name}</p>
              <p className="text-sm text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600 mb-3">Comprehensive guides and API reference</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center space-x-1">
              <span>View Docs</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Github className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Source Code</h3>
            <p className="text-sm text-gray-600 mb-3">Open source repository and contributions</p>
            <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center justify-center space-x-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-sm text-gray-600 mb-3">Technical support and feature requests</p>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center justify-center space-x-1">
              <span>Contact Us</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Built with passion for strategic thinking</span>
        </div>
        <p className="text-sm text-gray-500">
          © 2024 Thinkerbell Semantic Intelligence. Empowering teams with AI-driven strategic frameworks.
        </p>
      </div>
    </div>
  );
};

export default About; 