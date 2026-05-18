
import 'material-icons/iconfont/material-icons.css'
import { HexColorPicker,HexColorInput } from 'react-colorful'
import {motion,AnimatePresence} from 'framer-motion'
import { useEffect, useState } from 'react'
export default function ColorPicker(props:{value:string,setter:Function}){
const [visible,setIsVisible]= useState(false)
const [color,setColor] = useState(props.value)
useEffect(()=>{setColor(props.value)},[props.value])
return (<div className='ColorPicker'
        style={{backgroundColor:color}}
        onClick={(e)=>setIsVisible(true)}>
        <AnimatePresence>
       {visible&&(<motion.div>
            <HexColorInput onChange={(newColor)=>{setColor(newColor)}} color={color}/>
            <HexColorPicker color={color} onChange={(newColor)=>{setColor(newColor)}}/>
             <button onClick={(e)=>{e.stopPropagation();props.setter(color);setIsVisible(false)}}>Submit</button>
             <button onClick={(e)=>{e.stopPropagation();props.setter(props.value);setIsVisible(false)}}>Cancel</button>
        </motion.div>)}
       
        </AnimatePresence>
</div>)
}