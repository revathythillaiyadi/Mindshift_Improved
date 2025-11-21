# ElevenLabs Voice Integration Setup

## Overview
The app now supports ElevenLabs for natural, high-quality voices. ElevenLabs provides much more natural-sounding voices compared to browser TTS.

## Setup Instructions

### 1. Get Your ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account (free tier available)
3. Navigate to your profile/settings
4. Copy your API key

### 2. Add API Key to Environment Variables
Create or update your `.env` file in the project root:

```env
VITE_ELEVENLABS_API_KEY=your_api_key_here
```

### 3. Restart Your Development Server
After adding the API key, restart your dev server:
```bash
npm run dev
```

## Voice Selection

### Female Voice (Default: Rachel)
- **Rachel**: Very natural, warm, conversational, soft and melodious ⭐ RECOMMENDED
- **Bella**: Soft, warm, natural, melodious
- **Elli**: Soft, natural female voice
- **Nicole**: Natural, warm female

### Male Voice (Default: Antoni)
- **Antoni**: Natural, warm male ⭐ RECOMMENDED
- **Arnold**: Deep, natural male
- **Adam**: Natural male
- **Sam**: Natural male

## How It Works

1. **Automatic Fallback**: If ElevenLabs API key is not configured, the app automatically falls back to browser TTS
2. **Voice Selection**: The app uses the best available voices from ElevenLabs
3. **Audio Ducking**: Background music automatically reduces when AI speaks
4. **Natural Sound**: ElevenLabs voices are much more natural than browser TTS

## Customizing Voices

You can customize the voice IDs in `src/lib/elevenlabs.ts`:
- Replace the voice IDs with your own ElevenLabs voice IDs
- Adjust voice settings (stability, similarity_boost, style) for different tones

## Testing

Once configured, send a message to NIRA and you should hear a much more natural voice response!

