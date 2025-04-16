import axios from 'axios';

// Rate limiting configuration
const RATE_LIMIT_INTERVAL = 1000; // 1 second in milliseconds
let lastRequestTime = 0;

interface OllamaResponse {
  response: string;
  [key: string]: any;
}

class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = 'http://localhost:11434/api/generate';
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
   * Sends a message to the Ollama API with rate limiting
   * @param prompt User message to send to the API
   * @returns Promise with the API response
   */
  public async sendMessage(prompt: string): Promise<string> {
    try {
      // Enforce rate limiting
      await this.enforceRateLimit();
      
      // Format the prompt as required by the API
      const formattedPrompt = `### Instruction:\n${prompt}\n### Response:`;
      
      // Make the API request
      const response = await axios.post<OllamaResponse>(
        this.baseUrl,
        {
          model: this.model,
          prompt: formattedPrompt
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Return the response text
      return response.data.response;
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
