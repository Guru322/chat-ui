# Guru's Ollama Server - Usage Instructions

This document provides instructions on how to use the Guru's Ollama Server chat application.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Unzip the provided file to a directory of your choice
2. Navigate to the directory in your terminal
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```
npm start
```

This will start the development server and open the application in your default browser at http://localhost:3000.

### Production Build

To create a production build:

```
npm run build
```

This will create a `build` directory with optimized production files. You can serve these files using any static file server.

For example, using the `serve` package:

```
npm install -g serve
serve -s build
```

## Using the Chat Interface

1. The application opens with a dark-themed chat interface
2. Type your message in the input field at the bottom
3. Press the send button or hit Enter to send your message
4. The AI will respond after a brief processing time
5. The interface is responsive and works on both desktop and mobile devices

## API Integration

The application connects to the Ollama API at `https://ollama.gurucharan.me/api/generate` using the model `hf.co/Guru322/Gurus-text-model:latest`. The API integration includes:

- Rate limiting to prevent overloading the server
- Error handling for API requests
- Loading indicators during API calls

## Customization

To modify the application:

- Edit theme settings in `src/theme.ts`
- Modify API settings in `src/services/OllamaService.ts`
- Update UI components in the `src/components` directory

## Troubleshooting

If you encounter issues:

1. Ensure you have the correct Node.js version installed
2. Check your internet connection for API access
3. Verify that the Ollama API endpoint is accessible
4. Check the browser console for any error messages

For any other issues, please contact the developer.
