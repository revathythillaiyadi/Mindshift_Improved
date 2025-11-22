/**
 * Test n8n connection using the actual app code
 * This will use VITE_N8N_WEBHOOK_URL from .env if set
 */

import { testN8NConnection, N8N_WEBHOOK_URL } from './src/lib/n8n';

async function runTest() {
  console.log('🔍 Testing n8n Connection...\n');
  console.log('📡 Webhook URL:', N8N_WEBHOOK_URL);
  console.log('🌍 Environment:', import.meta.env.MODE);
  console.log('🔑 Using env var:', import.meta.env.VITE_N8N_WEBHOOK_URL ? 'Yes' : 'No (using default)');
  console.log('');

  try {
    const result = await testN8NConnection();
    
    if (result.success) {
      console.log('✅ SUCCESS: n8n connection is working!');
      console.log('📊 Details:', result.details);
    } else {
      console.log('❌ FAILED: n8n connection failed');
      console.log('💬 Message:', result.message);
      console.log('🔍 Details:', result.details);
      
      if (result.message.includes('404') || result.message.includes('not active')) {
        console.log('\n💡 SOLUTION:');
        console.log('   1. Go to https://trevathy.app.n8n.cloud');
        console.log('   2. Open your workflow');
        console.log('   3. Toggle the workflow to ACTIVE (top-right switch)');
        console.log('   4. Run this test again');
      }
    }
  } catch (error: any) {
    console.error('❌ Test error:', error.message);
  }
}

runTest();

