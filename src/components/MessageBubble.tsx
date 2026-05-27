import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Volume2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types/chat';

interface Props {
  message: Message;
  isLatest: boolean;
}

export default function MessageBubble({ message, isLatest }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === 'user') {
    return (
      <div className="message-row user">
        <div className="message-bubble user">
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-row assistant">
      <div className="message-avatar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="message-content">
        <div className="markdown-body">
          <ReactMarkdown
            components={{
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                if (isInline) {
                  return (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <div className="code-block">
                    <div className="code-block-header">
                      <span>{match[1]}</span>
                      <button onClick={handleCopy} className="code-copy-btn">
                        <Copy size={14} />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {message.content && (!isLatest || message.content.length > 10) && (
          <div className="message-actions">
            <button onClick={handleCopy} title="Copy">
              <Copy size={16} />
            </button>
            <button title="Read aloud">
              <Volume2 size={16} />
            </button>
            <button title="Good response">
              <ThumbsUp size={16} />
            </button>
            <button title="Bad response">
              <ThumbsDown size={16} />
            </button>
            <button title="Regenerate">
              <RefreshCw size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
