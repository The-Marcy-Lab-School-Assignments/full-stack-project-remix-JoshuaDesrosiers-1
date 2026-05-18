import { useRef, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type PixelMatrix = (string | null)[][][];

interface PixelEditorProps {
  matrix: PixelMatrix;
  setMatrix: Dispatch<SetStateAction<PixelMatrix>>;
  index: number;
  color?: string;
  showOnionSkin?: boolean; // New prop to toggle the effect
}

const PixelEditor: React.FC<PixelEditorProps> = ({ 
  matrix, 
  setMatrix, 
  index, 
  color = '#000000',
  showOnionSkin = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const size = 32;
  const pixelSize = 16;

  const stateRef = useRef({ index, color });
  useEffect(() => {
    stateRef.current = { index, color };
  }, [index, color]);

  // Helper to draw a specific layer to the context
  const drawLayer = (ctx: CanvasRenderingContext2D, layerIndex: number, alpha: number = 1.0) => {
    const layer = matrix[layerIndex];
    if (!layer) return;

    ctx.globalAlpha = alpha;
    layer.forEach((row, r) => {
      row.forEach((pixelColor, c) => {
        if (pixelColor) {
          ctx.fillStyle = pixelColor;
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      });
    });
    ctx.globalAlpha = 1.0; // Reset alpha
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Onion Skin (Previous Frame)
    if (showOnionSkin && index > 0) {
      drawLayer(ctx, index - 1, 0.3); // 30% opacity
    }

    // 2. Draw Current Frame
    drawLayer(ctx, index, 1.0);
  }, [index, matrix, showOnionSkin]);

  const drawToCanvas = (r: number, c: number, col: string) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = col;
      ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
    }
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDrawing.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currX = Math.floor((clientX - rect.left) / pixelSize);
    const currY = Math.floor((clientY - rect.top) / pixelSize);

    if (currX < 0 || currX >= size || currY < 0 || currY >= size) return;
    if (lastPos.current?.x === currX && lastPos.current?.y === currY) return;

    const { color: activeColor, index: activeIndex } = stateRef.current;
    const points: { r: number; c: number }[] = [];

    let x0 = lastPos.current ? lastPos.current.x : currX;
    let y0 = lastPos.current ? lastPos.current.y : currY;
    const x1 = currX;
    const y1 = currY;

    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      points.push({ r: y0, c: x0 });
      drawToCanvas(y0, x0, activeColor);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }

    lastPos.current = { x: currX, y: currY };

    setMatrix((prev) => {
      const newMatrix = [...prev];
      // Ensure we don't mutate state directly
      const newLayer = newMatrix[activeIndex].map(row => [...row]);
      points.forEach(({ r, c }) => {
        if (newLayer[r]) newLayer[r][c] = activeColor;
      });
      newMatrix[activeIndex] = newLayer;
      return newMatrix;
    });
  }, [setMatrix]);

  // (Event handlers onStart/onEnd remain the same as your original code)
  const onStart = (clientX: number, clientY: number) => {
    isDrawing.current = true;
    handleMove(clientX, clientY);
  };

  const onEnd = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={size * pixelSize}
      height={size * pixelSize}
      onMouseDown={(e) => onStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={(e) => {
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        onStart(touch.clientX, touch.clientY);
      }}
      onTouchMove={(e) => {
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }}
      onTouchEnd={onEnd}
      style={{ 
        border: '1px solid #333', 
        imageRendering: 'pixelated',
        cursor: 'crosshair',
        display: 'block',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
        backgroundColor: '#fff' // Better visibility for onion skin
      }}
    />
  );
};

export default PixelEditor;