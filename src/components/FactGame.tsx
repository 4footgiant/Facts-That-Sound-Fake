import { useState, useEffect } from 'react';
import { Fact } from '../types';
import { ChevronLeft, Star, Share2, Eye, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface FactGameProps {
  categoryFilter: string | null; // null = random / all categories
  onBack: () => void;
  facts: Fact[];
  favouritedIds: string[];
  onToggleFavourite: (id: string) => void;
  onRecordAnswer: (factObj: Fact, isCorrect: boolean) => void;
  onUnlockForbidden: () => void;
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

// Funny Response Messages mapping
const CORRECT_RESPONSES = [
  'Suspiciously intelligent.',
  'Your brain survives another day.',
  'Access granted. Move on quickly.',
  'Slightly higher IQ detected. Strange.',
  'Correct, but please erase your memory now.',
  'Our octopus monitors are impressed.',
  'Outstanding neural capability.'
];

const INCORRECT_RESPONSES = [
  'Reality integrity compromised.',
  'The FBI is disappointed.',
  'Mental stability reduced.',
  'You fell for it. Classic human.',
  'Critical cognitive error.',
  'Even the octopuses knew this one.',
  'Your intelligence was redacted.'
];

export default function FactGame({
  categoryFilter,
  onBack,
  facts,
  favouritedIds,
  onToggleFavourite,
  onRecordAnswer,
  onUnlockForbidden,
  showDialog
}: FactGameProps) {
  // Filter facts belonging to the category, or random pool
  const [sessionFacts, setSessionFacts] = useState<Fact[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<boolean | null>(null); // null = has not guessed, true = guessed True, false = guessed Fake
  const [answered, setAnswered] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [shareText, setShareText] = useState('SHARE');

  // Trigger fact filter logic
  useEffect(() => {
    let filtered = categoryFilter
      ? facts.filter((f) => f.category === categoryFilter)
      : [...facts];

    // Shuffle facts inside the selected pool to ensure surprise
    filtered.sort(() => Math.random() - 0.5);

    if (filtered.length === 0) {
      filtered = [...facts]; // Fallback to all if something goes wrong
    }

    setSessionFacts(filtered);
    setCurrentIndex(0);
    resetPlayState();
  }, [categoryFilter, facts]);

  const currentFact: Fact | undefined = sessionFacts[currentIndex];

  // If a Forbidden fact is loaded, trigger special side effects or achievements
  useEffect(() => {
    if (currentFact && currentFact.rarity === 'Forbidden') {
      onUnlockForbidden();
      
      // Flash secondary glitch
      setGlitchTrigger(true);
      const timer = setTimeout(() => setGlitchTrigger(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentFact?.id, onUnlockForbidden]);

  // Reset answer states
  const resetPlayState = () => {
    setUserGuess(null);
    setAnswered(false);
    setResponseMsg('');
    setShareText('SHARE');
  };

  if (!currentFact) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-6 text-center select-none bg-[#070708]">
        <AlertCircle size={32} className="text-red-500 mb-2 animate-bounce" />
        <h3 className="text-sm font-mono text-neutral-400">MATRIX EMPTY</h3>
        <p className="text-xs text-neutral-600 mt-1 uppercase">Re-aligning temporal coordinates...</p>
        <button onClick={onBack} className="mt-4 bg-neutral-900 border border-neutral-800 text-neutral-200 px-4 py-2 rounded-xl text-xs font-mono">
          RETURN TO SAFE ZONE
        </button>
      </div>
    );
  }

  const handleGuess = (guess: boolean) => {
    if (answered) return;

    setUserGuess(guess);
    setAnswered(true);

    const isCorrect = guess === currentFact.answer;
    onRecordAnswer(currentFact, isCorrect);

    // Pick a funny response
    const pool = isCorrect ? CORRECT_RESPONSES : INCORRECT_RESPONSES;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    setResponseMsg(msg);
  };

  const handleNext = () => {
    if (currentIndex + 1 < sessionFacts.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Re-shuffle and start again if we exhausted the list
      const reshuffled = [...sessionFacts].sort(() => Math.random() - 0.5);
      setSessionFacts(reshuffled);
      setCurrentIndex(0);
    }
    resetPlayState();
  };

  const handleShare = () => {
    const textToCopy = `Did you know? "${currentFact.fact}" — Is this TRUE or FAKE? Find out in Facts That Sound Fake app! 🐙`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setShareText('COPIED!');
      setTimeout(() => setShareText('SHARE'), 2000);
    } else if (showDialog) {
      showDialog('SHARE TELEMETRY', textToCopy);
    } else {
      alert(`Share this forbidden telemetry:\n\n${textToCopy}`);
    }
  };

  const isFavourited = favouritedIds.includes(currentFact.id);

  // Styling maps for Rarity
  const rarityBadges: Record<string, { bg: string; text: string; border: string }> = {
    Common: { bg: 'bg-neutral-900/80', text: 'text-neutral-400', border: 'border-neutral-800/60' },
    Rare: { bg: 'bg-purple-950/20', text: 'text-purple-400', border: 'border-purple-800/40' },
    Legendary: { bg: 'bg-amber-950/25', text: 'text-amber-500 font-bold', border: 'border-amber-700/50' },
    Forbidden: { bg: 'bg-red-950/40 border-red-900 animate-pulse', text: 'text-red-500 font-extrabold', border: 'border-red-900/60' }
  };

  const badge = rarityBadges[currentFact.rarity] || rarityBadges.Common;

  return (
    <div className={`h-full flex-1 flex flex-col overflow-hidden select-none bg-[#070708] relative transition-colors duration-150 ${glitchTrigger ? 'bg-red-950/25' : ''}`}>
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-900 shrink-0 h-14">
        <div className="w-16 flex justify-start">
          <button
            onClick={onBack}
            className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs cursor-pointer p-1 rounded hover:bg-neutral-900 transition"
            id="btn_play_back"
          >
            <ChevronLeft size={16} />
            <span>EXIT</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center min-w-0 text-center">
          <span className="text-[8px] font-mono tracking-widest text-neutral-600 block uppercase">
            ACTIVE SUBJECT
          </span>
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest truncate w-full px-1">
            {categoryFilter ? categoryFilter.replace('_', ' ') : 'RANDOM ARCHIVE'}
          </span>
        </div>

        <div className="w-16 flex justify-end">
          {/* Saved Flag Toggle */}
          <button
            onClick={() => onToggleFavourite(currentFact.id)}
            className={`p-1.5 rounded-lg border transition ${
              isFavourited 
                ? 'bg-amber-950/30 text-amber-500 border-amber-800/50' 
                : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-neutral-300'
            }`}
            title={isFavourited ? 'Unsave from files' : 'Save to offline files'}
            id="btn_toggle_saved"
          >
            <Star size={14} fill={isFavourited ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Fact Workspace */}
      <div className="flex-1 overflow-y-auto touch-pan-y scroll-smooth px-5 py-2 relative min-h-0 flex flex-col">
        <div className="w-full my-auto flex flex-col">
        
          {/* Classified top label if Rare or Higher */}
        <div className="flex justify-center items-center gap-2 mb-2 sm:mb-4 shrink-0">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-mono tracking-wider uppercase ${badge.bg} ${badge.border} ${badge.text}`}>
            {currentFact.rarity === 'Forbidden' && <ShieldAlert size={10} className="animate-pulse" />}
            {currentFact.rarity === 'Legendary' && <Sparkles size={10} />}
            <span>{currentFact.rarity} Fact</span>
          </div>

          <span className="text-[10px] text-neutral-600 font-mono">
            {currentFact.type.toUpperCase()}
          </span>
        </div>

        {/* Fact Text Container */}
        <div className="bg-neutral-905 border border-neutral-850 rounded-2xl p-5 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[190px] duration-150">
          
          {/* Subtle logo silhouette in background */}
          <div className="absolute right-3 bottom-3 opacity-3 text-neutral-700 pointer-events-none">
            <Eye size={120} />
          </div>

          {/* Fact Introductory subtitle */}
          <span className="text-[9px] sm:text-2xs font-mono tracking-widest text-red-500 uppercase inline-block max-w-full mb-2 font-semibold border-b border-neutral-900 pb-1 leading-relaxed break-words">
            {currentFact.subheading || 'Telemetry Log'}
          </span>

          {currentFact.rarity === 'Forbidden' && !answered && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-red-950/90 py-3 text-center border-y border-red-800/50 z-10 flex flex-col items-center p-2">
              <span className="text-red-500 font-mono text-[9px] tracking-widest uppercase font-extrabold animate-pulse">
                CLASSIFIED Telemetry
              </span>
              <span className="text-neutral-200 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Answer to decrypt files
              </span>
            </div>
          )}

          {/* Big Readable Fact Text */}
          <p className={`text-sm sm:text-base md:text-lg text-neutral-200 tracking-wide font-medium leading-relaxed font-sans text-center transition-all ${
            currentFact.rarity === 'Forbidden' && !answered ? 'blur-xs select-none opacity-20' : ''
          }`}>
            "{currentFact.fact}"
          </p>
        </div>

        {/* Reveal Resolution Panel */}
        <div className={`${answered ? 'min-h-[105px] h-auto mt-3 py-1' : 'h-6 mt-2'} flex flex-col justify-center items-center shrink-0 transition-all duration-150`}>
          {answered ? (
            <div className="w-full text-center space-y-1.5 sm:space-y-2 animate-fadeIn animate-duration-150">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest font-bold uppercase ${
                  currentFact.answer 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                    : 'bg-red-950/40 text-red-400 border border-red-900/40'
                }`}>
                  TRUTH: {currentFact.answer ? 'COMPLETELY TRUE' : 'TOTAL FAKE'}
                </span>

                <span className="text-neutral-600 font-mono text-[9px] hidden sm:inline">
                  |
                </span>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-300 font-mono text-[9px] uppercase tracking-wider transition bg-neutral-900/60 border border-neutral-850 px-2 py-0.5 rounded cursor-pointer"
                  id="btn_share_fact"
                >
                  <Share2 size={9} />
                  <span>{shareText}</span>
                </button>

                <span className="text-neutral-600 font-mono text-[9px] hidden sm:inline">
                  |
                </span>

                <button
                  onClick={() => onToggleFavourite(currentFact.id)}
                  className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider transition border px-2 py-0.5 rounded cursor-pointer ${
                    isFavourited 
                      ? 'bg-amber-950/40 text-amber-400 border-amber-800/60 font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                      : 'bg-neutral-900/60 text-neutral-500 border-neutral-850 hover:text-neutral-250'
                  }`}
                  title={isFavourited ? 'Collected' : 'Collect fact'}
                  id="btn_reveal_collect_fact"
                >
                  {isFavourited ? (
                    <span className="text-[10px] leading-none shrink-0" role="img" aria-label="Octopus">🐙</span>
                  ) : (
                    <Star size={9} className="text-neutral-500" />
                  )}
                  <span>{isFavourited ? 'COLLECTED' : 'COLLECT'}</span>
                </button>
              </div>

              {/* Explanatory sentence */}
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans leading-relaxed px-1">
                {currentFact.explanation}
              </p>

              {/* Sarcastic Comment */}
              <p className="text-[10px] text-red-400 font-mono tracking-wide italic mt-1 animate-pulse">
                🤖 "{responseMsg}"
              </p>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-3xs font-mono text-neutral-600 uppercase tracking-widest">
                Is this fact true or fake?
              </span>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="p-5 border-t border-neutral-900/80 bg-neutral-950/45 shrink-0">
        {!answered ? (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {/* TRUE button */}
            <button
              onClick={() => handleGuess(true)}
              className="bg-emerald-950/30 hover:bg-emerald-900/30 active:scale-97 border border-emerald-900/60 hover:border-emerald-500/40 text-emerald-400 font-mono font-bold py-3 px-4 rounded-xl text-xs tracking-widest transition duration-150 cursor-pointer shadow-lg shadow-emerald-950/10"
              id="btn_guess_true"
            >
              TRUE
            </button>

            {/* FAKE button */}
            <button
              onClick={() => handleGuess(false)}
              className="bg-red-950/30 hover:bg-red-900/30 active:scale-97 border border-red-900/60 hover:border-red-500/40 text-red-500 font-mono font-bold py-3 px-4 rounded-xl text-xs tracking-widest transition duration-150 cursor-pointer shadow-lg shadow-red-955/10"
              id="btn_guess_fake"
            >
              FAKE
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="w-full max-w-xs bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-100 font-mono font-bold py-3 px-6 rounded-xl text-xs tracking-widest transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              id="btn_next_fact"
            >
              NEXT FACT ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
