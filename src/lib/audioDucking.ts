// Audio ducking utility - reduces background music volume when AI speaks

let backgroundAudioRef: HTMLAudioElement | null = null;
let originalVolume: number = 1;
let isDucked: boolean = false;
const DUCKED_VOLUME = 0.2; // Reduce to 20% of original volume when speaking

/**
 * Register the background audio element for ducking
 */
export function registerBackgroundAudio(audio: HTMLAudioElement | null): void {
  backgroundAudioRef = audio;
  if (audio) {
    originalVolume = audio.volume;
    console.log('🎵 Background audio registered for ducking, original volume:', originalVolume);
  }
}

/**
 * Get the current original volume
 */
export function getOriginalVolume(): number {
  return originalVolume;
}

/**
 * Update the original volume (when user changes volume in settings)
 */
export function updateOriginalVolume(volume: number): void {
  originalVolume = volume;
  // If not ducked, update the audio volume immediately
  if (!isDucked && backgroundAudioRef) {
    backgroundAudioRef.volume = originalVolume;
  }
}

/**
 * Duck (reduce) background audio volume
 */
export function duckAudio(): void {
  if (!backgroundAudioRef || isDucked) return;
  
  // Store current volume as original if not already set
  if (originalVolume === 1 && backgroundAudioRef.volume < 1) {
    originalVolume = backgroundAudioRef.volume;
  }
  
  const duckedVolume = originalVolume * DUCKED_VOLUME;
  backgroundAudioRef.volume = duckedVolume;
  isDucked = true;
  console.log(`🔇 Audio ducked: ${originalVolume} → ${duckedVolume}`);
}

/**
 * Restore background audio volume
 */
export function restoreAudio(): void {
  if (!backgroundAudioRef || !isDucked) return;
  
  backgroundAudioRef.volume = originalVolume;
  isDucked = false;
  console.log(`🔊 Audio restored to: ${originalVolume}`);
}

/**
 * Check if audio is currently ducked
 */
export function isAudioDucked(): boolean {
  return isDucked;
}

/**
 * Mute background audio
 */
export function muteBackgroundAudio(): void {
  if (backgroundAudioRef) {
    backgroundAudioRef.pause();
    console.log('🔇 Background audio muted');
  }
}

/**
 * Unmute background audio
 */
export function unmuteBackgroundAudio(): void {
  if (backgroundAudioRef) {
    if (backgroundAudioRef.paused) {
      backgroundAudioRef.play().catch(error => {
        console.error('Error resuming audio:', error);
      });
      console.log('🔊 Background audio unmuted and resumed');
    } else {
      console.log('🔊 Background audio already playing');
    }
  } else {
    console.warn('⚠️ No background audio registered to unmute');
  }
}

/**
 * Check if background audio is muted/paused
 */
export function isBackgroundAudioMuted(): boolean {
  return backgroundAudioRef ? backgroundAudioRef.paused : false;
}

/**
 * Get the background audio reference
 */
export function getBackgroundAudioRef(): HTMLAudioElement | null {
  return backgroundAudioRef;
}

