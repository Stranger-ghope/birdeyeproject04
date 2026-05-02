const BASE_URL = 'https://public-api.birdeye.so';
const API_KEY = process.env.BIRDEYE_API_KEY;

async function testBirdeyeAPI() {
  console.log('Testing Birdeye API...');
  console.log('API Key:', API_KEY ? 'Present' : 'Missing');
  
  // Test the networks endpoint first
  try {
    const response = await fetch(`${BASE_URL}/defi/networks`, {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status:', response.status);
    const body = await response.text();
    console.log('Response:', body.substring(0, 500));
  } catch (error: any) {
    console.error('Error:', error.message);
  }
  
  // Test the new_listing endpoint
  try {
    const response = await fetch(`${BASE_URL}/defi/v2/tokens/new_listing?limit=10`, {
      headers: {
        'X-API-KEY': API_KEY,
        'x-chain': 'solana',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('New Listing Status:', response.status);
    const body = await response.text();
    console.log('New Listing Response:', body.substring(0, 500));
  } catch (error: any) {
    console.error('New Listing Error:', error.message);
  }
}

testBirdeyeAPI();
