import React, { useState } from 'react';
import { Send, Search, User, MoreVertical, Paperclip } from 'lucide-react';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');

  const chats = [
    { id: 1, name: 'Farmer John', lastMsg: 'The wheat is ready for pickup.', time: '10:30 AM', online: true },
    { id: 2, name: 'Buyer Sarah', lastMsg: 'Can you provide organic certification?', time: 'Yesterday', online: false },
    { id: 3, name: 'Logistics - Robert', lastMsg: 'Truck will arrive at 2 PM.', time: '2 days ago', online: true },
  ];

  const messages = [
    { id: 1, sender: 'Farmer John', text: 'Hello! I saw your order for the organic wheat.', time: '10:00 AM', mine: false },
    { id: 2, sender: 'Me', text: 'Hi John! Yes, we are excited about it. When is the harvest?', time: '10:15 AM', mine: true },
    { id: 3, sender: 'Farmer John', text: 'The wheat is ready for pickup.', time: '10:30 AM', mine: false },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 120px)' }}>
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Messages</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="form-control" 
                style={{ paddingLeft: '35px', fontSize: '0.9rem' }}
              />
            </div>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat.id)}
                style={{ 
                  padding: '1.2rem', 
                  display: 'flex', 
                  gap: '1rem', 
                  cursor: 'pointer',
                  background: selectedChat === chat.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  borderLeft: selectedChat === chat.id ? '4px solid var(--primary)' : '4px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} color="var(--text-muted)" />
                  </div>
                  {chat.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', border: '2px solid var(--bg-card)' }}></div>}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{chat.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chat.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.lastMsg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ margin: 0 }}>{chats.find(c => c.id === selectedChat)?.name}</h3>
              <span className="badge-sm" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>Online</span>
            </div>
            <MoreVertical size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.mine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                <div style={{ 
                  padding: '1rem 1.2rem', 
                  borderRadius: msg.mine ? '20px 20px 0 20px' : '20px 20px 20px 0',
                  background: msg.mine ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: msg.mine ? 'white' : 'inherit'
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: msg.mine ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.5rem' }}><Paperclip size={20} /></button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="form-control" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
