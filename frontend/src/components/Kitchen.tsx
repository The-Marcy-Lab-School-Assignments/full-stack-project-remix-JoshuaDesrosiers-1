import { useState } from 'react';
import {motion} from 'framer-motion'
import Pallete from "./Pallete";
import Canvas from "./Canvas";
import Menu from './menu';
import { createSushi, fetchAllSushis, updateSushi } from '../adapters/sushi-adapters';
import {
  mergeSushisWithStoredImages,
  saveSushiImageRecord,
  updateSushiImageRecord,
  type SushiMenuItem,
} from '../sushi-storage';

type KitchenProps = {
  colors: Record<string, string>;
  color: string;
  setColor: (color: string) => void;
  setSushitrix: (arr: string[][]) => void;
};

type KitchenTab = 'create' | 'current';

export default function Kitchen({colors, color, setColor, setSushitrix}: KitchenProps){
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [activeTab, setActiveTab] = useState<KitchenTab>('create');
const [savedSushis, setSavedSushis] = useState<SushiMenuItem[]>([]);
const [editingSushiId, setEditingSushiId] = useState<number | null>(null);
const [editTitle, setEditTitle] = useState('');
const [editDescription, setEditDescription] = useState('');
const [statusMessage, setStatusMessage] = useState<string | null>(null);

const loadSavedSushis = async () => {
  const { data, error } = await fetchAllSushis();

  if (error) {
    setStatusMessage(error.message);
    return;
  }

  setSavedSushis(mergeSushisWithStoredImages(data ?? []));
};

const handleSushitrixReady = async ({ matrix, imageDataUrl }: { matrix: string[][]; imageDataUrl: string }) => {
  if (!title.trim() || !description.trim()) return;

  setStatusMessage(null);
  setSushitrix(matrix);

  const { data: sushi, error } = await createSushi(title.trim(), description.trim(), matrix);

  if (error || !sushi) {
    setStatusMessage(error?.message ?? 'Unable to save sushi.');
    return;
  }

  saveSushiImageRecord({
    sushi_id: sushi.sushi_id,
    title: sushi.title,
    description: sushi.description,
    imageDataUrl,
  });

  setTitle('');
  setDescription('');
  await loadSavedSushis();
  setActiveTab('current');
};

const startEditing = (sushi: SushiMenuItem) => {
  setEditingSushiId(sushi.sushi_id);
  setEditTitle(sushi.title);
  setEditDescription(sushi.description);
};

const showCurrentSushis = () => {
  setActiveTab('current');
  void loadSavedSushis();
};

const saveEdits = async () => {
  if (!editingSushiId || !editTitle.trim() || !editDescription.trim()) return;

  setStatusMessage(null);
  const { data: updatedSushi, error } = await updateSushi(editingSushiId, {
    title: editTitle.trim(),
    description: editDescription.trim(),
  });

  if (error || !updatedSushi) {
    setStatusMessage(error?.message ?? 'Unable to update sushi.');
    return;
  }

  updateSushiImageRecord(updatedSushi.sushi_id, {
    title: updatedSushi.title,
    description: updatedSushi.description,
  });
  setEditingSushiId(null);
  await loadSavedSushis();
};

return(
<motion.form className='kitchen' onSubmit={(event) => event.preventDefault()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{duration:0.5}}>
  <nav className="kitchen-tabs">
    <button type="button" className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>
      Create
    </button>
    <button type="button" className={activeTab === 'current' ? 'active' : ''} onClick={showCurrentSushis}>
      Current
    </button>
  </nav>

  {statusMessage && <p className="kitchen-status">{statusMessage}</p>}

  {activeTab === 'create' && (
    <>
      <input type="text" id="sushiName" placeholder='Put a name to the dish' name="sushiName" value={title} onChange={(event) => setTitle(event.target.value)} required/>
      <textarea id="description" name="description" placeholder='Describe your cuisine...' value={description} onChange={(event) => setDescription(event.target.value)} required></textarea>
      <section className='pallete-canvas'>
        <Pallete colors={colors} selectedColor={color} setColor={setColor} />
        <Canvas matxSize={32} col={color} setSushitrix={handleSushitrixReady}/>
      </section>
    </>
  )}

  {activeTab === 'current' && (
    <section className="current-sushi-panel">
      <Menu sushis={savedSushis} editingSushiId={editingSushiId} onEdit={startEditing} />
      {editingSushiId && (
        <div className="sushi-editor">
          <input type="text" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
          <textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} />
          <div className="sushi-editor-actions">
            <button type="button" onClick={saveEdits}>Save</button>
            <button type="button" onClick={() => setEditingSushiId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  )}
</motion.form>
)
}
