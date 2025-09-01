'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { TextElement, BackgroundSettings, CanvasSettings } from '@/app/page';

interface CanvasPreviewProps {
  textElements: TextElement[];
  setTextElements: (elements: TextElement[]) => void;
  background: BackgroundSettings;
  canvasSettings: CanvasSettings;
}

export default function CanvasPreview({ textElements, setTextElements, background, canvasSettings }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const loadGoogleFonts = async () => {
    if (typeof window === 'undefined') return;

    const uniqueFonts = [...new Set(textElements.map(el => el.fontFamily))];
    const fontsToLoad = uniqueFonts.filter(font => 
      font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)
    );

    if (fontsToLoad.length === 0) {
      setFontsLoaded(true);
      return;
    }

    const fontUrls = fontsToLoad.map(font => 
      `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;700&display=swap`
    );

    const promises = fontUrls.map(url => {
      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      return new Promise((resolve) => {
        link.onload = resolve;
        setTimeout(resolve, 2000);
      });
    });

    try {
      await Promise.all(promises);
      await document.fonts.ready;
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
    
    setFontsLoaded(true);
  };

  const createBackgroundPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (background.type === 'solid') {
      ctx.fillStyle = background.solidColor;
      ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'gradient') {
      const angle = (background.gradientDirection * Math.PI) / 180;
      const gradient = ctx.createLinearGradient(
        0, 0,
        Math.cos(angle) * width,
        Math.sin(angle) * height
      );
      gradient.addColorStop(0, background.gradientStart);
      gradient.addColorStop(1, background.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'pattern') {
      ctx.fillStyle = background.solidColor;
      ctx.fillRect(0, 0, width, height);
      
      // Add pattern overlay
      if (background.pattern === 'dots') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let x = 0; x < width; x += 20) {
          for (let y = 0; y < height; y += 20) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (background.pattern === 'lines') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      } else if (background.pattern === 'grid') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = canvasSettings.width;
    const displayHeight = canvasSettings.height;

    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Draw background
    createBackgroundPattern(ctx, displayWidth, displayHeight);

    // Draw text elements
    textElements.forEach((element) => {
      ctx.save();
      
      // Apply transformations
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      // Set font properties
      const fontWeight = element.fontWeight === 'bold' ? '700' : '400';
      const fontStyle = element.fontStyle === 'italic' ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${element.fontSize}px "${element.fontFamily}", sans-serif`;
      ctx.fillStyle = element.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw text (handle multiline)
      const lines = element.text.split('\n');
      const lineHeight = element.fontSize * 1.2;
      const startY = -(lines.length - 1) * lineHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, 0, startY + index * lineHeight);
      });
      
      ctx.restore();
    });
  }, [textElements, background, canvasSettings, fontsLoaded]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) * canvasSettings.width) / rect.width,
      y: ((clientY - rect.top) * canvasSettings.height) / rect.height,
    };
  };

  const findElementAtPosition = (x: number, y: number): TextElement | null => {
    // Check elements in reverse order (top to bottom)
    for (let i = textElements.length - 1; i >= 0; i--) {
      const element = textElements[i];
      const distance = Math.sqrt(
        Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2)
      );
      
      // Rough hit detection based on font size
      if (distance < element.fontSize) {
        return element;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e);
    const hitElement = findElementAtPosition(coords.x, coords.y);
    
    if (hitElement) {
      setIsDragging(hitElement.id);
      setDragOffset({
        x: coords.x - hitElement.x,
        y: coords.y - hitElement.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const coords = getCanvasCoordinates(e);
    const newX = coords.x - dragOffset.x;
    const newY = coords.y - dragOffset.y;
    
    setTextElements(textElements.map(element =>
      element.id === isDragging
        ? { ...element, x: newX, y: newY }
        : element
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    const hitElement = findElementAtPosition(coords.x, coords.y);
    
    if (hitElement) {
      setIsDragging(hitElement.id);
      setDragOffset({
        x: coords.x - hitElement.x,
        y: coords.y - hitElement.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    
    const coords = getCanvasCoordinates(e);
    const newX = coords.x - dragOffset.x;
    const newY = coords.y - dragOffset.y;
    
    setTextElements(textElements.map(element =>
      element.id === isDragging
        ? { ...element, x: newX, y: newY }
        : element
    ));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const exportImage = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `verse-${canvasSettings.format}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.9 : 1);
    link.click();
  };

  useEffect(() => {
    loadGoogleFonts();
  }, [textElements]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg bg-white cursor-move touch-none max-w-full max-h-full"
        style={{
          width: Math.min(canvasSettings.width, typeof window !== 'undefined' ? window.innerWidth - 32 : 600),
          height: Math.min(canvasSettings.height, typeof window !== 'undefined' ? window.innerWidth - 32 : 600),
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {textElements.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          👆 Drag text to reposition
        </div>
      )}
    </div>
  );
}