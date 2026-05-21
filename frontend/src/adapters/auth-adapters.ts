export type User = {
  user_id: number;
  username: string;
};

type FetchResult<T> = {
  data: T | null;
  error: Error | null;
};

const handleFetch = async <T>(url: string, options: RequestInit = {}): Promise<FetchResult<T>> => {
  try {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...options,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error || data?.message || `${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Request failed.'),
    };
  }
};

export const getMe = async () => {
  return handleFetch<User | null>('/api/auth/me');
};

export const register = async (username: string, password: string) => {
  return handleFetch<User>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const login = async (username: string, password: string) => {
  return handleFetch<User>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const logout = async () => {
  return handleFetch<{ message: string }>('/api/auth/logout', { method: 'DELETE' });
};
