/**
 * Google Mobile Ads (AdMob) Production SDK Integration
 * Production app-id: ca-app-pub-6124210193707319~8872667203
 * Production ad-unit: ca-app-pub-6124210193707319/2672574993
 */

export const ADMOB_APP_ID = 'ca-app-pub-6124210193707319~8872667203';
export const ADMOB_BANNER_AD_UNIT_ID = 'ca-app-pub-6124210193707319/2672574993';

// Simple boolean flag indicating if initialized
let isSdkInitialized = false;

/**
 * Initializes the Google Mobile Ads SDK once at startup.
 * Handles both typical mobile wrapper environments (Capacitor/Cordova)
 * and web-based Google AdSense/Publisher tags cleanly.
 */
export async function initializeAdMob(): Promise<boolean> {
  if (isSdkInitialized) {
    console.log('[AdMob] SDK already initialized.');
    return true;
  }

  console.log(`[AdMob] Initializing Google Mobile Ads SDK with App ID: ${ADMOB_APP_ID}...`);

  try {
    // 1. Initialize custom mobile environment AdMob wrapper if available (Capacitor/Cordova)
    const win = window as any;
    if (win.AdMob) {
      if (typeof win.AdMob.initialize === 'function') {
        await win.AdMob.initialize({
          appId: ADMOB_APP_ID,
          initializeForTesting: false,
        });
        console.log('[AdMob] Native AdMob SDK initialized via window.AdMob.');
        isSdkInitialized = true;
        return true;
      }
    }

    // 2. Inject Google Ads snippet dynamically for PWA/Web/Hybrid wrapper flexibility
    if (typeof document !== 'undefined') {
      const scriptId = 'google-adsense-sdk';
      if (!document.getElementById(scriptId)) {
        // We use the publisher client ID (extracted from production App/Ad Unit ID)
        // ca-app-pub-6124210193707319... -> ca-pub-6124210193707319
        const publisherId = 'ca-pub-6124210193707319';
        
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        
        script.onload = () => {
          console.log('[AdMob] Web Ads SDK script loaded successfully.');
          // Initialize adsbygoogle array
          try {
            win.adsbygoogle = win.adsbygoogle || [];
            console.log('[AdMob] adsbygoogle object registered.');
          } catch (e) {
            console.warn('[AdMob] Failed to prepare window.adsbygoogle:', e);
          }
        };
        
        script.onerror = (err) => {
          console.warn('[AdMob] Web Ads SDK script failed to load. Likely blocked by client ad-blocker:', err);
        };

        document.head.appendChild(script);
      }
    }

    isSdkInitialized = true;
    console.log('[AdMob] Google Mobile Ads baseline web/hybrid configuration completed.');
    return true;
  } catch (error) {
    console.error('[AdMob] Graceful initialization safeguard triggered:', error);
    // Never crash the host application due to ad initialization issues.
    return false;
  }
}

/**
 * Checks if the SDK has loaded successfully
 */
export function isAdMobInitialized(): boolean {
  return isSdkInitialized;
}
