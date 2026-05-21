export type Sushi = {
  sushi_id: number;
  title: string;
  description: string;
  matrix: string[][];
  user_id: number;
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

export const fetchAllSushis = async () => {
  return handleFetch<Sushi[]>('/api/sushis');
};

export const createSushi = async (title: string, description: string, matrix: string[][]) => {
  return handleFetch<Sushi>('/api/sushis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, matrix }),
  });
};

export const updateSushi = async (
  sushi_id: number,
  updates: Partial<Pick<Sushi, 'title' | 'description' | 'matrix'>>
) => {
  return handleFetch<Sushi>(`/api/sushis/${sushi_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteSushi = async (sushi_id: number) => {
  return handleFetch<Sushi>(`/api/sushis/${sushi_id}`, { method: 'DELETE' });
};
