import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase Configuration (using global variables if available, otherwise fallback)
const firebaseConfig = window.__firebase_config || {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: window.__app_id || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// CSS Variables for styling
const styles = `
  :root {
    --color-deep-emerald: #0d9488;
    --color-neon-teal: #14b8a6;
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-elevated: #ffffff;
    --text-primary: #1e293b;
    --border-color: #e2e8f0;
  }
  
  [data-theme="dark"] {
    --color-deep-emerald: #14b8a6;
    --color-neon-teal: #5eead4;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-elevated: #334155;
    --text-primary: #f1f5f9;
    --border-color: #475569;
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&family=Permanent+Marker&display=swap');
  
  .handwriting {
    font-family: 'Indie Flower', cursive;
  }
  
  .notebook-page {
    background-image: 
      repeating-linear-gradient(
        transparent,
        transparent 31px,
        var(--border-color) 31px,
        var(--border-color) 32px
      );
    background-color: var(--bg-elevated);
    padding: 40px 30px;
    min-height: 500px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-left: 3px solid var(--border-color);
    position: relative;
  }
  
  .notebook-page::before {
    content: '';
    position: absolute;
    left: 50px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
  }
`;

// Main App Component
function TheScribe() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // New Entry State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Edit/Delete Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await loadEntries(user.uid);
      } else {
        try {
          const result = await signInAnonymously(auth);
          setUserId(result.user.uid);
          await loadEntries(result.user.uid);
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load entries from Firestore
  const loadEntries = async (uid) => {
    try {
      const appId = window.__app_id || 'default-app';
      const entriesRef = collection(db, `artifacts/${appId}/users/${uid}/journal_entries`);
      // Fetch without orderBy (as per requirements)
      const snapshot = await getDocs(entriesRef);
      
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by created_at (newest first) - in-memory sorting after fetching
      entriesData.sort((a, b) => {
        const aTime = a.created_at?.toDate?.() || new Date(0);
        const bTime = b.created_at?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      
      setEntries(entriesData);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  // Save new entry
  const saveEntry = async () => {
    if (!userId || !newContent.trim()) return;
    
    try {
      const appId = window.__app_id || 'default-app';
      const title = newTitle.trim() || new Date().toLocaleString();
      
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/journal_entries`), {
        user_id: userId,
        title: title,
        raw_text_content: newContent,
        created_at: serverTimestamp()
      });
      
      // Reset form
      setNewTitle('');
      setNewContent('');
      setInputMode('text');
      
      // Reload entries and go to dashboard
      await loadEntries(userId);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  // Update entry
  const updateEntry = async () => {
    if (!userId || !currentEntryId) return;
    
    try {
      const appId = window.__app_id || 'default-app';
      const entryRef = doc(db, `artifacts/${appId}/users/${userId}/journal_entries`, currentEntryId);
      
      await updateDoc(entryRef, {
        title: editTitle,
        raw_text_content: editContent
      });
      
      setShowEditModal(false);
      await loadEntries(userId);
      
      // Reload current entry
      const updatedEntry = entries.find(e => e.id === currentEntryId);
      if (updatedEntry) {
        setEditTitle(updatedEntry.title);
        setEditContent(updatedEntry.raw_text_content);
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry. Please try again.');
    }
  };

  // Delete entry
  const deleteEntry = async () => {
    if (!userId || !currentEntryId) return;
    
    try {
      const appId = window.__app_id || 'default-app';
      const entryRef = doc(db, `artifacts/${appId}/users/${userId}/journal_entries`, currentEntryId);
      
      await deleteDoc(entryRef);
      setShowDeleteModal(false);
      await loadEntries(userId);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  // Mock voice recording
  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Mock recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Simulate 3-second recording
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      setRecordingTime(0);
      
      // Mock transcribed text (simulating AI conversion)
      const mockTranscription = `[Voice recording transcribed at ${new Date().toLocaleTimeString()}]\n\nI've been reflecting on today's experiences and feeling grateful for the small moments of peace I found. The morning walk was particularly refreshing, and I noticed how the simple act of being present can transform ordinary moments into something meaningful.`;
      
      setNewContent(prev => prev + (prev ? '\n\n' : '') + mockTranscription);
      setInputMode('text');
    }, 3000);
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get current entry
  const currentEntry = entries.find(e => e.id === currentEntryId);

  // Render based on current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">The Scribe</h1>
                <p className="text-sm opacity-70">User ID: {userId || 'Loading...'}</p>
              </div>
              
              <button
                onClick={() => {
                  setNewTitle('');
                  setNewContent('');
                  setInputMode('text');
                  setCurrentView('new');
                }}
                className="w-full py-4 px-6 rounded-lg font-semibold text-white mb-8 transition-all hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-deep-emerald)' }}
              >
                + New Entry
              </button>
              
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center py-8">Loading entries...</p>
                ) : entries.length === 0 ? (
                  <p className="text-center py-8 opacity-70">No entries yet. Create your first entry!</p>
                ) : (
                  entries.map(entry => (
                    <div
                      key={entry.id}
                      onClick={() => {
                        setCurrentEntryId(entry.id);
                        setEditTitle(entry.title);
                        setEditContent(entry.raw_text_content || '');
                        setCurrentView('view');
                      }}
                      className="p-6 rounded-lg cursor-pointer transition-all hover:shadow-md"
                      style={{ 
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <h2 className="text-xl font-semibold mb-2">{entry.title}</h2>
                      <p className="text-sm opacity-70">{formatDate(entry.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
        
      case 'new':
        return (
          <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mb-4 text-sm opacity-70 hover:opacity-100"
                  style={{ color: 'var(--color-deep-emerald)' }}
                >
                  ← Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold">New Entry</h1>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter title (defaults to date/time)"
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setInputMode('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      inputMode === 'text' ? 'text-white' : 'opacity-70'
                    }`}
                    style={{ 
                      backgroundColor: inputMode === 'text' ? 'var(--color-deep-emerald)' : 'var(--bg-elevated)',
                      border: `1px solid var(--border-color)`
                    }}
                  >
                    Text Input
                  </button>
                  <button
                    onClick={() => setInputMode('voice')}
                    disabled={isRecording}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      inputMode === 'voice' ? 'text-white' : 'opacity-70'
                    } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ 
                      backgroundColor: inputMode === 'voice' ? 'var(--color-deep-emerald)' : 'var(--bg-elevated)',
                      border: `1px solid var(--border-color)`
                    }}
                  >
                    Voice Input
                  </button>
                </div>
                
                {inputMode === 'text' ? (
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Start writing your thoughts..."
                    className="w-full p-4 rounded-lg border min-h-[400px] resize-y"
                    style={{ 
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 rounded-lg border text-center" style={{ 
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-color)'
                    }}>
                      {!isRecording ? (
                        <button
                          onClick={startVoiceRecording}
                          className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:shadow-lg"
                          style={{ backgroundColor: 'var(--color-deep-emerald)' }}
                        >
                          🎤 Start Recording
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-3 h-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-deep-emerald)' }}></div>
                            <div className="w-3 h-12 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-deep-emerald)', animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-16 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-deep-emerald)', animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-12 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-deep-emerald)', animationDelay: '0.3s' }}></div>
                            <div className="w-3 h-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-deep-emerald)', animationDelay: '0.4s' }}></div>
                          </div>
                          <p className="text-lg font-semibold">Recording... {recordingTime}s</p>
                          <p className="text-sm opacity-70">Processing audio...</p>
                        </div>
                      )}
                    </div>
                    
                    {newContent && (
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Transcribed text will appear here..."
                        className="w-full p-4 rounded-lg border min-h-[200px] resize-y"
                        style={{ 
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={saveEntry}
                  disabled={!newContent.trim()}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-deep-emerald)' }}
                >
                  Save Entry
                </button>
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setNewTitle('');
                    setNewContent('');
                  }}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'view':
        if (!currentEntry) {
          return (
            <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <div className="max-w-4xl mx-auto">
                <p>Entry not found</p>
                <button onClick={() => setCurrentView('dashboard')} className="mt-4">Back to Dashboard</button>
              </div>
            </div>
          );
        }
        
        return (
          <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mb-4 text-sm opacity-70 hover:opacity-100"
                  style={{ color: 'var(--color-deep-emerald)' }}
                >
                  ← Back to Dashboard
                </button>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{currentEntry.title}</h1>
                    <p className="text-sm opacity-70">{formatDate(currentEntry.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditTitle(currentEntry.title);
                        setEditContent(currentEntry.raw_text_content || '');
                        setShowEditModal(true);
                      }}
                      className="px-4 py-2 rounded-lg font-medium transition-all"
                      style={{ 
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 rounded-lg font-medium text-white transition-all"
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="notebook-page handwriting" style={{ fontSize: '18px', lineHeight: '32px' }}>
                {currentEntry.raw_text_content || 'No content'}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div data-theme={darkMode ? 'dark' : 'light'}>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        
        {loading ? (
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
          </div>
        ) : (
          renderView()
        )}
        
        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full p-6 rounded-lg" style={{ 
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)'
            }}>
              <h2 className="text-2xl font-bold mb-4">Edit Entry</h2>
              
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 rounded-lg border min-h-[300px] resize-y"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={updateEntry}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: 'var(--color-deep-emerald)' }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full p-6 rounded-lg" style={{ 
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)'
            }}>
              <h2 className="text-2xl font-bold mb-4">Delete Entry</h2>
              <p className="mb-6">Are you sure you want to delete this entry? This action cannot be undone.</p>
              
              <div className="flex gap-4">
                <button
                  onClick={deleteEntry}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TheScribe;

