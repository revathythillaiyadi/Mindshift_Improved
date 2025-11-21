import { useState, useEffect, useRef } from 'react';
import { Calendar, Mic, Type, Edit3, Trash2, Download, ChevronLeft, ChevronRight, Search, ChevronDown, BookOpen, Lock, HelpCircle, Loader2, Edit, FileText, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, ArrowLeft, ArrowRight } from 'lucide-react';
import { extractAndCorrectTitle, hasTitlePhrase } from '../../lib/openai';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emoji: string;
  date: Date;
}

type SortOption = 'recent' | 'oldest' | 'most-read';
type TemplateType = 'gratitude' | 'daily' | 'mood' | null;

const templates = {
  gratitude: {
    title: 'Gratitude Journal',
    prompts: [
      'Three things I\'m grateful for today:',
      '1. ',
      '2. ',
      '3. ',
      '\nWhy these matter to me:'
    ].join('\n')
  },
  daily: {
    title: 'Daily Reflection',
    prompts: [
      'Today\'s highlights:',
      '\nChallenges I faced:',
      '\nWhat I learned:',
      '\nTomorrow\'s intentions:'
    ].join('\n')
  },
  mood: {
    title: 'Mood Tracker',
    prompts: [
      'Current mood: ',
      '\nWhat triggered this feeling:',
      '\nPhysical sensations:',
      '\nThoughts I\'m having:',
      '\nWhat might help:'
    ].join('\n')
  }
};

