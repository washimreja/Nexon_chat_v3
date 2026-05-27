export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export type Model = 'Nexon-4o' | 'Nexon-4o mini' | 'Nexon-o1' | 'Nexon-o1 mini';

export const AVAILABLE_MODELS: Model[] = [
  'Nexon-4o',
  'Nexon-4o mini',
  'Nexon-o1',
  'Nexon-o1 mini',
];
