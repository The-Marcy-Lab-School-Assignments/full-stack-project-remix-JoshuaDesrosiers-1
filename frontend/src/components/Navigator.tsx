
import sushi1 from '../assets/sushi.png'
import sushi2 from '../assets/sushi2.png'
import hand from '../assets/hand.png'
import { useState } from 'react'
export default function Navigator({ setScreen }: { setScreen: (screen: string) => void }) {
  const [curLogo, setCurLogo] = useState(1)
  return (
    <div className="navigator">
      <img src={curLogo?sushi1:sushi2} alt="Sushi" className='logo' onClick={(e)=>setCurLogo(curLogo=>curLogo?0:1)}/>
      <span>SushExtrude</span>
      <button onClick={()=>{setScreen('home')}}>Home<img className='hand' src={hand}></img></button>
      <button onClick={()=>{setScreen('kitchen')}}>Kitchen&nbsp;<img className='hand' src={hand}></img></button>
      <button onClick={()=>{setScreen('shop')}}>Shop<img className='hand' src={hand}></img></button>
    </div>
  );
}