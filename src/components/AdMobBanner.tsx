import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { ADMOB_BANNER_AD_UNIT_ID } from '../lib/adMobSDK';

const SATIRICAL_ADS = [
  {
    title: '🐙 Cephalopod Premium Ink',
    desc: 'Breathe underwater. Squeeze through locks. Join the deep.',
    cta: 'Squeeze Now'
  },
  {
    title: '🛡️ Tin Foil Hat Pro Max',
    desc: 'Block 5G, 6G, and telepathic octopuses. Handcrafted.',
    cta: 'Protect Brain'
  },
  {
    title: '🚁 Black Helicopter Insurance',
    desc: 'In case they park on your kitchen. 0% deductible.',
    cta: 'Get Cover'
  },
  {
    title: '👁️ Is Your Neighbor a Hologram?',
    desc: 'Take our 3-question quiz to reveal their true refractive index.',
    cta: 'Test Them'
  },
  {
    title: '🌋 Inner Earth Timeshare',
    desc: 'Warm weather year-round. Meet the dinosaur royalty today.',
    cta: 'Descend'
  }
];

interface AdMobBannerProps {
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

export default function AdMobBanner({ showDialog }: AdMobBannerProps) {
  const [adIndex, setAdIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // Log active production banner unit load
    console.log(`[AdMob] Banner requested load using Production Ad Unit ID: ${ADMOB_BANNER_AD_UNIT_ID}`);
    
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % SATIRICAL_ADS.length);
    }, 15000); // Rotate every 15 seconds
    return () => clearInterval(timer);
  }, []);

  if (closed) {
    // Show a tiny re-open button so user knows they can look, or keep it closed.
    // In mobile apps, close buttons are rare but we can keep a tiny placeholder or just hide it.
    return (
      <div className="w-full h-1 bg-neutral-900 overflow-hidden text-center text-[8px] text-neutral-800">
        Google Satirical-AdServices [ACTIVE UNIT: {ADMOB_BANNER_AD_UNIT_ID}]
      </div>
    );
  }

  const currentAd = SATIRICAL_ADS[adIndex];

  return (
    <div className="w-full bg-neutral-950 border-t border-neutral-800 p-2 relative flex flex-col items-center">
      {/* Ad Tag top-left */}
      <div className="absolute top-1 left-2 flex items-center gap-1">
        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider leading-none">
          ADMOB AD
        </span>
        <span className="text-[8px] text-neutral-600 font-mono" title={`Production Unit ID: ${ADMOB_BANNER_AD_UNIT_ID}`}>
          ID: .../2672574993
        </span>
      </div>

      <button 
        onClick={() => setClosed(true)} 
        className="absolute top-1 right-2 text-neutral-600 hover:text-neutral-400 p-0.5"
        title="Close Ad"
        id="btn_close_ad"
      >
        <X size={10} />
      </button>

      {/* Ad Content */}
      <div className="mt-3 flex items-center justify-between w-full max-w-md gap-2 px-1">
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs font-semibold text-neutral-200 truncate flex items-center gap-1">
            {currentAd.title}
          </h4>
          <p className="text-[10px] text-neutral-400 leading-tight line-clamp-1">
            {currentAd.desc}
          </p>
        </div>
        <button
          onClick={() => {
            if (showDialog) {
              showDialog(
                'EXTERNAL AD SIGNAL INTRUSION',
                `🔗 Redirecting to redacted channel...\n\n"${currentAd.title}" has successfully saved you from local reality constraints.\n\nTracked Ad Unit: ${ADMOB_BANNER_AD_UNIT_ID}`
              );
            } else {
              alert(`🔗 Redirecting to redacted link...\n"${currentAd.title}" has successfully saved you from reality.\n\nTracked Ad Unit: ${ADMOB_BANNER_AD_UNIT_ID}`);
            }
          }}
          className="bg-red-950/40 hover:bg-red-900/30 border border-red-800/50 text-red-400 px-2 py-1 rounded text-[9px] font-mono font-medium transition flex items-center gap-1 shrink-0"
          id="btn_ad_cta"
        >
          <span>{currentAd.cta}</span>
          <ExternalLink size={8} />
        </button>
      </div>
    </div>
  );
}

