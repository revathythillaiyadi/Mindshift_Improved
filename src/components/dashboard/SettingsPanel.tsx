import { Volume2, Image, Mic, CloudRain, Wind, Droplets, Bird, Music, Piano, Check, AlertCircle, Upload, X, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsPanel() {
  const { user } = useAuth();
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [soundVolume, setSoundVolume] = useState(50);
  const [backgroundTheme, setBackgroundTheme] = useState('nature');
  const [voiceOption, setVoiceOption] = useState('female');
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [availableBackgrounds, setAvailableBackgrounds] = useState<Record<string, string[]>>({});
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(false);
  const [availableAudioFiles, setAvailableAudioFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [loadingAudioFiles, setLoadingAudioFiles] = useState(false);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPreferences();
    loadAvailableBackgrounds();
    loadAvailableAudioFiles();
  }, [user]);

  // Reload audio files when component mounts (when settings page is opened)
  useEffect(() => {
    if (user) {
      loadAvailableAudioFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAvailableAudioFiles = async () => {
    setLoadingAudioFiles(true);
    try {
      // Try different bucket name formats
      const bucketNames = [
        'Audio_files',
        'Audio%20files',
        'audio_files',
        'audio-files',
        'Audio Files'
      ];

      let foundBucketName = null;
      let lastError = null;

      // Find the correct bucket name
      for (const bucketName of bucketNames) {
        try {
          console.log(`Attempting to list audio files from bucket: "${bucketName}"`);
          const { data, error } = await supabase.storage
            .from(bucketName)
            .list('', {
              limit: 100,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (!error && data !== null) {
            console.log(`✅ Successfully connected to audio bucket: "${bucketName}"`);
            foundBucketName = bucketName;
            break;
          } else if (error) {
            console.log(`❌ Error with audio bucket "${bucketName}":`, error);
            lastError = error;
          }
        } catch (err) {
          console.log(`❌ Exception with audio bucket "${bucketName}":`, err);
          lastError = err;
          continue;
        }
      }

      if (!foundBucketName) {
        console.error('❌ Could not connect to Audio_files bucket');
        console.error('Last error:', lastError);
        setAvailableAudioFiles([]);
        setLoadingAudioFiles(false);
        return;
      }

      // List all audio files
      const { data: audioFiles, error: listError } = await supabase.storage
        .from(foundBucketName)
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Error listing audio files:', listError);
        setAvailableAudioFiles([]);
        setLoadingAudioFiles(false);
        return;
      }

      if (!audioFiles || audioFiles.length === 0) {
        console.log('No audio files found in bucket');
        setAvailableAudioFiles([]);
        setLoadingAudioFiles(false);
        return;
      }

      // Filter for audio files and get public URLs
      const audioFileExtensions = ['.mp3', '.wav', '.ogg', '.webm', '.m4a', '.aac'];
      const validAudioFiles = audioFiles.filter(file => {
        const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        return audioFileExtensions.includes(extension);
      });

      console.log(`✅ Found ${validAudioFiles.length} audio files`);

      // Get public URLs for each audio file
      const audioFilesWithUrls = validAudioFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from(foundBucketName)
          .getPublicUrl(file.name);

        return {
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for display
          url: publicUrl,
          fullName: file.name
        };
      });

      setAvailableAudioFiles(audioFilesWithUrls);
      console.log('✅ Successfully loaded audio files:', audioFilesWithUrls.length);
    } catch (error) {
      console.error('❌ Unexpected error fetching audio files:', error);
      setAvailableAudioFiles([]);
    } finally {
      setLoadingAudioFiles(false);
    }
  };

  const loadAvailableBackgrounds = async () => {
    setLoadingBackgrounds(true);
    try {
      // Try different bucket name formats - the actual bucket name from Supabase
      const bucketNames = [
        'Background images',  // Most likely format
        'Background%20images', // URL-encoded
        'background-images',
        'background_images'
      ];

      let foundBucketName = null;
      let lastError = null;

      // Find the correct bucket name
      for (const bucketName of bucketNames) {
        try {
          console.log(`Attempting to list files from bucket: "${bucketName}"`);
          const { data, error } = await supabase.storage
            .from(bucketName)
            .list('', {
              limit: 100
            });

          if (!error && data !== null) {
            console.log(`✅ Successfully connected to bucket: "${bucketName}"`);
            foundBucketName = bucketName;
            break;
          } else if (error) {
            console.log(`❌ Error with bucket "${bucketName}":`, error);
            lastError = error;
          }
        } catch (err) {
          console.log(`❌ Exception with bucket "${bucketName}":`, err);
          lastError = err;
          continue;
        }
      }

      if (!foundBucketName) {
        console.error('❌ Could not connect to bucket');
        console.error('Last error:', lastError);
        setAvailableBackgrounds({});
        return;
      }

      // First, list all items in the bucket root to see what actually exists
      try {
        const { data: rootData, error: rootError } = await supabase.storage
          .from(foundBucketName)
          .list('', {
            limit: 100
          });

        if (!rootError && rootData) {
          console.log('📁 All items in bucket root:', rootData.map(f => ({ name: f.name, id: f.id })));
          // In Supabase Storage, folders are just files with no extension or files that act as prefixes
          // Let's identify potential folders (items without file extensions)
          const potentialFolders = rootData.filter(item => {
            const hasExtension = /\.\w+$/.test(item.name);
            return !hasExtension;
          });
          console.log('📁 Potential folders found:', potentialFolders.map(f => f.name));
          
          // Also try to detect folders by checking if listing them returns files
          for (const item of potentialFolders) {
            try {
              const { data: folderContents } = await supabase.storage
                .from(foundBucketName)
                .list(item.name, { limit: 5 });
              if (folderContents && folderContents.length > 0) {
                console.log(`  ✅ "${item.name}" is a folder with ${folderContents.length} items`);
              }
            } catch (e) {
              // Not a folder or can't access
            }
          }
        } else if (rootError) {
          console.error('❌ Error listing bucket root:', rootError);
        }
      } catch (err) {
        console.log('Could not list root items:', err);
      }

      // Define the folder categories
      const categories = ['Nature', 'Animals', 'Abstract', 'Sky/Universe'];
      const categoryFolders: Record<string, string[]> = {
        'Nature': ['Nature', 'nature', 'NATURE'],
        'Animals': ['Animals', 'animals', 'ANIMALS', 'Animal', 'animal', 'ANIMAL'],
        'Abstract': ['Abstract', 'abstract', 'ABSTRACT'],
        'Sky/Universe': ['Sky/Universe', 'Sky', 'Universe', 'sky', 'universe', 'Sky-Universe', 'SKY', 'UNIVERSE', 'Sky Universe', 'Sky-Universe']
      };

      const organizedImages: Record<string, string[]> = {};

      // Load images from each category folder
      for (const category of categories) {
        const folderVariants = categoryFolders[category] || [category];
        let categoryImages: string[] = [];

        for (const folderName of folderVariants) {
          try {
            console.log(`🔍 Attempting to load images from folder: "${folderName}" in category "${category}"`);
            
            // Try listing the folder - remove trailing slash if present
            const cleanFolderName = folderName.replace(/\/$/, '');
            const { data, error } = await supabase.storage
              .from(foundBucketName)
              .list(cleanFolderName, {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
              });

            if (!error && data && data.length > 0) {
              console.log(`✅ Found ${data.length} items in folder "${cleanFolderName}"`);
              console.log(`   Items:`, data.map(f => f.name));
              
              const imageFiles = data.filter(file => {
                if (!file.name) return false;
                // Check if it's an image file
                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
                // Exclude folders (folders typically don't have extensions or have metadata indicating they're folders)
                const isNotFolder = file.id && !file.name.endsWith('/');
                
                if (isImage && isNotFolder) {
                  console.log(`  ✅ Image file found: ${file.name}`);
                } else if (!isImage) {
                  console.log(`  ⚠️ Non-image file skipped: ${file.name}`);
                }
                return isImage && isNotFolder;
              });

              console.log(`📊 Filtered to ${imageFiles.length} image files from ${data.length} total items`);

              const urls = imageFiles
                .map(file => {
                  try {
                    // Construct the full path: folderName/file.name
                    const filePath = `${cleanFolderName}/${file.name}`;
                    const { data: { publicUrl } } = supabase.storage
                      .from(foundBucketName)
                      .getPublicUrl(filePath);
                    console.log(`  🔗 Generated URL for ${file.name}: ${publicUrl}`);
                    return publicUrl;
                  } catch (err) {
                    console.error(`❌ Error generating URL for ${file.name}:`, err);
                    return null;
                  }
                })
                .filter((url): url is string => url !== null);

              if (urls.length > 0) {
                categoryImages = [...categoryImages, ...urls];
                console.log(`✅ Successfully loaded ${urls.length} images from "${cleanFolderName}" folder for category "${category}"`);
                break; // Use first folder variant that has images
              } else {
                console.log(`⚠️ No valid images found in folder "${cleanFolderName}" (found ${data.length} items but none were images)`);
              }
            } else if (error) {
              console.log(`❌ Error listing folder "${cleanFolderName}":`, error.message, error);
            } else if (!data || data.length === 0) {
              console.log(`⚠️ Folder "${cleanFolderName}" exists but is empty or not accessible`);
            }
          } catch (err) {
            console.log(`❌ Exception loading from folder "${folderName}":`, err);
          }
        }

        if (categoryImages.length > 0) {
          organizedImages[category] = categoryImages;
          console.log(`✅ Category "${category}" has ${categoryImages.length} images`);
        } else {
          console.log(`⚠️ No images found for category "${category}"`);
        }
      }

      console.log(`✅ Successfully organized ${Object.values(organizedImages).flat().length} background images into ${Object.keys(organizedImages).length} categories`);
      setAvailableBackgrounds(organizedImages);
    } catch (error) {
      console.error('❌ Unexpected error fetching available backgrounds:', error);
      setAvailableBackgrounds({});
    } finally {
      setLoadingBackgrounds(false);
    }
  };

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAmbientSound(data.ambient_sound);
        setSoundVolume(data.sound_volume || 50);
        setBackgroundTheme(data.background_theme || 'nature');
        setVoiceOption(data.voice_option || 'female');
        setCustomBackgroundUrl(data.custom_background_url || null);
        setCustomAudioUrl(data.custom_audio_url || null);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBackgroundImage = async (file: File) => {
    if (!user) return;

    setUploadingBackground(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Delete old background if exists (only if it was user-uploaded, not from Background images bucket)
      if (customBackgroundUrl && customBackgroundUrl.includes('/backgrounds/')) {
        const oldPath = customBackgroundUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('backgrounds').remove([oldPath]);
      }

      // Upload to user's personal backgrounds folder
      console.log('Uploading file to path:', filePath, 'File size:', file.size, 'File type:', file.type);
      const { error: uploadError, data } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        // Provide more specific error message
        if (uploadError.message?.includes('duplicate') || uploadError.message?.includes('already exists')) {
          throw new Error('A file with this name already exists. Please rename your file and try again.');
        } else if (uploadError.message?.includes('size') || uploadError.message?.includes('limit')) {
          throw new Error('File is too large. Maximum size is 5MB.');
        } else if (uploadError.message?.includes('permission') || uploadError.message?.includes('policy')) {
          throw new Error('Permission denied. Please check your storage bucket policies.');
        } else {
          throw new Error(uploadError.message || 'Upload failed. Please check your connection and try again.');
        }
      }

      if (!data) {
        throw new Error('Upload succeeded but no data returned');
      }

      console.log('Upload successful, generating public URL for path:', data.path);
      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(data.path);

      console.log('Generated public URL:', publicUrl);
      setCustomBackgroundUrl(publicUrl);
      setBackgroundTheme('custom');
      
      // Auto-save after upload
      try {
        await savePreferencesWithUrls(publicUrl, customAudioUrl);
        console.log('✅ Background uploaded and saved successfully');
      } catch (saveError) {
        console.error('Error saving preferences after upload:', saveError);
        // Don't throw here - the upload succeeded, just the save failed
        alert('Image uploaded but failed to save preferences. Please try saving manually.');
      }
    } catch (error: any) {
      console.error('Error uploading background:', error);
      const errorMessage = error?.message || 'Failed to upload background image. Please try again.';
      alert(errorMessage);
    } finally {
      setUploadingBackground(false);
    }
  };

  const uploadAudioFile = async (file: File) => {
    if (!user) return;

    setUploadingAudio(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Delete old audio if exists
      if (customAudioUrl) {
        const oldPath = customAudioUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('audio').remove([oldPath]);
      }

      const { error: uploadError, data } = await supabase.storage
        .from('audio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(data.path);

      setCustomAudioUrl(publicUrl);
      setAmbientSound('custom');
      
      // Auto-save after upload
      await savePreferencesWithUrls(customBackgroundUrl, publicUrl);
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload audio file. Please try again.');
    } finally {
      setUploadingAudio(false);
    }
  };

  const deleteCustomBackground = async () => {
    if (!user || !customBackgroundUrl) return;

    try {
      // Only delete if it's from user's personal backgrounds folder, not from Background images bucket
      if (customBackgroundUrl.includes('/backgrounds/')) {
        const path = customBackgroundUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('backgrounds').remove([path]);
      }
      setCustomBackgroundUrl(null);
      setBackgroundTheme('nature');
      await savePreferencesWithUrls(null, customAudioUrl);
    } catch (error) {
      console.error('Error deleting background:', error);
    }
  };

  const selectBackgroundFromBucket = async (imageUrl: string) => {
    try {
      console.log('Selecting background image:', imageUrl);
      setCustomBackgroundUrl(imageUrl);
      setBackgroundTheme('custom');
      await savePreferencesWithUrls(imageUrl, customAudioUrl);
      console.log('✅ Background image selected and saved');
    } catch (error) {
      console.error('Error selecting background:', error);
      alert('Failed to apply background image. Please try again.');
    }
  };

  const deleteCustomAudio = async () => {
    if (!user || !customAudioUrl) return;

    try {
      const path = customAudioUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('audio').remove([path]);
      setCustomAudioUrl(null);
      setAmbientSound(null);
      await savePreferencesWithUrls(customBackgroundUrl, null);
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  const savePreferencesWithUrls = async (bgUrl: string | null, audioUrl: string | null) => {
    if (!user) {
      console.error('Cannot save preferences: user not authenticated');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    try {
      console.log('Saving preferences with:', { 
        bgUrl, 
        audioUrl, 
        backgroundTheme, 
        ambientSound,
        soundVolume,
        voiceOption,
        userId: user.id
      });
      
      const preferencesData = {
        user_id: user.id,
        ambient_sound: ambientSound,
        sound_volume: soundVolume,
        background_theme: backgroundTheme,
        voice_option: voiceOption,
        custom_background_url: bgUrl,
        custom_audio_url: audioUrl,
      };

      // Use upsert to handle both insert and update in one operation
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(preferencesData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving preferences:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Don't throw - just set error status
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
        return;
      }
      
      console.log('✅ Preferences saved successfully:', data);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      // Don't rethrow - we've handled the error
    }
  };

  const savePreferences = async () => {
    if (!user) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    setSaveStatus('saving');

    try {
      await savePreferencesWithUrls(customBackgroundUrl, customAudioUrl);
      // savePreferencesWithUrls handles its own error state, so we don't need to catch here
    } catch (error) {
      console.error('Unexpected error in savePreferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const resetToDefaults = async () => {
    // Delete uploaded files
    if (customBackgroundUrl && user) {
      try {
        const path = customBackgroundUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('backgrounds').remove([path]);
      } catch (error) {
        console.error('Error deleting background:', error);
      }
    }
    if (customAudioUrl && user) {
      try {
        const path = customAudioUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('audio').remove([path]);
      } catch (error) {
        console.error('Error deleting audio:', error);
      }
    }

    setAmbientSound(null);
    setSoundVolume(50);
    setBackgroundTheme('nature');
    setVoiceOption('female');
    setCustomBackgroundUrl(null);
    setCustomAudioUrl(null);

    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .delete()
          .eq('user_id', user.id);

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Error resetting preferences:', error);
      }
    }
  };

  const ambientSounds = [
    { id: 'rain', name: 'Rain', icon: CloudRain },
    { id: 'waterfall', name: 'Waterfall', icon: Droplets },
    { id: 'breeze', name: 'Breeze', icon: Wind },
    { id: 'birds', name: 'Birds', icon: Bird },
    { id: 'piano', name: 'Piano', icon: Piano },
    { id: 'flute', name: 'Flute', icon: Music },
  ];

  // Get appropriate icon for audio file based on name
  const getIconForAudioFile = (fileName: string) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('rain') || lowerName.includes('storm')) return CloudRain;
    if (lowerName.includes('waterfall') || lowerName.includes('water')) return Droplets;
    if (lowerName.includes('wind') || lowerName.includes('breeze') || lowerName.includes('air')) return Wind;
    if (lowerName.includes('bird') || lowerName.includes('chirp') || lowerName.includes('nature')) return Bird;
    if (lowerName.includes('piano') || lowerName.includes('keyboard')) return Piano;
    if (lowerName.includes('flute') || lowerName.includes('instrument') || lowerName.includes('music')) return Music;
    // Default to Music icon
    return Music;
  };

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
    { id: 'female', name: 'Female Voice', description: 'Calm, empathic, and kind' },
    { id: 'male', name: 'Male Voice', description: 'Calm, empathic, and reassuring' },
    { id: 'child', name: "Child's Voice", description: 'Gentle, kind, and non-intimidating' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-6 h-6 text-sage-600 dark:text-sage-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Ambient Music</h2>
        </div>

        <div className="space-y-6">
          <div>
            {/* Supabase Audio Files */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Songs from Supabase
                </h3>
                <button
                  onClick={loadAvailableAudioFiles}
                  disabled={loadingAudioFiles}
                  className="p-2 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh audio files"
                >
                  <RefreshCw className={`w-4 h-4 text-sage-600 dark:text-sage-400 ${loadingAudioFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {loadingAudioFiles ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading audio files...</span>
                </div>
              ) : availableAudioFiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableAudioFiles.map((audioFile, index) => {
                    const isSelected = customAudioUrl === audioFile.url && ambientSound === 'custom';
                    const IconComponent = getIconForAudioFile(audioFile.name);
                    return (
                      <button
                        key={index}
                        onClick={async () => {
                          setCustomAudioUrl(audioFile.url);
                          setAmbientSound('custom');
                          // Auto-save when selecting to enable continuous playback
                          // Use a small delay to ensure state is updated
                          await new Promise(resolve => setTimeout(resolve, 100));
                          await savePreferences();
                        }}
                        className={`p-4 rounded-[1rem] border-2 transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-blue-500 bg-sage-50 dark:bg-sage-900/20'
                            : 'border-sage-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                      >
                        <IconComponent className={`w-8 h-8 ${isSelected ? 'text-sage-600 dark:text-sage-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-2">
                          {audioFile.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed border-sage-200 dark:border-gray-600 rounded-lg">
                  <p className="font-medium mb-1">No audio files found</p>
                  <p className="text-xs">Bucket name: "Audio_files" in Supabase</p>
                  <button
                    onClick={loadAvailableAudioFiles}
                    className="mt-2 text-xs text-sage-600 dark:text-sage-400 hover:underline"
                  >
                    Click to refresh
                  </button>
                </div>
              )}
            </div>

            {/* Custom Audio Upload */}
            <div className="mt-4">
              <input
                ref={audioFileInputRef}
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10485760) {
                      alert('Audio file must be less than 10MB');
                      return;
                    }
                    uploadAudioFile(file);
                  }
                }}
              />
              <div className="border-2 border-dashed border-sage-200 dark:border-gray-600 rounded-[1rem] p-6">
                {customAudioUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Music className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">Custom Audio</p>
                        <audio src={customAudioUrl} controls className="mt-2 w-full max-w-xs">
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setAmbientSound('custom');
                          setCustomAudioUrl(customAudioUrl);
                          // Save preferences to enable continuous background playback
                          await savePreferences();
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          ambientSound === 'custom' && customAudioUrl
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Use
                      </button>
                      <button
                        onClick={deleteCustomAudio}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete custom audio"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => audioFileInputRef.current?.click()}
                    disabled={uploadingAudio}
                    className="w-full flex flex-col items-center gap-3 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingAudio ? (
                      <>
                        <Loader2 className="w-8 h-8 text-sage-600 dark:text-sage-400 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Upload Custom Audio</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            MP3, WAV, OGG, or WebM (max 10MB)
                          </p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Volume Control
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-sage-600 dark:text-sage-400">{soundVolume}%</span>
                {(ambientSound === 'custom' && customAudioUrl) || ambientSound ? (
                  <button
                    onClick={async () => {
                      setAmbientSound(null);
                      setCustomAudioUrl(null);
                      await savePreferences();
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Stop
                  </button>
                ) : null}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="w-full h-2 bg-blue-200 dark:bg-gray-600 rounded-[1rem] appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Image className="w-6 h-6 text-sage-600 dark:text-sage-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Chat Interface Background</h2>
        </div>

        <div className="space-y-6">
          {/* Supabase Background Images by Category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Your Background Images from Supabase
              </h3>
              <button
                onClick={loadAvailableBackgrounds}
                disabled={loadingBackgrounds}
                className="p-2 hover:bg-sage-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh background images"
              >
                <RefreshCw className={`w-4 h-4 text-sage-600 dark:text-sage-400 ${loadingBackgrounds ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {loadingBackgrounds ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-sage-600 dark:text-sage-400 animate-spin" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading backgrounds...</span>
              </div>
            ) : Object.keys(availableBackgrounds).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(availableBackgrounds).map(([category, images]) => (
                  <div key={category}>
                    <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((imageUrl, index) => {
                        const isSelected = customBackgroundUrl === imageUrl && backgroundTheme === 'custom';
                        return (
                          <button
                            key={`${category}-${index}`}
                            onClick={() => selectBackgroundFromBucket(imageUrl)}
                            className={`relative rounded-[1rem] overflow-hidden border-4 transition-all group ${
                              isSelected
                                ? 'border-blue-500 shadow-lg ring-2 ring-blue-400'
                                : 'border-sage-200 dark:border-gray-600 hover:border-blue-400'
                            }`}
                          >
                            <img 
                              src={imageUrl} 
                              alt={`${category} background ${index + 1}`} 
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                console.error('Error loading image:', imageUrl);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                              isSelected
                                ? 'bg-blue-600/40'
                                : 'bg-black/20 group-hover:bg-black/30'
                            }`}>
                              {isSelected && (
                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                  Selected
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium mb-1">No background images found</p>
                <p className="text-sm mb-3">Please check:</p>
                <ul className="text-sm space-y-1 text-left max-w-md mx-auto mb-4">
                  <li>• Bucket name is "Background images" in Supabase</li>
                  <li>• Bucket is set to public or has proper RLS policies</li>
                  <li>• Images are organized in folders: "Nature", "Animals", "Abstract", "Sky/Universe"</li>
                  <li>• Check browser console for detailed error messages</li>
                </ul>
                <button
                  onClick={loadAvailableBackgrounds}
                  className="px-4 py-2 bg-sage-100 dark:bg-gray-700 text-sage-700 dark:text-gray-300 rounded-lg hover:bg-sage-200 dark:hover:bg-gray-600 transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Custom Background Upload */}
          <div>
            <input
              ref={backgroundFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5242880) {
                    alert('Image must be less than 5MB');
                    return;
                  }
                  uploadBackgroundImage(file);
                }
              }}
            />
            {customBackgroundUrl ? (
              <div className="border-2 border-sage-200 dark:border-gray-600 rounded-[1rem] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Custom Background</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setBackgroundTheme('custom');
                        setCustomBackgroundUrl(customBackgroundUrl);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        backgroundTheme === 'custom'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Use
                    </button>
                    <button
                      onClick={deleteCustomBackground}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete custom background"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <img 
                  src={customBackgroundUrl} 
                  alt="Custom background" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ) : (
              <button
                onClick={() => backgroundFileInputRef.current?.click()}
                disabled={uploadingBackground}
                className="w-full border-2 border-dashed border-sage-200 dark:border-gray-600 rounded-[1rem] p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingBackground ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Image className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Upload Personal Image</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      JPEG, PNG, WebP, or GIF (max 5MB)
                    </p>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-sage-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Mic className="w-6 h-6 text-sage-600 dark:text-sage-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Audio Output Voice</h2>
        </div>

        <div className="space-y-3">
          {voiceOptions.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setVoiceOption(voice.id)}
              className={`w-full p-4 rounded-[1rem] border-2 transition-all flex items-center justify-between ${
                voiceOption === voice.id
                  ? 'border-blue-500 bg-sage-50 dark:bg-sage-900/20'
                  : 'border-sage-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 dark:text-white lowercase">{voice.name}</h3>
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

        <div className="mt-6 p-4 bg-sage-50 dark:bg-gray-700 rounded-[1rem]">
          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
            <Volume2 className="w-5 h-5 text-sage-600 dark:text-sage-400 flex-shrink-0 mt-0.5" />
            <span>
              Voice options provide empathic and calming audio responses from NIRA during your conversations.
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 animate-fade-in">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Error saving settings</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetToDefaults}
            disabled={saveStatus === 'saving'}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-[1rem] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Defaults
          </button>
          <button
            onClick={savePreferences}
            disabled={saveStatus === 'saving'}
            className="px-6 py-3 bg-gradient-to-r from-sage-600 to-mint-600 text-white rounded-[1rem] hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
