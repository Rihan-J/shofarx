'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { webProjectsApi } from '../../../lib/adminApi';

import Modal from '../../../admin/components/Modal';
import PublishToggle from '../../../admin/components/PublishToggle';
import StatusBadge from '../../../admin/components/StatusBadge';

interface WebProject {
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

export default function WebProjectsPage() {
  const [items, setItems] = useState<WebProject[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WebProject | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => webProjectsApi.list().then((d) => setItems(d as unknown as WebProject[])).catch(console.error);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: WebProject) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, project_link: p.project_link || '', image_url: p.image_url || '', sort_order: p.sort_order, is_published: p.is_published });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const data = { ...form };
    if (editing) await webProjectsApi.update(editing.id, data);
    else await webProjectsApi.create(data);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await webProjectsApi.remove(id);
    load();
  };

  const handleToggle = async (id: string) => {
    await webProjectsApi.togglePublish(id);
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Web Projects</h1>
        <div className="admin-header__actions">
          <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Project</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
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
              {!items.length && <tr><td colSpan={5} className="empty-state">No web projects yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Project' : 'New Project'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>Save</button>
          </>
        }
      >
        <div className="form-field"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="form-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="form-field"><label>Project URL (Optional)</label><input placeholder="Leave blank if no live link" value={form.project_link} onChange={(e) => setForm({ ...form, project_link: e.target.value })} /></div>
        <div className="form-field"><label>Image URL</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
        <div className="form-field"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="pub" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} style={{ width: 'auto' }} />
          <label htmlFor="pub" style={{ margin: 0 }}>Publish immediately</label>
        </div>
      </Modal>
    </>
  );
}

