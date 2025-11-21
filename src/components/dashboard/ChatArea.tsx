import { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Smile, Send, Volume2, VolumeX, Brain, Wind, Heart, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { createChatMessage, getChatHistory } from '../../lib/database';
import { sendUserMessageToN8N, sendAIResponseToN8N } from '../../lib/n8n';
import { speakText, stopSpeech, isSpeechSynthesisAvailable, muteVoiceAgent, unmuteVoiceAgent, isVoiceAgentMutedState } from '../../lib/voice';
import { muteBackgroundAudio, unmuteBackgroundAudio, isBackgroundAudioMuted } from '../../lib/audioDucking';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatArea() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { preferences } = useUserPreferences();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [typingMessages, setTypingMessages] = useState<Set<string>>(new Set());
  const [isThinking, setIsThinking] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(() => {
    return !localStorage.getItem('voice-tooltip-seen');
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    return localStorage.getItem('voice-agent-muted') === 'true';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interimTranscriptRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');
  const baseInputTextRef = useRef<string>('');
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>(() => {
    // Generate or retrieve session ID
    const stored = sessionStorage.getItem('chat-session-id');
    if (stored) return stored;
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('chat-session-id', newSessionId);
    return newSessionId;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isInitialLoad) {
      // Throttle scroll updates to prevent performance issues during typing
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        // Only auto-scroll if user is near the bottom (within 100px)
        const chatContainer = messagesEndRef.current?.parentElement;
        if (chatContainer) {
          const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
          if (isNearBottom) {
            scrollToBottom();
          }
        } else {
          scrollToBottom();
        }
      }, 100); // Throttle scroll updates
    }
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, isInitialLoad]);

  // Load chat history from database
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;

      try {
        const history = await getChatHistory(user.id, 50);
        
        if (history.length > 0) {
          // Convert database records to Message format
          const loadedMessages: Message[] = history.map((record) => ({
            id: record.id,
            type: record.speaker === 'user' ? 'user' : 'bot',
            text: record.message,
            timestamp: new Date(record.timestamp),
          }));
          
          setMessages(loadedMessages);
          setIsInitialLoad(false);
        } else {
          // No history, show initial message
          showInitialMessage();
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        showInitialMessage();
      }
    };

    const showInitialMessage = () => {
      const initialMessageId = '1';
      const fullText = "Hello! I'm NIRA - Neural Insight and Reframing Assistant. I'm your compassionate companion for mental wellness, here to help you reframe your thoughts and navigate your emotions. How can I help you today?";

      const botResponse: Message = {
        id: initialMessageId,
        type: 'bot',
        text: '',
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages([botResponse]);
      setTypingMessages(new Set([initialMessageId]));

      // Start speaking immediately as typing begins (only if not muted)
      // Use a short delay to ensure voices are loaded and user interaction has occurred
      if (isSpeechSynthesisAvailable() && !isVoiceMuted) {
        const voiceOption = preferences?.voice_option || 'female';
        setTimeout(() => {
          console.log(`🔊 Starting to speak initial message with ${voiceOption} voice while typing`);
          speakText(fullText, voiceOption).catch(error => {
            console.error('Error speaking initial message:', error);
          });
        }, 500); // Short delay to ensure everything is ready, but start speaking as typing happens
      } else if (isVoiceMuted) {
        console.log('🔇 Voice agent is muted, skipping initial message');
      } else {
        console.warn('Speech synthesis not available');
      }

      let currentIndex = 0;
      typingIntervalRef.current = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setMessages([{
            ...botResponse,
            text: fullText.slice(0, currentIndex),
          }]);
          currentIndex++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          setMessages([{
            ...botResponse,
            text: fullText,
            isTyping: false,
          }]);
          setTypingMessages(new Set());
          setTimeout(() => setIsInitialLoad(false), 500);
          // Voice is already speaking from the start of typing animation
        }
      }, 50);
    };

    loadChatHistory();
  }, [user, preferences?.voice_option]);

  // Audio playback is now handled at Dashboard level to persist across views
  // This useEffect is kept for backward compatibility but audio won't play here

  // Sync mute states on mount
  useEffect(() => {
    if (isVoiceMuted) {
      muteVoiceAgent();
    } else {
      unmuteVoiceAgent();
    }
    
    // Check background audio mute state
    const checkMusicMuted = () => {
      setIsMusicMuted(isBackgroundAudioMuted());
    };
    checkMusicMuted();
    const interval = setInterval(checkMusicMuted, 500);
    
    return () => {
      clearInterval(interval);
    };
  }, [isVoiceMuted]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
        recognitionRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Stop any ongoing speech
      stopSpeech();
    };
  }, []);

  // Start audio recording with Web Speech API
  const startRecording = () => {
    try {
      // Check for Web Speech API support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingTime(0);
        interimTranscriptRef.current = '';
        finalTranscriptRef.current = '';
        baseInputTextRef.current = inputText; // Store the current input text as base
        
        // Start timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        if (showVoiceTooltip) {
          localStorage.setItem('voice-tooltip-seen', 'true');
          setShowVoiceTooltip(false);
        }
      };

      recognition.onresult = (event: any) => {
        let newInterimTranscript = '';
        let newFinalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newFinalTranscript += transcript + ' ';
            // Add to final transcript ref
            finalTranscriptRef.current += transcript + ' ';
          } else {
            newInterimTranscript += transcript;
          }
        }

        // Update interim transcript
        interimTranscriptRef.current = newInterimTranscript;
        
        // Update input: base + all final transcripts + current interim
        const fullText = baseInputTextRef.current + 
                        (baseInputTextRef.current && finalTranscriptRef.current ? ' ' : '') + 
                        finalTranscriptRef.current.trim() + 
                        (finalTranscriptRef.current.trim() && newInterimTranscript ? ' ' : '') + 
                        newInterimTranscript;
        
        setInputText(fullText);
        
        // Reset pause timeout - user is still speaking
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
        
        // Set timeout to auto-send after 2 seconds of pause (no new speech)
        if (newFinalTranscript.trim() || newInterimTranscript.trim()) {
          pauseTimeoutRef.current = setTimeout(() => {
            // Auto-send if we have final transcripts
            const textToSend = baseInputTextRef.current + 
                             (baseInputTextRef.current && finalTranscriptRef.current ? ' ' : '') + 
                             finalTranscriptRef.current.trim();
            if (textToSend.trim() && !isThinking) {
              // stopRecording will handle auto-send
              stopRecording(true);
            }
          }, 2000); // 2 seconds of pause
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // User stopped speaking, continue listening
          return;
        }
        
        if (event.error === 'aborted') {
          // User manually stopped
          return;
        }
        
        let errorMessage = 'Speech recognition error. ';
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage += `Error: ${event.error}`;
        }
        
        alert(errorMessage);
        stopRecording();
      };

      recognition.onend = () => {
        // Update base text with final transcripts, remove interim
        const finalText = baseInputTextRef.current + 
                         (baseInputTextRef.current && finalTranscriptRef.current ? ' ' : '') + 
                         finalTranscriptRef.current.trim();
        baseInputTextRef.current = finalText;
        setInputText(finalText);
        interimTranscriptRef.current = '';
        
        // Auto-restart if still in recording state (unless manually stopped)
        if (isRecording && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Recognition already started or error
            console.log('Recognition restart:', e);
          }
        } else {
          stopRecording();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error: any) {
      console.error('Error starting speech recognition:', error);
      alert('Unable to start speech recognition. Please check your browser settings and microphone permissions.');
      setIsRecording(false);
    }
  };

  // Stop audio recording
  const stopRecording = (autoSend: boolean = true) => {
    // Clear pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      recognitionRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    // Finalize the text: base + final transcripts (remove interim)
    const finalText = baseInputTextRef.current + 
                     (baseInputTextRef.current && finalTranscriptRef.current ? ' ' : '') + 
                     finalTranscriptRef.current.trim();
    if (finalText !== inputText) {
      setInputText(finalText);
    }
    setIsRecording(false);
    setRecordingTime(0);
    
    // Auto-send if there's text and autoSend is true
    if (autoSend && finalText.trim() && !isThinking) {
      setTimeout(() => {
        handleSendMessage(finalText);
      }, 100);
    }
    
    interimTranscriptRef.current = '';
    finalTranscriptRef.current = '';
    baseInputTextRef.current = '';
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (textToSend.trim() && !isThinking && user) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: textToSend,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsThinking(true);

      // Save user message to database
      try {
        await createChatMessage({
          user_id: user.id,
          speaker: 'user',
          message: textToSend
        });
      } catch (error) {
        console.error('Error saving user message:', error);
      }

      // Send user message to n8n webhook
      try {
        await sendUserMessageToN8N(
          user.id,
          user.email,
          textToSend,
          sessionIdRef.current
        );
      } catch (error) {
        console.error('Error sending message to n8n:', error);
        // Don't block chat if n8n fails
      }

      setTimeout(async () => {
        const botResponseId = (Date.now() + 1).toString();
        const fullText = "I hear you. Let's work through this together. Can you tell me more about what's on your mind?";

        const botResponse: Message = {
          id: botResponseId,
          type: 'bot',
          text: '',
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, botResponse]);
        setTypingMessages(prev => new Set(prev).add(botResponseId));

        // Start speaking immediately as typing begins (only if not muted)
        if (isSpeechSynthesisAvailable() && !isVoiceMuted) {
          const voiceOption = preferences?.voice_option || 'female';
          console.log(`🔊 Starting to speak response with ${voiceOption} voice while typing`);
          speakText(fullText, voiceOption).catch(error => {
            console.error('❌ Error speaking text:', error);
          });
        }

        let currentIndex = 0;
        let lastUpdateTime = Date.now();
        const updateInterval = 30; // Update every 30ms for smoother animation
        
        typingIntervalRef.current = setInterval(() => {
          const now = Date.now();
          // Only update if enough time has passed (throttle for performance)
          if (now - lastUpdateTime >= updateInterval) {
            if (currentIndex <= fullText.length) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === botResponseId
                    ? { ...msg, text: fullText.slice(0, currentIndex) }
                    : msg
                )
              );
              currentIndex++;
              lastUpdateTime = now;
            } else {
              if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
              }
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === botResponseId
                    ? { ...msg, isTyping: false }
                    : msg
                )
              );
              setTypingMessages(prev => {
                const newSet = new Set(prev);
                newSet.delete(botResponseId);
                return newSet;
              });
              setIsThinking(false);

              // Save bot response to database
              if (user) {
                createChatMessage({
                  user_id: user.id,
                  speaker: 'ai',
                  message: fullText
                }).catch(error => {
                  console.error('Error saving bot message:', error);
                });

                // Send AI response to n8n webhook
                sendAIResponseToN8N(
                  user.id,
                  user.email,
                  fullText,
                  sessionIdRef.current
                ).catch(error => {
                  console.error('Error sending AI response to n8n:', error);
                  // Don't block chat if n8n fails
                });
              }
              // Voice is already speaking from the start of typing animation
            }
          }
        }, 16); // ~60fps but throttled internally
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col bg-warm-white dark:bg-[#141b26] rounded-2xl shadow-xl border border-sage-100/50 dark:border-[#283647] overflow-hidden transition-colors relative w-full" style={{ height: 'calc(100vh - 200px)', minHeight: '800px', maxHeight: '1000px', zIndex: 1, pointerEvents: 'auto' }}>
      <div className="bg-gradient-to-r from-[#187E5F] via-[#0B5844] to-[#187E5F] px-4 py-3 flex items-center justify-between shadow-md" style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease-in-out' }}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-white dark:bg-[#00FFC8] rounded-2xl flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,255,200,0.6)] overflow-hidden ${isThinking ? 'animate-gentle-pulse' : ''}`} style={{ boxShadow: '0 0 16px rgba(24, 126, 95, 0.5)' }}>
            <img
              src="/Gemini_Generated_Image_jnzolrjnzolrjnzo.png"
              alt="NIRA Avatar"
              className="w-9 h-9 object-cover rounded-2xl"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">NIRA</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-mint-400 dark:bg-[#00FFC8] rounded-full animate-gentle-pulse shadow-sm dark:shadow-[0_0_8px_rgba(0,255,200,0.8)]"></div>
              <span className="text-sage-100 text-xs">Here for you</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowAudioMenu(!showAudioMenu)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all hover:scale-105 relative"
            title="Audio controls"
          >
            {isMusicMuted && isVoiceMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
          
          {/* Audio Menu Dropdown */}
          {showAudioMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowAudioMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-primary-white)] dark:bg-[var(--color-dark-elevated-bg)] rounded-xl shadow-2xl border border-[var(--color-light-sage)] dark:border-[var(--border-color)] z-50 overflow-hidden">
                <div className="p-2">
                  {/* Background Music Toggle */}
                  <button
                    onClick={() => {
                      if (isMusicMuted) {
                        unmuteBackgroundAudio();
                        setIsMusicMuted(false);
                      } else {
                        muteBackgroundAudio();
                        setIsMusicMuted(true);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-light-sage)] dark:hover:bg-[var(--color-dark-elevated-bg)] transition-colors text-left"
                  >
                    {isMusicMuted ? (
                      <VolumeX className="w-5 h-5 text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">
                        Background Music
                      </div>
                      <div className="text-xs text-[var(--color-text-tertiary)] dark:text-[var(--color-dark-text-muted)]">
                        {isMusicMuted ? 'Muted' : 'Playing'}
                      </div>
                    </div>
                  </button>
                  
                  {/* Voice Agent Toggle */}
                  <button
                    onClick={() => {
                      const newMutedState = !isVoiceMuted;
                      setIsVoiceMuted(newMutedState);
                      localStorage.setItem('voice-agent-muted', String(newMutedState));
                      if (newMutedState) {
                        muteVoiceAgent();
                        stopSpeech();
                      } else {
                        unmuteVoiceAgent();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-light-sage)] dark:hover:bg-[var(--color-dark-elevated-bg)] transition-colors text-left mt-1"
                  >
                    {isVoiceMuted ? (
                      <VolumeX className="w-5 h-5 text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">
                        Voice Agent
                      </div>
                      <div className="text-xs text-[var(--color-text-tertiary)] dark:text-[var(--color-dark-text-muted)]">
                        {isVoiceMuted ? 'Muted' : 'Enabled'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3" 
        style={{ 
          scrollBehavior: 'smooth',
          ...(preferences?.custom_background_url && preferences.background_theme === 'custom'
            ? {
                backgroundImage: `url(${preferences.custom_background_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'auto',
                WebkitImageRendering: 'auto',
                msInterpolationMode: 'bicubic',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)' // Force hardware acceleration for better rendering quality
              }
            : {
                background: 'linear-gradient(to bottom, rgb(248 250 249 / 0.3), rgb(255 255 255), rgb(240 253 250 / 0.2))'
              })
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {message.type === 'user' && (
              <div
                className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden bg-gradient-to-br from-beige-400 to-beige-500"
              >
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              {message.type === 'bot' && message.isTyping && message.text === '' && (
                <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-light-sage)] dark:bg-[var(--color-dark-secondary-bg)] rounded-2xl shadow-md border border-[var(--color-pale-mint)] dark:border-[var(--border-color)]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--color-deep-emerald)] dark:bg-[var(--color-neon-teal)] rounded-full animate-thinking-dot" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-[var(--color-deep-emerald)] dark:bg-[var(--color-neon-teal)] rounded-full animate-thinking-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-[var(--color-deep-emerald)] dark:bg-[var(--color-neon-teal)] rounded-full animate-thinking-dot" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <span className="text-sm text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)] font-medium">NIRA is thinking...</span>
                </div>
              )}
              {(message.text || !message.isTyping) && (
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'bot'
                      ? 'text-[var(--color-text-primary)] dark:text-[var(--color-neon-teal)] border border-[var(--color-pale-mint)] dark:border-[var(--color-neon-teal)]/40 bg-[var(--color-pale-mint)] dark:bg-[rgba(28,37,51,0.8)]'
                      : 'bg-[var(--color-soft-cream)] dark:bg-[var(--color-dark-card-bg)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] border border-[var(--color-light-sage)] dark:border-[var(--border-color)]'
                  }`}
                  style={message.type === 'bot' ? { 
                    ...(isDark ? {
                      boxShadow: '0 2px 16px rgba(0, 255, 200, 0.2), 0 0 0 1px rgba(0, 255, 200, 0.15), inset 0 1px 0 rgba(0, 255, 200, 0.1)',
                      backgroundColor: 'rgba(28, 37, 51, 0.9)',
                    } : {
                      boxShadow: '0 2px 8px rgba(24, 126, 95, 0.12)',
                      backgroundColor: 'var(--color-pale-mint)',
                    }),
                    opacity: 1
                  } : { 
                    boxShadow: '0 2px 8px rgba(44, 73, 67, 0.08)'
                  }}
                >
                  <p className="text-sm leading-relaxed font-medium dark:font-semibold">
                    {message.text}
                    {message.isTyping && <span className="animate-pulse ml-1">|</span>}
                  </p>
                </div>
              )}
              <span className="text-xs text-[var(--color-text-tertiary)] dark:text-[var(--color-dark-text-muted)] px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isThinking && messages.length > 0 && messages[messages.length - 1].type === 'user' && (
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-light-sage)] dark:bg-[var(--color-dark-secondary-bg)] rounded-2xl shadow-md border border-[var(--color-pale-mint)] dark:border-[var(--border-color)]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--color-deep-emerald)] dark:bg-[var(--color-neon-teal)] rounded-full animate-thinking-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-[var(--color-deep-emerald)] dark:bg-[var(--color-neon-teal)] rounded-full animate-thinking-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-[var(--color-deep-emerald)] dark:bg-[var(--color-neon-teal)] rounded-full animate-thinking-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="text-sm text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)] font-medium">NIRA is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 bg-[var(--color-primary-white)]/90 dark:bg-[var(--color-dark-secondary-bg)] border-t border-[var(--color-light-sage)] dark:border-[var(--border-color)] flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="relative">
            <button
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
              disabled={isThinking}
              className={`w-11 h-11 rounded-2xl transition-all shadow-lg group relative flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gradient-to-br from-sage-600 to-mint-600 hover:shadow-xl hover:scale-105'
              }`}
              style={!isRecording && !isThinking ? {
                animation: 'voice-glow-pulse 2s ease-in-out infinite'
              } : {}}
              title={isRecording ? `Stop recording (${recordingTime}s)` : 'Speak your thoughts'}
            >
              <Mic className={`w-5 h-5 text-white ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording && (
                <>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
                    <div className="w-1 bg-white rounded-full animate-waveform-1" style={{ height: '12px' }}></div>
                    <div className="w-1 bg-white rounded-full animate-waveform-2" style={{ height: '16px' }}></div>
                    <div className="w-1 bg-white rounded-full animate-waveform-3" style={{ height: '20px' }}></div>
                    <div className="w-1 bg-white rounded-full animate-waveform-2" style={{ height: '16px' }}></div>
                    <div className="w-1 bg-white rounded-full animate-waveform-1" style={{ height: '12px' }}></div>
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap z-50">
                    {recordingTime}s
                  </div>
                </>
              )}
              {!isRecording && showVoiceTooltip && !isThinking && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#187E5F]/95 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  Click to record voice
                </div>
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => handleSendMessage("I'm feeling anxious right now...")}
                disabled={isThinking}
                className="px-4 py-2 h-8 bg-[var(--color-light-sage)] dark:bg-[var(--color-dark-elevated-bg)] text-[var(--color-deep-emerald)] dark:text-[var(--color-dark-text-secondary)] rounded-full text-xs font-medium hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Feeling anxious</span>
              </button>
              <button
                onClick={() => handleSendMessage("I need a breathing exercise...")}
                disabled={isThinking}
                className="px-4 py-2 h-8 bg-[var(--color-pale-mint)] dark:bg-[var(--color-dark-elevated-bg)] text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)] rounded-full text-xs font-medium hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wind className="w-4 h-4" />
                <span>Breathing Exercise</span>
              </button>
              <button
                onClick={() => handleSendMessage("I need support...")}
                disabled={isThinking}
                className="px-4 py-2 h-8 bg-[var(--color-light-sage)] dark:bg-[var(--color-dark-elevated-bg)] text-[var(--color-forest-green)] dark:text-[var(--color-dark-text-secondary)] rounded-full text-xs font-medium hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className="w-4 h-4" />
                <span>Need Support</span>
              </button>
            </div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isThinking ? "NIRA is thinking..." : "Share your thoughts with NIRA..."}
                disabled={isThinking}
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-[var(--color-light-sage)] dark:border-[var(--border-color)] bg-[var(--color-primary-white)] dark:bg-[var(--color-dark-secondary-bg)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-emerald)] dark:focus:ring-[var(--color-neon-teal)] focus:border-transparent transition-all text-[15px] resize-none shadow-sm placeholder-[var(--color-text-tertiary)] dark:placeholder-[var(--color-dark-text-muted)] disabled:opacity-60 disabled:cursor-not-allowed"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button
                className="absolute right-3 bottom-3 p-1.5 hover:bg-[rgba(24,126,95,0.1)] dark:hover:bg-gray-700 rounded-lg transition-all group"
                title="Add emoji"
              >
                <Smile className="w-4 h-4 text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]" />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isThinking}
            className={`w-11 h-11 rounded-2xl hover:shadow-lg transition-all disabled:cursor-not-allowed shadow-md flex items-center justify-center ${
              inputText.trim() && !isThinking
                ? 'bg-gradient-to-br from-[#187E5F] to-[#66887f] hover:scale-105 opacity-100'
                : 'bg-[#66887f] opacity-50'
            }`}
            title="Send message"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        <div
          onClick={() => {
            // Update search params to trigger journal view
            setSearchParams({ tab: 'journal' });
          }}
          className="mt-3 bg-[var(--color-soft-cream)] dark:bg-[var(--color-dark-elevated-bg)] rounded-lg px-3 py-2 cursor-pointer hover:bg-[var(--color-light-sage)] dark:hover:bg-[var(--color-dark-card-bg)] transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]" />
            <span className="text-xs text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-secondary)]">
              Want to reflect deeper? <span className="font-semibold text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)]">Start a journal entry.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
