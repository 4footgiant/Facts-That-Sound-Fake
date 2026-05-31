import { useState } from 'react';
import { Play, Grid, Star, Shuffle, Trophy, HelpCircle, Eye } from 'lucide-react';
import { GameStats } from '../types';

interface HomeProps {
  stats: GameStats;
  totalFacts: number;
  discoveredCount: number;
  onNavigate: (tab: 'play' | 'categories' | 'favourites' | 'achievements') => void;
  onPlayRandom: () => void;
  onOctopusClick: () => void;
}

export default function Home({
  stats,
  totalFacts,
  discoveredCount,
  onNavigate,
  onPlayRandom,
  onOctopusClick
}: HomeProps) {
  const [clickCount, setClickCount] = useState(0);
  const [bubbleText, setBubbleText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  const handleOctopusPush = () => {
    onOctopusClick();
    const nextVal = clickCount + 1;
    setClickCount(nextVal);

    // Flash screen
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 80);

    const responses = [
      '🐙 A distant squishy gurgle is heard...',
      '🐙 "WE ARE WATCHING."',
      '🐙 The cephalopod matrix is pleased.',
      '🐙 You touched a suction cup. Real.',
      '🐙 8 legs, 3 hearts, 1 mission. Join us.',
      '🐙 [REDACTED WATER TEMPERATURE]',
      '🐙 Forbidden ink coordinates saved.',
      '🐙 Reality stability reduced by 2%.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setBubbleText(randomResponse);

    // auto clear response bubble after 2.5s
    setTimeout(() => {
      setBubbleText((prev) => (prev === randomResponse ? '' : prev));
    }, 2800);
  };

  const winRatio = stats.totalAnswersCount > 0 
    ? Math.round((stats.correctAnswersCount / stats.totalAnswersCount) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto touch-pan-y scroll-smooth p-5 space-y-6 select-none bg-[#070708] relative min-h-0">
      {/* Glitch Overlay when clicking logo */}
      {isGlitching && (
        <div className="absolute inset-0 bg-red-600/10 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-red-500 font-mono text-2xs uppercase tracking-widest">
            OCTOPUS COGNITION SYNCING
          </div>
        </div>
      )}

      {/* Top Header Logo */}
      <div className="flex flex-col items-center justify-center pt-4 space-y-3">
        {/* Clickable Eye Logo (Easter Egg) */}
        <button
          onClick={handleOctopusPush}
          className="relative group focus:outline-none focus:ring-2 focus:ring-red-600/20 rounded-full p-3 bg-neutral-900 border border-neutral-850 hover:border-red-500/30 transition-all duration-300"
          id="btn_mascot_logo"
          title="Click to summon the Cephalopod Conclave"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1.5 rounded-full border border-red-500/5 group-hover:border-red-500/10 animate-pulse" />
          
          <Eye size={36} className="text-red-500/90 group-hover:text-red-500 transition-colors duration-200" />
        </button>

        {/* Mascot Bubble message */}
        <div className="h-6 flex items-center justify-center">
          {bubbleText && (
            <div className="animate-bounce bg-neutral-900 border border-red-900/30 text-red-400 font-mono text-[9px] px-2.5 py-0.5 rounded-full shadow-lg">
              {bubbleText}
            </div>
          )}
        </div>

        {/* Title Area */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 font-bold uppercase block">
            CLASSIFIED RETRIEVAL
          </span>
          <h1 className="text-2xl font-extrabold tracking-wider text-neutral-100 uppercase">
            FACTS THAT <span className="text-red-500 font-mono font-bold line-through">SOUND</span> FAKE
          </h1>
          <p className="text-[11px] text-neutral-400 max-w-xs mx-auto text-center font-sans tracking-wide">
            "A weird mysterious internet fact machine."
          </p>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-905 border border-neutral-850 p-2.5 rounded-xl text-center">
        <div className="border-r border-neutral-850/60">
          <span className="block text-[9px] text-neutral-500 font-mono uppercase">DISCOVERED</span>
          <span className="text-sm font-bold text-neutral-200 font-mono">
            {discoveredCount}<span className="text-neutral-600">/{totalFacts}</span>
          </span>
        </div>
        <div className="border-r border-neutral-850/60">
          <span className="block text-[9px] text-neutral-500 font-mono uppercase">ACCURACY</span>
          <span className="text-sm font-bold text-purple-400 font-mono">
            {winRatio}%
          </span>
        </div>
        <div>
          <span className="block text-[9px] text-neutral-500 font-mono uppercase">STREAK</span>
          <span className="text-sm font-bold text-amber-500 font-mono flex items-center justify-center gap-0.5">
            {stats.currentStreak} 🔥
          </span>
        </div>
      </div>

      {/* Main Large START FACTS Button */}
      <div className="flex flex-col items-center justify-center py-2">
        <button
          onClick={() => onNavigate('play')}
          className="w-full max-w-xs bg-red-950/50 hover:bg-red-900/40 text-red-400 border border-red-800/60 font-mono font-bold py-4 px-6 rounded-xl text-md tracking-widest shadow-lg shadow-red-955/20 transition-all duration-250 active:scale-98 flex items-center justify-center gap-2"
          id="btn_start_facts"
        >
          <Play size={18} fill="currentColor" className="text-red-400 animate-pulse" />
          START FACTS
        </button>
      </div>

      {/* Navigation Options - Quick Launch */}
      <div className="space-y-2.5 max-w-xs w-full mx-auto">
        {/* Grid Row 1: Categories & Favourites */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('categories')}
            className="flex flex-col items-center justify-center gap-1 bg-neutral-900/80 hover:bg-neutral-850/90 border border-neutral-800 p-3 rounded-lg text-neutral-200 hover:text-white transition duration-200"
            id="btn_nav_categories"
          >
            <Grid size={18} className="text-purple-400" />
            <span className="text-3xs font-mono uppercase tracking-wider">Categories</span>
          </button>

          <button
            onClick={() => onNavigate('favourites')}
            className="flex flex-col items-center justify-center gap-1 bg-neutral-900/80 hover:bg-neutral-850/90 border border-neutral-800 p-3 rounded-lg text-neutral-200 hover:text-white transition duration-200"
            id="btn_nav_favourites"
          >
            <Star size={18} className="text-amber-400" />
            <span className="text-3xs font-mono uppercase tracking-wider">Collected Facts</span>
          </button>
        </div>

        {/* Row 2: Random Fact & Achievements */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onPlayRandom}
            className="flex flex-col items-center justify-center gap-1 bg-neutral-900/80 hover:bg-neutral-850/90 border border-neutral-800 p-3 rounded-lg text-neutral-200 hover:text-white transition duration-200"
            id="btn_nav_random_fact"
          >
            <Shuffle size={18} className="text-neon-green text-emerald-450 text-emerald-400" />
            <span className="text-3xs font-mono uppercase tracking-wider">Random Fact</span>
          </button>

          <button
            onClick={() => onNavigate('achievements')}
            className="flex flex-col items-center justify-center gap-1 bg-neutral-900/80 hover:bg-neutral-850/90 border border-neutral-800 p-3 rounded-lg text-neutral-200 hover:text-white transition duration-200"
            id="btn_nav_achievements"
          >
            <Trophy size={18} className="text-amber-500" />
            <span className="text-3xs font-mono uppercase tracking-wider">Achievements</span>
          </button>
        </div>
      </div>

      {/* Disclaimer bottom note */}
      <div className="text-center font-mono text-[8px] text-neutral-600 flex justify-center items-center gap-1 tracking-wider uppercase">
        <HelpCircle size={8} /> Only 99% of these are true. We are not responsible.
      </div>
    </div>
  );
}
