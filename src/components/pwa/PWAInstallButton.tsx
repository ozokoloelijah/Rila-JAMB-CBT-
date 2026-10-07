import React, { useState } from 'react';
import { usePWAInstall } from '../../utils/pwa/usePWAInstall';
import { Download, Monitor, CheckCircle, X, Info, Apple, Terminal } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean; buttonStyle?: 'primary' | 'secondary' | 'badge' }> = ({
  compact = false,
  buttonStyle = 'primary',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Desktop App Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install JAMB CBT as a standalone desktop app on Windows, macOS, or Linux"
        className={`flex items-center gap-2 rounded-xl font-bold transition shadow-sm active:scale-95 cursor-pointer ${
          isInstallable
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 ring-1 ring-emerald-400/40'
            : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
        } ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'}`}
      >
        <Download className={`w-4 h-4 ${isInstallable ? 'animate-bounce text-white' : 'text-emerald-400'}`} />
        <span>{isInstallable ? 'Install Desktop App' : 'Desktop Install'}</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Install Offline Desktop App</h3>
                  <p className="text-xs text-slate-400">Windows 10/11 • macOS • Linux • ChromeOS</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-200 text-xs flex gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <strong>Complete Offline Operation:</strong> Once installed, this application launches in its own dedicated window without browser address bars, caches all past questions, 8-key shortcuts, audio alerts, and analytics, and functions with zero internet connection!
                </div>
              </div>

              {isInstallable && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center">
                  <p className="text-xs font-semibold text-slate-200 mb-2.5">
                    Your browser supports 1-click installation!
                  </p>
                  <button
                    onClick={async () => {
                      const res = await install();
                      if (res) setShowGuide(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    Click to Install Standalone App Now
                  </button>
                </div>
              )}

              {/* OS Tabs / Instructions */}
              <div className="space-y-3 text-xs">
                {/* Windows 10 & 11 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-100 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-blue-400">Windows 10 & 11 (Google Chrome, Microsoft Edge, Brave)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                    <li>Look at the right side of the address bar for the <strong>Install App icon (⊕ or computer display)</strong>.</li>
                    <li>Or click <strong>Menu (⋮) &rarr; "Save and share" / "Apps" &rarr; "Install JAMB CBT Practice"</strong>.</li>
                    <li>Click <strong>Install</strong> to pin it to your Windows Taskbar, Start Menu, and Desktop.</li>
                  </ol>
                </div>

                {/* macOS */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-100 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-slate-200">macOS (Chrome, Edge, or Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                    <li><strong>In Chrome/Edge:</strong> Click the <strong>Install icon</strong> in address bar or Menu &rarr; "Install JAMB CBT".</li>
                    <li><strong>In Safari (macOS Sonoma+):</strong> Click <strong>File &rarr; "Add to Dock..."</strong>.</li>
                    <li>It runs as a native Mac app with Spotlight search and Dock integration.</li>
                  </ol>
                </div>

                {/* Linux */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-100 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-amber-400">Linux (Ubuntu, Debian, Fedora, Arch, Mint)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                    <li>In Chrome, Chromium, or Brave, click <strong>Menu (⋮) &rarr; "Install JAMB CBT Practice"</strong>.</li>
                    <li>Creates a desktop `.desktop` launcher in your Application Menu (`~/.local/share/applications`).</li>
                    <li>Launches offline without internet anytime.</li>
                  </ol>
                </div>

                {/* Apple iOS */}
                {isIOS && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-slate-100 mb-1.5">
                      <span className="text-emerald-400">Apple iOS (iPhone / iPad)</span>
                    </div>
                    <p className="text-slate-300">
                      Tap the <strong>Share</strong> button in Safari toolbar &rarr; scroll down &rarr; tap <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-slate-800 hover:bg-slate-750 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 transition"
            >
              Close Guide & Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};
