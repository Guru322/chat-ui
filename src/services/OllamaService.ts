import axios from 'axios';

// Rate limiting configuration
const RATE_LIMIT_INTERVAL = 1000; // 1 second in milliseconds
let lastRequestTime = 0;

interface OllamaStreamResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = '/api/generate'; // for cors
    this.model = 'hf.co/Guru322/Gurus-text-model:latest';
  }

  /**
   * Enforces rate limiting by waiting if needed
   * @returns Promise that resolves when it's safe to make a request
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_INTERVAL && lastRequestTime !== 0) {
      const waitTime = RATE_LIMIT_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastRequestTime = Date.now();
  }

  /**
   * Parses a chunk of streaming response data
   * @param chunk Raw chunk data from the stream
   * @returns Parsed JSON object or null if parsing fails
   */
  private parseStreamChunk(chunk: string): OllamaStreamResponse | null {
    try {
      return JSON.parse(chunk) as OllamaStreamResponse;
    } catch (error) {
      console.error('Error parsing stream chunk:', error);
      return null;
    }
  }

  /**
   * Sends a message to the Ollama API with rate limiting and handles streaming response
   * @param prompt User message to send to the API
   * @param onUpdate Callback function to receive incremental updates
   * @returns Promise with the complete API response
   */
  public async sendMessage(
    prompt: string, 
    onUpdate?: (text: string, done: boolean) => void
  ): Promise<string> {
    try {
      // Enforce rate limiting
      await this.enforceRateLimit();
      
      // Format the prompt as required by the API
      const formattedPrompt = `### Instruction:\n${prompt}\n### Response:`;
      
      // Make the API request with responseType 'stream'
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          prompt: formattedPrompt
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text',
          // Use transformResponse to prevent automatic JSON parsing
          transformResponse: [(data) => data]
        }
      );
      
      // Process the streaming response
      let fullResponse = '';
      const chunks = response.data.split('\n').filter((chunk: string) => chunk.trim() !== '');
      
      for (const chunk of chunks) {
        const parsedChunk = this.parseStreamChunk(chunk);
        
        if (parsedChunk) {
          // Append the response text to the full response
          fullResponse += parsedChunk.response;
          
          // Call the update callback if provided
          if (onUpdate) {
            onUpdate(fullResponse, parsedChunk.done);
          }
          
          // If this is the final chunk, we're done
          if (parsedChunk.done) {
            break;
          }
        }
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      
      // Return error message that can be displayed to the user
      if (axios.isAxiosError(error) && error.response) {
        return `Error: ${error.response.status} - ${error.response.statusText}`;
      } else {
        return 'Error: Failed to connect to the Ollama server. Please try again later.';
      }
    }
  }
}

// Export a singleton instance
export const ollamaService = new OllamaService();
