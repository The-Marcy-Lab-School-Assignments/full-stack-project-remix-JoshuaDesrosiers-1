import { Image } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from 'three'
import { Material } from "./materials";

export type PlaneInterface = {
    size:[number,number],
    pos:[number,number,number],
    rot:[number,number,number],
    material:Material|null,
    outline:number,
    name:string,
    outlineColor:string;

}
export class Plane{
    static planes:Plane[] = []
    size;
    pos;
    rot;
    name;
    outline;
    outlineColor;

    material:Material|null;
    constructor(size:[number,number]=[16,16],pos:[number,number,number]=[0,0,0],rot:[number,number,number]=[0,0,0],material=''){
        Plane.planes.push(this)
        this.size=[...size] as [number,number]
        this.pos=[...pos] as [number,number,number]
        this.rot = [...rot]
        this.material=Material.materials[material]||null
        this.outline = 5
        this.outlineColor = '#00ffff'
        this.name=''
    }
    setMaterial(name:string){
        this.material=Material.materials[name]
    }
    paint(){

    }
}