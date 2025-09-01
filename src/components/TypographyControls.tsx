import { TextElement } from '@/app/page';

interface TypographyControlsProps {
  textElements: TextElement[];
  setTextElements: (elements: TextElement[]) => void;
}

export default function TypographyControls({ textElements, setTextElements }: TypographyControlsProps) {
  const activeElement = textElements[0] || null;

  const updateActiveElement = (updates: Partial<TextElement>) => {
    if (!activeElement) return;
    
    const updatedElements = textElements.map(element =>
      element.id === activeElement.id ? { ...element, ...updates } : element
    );
    setTextElements(updatedElements);
  };

  // 2025 Viral Font Collection - Optimized for Social Media
  const fontFamilies = [
    // Sans Serif Power Pack
    { name: 'Montserrat', category: 'Sans Serif', viral: true },
    { name: 'Bebas Neue', category: 'Display', viral: true },
    { name: 'Roboto', category: 'Sans Serif', viral: false },
    { name: 'Open Sans', category: 'Sans Serif', viral: false },
    
    // Script & Artistic
    { name: 'Pacifico', category: 'Script', viral: true },
    { name: 'Dancing Script', category: 'Script', viral: true },
    { name: 'Caveat', category: 'Handwritten', viral: true },
    
    // Serif Sophistication
    { name: 'Playfair Display', category: 'Serif', viral: true },
    { name: 'Merriweather', category: 'Serif', viral: false },
    { name: 'Lora', category: 'Serif', viral: false },
    
    // Modern Display
    { name: 'Oswald', category: 'Display', viral: true },
    { name: 'Raleway', category: 'Sans Serif', viral: false },
  ];

  if (!activeElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        Add text to customize typography
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
          <span className="text-xs text-blue-500 ml-1">✨ Viral picks</span>
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {fontFamilies.map((font) => (
            <button
              key={font.name}
              onClick={() => updateActiveElement({ fontFamily: font.name })}
              className={`p-2 text-left text-xs rounded border transition-colors ${
                activeElement.fontFamily === font.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{font.name}</div>
              <div className="text-gray-500 flex items-center justify-between">
                <span>{font.category}</span>
                {font.viral && <span className="text-blue-500">✨</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size: {activeElement.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="120"
          value={activeElement.fontSize}
          onChange={(e) => updateActiveElement({ fontSize: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={activeElement.color}
            onChange={(e) => updateActiveElement({ color: e.target.value })}
            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={activeElement.color}
            onChange={(e) => updateActiveElement({ color: e.target.value })}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <label className="flex items-center space-x-2 flex-1">
          <input
            type="checkbox"
            checked={activeElement.fontWeight === 'bold'}
            onChange={(e) => updateActiveElement({ fontWeight: e.target.checked ? 'bold' : 'normal' })}
            className="rounded"
          />
          <span className="text-sm">Bold</span>
        </label>
        <label className="flex items-center space-x-2 flex-1">
          <input
            type="checkbox"
            checked={activeElement.fontStyle === 'italic'}
            onChange={(e) => updateActiveElement({ fontStyle: e.target.checked ? 'italic' : 'normal' })}
            className="rounded"
          />
          <span className="text-sm">Italic</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rotation: {activeElement.rotation}°
        </label>
        <input
          type="range"
          min="-45"
          max="45"
          value={activeElement.rotation}
          onChange={(e) => updateActiveElement({ rotation: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}