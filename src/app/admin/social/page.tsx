'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { socialApi } from '../../../lib/adminApi';

import Modal from '../../../admin/components/Modal';
import PublishToggle from '../../../admin/components/PublishToggle';
import StatusBadge from '../../../admin/components/StatusBadge';

interface SocialLink {
  id: string; name: string; url: string; icon: string;
  is_published: boolean; sort_order: number;
}

const emptyForm = { name: '', url: '', icon: '', sort_order: 0, is_published: false };

export default function SocialPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => socialApi.list().then((d) => setItems(d as unknown as SocialLink[])).catch(console.error);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: SocialLink) => {
    setEditing(s);
    setForm({ name: s.name, url: s.url, icon: s.icon, sort_order: s.sort_order, is_published: s.is_published });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (editing) await socialApi.update(editing.id, form);
    else await socialApi.create(form);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    await socialApi.remove(id);
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Social Links</h1>
        <div className="admin-header__actions">
          <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Link</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Name</th><th>URL</th><th>Icon</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>{s.url}</a></td>
                  <td>{s.icon}</td>
                  <td><StatusBadge published={s.is_published} /></td>
                  <td><PublishToggle published={s.is_published} onToggle={() => { socialApi.togglePublish(s.id).then(load); }} /></td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(s)}><Pencil size={14} /></button>
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={6} className="empty-state">No social links yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Social Link' : 'New Social Link'}
        onClose={() => setModalOpen(false)}
        footer={<><button className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn--primary" onClick={handleSave}>Save</button></>}
      >
        <div className="form-field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="GitHub" /></div>
        <div className="form-field"><label>URL</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://github.com/..." /></div>
        <div className="form-field"><label>Icon</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="github" /></div>
        <div className="form-field"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="pub-social" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} style={{ width: 'auto' }} />
          <label htmlFor="pub-social" style={{ margin: 0 }}>Publish immediately</label>
        </div>
      </Modal>
    </>
  );
}

