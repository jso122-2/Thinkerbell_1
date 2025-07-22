/**
 * Semantic Bridge API
 * Connects JavaScript frontend to Python semantic backend
 * Provides RESTful endpoints for semantic processing
 */

const express = require('express');
const cors = require('cors');
const SemanticThinkerbellPipeline = require('../src/SemanticThinkerbellPipeline');

class SemanticBridgeAPI {
  constructor(options = {}) {
    this.app = express();
    this.port = options.port || 3000;
    this.pythonBackendUrl = options.pythonBackendUrl || 'http://localhost:8000';
    
    // Initialize semantic pipeline
    this.pipeline = new SemanticThinkerbellPipeline({
      pythonBackendUrl: this.pythonBackendUrl,
      enableSemanticRouting: true,
      enableConfidenceIndicators: true,
      enableContentSuggestions: true,
      enableValidation: true,
      enableRealTimePreview: true
    });

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Enable CORS for all routes
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
      credentials: true
    }));

    // Parse JSON bodies
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'Semantic Bridge API',
        timestamp: new Date().toISOString(),
        backend_connected: !!this.pipeline.config.pythonBackendUrl
      });
    });

    // Main semantic processing endpoint
    this.app.post('/process', async (req, res) => {
      try {
        const {
          content,
          template_name = 'slide_deck',
          options = {}
        } = req.body;

        if (!content || typeof content !== 'string') {
          return res.status(400).json({
            error: 'Content is required and must be a string'
          });
        }

        const result = await this.pipeline.processWithSemantics(content, template_name, {
          includeAnalytics: true,
          includeDebugInfo: false,
          ...options
        });

        res.json({
          success: true,
          result: result,
          metadata: {
            processing_time: result.performance?.processing_time_ms,
            method: result.processing_method,
            timestamp: new Date().toISOString()
          }
        });

      } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Real-time preview endpoint
    this.app.post('/preview', async (req, res) => {
      try {
        const {
          content,
          template_name = 'slide_deck',
          debounce_ms = 300
        } = req.body;

        if (!content) {
          return res.json({
            preview: 'Enter content to see preview...',
            routing: {},
            suggestions: {}
          });
        }

        const preview = await this.pipeline.generateRealTimePreview(
          content, 
          template_name, 
          debounce_ms
        );

        res.json({
          success: true,
          preview: preview,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Preview error:', error);
        res.status(500).json({
          success: false,
          error: error.message,
          preview: 'Preview generation failed',
          routing: {}
        });
      }
    });

    // Classification explanation endpoint
    this.app.post('/explain', async (req, res) => {
      try {
        const { sentence } = req.body;

        if (!sentence || typeof sentence !== 'string') {
          return res.status(400).json({
            error: 'Sentence is required and must be a string'
          });
        }

        const explanation = await this.pipeline.explainClassification(sentence);

        res.json({
          success: true,
          explanation: explanation,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Explanation error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Content suggestions endpoint
    this.app.post('/suggestions', async (req, res) => {
      try {
        const {
          content,
          template_name = 'slide_deck'
        } = req.body;

        const suggestions = await this.pipeline.getSmartSuggestions(content, template_name);

        res.json({
          success: true,
          suggestions: suggestions,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({
          success: false,
          error: error.message,
          suggestions: {}
        });
      }
    });

    // Batch processing endpoint
    this.app.post('/batch', async (req, res) => {
      try {
        const { inputs } = req.body;

        if (!Array.isArray(inputs)) {
          return res.status(400).json({
            error: 'Inputs must be an array'
          });
        }

        const results = await this.pipeline.batchProcessWithSemantics(inputs);

        res.json({
          success: true,
          results: results,
          summary: {
            total: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
          },
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Batch processing error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // User learning endpoint
    this.app.post('/learn', async (req, res) => {
      try {
        const {
          sentence,
          correct_category,
          reason = ''
        } = req.body;

        if (!sentence || !correct_category) {
          return res.status(400).json({
            error: 'Sentence and correct_category are required'
          });
        }

        const learning = this.pipeline.addUserCorrection(sentence, correct_category, reason);

        res.json({
          success: true,
          learning: learning,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Learning error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Pipeline statistics endpoint
    this.app.get('/stats', (req, res) => {
      try {
        const stats = this.pipeline.getSemanticStats();
        const config = this.pipeline.exportSemanticConfig();

        res.json({
          success: true,
          stats: stats,
          config: config,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Backend connection test endpoint
    this.app.post('/connect-backend', async (req, res) => {
      try {
        const { backend_url } = req.body;

        if (!backend_url) {
          return res.status(400).json({
            error: 'Backend URL is required'
          });
        }

        const connected = await this.pipeline.connectToPythonBackend(backend_url);

        res.json({
          success: true,
          connected: connected,
          backend_url: backend_url,
          message: connected ? 'Backend connected successfully' : 'Backend connection failed',
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Backend connection error:', error);
        res.status(500).json({
          success: false,
          error: error.message,
          connected: false
        });
      }
    });

    // Available templates endpoint
    this.app.get('/templates', (req, res) => {
      try {
        const templates = this.pipeline.templateManager.getAvailableTemplates();
        const templatesWithInfo = templates.map(name => ({
          name: name,
          info: this.pipeline.templateManager.getTemplateInfo(name)
        }));

        res.json({
          success: true,
          templates: templatesWithInfo,
          count: templates.length,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Templates error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // WebSocket endpoint for real-time processing (future enhancement)
    this.app.get('/ws-info', (req, res) => {
      res.json({
        message: 'WebSocket support coming soon for real-time collaboration',
        available: false
      });
    });

    // Error handling middleware
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        available_endpoints: [
          'POST /process',
          'POST /preview',
          'POST /explain',
          'POST /suggestions',
          'POST /batch',
          'POST /learn',
          'GET /stats',
          'POST /connect-backend',
          'GET /templates',
          'GET /health'
        ]
      });
    });
  }

  async start() {
    try {
      // Try to connect to Python backend on startup
      if (this.pythonBackendUrl) {
        console.log(`🐍 Attempting to connect to Python backend at ${this.pythonBackendUrl}...`);
        const connected = await this.pipeline.connectToPythonBackend(this.pythonBackendUrl);
        if (connected) {
          console.log('✅ Python backend connected - advanced semantic processing available');
        } else {
          console.log('⚠️ Python backend not available - using local classification');
        }
      }

      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Semantic Bridge API running on port ${this.port}`);
        console.log(`📡 Available at: http://localhost:${this.port}`);
        console.log(`🧠 Semantic processing: ${this.pipeline.config.pythonBackendUrl ? 'Hybrid (JS + Python)' : 'Local (JS only)'}`);
        console.log(`📋 Health check: http://localhost:${this.port}/health`);
      });

    } catch (error) {
      console.error('Failed to start API server:', error);
      process.exit(1);
    }
  }

  async stop() {
    if (this.server) {
      this.server.close();
      console.log('🛑 Semantic Bridge API stopped');
    }
  }
}

// CLI interface
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

  const api = new SemanticBridgeAPI({
    port: port,
    pythonBackendUrl: pythonBackendUrl
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await api.stop();
    process.exit(0);
  });

  api.start();
}

module.exports = SemanticBridgeAPI; 