/**
 * n8n Webhook Integration
 * Handles communication with n8n webhook for AI chatbot responses
 * Optimized for quick responses with parallel processing support
 */

// Webhook URL - Can be set via environment variable or defaults to production
// For production, use: https://trevathy.app.n8n.cloud/webhook/b15d3ab2-c44b-4786-a227-6e53000b0f43
// NOTE: Production webhooks require workflow to be ACTIVE in n8n dashboard.

// In development, use Vite proxy to avoid CORS issues
// In production, use direct URL (server-to-server, no CORS)
const getN8NWebhookURL = () => {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
  // If environment variable is set, use it
  if (import.meta.env.VITE_N8N_WEBHOOK_URL) {
    const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    
    // In development, use proxy to avoid CORS
    // In production, always use direct URL
    if (isDev && envUrl.includes('trevathy.app.n8n.cloud')) {
      // Extract the path from the full URL
      const url = new URL(envUrl);
      return `/api/n8n${url.pathname}${url.search}`;
    }
    
    // Production: use direct URL from env var
    return envUrl;
  }
  
  // Default: use proxy in dev, direct URL in production
  const defaultPath = '/webhook/b15d3ab2-c44b-4786-a227-6e53000b0f43';
  if (isDev) {
    return `/api/n8n${defaultPath}`;
  }
  
  // Production: always use direct URL
  return `https://trevathy.app.n8n.cloud${defaultPath}`;
};

const N8N_WEBHOOK_URL = getN8NWebhookURL();

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
    let response: Response;
    
    try {
      response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestWithContext),
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      // Handle network errors (CORS, connection refused, etc.)
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw fetchError; // Let timeout handler deal with this
      }
      
      // Network/fetch errors - "Failed to fetch" can mean many things
      const errorMsg = fetchError.message || 'Unknown error';
      const isCorsError = errorMsg.includes('CORS') || 
                         errorMsg.includes('CORS policy') ||
                         errorMsg.includes('Access-Control');
      const isFailedToFetch = errorMsg.includes('Failed to fetch') ||
                             errorMsg.includes('NetworkError') ||
                             errorMsg.includes('Network request failed');
      
      // "Failed to fetch" often means:
      // 1. CORS issue (most common)
      // 2. Network connectivity issue
      // 3. Server not responding (404, 500, etc.)
      // 4. SSL/TLS certificate issue
      
      console.error('❌ n8n webhook network error:', {
        error: errorMsg,
        errorName: fetchError.name,
        url: N8N_WEBHOOK_URL,
        isCorsError,
        isFailedToFetch,
        suggestion: isCorsError 
          ? 'CORS error: Check n8n webhook CORS settings. n8n webhooks should allow all origins by default.'
          : isFailedToFetch
          ? 'Network error: This could be CORS, network connectivity, or the workflow not being active. Check: 1) Workflow is ACTIVE in n8n, 2) Network connection, 3) Browser console for details.'
          : 'Check network connection and n8n service status',
      });
      
      // Provide more helpful error message
      let userFriendlyError = 'Network error: Unable to connect to n8n.';
      
      if (isCorsError) {
        userFriendlyError = 'CORS error: The n8n webhook is blocking the request. Check CORS settings in your n8n webhook node.';
      } else if (isFailedToFetch) {
        userFriendlyError = 'Connection failed: This could mean the workflow is not active, there\'s a network issue, or CORS is blocking the request. Please: 1) Verify the workflow is ACTIVE in n8n dashboard, 2) Check your network connection, 3) Check browser console for more details.';
      } else {
        userFriendlyError = `Network error: ${errorMsg}`;
      }
      
      throw new Error(userFriendlyError);
    }

    clearTimeout(timeoutId);
    const responseTime = performance.now() - startTime;
    console.log(`⚡ n8n response time: ${responseTime.toFixed(2)}ms`);

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 404) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // If response isn't JSON, try text
          const text = await response.text().catch(() => '');
          errorData = { message: text || 'Webhook not found' };
        }
        
        const errorMessage = errorData.message || 'Webhook not found';
        const hint = errorData.hint || '';
        
        console.error('❌ n8n webhook 404 - Webhook not registered:', {
          message: errorMessage,
          hint: hint,
          url: N8N_WEBHOOK_URL,
          isTestWebhook: N8N_WEBHOOK_URL.includes('/webhook-test/'),
          fullError: errorData,
        });
        
        throw new Error(
          `n8n webhook not active (404). ${hint || 'Please activate the workflow in n8n dashboard.'}`
        );
      }
      
      // Handle 500 errors (workflow execution errors)
      if (response.status === 500) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text().catch(() => '');
          errorData = { message: text || 'Internal Server Error' };
        }
        
        console.error('❌ n8n webhook 500 - Workflow execution error:', {
          message: errorData.message || errorData.error,
          status: response.status,
          url: N8N_WEBHOOK_URL,
          fullError: errorData,
          suggestion: 'Check n8n Executions tab for detailed error logs',
        });
        
        throw new Error(
          `n8n workflow error (500): ${errorData.message || errorData.error || 'Internal Server Error'}. Check the Executions tab in n8n dashboard for detailed error logs.`
        );
      }
      
      // Handle other HTTP errors
      let errorText = '';
      try {
        const errorData = await response.json();
        errorText = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch {
        errorText = await response.text().catch(() => response.statusText);
      }
      
      throw new Error(`n8n webhook returned status ${response.status}: ${errorText}`);
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
      console.error('⏱️ n8n webhook timeout after', timeout, 'ms');
      return {
        response: 'Request timed out. Please try again.',
        success: false,
        error: 'timeout',
      };
    }

    // Enhanced error logging
    const errorMessage = error.message || 'unknown_error';
    const is404 = errorMessage.includes('404') || errorMessage.includes('not active');
    
    console.error('❌ Error calling n8n webhook:', {
      error: errorMessage,
      url: N8N_WEBHOOK_URL,
      isTestWebhook: N8N_WEBHOOK_URL.includes('/webhook-test/'),
      suggestion: is404 
        ? 'Activate the workflow in n8n dashboard or execute it in test mode'
        : 'Check network connection and n8n workflow status',
    });

    // Provide more helpful error messages
    let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.';
    if (is404) {
      userFriendlyMessage = 'I\'m having trouble connecting right now. Please check that the n8n workflow is active.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyMessage = 'The request took too long. Please try again.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userFriendlyMessage = 'Network error. Please check your internet connection.';
    }

    return {
      response: userFriendlyMessage,
      success: false,
      error: errorMessage,
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

/**
 * Test n8n webhook connection
 * Useful for debugging connection issues
 */
export async function testN8NConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    const testRequest: N8NRequest = {
      message: 'test connection',
      userId: 'test-user',
      sessionId: 'test-session',
    };

    const response = await sendToN8N(testRequest, { timeout: 10000 });
    
    if (response.success) {
      return {
        success: true,
        message: 'n8n webhook is connected and working!',
        details: response.metadata,
      };
    } else {
      return {
        success: false,
        message: `Connection failed: ${response.error || 'Unknown error'}`,
        details: { error: response.error },
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Connection test failed: ${error.message}`,
      details: { error: error.message },
    };
  }
}

export { N8N_WEBHOOK_URL };