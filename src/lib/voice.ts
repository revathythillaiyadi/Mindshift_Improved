// Voice utility for text-to-speech with calm and warm voices

import { duckAudio, restoreAudio } from './audioDucking';
import { isElevenLabsAvailable, playElevenLabsAudio } from './elevenlabs';

interface VoiceConfig {
  name: string;
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
}

// Voice configurations for calm and warm Indian voices
const VOICE_CONFIGS: Record<string, VoiceConfig> = {
  female: {
    name: '', // Will be set dynamically based on available voices
    lang: 'en-US', // Use US English for more natural voices (can override with voice.lang)
    pitch: 0.96, // Natural pitch for calm, empathic tone
    rate: 0.88, // Slightly slower for calmness and empathy
    volume: 0.9 // Good volume for clarity
  },
  male: {
    name: '',
    lang: 'en-US', // US English for natural voices
    pitch: 0.92, // Lower for warmth, depth, and calmness
    rate: 0.86, // Slower for calmness, comfort, and empathy
    volume: 0.88
  },
  child: {
    name: '',
    lang: 'en-US', // US English for natural voices
    pitch: 1.05, // Slightly higher for child-like but still calm
    rate: 0.90, // Natural pace for gentle, kind communication
    volume: 0.85
  }
};

// Preferred voice names (in order of preference) - Prioritizing most natural voices
const PREFERRED_VOICES = {
  female: [
    // macOS voices (most natural, calm, empathic)
    'Samantha', // macOS - very natural, warm, human-like, calming
    'Victoria', // macOS - soft, melodious, natural, kind
    'Karen', // macOS - Australian, warm and natural, empathic
    'Tessa', // macOS - South African, natural, calming
    'Fiona', // macOS - Scottish, natural, warm
    'Moira', // macOS - Irish, natural, kind
    // Windows voices
    'Microsoft Zira - English (United States)', // Windows - natural female, calming
    'Microsoft Aria - English (United States)', // Windows - natural, empathic
    // Google Cloud voices (neural - most natural)
    'en-US-Neural2-F', // Google - very natural neural voice, calm
    'en-US-Wavenet-F', // Google - natural wavenet, kind
    'en-US-Standard-E', // Google - natural standard
    // Indian voices
    'Aishwarya Rai', // Primary Indian female voice
    'Aishwarya', // Alternative name format
    'en-IN-Wavenet-A', // Google English (India) female neural
    'hi-IN-Wavenet-A', // Google Hindi female neural
    // Chrome/Other
    'Google UK English Female', // Chrome
    'en-IN-Standard-A', // Google English (India) female
    'hi-IN-Standard-A', // Google Hindi female
  ],
  male: [
    // Calm, empathic male voices for mental health
    'Microsoft David - English (United States)', // Windows - natural, calming, empathic
    'Microsoft Mark - English (United States)', // Windows - natural, warm
    'Alex', // macOS - natural, calm, reassuring
    'Daniel', // macOS - British, natural, kind
    'Tom', // macOS - natural, warm
    // Google Cloud voices (neural - most natural)
    'en-US-Neural2-D', // Google - natural neural male, calming
    'en-US-Wavenet-D', // Google - natural wavenet, empathic
    'en-US-Standard-D', // Google - natural standard
    // Indian voices
    'Kamal Hasan', // Primary Indian male voice
    'Kamal', // Alternative name format
    'Kamal Haasan', // Alternative spelling
    'hi-IN-Standard-B', // Google Hindi male
    'hi-IN-Wavenet-B', // Google Hindi male neural
    'en-IN-Standard-B', // Google English (India) male
    'en-IN-Wavenet-B', // Google English (India) male neural
    'Google UK English Male', // Fallback - Chrome
  ],
  child: [
    // Calm, kind child voices for mental health (gentle, non-intimidating)
    'Mimi', // ElevenLabs - young, gentle, kind
    'Google UK English Female', // Chrome - can work for child-friendly content
    'Samantha', // macOS - natural, can work for child-friendly content
    'Victoria', // macOS - soft, can work for child-friendly content
    'en-US-Neural2-F', // Google - natural, gentle
    'en-US-Wavenet-F', // Google - natural, kind
  ]
};

let voicesCache: SpeechSynthesisVoice[] | null = null;

