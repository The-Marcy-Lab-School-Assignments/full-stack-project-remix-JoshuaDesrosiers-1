import type { Sushi } from './adapters/sushi-adapters';

const STORAGE_KEY = 'sushextrude:sushi-images';

export type SushiImageRecord = {
  sushi_id: number;
  title: string;
  description: string;
  imageDataUrl: string;
  updatedAt: string;
};

export type SushiMenuItem = Sushi & {
  imageDataUrl: string | null;
};

const readImageRecords = (): SushiImageRecord[] => {
  try {
    const rawRecords = localStorage.getItem(STORAGE_KEY);
    if (!rawRecords) return [];

    const records = JSON.parse(rawRecords);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
};

const writeImageRecords = (records: SushiImageRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const saveSushiImageRecord = (record: Omit<SushiImageRecord, 'updatedAt'>) => {
  const records = readImageRecords();
  const nextRecord: SushiImageRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
  };

  writeImageRecords([
    nextRecord,
    ...records.filter((storedRecord) => storedRecord.sushi_id !== record.sushi_id),
  ]);
};

export const updateSushiImageRecord = (
  sushi_id: number,
  updates: Pick<SushiImageRecord, 'title' | 'description'>
) => {
  const records = readImageRecords();

  writeImageRecords(
    records.map((record) =>
      record.sushi_id === sushi_id
        ? { ...record, ...updates, updatedAt: new Date().toISOString() }
        : record
    )
  );
};

export const mergeSushisWithStoredImages = (sushis: Sushi[]): SushiMenuItem[] => {
  const recordsById = new Map(
    readImageRecords().map((record) => [record.sushi_id, record])
  );

  return sushis.map((sushi) => ({
    ...sushi,
    imageDataUrl: recordsById.get(sushi.sushi_id)?.imageDataUrl ?? null,
  }));
};
