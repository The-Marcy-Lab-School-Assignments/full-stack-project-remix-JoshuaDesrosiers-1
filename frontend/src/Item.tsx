import { useMemo } from 'react'
import { useLoader } from "@react-three/fiber"
import * as THREE from 'three'
import type { PlaneInterface } from './classes/plane'
import { Plane } from './classes/plane'
import { Outlines } from '@react-three/drei'
function getSnappedPosition(
  pos: [number, number, number],
  rot: [number, number, number],
  size: [number, number]
): [number, number, number] {
  const [w, h] = size;

  // Build the rotation as a quaternion and get the plane's local axes
  const euler = new THREE.Euler(...rot.map(v => v * (Math.PI / 180)) as [number, number, number], 'XYZ');
  const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);

  // Local +X axis of the plane (points along width)
  const right = new THREE.Vector3(1, 0, 0).applyMatrix4(matrix);
  // Local +Y axis of the plane (points along height)
  const up = new THREE.Vector3(0, 1, 0).applyMatrix4(matrix);

  // Anchor is top-left corner:
  // center = anchor + (right * halfWidth) - (up * halfHeight)
  const offset = right.multiplyScalar(w / 2).add(up.multiplyScalar(-h / 2));

  return [
    pos[0] + offset.x,
    pos[1] + offset.y,
    pos[2] + offset.z,
  ];
}

import { Line } from '@react-three/drei';

interface PlaneBorderProps {
  size: [number, number];
  color: string;
  width: number; // This will now control the thickness
}

export function PlaneBorder({ size, color, width }: PlaneBorderProps) {
  // Calculate the 4 corner points of the plane to draw a closed loop
  const points = useMemo(() => {
    const halfW = size[0] / 2;
    const halfH = size[1] / 2;
    
    return [
      new THREE.Vector3(-halfW,  halfH, 0), // Top Left
      new THREE.Vector3( halfW,  halfH, 0), // Top Right
      new THREE.Vector3( halfW, -halfH, 0), // Bottom Right
      new THREE.Vector3(-halfW, -halfH, 0), // Bottom Left
      new THREE.Vector3(-halfW,  halfH, 0), // Back to Top Left to close the loop
    ];
  }, [size[0], size[1]]);

  return (
    <Line 
      points={points} 
      color={color} 
      lineWidth={width} // Supports true thickness
    />
  );
}

export default function Item({ plane, setter, index }: {
  plane: PlaneInterface,
  setter: ({index,type}:{index:number,type:'p'}) => void,
  index: number
}) {
  const texture = useLoader(THREE.TextureLoader, plane.material?plane.material.url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWJ6K6PyHwAAAP//S1fihAAAAAZJREFUAwAFXgIvfnnHPQAAAABJRU5ErkJggg==');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  const finalPos = getSnappedPosition(plane.pos, plane.rot, plane.size);
  const rotRad = plane.rot.map(v => v * (Math.PI / 180)) as [number, number, number];

  return (
    <mesh
      key={index}
      position={finalPos}
      rotation={rotRad}
      onClick={(e) => { e.stopPropagation();console.log('set'); setter({index,type:'p'}); }}
    >
      <planeGeometry args={[...plane.size]} />
      <meshStandardMaterial
      
        map={texture}
        roughness={1}
        metalness={0}
        transparent
        side={THREE.DoubleSide}
      />
      <PlaneBorder size={plane.size} color={plane.outlineColor} width={plane.outline} />
    </mesh>
  );
}