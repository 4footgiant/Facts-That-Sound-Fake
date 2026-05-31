import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fact, Category, Achievement, GameStats } from './types';
import { CATEGORIES, INITIAL_ACHIEVEMENTS, getWittyExplanation } from './factsData';
import Splash from './components/Splash';
import Home from './components/Home';
import Categories from './components/Categories';
import FactGame from './components/FactGame';
import Favourites from './components/Favourites';
import AchievementsPanel from './components/AchievementsPanel';
import AchievementToast from './components/AchievementToast';
import AdMobBanner from './components/AdMobBanner';
import CustomDialog from './components/CustomDialog';
import { Eye, ShieldAlert, Sparkles, HelpCircle, Laptop } from 'lucide-react';

export default function App() {
  // Screens navigation state: 'splash' | 'home' | 'play' | 'categories' | 'favourites' | 'achievements'
  const [activeTab, setActiveTab] = useState<'splash' | 'home' | 'play' | 'categories' | 'favourites' | 'achievements'>('splash');
  
  // Selected category limit for general gameplay (null = all/shuffle)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Loaded Fact entries
  const [facts, setFacts] = useState<Fact[]>([]);

  // Loaded Category entries
  const [categories, setCategories] = useState<Category[]>([]);

  // User State
  const [favouritedIds, setFavouritedIds] = useState<string[]>([]);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [octopusClicks, setOctopusClicks] = useState<number>(0);
  const [consecutiveIncorrectCount, setConsecutiveIncorrectCount] = useState<number>(0);
  const [historyAnswersCorrect, setHistoryAnswersCorrect] = useState<number>(0);

  // Active Toast Achievement notification popup
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // Custom Intercepting Dialog system state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showDialog = useCallback((
    title: string,
    message: string,
    onConfirm?: () => void,
    showCancel = false,
    confirmText = 'OK',
    cancelText = 'CANCEL',
    onCancel?: () => void
  ) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      showCancel,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  }, []);

  // Game Statistics
  const [stats, setStats] = useState<GameStats>({
    correctAnswersCount: 0,
    totalAnswersCount: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  // Dynamic fetch of facts database from JSON
  useEffect(() => {
    const loadAllFacts = () => {
      try {
        const jsonFiles = import.meta.glob('./assets/data/*.json', { eager: true });
        const dynamicCategories: Category[] = [];
        const combinedFacts: Fact[] = [];

        Object.keys(jsonFiles).forEach((path) => {
          const catId = path.split('/').pop()?.replace('.json', '') || '';
          const module = jsonFiles[path] as any;
          const rawList = module?.default || module;

          if (Array.isArray(rawList) && rawList.length > 0) {
            const first = rawList[0];
            const defaultEmojis: Record<string, string> = {
              animals: '🐙',
              space: '👽',
              brain_damage: '🧠',
              sounds_illegal: '🚫',
              cursed: '☠️',
              humans: '👤',
              history: '📜',
              food: '🍔'
            };
            dynamicCategories.push({
              id: catId,
              title: first.category || catId.charAt(0).toUpperCase() + catId.slice(1),
              subheading: first.subcategory || first.subheading || '',
              emoji: defaultEmojis[catId] || '💡'
            });

            const loaded = rawList.map((f: any) => {
              return {
                id: f.id,
                category: catId,
                subheading: f.subcategory || f.subheading || '',
                fact: f.fact,
                answer: f.answer,
                rarity: f.rarity,
                type: f.type,
                explanation: getWittyExplanation(f.id, f.fact, f.answer)
              } as Fact;
            });

            combinedFacts.push(...loaded);
          }
        });

        const order = ['animals', 'space', 'brain_damage', 'sounds_illegal', 'humans', 'history', 'food', 'cursed'];
        dynamicCategories.sort((a, b) => {
          const idxA = order.indexOf(a.id);
          const idxB = order.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.title.localeCompare(b.title);
        });

        setCategories(dynamicCategories);
        setFacts(combinedFacts);
      } catch (error) {
        console.error('Failure in dynamic offline telemetry retrieval:', error);
      }
    };

    loadAllFacts();
  }, []);

  // Load from LocalStorage once on startup
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('ffff_saved_ids');
      if (savedFavs) setFavouritedIds(JSON.parse(savedFavs));

      const savedSeen = localStorage.getItem('ffff_seen_ids');
      if (savedSeen) setDiscoveredIds(JSON.parse(savedSeen));

      const savedStats = localStorage.getItem('ffff_stats');
      if (savedStats) setStats(JSON.parse(savedStats));

      const savedAch = localStorage.getItem('ffff_unlocked_achievements');
      if (savedAch) setUnlockedAchievementIds(JSON.parse(savedAch));

      const savedOct = localStorage.getItem('ffff_octopus_clicks');
      if (savedOct) setOctopusClicks(Number(savedOct));

      const savedIncorrect = localStorage.getItem('ffff_incorrect_streak');
      if (savedIncorrect) setConsecutiveIncorrectCount(Number(savedIncorrect));

      const savedHistoryCorrect = localStorage.getItem('ffff_history_correct');
      if (savedHistoryCorrect) setHistoryAnswersCorrect(Number(savedHistoryCorrect));
    } catch (e) {
      console.error('Failure reading offline matrix state:', e);
    }
  }, []);

  // Save changes to LocalStorage
  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to offline files:', e);
    }
  };

  // Toggle saving bookmark facts
  const handleToggleFavourite = useCallback((id: string) => {
    setFavouritedIds((prevFavs) => {
      const nextList = prevFavs.includes(id)
        ? prevFavs.filter((item) => item !== id)
        : [...prevFavs, id];
      saveState('ffff_saved_ids', nextList);
      return nextList;
    });
  }, []);

  // Reset or clear state easter egg
  const handleClearAchievements = useCallback(() => {
    setUnlockedAchievementIds([]);
    setFavouritedIds([]);
    setDiscoveredIds([]);
    setOctopusClicks(0);
    setConsecutiveIncorrectCount(0);
    setHistoryAnswersCorrect(0);
    setStats({
      correctAnswersCount: 0,
      totalAnswersCount: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    localStorage.clear();
    showDialog(
      'MEMORY CONTEXT PURGE',
      '🧠 Reality clean complete!\n\nAll decrypted facts, discovered streams, and memory lines have been successfully wiped from local storage.'
    );
    setActiveTab('home');
  }, [showDialog]);

  // Register Achievement unlocking with notification handler
  const triggerUnlockAchievement = useCallback((achId: string) => {
    setUnlockedAchievementIds((prevUnlocks) => {
      if (prevUnlocks.includes(achId)) return prevUnlocks; // already unlocked

      const original = INITIAL_ACHIEVEMENTS.find((a) => a.id === achId);
      if (!original) return prevUnlocks;

      const nextUnlocks = [...prevUnlocks, achId];
      saveState('ffff_unlocked_achievements', nextUnlocks);

      // Trigger Popup Toast Notification
      setActiveToast({
        ...original,
        isUnlocked: true,
      });

      return nextUnlocks;
    });
  }, []);

  // Track octopus clicking easter egg
  const handleOctopusClick = useCallback(() => {
    setOctopusClicks((prevVal) => {
      const nextVal = prevVal + 1;
      saveState('ffff_octopus_clicks', nextVal);

      if (nextVal >= 5) {
        triggerUnlockAchievement('octopus_cultist');
      }
      return nextVal;
    });
  }, [triggerUnlockAchievement]);

  // Dynamic feedback checking for unlock achievements after every guess answer
  const checkAnswerAchievements = useCallback((isCorrect: boolean, factObj: Fact, nextStats: GameStats) => {
    // 1. First blood incorrect or correct
    if (isCorrect && nextStats.correctAnswersCount === 1) {
      triggerUnlockAchievement('first_blood');
    }

    // 2. Streaks of 5 and 10
    if (nextStats.currentStreak >= 5) {
      triggerUnlockAchievement('streak_5');
    }
    if (nextStats.currentStreak >= 10) {
      triggerUnlockAchievement('streak_10');
    }

    // 3. Gullible Earthling (3 wrong guesses in a row)
    if (!isCorrect) {
      setConsecutiveIncorrectCount((prev) => {
        const nextIncorrectStreak = prev + 1;
        saveState('ffff_incorrect_streak', nextIncorrectStreak);

        if (nextIncorrectStreak >= 3) {
          triggerUnlockAchievement('fail_3_streak');
        }
        return nextIncorrectStreak;
      });
    } else {
      setConsecutiveIncorrectCount(0);
      saveState('ffff_incorrect_streak', 0);
    }

    // 4. History Buff (5 History answers correct)
    if (isCorrect && factObj.category === 'history') {
      setHistoryAnswersCorrect((prev) => {
        const nextHist = prev + 1;
        saveState('ffff_history_correct', nextHist);

        if (nextHist >= 5) {
          triggerUnlockAchievement('history_buff');
        }
        return nextHist;
      });
    }

    // 5. Completionist (Encounter/discover 25 unique facts)
    setDiscoveredIds((prevSeen) => {
      const nextSeen = prevSeen.includes(factObj.id)
        ? prevSeen
        : [...prevSeen, factObj.id];

      if (!prevSeen.includes(factObj.id)) {
        saveState('ffff_seen_ids', nextSeen);
      }

      if (nextSeen.length >= 25) {
        triggerUnlockAchievement('completionist');
      }
      return nextSeen;
    });
  }, [triggerUnlockAchievement]);

  // Helper trigger called directly by FactGame subclass on active display
  const handleFactEncountered = useCallback((factObj: Fact, isCorrect: boolean) => {
    setStats((prevStats) => {
      // Calculate score
      const nextStats = {
        correctAnswersCount: prevStats.correctAnswersCount + (isCorrect ? 1 : 0),
        totalAnswersCount: prevStats.totalAnswersCount + 1,
        currentStreak: isCorrect ? prevStats.currentStreak + 1 : 0,
        bestStreak: isCorrect 
          ? Math.max(prevStats.bestStreak, prevStats.currentStreak + 1) 
          : prevStats.bestStreak,
      };

      saveState('ffff_stats', nextStats);

      // Run dynamic validators
      checkAnswerAchievements(isCorrect, factObj, nextStats);

      return nextStats;
    });
  }, [checkAnswerAchievements]);

  // Handle Encounters with Classified Forbidden Knowledge
  const handleEncounterForbidden = useCallback(() => {
    triggerUnlockAchievement('forbidden_knowledge');
  }, [triggerUnlockAchievement]);

  // Play Random option
  const handlePlayRandomFactDirectly = useCallback(() => {
    setSelectedCategory(null);
    setActiveTab('play');
  }, []);

  const handleSplashComplete = useCallback(() => {
    setActiveTab('home');
  }, []);

  const handleNavigate = useCallback((tab: 'play' | 'categories' | 'favourites' | 'achievements') => {
    if (tab === 'play') {
      setSelectedCategory(null); // start random playlist
    }
    setActiveTab(tab);
  }, []);

  // List of parsed achievements with unlocked status hydrated from localStorage
  const hydratedAchievements = INITIAL_ACHIEVEMENTS.map((ach) => ({
    ...ach,
    isUnlocked: unlockedAchievementIds.includes(ach.id),
  }));

  return (
    <div className="min-h-screen bg-[#0d0d10] text-neutral-100 flex flex-col md:py-6 md:px-4 items-center justify-center font-sans overflow-x-hidden antialiased">
      
      {/* Background Ambience Glare */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-900/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-900/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Achievement Popup Toast */}
      <AchievementToast 
        achievement={activeToast} 
        onClose={() => setActiveToast(null)} 
      />

      {/* Frame wrapper simulating Android high-contrast layout */}
      <div className="w-full max-w-md h-[100dvh] md:h-[780px] bg-[#070708] md:border md:border-neutral-850/80 md:rounded-[32px] md:shadow-2xl flex flex-col justify-between overflow-hidden relative md:mx-auto">
        
        {/* Android status bar mockups only on desktop */}
        <div className="hidden md:flex justify-between items-center px-6 py-3 bg-[#05055] border-b border-neutral-900 text-[10px] text-neutral-500 font-mono select-none">
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[blink-slow_2s_infinite]" />
            MATRIX_NET_H4X
          </span>
          <span className="text-[10px] text-neutral-600 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900 font-mono">
            SECURE LINK COMPLIANT
          </span>
          <span className="flex items-center gap-1">
            <span>2026-05</span>
            <Laptop size={11} className="text-neutral-550 shrink-0" />
          </span>
        </div>

        {/* Outer Scanline effect overlay on everything */}
        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />

        {/* Dynamic Route Rendering */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'splash' && (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Splash onComplete={handleSplashComplete} />
              </motion.div>
            )}

            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Home
                  stats={stats}
                  totalFacts={facts.length}
                  discoveredCount={discoveredIds.length}
                  onNavigate={handleNavigate}
                  onPlayRandom={handlePlayRandomFactDirectly}
                  onOctopusClick={handleOctopusClick}
                />
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Categories
                  categories={categories}
                  onSelectCategory={(catId) => {
                    setSelectedCategory(catId);
                    setActiveTab('play');
                  }}
                  onBack={() => setActiveTab('home')}
                />
              </motion.div>
            )}

            {activeTab === 'play' && (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex-1 flex flex-col min-h-0"
              >
                <FactGame
                  categoryFilter={selectedCategory}
                  facts={facts}
                  favouritedIds={favouritedIds}
                  onToggleFavourite={handleToggleFavourite}
                  onBack={() => setActiveTab('home')}
                  onUnlockForbidden={handleEncounterForbidden}
                  onRecordAnswer={handleFactEncountered}
                  showDialog={showDialog}
                />
              </motion.div>
            )}

            {activeTab === 'favourites' && (
              <motion.div
                key="favourites"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Favourites
                  favouritedIds={favouritedIds}
                  facts={facts}
                  onToggleFavourite={handleToggleFavourite}
                  onBack={() => setActiveTab('home')}
                  showDialog={showDialog}
                />
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex-1 flex flex-col min-h-0"
              >
                <AchievementsPanel
                  achievements={hydratedAchievements}
                  onBack={() => setActiveTab('home')}
                  onClearAchievements={handleClearAchievements}
                  showDialog={showDialog}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Standard Android Nav Bar mockup only if not on Splash screen */}
        {activeTab !== 'splash' && (
          <div className="shrink-0 bg-[#070708] flex flex-col">
            {/* Display the Non-intrusive AdMob banner ad at the bottom of the screens */}
            <AdMobBanner showDialog={showDialog} />

            {/* Simulated Android Software buttons at the exact bottom */}
            <div className="h-10 border-t border-neutral-900 bg-black flex justify-around items-center px-12 z-50">
              {/* BACK button soft */}
              <button
                onClick={() => {
                  if (activeTab !== 'home') {
                    setActiveTab('home');
                  }
                }}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-400 active:scale-90 transition"
                title="System Back to Home Screen"
                id="sys_back_btn"
              >
                <span className="border-l-2 border-b-2 border-current w-2 h-2 rotate-45 transform translate-x-1" />
              </button>
              
              {/* HOME button soft */}
              <button
                onClick={() => setActiveTab('home')}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-400 active:scale-90 transition"
                title="System Home"
                id="sys_home_btn"
              >
                <span className="border-2 border-current rounded-full w-2.5 h-2.5" />
              </button>

              {/* STACK/RECENTS button soft */}
              <button
                onClick={() => {
                  const responses = [
                    'Scanning running tasks...\nAll encryption layers are solid.',
                    'The octopuses are watching your terminal. Maintain secrecy.',
                    'No other background processes found. 100% offline-isolated and secure.',
                  ];
                  showDialog(
                    'SYSTEM DIAGNOSTICS',
                    responses[Math.floor(Math.random() * responses.length)]
                  );
                }}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-400 active:scale-95 transition"
                title="System Recents"
                id="sys_recents_btn"
              >
                <span className="border-2 border-current w-2.5 h-2.5 rounded-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Global Immersive Dialog Modal */}
        <CustomDialog
          isOpen={dialogState.isOpen}
          title={dialogState.title}
          message={dialogState.message}
          confirmText={dialogState.confirmText}
          cancelText={dialogState.cancelText}
          showCancel={dialogState.showCancel}
          onConfirm={dialogState.onConfirm}
          onCancel={dialogState.onCancel}
        />
      </div>
    </div>
  );
}


// Override FactGame inside App to handle callback mapping correctly since some TS definitions expect onRecordAnswerDetail
// Let's modify the FactGame definition file or handle it inside FactGame
