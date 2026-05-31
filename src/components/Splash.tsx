import { useEffect, useState } from 'react';
import { LOADING_MESSAGES } from '../factsData';
import { LoadingMessage } from '../types';
import { Eye, HelpCircle } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [selectedMessage, setSelectedMessage] = useState<LoadingMessage>({
    text: 'Connecting truth matrix...',
    rarity: 'Common'
  });
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Pick a loaded message using rarity chances.
    // Common: 70%, Rare: 24%, Legendary: 6%
    const rand = Math.random();
    let filtered: LoadingMessage[] = [];

    if (rand < 0.08) {
      // Legendary trigger!
      filtered = LOADING_MESSAGES.filter((m) => m.rarity === 'Legendary');
    } else if (rand < 0.3) {
      // Rare trigger!
      filtered = LOADING_MESSAGES.filter((m) => m.rarity === 'Rare');
    }

    if (filtered.length === 0) {
      filtered = LOADING_MESSAGES.filter((m) => m.rarity === 'Common');
    }

    const item = filtered[Math.floor(Math.random() * filtered.length)];
    setSelectedMessage(item);

    // Random glitch flashes
    const glitchInterval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120);
    }, 450);

    // Auto complete in 1800ms
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Color matching rarity
  const rarityColors = {
    Common: 'text-neutral-500',
    Rare: 'text-purple-400 font-medium',
    Legendary: 'text-amber-400 font-extrabold animate-pulse'
  };

  return (
    <div className="fixed inset-0 bg-[#070708] flex flex-col justify-between items-center p-6 select-none overflow-hidden z-[9999]">
      {/* Visual Glitch Frame lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* Micro random glitch line across screen */}
      {glitching && (
        <div className="absolute w-full h-[1px] bg-red-500/20 top-[42%] left-0 animate-bounce duration-75" />
      )}

      {/* Top spacing */}
      <div />

      {/* Central Identity block */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm space-y-6">
        <div className="relative p-5 bg-neutral-900/60 rounded-full border border-neutral-800/80 shadow-2xl scale-105 duration-300">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border border-red-500/10 animate-ping duration-1000" />
          
          {/* Logo eyeball + tentacles mashup */}
          <div className="relative text-red-500 flex items-center justify-center">
            {glitching ? (
              <HelpCircle size={44} className="text-purple-500 animate-spin" />
            ) : (
              <Eye size={44} className="animate-pulse" />
            )}
          </div>
        </div>

        {/* Title area */}
        <div className="space-y-2">
          <h1 className={`text-2xs font-mono tracking-[0.3em] font-bold text-neutral-500 uppercase transition-all duration-100 ${glitching ? 'text-red-500 scale-95 skew-x-3' : ''}`}>
            Cephalopod Intel
          </h1>
          
          <h2 className="text-xl md:text-2xl font-bold tracking-wider text-neutral-100 uppercase relative">
            <span className={`${glitching ? 'hidden' : 'inline'}`}>
              FACTS THAT SOUND FAKE
            </span>
            {glitching && (
              <span className="text-red-500 line-through tracking-widest block font-mono">
                [REDACTED DATA]
              </span>
            )}
          </h2>
          
          <div className="flex justify-center items-center gap-1">
            <span className="h-[2px] w-8 bg-neutral-800" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="h-[2px] w-8 bg-neutral-800" />
          </div>
        </div>
      </div>

      {/* Footer Loading bar */}
      <div className="w-full max-w-xs space-y-3 pb-8 text-center">
        <div className="h-[2px] w-full bg-neutral-900 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-red-600 to-purple-600 animate-loading-bar" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
            ESTABLISHING ENCRYPTED LINK
          </p>
          <p className={`text-xs font-mono h-5 mt-1 transition-all duration-150 truncate max-w-xs ${rarityColors[selectedMessage.rarity]}`}>
            {glitching ? '... [STREAM NOISE] ...' : selectedMessage.text}
          </p>
        </div>

        {selectedMessage.rarity !== 'Common' && (
          <div className="inline-flex items-center gap-1 bg-neutral-900/80 border border-neutral-800 px-2 py-0.5 rounded-full mt-1">
            <span className={`h-1 w-1 rounded-full ${selectedMessage.rarity === 'Legendary' ? 'bg-amber-400' : 'bg-purple-400'}`} />
            <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400">
              {selectedMessage.rarity} Event Activated
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
