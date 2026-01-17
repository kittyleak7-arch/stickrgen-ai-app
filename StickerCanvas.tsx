import React, { useState, useEffect } from 'react';
import { Sticker, GenerationStatus } from '../types';
import { Download, CheckCircle2, Sparkles, Loader2, Share2 } from 'lucide-react';

interface StickerCanvasProps {
  currentSticker: Sticker | null;
  status: GenerationStatus;
  error: string | null;
}

export const StickerCanvas: React.FC<StickerCanvasProps> = ({ currentSticker, status, error }) => {
  const [loadingMsg, setLoadingMsg] = useState("Initializing creative engines...");
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'generating') {
      const messages = [
        "Mixing digital palette...",
        "Sketching the concept...",
        "Tracing die-cut borders...",
        "Adding glossy finish...",
        "Finalizing your sticker..."
      ];
      let i = 0;
      setLoadingMsg(messages[0]);
      
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMsg(messages[i]);
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleDownload = () => {
    if (!currentSticker) return;
    const link = document.createElement('a');
    link.href = currentSticker.imageUrl;
    link.download = `stickr-${currentSticker.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!currentSticker) return;
    
    setShareFeedback("Preparing...");
    
    try {
      const response = await fetch(currentSticker.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `stickr-${currentSticker.id}.png`, { type: 'image/png' });
      
      const params = new URLSearchParams();
      params.set('prompt', currentSticker.prompt);
      params.set('style', currentSticker.style);
      const shareUrl = `${window.location.origin}?${params.toString()}`;

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'StickrGen AI Sticker',
          text: `Check out this sticker I made! Prompt: "${currentSticker.prompt}"`,
          files: [file],
        });
        setShareFeedback(null);
      } else {
         try {
             await navigator.clipboard.write([
                 new ClipboardItem({ 'image/png': blob })
             ]);
             setShareFeedback("Image copied!");
         } catch (e) {
             await navigator.clipboard.writeText(shareUrl);
             setShareFeedback("Link copied!");
         }
      }
    } catch (err) {
      console.error("Share failed", err);
      setShareFeedback("Failed");
    }

    setTimeout(() => setShareFeedback(null), 3000);
  };

  return (
    <div className="h-full min-h-[450px] flex flex-col perspective-1000">
      <div className="flex-1 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group flex items-center justify-center p-8 transition-all duration-500">
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-slate-900 overflow-hidden">
           <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-slate-950"></div>
           <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] animate-spin-slow"></div>
           <div className="absolute inset-0 backdrop-blur-3xl"></div>
           
           {/* Grid Pattern */}
           <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)', 
               backgroundSize: '24px 24px' 
             }} 
           />
           
           {/* Animated blobs */}
           {status === 'generating' && (
             <>
               <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
             </>
           )}
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full flex items-center justify-center">

            {status === 'idle' && !currentSticker && (
              <div className="text-center text-slate-500 max-w-xs animate-fade-in flex flex-col items-center">
                <div className="relative mb-6 animate-float">
                    <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-3xl rotate-6 flex items-center justify-center shadow-2xl border border-slate-600/50">
                        <Sparkles className="text-brand-400" size={40} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-white text-xs font-bold">AI</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Ready to create?</h3>
                <p className="text-slate-400 leading-relaxed">Type a prompt to watch Gemini AI craft a unique sticker just for you.</p>
              </div>
            )}

            {status === 'generating' && (
              <div className="text-center flex flex-col items-center animate-fade-in w-full max-w-md">
                <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                  {/* Complex loader */}
                  <div className="absolute inset-0 border-4 border-dashed border-brand-500/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border-2 border-brand-400/30 rounded-full animate-[spin_3s_linear_reverse_infinite]"></div>
                  
                  {/* Center glowing orb */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-24 h-24 bg-brand-500/10 rounded-full blur-xl animate-pulse"></div>
                  </div>

                  <div className="relative z-10 bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-brand-500/30 shadow-brand-500/20 shadow-lg">
                    <Loader2 className="text-brand-400 animate-spin" size={48} />
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute -top-4 right-0 w-3 h-3 bg-brand-400 rounded-full animate-bounce delay-100 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                  <div className="absolute bottom-0 -left-2 w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                </div>
                
                <div className="space-y-2 relative">
                   <div className="h-8 overflow-hidden">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-white animate-pulse">
                        {loadingMsg}
                      </h3>
                   </div>
                  <p className="text-sm text-brand-300/60 font-medium tracking-wide uppercase text-[10px]">Powered by Gemini 2.5</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center relative max-w-sm bg-red-950/40 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 animate-pop shadow-2xl shadow-red-900/20">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/30 rotate-3">
                  <span className="text-3xl text-white">⚠️</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">Oops! Generation Failed</h3>
                <p className="text-red-200/80 leading-relaxed">{error || "Something went wrong. Please try again."}</p>
              </div>
            )}

            {status === 'success' && currentSticker && (
              <div className="relative animate-pop group cursor-grab active:cursor-grabbing perspective-500">
                 {/* Intense Back Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 
                 <img 
                  src={currentSticker.imageUrl} 
                  alt={currentSticker.prompt}
                  className="max-w-full max-h-[420px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-1"
                 />
                 
                 {/* Shine effect on image */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
              </div>
            )}

        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border border-slate-200 p-4 rounded-2xl shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl">
        <div className="flex items-center gap-3 px-2">
           {status === 'success' ? (
             <div className="flex items-center gap-2 text-emerald-600 animate-fade-in bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <CheckCircle2 size={18} className="fill-emerald-100" />
               <span className="text-sm font-bold tracking-tight">{shareFeedback || "Sticker Ready!"}</span>
             </div>
           ) : status === 'generating' ? (
              <div className="flex items-center gap-2 text-brand-600 animate-pulse bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
                <Sparkles size={16} className="fill-brand-100" />
                <span className="text-sm font-semibold">Creating...</span>
              </div>
           ) : (
             <span className="text-slate-400 text-sm font-medium px-2">Ready to generate</span>
           )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            disabled={status !== 'success'}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            <Share2 size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
            Share
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={status !== 'success'}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};