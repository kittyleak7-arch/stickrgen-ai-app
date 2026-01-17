import React from 'react';
import { Sparkles, Sticker } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-2.5 rounded-xl text-white shadow-lg shadow-brand-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
            <Sticker size={24} className="group-hover:animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">StickrGen</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">AI Sticker Maker</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-bold border border-brand-100 shadow-sm">
            <Sparkles size={12} className="animate-pulse" />
            <span>Powered by Gemini 2.5</span>
          </div>
        </div>
      </div>
    </header>
  );
};