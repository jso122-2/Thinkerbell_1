/**
 * Cursor Integration Example
 * Shows how to quickly integrate the Thinkerbell pipeline in Cursor
 */

const ThinkerbellPipeline = require('./src/ThinkerbellPipeline');

// Quick setup - one line initialization
const pipeline = new ThinkerbellPipeline({
  enableValidation: true,
  enableBrandVoice: true
});

// Example: Process campaign data quickly
async function quickExample() {
  const campaignData = {
    title: "Holiday Campaign 2024",
    subtitle: "Making the season magical",
    sections: [
      { name: "Hunch", content: "Holiday shoppers want emotional connection, not just deals" },
      { name: "Wisdom", content: "Stories outsell promotions 3:1 during holiday season" },
      { name: "Nudge", content: "Lead with heartwarming stories, then reveal the offer" },
      { name: "Spell", content: "AI-generated personalized holiday stories for each customer" }
    ]
  };

  // Process with one line
  const output = await pipeline.processWithTemplate(campaignData, 'slide_deck');
  console.log('🎄 Holiday Campaign Output:');
  console.log(output);
}

// Example: Replace templates with real ones
async function substituteRealTemplates() {
  console.log('\n🔄 Substituting with real Thinkerbell templates...');
  
  // Your real Thinkerbell slide template
  const realSlideTemplate = {
    header: "# {{title}} | Thinkerbell Strategy 🎯\n*{{subtitle}}*\n\n**Strategy Session Date**: {{date}}\n\n---\n\n",
    section: "## {{section_icon}} {{section_title}}\n\n{{section_content}}\n\n*Strategic insight by Thinkerbell team*\n\n📊 **Impact Score**: ⭐⭐⭐⭐⭐\n\n---\n\n",
    footer: "\n**Next Actions:**\n- [ ] Review with client stakeholder\n- [ ] Align with creative team\n- [ ] Set implementation timeline\n\n---\n\n*✨ Crafted with strategic magic by Thinkerbell*\n*Confidential Strategy Document*"
  };

  // Replace in one line
  pipeline.substituteTemplates({
    slide_deck: realSlideTemplate
  });

  console.log('✅ Real templates loaded!');
}

// Example: Load from files (when you have real template files)
async function loadFromFiles() {
  try {
    await pipeline.loadRealTemplates({
      slide_deck: './templates/example_slide_deck.json',
      strategy_doc: './templates/example_strategy_doc.json'
    });
    console.log('✅ Templates loaded from files');
  } catch (error) {
    console.log('ℹ️ Using built-in templates (create template files for custom ones)');
  }
}

// Run integration examples
async function runIntegration() {
  console.log('🚀 Thinkerbell Pipeline - Cursor Integration\n');
  
  await quickExample();
  await substituteRealTemplates();
  await loadFromFiles();
  
  console.log('\n🎯 Integration Complete!');
  console.log('\n📝 Usage in your code:');
  console.log(`
const ThinkerbellPipeline = require('./src/ThinkerbellPipeline');
const pipeline = new ThinkerbellPipeline();

// Process any data
const output = await pipeline.processWithTemplate(yourData, 'slide_deck');
console.log(output);
  `);
}

// Export for use in other files
module.exports = {
  pipeline,
  quickExample,
  substituteRealTemplates,
  loadFromFiles
};

// Run if called directly
if (require.main === module) {
  runIntegration().catch(console.error);
} 