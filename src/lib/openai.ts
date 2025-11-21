// OpenAI API integration for title extraction and correction

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface TitleExtractionResult {
  title: string;
  content: string;
}

/**
 * Extract and correct title from speech transcript
 * Detects phrases like "this is my title" and extracts the title part
 */
export async function extractAndCorrectTitle(transcript: string): Promise<TitleExtractionResult | null> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  try {
    // Detect title phrases (case-insensitive)
    const titlePhrases = [
      'this is my title',
      'title is',
      'the title is',
      'my title is',
      'title:',
      'title -',
    ];

    const lowerTranscript = transcript.toLowerCase();
    let titleStartIndex = -1;
    let detectedPhrase = '';

    // Find which title phrase was used
    for (const phrase of titlePhrases) {
      const index = lowerTranscript.indexOf(phrase);
      if (index !== -1) {
        titleStartIndex = index + phrase.length;
        detectedPhrase = phrase;
        break;
      }
    }

    if (titleStartIndex === -1) {
      return null; // No title phrase detected
    }

    // Extract title and content
    const titlePart = transcript.substring(titleStartIndex).trim();
    const contentPart = transcript.substring(0, titleStartIndex - detectedPhrase.length).trim();

    // Use OpenAI to correct and format the title
    const correctedTitle = await correctTitleWithOpenAI(titlePart);

    return {
      title: correctedTitle,
      content: contentPart,
    };
  } catch (error) {
    console.error('Error extracting title:', error);
    return null;
  }
}

/**
 * Use OpenAI to correct, format, and improve the title
 */
async function correctTitleWithOpenAI(titleText: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    return titleText; // Return original if no API key
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that corrects and formats journal entry titles. Return only the corrected title, nothing else. Make it concise (max 50 characters), grammatically correct, and properly capitalized. If the input is already good, return it as-is with minor improvements.',
          },
          {
            role: 'user',
            content: `Correct and format this journal entry title: "${titleText}"`,
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const correctedTitle = data.choices[0]?.message?.content?.trim() || titleText;

    // Fallback: if OpenAI returns something unexpected, use original
    if (correctedTitle.length > 100) {
      return titleText.substring(0, 50);
    }

    return correctedTitle;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Return original title if API call fails
    return titleText.substring(0, 50);
  }
}

/**
 * Check if transcript contains title phrase
 */
export function hasTitlePhrase(transcript: string): boolean {
  const titlePhrases = [
    'this is my title',
    'title is',
    'the title is',
    'my title is',
    'title:',
    'title -',
  ];

  const lowerTranscript = transcript.toLowerCase();
  return titlePhrases.some(phrase => lowerTranscript.includes(phrase));
}

