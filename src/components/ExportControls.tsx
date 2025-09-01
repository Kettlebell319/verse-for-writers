import { useRef } from 'react';
import { TextElement, BackgroundSettings, CanvasSettings } from '@/app/page';

interface ExportControlsProps {
  textElements: TextElement[];
  background: BackgroundSettings;
  canvasSettings: CanvasSettings;
  setCanvasSettings: (settings: CanvasSettings) => void;
}

const formatPresets = {
  'instagram-square': { width: 1080, height: 1080, label: 'Instagram Post' },
  'instagram-story': { width: 1080, height: 1920, label: 'Instagram Story' },
  'twitter': { width: 1200, height: 675, label: 'Twitter Post' },
  'linkedin': { width: 1200, height: 627, label: 'LinkedIn Post' },
  'custom': { width: 800, height: 800, label: 'Custom Size' },
};

export default function ExportControls({ 
  textElements, 
  background, 
  canvasSettings, 
  setCanvasSettings 
}: ExportControlsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateFormat = (format: keyof typeof formatPresets) => {
    const preset = formatPresets[format];
    setCanvasSettings({
      ...canvasSettings,
      format,
      width: preset.width,
      height: preset.height,
    });
  };

  const createExportCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = width;
    canvas.height = height;

    // Draw background
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
    }

    // Draw text elements
    textElements.forEach((element) => {
      ctx.save();
      
      // Scale positions for export canvas
      const scaleX = width / canvasSettings.width;
      const scaleY = height / canvasSettings.height;
      const scaledX = element.x * scaleX;
      const scaledY = element.y * scaleY;
      const scaledFontSize = element.fontSize * Math.min(scaleX, scaleY);
      
      ctx.translate(scaledX, scaledY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      const fontWeight = element.fontWeight === 'bold' ? '700' : '400';
      const fontStyle = element.fontStyle === 'italic' ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px "${element.fontFamily}", sans-serif`;
      ctx.fillStyle = element.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = element.text.split('\n');
      const lineHeight = scaledFontSize * 1.2;
      const startY = -(lines.length - 1) * lineHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, 0, startY + index * lineHeight);
      });
      
      ctx.restore();
    });

    return canvas;
  };

  const exportSingle = (format: keyof typeof formatPresets) => {
    const preset = formatPresets[format];
    const canvas = createExportCanvas(preset.width, preset.height);
    
    const link = document.createElement('a');
    link.download = `verse-${format}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportAll = async () => {
    const formats: (keyof typeof formatPresets)[] = ['instagram-square', 'instagram-story', 'twitter', 'linkedin'];
    
    for (const format of formats) {
      const preset = formatPresets[format];
      const canvas = createExportCanvas(preset.width, preset.height);
      
      const link = document.createElement('a');
      link.download = `verse-${format}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const shareText = encodeURIComponent(textElements.map(el => el.text).join(' '));
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${shareText}&hashtags=VerseForWriters,MadeWithVerse`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${shareText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${shareText}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyAsImage = async () => {
    if (!navigator.clipboard.write) {
      alert('Clipboard not supported in this browser');
      return;
    }

    try {
      const canvas = createExportCanvas(canvasSettings.width, canvasSettings.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          alert('Image copied to clipboard!');
        }
      });
    } catch (error) {
      console.error('Failed to copy image:', error);
      alert('Failed to copy image to clipboard');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formatPresets).map(([format, preset]) => (
            <button
              key={format}
              onClick={() => updateFormat(format as keyof typeof formatPresets)}
              className={`p-2 text-xs rounded border transition-colors ${
                canvasSettings.format === format
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-gray-500">{preset.width}x{preset.height}</div>
            </button>
          ))}
        </div>
      </div>

      {canvasSettings.format === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              value={canvasSettings.width}
              onChange={(e) => setCanvasSettings({
                ...canvasSettings,
                width: parseInt(e.target.value) || 800
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              min="200"
              max="4000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
            <input
              type="number"
              value={canvasSettings.height}
              onChange={(e) => setCanvasSettings({
                ...canvasSettings,
                height: parseInt(e.target.value) || 800
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              min="200"
              max="4000"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Quick Export</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => exportSingle('instagram-square')}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-xs font-medium"
          >
            📱 Instagram
          </button>
          <button
            onClick={() => exportSingle('instagram-story')}
            className="p-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded text-xs font-medium"
          >
            📖 Story
          </button>
          <button
            onClick={() => exportSingle('twitter')}
            className="p-2 bg-blue-500 text-white rounded text-xs font-medium"
          >
            🐦 Twitter
          </button>
          <button
            onClick={() => exportSingle('linkedin')}
            className="p-2 bg-blue-700 text-white rounded text-xs font-medium"
          >
            💼 LinkedIn
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={exportAll}
          className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium text-sm"
        >
          🚀 Export All Sizes
        </button>
        
        <button
          onClick={copyAsImage}
          className="w-full p-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
        >
          📋 Copy to Clipboard
        </button>
      </div>

      <div className="border-t pt-3 space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Share Directly</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => shareToSocial('twitter')}
            className="p-2 bg-sky-500 text-white rounded text-xs"
          >
            X/Twitter
          </button>
          <button
            onClick={() => shareToSocial('linkedin')}
            className="p-2 bg-blue-700 text-white rounded text-xs"
          >
            LinkedIn
          </button>
          <button
            onClick={() => shareToSocial('facebook')}
            className="p-2 bg-blue-600 text-white rounded text-xs"
          >
            Facebook
          </button>
        </div>
      </div>

      <div className="text-xs text-center text-gray-500 pt-2 border-t">
        Made with <span className="text-blue-500">Verse</span> ✨
      </div>
    </div>
  );
}