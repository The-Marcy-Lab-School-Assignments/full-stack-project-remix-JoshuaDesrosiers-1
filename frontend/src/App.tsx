import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { OrbitControls,PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Pixelation,DepthOfField,Noise,BrightnessContrast} from '@react-three/postprocessing'
import Item from './Item'
import { Outlines } from "@react-three/drei";
import { Outline } from "@react-three/postprocessing";
import {Plane} from './classes/plane'
import Vox from "./components/vox";
import PixelEditor from "./components/canvas";
import './App.css'
import BasicInput from "./components/UI/BasicInput";
import {motion} from 'framer-motion'
import Vector3Input from "./components/UI/Vector3Input";
import Toolbar from "./components/Toolbar";
import { Material } from "./classes/materials";
import MaterialMapper from "./components/Sections/MaterialMapper";
import { select } from "framer-motion/client";
import Vector2Input from "./components/UI/Vector2Input";
import ColorPicker from "./components/UI/colorPicker";
import NetMeshEditor from "./components/UI/NetMeshEditor";
export default function App() {
  //force upd func
  const [_,u] = useState(0)
  // where we set our selected element for our inspector panel (kinda like unity~)
  const [selected,setSelected] = useState<{index:number,type:'p'}|{index:string,type:'m'}|null>(null)
  const [planes, setPlanes] = useState(() => [...Plane.planes]);
  const [materials, setMaterials] = useState(() => ({...Material.materials}));
  const [color,setColor] = useState('#fffff00')
  const [pane,setPane] = useState('null')
  // helper functions for material
  const newMaterial = (url:string,name:string) => {new Material(url,name);u(v=>v++)}
  const newPlane = () => {new Plane([16,16],[0,0,0],[0,0,0]);setPlanes(() => [...Plane.planes])}
  useEffect(()=>{setMaterials(() => ({...Material.materials}));},[u])
  // useEffect with sample data
  useEffect(()=>{
    if(_<1&&(!Plane.planes.length)){
      let im = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAYAAAD37n+BAAAAI0lEQVR4AdzLMQ0AAAwCwQZdVYI2vIIGVj758SC+m3FlCyAAAAD//8H9zuUAAAAGSURBVAMAs4UaWfzBQPoAAAAASUVORK5CYII='
      let im2='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAYAAAD37n+BAAAAiElEQVR4AZSNIQqEYBCFH27dsLBlD7DZE3gBk1H4wWSx2MUDiN1i0CQIRpP3MHsAi2CwivoGDKJBf5h/5s3MN0/LlLE8CQ3bm8sJrtcisj+bgtT1t0HSOeDspwLp8xOAxd04AXTKU/3A92WM3eUEHDYvhAAv9QavhtUomXvWYML/F+CMmi7MKwAAAP//b99XWgAAAAZJREFUAwBJDThZXY66IQAAAABJRU5ErkJggg=='
      newMaterial(im,'wood')
      newMaterial(im2,'wood2')
      new Plane([12, 5], [0, 3, 0],  [90, 0, 0], 'wood')   // horizontal: corner at x=0, y=3, z=0
      new Plane([12, 6], [0, 3, 0],  [0, 0, 0],  'wood2')  // back wall:  same top-left corner
      new Plane([5, 6],  [12, 3, 0], [0, 90, 0], 'wood')
    setPlanes(() => [...Plane.planes])
    }},[])
  
  return (<>
  <Toolbar newMaterial={()=>{setPane('newM')}} newPlane = {()=>{newPlane()}}/>
  <div className="App">
  <section className="Inspector">
    <MaterialMapper materials={materials} setSelected={(v:M)=>setSelected({index:v,type:'m'})}/>
    <p className="primeText">Position</p>
    <Vector3Input
    value={(selected&&(selected.type=='p'))?Plane.planes[selected.index].pos:[0,0,0]}
    setter={(val)=>{
      setPlanes(Plane.planes.map((p,i)=>
       {
        if(i==selected?.index)p.pos=val
        return p
       }
      ));
    }}
    />
    <p className="primeText">Rotation</p>
    <Vector3Input
    value={(selected&&(selected.type=='p'))?Plane.planes[selected.index].rot:[0,0,0]}
    setter={(val)=>{
      setPlanes(Plane.planes.map((p,i)=>
       {
        if(i==selected?.index)p.rot=val
        return p
       }
      ));
    }}
    />
    <p className="primeText">Size</p>
    <Vector2Input
    value={(selected&&(selected.type=='p'))?Plane.planes[selected.index].size:[0,0]}
    setter={(val)=>{
      setPlanes(Plane.planes.map((p,i)=>
       {
        if(i==selected?.index)p.size=val
        return p
       }
      ));
    }}
    />
    <p className="primeText">Outline</p>
    <section className="">
      <p className="subText">Width</p>
      <BasicInput value={(selected&&(selected.type=='p'))?Plane.planes[selected.index].outline:''}  setter={(val:number)=>{
      setPlanes(Plane.planes.map((p,i)=>
       {
        if(i==selected?.index)p.outline=val
        return p
       }
      ));
    }}/>
    </section>
    <p className="primeText">Color</p>
    <ColorPicker value={(selected&&(selected.type=='p'))?Plane.planes[selected.index].outlineColor:''} setter={(color:string)=>{
      setPlanes(Plane.planes.map((p,i)=>
       {
        if(i==selected?.index)p.outlineColor=color
        return p
       }
      ));
    }}/>
  </section>
    <Canvas className="Renderer" camera={{ position: [16, 16, 16], fov: 0 }} 
    dpr={0.3}
      gl={{ 
        antialias: false,
        powerPreference: "high-performance" 
      }}
    >
      <PerspectiveCamera makeDefault position={[48, 48, 48]}>
        <directionalLight position={[0, 0, 0.3]} intensity={0.4} castShadow />
      </PerspectiveCamera>

      <EffectComposer multisampling={1}>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.2} height={300} />
      <ambientLight intensity={0.3} />
      {/* <Vox size={[1, 33, 33]} x={-1} y={16} z={15} cell={'rgba(120, 120, 180, 1)'}/>
      <Vox size={[33, 33, 1]} x={15} y={16} z={-1} cell={'rgba(120, 120, 180, 1)'}/> */}
      
      {/* {inter['y']&&<Vox size={[32, 1, 32]} x={15.5} y={index} z={15.5} opacity={0.2} cell={'rgba(255, 120, 180, 1)'}/>} */}

      <>
        {planes.map((v,i)=><Item plane={{...v}} index={i} isSelected={selected?(selected?.index==i)&&(selected?.type=='p'):false} setter={(plane:Plane)=>{setSelected({index:i,type:'p'})}}/>)}
          {/* <Outlines thickness={1.25} color="skyblue"/> */}
      </>

      {/* <Vox size={[33, 1, 33]} x={15} y={-1} z={15} cell={'rgba(100, 100, 160, 1)'}/> */}
      <BrightnessContrast />
      <OrbitControls />

      </EffectComposer>
    </Canvas>

 </div>
  </>);
}