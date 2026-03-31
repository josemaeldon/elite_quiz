"use client";
import { useState, useEffect } from "react";
import { FiDownload, FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { settingsData } from "../../store/reducers/settingsSlice";

const PwaInstallButton = () => {
  const { t } = useTranslation();
  const settings = useSelector(settingsData);
  const appName =
    settings &&
    settings.filter((item) => item.type == "app_name")[0] &&
    settings.filter((item) => item.type == "app_name")[0].message;
    

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showAlreadyInstalledModal, setShowAlreadyInstalledModal] =
    useState(false);

  // Check if SHOW_WEB_APP is enabled
  const isWebAppEnabled = process.env.NEXT_PUBLIC_SHOW_WEB_APP === "true";

  useEffect(() => {
    if (!isWebAppEnabled) return;

    // Check if mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Check if already installed as PWA (running in standalone mode)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Show button
    setShowInstallButton(true);

    // Check if global prompt was already captured by _app.js
    if (window.deferredPwaPrompt) {
      setDeferredPrompt(window.deferredPwaPrompt);
    }

    // Listen for custom event when prompt becomes ready
    const handlePromptReady = () => {
      if (window.deferredPwaPrompt) {
        setDeferredPrompt(window.deferredPwaPrompt);
      }
    };
    window.addEventListener("pwaPromptReady", handlePromptReady);

    // Also listen directly in case event fires after this component mounts
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPwaPrompt = e;
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Hide button when app is installed
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
      window.deferredPwaPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("pwaPromptReady", handlePromptReady);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isWebAppEnabled]);

  // Trigger native install prompt
  const handleInstallClick = async () => {
    // Try component state first, then global
    const prompt = deferredPrompt || window.deferredPwaPrompt;

    if (prompt) {
      try {
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === "accepted") {
          setShowInstallButton(false);
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        window.deferredPwaPrompt = null;
      } catch (error) {
        console.error("[PWA] Error:", error);
        // If prompt fails, app might already be installed
        setShowAlreadyInstalledModal(true);
      }
    } else {
      // No prompt available - app is likely already installed
      console.log("[PWA] No prompt available - app may be already installed");
      setShowAlreadyInstalledModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowInstallButton(false);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  const closeAlreadyInstalledModal = () => {
    setShowAlreadyInstalledModal(false);
    // Also dismiss the install button since app is already installed
    handleDismiss();
  };

  // Don't render if installed (running in standalone mode)
  if (isInstalled) return null;

  // Don't render if not enabled or dismissed
  if (!isWebAppEnabled || !showInstallButton || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Install Button */}
      <div
        className={`fixed z-50 ${isMobile ? "bottom-20 right-[10px]" : "bottom-6 right-6"}`}
      >
        <div
          className={`flex items-center gap-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--gradient-to)] rounded-[8px] shadow-lg ${isMobile ? "p-2" : "p-3"}`}
        >
          <button
            onClick={handleInstallClick}
            className={`flex items-center gap-2 text-white font-medium ${!isMobile ? "text-base" : ""}`}
          >
            <FiDownload className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
            <span>{t("install_app")}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white ml-2 p-1"
            aria-label="Dismiss"
          >
            <IoClose className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
          </button>
        </div>
      </div>

      {/* Already Installed Modal */}
      {showAlreadyInstalledModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiCheck className="w-6 h-6 text-green-500" />
                {t("already_installed")}
              </h3>
              <button
                onClick={closeAlreadyInstalledModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            <div className="text-gray-600 dark:text-gray-300 text-sm space-y-3">
              <p>
                <strong>{appName}</strong>{" "}
                {t("already_installed_msg", {
                  appName: "",
                  deviceType: isMobile ? t("device") : t("computer"),
                })}
              </p>
              <p>
                {t("find_app_msg", {
                  location: isMobile
                    ? t("home_screen")
                    : t("desktop_start_menu"),
                })}
              </p>
            </div>

            <button
              onClick={closeAlreadyInstalledModal}
              className="mt-6 w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t("got_it")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallButton;
