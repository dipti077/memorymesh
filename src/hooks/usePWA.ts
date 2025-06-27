import { useState, useEffect } from 'react';

interface PWAInfo {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
}

export function usePWA(): PWAInfo {
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    platform: 'unknown'
  });

  useEffect(() => {
    const updatePWAInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      let platform: PWAInfo['platform'] = 'unknown';
      
      if (userAgent.includes('android')) {
        platform = 'android';
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        platform = 'ios';
      } else if (userAgent.includes('windows') || userAgent.includes('mac') || userAgent.includes('linux')) {
        platform = 'desktop';
      }

      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;

      // Check if app is installed (running in standalone mode)
      const isInstalled = isStandalone;

      // Check if installation is supported
      const canInstall = 'serviceWorker' in navigator && 
                        'BeforeInstallPromptEvent' in window;

      setPwaInfo({
        isInstallable: canInstall && !isInstalled,
        isInstalled,
        isStandalone,
        canInstall,
        platform
      });
    };

    updatePWAInfo();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', updatePWAInfo);

    // Listen for app installation
    window.addEventListener('appinstalled', updatePWAInfo);

    return () => {
      mediaQuery.removeEventListener('change', updatePWAInfo);
      window.removeEventListener('appinstalled', updatePWAInfo);
    };
  }, []);

  return pwaInfo;
}