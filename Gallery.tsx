import React, { useState } from 'react';
import { Sticker } from '../types';
import { Clock, Download, Trash2, AlertTriangle } from 'lucide-react';

interface GalleryProps {
  stickers: Sticker[];
  onSelect: (sticker: Sticker) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ stickers, onSelect, onDelete, selectedId }) => {
  const [stickerToDelete, setStickerToDelete] = useState<string | null>(null);

  if (stickers.length === 0) return null;

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStickerToDelete(id);
  };

  const confirmDelete = () => {
    if (stickerToDelete) {
      onDelete(stickerToDelete);
      setStickerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setStickerToDelete(null);
  };

  return (
    <>
      <div className="mt-12 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <div className="bg-slate-100 p-1.5 rounded-lg">
              <Clock size={18} className="text-slate-500" />
            </div>
            Recent Stickers
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-sm">
            {stickers.length} saved
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
          {stickers.map((sticker, index) => (
            <div 
              key={sticker.id}
              onClick={() => onSelect(sticker)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                relative group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 aspect-square bg-slate-900 animate-pop
                shadow-md hover:shadow-xl hover:-translate-y-1
                ${selectedId === sticker.id 
                  ? 'ring-4 ring-brand-500/30 border-brand-500 z-10 scale-[1.02]' 
                  : 'border-slate-200 hover:border-brand-300'
                }
              `}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px]"></div>

              <img 
                src={sticker.imageUrl} 
                alt={sticker.prompt}
                className="w-full h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-lg"
              />
              
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     const link = document.createElement('a');
                     link.href = sticker.imageUrl;
                     link.download = `stickr-${sticker.id}.png`;
                     link.click();
                   }}
                   className="p-2.5 bg-white text-slate-900 rounded-full hover:scale-110 shadow-lg transition-all"
                   title="Download"
                 >
                   <Download size={18} />
                 </button>
                 <button 
                   onClick={(e) => handleDeleteClick(e, sticker.id)}
                   className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 shadow-lg transition-all"
                   title="Delete"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                 {sticker.style}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {stickerToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={cancelDelete}>
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-pop border border-slate-100" 
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 mx-auto ring-8 ring-red-50/50">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete Sticker?</h3>
            <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">
              Are you sure you want to delete this sticker? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all hover:translate-y-[-1px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};