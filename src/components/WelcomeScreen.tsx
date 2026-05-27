import { Image, Pencil, Globe } from 'lucide-react';
import ChatInput from './ChatInput';

export default function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="welcome-title">Where should we begin?</h1>
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
