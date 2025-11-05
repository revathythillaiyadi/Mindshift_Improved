import { Volume2, Image, Mic, CloudRain, Wind, Droplets, Bird, Music, Piano } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPanel() {
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [soundVolume, setSoundVolume] = useState(50);
  const [backgroundTheme, setBackgroundTheme] = useState('nature');
  const [voiceOption, setVoiceOption] = useState('female');

  const ambientSounds = [
    { id: 'rain', name: 'Rain', icon: CloudRain },
    { id: 'waterfall', name: 'Waterfall', icon: Droplets },
    { id: 'breeze', name: 'Breeze', icon: Wind },
    { id: 'birds', name: 'Birds', icon: Bird },
    { id: 'piano', name: 'Piano', icon: Piano },
    { id: 'flute', name: 'Flute', icon: Music },
  ];

  const backgroundThemes = [
    {
      id: 'nature',
      name: 'Nature',
      preview: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'abstract',
      name: 'Abstract',
      preview: 'https://images.pexels.com/photos/3622517/pexels-photo-3622517.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 'sky',
      name: 'Sky/Space',
      preview: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const voiceOptions = [
    { id: 'female', name: 'Female Voice', description: 'Calm and reassuring' },
    { id: 'male', name: 'Male Voice', description: 'Deep and comforting' },
    { id: 'child', name: "Baby Girl's Voice", description: 'Gentle and soothing' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Ambient Music</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              Select Sound
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ambientSounds.map((sound) => {
                const Icon = sound.icon;
                return (
                  <button
                    key={sound.id}
                    onClick={() => setAmbientSound(ambientSound === sound.id ? null : sound.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      ambientSound === sound.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-blue-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${ambientSound === sound.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sound.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Volume Control
              </h3>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{soundVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="w-full h-2 bg-blue-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Chat Interface Background</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {backgroundThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setBackgroundTheme(theme.id)}
                className={`relative rounded-xl overflow-hidden border-4 transition-all ${
                  backgroundTheme === theme.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-blue-200 dark:border-gray-600 hover:border-blue-400'
                }`}
              >
                <img src={theme.preview} alt={theme.name} className="w-full h-32 object-cover" />
                <div className={`absolute inset-0 flex items-center justify-center ${
                  backgroundTheme === theme.id
                    ? 'bg-blue-600/30'
                    : 'bg-black/20'
                }`}>
                  <span className="text-white font-semibold text-lg drop-shadow-lg">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-2 border-dashed border-blue-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
            <Image className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Upload Personal Image</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload your own background image
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Audio Output Voice</h2>
        </div>

        <div className="space-y-3">
          {voiceOptions.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setVoiceOption(voice.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                voiceOption === voice.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-blue-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 dark:text-white">{voice.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{voice.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                voiceOption === voice.id
                  ? 'border-blue-500'
                  : 'border-gray-400'
              }`}>
                {voiceOption === voice.id && (
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
            <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Voice options provide empathic and calming audio responses from NIRA during your conversations.
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
          Reset to Defaults
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
}
