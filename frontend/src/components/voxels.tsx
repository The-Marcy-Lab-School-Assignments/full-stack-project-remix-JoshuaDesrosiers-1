import Vox from "./vox";

type VoxelMatrix = (string | null)[][][];

export function Voxels({ data }: { data: VoxelMatrix }) {
  return (
    <>
      {data.map((layer, y) =>
        layer.map((row, z) =>
          row.map((cell, x) => {
            if (!cell) return null;

            return (Vox({x,y,z,size:1,cell})
            );
          })
        )
      )}
    </>
  );
}
