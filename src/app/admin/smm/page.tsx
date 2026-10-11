'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { smmProjectsApi } from '../../../lib/adminApi';

import Modal from '../../../admin/components/Modal';
import PublishToggle from '../../../admin/components/PublishToggle';
import StatusBadge from '../../../admin/components/StatusBadge';

interface SmmProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_link: string;
  category: string;
  is_published: boolean;
  sort_order: number;
}

const emptyForm = { title: '', description: '', image_url: '', project_link: '', sort_order: 0, is_published: false };

export default function SmmProjectsPage() {
  const [items, setItems] = useState<SmmProject[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SmmProject | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => smmProjectsApi.list().then((d) => setItems(d as unknown as SmmProject[])).catch(console.error);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: SmmProject) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, project_link: p.project_link || '', image_url: p.image_url || '', sort_order: p.sort_order, is_published: p.is_published });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const data = { ...form };
    if (editing) await smmProjectsApi.update(editing.id, data);
    else await smmProjectsApi.create(data);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this SMM project?')) return;
    await smmProjectsApi.remove(id);
    load();
  };

  const handleToggle = async (id: string) => {
    await smmProjectsApi.togglePublish(id);
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>SMM Projects</h1>
        <div className="admin-header__actions">
          <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add SMM Project</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client / Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Published</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</td>
                  <td><StatusBadge published={p.is_published} /></td>
                  <td><PublishToggle published={p.is_published} onToggle={() => handleToggle(p.id)} /></td>
                  <td>{p.sort_order}</td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={6} className="empty-state">No SMM projects yet. Click "Add SMM Project" to create one.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit SMM Project' : 'New SMM Project'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>Save</button>
          </>
        }
      >
        <div className="form-field"><label>Client / Project Name</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Brand XYZ" /></div>
        <div className="form-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you do for this client?" /></div>
        <div className="form-field"><label>Social Media Handle / Link</label><input placeholder="e.g. https://instagram.com/brandxyz" value={form.project_link} onChange={(e) => setForm({ ...form, project_link: e.target.value })} /></div>
        <div className="form-field"><label>Photo URL</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Paste image URL or upload via Settings" /></div>
        <div className="form-field"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="pub-smm" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} style={{ width: 'auto' }} />
          <label htmlFor="pub-smm" style={{ margin: 0 }}>Publish immediately</label>
        </div>
      </Modal>
    </>
  );
}

