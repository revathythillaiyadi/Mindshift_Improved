import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Mic, Type, Save, Trash2, Loader2, Maximize, Edit, X, Zap } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Global Variable Setup (Mandatory for Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Mock MediaRecorder for environment compatibility and visual representation
// In a real application, you would implement the actual MediaRecorder API here.
const mockMediaRecorder = {
    start: () => console.log('Mock Recording Started'),
    stop: () => console.log('Mock Recording Stopped'),
    ondataavailable: () => {},
    state: 'inactive',
};
window.MediaRecorder = window.MediaRecorder || function() { return mockMediaRecorder; };

const JournalArea = () => {
    // --- State Management ---
    const [title, setTitle] = useState('');
    const [rawTextContent, setRawTextContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
    const [statusMessage, setStatusMessage] = useState('');
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);

    // Mock timer for recording
    const intervalRef = useRef(null);

    // --- Firebase/Firestore Initialization (Mandatory) ---
    useEffect(() => {
        if (Object.keys(firebaseConfig).length === 0) {
            console.error("Firebase config is missing. Cannot initialize Firestore.");
            return;
        }

        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setUserId(user.uid);
                console.log("Authenticated user:", user.uid);
            } else if (initialAuthToken) {
                try {
                    const credentials = await signInWithCustomToken(firebaseAuth, initialAuthToken);
                    setUserId(credentials.user.uid);
                    console.log("Signed in with custom token.");
                } catch (error) {
                    console.error("Custom token sign-in failed. Falling back to anonymous.", error);
                    signInAnonymously(firebaseAuth).then(anonCred => setUserId(anonCred.user.uid));
                }
            } else {
                signInAnonymously(firebaseAuth).then(anonCred => setUserId(anonCred.user.uid));
            }
        });

        // Set a default title on load
        if (!title) {
            setTitle(`Journal Entry - ${new Date().toLocaleString()}`);
        }

        return () => unsubscribe();
    }, []);

    // --- Voice Recording Logic (Mocked) ---
    const startRecording = () => {
        if (isProcessingVoice) return;
        setRecordingTime(0);
        setIsRecording(true);
        setStatusMessage('Recording... Speak clearly.');

        intervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        // Mock MediaRecorder.start()
    };

    const stopRecording = () => {
        if (!isRecording) return;
        setIsRecording(false);
        clearInterval(intervalRef.current);
        setIsProcessingVoice(true);
        setStatusMessage('Processing audio (Mock API call)...');

        // Mock Voice-to-Text API Call
        setTimeout(() => {
            const mockText = "Today was a day of contemplation. I spent the morning feeling anxious, but a walk outside, with the wind on my face, helped reframe my perspective. I need to remember to seek simple joys, like the color of the emerald grass against the bright blue sky.";
            
            setRawTextContent(prev => 
                prev ? `${prev}\n\n[Voice Entry]\n${mockText}` : mockText
            );
            setIsProcessingVoice(false);
            setStatusMessage('Voice-to-Text complete. Review and save your entry.');
        }, 3000); // Simulate network delay
    };

    // --- Firestore Save Logic ---
    const handleSaveEntry = async () => {
        if (!rawTextContent.trim() || !userId || !db) {
            setStatusMessage('Cannot save empty entry. Please write or record content.');
            return;
        }

        setIsSaving(true);
        setStatusMessage('Saving entry...');

        try {
            // Firestore data path: /artifacts/{appId}/users/{userId}/journal_entries
            const collectionPath = `artifacts/${appId}/users/${userId}/journal_entries`;

            await addDoc(collection(db, collectionPath), {
                title: title.trim() || `Untitled Entry - ${new Date().toLocaleDateString()}`,
                raw_text_content: rawTextContent.trim(),
                user_id: userId,
                created_at: serverTimestamp(),
            });

            setStatusMessage('Entry saved successfully!');
            // Reset form or navigate away
            setTitle(`Journal Entry - ${new Date().toLocaleString()}`);
            setRawTextContent('');
            setTimeout(() => setStatusMessage(''), 3000);

        } catch (e) {
            console.error("Error adding document: ", e);
            setStatusMessage(`Error saving entry: ${e.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to format recording time
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    // Determine if Save button should be disabled
    const isActionDisabled = isRecording || isSaving || isProcessingVoice;

    return (
        <div className="flex flex-col h-full p-4 md:p-8 bg-gray-50 dark:bg-[#1e2936] min-h-screen transition-all">
            <div className="max-w-3xl w-full mx-auto">
                {/* Header and Title Input */}
                <header className="mb-8 flex justify-between items-center border-b border-emerald-200/50 pb-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">New Entry</h1>
                    </div>
                    {userId && (
                         <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] md:max-w-none" title={`User ID: ${userId}`}>
                            User: {userId}
                        </span>
                    )}
                </header>

                <div className="mb-6 p-4 bg-white dark:bg-[#253240] rounded-xl shadow-lg">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={`Journal Entry - ${new Date().toLocaleString()}`}
                        className="w-full text-xl font-bold text-gray-800 dark:text-white bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-600"
                        disabled={isActionDisabled}
                    />
                </div>

                {/* Status Message Area */}
                {statusMessage && (
                    <div className="mb-4 text-center py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 transition-opacity">
                        <p className="text-sm font-medium">{statusMessage}</p>
                    </div>
                )}

                {/* Input Method Switch */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => setInputMode('text')}
                        disabled={isActionDisabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md ${
                            inputMode === 'text'
                                ? 'bg-emerald-600 text-white shadow-emerald-400/50'
                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-[#253240] dark:text-gray-300 dark:hover:bg-[#2b3a4a]'
                        } disabled:opacity-50`}
                    >
                        <Type className="w-5 h-5" /> Text Input
                    </button>
                    <button
                        onClick={() => setInputMode('voice')}
                        disabled={isActionDisabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md ${
                            inputMode === 'voice'
                                ? 'bg-emerald-600 text-white shadow-emerald-400/50'
                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-[#253240] dark:text-gray-300 dark:hover:bg-[#2b3a4a]'
                        } disabled:opacity-50`}
                    >
                        <Mic className="w-5 h-5" /> Voice Input
                    </button>
                </div>

                {/* Text Input Area */}
                <div className="mb-6">
                    <textarea
                        value={rawTextContent}
                        onChange={(e) => setRawTextContent(e.target.value)}
                        placeholder="Start typing your thoughts here, or switch to voice input above."
                        rows={15}
                        className="w-full p-6 text-base rounded-xl border border-gray-300 dark:border-[#283647] bg-white dark:bg-[#253240] text-gray-700 dark:text-gray-200 resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 shadow-inner transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        disabled={isActionDisabled}
                        style={{ display: inputMode === 'text' ? 'block' : 'none' }}
                    />

                    {/* Voice Input Interface */}
                    <div
                        className="p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center min-h-[350px] transition-all"
                        style={{ display: inputMode === 'voice' ? 'flex' : 'none' }}
                    >
                        {isProcessingVoice ? (
                            <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="font-semibold">Converting speech to text...</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This usually takes a moment.</p>
                            </div>
                        ) : isRecording ? (
                            <div className="flex flex-col items-center">
                                {/* Visual Waveform Indicator */}
                                <div className="flex items-end gap-1 mb-6 h-12">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 rounded-full bg-red-500 transition-all duration-300 ease-in-out`}
                                            style={{
                                                height: `${10 + Math.random() * 40}px`,
                                                animation: `waveform-pulse ${0.5 + Math.random() * 0.5}s infinite alternate`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="text-3xl font-mono font-bold text-red-600 dark:text-red-400 mb-6">
                                    {formatTime(recordingTime)}
                                </div>
                                <button
                                    onClick={stopRecording}
                                    className="px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-500/50 flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" /> Stop Recording
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={startRecording}
                                    className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-105 transition-all mb-4"
                                    disabled={isActionDisabled}
                                >
                                    <Mic className="w-8 h-8" />
                                </button>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tap to start voice journaling</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your words will be converted into text automatically.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setRawTextContent('')}
                        disabled={isActionDisabled || !rawTextContent.trim()}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-[#253240] hover:bg-gray-300 dark:hover:bg-[#2b3a4a] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" /> Clear
                    </button>
                    <button
                        onClick={handleSaveEntry}
                        disabled={isActionDisabled || !rawTextContent.trim()}
                        className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                            !isActionDisabled && rawTextContent.trim()
                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40 hover:scale-[1.02]'
                                : 'bg-gray-400 dark:bg-gray-600 opacity-60 cursor-not-allowed'
                        } flex items-center gap-2`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>
            
            {/* Tailwind Keyframes for Voice Animation */}
            <style jsx="true">{`
                @keyframes waveform-pulse {
                    0% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1.5); }
                    100% { transform: scaleY(0.5); }
                }
            `}</style>
        </div>
    );
};

export default JournalArea;