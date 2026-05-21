import sushi1 from '../assets/sushi.png'
import sushi2 from '../assets/sushi2.png'
import hand from '../assets/hand.png'
import { useState } from 'react'
import type { Screen } from '../App'

export default function Navigator({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [curLogo, setCurLogo] = useState(true)
  return (
    <div className="navigator">
      <img src={curLogo?sushi1:sushi2} alt="Sushi" className='logo' onClick={()=>setCurLogo(curLogo=>!curLogo)}/>
      <span>SushExtrude</span>
      {/* <button onClick={()=>{setScreen('home')}}>Home<img className='hand' src={hand}></img></button> */}
      <button onClick={()=>{setScreen('kitchen')}}>Kitchen&nbsp;<img className='hand' src={hand}></img></button>
    </div>
  );
}
