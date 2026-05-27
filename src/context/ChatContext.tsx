import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
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

const GEMINI_MODEL_MAP: Record<Model, string> = {
  'Nexon-4o': 'gemini-2.0-flash',
  'Nexon-4o mini': 'gemini-2.0-flash-lite',
  'Nexon-o1': 'gemini-2.5-flash-preview-05-20',
  'Nexon-o1 mini': 'gemini-2.0-flash-lite',
};

const FALLBACK_RESPONSES = [
  "I'm sorry, I couldn't connect to the AI service right now. Please check that your API key is configured in the `.env` file:\n\n```\nVITE_GEMINI_API_KEY=your_api_key_here\n```\n\nYou can get a free API key at: https://aistudio.google.com/app/apikey",
  "API connection failed. Make sure `VITE_GEMINI_API_KEY` is set in your `.env` file and restart the dev server.",
];

function generateTitle(message: string): string {
  const words = message.split(' ').slice(0, 6);
  const title = words.join(' ');
  return title.length > 40 ? title.substring(0, 40) + '...' : title + (words.length < message.split(' ').length ? '...' : '');
}

function buildGeminiContents(messages: Message[]) {
  return messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model>('Nexon-4o');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

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
    let existingMessages: Message[] = [];

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
      existingMessages = [userMessage];
    } else {
      const current = conversations.find(c => c.id === conversationId);
      existingMessages = current ? [...current.messages, userMessage] : [userMessage];
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
    const assistantMessageId = uuidv4();

    const assistantMessage: Message = {
      id: assistantMessageId,
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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = FALLBACK_RESPONSES[0];
      streamFallback(capturedId, assistantMessageId, fallback);
      return;
    }

    const geminiModel = GEMINI_MODEL_MAP[selectedModel];
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const controller = new AbortController();
    abortRef.current = controller;

    const body = {
      contents: buildGeminiContents(existingMessages),
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
      systemInstruction: {
        parts: [{ text: 'You are Nexon Chat, a helpful AI assistant. Respond in markdown when appropriate. Be concise, helpful, and friendly.' }],
      },
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(`API error ${response.status}: ${errText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let accumulated = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                accumulated += text;
                const snapshot = accumulated;
                setConversations(prev =>
                  prev.map(c =>
                    c.id === capturedId
                      ? {
                          ...c,
                          messages: c.messages.map(m =>
                            m.id === assistantMessageId ? { ...m, content: snapshot } : m
                          ),
                        }
                      : c
                  )
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        setIsGenerating(false);
        abortRef.current = null;
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          setIsGenerating(false);
          return;
        }
        console.error('Gemini API error:', err);
        const errorMsg = `Sorry, I encountered an error connecting to the AI service.\n\n**Error:** ${err.message}\n\nPlease verify your API key is valid and try again.`;
        streamFallback(capturedId, assistantMessageId, errorMsg);
      });

    function streamFallback(convId: string, msgId: string, text: string) {
      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex += Math.floor(Math.random() * 3) + 2;
        if (charIndex >= text.length) {
          charIndex = text.length;
          clearInterval(interval);
          setIsGenerating(false);
        }
        const current = text.substring(0, charIndex);
        setConversations(prev =>
          prev.map(c =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === msgId ? { ...m, content: current } : m
                  ),
                }
              : c
          )
        );
      }, 20);
    }
  }, [activeConversationId, conversations, isGenerating, selectedModel]);

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
