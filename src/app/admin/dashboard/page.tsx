import Link from 'next/link';
import { FolderKanban, Megaphone, Share2, Mail, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <div className="admin-header">
        <h1>Dashboard Quick Links</h1>
      </div>

      <div className="stats-grid">
        <Link href="/admin/projects" className="stat-card stat-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="stat-card__icon stat-card__icon--blue"><FolderKanban size={24} /></div>
          <div className="stat-card__info">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Projects</h3>
            <p style={{ margin: 0 }}>Manage Web Projects</p>
          </div>
        </Link>

        <Link href="/admin/smm" className="stat-card stat-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="stat-card__icon stat-card__icon--red"><Megaphone size={24} /></div>
          <div className="stat-card__info">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>SMM</h3>
            <p style={{ margin: 0 }}>Manage SMM Case Studies</p>
          </div>
        </Link>
        
        <Link href="/admin/social" className="stat-card stat-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="stat-card__icon stat-card__icon--cyan"><Share2 size={24} /></div>
          <div className="stat-card__info">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Social Media</h3>
            <p style={{ margin: 0 }}>Manage Social Links</p>
          </div>
        </Link>

        <Link href="/admin/messages" className="stat-card stat-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="stat-card__icon" style={{ background: '#fff4e5', color: '#ff9800' }}><Mail size={24} /></div>
          <div className="stat-card__info">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Inbox</h3>
            <p style={{ margin: 0 }}>View Contact Messages</p>
          </div>
        </Link>

        <Link href="/admin/settings" className="stat-card stat-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <div className="stat-card__icon" style={{ background: '#f3f4f6', color: '#6b7280' }}><Settings size={24} /></div>
          <div className="stat-card__info">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Settings</h3>
            <p style={{ margin: 0 }}>System Configuration</p>
          </div>
        </Link>
      </div>

      <style>{`
        .stat-card-link {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .stat-card-link:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
      `}</style>
    </>
  );
}
