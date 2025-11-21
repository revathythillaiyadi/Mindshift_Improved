/**
 * n8n Webhook Integration
 * Handles communication with n8n webhook for AI chatbot responses
 * Optimized for quick responses with parallel processing support
 */

// Test webhook URL - Make sure to execute the workflow in n8n test mode before testing
// For production, use: https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
const N8N_WEBHOOK_URL = 'https://trevathy.app.n8n.cloud/webhook-test/b15d3ab2-c44b-4786-a227-6e53000b0f43';

export interface N8NRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: {
    mood?: string;
    preferences?: Record<string, any>;
    timestamp?: number;
  };
}

export interface N8NResponse {
  response: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Send a message to the n8n webhook and get AI response
 * Optimized for quick responses with timeout and error handling
 */
export async function sendToN8N(
  request: N8NRequest,
  options?: {
    timeout?: number;
    signal?: AbortSignal;
  }
): Promise<N8NResponse> {
  const timeout = options?.timeout || 25000; // 25 second default timeout for faster feedback
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    // Add timestamp to context for better logging
    const requestWithContext = {
      ...request,
      context: {
        ...request.context,
        timestamp: Date.now(),
      },
    };

    const startTime = performance.now();
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestWithContext),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = performance.now() - startTime;
    console.log(`⚡ n8n response time: ${responseTime.toFixed(2)}ms`);

    if (!response.ok) {
      throw new Error(`n8n webhook returned status ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle different response formats from n8n
    let responseText: string;
    
    if (typeof data === 'string') {
      responseText = data;
    } else if (data?.response) {
      responseText = data.response;
    } else if (data?.text) {
      responseText = data.text;
    } else if (data?.message) {
      responseText = data.message;
    } else if (data?.body) {
      responseText = typeof data.body === 'string' ? data.body : JSON.stringify(data.body);
    } else if (data?.content) {
      responseText = data.content;
    } else if (data?.output) {
      responseText = data.output;
    } else {
      // If response is an object with other structure, try to extract text or stringify
      responseText = JSON.stringify(data);
    }

    return {
      response: responseText || 'I received your message but got an empty response.',
      success: true,
      metadata: {
        responseTime,
        ...data.metadata,
      },
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        response: 'Request timed out. Please try again.',
        success: false,
        error: 'timeout',
      };
    }

    console.error('❌ Error calling n8n webhook:', error);
    return {
      response: 'Sorry, I encountered an error. Please try again.',
      success: false,
      error: error.message || 'unknown_error',
    };
  }
}

/**
 * Legacy helper functions for backward compatibility
 */
export async function sendUserMessageToN8N(
  userId: string,
  message: string,
  sessionId?: string
): Promise<void> {
  // Non-blocking call to log user message (if needed)
  try {
    await sendToN8N({
      message,
      userId,
      sessionId,
    });
  } catch (error) {
    console.error('Error sending user message to n8n:', error);
    // Don't throw - this is just logging
  }
}

export async function sendAIResponseToN8N(
  userId: string,
  response: string,
  sessionId?: string
): Promise<void> {
  // Non-blocking call to log AI response (if needed)
  try {
    await sendToN8N({
      message: response,
      userId,
      sessionId,
    });
  } catch (error) {
    console.error('Error sending AI response to n8n:', error);
    // Don't throw - this is just logging
  }
}

export { N8N_WEBHOOK_URL };