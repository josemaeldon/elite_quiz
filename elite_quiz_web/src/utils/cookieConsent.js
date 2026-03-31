// Cookie Consent Utility Functions

const CONSENT_KEY = "cookie_consent"; // Changed from hyphen to underscore

export const getCookieConsent = () => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  let hasGaCookie = false;

  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === CONSENT_KEY) {
      return value;
    }
    // Check for Google Analytics cookies
    if (name.startsWith("_ga") || name.startsWith("_gid")) {
      hasGaCookie = true;
    }
  }

  // If we find GA cookies but no explicit consent cookie, assume consent was given previously
  if (hasGaCookie) {
    return "accepted";
  }

  return null;
};

export const setCookieConsent = (value) => {
  if (typeof window === "undefined") return;

  // Set cookie for 1 year
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);

  document.cookie = `${CONSENT_KEY}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

export const hasConsent = () => {
  return getCookieConsent() === "accepted";
};

export const clearCookieConsent = () => {
  if (typeof window === "undefined") return;
  document.cookie = `${CONSENT_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const loadGoogleAnalytics = (measurementId) => {
  if (typeof window === "undefined" || !measurementId || window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { page_path: window.location.pathname });
};

export const disableGoogleAnalytics = (measurementId) => {
  if (typeof window === "undefined" || !measurementId) return;
  window[`ga-disable-${measurementId}`] = true;
};
