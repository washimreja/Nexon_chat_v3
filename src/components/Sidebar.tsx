import { useState } from 'react';
import {
  Plus,
  Search,
  Library,
  LayoutGrid,
  Code2,
  MoreHorizontal,
  MessageSquare,
  Trash2,
  FolderPlus,
  Folder,
  Compass,
  Sparkles,
  Settings,
  LogOut,
  Sun,
  Moon,
  PanelLeftClose,
  SquarePen,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    createNewChat,
    selectConversation,
    deleteConversation,
    toggleSidebar,
  } = useChat();
  const { theme, toggleTheme } = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const today: typeof conversations = [];
  const yesterday: typeof conversations = [];
  const previous7: typeof conversations = [];
  const older: typeof conversations = [];

  const now = Date.now();
  const dayMs = 86400000;

  for (const c of conversations) {
    const age = now - c.updatedAt;
    if (age < dayMs) today.push(c);
    else if (age < 2 * dayMs) yesterday.push(c);
    else if (age < 7 * dayMs) previous7.push(c);
    else older.push(c);
  }

  const chatSections = [
    { label: 'Today', items: today },
    { label: 'Yesterday', items: yesterday },
    { label: 'Previous 7 Days', items: previous7 },
    { label: 'Older', items: older },
  ].filter(s => s.items.length > 0);

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="sidebar-icon-btn" title="Close sidebar">
          <PanelLeftClose size={20} />
        </button>
        <button onClick={createNewChat} className="sidebar-icon-btn" title="New chat">
          <SquarePen size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button onClick={createNewChat} className="sidebar-nav-item active">
          <Plus size={18} />
          <span>New chat</span>
        </button>
        <button className="sidebar-nav-item">
          <Search size={18} />
          <span>Search chats</span>
        </button>
        <button className="sidebar-nav-item">
          <Library size={18} />
          <span>Library</span>
        </button>
        <button className="sidebar-nav-item">
          <LayoutGrid size={18} />
          <span>Apps</span>
        </button>
        <button className="sidebar-nav-item">
          <Code2 size={18} />
          <span>Codex</span>
        </button>
        <button className="sidebar-nav-item">
          <MoreHorizontal size={18} />
          <span>More</span>
        </button>
      </nav>

      {/* Scrollable content area */}
      <div className="sidebar-content">
        {/* GPTs Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">GPTs</h3>
          <button className="sidebar-nav-item">
            <Sparkles size={16} />
            <span>Nexon Assistant</span>
          </button>
          <button className="sidebar-nav-item">
            <Code2 size={16} />
            <span>Code Helper</span>
          </button>
          <button className="sidebar-nav-item">
            <Compass size={16} />
            <span>Explore GPTs</span>
          </button>
        </div>

        {/* Projects Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Projects</h3>
          <button className="sidebar-nav-item">
            <FolderPlus size={16} />
            <span>New project</span>
          </button>
          <button className="sidebar-nav-item">
            <Folder size={16} />
            <span>My Projects</span>
          </button>
        </div>

        {/* Chat History */}
        {chatSections.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Recent Chats</h3>
            {chatSections.map(section => (
              <div key={section.label} className="chat-group">
                <span className="chat-group-label">{section.label}</span>
                {section.items.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`sidebar-chat-item ${conv.id === activeConversationId ? 'active' : ''}`}
                  >
                    <MessageSquare size={16} className="chat-icon" />
                    <span className="chat-title">{conv.title}</span>
                    {(hoveredId === conv.id || conv.id === activeConversationId) && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="chat-delete-btn"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User section */}
      <div className="sidebar-footer">
        {showUserMenu && (
          <div className="user-menu">
            <button onClick={toggleTheme} className="user-menu-item">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="user-menu-item">
              <Settings size={16} />
              Settings
            </button>
            <div className="user-menu-divider" />
            <button className="user-menu-item danger">
              <LogOut size={16} />
              Log out
            </button>
          </div>
        )}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="user-profile-btn"
        >
          <div className="user-avatar">W</div>
          <span className="user-name">washim reja</span>
          <span className="user-plan">Go</span>
        </button>
      </div>
    </div>
  );
}
