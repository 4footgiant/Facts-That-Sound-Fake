import { CATEGORIES } from '../factsData';
import { Category } from '../types';
import { ChevronLeft, Grid } from 'lucide-react';

interface CategoriesProps {
  categories?: Category[];
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
}

export default function Categories({ categories = [], onSelectCategory, onBack }: CategoriesProps) {
  const displayCategories = categories.length > 0 ? categories : CATEGORIES;

  // Border colors matching the mystery theme
  const borderColors: Record<string, string> = {
    animals: 'hover:border-red-500/40 border-red-950/20 active:bg-neutral-900',
    space: 'hover:border-purple-500/40 border-purple-950/20 active:bg-neutral-900',
    brain_damage: 'hover:border-amber-500/40 border-amber-950/20 active:bg-neutral-900',
    sounds_illegal: 'hover:border-emerald-500/40 border-emerald-950/20 active:bg-neutral-900',
    cursed: 'hover:border-neutral-500/40 border-neutral-900 active:bg-neutral-900',
    humans: 'hover:border-blue-500/40 border-blue-950/20 active:bg-neutral-900',
    history: 'hover:border-amber-600/40 border-amber-950/25 active:bg-neutral-900',
    food: 'hover:border-orange-500/40 border-orange-950/20 active:bg-neutral-900'
  };

  const emojiShadows: Record<string, string> = {
    animals: 'shadow-[0_0_20px_rgba(239,68,68,0.1)] border-red-900/20',
    space: 'shadow-[0_0_20px_rgba(168,85,247,0.1)] border-purple-900/20',
    brain_damage: 'shadow-[0_0_20px_rgba(245,158,11,0.1)] border-amber-900/20',
    sounds_illegal: 'shadow-[0_0_20px_rgba(16,185,129,0.1)] border-emerald-900/20',
    cursed: 'shadow-[0_0_20px_rgba(115,115,115,0.1)] border-neutral-805',
    humans: 'shadow-[0_0_20px_rgba(59,130,246,0.1)] border-blue-900/20',
    history: 'shadow-[0_0_20px_rgba(217,119,6,0.1)] border-amber-800/20',
    food: 'shadow-[0_0_20px_rgba(249,115,22,0.1)] border-orange-900/20'
  };

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden bg-[#070708] text-neutral-200">
      {/* Top action header bar */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-900 shrink-0 h-14">
        <div className="w-16 flex justify-start">
          <button
            onClick={onBack}
            className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs cursor-pointer p-1.5 rounded hover:bg-neutral-900 transition"
            id="btn_categories_back"
          >
            <ChevronLeft size={16} />
            <span>BACK</span>
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0 text-center">
          <Grid size={14} className="text-red-500 shrink-0" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-450 truncate">
            CHOOSE LAB
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Main categories scrollable block */}
      <div className="flex-1 overflow-y-auto touch-pan-y scroll-smooth pb-24 p-4 min-h-0">
        <div className="text-center py-4 space-y-1">
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-200">
            Intellections
          </h2>
          <p className="text-[11px] text-neutral-600 font-mono">
            SELECT FROM THE {displayCategories.length} DECRYPTED MODULES
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-2">
          {displayCategories.map((cat: Category) => {
            const borderStyle = borderColors[cat.id] || 'hover:border-neutral-500/30';
            const shadowStyle = emojiShadows[cat.id] || 'shadow-lg';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left bg-neutral-905 border ${borderStyle} rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 cursor-pointer shadow-md`}
                id={`btn_cat_${cat.id}`}
              >
                {/* Large visual side marker */}
                <div className={`p-3 sm:p-4 rounded-xl bg-[#0c0c0d] border ${shadowStyle} text-2xl sm:text-3xl shrink-0 flex items-center justify-center`}>
                  {cat.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-100 uppercase tracking-wide truncate">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 mt-1.5 leading-relaxed italic font-sans line-clamp-2 break-words">
                    "{cat.subheading}"
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
