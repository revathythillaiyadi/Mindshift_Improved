import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserPreferences {
  ambient_sound: string | null;
  sound_volume: number;
  background_theme: string;
  voice_option: string;
  custom_background_url: string | null;
  custom_audio_url: string | null;
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Support child voice now
          const voiceOption = data.voice_option || 'female';
          
          setPreferences({
            ambient_sound: data.ambient_sound,
            sound_volume: data.sound_volume || 50,
            background_theme: data.background_theme || 'nature',
            voice_option: voiceOption,
            custom_background_url: data.custom_background_url || null,
            custom_audio_url: data.custom_audio_url || null,
          });
        } else {
          // Default preferences
          setPreferences({
            ambient_sound: null,
            sound_volume: 50,
            background_theme: 'nature',
            voice_option: 'female',
            custom_background_url: null,
            custom_audio_url: null,
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Set defaults on error
        setPreferences({
          ambient_sound: null,
          sound_volume: 50,
          background_theme: 'nature',
          voice_option: 'female',
          custom_background_url: null,
          custom_audio_url: null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();

    // Subscribe to changes in user_preferences table for real-time updates
    const channel = supabase
      .channel(`user_preferences_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Preferences changed via subscription:', payload);
          loadPreferences();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { preferences, loading };
}

