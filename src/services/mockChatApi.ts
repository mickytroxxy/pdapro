import { PREDEFINED_RESPONSES } from '@/src/constants/predefinedResponses';

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

// Mock API service
export const mockChatApi = {
  // Generate a random thread ID
  generateThreadId: () => Math.random().toString(36).substring(2),

  // Generate a random assistant ID
  generateAssistantId: () => Math.random().toString(36).substring(2),

  // Simulate API response
  simulateResponse: (request: ChatRequest): Promise<ChatResponse[]> => {
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
  }
};
