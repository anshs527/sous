/**
 * Gemini API Connection Test Script
 * 
 * This script tests the Gemini API connection to verify:
 * 1. API key is valid
 * 2. Model is accessible
 * 3. Basic generation works
 * 
 * Usage: node test-gemini-api.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

// Test configuration
const TEST_CONFIG = {
  model: 'gemini-2.5-flash',
  testPrompt: 'Say "Hello, Gemini!" in a friendly way.',
  timeout: 30000, // 30 seconds
};

async function testGeminiAPI() {
  console.log('🧪 Gemini API Connection Test\n');
  console.log('='.repeat(60));

  // Step 1: Check API Key
  console.log('\n📋 Step 1: Checking API Key...');
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('❌ ERROR: GEMINI_API_KEY not found or not configured');
    console.error('   Please add your API key to .env.local:');
    console.error('   GEMINI_API_KEY=your_actual_api_key_here');
    process.exit(1);
  }
  
  const maskedKey = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4);
  console.log(`✅ API Key found: ${maskedKey}`);
  console.log(`   Length: ${apiKey.length} characters`);

  // Step 2: Initialize Client
  console.log('\n📋 Step 2: Initializing Gemini Client...');
  let genAI;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Client initialized successfully');
  } catch (error) {
    console.error('❌ ERROR: Failed to initialize client');
    console.error('   Error:', error.message);
    process.exit(1);
  }

  // Step 3: Test Model Access
  console.log(`\n📋 Step 3: Testing model access (${TEST_CONFIG.model})...`);
  let model;
  try {
    model = genAI.getGenerativeModel({ model: TEST_CONFIG.model });
    console.log(`✅ Model "${TEST_CONFIG.model}" initialized`);
  } catch (error) {
    console.error('❌ ERROR: Failed to initialize model');
    console.error('   Error:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('   - Check if the model name is correct');
    console.error('   - Verify your API key has access to this model');
    console.error('   - Ensure the Generative Language API is enabled in Google Cloud Console');
    process.exit(1);
  }

  // Step 4: Test Generation
  console.log('\n📋 Step 4: Testing content generation...');
  console.log(`   Prompt: "${TEST_CONFIG.testPrompt}"`);
  
  try {
    const startTime = Date.now();
    const result = await model.generateContent(TEST_CONFIG.testPrompt);
    const response = await result.response;
    const text = response.text();
    const duration = Date.now() - startTime;
    
    console.log(`✅ Generation successful (${duration}ms)`);
    console.log(`\n📝 Response:`);
    console.log('   ' + text.replace(/\n/g, '\n   '));
    
    // Additional info
    console.log(`\n📊 Response Details:`);
    console.log(`   - Length: ${text.length} characters`);
    console.log(`   - Words: ${text.split(/\s+/).length} words`);
    console.log(`   - Response time: ${duration}ms`);
    
  } catch (error) {
    console.error('❌ ERROR: Failed to generate content');
    console.error('   Error:', error.message);
    console.error('   Full error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('404')) {
      console.error('\n💡 This is a 404 error. Possible causes:');
      console.error('   - Model name is incorrect or deprecated');
      console.error('   - API version mismatch');
      console.error('   - API endpoint issue');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n💡 This is an authentication error. Possible causes:');
      console.error('   - Invalid API key');
      console.error('   - API key doesn\'t have required permissions');
      console.error('   - API key has been revoked');
    } else if (error.message.includes('429')) {
      console.error('\n💡 This is a rate limit error. Possible causes:');
      console.error('   - Too many requests in a short time');
      console.error('   - Free tier limit exceeded');
      console.error('   - Quota exceeded');
    }
    
    process.exit(1);
  }

  // Step 5: Test with Recipe-Style Prompt
  console.log('\n📋 Step 5: Testing recipe-style prompt...');
  const recipePrompt = `List 3 ingredients for making pasta. Return as JSON array.`;
  
  try {
    const startTime = Date.now();
    const result = await model.generateContent(recipePrompt);
    const response = await result.response;
    const text = response.text();
    const duration = Date.now() - startTime;
    
    console.log(`✅ Recipe prompt successful (${duration}ms)`);
    console.log(`\n📝 Response:`);
    console.log('   ' + text.replace(/\n/g, '\n   '));
    
  } catch (error) {
    console.error('❌ ERROR: Failed recipe-style prompt');
    console.error('   Error:', error.message);
    process.exit(1);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ ALL TESTS PASSED!\n');
  console.log('🎉 Your Gemini API integration is working correctly!');
  console.log('\n📝 Summary:');
  console.log('   ✅ API key is valid');
  console.log('   ✅ Model is accessible');
  console.log('   ✅ Basic generation works');
  console.log('   ✅ Recipe-style prompts work');
  console.log('\n🚀 You can now use the Gemini API in your Sous app!');
  console.log('\n💡 Next steps:');
  console.log('   1. Make sure USE_MOCK_DATA = false in your API routes');
  console.log('   2. Test the recipe search feature in your app');
  console.log('   3. Test the recipe parsing feature');
  console.log('   4. Monitor the console logs for any issues\n');
  
  process.exit(0);
}

// Run the test
testGeminiAPI().catch((error) => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});

