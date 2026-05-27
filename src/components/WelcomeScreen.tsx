import { Image, Pencil, Globe } from 'lucide-react';
import ChatInput from './ChatInput';

function NexonSparkle() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="welcome-sparkle">
      <defs>
        <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c6fe0">
            <animate attributeName="stop-color" values="#7c6fe0;#4a90d9;#6ee7b7;#7c6fe0" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#4a90d9">
            <animate attributeName="stop-color" values="#4a90d9;#6ee7b7;#7c6fe0;#4a90d9" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#6ee7b7">
            <animate attributeName="stop-color" values="#6ee7b7;#7c6fe0;#4a90d9;#6ee7b7" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <path
        d="M24 4L28 18L42 24L28 30L24 44L20 30L6 24L20 18Z"
        fill="url(#sparkleGrad)"
      />
    </svg>
  );
}

export default function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <NexonSparkle />
        <h1 className="welcome-title">What should we focus on?</h1>
        <ChatInput />
        <div className="welcome-actions">
          <button className="welcome-action-btn">
            <Image size={18} />
            <span>Create an image</span>
          </button>
          <button className="welcome-action-btn">
            <Pencil size={18} />
            <span>Write or edit</span>
          </button>
          <button className="welcome-action-btn">
            <Globe size={18} />
            <span>Look something up</span>
          </button>
        </div>
      </div>
    </div>
  );
}
