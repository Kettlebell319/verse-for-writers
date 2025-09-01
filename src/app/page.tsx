'use client';

import { useState } from 'react';
import TextEditor from '@/components/TextEditor';
import CanvasPreview from '@/components/CanvasPreview';
import TypographyControls from '@/components/TypographyControls';
import BackgroundControls from '@/components/BackgroundControls';
import ExportControls from '@/components/ExportControls';

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  rotation: number;
}

export interface BackgroundSettings {
  type: 'solid' | 'gradient' | 'pattern';
  solidColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: number;
  pattern: string;
}

export interface CanvasSettings {
  width: number;
  height: number;
  format: 'instagram-square' | 'instagram-story' | 'twitter' | 'linkedin' | 'custom';
}

export default function Home() {
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: '1',
      text: 'Make words visual.',
      x: 300,
      y: 200,
      fontSize: 48,
      fontFamily: 'Montserrat',
      color: '#000000',
      fontWeight: 'bold',
      fontStyle: 'normal',
      rotation: 0,
    }
  ]);

  const [background, setBackground] = useState<BackgroundSettings>({
    type: 'gradient',
    solidColor: '#ffffff',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientDirection: 45,
    pattern: 'none',
  });

  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    width: 600,
    height: 600,
    format: 'instagram-square',
  });

  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'background' | 'export'>('text');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Verse</h1>
          <div className="text-xs text-gray-500">Mobile-First</div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center overflow-hidden">
          <CanvasPreview 
            textElements={textElements} 
            setTextElements={setTextElements}
            background={background}
            canvasSettings={canvasSettings}
          />
        </div>

        <div className="bg-white border-t border-gray-200">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'text', label: 'Text', icon: '✏️' },
              { id: 'style', label: 'Style', icon: '🎨' },
              { id: 'background', label: 'Background', icon: '🖼️' },
              { id: 'export', label: 'Export', icon: '📤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-2 text-xs font-medium text-center border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {activeTab === 'text' && (
              <TextEditor textElements={textElements} setTextElements={setTextElements} />
            )}
            {activeTab === 'style' && (
              <TypographyControls textElements={textElements} setTextElements={setTextElements} />
            )}
            {activeTab === 'background' && (
              <BackgroundControls background={background} setBackground={setBackground} />
            )}
            {activeTab === 'export' && (
              <ExportControls 
                textElements={textElements} 
                background={background} 
                canvasSettings={canvasSettings}
                setCanvasSettings={setCanvasSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}