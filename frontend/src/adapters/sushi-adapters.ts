import type { StringController } from "three/examples/jsm/libs/lil-gui.module.min.js";

const handleFetch = async (url:string, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllSushis = async () => {
  return handleFetch('/api/sushis');
};

export const createSushi = async (title:string, description:string,matrix:string[][]) => {
  return handleFetch('/api/sushis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, matrix }),
  });
};

export const updateSushi = async (sushi_id:string, updates:{title?:string,description?:string}) => {
  return handleFetch(`/api/sushis/${sushi_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteSushi = async (sushi_id:string) => {
  return handleFetch(`/api/sushis/${sushi_id}`, { method: 'DELETE' });
};
