// ElevenLabs TTS integration for natural voices

import { duckAudio, restoreAudio } from './audioDucking';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// ElevenLabs voice IDs optimized for mental health applications
// Calm, empathic, kind voices suitable for therapy and wellness
// Using user-provided voice IDs
const ELEVENLABS_VOICES = {
  female: {
    // User's custom female voice - calm, empathic, kind
    'Female': 'rxvktZTNrsQlsGIpOQGz', // Custom female voice for mental health
    // Fallback options
    'Bella': 'EXAVITQu4vr4xnSDxMaL', // Soft, warm, natural, melodious, kind
    'Elli': 'MF3mGyEYCl7XYWbV9V6O', // Soft, natural, very kind, empathic
    'Rachel': '21m00Tcm4TlvDq8ikWAM', // Natural, warm, conversational, calming
  },
  male: {
    // User's custom male voice - calm, empathic, kind
    'Male': 'j9jfwdrw7BRfcR43Qohk', // Custom male voice for mental health
    // Fallback options
    'Antoni': 'ErXwobaYiN019PkySvjV', // Natural, warm, calming
    'Michael': 'flq6f7yk4E4fJM5XTYuZ', // Older, wise, empathic
    'Arnold': 'VR6AewLTigWG4xSOukaG', // Deep, natural, comforting
  },
  child: {
    // User's custom child voice - calm, kind, gentle
    'Child': 'XJ2fW4ybq7HouelYYGcL', // Custom child voice for mental health
    // Fallback options
    'Mimi': 'zrHiDhphv9ZnVxq0cZ2w', // Young, gentle, kind
    'Bella': 'EXAVITQu4vr4xnSDxMaL', // Soft, warm (can work for child-friendly content)
  }
};

// Default voice selections - using user's custom voices
const DEFAULT_VOICES = {
  female: 'Female', // User's custom female voice - calm, empathic, kind
  male: 'Male', // User's custom male voice - calm, empathic, kind
  child: 'Child', // User's custom child voice - calm, kind, gentle
};

// Alternative voices to try if default doesn't work well
const ALTERNATIVE_FEMALE_VOICES = [
  'Female', // User's custom female voice - PRIMARY
  'Bella', // Soft, warm, natural, melodious, kind
  'Elli', // Soft, natural, very kind, empathic
  'Rachel', // Natural, warm, conversational, calming
];

const ALTERNATIVE_MALE_VOICES = [
  'Male', // User's custom male voice - PRIMARY
  'Antoni', // Natural, warm, calming
  'Michael', // Older, wise, empathic
  'Arnold', // Deep, natural, comforting
];

/**
 * Check if ElevenLabs is configured
 */
export function isElevenLabsAvailable(): boolean {
  const available = !!ELEVENLABS_API_KEY && ELEVENLABS_API_KEY.length > 0;
  if (!available) {
    console.log('ℹ️ ElevenLabs not configured - using browser TTS. Add VITE_ELEVENLABS_API_KEY to .env for natural voices.');
  }
  return available;
}

/**
 * Get available ElevenLabs voices
 */
export async function getElevenLabsVoices(): Promise<any[]> {
  if (!isElevenLabsAvailable()) {
    return [];
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    return [];
  }
}

/**
 * Convert text to speech using ElevenLabs
 */
export async function speakWithElevenLabs(
  text: string,
  voiceOption: 'female' | 'male' | 'child' = 'female'
): Promise<HTMLAudioElement | null> {
  if (!isElevenLabsAvailable()) {
    console.warn('ElevenLabs API key not configured');
    return null;
  }

  if (!text || text.trim().length === 0) {
    return null;
  }

  try {
    // Get voice ID - try default first, then alternatives
    let voiceName = DEFAULT_VOICES[voiceOption];
    const voiceMap = ELEVENLABS_VOICES[voiceOption] as Record<string, string> | undefined;
    let voiceId = voiceMap?.[voiceName];
    
    console.log(`🔍 Looking up voice for option: ${voiceOption}`);
    console.log(`🔍 Default voice name: ${voiceName}`);
    console.log(`🔍 Available voices in map:`, Object.keys(voiceMap || {}));
    console.log(`🔍 Initial voiceId lookup: ${voiceId || 'NOT FOUND'}`);
    
    // Try alternatives if default not available
    if (!voiceId) {
      console.log(`⚠️ Default voice not found, trying alternatives...`);
      if (voiceOption === 'female') {
        for (const altVoice of ALTERNATIVE_FEMALE_VOICES) {
          voiceId = ELEVENLABS_VOICES.female?.[altVoice as keyof typeof ELEVENLABS_VOICES.female] as string | undefined;
          console.log(`  Trying alternative: ${altVoice} -> ${voiceId || 'NOT FOUND'}`);
          if (voiceId) {
            voiceName = altVoice;
            break;
          }
        }
      } else if (voiceOption === 'male') {
        for (const altVoice of ALTERNATIVE_MALE_VOICES) {
          voiceId = ELEVENLABS_VOICES.male?.[altVoice as keyof typeof ELEVENLABS_VOICES.male] as string | undefined;
          console.log(`  Trying alternative: ${altVoice} -> ${voiceId || 'NOT FOUND'}`);
          if (voiceId) {
            voiceName = altVoice;
            break;
          }
        }
      }
    }
    
    // Final fallback
    if (!voiceId && voiceMap) {
      const firstKey = Object.keys(voiceMap)[0];
      voiceId = voiceMap[firstKey];
      voiceName = firstKey || 'Unknown';
      console.log(`⚠️ Using fallback voice: ${voiceName} (${voiceId})`);
    }

    if (!voiceId) {
      console.error(`❌ No ElevenLabs voice found for ${voiceOption}`);
      return null;
    }

    console.log(`✅ Using ElevenLabs voice: ${voiceName} (${voiceId}) for ${voiceOption}`);

    // Call ElevenLabs TTS API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2', // Natural, multilingual model
          voice_settings: {
            // Optimized for mental health: calm, empathic, kind
            // Lower stability = more natural, expressive, empathic
            // Higher similarity = more consistent with voice character
            // Lower style = softer, kinder, more calming tone
            stability: voiceOption === 'female' ? 0.3 : voiceOption === 'child' ? 0.35 : 0.4, // Balanced for calmness
            similarity_boost: voiceOption === 'female' ? 0.88 : voiceOption === 'child' ? 0.85 : 0.82, // Natural sound
            style: voiceOption === 'female' ? 0.1 : voiceOption === 'child' ? 0.15 : 0.2, // Subtle for calm, kind tone
            use_speaker_boost: true, // Enhance voice quality
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs TTS error: ${response.status} - ${errorText}`);
    }

    // Get audio blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create and play audio
    const audio = new Audio(audioUrl);
    audio.volume = 0.9;

    return audio;
  } catch (error) {
    console.error('Error with ElevenLabs TTS:', error);
    return null;
  }
}

/**
 * Play audio from ElevenLabs
 */
export async function playElevenLabsAudio(
  text: string,
  voiceOption: 'female' | 'male' | 'child' = 'female'
): Promise<void> {
  // Duck background audio when starting
  duckAudio();

  const audio = await speakWithElevenLabs(text, voiceOption);
  if (audio) {
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audio.src); // Clean up
        restoreAudio(); // Restore background audio
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(audio.src); // Clean up
        restoreAudio(); // Restore background audio even on error
        reject(error);
      };
      audio.play().catch((playError) => {
        restoreAudio(); // Restore background audio on play error
        reject(playError);
      });
    });
  } else {
    restoreAudio(); // Restore if audio creation failed
    throw new Error('Failed to generate audio with ElevenLabs');
  }
}