export default function JournalArea() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Grateful for today',
      content: 'Today I managed to complete my work tasks and still had energy for a walk. Feeling proud of my progress. The sunset was beautiful and reminded me to appreciate the small moments. I also had a meaningful conversation with a friend that lifted my spirits.',
      emoji: '🌟',
      date: new Date(),
    },
    {
      id: '2',
      title: 'Reflections on anxiety',
      content: 'Talked with NIRA about my anxiety. The reframing helped me see things differently. I realized that my anxiety often comes from trying to control things outside my power. Learning to let go has been challenging but rewarding.',
      emoji: '💭',
      date: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'Morning mindfulness',
      content: 'Started the day with meditation and it made such a difference. Noticed I felt more centered and less reactive throughout the day.',
      emoji: '🧘',
      date: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      title: 'Progress check-in',
      content: 'Looking back at the past week, I can see real progress in managing my stress levels. The breathing exercises are becoming second nature.',
      emoji: '📈',
      date: new Date(Date.now() - 604800000),
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'handwriting'>('text');
  const [newEntry, setNewEntry] = useState({ title: '', content: '', emoji: '📝' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interimTranscriptRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');
  const baseContentRef = useRef<string>('');
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef<boolean>(false);
  const titleProcessedRef = useRef<boolean>(false);
  const titleProcessingRef = useRef<boolean>(false);
  
  // Collapse/expand states with localStorage persistence
  const [isPastEntriesCollapsed, setIsPastEntriesCollapsed] = useState(() => {
    const saved = localStorage.getItem('journal-past-entries-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const emojiOptions = ['📝', '🌟', '💭', '🌸', '🎯', '💪', '🌈', '🦋', '🌿', '✨'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveEntry();
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setShowShortcutsModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // handleSaveEntry is stable, no need to include it

  // Load today's entry on initial mount
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      const isToday = selectedDate.getDate() === today.getDate() &&
                     selectedDate.getMonth() === today.getMonth() &&
                     selectedDate.getFullYear() === today.getFullYear();
      
      if (isToday) {
        const dayEntries = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getDate() === today.getDate() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear()
          );
        });

        if (dayEntries.length > 0 && !newEntry.title && !newEntry.content) {
          // Load today's entry only if editor is empty
          const entry = dayEntries.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          setNewEntry({
            title: entry.title,
            content: entry.content,
            emoji: entry.emoji
          });
        }
      }
    }
  }, []); // Only run on mount

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
    };
  }, []);

  // Start audio recording with Web Speech API
  const startRecording = () => {
    // Prevent starting if already recording
    if (isRecording || isRecordingRef.current) {
      console.log('Already recording, ignoring start request');
      return;
    }

    try {
      // Check for Web Speech API support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Clean up any existing recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Recording started');
        setIsRecording(true);
        isRecordingRef.current = true;
        setRecordingTime(0);
        interimTranscriptRef.current = '';
        finalTranscriptRef.current = '';
        baseContentRef.current = newEntry.content; // Store the current content as base
        titleProcessedRef.current = false; // Reset title processing flag
        titleProcessingRef.current = false;
        
        // Start timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        console.log('onresult fired! resultIndex:', event.resultIndex, 'results length:', event.results.length);
        let newInterimTranscript = '';
        let newFinalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log(`Result ${i}: "${transcript}", isFinal: ${event.results[i].isFinal}`);
          if (event.results[i].isFinal) {
            newFinalTranscript += transcript + ' ';
            // Add to final transcript ref
            finalTranscriptRef.current += transcript + ' ';
          } else {
            newInterimTranscript += transcript;
          }
        }

        console.log('Interim:', newInterimTranscript, 'Final:', newFinalTranscript);
        console.log('Current baseContent:', baseContentRef.current);
        console.log('Current finalTranscript:', finalTranscriptRef.current);

        // Update interim transcript
        interimTranscriptRef.current = newInterimTranscript;
        
        // Build full transcript to check for title phrase
        const currentFullTranscript = baseContentRef.current + 
                           (baseContentRef.current && finalTranscriptRef.current ? ' ' : '') + 
                           finalTranscriptRef.current.trim() + 
                           (finalTranscriptRef.current.trim() && newInterimTranscript ? ' ' : '') + 
                           newInterimTranscript;
        
        // Check for title phrase in final transcripts (only process once)
        if (!titleProcessedRef.current && !titleProcessingRef.current && newFinalTranscript.trim()) {
          const fullFinalTranscript = baseContentRef.current + 
                                     (baseContentRef.current && finalTranscriptRef.current ? ' ' : '') + 
                                     finalTranscriptRef.current.trim();
          
          if (hasTitlePhrase(fullFinalTranscript)) {
            console.log('Title phrase detected! Processing title extraction...');
            titleProcessingRef.current = true;
            
            // Process title extraction asynchronously
            extractAndCorrectTitle(fullFinalTranscript).then((result: { title: string; content: string } | null) => {
              if (result) {
                console.log('Title extracted:', result.title);
                console.log('Content part:', result.content);
                
                // Update title and content
                setNewEntry(prev => ({
                  ...prev,
                  title: result.title,
                  content: result.content
                }));
                
                // Update refs to reflect the split
                baseContentRef.current = result.content;
                finalTranscriptRef.current = ''; // Clear final transcript as it's been processed
                
                titleProcessedRef.current = true;
                titleProcessingRef.current = false;
              } else {
                titleProcessingRef.current = false;
              }
            }).catch((error: any) => {
              console.error('Error processing title:', error);
              titleProcessingRef.current = false;
            });
          }
        }
        
        // Update entry content: base + all final transcripts + current interim
        // If title was processed, only show content part
        const fullContent = titleProcessedRef.current 
          ? baseContentRef.current + 
            (baseContentRef.current && newInterimTranscript ? ' ' : '') + 
            newInterimTranscript
          : currentFullTranscript;
        
        console.log('Setting content to:', fullContent);
        setNewEntry(prev => {
          // Don't overwrite title if it was already set
          if (titleProcessedRef.current && prev.title) {
            return { ...prev, content: fullContent };
          }
          return { ...prev, content: fullContent };
        });
        
        // Reset pause timeout - user is still speaking
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
        
        // Set timeout to auto-stop and save recording after 2 seconds of pause (no new speech)
        // Only set timeout if we have actual speech content
        if (newFinalTranscript.trim() || newInterimTranscript.trim()) {
          pauseTimeoutRef.current = setTimeout(() => {
            console.log('Auto-stopping and saving after 2 seconds of pause');
            stopRecording(true); // Auto-save when pausing
          }, 2000); // 2 seconds of pause
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, event);
        
        if (event.error === 'no-speech') {
          // User stopped speaking, continue listening - don't stop recording
          console.log('No speech detected, continuing to listen...');
          return;
        }
        
        if (event.error === 'aborted') {
          // User manually stopped
          console.log('Recognition aborted by user');
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
        
        console.error('Showing error alert:', errorMessage);
        alert(errorMessage);
        stopRecording();
      };

      recognition.onend = () => {
        console.log('Recognition ended, isRecordingRef:', isRecordingRef.current);
        // Update base content with final transcripts, remove interim
        const finalContent = baseContentRef.current + 
                            (baseContentRef.current && finalTranscriptRef.current ? ' ' : '') + 
                            finalTranscriptRef.current.trim();
        baseContentRef.current = finalContent;
        setNewEntry(prev => ({ ...prev, content: finalContent }));
        interimTranscriptRef.current = '';
        
        // Only auto-restart if still in recording state
        // Use ref instead of state to avoid stale closure issues
        if (isRecordingRef.current && recognitionRef.current) {
          try {
            console.log('Auto-restarting recognition');
            recognitionRef.current.start();
          } catch (e) {
            // Recognition already started or error
            console.log('Recognition restart failed:', e);
            // If restart fails, stop recording
            stopRecording();
          }
        } else {
          // Not in recording state anymore, clean up
          console.log('Not restarting, cleaning up');
          if (!isRecordingRef.current) {
            setIsRecording(false);
          }
        }
      };

      recognitionRef.current = recognition;
      console.log('Starting recognition...');
      
      try {
        recognition.start();
        console.log('recognition.start() called successfully');
      } catch (error: any) {
        console.error('Error calling recognition.start():', error);
        // If start fails, try requesting permission first
        if (error.name === 'NotAllowedError' || error.message?.includes('not allowed')) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              console.log('Microphone permission granted, retrying recognition.start()');
              recognition.start();
            })
            .catch((permError) => {
              console.error('Microphone permission denied:', permError);
              alert('Microphone permission is required for voice recording. Please allow microphone access in your browser settings.');
              setIsRecording(false);
              isRecordingRef.current = false;
            });
        } else {
          alert('Unable to start voice recognition: ' + (error.message || error));
          setIsRecording(false);
          isRecordingRef.current = false;
        }
      }
    } catch (error: any) {
      console.error('Error starting speech recognition:', error);
      alert('Unable to start speech recognition. Please check your browser settings and microphone permissions.');
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  // Stop audio recording
  const stopRecording = (autoSave: boolean = false) => {
    console.log('Stopping recording, autoSave:', autoSave);
    // Set recording ref to false first to prevent auto-restart
    isRecordingRef.current = false;
    
    // Clear pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Recognition stopped');
      } catch (e) {
        // Ignore errors when stopping
        console.log('Error stopping recognition:', e);
      }
      recognitionRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    // Finalize the content: base + final transcripts (remove interim)
    const finalContent = baseContentRef.current + 
                        (baseContentRef.current && finalTranscriptRef.current ? ' ' : '') + 
                        finalTranscriptRef.current.trim();
    
    // Update content state before auto-saving
    if (finalContent !== newEntry.content) {
      setNewEntry(prev => ({ ...prev, content: finalContent }));
    }
    
    setIsRecording(false);
    setRecordingTime(0);
    
    // Auto-save if requested (when user pauses speech)
    if (autoSave && finalContent.trim() && !isSaving) {
      console.log('Auto-saving entry after pause, content length:', finalContent.length);
      // Use a slightly longer timeout to ensure state is updated
      setTimeout(() => {
        // Make sure we have the latest content
        const contentToSave = baseContentRef.current + 
                            (baseContentRef.current && finalTranscriptRef.current ? ' ' : '') + 
                            finalTranscriptRef.current.trim();
        if (contentToSave.trim()) {
          // Temporarily update content if needed
          setNewEntry(prev => {
            if (prev.content !== contentToSave) {
              return { ...prev, content: contentToSave };
            }
            return prev;
          });
          // Small delay to ensure state update, then save
          setTimeout(() => {
            handleSaveEntry();
          }, 50);
        }
      }, 150);
    }
    
    interimTranscriptRef.current = '';
    finalTranscriptRef.current = '';
    // Don't clear baseContentRef here - keep it so user can continue adding to the content
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleSaveEntry = () => {
    // Auto-generate title if missing but content exists
    const titleToUse = newEntry.title || (newEntry.content 
      ? newEntry.content.split('\n')[0].slice(0, 50) + (newEntry.content.split('\n')[0].length > 50 ? '...' : '')
      : '');
    
    if (titleToUse && newEntry.content && selectedDate) {
      setIsSaving(true);
      setTimeout(() => {
        // Check if an entry already exists for the selected date
        const existingEntryIndex = entries.findIndex(entry => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getDate() === selectedDate.getDate() &&
            entryDate.getMonth() === selectedDate.getMonth() &&
            entryDate.getFullYear() === selectedDate.getFullYear()
          );
        });

        const entry: JournalEntry = {
          id: existingEntryIndex >= 0 ? entries[existingEntryIndex].id : Date.now().toString(),
          title: titleToUse,
          content: newEntry.content,
          emoji: newEntry.emoji,
          date: new Date(selectedDate), // Use selected date, not current date
        };

        if (existingEntryIndex >= 0) {
          // Update existing entry
          setEntries(prev => {
            const updated = [...prev];
            updated[existingEntryIndex] = entry;
            return updated;
          });
        } else {
          // Create new entry
          setEntries(prev => [entry, ...prev]);
        }

        setNewEntry({ title: '', content: '', emoji: '📝' });
        setLastSaved(new Date());
        setIsSaving(false);
      }, 500);
    }
  };

  const useTemplate = (type: TemplateType) => {
    if (type && templates[type]) {
      setNewEntry({
        title: templates[type].title,
        content: templates[type].prompts,
        emoji: type === 'gratitude' ? '🙏' : type === 'daily' ? '📅' : '😊'
      });
      setShowTemplateDropdown(false);
    }
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getReadTime = (text: string) => {
    const words = getWordCount(text);
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const getDateGroup = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'TODAY';
    if (diffDays < 7) return 'THIS WEEK';
    if (diffDays < 30) return 'THIS MONTH';
    return 'EARLIER';
  };

  const groupedEntries = () => {
    let filtered = entries.filter(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') return b.date.getTime() - a.date.getTime();
      if (sortBy === 'oldest') return a.date.getTime() - b.date.getTime();
      return 0;
    });

    const groups: Record<string, JournalEntry[]> = {};
    filtered.forEach(entry => {
      const group = getDateGroup(entry.date);
      if (!groups[group]) groups[group] = [];
      groups[group].push(entry);
    });

    return groups;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const hasEntryOnDate = (day: number) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === day &&
        entryDate.getMonth() === currentMonth.getMonth() &&
        entryDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const totalEntries = entries.length;
  const thisMonthEntries = entries.filter(e => {
    const now = new Date();
    return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
  }).length;

  const streak = 7;

  const grouped = groupedEntries();
  const hasNoEntries = entries.length === 0;

  const insertFormatting = (format: string) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = newEntry.content.substring(start, end);
    const beforeText = newEntry.content.substring(0, start);
    const afterText = newEntry.content.substring(end);

    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? newText.length : 2;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? newText.length : 1;
        break;
      case 'underline':
        newText = `__${selectedText || 'underlined text'}__`;
        cursorOffset = selectedText ? newText.length : 2;
        break;
      case 'h1':
        newText = `\n# ${selectedText || 'Heading 1'}\n`;
        cursorOffset = selectedText ? newText.length : 3;
        break;
      case 'h2':
        newText = `\n## ${selectedText || 'Heading 2'}\n`;
        cursorOffset = selectedText ? newText.length : 4;
        break;
      case 'h3':
        newText = `\n### ${selectedText || 'Heading 3'}\n`;
        cursorOffset = selectedText ? newText.length : 5;
        break;
      case 'ul':
        newText = `\n- ${selectedText || 'List item'}\n`;
        cursorOffset = selectedText ? newText.length : 3;
        break;
      case 'ol':
        newText = `\n1. ${selectedText || 'List item'}\n`;
        cursorOffset = selectedText ? newText.length : 4;
        break;
      default:
        return;
    }

    const updatedContent = beforeText + newText + afterText;
    setNewEntry({ ...newEntry, content: updatedContent });

    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        const newPosition = start + cursorOffset;
        textareaRef.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const togglePastEntries = () => {
    const newState = !isPastEntriesCollapsed;
    setIsPastEntriesCollapsed(newState);
    localStorage.setItem('journal-past-entries-collapsed', JSON.stringify(newState));
  };

  return (
    <>
    <div className="w-full flex items-stretch gap-0 pb-6 h-full min-h-[calc(100vh-200px)]">
      {/* Middle Panel - Dear Diary Editor (Always Visible, Dominant) */}
      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-[#faf8f3] via-[#fefdfb] to-[#f9f7f0] dark:bg-[var(--color-dark-secondary-bg)] rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-[#e8d5b7]/40 dark:border-[var(--border-color)] h-full flex flex-col relative overflow-hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="paper" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cline x1="0" y1="30" x2="100" y2="30" stroke="%23e5d4b8" stroke-width="0.5" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23paper)"/%3E%3C/svg%3E")' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b7355] via-[#a0826d] to-[#8b7355] opacity-20 dark:from-[var(--color-neon-teal)] dark:via-[var(--color-neon-teal-dim)] dark:to-[var(--color-neon-teal)] dark:opacity-30"></div>
          
          {/* Header */}
          <div className="p-6 pb-4">
            <h2 className="text-2xl font-serif text-[#5d4e37] dark:text-[var(--color-neon-teal)] mb-1 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              Dear Diary
            </h2>
            <p className="text-xs text-[#8b7355] dark:text-[var(--color-dark-text-muted)] italic" style={{ fontFamily: 'Georgia, serif' }}>
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Editor Content */}
          <div className="px-6 pb-6 flex-1 overflow-y-auto space-y-5" data-editor-section>

          <div className="flex gap-2 mb-5 flex-wrap">
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] transition-all ${
                inputMode === 'text'
                  ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white'
                  : 'bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] text-gray-700 dark:text-[var(--color-dark-text-secondary)]'
              }`}
            >
              <Type className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] transition-all ${
                inputMode === 'voice'
                  ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white'
                  : 'bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] text-gray-700 dark:text-[var(--color-dark-text-secondary)]'
              }`}
            >
              <Mic className="w-4 h-4" />
              Voice
            </button>
            <button
              onClick={() => setInputMode('handwriting')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[1rem] transition-all ${
                inputMode === 'handwriting'
                  ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white'
                  : 'bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] text-gray-700 dark:text-[var(--color-dark-text-secondary)]'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Handwriting
            </button>

            <div className="relative ml-auto">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-[1rem] bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] text-gray-700 dark:text-[var(--color-dark-text-secondary)] hover:bg-sage-100 dark:hover:bg-[var(--color-dark-card-bg)] transition-all"
              >
                <FileText className="w-4 h-4" />
                Use Template
                <ChevronDown className="w-3 h-3" />
              </button>

              {showTemplateDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[var(--color-dark-elevated-bg)] rounded-xl shadow-2xl border border-sage-200 dark:border-[var(--border-color)] py-2 z-50">
                  <button
                    onClick={() => useTemplate('gratitude')}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800 dark:text-[var(--color-dark-text-primary)]">🙏 Gratitude Journal</div>
                    <div className="text-xs text-gray-500 dark:text-[var(--color-dark-text-muted)]">List things you're thankful for</div>
                  </button>
                  <button
                    onClick={() => useTemplate('daily')}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800 dark:text-[var(--color-dark-text-primary)]">📅 Daily Reflection</div>
                    <div className="text-xs text-gray-500 dark:text-[var(--color-dark-text-muted)]">Reflect on your day</div>
                  </button>
                  <button
                    onClick={() => useTemplate('mood')}
                    className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800 dark:text-[var(--color-dark-text-primary)]">😊 Mood Tracker</div>
                    <div className="text-xs text-gray-500 dark:text-[var(--color-dark-text-muted)]">Track emotions and triggers</div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEntry({ ...newEntry, emoji })}
                    className={`text-2xl p-2 rounded-[1rem] transition-all hover:scale-110 ${
                      newEntry.emoji === emoji ? 'bg-blue-100 dark:bg-[var(--color-dark-elevated-bg)] ring-2 ring-[var(--color-neon-teal)]/50' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Give this entry a title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-b-2 border-l-0 border-r-0 border-t-0 border-[#d4c4a8] dark:border-[var(--border-color)] bg-transparent dark:bg-[var(--color-dark-elevated-bg)] dark:text-[var(--color-neon-teal)] focus:outline-none focus:border-[#8b7355] dark:focus:border-[var(--color-neon-teal)] transition-colors text-lg font-serif text-[#5d4e37] dark:text-[var(--color-neon-teal)]"
              style={{ fontFamily: 'Georgia, serif' }}
            />

            {inputMode === 'text' && (
              <div className="relative">
                {showToolbar && (
                  <div className="mb-2 p-2 bg-[#f5ede1]/80 dark:bg-[var(--color-dark-elevated-bg)] rounded-lg border border-[#e8d5b7] dark:border-[var(--border-color)] flex flex-wrap gap-1 shadow-sm">
                    <button
                      onClick={() => insertFormatting('bold')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Bold (Markdown: **text**)"
                      type="button"
                    >
                      <Bold className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <button
                      onClick={() => insertFormatting('italic')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Italic (Markdown: *text*)"
                      type="button"
                    >
                      <Italic className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <button
                      onClick={() => insertFormatting('underline')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Underline (Markdown: __text__)"
                      type="button"
                    >
                      <Underline className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <div className="w-px h-6 bg-[#d4c4a8] dark:bg-[var(--border-color)] my-auto mx-1"></div>
                    <button
                      onClick={() => insertFormatting('h1')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Heading 1 (Markdown: # text)"
                      type="button"
                    >
                      <Heading1 className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <button
                      onClick={() => insertFormatting('h2')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Heading 2 (Markdown: ## text)"
                      type="button"
                    >
                      <Heading2 className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <button
                      onClick={() => insertFormatting('h3')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Heading 3 (Markdown: ### text)"
                      type="button"
                    >
                      <Heading3 className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <div className="w-px h-6 bg-[#d4c4a8] dark:bg-[var(--border-color)] my-auto mx-1"></div>
                    <button
                      onClick={() => insertFormatting('ul')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Bullet List (Markdown: - item)"
                      type="button"
                    >
                      <List className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                    <button
                      onClick={() => insertFormatting('ol')}
                      className="p-2 hover:bg-[#e8d5b7] dark:hover:bg-[var(--color-dark-card-bg)] rounded transition-colors"
                      title="Numbered List (Markdown: 1. item)"
                      type="button"
                    >
                      <ListOrdered className="w-4 h-4 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
                    </button>
                  </div>
                )}
                <textarea
                  ref={setTextareaRef}
                  placeholder="Pour your heart out... What's on your mind today?"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  onFocus={() => setShowToolbar(true)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#e8d5b7]/60 dark:border-[var(--border-color)] bg-[#fffef9]/50 dark:bg-[var(--color-dark-elevated-bg)] dark:text-[var(--color-neon-teal)] focus:outline-none focus:border-[#c9b896] dark:focus:border-[var(--color-neon-teal)] transition-colors resize-none text-[#3d3428] dark:text-[var(--color-neon-teal)] shadow-inner"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '15px',
                    lineHeight: '28px',
                    paddingTop: '12px',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, #e8d5b7 28px, #e8d5b7 29px)',
                    backgroundAttachment: 'local',
                    backgroundPosition: '0 12px'
                  }}
                  rows={10}
                />
                <div className="absolute bottom-2 right-2 text-xs text-[#a0826d] dark:text-[var(--color-dark-text-muted)] bg-[#faf8f3]/80 dark:bg-[var(--color-dark-secondary-bg)]/80 px-2 py-1 rounded">
                  {getWordCount(newEntry.content)} words
                </div>
              </div>
            )}

            {inputMode === 'voice' && (
              <div className="flex flex-col space-y-6">
                {/* Recording Controls */}
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-sage-200 dark:border-[var(--border-color)] rounded-[1rem]">
                  {!isRecording ? (
                    <>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Start recording button clicked');
                          startRecording();
                        }}
                        disabled={isSaving || isRecording}
                        className="w-20 h-20 bg-gradient-to-r from-sage-600 to-mint-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Mic className="w-10 h-10 text-white" />
                      </button>
                      <p className="text-gray-600 dark:text-[var(--color-dark-text-secondary)] mt-4">
                        {isSaving ? 'Transcribing...' : 'Click to start recording'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Stop recording button clicked');
                            stopRecording(false);
                          }}
                          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse hover:bg-red-600 transition-all cursor-pointer"
                        >
                          <Mic className="w-10 h-10 text-white" />
                        </button>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5">
                          <div className="w-1 bg-sage-600 rounded-full animate-waveform-1" style={{ height: '12px' }}></div>
                          <div className="w-1 bg-sage-600 rounded-full animate-waveform-2" style={{ height: '16px' }}></div>
                          <div className="w-1 bg-sage-600 rounded-full animate-waveform-3" style={{ height: '20px' }}></div>
                          <div className="w-1 bg-sage-600 rounded-full animate-waveform-2" style={{ height: '16px' }}></div>
                          <div className="w-1 bg-sage-600 rounded-full animate-waveform-1" style={{ height: '12px' }}></div>
                        </div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-3 py-1 rounded-full whitespace-nowrap z-50">
                          Recording: {recordingTime}s
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-[var(--color-dark-text-secondary)] mt-8 font-medium">Recording... Click to stop</p>
                    </>
                  )}
                </div>

                {/* Title Input for Voice Mode */}
                {newEntry.content && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-dark-text-secondary)] mb-2">
                        Entry Title (optional - will auto-generate from content if empty):
                      </label>
                      <input
                        type="text"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        placeholder="Enter a title or leave empty to auto-generate"
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#e8d5b7]/60 dark:border-[var(--border-color)] bg-[#fffef9]/50 dark:bg-[var(--color-dark-elevated-bg)] dark:text-[var(--color-neon-teal)] focus:outline-none focus:border-[#c9b896] dark:focus:border-[var(--color-neon-teal)] transition-colors text-[#3d3428] dark:text-[var(--color-neon-teal)]"
                      />
                    </div>

                    {/* Transcribed Content Display */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-[var(--color-dark-text-secondary)]">Transcribed Text:</p>
                        <button
                          onClick={() => setInputMode('text')}
                          className="text-xs text-sage-600 dark:text-[var(--color-neon-teal)] hover:underline"
                        >
                          Switch to Text Mode to Edit
                        </button>
                      </div>
                      <div className="px-4 py-3 rounded-lg border-2 border-[#e8d5b7]/60 dark:border-[var(--border-color)] bg-[#fffef9]/50 dark:bg-[var(--color-dark-elevated-bg)] text-[#3d3428] dark:text-[var(--color-neon-teal)] shadow-inner min-h-[120px] max-h-[300px] overflow-y-auto"
                        style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: '15px',
                          lineHeight: '28px',
                          paddingTop: '12px',
                          backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, #e8d5b7 28px, #e8d5b7 29px)',
                          backgroundAttachment: 'local',
                          backgroundPosition: '0 12px'
                        }}
                      >
                        {newEntry.content}
                      </div>
                      <div className="absolute bottom-2 right-2 text-xs text-[#a0826d] dark:text-[var(--color-dark-text-muted)] bg-[#faf8f3]/80 dark:bg-[var(--color-dark-secondary-bg)]/80 px-2 py-1 rounded">
                        {getWordCount(newEntry.content)} words
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'handwriting' && (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-sage-200 dark:border-gray-600 rounded-[1rem]">
                <Edit3 className="w-12 h-12 text-sage-600 dark:text-[var(--color-neon-teal)]" />
                <p className="text-gray-600 dark:text-[var(--color-dark-text-secondary)] mt-4">Handwriting input (tablet/mobile)</p>
                <p className="text-sm text-gray-500 dark:text-[var(--color-dark-text-muted)] mt-2">Draw or write here</p>
              </div>
            )}

            <div className="flex gap-3 items-center">
              <button
                onClick={handleSaveEntry}
                disabled={!newEntry.content || isSaving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-[1rem] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Entry
                    <span className="text-xs opacity-75">(Ctrl+S)</span>
                  </>
                )}
              </button>
              <button
                className="group relative flex items-center gap-2 px-6 py-3 bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] text-sage-600 dark:text-[var(--color-neon-teal)] rounded-[1rem] hover:bg-sage-100 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors"
                title="Import insights from conversations"
              >
                <Download className="w-4 h-4" />
                Import from Chat
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--color-dark-elevated-bg)] dark:bg-[var(--color-dark-primary-bg)] text-white dark:text-[var(--color-neon-teal)] text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-[var(--border-color)]">
                  Import insights from conversations
                </div>
              </button>
            </div>

            {lastSaved && (
              <div className="text-center">
                <p className="text-[11px] text-[#a4c1c3]">
                  Last saved: {getTimeSince(lastSaved)}
                </p>
              </div>
            )}

            {/* Your Journey Stats */}
            <div className="mt-6 pt-6 border-t border-[#e8d5b7]/40 dark:border-[var(--border-color)]">
              <h3 className="text-lg font-serif text-[#5d4e37] dark:text-[var(--color-neon-teal)] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Your Journey</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] rounded-xl p-4 text-center border border-[var(--color-light-sage)] dark:border-[var(--border-color)]">
                  <div className="text-[18px] font-bold text-[#187E5F] dark:text-[var(--color-neon-teal)]">{totalEntries}</div>
                  <div className="text-[12px] text-[#78968b] dark:text-[var(--color-dark-text-muted)]">Total Entries</div>
                </div>
                <div className="bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] rounded-xl p-4 text-center border border-[var(--color-light-sage)] dark:border-[var(--border-color)]">
                  <div className="text-[18px] font-bold text-[#187E5F] dark:text-[var(--color-neon-teal)]">{streak} 🔥</div>
                  <div className="text-[12px] text-[#78968b] dark:text-[var(--color-dark-text-muted)]">Day Streak</div>
                </div>
                <div className="bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] rounded-xl p-4 text-center border border-[var(--color-light-sage)] dark:border-[var(--border-color)]">
                  <div className="text-[18px] font-bold text-[#187E5F] dark:text-[var(--color-neon-teal)]">{thisMonthEntries}</div>
                  <div className="text-[12px] text-[#78968b] dark:text-[var(--color-dark-text-muted)]">This Month</div>
                </div>
                <div className="bg-sage-50 dark:bg-[var(--color-dark-elevated-bg)] rounded-xl p-4 text-center border border-[var(--color-light-sage)] dark:border-[var(--border-color)]">
                  <div className="text-[18px] font-bold text-[#187E5F] dark:text-[var(--color-neon-teal)]">{entries.length > 0 ? getWordCount(entries[0].content) : 0}</div>
                  <div className="text-[12px] text-[#78968b] dark:text-[var(--color-dark-text-muted)]">Avg Words</div>
                </div>
              </div>
            </div>

            {/* Calendar View at Bottom */}
            <div className="mt-6 pt-6 border-t border-[#e8d5b7]/40 dark:border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif text-[#5d4e37] dark:text-[var(--color-neon-teal)]" style={{ fontFamily: 'Georgia, serif' }}>Calendar View</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-[var(--color-neon-teal)]" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 dark:text-[var(--color-dark-text-secondary)] min-w-[140px] text-center">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-[var(--color-neon-teal)]" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-[var(--color-dark-text-muted)] py-2">
                    {day}
                  </div>
                ))}
                {blanks.map((blank) => (
                  <div key={`blank-${blank}`} />
                ))}
                {days.map((day) => {
                  const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayEntries = entries.filter(entry => {
                    const entryDate = new Date(entry.date);
                    return (
                      entryDate.getDate() === day &&
                      entryDate.getMonth() === currentMonth.getMonth() &&
                      entryDate.getFullYear() === currentMonth.getFullYear()
                    );
                  });
                  
                  const isSelected = selectedDate && 
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentMonth.getMonth() &&
                    selectedDate.getFullYear() === currentMonth.getFullYear();
                  
                  const isToday = dayDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        // Set the selected date
                        setSelectedDate(dayDate);
                        
                        // Load existing entry if it exists, otherwise prepare for new entry
                        if (dayEntries.length > 0) {
                          // Load the most recent entry for this date
                          const entry = dayEntries.sort((a, b) => 
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                          )[0];
                          setNewEntry({
                            title: entry.title,
                            content: entry.content,
                            emoji: entry.emoji
                          });
                        } else {
                          // Clear editor for new entry on this date
                          setNewEntry({
                            title: '',
                            content: '',
                            emoji: '📝'
                          });
                        }
                        
                        // Scroll to top of editor
                        setTimeout(() => {
                          const editorElement = document.querySelector('[data-editor-section]');
                          if (editorElement) {
                            editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#187E5F] to-[#0B5844] text-white font-semibold ring-2 ring-[#187E5F] ring-offset-2'
                          : hasEntryOnDate(day)
                          ? 'bg-gradient-to-br from-sage-400 to-mint-400 text-white font-semibold hover:shadow-md'
                          : 'text-gray-700 dark:text-[var(--color-dark-text-secondary)] hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)]'
                      } ${isToday && !isSelected ? 'ring-1 ring-sage-400' : ''}`}
                      title={dayEntries.length > 0 ? `${dayEntries.length} entry${dayEntries.length > 1 ? 'ies' : ''} on this date` : 'Click to create entry for this date'}
                    >
                      {day}
                      {dayEntries.length > 0 && !isSelected && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Arrow Button - Right (between Editor and Past Entries) */}
      <button
        onClick={togglePastEntries}
        className="relative z-10 self-center w-10 h-10 rounded-full bg-white dark:bg-[var(--color-dark-elevated-bg)] border-2 border-[#e8d5b7] dark:border-[var(--border-color)] shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group -mx-1"
        title={isPastEntriesCollapsed ? 'Show past entries' : 'Hide past entries'}
      >
        {isPastEntriesCollapsed ? (
          <ArrowLeft className="w-5 h-5 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
        ) : (
          <ArrowRight className="w-5 h-5 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
        )}
      </button>

      {/* Right Panel - Past Entries (Collapsible) */}
      <div className={`relative transition-all duration-300 ${isPastEntriesCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-80 opacity-100'}`}>
        <div className="h-full bg-gradient-to-br from-[#faf8f3] via-[#fefdfb] to-[#f9f7f0] dark:bg-[var(--color-dark-secondary-bg)] rounded-r-[1.5rem] shadow-lg border-2 border-l-0 border-[#e8d5b7]/40 dark:border-[var(--border-color)] flex flex-col relative overflow-hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="paper" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cline x1="0" y1="30" x2="100" y2="30" stroke="%23e5d4b8" stroke-width="0.5" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23paper)"/%3E%3C/svg%3E")' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b7355] via-[#a0826d] to-[#8b7355] opacity-20 dark:from-[var(--color-neon-teal)] dark:via-[var(--color-neon-teal-dim)] dark:to-[var(--color-neon-teal)] dark:opacity-30"></div>
          
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5d4e37] dark:text-[var(--color-neon-teal)]" />
              <h2 className="text-2xl font-serif text-[#5d4e37] dark:text-[var(--color-neon-teal)]" style={{ fontFamily: 'Georgia, serif' }}>
                Past Entries
              </h2>
            </div>
          </div>

          {/* Past Entries Content */}
          <div className="px-6 pb-6 flex-1 overflow-y-auto flex flex-col min-h-0">
            <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78968b] dark:text-[var(--color-dark-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search your journal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8d5b7] dark:border-[var(--border-color)] bg-[#fffef9]/50 dark:bg-[var(--color-dark-elevated-bg)] dark:text-[var(--color-neon-teal)] focus:outline-none focus:ring-2 focus:ring-[#c9b896] dark:focus:ring-[var(--color-neon-teal)] transition-colors text-sm text-[#3d3428] dark:text-[var(--color-neon-teal)]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="relative">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e8d5b7] dark:border-[var(--border-color)] hover:bg-[#f5ede1] dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm"
                    >
                      <span className="text-gray-700 dark:text-[var(--color-dark-text-secondary)]">
                        {sortBy === 'recent' ? 'Most Recent' : sortBy === 'oldest' ? 'Oldest' : 'Most Read'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-500 dark:text-[var(--color-dark-text-muted)]" />
                    </button>

                    {showSortDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-[var(--color-dark-elevated-bg)] rounded-xl shadow-2xl border border-sage-200 dark:border-[var(--border-color)] py-2 z-50">
                        <button
                          onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm text-gray-700 dark:text-[var(--color-dark-text-secondary)]"
                        >
                          Most Recent
                        </button>
                        <button
                          onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm text-gray-700 dark:text-[var(--color-dark-text-secondary)]"
                        >
                          Oldest
                        </button>
                        <button
                          onClick={() => { setSortBy('most-read'); setShowSortDropdown(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] transition-colors text-sm text-gray-700 dark:text-[var(--color-dark-text-secondary)]"
                        >
                          Most Read
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowShortcutsModal(true)}
                    className="p-2 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] rounded-xl transition-colors"
                    title="Keyboard shortcuts"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-500 dark:text-[var(--color-dark-text-muted)]" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 min-h-0">
          {hasNoEntries ? (
            <div className="flex flex-col items-center justify-center py-20">
              <BookOpen className="w-16 h-16 text-[#a4c1c3] dark:text-[var(--color-dark-text-muted)] mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-[var(--color-dark-text-secondary)]">Your journal is waiting</p>
              <p className="text-sm text-gray-500 dark:text-[var(--color-dark-text-muted)] mt-2">Start writing your first entry above</p>
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([group, groupEntries]) => (
                <div key={group}>
                  <h3 className="text-[11px] font-semibold text-[#a4c1c3] dark:text-[var(--color-dark-text-muted)] uppercase tracking-wider mb-3 px-1">
                    {group}
                  </h3>
                  <div className="space-y-3">
                    {groupEntries.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => {
                          const entryDate = new Date(entry.date);
                          setSelectedDate(entryDate);
                          setCurrentMonth(new Date(entryDate.getFullYear(), entryDate.getMonth(), 1));
                          setNewEntry({
                            title: entry.title,
                            content: entry.content,
                            emoji: entry.emoji
                          });
                          // Scroll to top of editor
                          setTimeout(() => {
                            const editorElement = document.querySelector('[data-editor-section]');
                            if (editorElement) {
                              editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }}
                        className="group relative bg-[#fffef9] dark:bg-[var(--color-dark-elevated-bg)] p-4 rounded-xl border-2 border-[#e8d5b7]/60 dark:border-[var(--border-color)] hover:border-[#c9b896] dark:hover:border-[var(--color-neon-teal)] transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,115,85,0.15)] dark:hover:shadow-[0_6px_20px_rgba(0,255,200,0.2)] shadow-[0_2px_8px_rgba(139,115,85,0.08)]"
                        style={{ backgroundImage: 'linear-gradient(to bottom, #fffef9 0%, #fdfcf7 100%)' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{entry.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-serif text-[#5d4e37] dark:text-[var(--color-neon-teal)] truncate" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>{entry.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-[var(--color-dark-text-muted)]">
                                {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const entryDate = new Date(entry.date);
                                setSelectedDate(entryDate);
                                setCurrentMonth(new Date(entryDate.getFullYear(), entryDate.getMonth(), 1));
                                setNewEntry({
                                  title: entry.title,
                                  content: entry.content,
                                  emoji: entry.emoji
                                });
                                const editorElement = document.querySelector('[data-editor-section]');
                                if (editorElement) {
                                  editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="p-1.5 hover:bg-sage-50 dark:hover:bg-[var(--color-dark-card-bg)] rounded-lg transition-all"
                              title="Edit entry"
                            >
                              <Edit className="w-4 h-4 text-[#66887f] dark:text-[var(--color-neon-teal)] hover:text-[#187E5F] dark:hover:text-[var(--color-neon-teal-dim)] transition-colors" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEntry(entry.id);
                              }}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4 text-[#66887f] dark:text-[var(--color-dark-text-muted)] hover:text-[#187E5F] dark:hover:text-red-400 transition-colors" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-[#3d3428] dark:text-[var(--color-dark-text-secondary)] leading-relaxed line-clamp-2 mb-2 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                          {entry.content}
                        </p>
                        <div className="flex items-center gap-3 text-[12px] text-[#78968b] dark:text-[var(--color-dark-text-muted)]">
                          <span>{entry.emoji} {getReadTime(entry.content)}</span>
                          <span>•</span>
                          <span>{getWordCount(entry.content)} words</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
            </div>

            <div className="mt-4 pt-4 border-t border-sage-100 dark:border-[var(--border-color)] text-center">
              <p className="text-[11px] text-[#78968b] dark:text-[var(--color-dark-text-muted)] flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Your journal entries are private and secure
              </p>
            </div>
          </div>
        </div>
      </div>

      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcutsModal(false)}>
          <div className="bg-white dark:bg-[var(--color-dark-elevated-bg)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-[var(--color-light-sage)] dark:border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[var(--color-neon-teal)] mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-[var(--color-dark-text-secondary)]">Save entry</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-[var(--color-dark-card-bg)] dark:text-[var(--color-neon-teal)] rounded text-xs font-mono border border-[var(--color-light-sage)] dark:border-[var(--border-color)]">Ctrl+S</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-[var(--color-dark-text-secondary)]">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-[var(--color-dark-card-bg)] dark:text-[var(--color-neon-teal)] rounded text-xs font-mono border border-[var(--color-light-sage)] dark:border-[var(--border-color)]">?</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

    {showShortcutsModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcutsModal(false)}>
        <div className="bg-white dark:bg-[var(--color-dark-elevated-bg)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-[var(--color-light-sage)] dark:border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-[var(--color-neon-teal)] mb-4">Keyboard Shortcuts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Save entry</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+S</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show shortcuts</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">?</kbd>
            </div>
          </div>
          <button
            onClick={() => setShowShortcutsModal(false)}
            className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )}
    </>
  );
}
