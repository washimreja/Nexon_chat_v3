import { useState, useRef, useEffect } from 'react';
import { Plus, ArrowUp, Mic, AudioLines } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function ChatInput() {
  const { sendMessage, isGenerating } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;
    sendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        <button className="input-attach-btn" title="Attach">
          <Plus size={20} />
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          rows={1}
          className="chat-textarea"
        />
        <div className="input-actions">
          <button className="input-action-btn search-btn" title="Search the web">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button className="input-action-btn mic-btn" title="Voice input">
            <Mic size={20} />
          </button>
          {input.trim() ? (
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="input-send-btn"
              title="Send"
            >
              <ArrowUp size={20} />
            </button>
          ) : (
            <button className="input-voice-btn" title="Voice mode">
              <AudioLines size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
