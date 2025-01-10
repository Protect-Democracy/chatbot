const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// Handle new chat messages
router.post('/chat', async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    console.log('Processing message for session:', chatId);

    // Get the WebSocket connection for this session
    const ws = chatService.getConnection(chatId);
    
    if (!ws || ws.readyState !== 1) { // 1 = OPEN
      console.error('No active WebSocket connection found for session:', chatId);
      return res.status(500).json({ error: 'No active connection' });
    }

    // Start streaming response
    const stream = await chatService.sendMessage(message, chatId);
    
    // Process the stream and send chunks to the client
    const success = await chatService.processStream(stream, ws, chatId);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to process stream' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Chat error:', {
      message: error.message,
      stack: error.stack,
      chatId: req.body.chatId
    });
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

// Serve the chat page
router.get('/', (req, res) => {
  // Initialize session with chatId if not exists
  if (!req.session.chatId) {
    req.session.chatId = require('uuid').v4();
  }
  res.render('chat', { chatId: req.session.chatId });
});

module.exports = router; 