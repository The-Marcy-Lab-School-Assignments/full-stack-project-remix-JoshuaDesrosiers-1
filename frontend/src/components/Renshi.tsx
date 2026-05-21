import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing"
import { AnimatePresence, motion } from "framer-motion"
export default function Renshi({sushitrix}:{sushitrix: string[][]|null}) {
    return (<AnimatePresence>
        
        {sushitrix && (<motion.div
        initial={{ bottom: '-100%'}}
        animate={{ bottom: '20%' }}
        exit={{ bottom: -1000 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="renshi-container"
        >
        <Canvas className="renshi"
        frameloop="demand"
        camera={{ position:[0,40,60], zoom:1.5, rotateY:Math.PI,fov:70 }}
        dpr={0.5}
        gl={{
            antialias: false,
            preserveDrawingBuffer: true,
            

        }}
        >
            <ambientLight intensity={1.5} />
            <directionalLight
  position={[50, 9, 0]} 
  intensity={10} 
  castShadow
  shadow-mapSize={[2048, 2048]} 
  shadow-bias={-0.0001}/>  
              <directionalLight
  position={[50, 0, -10]} 
  scale={[0,2,0]}
  intensity={10} 
  castShadow
  shadow-mapSize={[2048, 2048]} 
  shadow-bias={-0.0001}/>  
            <mesh>
               {
                sushitrix?.map((row, i) =>
                    row.map((cell, j) => {
                        if (cell) {
                            console.log(cell);
                            return((i>0 && j>0 || i<sushitrix.length-1 && j<sushitrix[0].length-1)?
                            <mesh key={`${i}-${j}`} position={[i-16,0,j-16]} castShadow>
                                <boxGeometry args={[1, 15, 1]} />
                                <meshStandardMaterial color={cell} transparent={true}/>
                            </mesh>:<></>)
                        }
                        return null
                    })
                )
               }
            
            </mesh>
        </Canvas></motion.div>)}
        </AnimatePresence>
    )

}