import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { StickerCanvas } from './components/StickerCanvas';
import { Gallery } from './components/Gallery';
import { Sticker, StickerStyle, GenerationStatus } from './types';
import { generateSticker } from './services/geminiService';

// Simple UUID generator since we can't easily add packages
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const App: React.FC = () => {
  // Initialize state with lazy initializer to load from localStorage
  const [stickers, setStickers] = useState<Sticker[]>(() => {
    try {
      const saved = localStorage.getItem('stickers');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Failed to load stickers from local storage", e);
      return [];
    }
  });

  const [currentSticker, setCurrentSticker] = useState<Sticker | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Persistence effect
  useEffect(() => {
    try {
      localStorage.setItem('stickers', JSON.stringify(stickers));
    } catch (e) {
      console.error("Failed to save stickers to local storage (quota exceeded?)", e);
      // Optional: Logic to remove oldest stickers if quota is full could go here
    }
  }, [stickers]);

  const handleGenerate = useCallback(async (prompt: string, style: StickerStyle) => {
    setStatus('generating');
    setError(null);
    setCurrentSticker(null);

    try {
      const imageUrl = await generateSticker(prompt, style);
      
      const newSticker: Sticker = {
        id: generateId(),
        imageUrl,
        prompt,
        style,
        createdAt: Date.now(),
      };

      setStickers(prev => {
        const updated = [newSticker, ...prev];
        // Optional: limit to last 20 to prevent localStorage overflow
        return updated.slice(0, 20); 
      });
      setCurrentSticker(newSticker);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || "Failed to generate sticker. Please try again.");
    }
  }, []);

  const handleSelectSticker = (sticker: Sticker) => {
    setCurrentSticker(sticker);
    setStatus('success'); // Show as ready/viewing
    setError(null);
  };

  const handleDeleteSticker = (stickerId: string) => {
    setStickers(prev => prev.filter(s => s.id !== stickerId));
    
    // If the deleted sticker was currently displayed, clear the canvas
    if (currentSticker?.id === stickerId) {
      setCurrentSticker(null);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Controls onGenerate={handleGenerate} isGenerating={status === 'generating'} />
            
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm text-brand-900 shadow-sm">
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <span className="text-xl">💡</span> Pro Tip
              </h4>
              <p className="opacity-90 leading-relaxed">
                For best results, keep prompts specific but simple. 
                Try adding words like "cute", "cool", or specific colors. 
                The AI automatically adds a white border for that authentic sticker look!
              </p>
            </div>
          </div>

          {/* Right Column: Canvas & Preview */}
          <div className="lg:col-span-8">
            <StickerCanvas 
              currentSticker={currentSticker} 
              status={status} 
              error={error} 
            />
            
            <Gallery 
              stickers={stickers} 
              onSelect={handleSelectSticker}
              onDelete={handleDeleteSticker}
              selectedId={currentSticker?.id} 
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;