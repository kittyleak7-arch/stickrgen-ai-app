import React, { useState } from 'react';
import { StickerStyle } from '../types';
import { Wand2, Dice5 } from 'lucide-react';

interface ControlsProps {
  onGenerate: (prompt: string, style: StickerStyle) => void;
  isGenerating: boolean;
}

const SUGGESTIONS = [
  "A cyberpunk cat wearing sunglasses",
  "A happy slice of pizza surfing",
  "A magical potion bottle with glowing liquid",
  "A retro robot holding a flower",
  "A cute astronaut floating in space donuts",
  "A wise old owl reading a book"
];

export const Controls: React.FC<ControlsProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('prompt') || '';
  });
  
  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>(() => {
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get('style');
    // Validate style from URL
    if (styleParam && Object.values(StickerStyle).includes(styleParam as StickerStyle)) {
      return styleParam as StickerStyle;
    }
    return StickerStyle.CARTOON;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt, selectedStyle);
  };

  const handleSurpriseMe = () => {
    const randomSuggestion = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
    setPrompt(randomSuggestion);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 flex flex-col gap-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          Create Your Sticker
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
              Describe your idea
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A cute corgi drinking boba tea..."
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-inner focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 min-h-[110px] resize-none p-4 text-slate-900 placeholder:text-slate-400 transition-all duration-300 ease-out"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={handleSurpriseMe}
                disabled={isGenerating}
                className="absolute right-3 bottom-3 text-xs flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-all bg-white hover:bg-brand-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:shadow active:scale-95"
              >
                <Dice5 size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                Surprise Me
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">
              Choose a Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(StickerStyle).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  disabled={isGenerating}
                  className={`
                    px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all duration-200 border relative overflow-hidden
                    ${selectedStyle === style 
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20 scale-[1.02] shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-slate-50 hover:scale-[1.01]'
                    }
                  `}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`
              mt-2 relative group overflow-hidden flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform
              ${isGenerating || !prompt.trim()
                ? 'bg-slate-300 cursor-not-allowed shadow-none scale-100'
                : 'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 bg-[length:200%_100%] hover:bg-[100%_0] shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
              }
            `}
          >
            {/* Shimmer effect overlay */}
            {!isGenerating && prompt.trim() && (
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
            )}
            
            {isGenerating ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">Generating Magic...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                Generate Sticker
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};