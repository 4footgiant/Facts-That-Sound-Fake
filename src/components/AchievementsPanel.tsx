import { Achievement } from '../types';
import { ChevronLeft, Trophy, Sparkles, Flame, Skull, Hourglass, ShieldAlert, Database, HelpCircle } from 'lucide-react';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onBack: () => void;
  onClearAchievements?: () => void; // Easter egg to reset
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

// Icon mapper helper
const itemIcons: Record<string, any> = {
  Sparkles: Sparkles,
  Flame: Flame,
  Skull: Skull,
  Hourglass: Hourglass,
  ShieldAlert: ShieldAlert,
  Database: Database,
  HelpCircle: HelpCircle,
};

export default function AchievementsPanel({ achievements, onBack, onClearAchievements, showDialog }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const ratio = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden bg-[#070708] select-none text-neutral-200">
      
      {/* Top action header bar */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-900 shrink-0 h-14">
        <div className="w-16 flex justify-start">
          <button
            onClick={onBack}
            className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs cursor-pointer p-1 rounded hover:bg-neutral-900 transition"
            id="btn_ach_back"
          >
            <ChevronLeft size={16} />
            <span>BACK</span>
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0 text-center">
          <Trophy size={14} className="text-amber-500 shrink-0" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-450 truncate">
            SECURE INTEL RECOGNITIONS
          </span>
        </div>

        <div className="w-16 flex justify-end">
          {/* Secret clear click */}
          <button
            onClick={() => {
              if (showDialog) {
                showDialog(
                  'PURGE BRAIN CACHE',
                  'Are you absolutely sure you want to purge all achievements, local stats, and retrieved fact databases?\n\nThis neural pathway deletion cannot be undone.',
                  () => {
                    if (onClearAchievements) onClearAchievements();
                  },
                  true,
                  'PURGE',
                  'ABORT'
                );
              } else if (onClearAchievements && confirm('Erase your memories and achievements?')) {
                onClearAchievements();
              }
            }}
            className="text-[8px] font-mono text-neutral-700 hover:text-red-500 p-1 bg-transparent hover:bg-neutral-900 rounded transition leading-none border border-transparent hover:border-neutral-805"
            id="btn_reset_achievements"
          >
            [RESET]
          </button>
        </div>
      </div>

      {/* Main achievements workspace */}
      <div className="flex-1 overflow-y-auto touch-pan-y scroll-smooth pb-24 p-4 min-h-0 space-y-4">
        
        {/* Scoreboard block */}
        <div className="bg-neutral-905 border border-dashed border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <span className="text-3xs font-mono text-neutral-500 uppercase tracking-widest block font-bold">
              BRAIN DECAY PROGRESS
            </span>
            <h3 className="text-sm font-bold text-neutral-200 uppercase">
              {unlockedCount} OF {achievements.length} DECRYPTED ({ratio}%)
            </h3>
            {/* Custom Bar progress container */}
            <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden mt-1.5 border border-neutral-900">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
            <Trophy size={20} className={unlockedCount === achievements.length ? 'animate-bounce' : ''} />
          </div>
        </div>

        {/* List items */}
        <div className="space-y-2.5">
          {achievements.map((ach) => {
            const IconComponent = itemIcons[ach.icon] || Trophy;

            return (
              <div
                key={ach.id}
                className={`flex gap-3.5 p-3.5 rounded-xl border transition-all ${
                  ach.isUnlocked
                    ? 'bg-neutral-905 border-neutral-850 opacity-100'
                    : 'bg-neutral-950/40 border-neutral-950 opacity-40'
                }`}
                id={`ach_card_${ach.id}`}
              >
                {/* Status indicator Icon badge */}
                <div className={`p-2.5 rounded-lg shrink-0 border flex items-center justify-center h-11 w-11 ${
                  ach.isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-neutral-900 border-neutral-855 text-neutral-600'
                }`}>
                  <IconComponent size={20} />
                </div>

                {/* Text blocks */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-neutral-100 uppercase tracking-wide">
                      {ach.title}
                    </h4>
                    {ach.isUnlocked ? (
                      <span className="bg-amber-950/40 border border-amber-900 text-amber-400 font-mono text-[8px] px-1.5 py-0.5 rounded leading-none uppercase">
                        DECRYPTED
                      </span>
                    ) : (
                      <span className="bg-neutral-900 border border-transparent text-neutral-600 font-mono text-[8px] px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                        SECURED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 mt-1 leading-normal font-sans">
                    {ach.description}
                  </p>

                  {/* Sarcastic Comment overlay if unlocked */}
                  {ach.isUnlocked && (
                    <div className="mt-1.5 border-t border-neutral-900/60 pt-1.5">
                      <p className="text-[10px] italic text-neutral-500 font-mono leading-tight">
                        "{ach.sarcasticRemark}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
