// n8n webhook integration service

const N8N_WEBHOOK_URL = 'https://trevathy.app.n8n.cloud/webhook/eJ4ZBtr9c6nqP6V1';

export interface ChatMessagePayload {
  user_id: string;
  user_email?: string;
  message: string;
  speaker: 'user' | 'ai';
  timestamp: string;
  session_id?: string;
}

/**
 * Send chat message to n8n webhook
 */
export async function sendToN8N(payload: ChatMessagePayload): Promise<void> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        source: 'mindshift-nira',
        app_version: '1.0.0',
      }),
    });

    if (!response.ok) {
      console.warn('n8n webhook returned non-OK status:', response.status, response.statusText);
    } else {
      console.log('✅ Message sent to n8n successfully');
    }
  } catch (error) {
    // Don't throw - we don't want n8n failures to break the chat
    console.error('Error sending message to n8n:', error);
  }
}

/**
 * Send user chat message to n8n
 */
export async function sendUserMessageToN8N(
  userId: string,
  userEmail: string | undefined | null,
  message: string,
  sessionId?: string
): Promise<void> {
  await sendToN8N({
    user_id: userId,
    user_email: userEmail || undefined,
    message,
    speaker: 'user',
    timestamp: new Date().toISOString(),
    session_id: sessionId,
  });
}

/**
 * Send AI response to n8n
 */
export async function sendAIResponseToN8N(
  userId: string,
  userEmail: string | undefined | null,
  message: string,
  sessionId?: string
): Promise<void> {
  await sendToN8N({
    user_id: userId,
    user_email: userEmail || undefined,
    message,
    speaker: 'ai',
    timestamp: new Date().toISOString(),
    session_id: sessionId,
  });
}

