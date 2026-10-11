'use client';
import { useState, useEffect } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { messagesApi } from '../../../lib/adminApi';

import StatusBadge from '../../../admin/components/StatusBadge';

interface Message {
  id: string; name: string; email: string; message: string;
  is_read: boolean; created_at: string; ip?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () => messagesApi.list().then((d) => setMessages(d as Message[])).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSelect = async (m: Message) => {
    setSelected(m);
    if (!m.is_read) {
      await messagesApi.markRead(m.id, true);
      load();
      setSelected({ ...m, is_read: true });
    }
  };

  const handleToggleRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selected) return;
    const newStatus = !selected.is_read;
    await messagesApi.markRead(selected.id, newStatus);
    setSelected({ ...selected, is_read: newStatus });
    load();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selected) return;
    if (!window.confirm('Delete this message permanently?')) return;
    await messagesApi.remove(selected.id);
    setSelected(null);
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Messages</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1rem' }}>
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message-card ${!m.is_read ? 'message-card--unread' : ''}`}
              onClick={() => handleSelect(m)}
              style={{ background: selected?.id === m.id ? '#f0f0f8' : undefined }}
            >
              <div className="message-card__header">
                <span className="message-card__name">{m.name}</span>
                <span className="message-card__date">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <div className="message-card__email">{m.email}</div>
              <div className="message-card__body" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.message}
              </div>
              <div style={{ marginTop: '0.4rem' }}><StatusBadge read={m.is_read} type="read" /></div>
            </div>
          ))}
          {!messages.length && <div className="empty-state">No messages yet</div>}
        </div>

        {selected && (
          <div className="admin-card" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleToggleRead} className="btn btn--ghost btn--icon" title={selected.is_read ? "Mark as unread" : "Mark as read"}>
                {selected.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
              </button>
              <button onClick={handleDelete} className="btn btn--danger btn--icon" title="Delete message" style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                <Trash2 size={16} />
              </button>
            </div>
            <h3 style={{ marginBottom: '0.5rem', paddingRight: '5rem' }}>{selected.name}</h3>
            <p style={{ color: '#667eea', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{selected.email}</p>
            <p style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '1rem' }}>{new Date(selected.created_at).toLocaleString()}</p>
            <p style={{ lineHeight: 1.6, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
          </div>
        )}
      </div>
    </>
  );
}

