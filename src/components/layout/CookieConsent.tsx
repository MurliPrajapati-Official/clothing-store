import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Check, X, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent-preferences');
    if (!consent) {
      // Premium delayed appearance
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPrefs = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(allPrefs));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(essentialOnly));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(preferences));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed z-[100] left-4 right-4 md:left-8 md:right-auto md:max-w-md",
          "bottom-20 md:bottom-8" // Sits perfectly above the bottom menu on mobile
        )}
      >
        <div className="bg-surface-card/95 backdrop-blur-xl border border-hairline p-5 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 text-left">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ink/5 rounded-full flex items-center justify-center text-ink shrink-0">
                <Cookie size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-ink tracking-tight">Cookie Settings</h3>
                <p className="text-[10px] text-ink/80 uppercase font-bold tracking-widest mt-0.5">Customized Experience</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted hover:text-ink transition-colors p-1"
              aria-label="Close Banner"
            >
              <X size={18} />
            </button>
          </div>

          {/* Description */}
          {!showCustomize ? (
            <p className="text-ink/80 text-[12px] md:text-sm font-normal leading-relaxed">
              We use cookies to optimize our uniform designs, store experience, and analytics. Customize your options below or accept all to continue.
            </p>
          ) : (
            <div className="flex flex-col gap-3 py-2 border-y border-hairline/30">
              {/* Essential */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-ink">Essential Cookies</span>
                  <span className="text-[10px] text-muted leading-snug">Required for system security, cart operations and account logins.</span>
                </div>
                <div className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-ink/5 text-ink">
                  <Check size={14} />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-ink">Analytics Cookies</span>
                  <span className="text-[10px] text-muted leading-snug">Helps us track store page performance and understand uniform demands.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 flex items-center",
                    preferences.analytics ? "bg-ink" : "bg-hairline"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-canvas shadow-sm transition-transform",
                    preferences.analytics ? "translate-x-4" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-ink">Marketing Cookies</span>
                  <span className="text-[10px] text-muted leading-snug">Allows us to deliver personalized announcements and sizing deals.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 flex items-center",
                    preferences.marketing ? "bg-ink" : "bg-hairline"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-canvas shadow-sm transition-transform",
                    preferences.marketing ? "translate-x-4" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline/30">
            {!showCustomize ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-ink text-canvas hover:bg-ink/90 active:scale-95 transition-all text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm whitespace-nowrap"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="bg-surface-card border border-hairline hover:bg-surface-elevated active:scale-95 transition-all text-muted hover:text-ink text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap"
                  title="Customize Preferences"
                >
                  <Settings size={14} /> Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="bg-surface-card border border-hairline hover:bg-surface-elevated active:scale-95 transition-all text-muted hover:text-ink text-xs font-bold py-2.5 px-3 rounded-xl whitespace-nowrap"
                >
                  Reject
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-ink text-canvas hover:bg-ink/90 active:scale-95 transition-all text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm"
                >
                  Save Choices
                </button>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="bg-surface-card border border-hairline hover:bg-surface-elevated active:scale-95 transition-all text-muted hover:text-ink text-xs font-bold py-2.5 px-4 rounded-xl"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
