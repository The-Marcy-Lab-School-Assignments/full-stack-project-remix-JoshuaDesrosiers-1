import type { SushiMenuItem } from '../sushi-storage';

type MenuProps = {
  sushis: SushiMenuItem[];
  editingSushiId: number | null;
  onEdit: (sushi: SushiMenuItem) => void;
};

export default function Menu({ sushis, editingSushiId, onEdit }: MenuProps) {
  if (sushis.length === 0) {
    return <p className="menu-empty">No sushi saved yet.</p>;
  }

  return (
    <section className="sushi-menu">
      {sushis.map((sushi) => (
        <article className="sushi-menu-item" key={sushi.sushi_id}>
          <div className="sushi-menu-image">
            {sushi.imageDataUrl ? (
              <img src={sushi.imageDataUrl} alt={sushi.title} />
            ) : (
              <span>No image</span>
            )}
          </div>
          <div>
            <h3>{sushi.title}</h3>
            <p>{sushi.description}</p>
          </div>
          <button type="button" onClick={() => onEdit(sushi)}>
            {editingSushiId === sushi.sushi_id ? 'Editing' : 'Edit'}
          </button>
        </article>
      ))}
    </section>
  );
}
