import {motion} from 'framer-motion'
import Pallete from "./Pallete";
import Canvas from "./Canvas";
import { useState } from 'react';
import { createSushi } from '../adapters/sushi-adapters';
export default function Kitchen({colors, color, setColor, setSushitrix,setScreen}: {colors: { [key: string]: string }, color: string, setColor: (color: string) => void, setSushitrix: (arr: string[][]) => void, setScreen: (screen: string) => void}){
const [kitchenState,setKitchenState] = useState('new');
return(
<motion.form className='kitchen' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{duration:0.5}}>
         
         <input type="text" id="sushiName" placeholder='Put a name to the dish' name="sushiName" required/>
         <textarea id="description" name="description" placeholder='Describe your cuisine...' required></textarea>
        <section className='pallete-canvas'>
          <Pallete colors={colors} selectedColor={color} setColor={setColor} />
          <Canvas matxSize={32} col={color} setSushitrix={(arr:string[][]) => {
            //validate form
            let sushiName = document.getElementById('sushiName') as HTMLInputElement;
            let description = document.getElementById('description') as HTMLTextAreaElement;
            if (sushiName?.checkValidity() && description?.checkValidity()) {
              setSushitrix(arr);
              createSushi(sushiName.value, description.value, arr);
            }
            }}/>
        </section>
        
</motion.form>
)
}