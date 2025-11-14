import { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Bell, Moon, Sun, Monitor, Shield, Download, Trash2, Award, MessageSquare, BookOpen, Target, Flame, Camera, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import TreeRing from '../components/TreeRing';

interface ProfileData {
  full_name: string;
  email: string;
  pronouns: string;
  location: string;
  avatar_url: string | null;
  member_since: string;
}

interface Statistics {
  member_days: number;
  conversations: number;
  journal_entries: number;
  current_streak: number;
  goals_completed: number;
  total_goals: number;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: user?.email || '',
    pronouns: '',
    location: '',
    avatar_url: null,
    member_since: new Date().toISOString()
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [anonymousSharing, setAnonymousSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statistics: Statistics = {
    member_days: 45,
    conversations: 127,
    journal_entries: 23,
    current_streak: 7,
    goals_completed: 5,
    total_goals: 12
  };

  const achievements = [
    { id: 1, name: 'First Steps', icon: '🌱', earned: true },
    { id: 2, name: 'Week Warrior', icon: '🔥', earned: true },
    { id: 3, name: 'Conversation Starter', icon: '💬', earned: true }
  ];

  const recentActivity = [
    { type: 'journal', text: 'Last journal entry', time: '2 hours ago' },
    { type: 'chat', text: 'Last chat session', time: '5 hours ago' },
    { type: 'milestone', text: 'Completed "Daily Check-in"', time: 'Yesterday' }
  ];

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: user.email || '',
        pronouns: data.pronouns || '',
        location: data.location || '',
        avatar_url: data.avatar_url,
        member_since: data.created_at
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!profile.full_name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          pronouns: profile.pronouns,
          location: profile.location,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    }
  };

  const handleExportData = async () => {
    alert('Your data export has been initiated. You will receive an email shortly.');
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    alert('Account deletion requested. This feature will be implemented with proper safeguards.');
    setShowDeleteConfirm(false);
  };

  const getMemberDays = () => {
    const memberSince = new Date(profile.member_since);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - memberSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-gray-900 transition-colors relative overflow-hidden">
      <div className="tree-ring-profile-background">
        <TreeRing ringCount={7} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all hover:scale-105 group"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-sage-600 dark:text-sage-400 group-hover:text-[#187E5F] dark:group-hover:text-sage-300 transition-colors" />
          </button>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#315545] rounded-xl border border-[#E8F5F0] dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Profile Information
              </h2>

              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-[120px] h-[120px] rounded-full border-4 border-[#E8F5F0] dark:border-gray-600 overflow-hidden bg-sage-100 dark:bg-gray-700 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-sage-400 dark:text-gray-500" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#187E5F] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0B5844] transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-sage-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F] transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-sage-200 dark:border-gray-600 bg-sage-50 dark:bg-gray-800">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-sage-200 dark:border-gray-600 bg-sage-50 dark:bg-gray-800">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(profile.member_since).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pronouns
                  </label>
                  <select
                    value={profile.pronouns}
                    onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-sage-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F] transition-colors"
                  >
                    <option value="">Select pronouns</option>
                    <option value="she/her">She/Her</option>
                    <option value="he/him">He/Him</option>
                    <option value="they/them">They/Them</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sage-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F] transition-colors"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#315545] rounded-xl border border-[#E8F5F0] dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Preferences
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-[#187E5F] bg-sage-50 dark:bg-gray-700'
                          : 'border-sage-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-[#187E5F]" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-[#187E5F] bg-sage-50 dark:bg-gray-700'
                          : 'border-sage-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-[#187E5F]" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('auto')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        theme === 'auto'
                          ? 'border-[#187E5F] bg-sage-50 dark:bg-gray-700'
                          : 'border-sage-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Monitor className="w-5 h-5 text-[#187E5F]" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Auto</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Notifications
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50 dark:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-[#187E5F]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          emailNotifications ? 'bg-[#187E5F]' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            emailNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50 dark:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-[#187E5F]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Daily Reminder</span>
                      </div>
                      <button
                        onClick={() => setDailyReminder(!dailyReminder)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          dailyReminder ? 'bg-[#187E5F]' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            dailyReminder ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {dailyReminder && (
                      <div className="pl-8">
                        <input
                          type="time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-sage-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#187E5F]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Privacy
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#187E5F]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Anonymous Sharing</span>
                    </div>
                    <button
                      onClick={() => setAnonymousSharing(!anonymousSharing)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        anonymousSharing ? 'bg-[#187E5F]' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          anonymousSharing ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#315545] rounded-xl border border-[#E8F5F0] dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Statistics
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-sage-50 dark:bg-gray-700">
                  <Calendar className="w-5 h-5 text-[#187E5F] mb-2" />
                  <div className="text-[24px] font-bold text-[#187E5F]">{getMemberDays()}</div>
                  <div className="text-[12px] text-gray-600 dark:text-gray-400 text-center">Member Days</div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-sage-50 dark:bg-gray-700">
                  <MessageSquare className="w-5 h-5 text-[#187E5F] mb-2" />
                  <div className="text-[24px] font-bold text-[#187E5F]">{statistics.conversations}</div>
                  <div className="text-[12px] text-gray-600 dark:text-gray-400 text-center">Conversations</div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-sage-50 dark:bg-gray-700">
                  <BookOpen className="w-5 h-5 text-[#187E5F] mb-2" />
                  <div className="text-[24px] font-bold text-[#187E5F]">{statistics.journal_entries}</div>
                  <div className="text-[12px] text-gray-600 dark:text-gray-400 text-center">Journal Entries</div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-sage-50 dark:bg-gray-700">
                  <Flame className="w-5 h-5 text-[#187E5F] mb-2" />
                  <div className="text-[24px] font-bold text-[#187E5F]">{statistics.current_streak} 🔥</div>
                  <div className="text-[12px] text-gray-600 dark:text-gray-400 text-center">Current Streak</div>
                </div>

                <div className="col-span-2 flex flex-col items-center justify-center p-4 rounded-lg bg-sage-50 dark:bg-gray-700">
                  <Target className="w-5 h-5 text-[#187E5F] mb-2" />
                  <div className="text-[24px] font-bold text-[#187E5F]">
                    {statistics.goals_completed}/{statistics.total_goals}
                  </div>
                  <div className="text-[12px] text-gray-600 dark:text-gray-400 text-center">Goals Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#315545] rounded-xl border border-[#E8F5F0] dark:border-gray-700 p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Achievements
                </h2>
                <button className="text-sm font-medium text-[#187E5F] hover:text-[#0B5844] transition-colors">
                  View All
                </button>
              </div>

              <div className="flex gap-4 justify-center">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#187E5F] to-[#0B5844] flex items-center justify-center text-2xl shadow-lg">
                      {achievement.icon}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[80px]">
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#315545] rounded-xl border border-[#E8F5F0] dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>

              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {activity.type === 'journal' && <BookOpen className="w-4 h-4 text-[#187E5F]" />}
                    {activity.type === 'chat' && <MessageSquare className="w-4 h-4 text-[#187E5F]" />}
                    {activity.type === 'milestone' && <Award className="w-4 h-4 text-[#187E5F]" />}
                    <div className="flex-1">
                      <p className="text-[13px] text-gray-700 dark:text-gray-300">{activity.text}</p>
                      <p className="text-[12px] text-gray-500 dark:text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full h-[40px] bg-[#187E5F] hover:bg-[#0B5844] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>

              <button
                onClick={handleExportData}
                className="w-full h-[40px] border border-sage-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export My Data
              </button>

              <button
                onClick={handleDeleteAccount}
                className={`w-full h-[40px] border-2 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  showDeleteConfirm
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {showDeleteConfirm ? 'Click again to confirm' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
