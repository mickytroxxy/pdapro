import { v4 as uuidv4 } from 'uuid';
import { PREDEFINED_RESPONSES } from '@/src/constants/predefinedResponses';
import useFetch from '@/src/hooks/useFetch';

// Types for the chat API
export interface ChatRequest {
  message: string;
  threadId: string;
  assistantId: string;
  firstSession: boolean;
  code: string;
  contextAction: string;
}

export interface ChatResponse {
  startOfStream: boolean;
  endOfSession: boolean;
  responseText: string;
  sessionId: string;
  endOfStream: boolean;
}

export const useChatService = () => {
  const { fetchData } = useFetch();

  // Generate a random thread ID
  const generateThreadId = () => uuidv4();
  
  // Generate a random assistant ID
  const generateAssistantId = () => uuidv4();
  
  // Simulate API response
  const simulateResponse = async (request: ChatRequest): Promise<ChatResponse[]> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Get a random response from predefined responses
          let randomResponse = "I'm sorry, I couldn't understand that. Could you try again?";
          
          // Make sure PREDEFINED_RESPONSES exists and has items
          if (PREDEFINED_RESPONSES && Array.isArray(PREDEFINED_RESPONSES) && PREDEFINED_RESPONSES.length > 0) {
            randomResponse = PREDEFINED_RESPONSES[Math.floor(Math.random() * PREDEFINED_RESPONSES.length)];
          }
          
          // Create response object
          const response: ChatResponse[] = [
            {
              startOfStream: false,
              endOfSession: true,
              responseText: randomResponse,
              sessionId: request.threadId,
              endOfStream: true
            }
          ];
          
          resolve(response);
        } catch (error) {
          // If there's an error, return a fallback response
          console.error('Error in mock API:', error);
          const fallbackResponse: ChatResponse[] = [
            {
              startOfStream: false,
              endOfSession: true,
              responseText: "I'm sorry, I encountered an error. Please try again later.",
              sessionId: request.threadId || "fallback-session",
              endOfStream: true
            }
          ];
          resolve(fallbackResponse);
        }
      }, 1000); // Simulate 1 second delay
    });
  };

  // Send message to API
  const sendMessage = async (request: ChatRequest): Promise<ChatResponse[]> => {
    try {
      // Call the API
      const response = await fetchData({
        endPoint: '/text-conversation',
        method: 'POST',
        data: request
      });

      console.log('API response:', response);

      // If API call fails, use the mock API
      if (!response) {
        console.log('API call failed, using mock API');
        return simulateResponse(request);
      }

      // If response is not in the expected format, use the mock API
      if (!Array.isArray(response) || response.length === 0) {
        console.log('Invalid API response format, using mock API');
        return simulateResponse(request);
      }

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return simulateResponse(request);
    }
  };

  return {
    generateThreadId,
    generateAssistantId,
    simulateResponse,
    sendMessage
  };
};
