const API_BASE = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
    document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    adminFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

// Stats
export const statsApi = {
  get: () => adminFetch('/admin/stats'),
};

// Generic CRUD factory
function createCrud<T>(resource: string) {
  return {
    list: (): Promise<T[]> => adminFetch(`/admin/${resource}`),
    create: (data: Partial<T>) => adminFetch(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<T>) => adminFetch(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => adminFetch(`/admin/${resource}/${id}`, { method: 'DELETE' }),
    togglePublish: (id: string) => adminFetch(`/admin/${resource}/${id}/publish`, { method: 'PUT' }),
  };
}

export const projectsApi = createCrud<Record<string, unknown>>('projects');
export const webProjectsApi = createCrud<Record<string, unknown>>('web-projects');
export const smmProjectsApi = createCrud<Record<string, unknown>>('smm-projects');
export const achievementsApi = createCrud<Record<string, unknown>>('achievements');
export const skillsApi = createCrud<Record<string, unknown>>('skills');
export const socialApi = createCrud<Record<string, unknown>>('social');

// Messages
export const messagesApi = {
  list: () => adminFetch('/admin/messages'),
  markRead: (id: string, is_read: boolean = true) => adminFetch(`/admin/messages/${id}`, { method: 'PUT', body: JSON.stringify({ is_read }) }),
  remove: (id: string) => adminFetch(`/admin/messages/${id}`, { method: 'DELETE' }),
};

// Password
export const passwordApi = {
  change: (currentPassword: string, newPassword: string) =>
    adminFetch('/admin/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
};

// Upload
export const uploadApi = {
  upload: (base64Data: string, filename?: string) =>
    adminFetch('/upload', { method: 'POST', body: JSON.stringify({ data: base64Data, filename }) }),
};