/**
 * Get available voices from the browser
 */
function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (voicesCache) {
    return voicesCache;
  }
  
  const voices = window.speechSynthesis.getVoices();
  voicesCache = voices;
  return voices;
}

/**
 * Find the best matching voice for the selected option
 */
function findBestVoice(voiceOption: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (voices.length === 0) {
    console.warn('No voices available');
    return null;
  }

  console.log(`Searching for ${voiceOption} voice. Available voices:`, voices.map(v => v.name));

  const preferred = PREFERRED_VOICES[voiceOption as keyof typeof PREFERRED_VOICES] || [];
  
  // Try to find preferred voices first (case-insensitive, partial match)
  for (const preferredName of preferred) {
    const voice = voices.find(v => {
      const voiceNameLower = v.name.toLowerCase();
      const preferredLower = preferredName.toLowerCase();
      return voiceNameLower.includes(preferredLower) || 
             preferredLower.includes(voiceNameLower) ||
             voiceNameLower === preferredLower;
    });
    if (voice) {
      console.log(`✅ Found preferred voice: ${voice.name} (${voice.lang}) for ${voiceOption}`);
      return voice;
    }
  }

  // Fallback: find any voice matching the language and gender
  const config = VOICE_CONFIGS[voiceOption];
  if (!config) return null;

  // Try to find by Indian/Hindi language first
  const indianVoices = voices.filter(v => 
    v.lang.includes('IN') || 
    v.lang.includes('hi') ||
    v.name.toLowerCase().includes('india') ||
    v.name.toLowerCase().includes('hindi') ||
    v.name.toLowerCase().includes('aishwarya') ||
    v.name.toLowerCase().includes('kamal') ||
    v.name.toLowerCase().includes('sara')
  );
  
  console.log(`Found ${indianVoices.length} Indian voices:`, indianVoices.map(v => `${v.name} (${v.lang})`));
  
  if (voiceOption === 'female') {
    // Look for Aishwarya Rai or Indian female voices
    const aishwaryaVoice = voices.find(v => 
      v.name.toLowerCase().includes('aishwarya')
    );
    if (aishwaryaVoice) {
      console.log(`✅ Found Aishwarya Rai voice: ${aishwaryaVoice.name}`);
      return aishwaryaVoice;
    }
    
    // Look for Indian female voices
    const indianFemale = indianVoices.find(v => 
      v.lang.includes('IN') && (v.lang.includes('A') || v.name.toLowerCase().includes('female')) ||
      v.lang.includes('hi') && (v.lang.includes('A') || v.name.toLowerCase().includes('female'))
    );
    if (indianFemale) return indianFemale;
    
    // Fallback to any natural-sounding female voice
    const naturalFemaleVoices = [
      'samantha', 'victoria', 'karen', 'tessa', 'fiona', 'moira',
      'veena', 'priya', 'ravi', 'neela' // Indian names
    ];
    
    const femaleVoice = voices.find(v => {
      const nameLower = v.name.toLowerCase();
      return nameLower.includes('female') ||
             naturalFemaleVoices.some(natural => nameLower.includes(natural)) ||
             (v.lang.includes('IN') && !nameLower.includes('male'));
    });
    if (femaleVoice) return femaleVoice;
  } else if (voiceOption === 'male') {
    // Look for Kamal Hasan or Indian male voices
    const kamalVoice = voices.find(v => 
      v.name.toLowerCase().includes('kamal')
    );
    if (kamalVoice) {
      console.log(`✅ Found Kamal Hasan voice: ${kamalVoice.name}`);
      return kamalVoice;
    }
    
    // Look for Indian male voices
    const indianMale = indianVoices.find(v => 
      v.lang.includes('IN') && (v.lang.includes('B') || v.name.toLowerCase().includes('male')) ||
      v.lang.includes('hi') && (v.lang.includes('B') || v.name.toLowerCase().includes('male'))
    );
    if (indianMale) return indianMale;
    
    // Fallback to any male voice
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes('male') ||
      v.name.toLowerCase().includes('alex') ||
      v.name.toLowerCase().includes('david')
    );
    if (maleVoice) return maleVoice;
  }

  // Final fallback: use first available Indian voice, then any voice
  if (indianVoices.length > 0) {
    console.log(`Using fallback Indian voice: ${indianVoices[0].name}`);
    return indianVoices[0];
  }
  
  console.warn(`No Indian voice found for ${voiceOption}, using first available voice`);
  return voices[0] || null;
}

