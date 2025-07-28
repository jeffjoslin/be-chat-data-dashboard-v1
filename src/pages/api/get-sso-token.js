const jwt = require('jsonwebtoken');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the payload being signed for debugging
    console.log('SSO Token Payload:', JSON.stringify(req.body, null, 2));
    
    // Generate JWT token
    const ssoToken = jwt.sign(
      req.body,
      process.env.PRIVATE_JWT_SECRET,
      {
        algorithm: 'HS256',
      }
    );

    console.log('Generated SSO Token:', ssoToken);
    return res.status(200).json({ ssoToken });
  } catch (error) {
    console.error('SSO Token generation error:', error);
    return res.status(500).json({ error: 'Failed to generate SSO token' });
  }
}