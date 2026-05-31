import { useState } from 'react';
import { Fact } from '../types';
import { ChevronLeft, Trash2, BookOpen, Star, AlertCircle } from 'lucide-react';

interface FavouritesProps {
  favouritedIds: string[];
  facts: Fact[];
  onToggleFavourite: (id: string) => void;
  onBack: () => void;
  showDialog?: (
    title: string,
    message: string,
    onConfirm?: () => void,
    showCancel?: boolean,
    confirmText?: string,
    cancelText?: string,
    onCancel?: () => void
  ) => void;
}

export default function Favourites({ favouritedIds, facts, onToggleFavourite, onBack, showDialog }: FavouritesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const savedFacts = facts.filter((f) => favouritedIds.includes(f.id));

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden bg-[#070708] select-none text-neutral-200">
      
      {/* Top action header bar */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-900 shrink-0 h-14">
        <div className="w-16 flex justify-start">
          <button
            onClick={onBack}
            className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs cursor-pointer p-1 rounded hover:bg-neutral-900 transition"
            id="btn_saved_back"
          >
            <ChevronLeft size={16} />
            <span>BACK</span>
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0 text-center">
          <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-450 truncate">
            COLLECTED FACTS
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto touch-pan-y scroll-smooth pb-24 p-4 min-h-0 space-y-3">
        {savedFacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 px-4">
            <BookOpen size={28} className="text-neutral-700 animate-pulse" />
            
            <div className="space-y-1">
              <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                COLLECTION EMPTY
              </h3>
              <p className="text-[11px] text-neutral-600 font-sans max-w-2xs leading-relaxed">
                No collected facts yet. Tap the collector icon after revealing a fact to save it.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <span className="text-3xs font-mono text-neutral-600 block mb-1 uppercase tracking-wider">
              COLLECTED TELEMETRY: {savedFacts.length}
            </span>

            {savedFacts.map((fact: Fact) => {
              const isOpen = expandedId === fact.id;

              return (
                <div
                  key={fact.id}
                  className="bg-neutral-905 border border-neutral-850 rounded-xl overflow-hidden transition-all duration-150"
                  id={`saved_item_${fact.id}`}
                >
                  {/* Top expand header portion */}
                  <div
                    onClick={() => toggleExpand(fact.id)}
                    className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-neutral-900/40 select-none active:bg-neutral-900/60"
                  >
                    <span className="text-md shrink-0 mt-0.5">
                      {fact.answer ? '❇️' : '⛔'}
                    </span>
                    
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider">
                        {fact.category.replace('_', ' ')} · {fact.rarity}
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2 mt-0.5 font-medium">
                        "{fact.fact}"
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showDialog) {
                            showDialog(
                              'PURGE MEMORY ELEMENT',
                              `Are you sure you want to delete this recorded telemetry from your brain collected files?\n\n"${fact.fact}"`,
                              () => onToggleFavourite(fact.id),
                              true,
                              'PURGE',
                              'CANCEL'
                            );
                          } else if (confirm('Erase this knowledge?')) {
                            onToggleFavourite(fact.id);
                          }
                        }}
                        className="text-neutral-600 hover:text-red-500 hover:bg-neutral-900 p-1 rounded transition"
                        title="Delete from files"
                        id={`btn_delete_saved_${fact.id}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Expand panel holding details & answers */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-neutral-900 bg-neutral-950/20 text-xs text-neutral-400 space-y-2 animate-fadeIn animate-duration-100">
                      <div>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold mb-1">
                          DECISION RECORD
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          fact.answer 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                            : 'bg-red-950/40 text-red-400 border border-red-900/30'
                        }`}>
                          ANSWER: {fact.answer ? 'TRUE (FACT)' : 'FAKE'}
                        </span>
                      </div>

                      <div className="border-t border-neutral-900/60 pt-2 font-sans leading-relaxed">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold mb-0.5">
                          OFFICIAL EXPLANATION
                        </span>
                        {fact.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