/**
 * Speak text with the selected voice option
 * Tries ElevenLabs first (if available), then falls back to browser TTS
 */
export function speakText(text: string, voiceOption: string = 'female'): Promise<void> {
  // Check if voice agent is muted
  if (isVoiceAgentMuted) {
    console.log('🔇 Voice agent is muted, skipping speech');
    return Promise.resolve();
  }

  // Normalize voice option - now support child voice
  const validOption = (voiceOption === 'female' || voiceOption === 'male' || voiceOption === 'child')
    ? voiceOption as 'female' | 'male' | 'child'
    : 'female';

  // Try ElevenLabs first if available
  if (isElevenLabsAvailable()) {
    console.log(`🎤 Using ElevenLabs for natural ${validOption} voice (mental health optimized)`);
    console.log(`📝 Text to speak: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
    return playElevenLabsAudio(text, validOption)
      .then(() => {
        console.log('✅ ElevenLabs speech completed successfully');
      })
      .catch((error) => {
        console.warn('⚠️ ElevenLabs failed, falling back to browser TTS:', error);
        // Fall back to browser TTS
        return speakWithBrowserTTS(text, voiceOption);
      });
  }

  // Use browser TTS (fallback)
  console.log(`🔊 Using browser TTS for ${voiceOption} voice (ElevenLabs not configured)`);
  return speakWithBrowserTTS(text, voiceOption);
}

/**
 * Speak text using browser's built-in TTS (fallback)
 */
function speakWithBrowserTTS(text: string, voiceOption: string = 'female'): Promise<void> {
  return new Promise((resolve, reject) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Function to load voices and perform speech
    const loadVoicesAndSpeak = () => {
      // Clear cache to force reload
      voicesCache = null;
      let voices = window.speechSynthesis.getVoices();
      
      // If no voices, wait for them to load
      if (voices.length === 0) {
        console.log('Waiting for voices to load...');
        // Set up event listener for when voices are loaded
        const onVoicesLoaded = () => {
          voices = window.speechSynthesis.getVoices();
          voicesCache = voices;
          console.log(`Loaded ${voices.length} voices`);
          window.speechSynthesis.onvoiceschanged = null; // Remove listener
          performSpeech(text, voiceOption, resolve, reject);
        };
        
        window.speechSynthesis.onvoiceschanged = onVoicesLoaded;
        
        // Also try again after a delay as fallback
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            voicesCache = voices;
            window.speechSynthesis.onvoiceschanged = null;
            performSpeech(text, voiceOption, resolve, reject);
          } else {
            console.warn('No voices available after waiting');
            // Try to speak anyway with default voice
            performSpeech(text, voiceOption, resolve, reject);
          }
        }, 500);
        return;
      }

      // Voices are available, proceed
      voicesCache = voices;
      performSpeech(text, voiceOption, resolve, reject);
    };

    // Start loading voices
    loadVoicesAndSpeak();
  });
}

function performSpeech(
  text: string, 
  voiceOption: string, 
  resolve: () => void, 
  reject: (error: Error) => void
) {
  try {
    if (!text || text.trim().length === 0) {
      console.warn('Empty text, skipping speech');
      resolve();
      return;
    }

    // Support child voice now
    const normalizedVoiceOption = voiceOption;
    
    const utterance = new SpeechSynthesisUtterance(text.trim());
    const config = VOICE_CONFIGS[normalizedVoiceOption] || VOICE_CONFIGS.female;
    const voice = findBestVoice(normalizedVoiceOption);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // Use the voice's native language
      console.log(`🎤 Using voice: ${voice.name} (${voice.lang}) for ${normalizedVoiceOption}`);
    } else {
      console.warn(`⚠️ No specific voice found for ${normalizedVoiceOption}, using default with config`);
      utterance.lang = config.lang;
    }

    // Apply voice settings optimized for mental health: calm, empathic, kind
    if (normalizedVoiceOption === 'female') {
      // Calm, empathic female voice settings
      utterance.pitch = 0.96; // Natural pitch for calm, empathic tone
      utterance.rate = 0.88; // Slightly slower for calmness and empathy
      utterance.volume = 0.9;
      
      // For neural/Wavenet/premium voices, use optimal natural settings
      if (voice && (voice.name.includes('Neural') || voice.name.includes('Wavenet') || 
          voice.name.includes('Samantha') || voice.name.includes('Victoria') ||
          voice.name.includes('Bella') || voice.name.includes('Rachel') ||
          voice.name.includes('Elli') || voice.name.includes('Nicole'))) {
        utterance.pitch = 0.97; // Natural pitch
        utterance.rate = 0.90; // Natural pace for calm, empathic communication
        console.log('🎵 Using optimal natural voice settings for premium/neural voice (mental health)');
      }
    } else if (normalizedVoiceOption === 'child') {
      // Calm, kind child voice settings
      utterance.pitch = 1.05; // Slightly higher for child-like but still calm
      utterance.rate = 0.90; // Natural pace for gentle, kind communication
      utterance.volume = 0.85;
      
      // For premium voices, adjust slightly
      if (voice && (voice.name.includes('Neural') || voice.name.includes('Wavenet') || 
          voice.name.includes('Mimi') || voice.name.includes('Samantha'))) {
        utterance.pitch = 1.08; // Slightly higher for child-like
        utterance.rate = 0.92; // Natural pace
        console.log('🎵 Using optimal child voice settings for premium/neural voice');
      }
    } else {
      // Male voice settings (calm, empathic)
      utterance.pitch = config.pitch;
      utterance.rate = config.rate;
      utterance.volume = config.volume;
    }

    // Event handlers
    utterance.onend = () => {
      console.log('✅ Speech completed');
      // Restore background audio when speech ends
      restoreAudio();
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('❌ Speech synthesis error:', event);
      console.error('Error details:', {
        error: event.error,
        type: event.type,
        charIndex: event.charIndex
      });
      // Restore background audio even on error
      restoreAudio();
      // Don't reject, just resolve so it doesn't break the flow
      resolve();
    };

    utterance.onstart = () => {
      console.log('🔊 Speech started');
      // Duck background audio when speech starts
      duckAudio();
    };

    utterance.onpause = () => {
      console.log('⏸️ Speech paused');
    };

    utterance.onresume = () => {
      console.log('▶️ Speech resumed');
    };

    // Speak
    console.log(`🗣️ Speaking: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    window.speechSynthesis.speak(utterance);
    
    // Fallback: if speech doesn't start within 1 second, resolve anyway
    setTimeout(() => {
      if (window.speechSynthesis.speaking) {
        console.log('Speech is in progress...');
      } else {
        console.warn('Speech may not have started');
      }
    }, 1000);
  } catch (error) {
    console.error('Error in speech synthesis:', error);
    // Don't reject, just resolve so it doesn't break the flow
    resolve();
  }
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech(): void {
  window.speechSynthesis.cancel();
  // Restore background audio when speech is stopped
  restoreAudio();
}

// Mute state for voice agent (TTS)
let isVoiceAgentMuted = false;

/**
 * Mute voice agent (TTS)
 */
export function muteVoiceAgent(): void {
  isVoiceAgentMuted = true;
  stopSpeech(); // Stop any ongoing speech
  console.log('🔇 Voice agent muted');
}

/**
 * Unmute voice agent (TTS)
 */
export function unmuteVoiceAgent(): void {
  isVoiceAgentMuted = false;
  console.log('🔊 Voice agent unmuted');
}

/**
 * Check if voice agent is muted
 */
export function isVoiceAgentMutedState(): boolean {
  return isVoiceAgentMuted;
}

/**
 * Check if speech synthesis is available
 */
export function isSpeechSynthesisAvailable(): boolean {
  const available = 'speechSynthesis' in window && window.speechSynthesis !== undefined;
  if (!available) {
    console.warn('Speech synthesis not available in this browser');
  }
  return available;
}

/**
 * Test speech synthesis with a simple phrase
 */
export function testSpeech(voiceOption: string = 'female'): void {
  if (!isSpeechSynthesisAvailable()) {
    console.error('Speech synthesis not available');
    return;
  }
  
  speakText('Hello, this is a test of the voice system.', voiceOption)
    .then(() => console.log('✅ Test speech completed'))
    .catch(error => console.error('❌ Test speech failed:', error));
}

