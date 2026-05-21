import { useEffect, useState } from "react"
import im from '../assets/frame.png'


export default function Canvas({matxSize, col, setSushitrix}: {matxSize: number, col: string,setSushitrix: (sushitrix: string[][]) => void}) {
    const [canDraw, setCD] = useState(false)

    useEffect(() => {
        const canvas = document.querySelector('.canvas') as HTMLCanvasElement;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle='#f3f4f6';
                ctx.fillRect(0, 0, matxSize, matxSize);
                ctx.imageSmoothingEnabled = false;
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.clearRect(0, 0,32,1);
                ctx.clearRect(0, 31,32,1);
                ctx.clearRect(31, 0,1,32);
                ctx.clearRect(0, 0,1,32);
                ctx.clearRect(1, 0,1,32);
                ctx.clearRect(30, 0,1,32);
                // clear corners in pyramid shape to make it look more like sushi
                for(let i=0;i<9;i++){
                    ctx.clearRect(0, i, 9-i, 1);
                    ctx.clearRect(0, i, 9-i, 1);
                }
                for(let i=9;i>0;i--){
                    ctx.clearRect(matxSize-1, i, 9-i, 1);
                    ctx.clearRect(matxSize-1-(9-i), i, 9-i, 1);
                }
                //lower corners now
                    for(let i=0;i<9;i++){
                        ctx.clearRect(0, matxSize-1-i, 9-i, 1);
                        ctx.clearRect(0, matxSize-1-i, 9-i, 1);
                    }
                    for(let i=9;i>0;i--){
                        ctx.clearRect(matxSize-1, matxSize-1-i, 9-i, 1);
                        ctx.clearRect(matxSize-1-(9-i), matxSize-1-i, 9-i, 1);
                    }
                // draw im onto canvas
                const image = new Image();
                image.src = im; 
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, matxSize, matxSize);
                }
                
            }
        }
    }, []);

    // Helper to extract correct coordinates for both Mouse and Touch events
    const drawPixel = (target: HTMLCanvasElement, clientX: number, clientY: number) => {
        const rect = target.getBoundingClientRect();
        const scaleX = target.width / rect.width;   
        const scaleY = target.height / rect.height;
        
        const x = Math.floor((clientX - rect.left) * scaleX);
        const y = Math.floor((clientY - rect.top) * scaleY);
        
        const ctx = target.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = col;
            ctx.clearRect(x, y, 1, 1);
            ctx.fillRect(x, y, 1, 1);

            ctx.fillStyle = '#14532d';
            ctx.clearRect(0, 0,32,1);
                ctx.clearRect(0, 31,32,1);
                ctx.clearRect(31, 0,1,32);
                ctx.clearRect(0, 0,1,32);
                ctx.clearRect(1, 0,1,32);
                ctx.clearRect(30, 0,1,32);
                // clear corners in pyramid shape to make it look more like sushi
                for(let i=0;i<9;i++){
                    ctx.clearRect(0, i, 9-i, 1);
                }
                for(let i=9;i>0;i--){
                    ctx.clearRect(matxSize-1, i, 8-i, 1);
                    ctx.clearRect(matxSize-1-(8-i), i, 8-i, 1);
                }
                //lower corners now
                    for(let i=0;i<9;i++){
                        ctx.clearRect(0, matxSize-1-i, 9-i, 1);
                        ctx.clearRect(0, matxSize-1-i, 9-i, 1);
                    }
                    for(let i=9;i>0;i--){
                        ctx.clearRect(matxSize-1, matxSize-1-i, 8-i, 1);
                        ctx.clearRect(matxSize-1-(8-i), matxSize-1-i, 8-i, 1);
                    }
                const image = new Image();
                image.src = im; 
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, matxSize, matxSize);
                }
              
        }
    };

    return (<div className="canvas-wrapper">
        <canvas 
            className="canvas" 
            width={matxSize} 
            height={matxSize} 
            // Mouse Events
            onMouseLeave={() => setCD(false)} 
            onMouseUp={() => setCD(false)} 
            onMouseDown={(event: React.MouseEvent<HTMLCanvasElement>) => {
                event.stopPropagation();
                setCD(true);
                drawPixel(event.currentTarget, event.clientX, event.clientY);
            }} 
            onMouseMove={(event: React.MouseEvent<HTMLCanvasElement>) => {
                event.stopPropagation();
                if (canDraw) {
                    drawPixel(event.currentTarget, event.clientX, event.clientY);
                }
            }}
            // Touch Events
            onTouchStart={(event: React.TouchEvent<HTMLCanvasElement>) => {
                setCD(true);
                const touch = event.touches[0];
                drawPixel(event.currentTarget, touch.clientX, touch.clientY);
            }}
            onTouchEnd={() => {
                setCD(false);
            }}
            onTouchMove={(event: React.TouchEvent<HTMLCanvasElement>) => {
                if (canDraw) {
                    // Prevent scrolling while drawing on mobile
                    if (event.cancelable) event.preventDefault(); 
                    
                    const touch = event.touches[0];
                    drawPixel(event.currentTarget, touch.clientX, touch.clientY);
                }
            }}
        />
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            const canvas = document.querySelector('.canvas') as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const sushitrix: string[][] = [];
                for (let y = 0; y < matxSize; y++) {
                    const row: string[] = [];
                    for (let x = 0; x < matxSize; x++) {
                        const pixelData = ctx.getImageData(x, y, 1, 1).data;
                        
                        
                        const hexColor = `#${pixelData[0].toString(16).padStart(2, '0')}${pixelData[1].toString(16).padStart(2, '0')}${pixelData[2].toString(16).padStart(2, '0')}`;
                        // if hex is transparent push empty string instead of hex
                        if (pixelData[3] === 0) {
                            row.push('');
                        } else row.push(hexColor);
                    }
                    sushitrix.push(row);
                }
                setSushitrix(sushitrix);
            }
        }}>Get Sushitrix</button>
    </div>)
}