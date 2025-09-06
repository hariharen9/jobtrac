import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ExternalLink, CheckCircle } from "lucide-react";

interface OfflineContextProps {
  isOffline: boolean;
  showOfflineModal: () => void;
}

const OfflineContext = createContext<OfflineContextProps | undefined>(
  undefined
);

export const useOfflineWarning = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error(
      "useOfflineWarning must be used within an OfflineWarningProvider"
    );
  }
  return context;
};

export const OfflineWarningProvider: React.FC<{ 
  children: React.ReactNode; 
}> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [showIssueButton, setShowIssueButton] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const offlineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const connectionCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOnline = useCallback(() => {
    setIsRestoring(true);
    setShowIssueButton(false);
    if (offlineTimerRef.current) clearTimeout(offlineTimerRef.current);
    if (connectionCheckTimerRef.current)
      clearInterval(connectionCheckTimerRef.current);

    setTimeout(() => {
      setIsOffline(false);
      setShowModal(false);
      setIsRestoring(false);
    }, 3000); // Show success message for 3 seconds
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch(
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
        {
          method: "HEAD",
          cache: "no-cache",
        }
      );
      if (response.ok) {
        handleOnline();
      }
    } catch (error) {
      // Still offline
    }
  }, [handleOnline]);

  useEffect(() => {
    const handleOfflineEvent = () => {
      setIsOffline(true);
      setShowModal(true);
      offlineTimerRef.current = setTimeout(() => {
        setShowIssueButton(true);
      }, 30000); // 30 seconds
      connectionCheckTimerRef.current = setInterval(checkConnection, 5000); // Check every 5 seconds
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOfflineEvent);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOfflineEvent);
      if (offlineTimerRef.current) clearTimeout(offlineTimerRef.current);
      if (connectionCheckTimerRef.current)
        clearInterval(connectionCheckTimerRef.current);
    };
  }, [checkConnection, handleOnline]);

  const showOfflineModal = useCallback(() => {
    if (isOffline) {
      setShowModal(true);
    }
  }, [isOffline]);

  const issueUrl = `https://github.com/hariharen9/jobtrac/issues/new?title=Offline+Connection+Issue&body=**Error:**%0A%60%60%60%0AThe+application+is+reporting+an+offline+connection+issue+that+is+not+resolving+automatically.%0A%60%60%60%0A%0A**User+Troubleshooting+Steps:**%0A%60%60%60%0A-%20Checked%20internet%20connection%0A-%20Tried%20reloading%20the%20page%0A%60%60%60%0A%0A**Browser%2FOS%20Details:**%0A%60%60%60%0A${navigator.userAgent}%0A%60%60%60`;

  return (
    <OfflineContext.Provider value={{ isOffline, showOfflineModal }}>
      {children}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 right-5 z-50"
          >
            <div
              className={`p-4 rounded-lg shadow-lg ${
                isRestoring
                  ? "bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200"
                  : "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200"
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {isRestoring ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="font-bold">
                    {isRestoring
                      ? "And... we're back online! ✅"
                      : "Houston, we have a connection problem! ❌"}
                  </p>
                  <p className="text-sm">
                    {isRestoring
                      ? "Welcome back! You can now beam your changes up to the cloud."
                      : "You've gone incognito from the web. But fear not! I've tucked your changes away safely until you reconnect."}
                  </p>
                </div>
              </div>
              {showIssueButton && !isRestoring && (
                <div className="mt-4 pt-4 border-t border-yellow-400 dark:border-yellow-700">
                  <p className="text-sm">
                    Is the Wi-Fi icon still ghosting you? <br/> If a classic 'turn it
                    off and on again' doesn't work and the problem persists, the gremlins might be on our
                    end.
                  </p>
                  <a
                    href={issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1 mt-2 text-xs font-semibold text-white bg-slate-800 rounded-md dark:bg-slate-200 dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Summon the Devs on GitHub
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OfflineContext.Provider>
  );
};