
export default function Pallete({colors,setColor,selectedColor}:{colors: { [key: string]: string }, setColor: (color: string) => void, selectedColor: string}) {
return (
<ul className="pallete">
  {Object.keys(colors).map((color) => (
    <li key={color}>
      <p>{selectedColor==colors[color]?color+'*':color}</p>
      <button 
        style={{ backgroundColor: colors[color] }} 
        onClick={(e: React.MouseEvent) => {e.preventDefault(); setColor(colors[color])}} 
        className={selectedColor === colors[color] ? 'selected' : ''}
      ></button>
    </li>
  ))}
</ul>
)}