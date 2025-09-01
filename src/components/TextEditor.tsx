import { TextElement } from '@/app/page';

interface TextEditorProps {
  textElements: TextElement[];
  setTextElements: (elements: TextElement[]) => void;
}

export default function TextEditor({ textElements, setTextElements }: TextEditorProps) {
  const activeElement = textElements[0] || null;

  const updateActiveElement = (updates: Partial<TextElement>) => {
    if (!activeElement) return;
    
    const updatedElements = textElements.map(element =>
      element.id === activeElement.id ? { ...element, ...updates } : element
    );
    setTextElements(updatedElements);
  };

  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'New text',
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      fontSize: 32,
      fontFamily: 'Montserrat',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      rotation: 0,
    };
    setTextElements([...textElements, newElement]);
  };

  if (!activeElement) {
    return (
      <div className="p-4">
        <button
          onClick={addTextElement}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          + Add Your First Text
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <textarea
          value={activeElement.text}
          onChange={(e) => updateActiveElement({ text: e.target.value })}
          placeholder="Enter your text here..."
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          maxLength={280}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {activeElement.text.length}/280
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={addTextElement}
          className="flex-1 p-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          + Add Text
        </button>
        {textElements.length > 1 && (
          <button
            onClick={() => setTextElements(textElements.filter(el => el.id !== activeElement.id))}
            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            🗑️
          </button>
        )}
      </div>

      {textElements.length > 1 && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Text Layers ({textElements.length})
          </label>
          <div className="space-y-1">
            {textElements.map((element) => (
              <div
                key={element.id}
                className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                  element.id === activeElement.id
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  // Switch active element logic would go here
                }}
              >
                {element.text.slice(0, 20)}{element.text.length > 20 ? '...' : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}