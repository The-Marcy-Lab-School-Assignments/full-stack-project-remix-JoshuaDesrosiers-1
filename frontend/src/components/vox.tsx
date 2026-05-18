import { useState } from "react"


export default function Vox({x,y,z,size,cell,opacity=1}:{x:number,y:number,z:number,size:number[],cell:string,opacity?:number}){

    return( <mesh key={`${x}-${y}-${z}`}
            position={[x, y, z]}>
                <boxGeometry args={[size[0],size[1], size[2]]} />

                <meshStandardMaterial
                  color={cell}
                  opacity={opacity}
                  transparent
                />
              </mesh>)
}