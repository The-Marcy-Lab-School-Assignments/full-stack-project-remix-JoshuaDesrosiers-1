import { useState } from "react";
import IconButton from "./UI/IconButton";
import { AnimatePresence,motion } from "framer-motion";
export default function Toolbar({newMaterial,newPlane}:{newMaterial:Function,newPlane:Function}){
    const [states,setStates] = useState({'AddMenu':false})
    const offState = (state:string) => {let _ ={...states}; _[state]=false;setStates({..._})}
    const onState = (state:string) => {let _ ={...states}; _[state]=true;setStates({..._})}
    const togState = (state:string) => {let _ ={...states}; _[state]=!_[state];setStates({..._})}
    return(<div className="Toolbar">
        <div className="AddMenu" tabIndex={1} onBlur={(e)=>{offState('AddMenu')}}>
        <IconButton icon="add" onClick={(e)=>{togState('AddMenu')}}/>
       <AnimatePresence>
            {states["AddMenu"]&&(
            <motion.ul className="Menu" initial={{opacity:1}} exit={{opacity:0}}>
                <li><button onClick={()=>newMaterial()}>new material</button></li>
                <li><button onClick={()=>newPlane()}>new Plane</button></li>
                <li><button>new voxel</button></li>
            </motion.ul>)}
        </AnimatePresence>
        </div>
        
        </div>)
}