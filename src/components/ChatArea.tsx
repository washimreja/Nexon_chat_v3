import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import WelcomeScreen from './WelcomeScreen';
import { PanelLeftOpen, RotateCw } from 'lucide-react';

export default function ChatArea() {
  const { activeConversation, sidebarOpen, toggleSidebar, isGenerating } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  return (
    <div className="chat-area">
      {/* Top bar */}
      <div className="chat-topbar">
        <div className="topbar-left">
          {!sidebarOpen && (
            <button onClick={toggleSidebar} className="sidebar-toggle-btn" title="Open sidebar">
              <PanelLeftOpen size={20} />
            </button>
          )}
          <ModelSelector />
        </div>
        <button className="topbar-action-btn" title="Temporary chat">
          <RotateCw size={18} />
        </button>
      </div>

      {/* Chat content */}
      {!activeConversation ? (
        <WelcomeScreen />
      ) : (
        <div className="chat-messages-area">
          <div className="chat-messages">
            {activeConversation.messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLatest={i === activeConversation.messages.length - 1}
              />
            ))}
            {isGenerating && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
              <div className="message-row assistant">
                <div className="message-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput />
        </div>
      )}
    </div>
  );
}
