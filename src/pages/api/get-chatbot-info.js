const CHAT_DATA_API_KEY = 'sk-vdGeHrh7OPPvrsXCMjhemJ4PiFSuuYP7';
const CHAT_DATA_API_BASE = 'https://api.chat-data.com/api/v2';

// Simple in-memory cache (2 minutes)
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatbotId } = req.query;

  if (!chatbotId) {
    return res.status(400).json({ error: 'Chatbot ID is required' });
  }

  try {
    // Check cache first
    const cacheKey = `chatbot-${chatbotId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`Cache hit for chatbot ${chatbotId}`);
      return res.status(200).json(cached.data);
    }

    console.log(`Fetching chatbot info for ID: ${chatbotId}`);

    // Fetch from Chat Data API
    const response = await fetch(`${CHAT_DATA_API_BASE}/get-chatbot/${chatbotId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CHAT_DATA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chat Data API error (${response.status}):`, errorText);
      
      return res.status(response.status).json({ 
        error: 'Failed to fetch chatbot data',
        details: `API returned ${response.status}`,
        chatbotId 
      });
    }

    const chatbotData = await response.json();
    console.log(`Successfully fetched chatbot data for ${chatbotId}`);
    console.log('=== CHAT DATA API RESPONSE ===');
    console.log(JSON.stringify(chatbotData, null, 2));
    console.log('Available fields:', Object.keys(chatbotData));
    console.log('=== END API RESPONSE ===');

    // Cache the response
    cache.set(cacheKey, {
      data: chatbotData,
      timestamp: Date.now()
    });

    // Clean up old cache entries (simple cleanup)
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return res.status(200).json(chatbotData);

  } catch (error) {
    console.error('Error fetching chatbot data:', error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      chatbotId 
    });
  }
}