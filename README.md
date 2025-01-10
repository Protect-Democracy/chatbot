# Custom Chatbot Sample Application

This sample application demonstrates how to build a modern chat interface using DigitalOcean's GenAI Platform. It features real-time streaming responses, WebSocket communication, and proper token management for API authentication.

## Architecture

### Token Service

The `TokenService` handles authentication with the DigitalOcean GenAI Platform using a two-token system:

1. **Refresh Token**: A long-lived token obtained using your Agent ID and Key
2. **Access Token**: A short-lived JWT token used for API calls

The service automatically:
- Manages token lifecycle
- Refreshes expired tokens
- Validates token expiry
- Handles error cases and retries

### Chat Service

The `ChatService` manages the chat functionality:

- Maintains WebSocket connections for real-time communication
- Handles message streaming from the AI
- Manages chat sessions and conversation history
- Processes incoming messages and outgoing responses

## Setup

### Prerequisites

- Node.js 18 or higher
- npm
- A DigitalOcean GenAI Platform account with:
  - An Agent ID
  - An Agent Key
  - An Agent Endpoint

### Environment Variables

Create a `.env` file in the root directory:

```env
# For local development only, App Platform will set PORT automatically
PORT=3000

# Required environment variables
API_BASE=https://cluster-api.do-ai.run/v1
AGENT_ID=your-agent-id
AGENT_KEY=your-agent-key
AGENT_ENDPOINT=your-agent-endpoint
SESSION_SECRET=your-session-secret
```

**Note**: When deploying to DigitalOcean App Platform, do not set the `PORT` environment variable as it is automatically managed by the platform.

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
   - Configure the agent endpoint visibility (public/private)
     - Private endpoints require access keys for authentication
     - Public endpoints are accessible via the internet
   - Copy the required credentials to your environment variables:
     - `AGENT_ID`: Your agent's unique identifier
     - `AGENT_KEY`: Your agent's access key
     - `AGENT_ENDPOINT`: Your agent's endpoint URL (must end with `/api/v1/`)

For detailed instructions on setting up and using AI Agents, please refer to:
- [DigitalOcean GenAI Platform Documentation](https://docs.digitalocean.com/products/genai-platform/how-to/manage-ai-agent/use-agent/) - Learn about managing agents, endpoints, and access keys
- [Early Access Documentation](https://docs.digitalocean.com/products/genai-platform/) - Get the latest updates on the GenAI Platform

**Note**: This application implements the token-based authentication flow required for private endpoints, including:
- Obtaining and managing refresh tokens
- Handling access token lifecycle
- Automatic token refresh
- Error handling and retries

## Features

- Real-time streaming responses
- WebSocket-based communication
- Secure token management
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
- Tokens are managed securely in memory

## License

ISC License 