"use client";
import { useEffect, useState } from "react";
import { websettingsData } from "@/store/reducers/webSettings";
import {
  settingsConfigurationSucess,
  settingsSucess,
  sysConfigdata,
} from "@/store/reducers/settingsSlice";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Meta from "../SEO/Meta";
import {
  homeReceived,
  homeRequestFailed,
  homeUpdateLanguage,
} from "@/store/reducers/homeSlice";
import isQuizEnabled from "@/checkquiz/CheckQuizEnabled";
import {
  getSettingsApi,
  getSystemConfigurationsApi,
  getWebHomeSettingsApi,
} from "@/api/apiRoutes";
import { store } from "@/store/store";
import { AdBanner } from "@/components/Ads";
const TopHeader = dynamic(() => import("../NavBar/TopHeader"), { ssr: false });
const Header = dynamic(() => import("./Header"), { ssr: false });
const Footer = dynamic(() => import("./Footer"), { ssr: false });
import Image from "next/image";
import darkModeStar from "../../assets/images/darkModeStar.png";
const PwaInstallButton = dynamic(() => import("../Common/PwaInstallButton"), {
  ssr: false,
});
const CookieConsent = dynamic(() => import("../Common/CookieConsent"), {
  ssr: false,
});
// const Notification = dynamic(() => import('../FirebaseNotification/Notification'), { ssr: false })

