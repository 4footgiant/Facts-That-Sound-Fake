import { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { Sparkles, Flame, ShieldAlert, Skull, Hourglass, Database, HelpCircle, Trophy } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

// Icon Mapping
const itemIcons: Record<string, any> = {
  Sparkles: Sparkles,
  Flame: Flame,
  Skull: Skull,
  Hourglass: Hourglass,
  ShieldAlert: ShieldAlert,
  Database: Database,
  HelpCircle: HelpCircle,
};

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Wait for anim to finish
        setTimeout(onClose, 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const IconComponent = itemIcons[achievement.icon] || Trophy;

  return (
    <div
      name="achievement-notification-toast"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-[90%] max-w-sm bg-neutral-900 border border-amber-900/50 rounded-xl p-3.5 shadow-2xl flex items-start gap-3 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-12 opacity-0 scale-95'
      }`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-xl pointer-events-none" />

      {/* Rarity Ring */}
      <div className="relative p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
        <IconComponent size={20} className="animate-pulse" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            ACHIEVEMENT UNLOCKED
          </span>
          <span className="h-1 w-1 rounded-full bg-neutral-600" />
          <span className="text-[8px] font-mono text-neutral-500">SECRET</span>
        </div>
        
        <h4 className="text-sm font-bold text-neutral-100 mt-0.5 truncate">
          {achievement.title}
        </h4>
        
        <p className="text-xs text-neutral-400 mt-0.5 leading-tight">
          {achievement.description}
        </p>

        {/* Sarcastic Comment */}
        <p className="text-[10px] italic text-neutral-500 font-mono mt-1.5 border-l border-neutral-800 pl-2">
          "{achievement.sarcasticRemark}"
        </p>
      </div>
    </div>
  );
}
