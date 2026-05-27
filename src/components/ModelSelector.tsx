import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { AVAILABLE_MODELS, type Model } from '../types/chat';

const MODEL_ICONS: Record<Model, typeof Sparkles> = {
  'Nexon-4o': Sparkles,
  'Nexon-4o mini': Zap,
  'Nexon-o1': Brain,
  'Nexon-o1 mini': Cpu,
};

const MODEL_DESCRIPTIONS: Record<Model, string> = {
  'Nexon-4o': 'Most capable model for complex tasks',
  'Nexon-4o mini': 'Fast and efficient for everyday tasks',
  'Nexon-o1': 'Advanced reasoning and analysis',
  'Nexon-o1 mini': 'Quick reasoning for simple problems',
};

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChat();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="model-selector">
      <button onClick={() => setOpen(!open)} className="model-selector-btn">
        Nexon Chat
        <ChevronDown size={16} className={`chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="model-dropdown">
          {AVAILABLE_MODELS.map(model => {
            const Icon = MODEL_ICONS[model];
            return (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setOpen(false);
                }}
                className={`model-option ${model === selectedModel ? 'active' : ''}`}
              >
                <Icon size={18} className="model-option-icon" />
                <div className="model-option-info">
                  <span className="model-option-name">{model}</span>
                  <span className="model-option-desc">{MODEL_DESCRIPTIONS[model]}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