const Layout = ({ children }) => {
  const navigate = useRouter();
  const pathname = usePathname();

  const [redirect, setRedirect] = useState(false);

  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const webSettings = useSelector(websettingsData);

  const systemconfig = useSelector(sysConfigdata);

  // Check if current page is a quiz play screen (should not show ads)
  const isPlayScreen =
    pathname?.includes("dashboard-play") ||
    pathname?.includes("true-and-false-play") ||
    pathname?.includes("daily-quiz-dashboard") ||
    pathname?.includes("random-battle") ||
    pathname?.includes("group-battle");

  // Check if layout ads are enabled from admin
  const showLayoutAds = systemconfig?.adsense_show_layout_ads !== "0";

  // Check if AdSense banner credentials are configured
  const hasAdsenseBannerCredentials =
    (systemconfig?.adsense_client_id ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) &&
    (systemconfig?.adsense_banner_slot_id ||
      process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT_ID);

  // const storedTheme = localStorage.getItem("theme");

  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("manualRefresh_Home", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const state = store.getState();
    const { currentLanguage } = store.getState().Languages;
    const { lastFetch, Lang } = state.Home;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    const firstLoad = sessionStorage.getItem("firstLoad_Home");
    const manualRefresh = sessionStorage.getItem("manualRefresh_Home");
    // If API data is fetched within last 10 minutes then don't call the API again
    const shouldFetchData = !firstLoad || manualRefresh === "true";

    const getHomeData = async () => {
      const response = await getWebHomeSettingsApi({});

      if (!response?.error) {
        dispatch(homeUpdateLanguage(selectcurrentLanguage.id));
        dispatch(homeReceived(response));
        sessionStorage.setItem("lastFetch_Home", Date.now());
      }

      if (response.error) {
        dispatch(homeRequestFailed(response));
        dispatch(homeUpdateLanguage(""));
      }
    };
    if (
      currentLanguage?.id != Lang?.language_id ||
      diffInMinutes > 10 ||
      shouldFetchData
    ) {
      getHomeData();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_Home");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_Home", "true");
  }, [selectcurrentLanguage]);

  // all settings data
  useEffect(() => {
    const getSettings = async () => {
      const response = await getSettingsApi({ type: "" });
      if (!response?.error) {
        sessionStorage.setItem("lastFetch_Settings", Date.now());
        dispatch(settingsSucess(response));
      }

      if (response.error) {
        console.error(response);
      }
    };

    const firstLoad = sessionStorage.getItem("firstLoad_Settings");
    const manualRefresh = sessionStorage.getItem("manualRefresh_Settings");
    // If API data is fetched within last 10 minutes then don't call the API again
    const shouldFetchData = !firstLoad || manualRefresh === "true";
    if (shouldFetchData) {
      getSettings();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_Settings");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_Settings", "true");
  }, []);

  useEffect(() => {
    const firstLoadSysConfig = sessionStorage.getItem(
      "firstLoad_Settings_Config",
    );
    const manualRefreshSysConfig = sessionStorage.getItem(
      "manualRefresh_Settings_Config",
    );

    const shouldFetchDataResponse =
      !firstLoadSysConfig || manualRefreshSysConfig === "true";

    const getSystemConfig = async () => {
      const sysConfig = await getSystemConfigurationsApi();
      if (sysConfig) {
        sessionStorage.setItem("lastFetch_Settings_Config", Date.now());
        dispatch(settingsConfigurationSucess(sysConfig));
      }
    };

    if (shouldFetchDataResponse) {
      getSystemConfig();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_Settings_Config");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_Settings_Config", "true");
  }, []);

  // Maintainance Mode
  const getsysData = useSelector(sysConfigdata);

  useEffect(() => {
    if (getsysData && getsysData.app_maintenance === "1") {
      setRedirect(true);
    } else {
      setRedirect(false);
    }
  }, [getsysData?.app_maintenance]);

  // Function to handle navigation to maintenance page
  const handleMaintenanceRedirect = () => {
    navigate.push("/maintenance");
  };

  useEffect(() => {
    if (redirect) {
      handleMaintenanceRedirect(); // Trigger the navigation outside the JSX
    }
  }, [redirect]);

  useEffect(() => {
    // Initialize theme from localStorage
    const storedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    const primaryColor =
      webSettings && webSettings?.primary_color
        ? storedTheme === "dark"
          ? process.env.NEXT_PUBLIC_DARK_MODE_PRIMARY_COLOR
          : webSettings && webSettings?.primary_color
        : "#EF5388FF";

    const secondaryColor =
      webSettings && webSettings?.footer_color
        ? storedTheme === "dark"
          ? "linear-gradient(180deg, rgba(255, 255, 255, 0.0512) 0%, rgba(255, 255, 255, 0.1024) 100%)"
          : webSettings?.footer_color
        : "#090029FF";

    // Set primary and secondary colors for any theme
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--secondary-color",
      secondaryColor,
    );

    // Set primary-light color (a lighter version of primary color)
    document.documentElement.style.setProperty(
      "--primary-light",
      "#f7ccdd", // Light pink that matches the SVG background
    );

    // Set dark mode specific CSS variables
    if (storedTheme === "dark") {
      // Ensure dark mode colors are properly visible in dark theme
      document.documentElement.style.setProperty(
        "--dark-primary-color",
        primaryColor,
      );
      document.documentElement.style.setProperty(
        "--dark-secondary-color",
        secondaryColor,
      );
      document.documentElement.style.setProperty(
        "--primary-light",
        "#f7ccdd", // Keep the same light color in dark mode
      );
    }
  }, [webSettings]);

  // Register PWA Service Worker
  useEffect(() => {
    const isWebAppEnabled = process.env.NEXT_PUBLIC_SHOW_WEB_APP === "true";

    if (isWebAppEnabled && "serviceWorker" in navigator) {
      // Register immediately - don't wait for 'load' event as it may have already fired
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.log("PWA Service Worker registration failed:", error);
        });
    }
  }, []);

  // this function is for primary color gradient
  const primaryColor =
    document.documentElement.style.getPropertyValue("--primary-color");

  useEffect(() => {
    if (primaryColor) {
      const hsl = hexToHSL(primaryColor);
      const lightHex = hslToHex(hsl.h, hsl.s, Math.min(hsl.s + 15, 100));
      const darkHex = hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 35, 0));

      document.documentElement.style.setProperty("--gradient-from", lightHex);
      document.documentElement.style.setProperty("--gradient-to", darkHex);
    }
  }, [primaryColor]);

  function hexToHSL(hex) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      Math.round(
        255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
      );

    return `#${[f(0), f(8), f(4)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;
  }

  return (
    <main className="main overflow-hidden">
        <div className="hidden dark:block"></div>
        <Meta />
        <TopHeader />
        <Header />

        {/* Layout Top Ad - Only show when not on play screen and credentials exist */}
        {!isPlayScreen && showLayoutAds && hasAdsenseBannerCredentials && (
          <div className="container my-4">
            <AdBanner />
          </div>
        )}

        {children}

        {/* Layout Bottom Ad - Only show when not on play screen and credentials exist */}
        {!isPlayScreen && showLayoutAds && hasAdsenseBannerCredentials && (
          <div className="container my-4">
            <AdBanner />
          </div>
        )}

        <Footer />
        <PwaInstallButton />
        <CookieConsent />
      </main>
  );
};
export default isQuizEnabled(Layout);
