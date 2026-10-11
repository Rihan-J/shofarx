'use client';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../../admin/context/AuthContext';
import '../../../admin/styles/admin.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Success! Redirect to dashboard manually
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo-container">
          <Image src="/shofarx-logo.png" alt="Shofar-X" width={160} height={40} className="login-logo-image" style={{ width: 'auto', height: '40px' }} />
        </div>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          Admin Panel
        </h1>
        <p>Sign in to manage Shofar-X</p>

        {error && <div className="login-error">{error}</div>}

        <div className="form-field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus placeholder="admin@example.com" />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <a
          href="/"
          className="back-to-webpage"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '1.5rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e8613c')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          ← Back to Shofar-X
        </a>
      </form>
    </div>
  );
}

