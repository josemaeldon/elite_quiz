"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCookieBite } from "react-icons/fa";
import {
  getCookieConsent,
  setCookieConsent,
  loadGoogleAnalytics,
  disableGoogleAnalytics,
} from "@/utils/cookieConsent";

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    setMounted(true);

    // Check consent after component mounts
    const consent = getCookieConsent();

    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted" && measurementId) {
      loadGoogleAnalytics(measurementId);
    }
  }, [measurementId]);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setShowBanner(false);

    if (measurementId) {
      loadGoogleAnalytics(measurementId);
    }

    // Force page reload to ensure cookie is read correctly
    // window.location.reload();
  };

  const handleDecline = () => {
    setCookieConsent("declined");
    setShowBanner(false);

    if (measurementId) {
      disableGoogleAnalytics(measurementId);
    }
  };

  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white dark:!bg-[#211A3E] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-[var(--primary-color)]/10 rounded-full shrink-0">
            <FaCookieBite className="w-6 h-6 text-[var(--primary-color)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <FaCookieBite className="w-5 h-5 text-[var(--primary-color)] md:hidden" />
              {t("cookie_consent_title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("cookie_consent_message")}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {t("cookie_decline")}
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary-color)] hover:opacity-90 rounded-lg transition-opacity"
            >
              {t("cookie_accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
