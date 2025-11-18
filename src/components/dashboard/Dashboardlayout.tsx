import { Menu, X, Home, MessageSquare, BookOpen, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import JournalEntryCard from './JournalEntryCard'; // Assume this component is used here

// Define shared colors
const darkBackground = '#1e2936';
const darkAccent = '#5a7f6a';
const lightText = '#F0F4F8';

// Placeholder for a Metric Card
const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="p-6 bg-white dark:bg-[#253240] rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border-t-4" style={{ borderColor: color }}>
    <div className="flex items-start justify-between">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
      <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </div>
    <div className="mt-1">
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// Placeholder for a Quick Access Card
const QuickAccessCard = ({ title, description, icon: Icon, color }) => (
    <div className="col-span-1 p-6 bg-white dark:bg-[#253240] rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-[#283647]">
        <div className="flex justify-between items-center">
            <Icon className="w-8 h-8" style={{ color: color }} />
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
);


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: Home, link: '#', current: true },
    { name: 'NIRA Chat', icon: MessageSquare, link: '#', current: false },
    { name: 'Journal', icon: BookOpen, link: '#', current: false },
    { name: 'Settings', icon: Settings, link: '#', current: false },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-[${darkBackground}] transition-colors duration-500`}>
      {/* Sidebar - Fixed width for desktop, full screen for mobile */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-white dark:bg-[#1a232f] shadow-2xl md:shadow-none border-r dark:border-[#283647]`}>
        {/* Sidebar Header/Close Button */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">
            <span className={`text-[${darkAccent}]`}>Mind</span>
            <span className="text-orange-500">Shift</span>
          </h1>
          <button onClick={toggleSidebar} className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                item.current
                  ? `bg-[${darkAccent}]/20 text-[${darkAccent}] dark:bg-[${darkAccent}]/40 dark:text-white font-semibold`
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#253240]'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${item.current ? 'text-[${darkAccent}] dark:text-white' : 'text-gray-400 dark:text-gray-400 group-hover:text-[${darkAccent}]'}`} />
              <span className="text-sm">{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-[#283647]">
             <a
              href="#"
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group text-red-500 hover:bg-red-50 dark:hover:bg-[#253240]`}
            >
              <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-500" />
              <span className="text-sm">Logout</span>
            </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar for Mobile */}
        <header className={`sticky top-0 z-30 bg-white/90 dark:bg-[${darkBackground}]/90 backdrop-blur-sm border-b dark:border-[#283647] p-4 md:hidden flex justify-between items-center`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <button onClick={toggleSidebar} className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content Wrapper */}
        <main className="p-4 md:p-8">
          <h2 className="hidden md:block text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome Back!</h2>

          {/* Metrics Grid (Fixes 'clustered' issue) */}
          <section className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Your Progress Summary</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Total Sessions" value="24" icon={MessageSquare} color={darkAccent} />
              <MetricCard title="Current Mood" value="Calm" icon={Smile} color="#f7941d" />
              <MetricCard title="Journal Entries" value="12" icon={BookOpen} color="#10b981" />
              <MetricCard title="Streak" value="5 Days" icon={ChevronRight} color="#6366f1" />
            </div>
          </section>
          
          {/* Quick Actions and Journal Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Left Column - Journal & Quick Access */}
            <div className="lg:col-span-5 space-y-8">
                 {/* Quick Access Grid */}
                <section>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                         <QuickAccessCard title="Chat with NIRA" description="Start a new session now" icon={MessageSquare} color={darkAccent} />
                         <QuickAccessCard title="New Journal Entry" description="Document your thoughts" icon={BookOpen} color="#f7941d" />
                    </div>
                </section>

                {/* Journal Section (Using improved card) */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Journal Entries</h3>
                        <button className={`text-sm text-[${darkAccent}] hover:underline`}>View All</button>
                    </div>
                    <div className="space-y-4">
                        <JournalEntryCard 
                            date="Nov 18, 2025" 
                            title="A breakthrough moment" 
                            summary="Reflecting on the conversation with my sister about my work-life balance..."
                        />
                        <JournalEntryCard 
                            date="Nov 17, 2025" 
                            title="Feeling overwhelmed at work" 
                            summary="Today was a heavy day. I need to practice boundary setting..."
                        />
                    </div>
                </section>
            </div>

            {/* Right Column - NIRA Conversation Preview */}
            <section className="lg:col-span-7">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Latest NIRA Conversation</h3>
              {/* Placeholder for NIRA Chat component */}
              <div className={`p-8 h-96 bg-white dark:bg-[#253240] rounded-2xl shadow-xl border border-l-4 border-[${darkAccent}] flex items-center justify-center text-gray-500 dark:text-gray-400`}>
                <p className="italic">Your latest chat history with NIRA will appear here...</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}