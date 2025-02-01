# Custom Chatbot Sample Application

This sample application demonstrates how to build a modern chat interface using DigitalOcean's GenAI Platform. It features real-time streaming responses, WebSocket communication, and proper authentication.

## Architecture

### Authentication Service

The `AuthService` handles authentication with the DigitalOcean GenAI Platform:

- Validates required environment variables
- Manages the Agent Access Key securely
- Provides the key for API authentication

### Chat Service

The `ChatService` manages the chat functionality:

- Maintains WebSocket connections for real-time communication
- Handles message streaming from the AI
- Manages chat sessions and conversation history
- Processes incoming messages and outgoing responses

### Session Management

The application uses Express Session middleware for secure session handling:
- Authenticates WebSocket connections using session IDs
- Maintains user state across page refreshes
- Protects against session hijacking and tampering
- Uses SESSION_SECRET to sign and encrypt session data

## Setup

### Prerequisites

- Node.js 18 or higher
- npm
- A DigitalOcean GenAI Platform account with:
  - An Agent Key (found in Settings > Endpoint Access Keys)
  - An Agent Endpoint URL

### Environment Variables

Create a `.env` file in the root directory:

```env
# For local development only, App Platform will set PORT automatically
PORT=3000

# Required environment variables
AGENT_KEY=your-agent-key         # Created in Settings > Endpoint Access Keys
AGENT_ENDPOINT=your-agent-endpoint # Your agent's endpoint URL (must end with /api/v1/)
SESSION_SECRET=your-secret-key    # Long random string for session security
```

**Important Notes:**
1. The `SESSION_SECRET` should be:
   - A long, random string (at least 32 characters recommended)
   - Different between development and production environments
   - Kept secret and never committed to version control
   - Changed if potentially compromised

2. When deploying to DigitalOcean App Platform:
   - Do not set the `PORT` variable (managed automatically)
   - Set a strong `SESSION_SECRET` in the environment variables
   - Keep the `SESSION_SECRET` consistent across app instances

### Installation

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev

# Start production server
npm start
```

## Running Tests

The application includes comprehensive tests for all major components:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## DigitalOcean Deployment Requirements

To deploy this application on DigitalOcean:

1. **App Platform Setup**:
   - Deploy as a single container/instance to maintain WebSocket connections
   - Set all environment variables listed above

2. **GenAI Platform Requirements**:
   - Create an AI Agent in your DigitalOcean account
   - Navigate to Settings > Endpoint Access Keys
   - Create a new access key and copy it to your environment variables
   - Copy the Endpoint URL from the agent settings

For detailed instructions on setting up and using AI Agents, please refer to:
- [DigitalOcean GenAI Platform Documentation](https://docs.digitalocean.com/products/genai-platform/)
- [How to Use Agents Documentation](https://docs.digitalocean.com/products/genai-platform/how-to/manage-ai-agent/use-agent/)

## Features

- Real-time streaming responses
- WebSocket-based communication
- Secure authentication
- Session persistence
- Markdown support in chat
- Code syntax highlighting
- Dark/Light theme support
- Mobile-responsive design

## Security Notes

- Never commit your `.env` file
- Always use a strong `SESSION_SECRET`
- The application validates all required environment variables on startup
- WebSocket connections are authenticated using session IDs
- Access tokens are managed securely in memory

## License

ISC License 