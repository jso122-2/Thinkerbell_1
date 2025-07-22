/**
 * Thinkerbell Pipeline - Basic Usage Examples
 * Demonstrates various ways to use the content formatting pipeline
 */

const ThinkerbellPipeline = require('../src/ThinkerbellPipeline');

// Initialize the pipeline
const pipeline = new ThinkerbellPipeline({
  enableValidation: true,
  enableBrandVoice: true,
  defaultTemplate: 'slide_deck'
});

async function runExamples() {
  console.log('🎭 Thinkerbell Pipeline Examples\n');

  // Example 1: Campaign Recap with JSON Input
  console.log('=== Example 1: Campaign Recap (JSON Input) ===');
  const campaignData = {
    title: "Summer Campaign Results",
    subtitle: "Q3 Performance Review",
    sections: [
      { name: "Hunch", content: "Visual storytelling drives 40% more engagement" },
      { name: "Wisdom", content: "Video content outperformed static by 3:1 ratio" },
      { name: "Nudge", content: "Double down on video for Q4 holiday push" },
      { name: "Spell", content: "Interactive shoppable videos with AR try-on features" }
    ]
  };

  const slideOutput = await pipeline.processWithTemplate(campaignData, 'slide_deck');
  console.log(slideOutput);

  // Example 2: Strategy Brief with YAML Input
  console.log('\n=== Example 2: Strategy Brief (YAML Input) ===');
  const yamlInput = `title: Social Media Strategy Brief
subtitle: Q4 Holiday Campaign
sections:
  - name: Challenge
    content: Brand awareness is flatlining among 18-24s
  - name: Insight
    content: This demographic consumes content in 7-second chunks
  - name: Strategy  
    content: Micro-moments of brand magic, not long-form storytelling
  - name: Tactics
    content: TikTok duets with unexpected brand appearances`;

  const strategyOutput = await pipeline.processWithTemplate(yamlInput, 'strategy_doc');
  console.log(strategyOutput);

  // Example 3: Creative Brief
  console.log('\n=== Example 3: Creative Brief ===');
  const creativeData = {
    title: "Toothbrush Comedy Campaign",
    campaign_name: "Brush & Laugh",
    sections: [
      { name: "Problem", content: "People find dental hygiene boring and skip brushing" },
      { name: "Audience", content: "Gen Z who consume comedy content daily" },
      { name: "Message", content: "Make brushing the funniest 2 minutes of your day" },
      { name: "Magic", content: "Smart toothbrush that tells jokes based on brushing technique" }
    ],
    magic: "AI-powered comedy that adapts to your brushing style"
  };

  const creativeOutput = await pipeline.processWithTemplate(creativeData, 'creative_brief');
  console.log(creativeOutput);

  // Example 4: Measurement Report with Metrics
  console.log('\n=== Example 4: Measurement Report ===');
  const metricsData = {
    title: "Q3 Campaign Performance",
    sections: [
      { name: "Overview", content: "Campaign exceeded engagement targets by 23%" }
    ],
    metrics: [
      { name: "Reach", target: "1M", actual: "1.2M", variance: "+20%" },
      { name: "Engagement", target: "5%", actual: "6.2%", variance: "+24%" },
      { name: "Conversions", target: "500", actual: "623", variance: "+25%" }
    ]
  };

  const reportOutput = await pipeline.processWithTemplate(metricsData, 'measurement_report');
  console.log(reportOutput);

  // Example 5: Basic Formatting (without templates)
  console.log('\n=== Example 5: Basic Formatting ===');
  const basicOutput = await pipeline.processBasic(campaignData, 'campaign_recap', 'bullets');
  console.log(basicOutput);

  // Example 6: Preview Templates
  console.log('\n=== Example 6: Template Preview ===');
  const preview = await pipeline.previewTemplate('slide_deck');
  console.log(preview);

  // Example 7: Batch Processing
  console.log('\n=== Example 7: Batch Processing ===');
  const batchInputs = [
    { 
      data: { title: "Campaign A", sections: [{ name: "Hunch", content: "Test A" }] },
      options: { templateName: 'slide_deck' }
    },
    { 
      data: { title: "Campaign B", sections: [{ name: "Challenge", content: "Test B" }] },
      options: { templateName: 'strategy_doc' }
    }
  ];

  const batchResults = await pipeline.batchProcess(batchInputs);
  console.log(`Batch processed ${batchResults.length} items`);

  // Example 8: Pipeline Statistics
  console.log('\n=== Example 8: Pipeline Statistics ===');
  const stats = pipeline.getStats();
  console.log('Pipeline Stats:', JSON.stringify(stats, null, 2));

  // Example 9: Available Templates
  console.log('\n=== Example 9: Available Templates ===');
  const templates = pipeline.getAvailableTemplates();
  templates.forEach(template => {
    console.log(`📋 ${template.name}: ${template.info?.description || 'No description'}`);
  });
}

// Run examples
runExamples().catch(console.error);

module.exports = { runExamples }; 