'use client';


export default function SettingsPage() {
  return (
    <>
      <div className="admin-header">
        <h1>Settings</h1>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>🔐 Admin Credentials</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Admin credentials are managed via environment variables for maximum security.
          No passwords are stored in the database.
        </p>

        <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.8 }}>
          <div><strong>ADMIN_EMAIL</strong> — Your login email</div>
          <div><strong>ADMIN_PASSWORD_HASH</strong> — bcrypt hash of your password</div>
          <div><strong>JWT_SECRET</strong> — Secret for signing tokens</div>
        </div>

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1rem' }}>To Change Your Password:</h4>
        <ol style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
          <li>
            Generate a new bcrypt hash:<br />
            <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
              node -e "require('bcryptjs').hash('NEW_PASSWORD', 10).then(h =&gt; console.log(h))"
            </code>
          </li>
          <li>Update <code>ADMIN_PASSWORD_HASH</code> in your <code>.env.local</code> file</li>
          <li>Update the same variable in your Vercel project settings</li>
          <li>Redeploy to apply changes</li>
        </ol>
      </div>

      <div className="admin-card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>🌐 Environment Status</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {['DATABASE_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'UPSTASH_REDIS_REST_URL', 'ADMIN_EMAIL', 'JWT_SECRET'].map((v) => (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontFamily: 'monospace' }}>{v}</span>
              <span style={{ color: '#aaa' }}>— configured on server</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

