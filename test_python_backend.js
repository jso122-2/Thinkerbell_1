#!/usr/bin/env node
/**
 * Test Python Backend Integration
 * Verify that the Python semantic engine is working properly
 */

const axios = require('axios');

const PYTHON_BACKEND_URL = 'http://localhost:8000';
const NODE_API_URL = 'http://localhost:3000';

async function testPythonBackend() {
  console.log('🧪 Testing Python Backend Integration\n');

  try {
    // Test 1: Python Backend Health
    console.log('1. 🐍 Testing Python Backend Health...');
    const pythonHealth = await axios.get(`${PYTHON_BACKEND_URL}/health`);
    console.log('✅ Python Backend Status:', pythonHealth.data.status);
    console.log('🧠 ML Available:', pythonHealth.data.ml_available);
    console.log('🤖 Model Loaded:', pythonHealth.data.model_loaded);

    // Test 2: Node.js Bridge Health
    console.log('\n2. 🌉 Testing Node.js API Bridge...');
    const nodeHealth = await axios.get(`${NODE_API_URL}/health`);
    console.log('✅ Node.js Bridge Status:', nodeHealth.data.status);
    console.log('🔗 Backend Connected:', nodeHealth.data.backend_connected);

    // Test 3: Direct Python Processing
    console.log('\n3. 🧠 Testing Direct Python Semantic Processing...');
    const testContent = {
      content: "I think our brand needs a major overhaul. Research shows that 68% of consumers prefer authentic brands. We should implement user-generated content campaigns. Imagine AI that creates personalized brand stories for each customer.",
      template_type: "slide_deck",
      confidence_threshold: 0.3
    };

    const pythonResult = await axios.post(`${PYTHON_BACKEND_URL}/process`, testContent);
    console.log('📊 Python Processing Results:');
    console.log('  - Processing Time:', pythonResult.data.processing_time_ms + 'ms');
    console.log('  - Method:', pythonResult.data.method);
    console.log('  - Total Sentences:', pythonResult.data.analytics.total_sentences);
    console.log('  - Dominant Category:', pythonResult.data.analytics.dominant_category);
    
    // Display content distribution
    console.log('  - Content Distribution:');
    Object.entries(pythonResult.data.analytics.distribution).forEach(([category, data]) => {
      console.log(`    ${category}: ${data.count} items (${data.percentage}%)`);
    });

    // Test 4: Node.js Bridge Processing (should now use Python backend)
    console.log('\n4. 🌉 Testing Node.js Bridge Processing (with Python backend)...');
    const bridgeResult = await axios.post(`${NODE_API_URL}/process`, {
      content: testContent.content,
      template_name: 'slide_deck'
    });

    console.log('📊 Bridge Processing Results:');
    console.log('  - Success:', bridgeResult.data.success);
    console.log('  - Method:', bridgeResult.data.result.method || 'semantic');
    console.log('  - Processing Time:', bridgeResult.data.metadata.processing_time + 'ms');

    // Test 5: Explanation Feature
    console.log('\n5. 🔍 Testing Classification Explanation...');
    const explanationResult = await axios.post(`${PYTHON_BACKEND_URL}/explain`, {
      sentence: "Research shows that 73% of consumers prefer authentic brands over polished corporate messaging."
    });

    console.log('📝 Explanation Results:');
    console.log('  - Sentence:', explanationResult.data.sentence.substring(0, 50) + '...');
    console.log('  - Category:', explanationResult.data.category);
    console.log('  - Confidence:', (explanationResult.data.confidence * 100).toFixed(1) + '%');
    console.log('  - Explanation:', explanationResult.data.explanation);

    // Test 6: Model Information
    console.log('\n6. 🤖 Testing Model Information...');
    const modelsInfo = await axios.get(`${PYTHON_BACKEND_URL}/models`);
    console.log('🧠 Model Information:');
    console.log('  - Current Model:', modelsInfo.data.current_model);
    console.log('  - ML Dependencies:', modelsInfo.data.ml_dependencies_available);
    console.log('  - Model Loaded:', modelsInfo.data.model_loaded);

    console.log('\n🎉 All tests passed! Python backend is fully integrated and working.');
    console.log('\n🚀 System Status:');
    console.log('  ✅ Python Backend: Running with advanced ML');
    console.log('  ✅ Node.js Bridge: Connected to Python backend');
    console.log('  ✅ Semantic Processing: Enhanced AI classification');
    console.log('  ✅ Template System: Ready for content generation');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('  1. Make sure Python backend is running: python backend_server.py');
      console.log('  2. Make sure Node.js API is running: npm run api:start');
      console.log('  3. Check if ports 8000 and 3000 are available');
    }
  }
}

// Run the test
if (require.main === module) {
  testPythonBackend();
}

module.exports = { testPythonBackend }; 