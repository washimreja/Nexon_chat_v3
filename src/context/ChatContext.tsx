import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message, Model } from '../types/chat';

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  selectedModel: Model;
  isGenerating: boolean;
  sidebarOpen: boolean;
  createNewChat: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => void;
  setSelectedModel: (model: Model) => void;
  deleteConversation: (id: string) => void;
  toggleSidebar: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SIMULATED_RESPONSES = [
  "That's a great question! Let me think about that for a moment.\n\nBased on my analysis, here's what I can tell you:\n\n1. **First point**: The key consideration here is understanding the underlying principles.\n2. **Second point**: It's important to consider multiple perspectives.\n3. **Third point**: The practical implications are quite significant.\n\nWould you like me to elaborate on any of these points?",
  "I'd be happy to help with that! Here's a comprehensive breakdown:\n\n```python\ndef example_function(data):\n    \"\"\"Process the data and return results.\"\"\"\n    results = []\n    for item in data:\n        processed = transform(item)\n        results.append(processed)\n    return results\n```\n\nThis approach offers several advantages:\n- **Efficiency**: O(n) time complexity\n- **Readability**: Clear and maintainable code\n- **Flexibility**: Easy to extend\n\nLet me know if you need any modifications!",
  "Absolutely! Here's what you need to know:\n\n## Overview\n\nThe concept you're asking about is fundamental to understanding modern systems. Let me break it down:\n\n### Key Components\n- **Architecture**: The system follows a modular design pattern\n- **Data Flow**: Information moves through well-defined pipelines\n- **Scalability**: Built to handle increasing demands\n\n### Best Practices\n1. Always validate input data\n2. Implement proper error handling\n3. Monitor performance metrics\n4. Document your approach\n\nIs there a specific aspect you'd like to dive deeper into?",
  "Great topic! Let me provide a detailed explanation.\n\nThe short answer is: **it depends on your specific use case**.\n\nHere's why:\n\n| Factor | Option A | Option B |\n|--------|----------|----------|\n| Speed | Fast | Moderate |\n| Cost | Higher | Lower |\n| Complexity | Simple | Complex |\n\nFor most scenarios, I'd recommend starting with Option A due to its simplicity, then optimizing later if needed.\n\n> \"Premature optimization is the root of all evil\" - Donald Knuth\n\nWant me to help you evaluate which option fits your needs best?",
  "That's an interesting challenge! Here's my approach:\n\n### Step 1: Analysis\nFirst, we need to understand the problem space. The key variables are:\n- Input size and format\n- Expected output\n- Performance requirements\n\n### Step 2: Implementation\n```javascript\nconst solution = (input) => {\n  const processed = input\n    .filter(item => item.isValid)\n    .map(item => transform(item))\n    .reduce((acc, val) => merge(acc, val), {});\n  \n  return optimize(processed);\n};\n```\n\n### Step 3: Verification\nAlways test with edge cases! Let me know if you'd like me to walk through the testing strategy.",
];

function getSimulatedResponse(): string {
  return SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)];
}

function generateTitle(message: string): string {
  const words = message.split(' ').slice(0, 6);
  const title = words.join(' ');
  return title.length > 40 ? title.substring(0, 40) + '...' : title + (words.length < message.split(' ').length ? '...' : '');
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model>('Nexon-4o');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

  const createNewChat = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setActiveConversationId(prevId => prevId === id ? null : prevId);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (isGenerating) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    let conversationId = activeConversationId;

    if (!conversationId) {
      conversationId = uuidv4();
      const newConversation: Conversation = {
        id: conversationId,
        title: generateTitle(content),
        messages: [userMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model: selectedModel,
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(conversationId);
    } else {
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: Date.now() }
            : c
        )
      );
    }

    setIsGenerating(true);
    const capturedId = conversationId;

    setTimeout(() => {
      const fullResponse = getSimulatedResponse();
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === capturedId
            ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() }
            : c
        )
      );

      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex += Math.floor(Math.random() * 3) + 2;
        if (charIndex >= fullResponse.length) {
          charIndex = fullResponse.length;
          clearInterval(interval);
          setIsGenerating(false);
        }
        const currentText = fullResponse.substring(0, charIndex);
        setConversations(prev =>
          prev.map(c =>
            c.id === capturedId
              ? {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMessage.id ? { ...m, content: currentText } : m
                  ),
                }
              : c
          )
        );
      }, 20);
    }, 500 + Math.random() * 1000);
  }, [activeConversationId, isGenerating, selectedModel]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        selectedModel,
        isGenerating,
        sidebarOpen,
        createNewChat,
        selectConversation,
        sendMessage,
        setSelectedModel,
        deleteConversation,
        toggleSidebar,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
