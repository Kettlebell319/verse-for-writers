import { BackgroundSettings } from '@/app/page';

interface BackgroundControlsProps {
  background: BackgroundSettings;
  setBackground: (background: BackgroundSettings) => void;
}

const gradientPresets = [
  { name: 'Ocean', start: '#667eea', end: '#764ba2' },
  { name: 'Sunset', start: '#f093fb', end: '#f5576c' },
  { name: 'Forest', start: '#4facfe', end: '#00f2fe' },
  { name: 'Fire', start: '#ff9a9e', end: '#fecfef' },
  { name: 'Purple Dream', start: '#a8edea', end: '#fed6e3' },
  { name: 'Gold Rush', start: '#ffecd2', end: '#fcb69f' },
  { name: 'Night Sky', start: '#2c3e50', end: '#fd746c' },
  { name: 'Fresh Mint', start: '#96fbc4', end: '#f9f047' },
];

const patternPresets = [
  { name: 'None', value: 'none' },
  { name: 'Dots', value: 'dots' },
  { name: 'Lines', value: 'lines' },
  { name: 'Grid', value: 'grid' },
  { name: 'Noise', value: 'noise' },
];

export default function BackgroundControls({ background, setBackground }: BackgroundControlsProps) {
  const updateBackground = (updates: Partial<BackgroundSettings>) => {
    setBackground({ ...background, ...updates });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
        <div className="flex gap-1">
          {[
            { id: 'solid', label: 'Solid', icon: '🎨' },
            { id: 'gradient', label: 'Gradient', icon: '🌈' },
            { id: 'pattern', label: 'Pattern', icon: '📐' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => updateBackground({ type: type.id as any })}
              className={`flex-1 py-2 px-2 text-xs rounded transition-colors ${
                background.type === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-center">
                <div>{type.icon}</div>
                <div>{type.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {background.type === 'solid' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background.solidColor}
              onChange={(e) => updateBackground({ solidColor: e.target.value })}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={background.solidColor}
              onChange={(e) => updateBackground({ solidColor: e.target.value })}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {background.type === 'gradient' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateBackground({ 
                    gradientStart: preset.start, 
                    gradientEnd: preset.end 
                  })}
                  className="h-8 rounded border border-gray-300 hover:border-blue-400 transition-colors"
                  style={{
                    background: `linear-gradient(45deg, ${preset.start}, ${preset.end})`
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Color</label>
              <input
                type="color"
                value={background.gradientStart}
                onChange={(e) => updateBackground({ gradientStart: e.target.value })}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Color</label>
              <input
                type="color"
                value={background.gradientEnd}
                onChange={(e) => updateBackground({ gradientEnd: e.target.value })}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Direction: {background.gradientDirection}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={background.gradientDirection}
              onChange={(e) => updateBackground({ gradientDirection: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}

      {background.type === 'pattern' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
            <div className="grid grid-cols-3 gap-2">
              {patternPresets.map((pattern) => (
                <button
                  key={pattern.name}
                  onClick={() => updateBackground({ pattern: pattern.value })}
                  className={`py-2 px-3 text-xs rounded border transition-colors ${
                    background.pattern === pattern.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pattern.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Color</label>
            <input
              type="color"
              value={background.solidColor}
              onChange={(e) => updateBackground({ solidColor: e.target.value })}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={() => updateBackground({
            type: 'gradient',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2',
            gradientDirection: 45
          })}
          className="w-full py-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          🎲 Random Viral Background
        </button>
      </div>
    </div>
  );
}