import { Image, Pencil, Globe } from 'lucide-react';
import ChatInput from './ChatInput';

function NexonIcon() {
  return (
    <div className="nexon-icon">
      {/* Outer rotating gradient ring */}
      <div className="nexon-icon-ring" />
      {/* Inner glow pulse */}
      <div className="nexon-icon-glow" />
      {/* Center icon — abstract "N" letterform */}
      <svg
        className="nexon-icon-svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <defs>
          <linearGradient id="nGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
        <path
          d="M8 26V6l16 20V6"
          stroke="url(#nGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <NexonIcon />
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
