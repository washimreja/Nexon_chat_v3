import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { useChat } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function AppLayout() {
  const { sidebarOpen } = useChat();

  return (
    <div className="app">
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar />
      </div>
      <ChatArea />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppLayout />
      </ChatProvider>
    </ThemeProvider>
  );
}
