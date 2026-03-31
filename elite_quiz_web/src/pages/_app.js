// ** Store Imports
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "react-hot-toast";
import { Router } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";
import InspectElement from "@/components/InspectElement/InspectElement";
import Routes from "@/components/ZoneGuard/Routes";
import language from "@/utils/language";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { hasConsent } from "@/utils/cookieConsent";

// CSS File Here
import "react-loading-skeleton/dist/skeleton.css";
import "react-tooltip/dist/react-tooltip.css";
// import '../../public/assets/css/style.css'
import "../style/global.css";

const queryClient = new QueryClient();

// ** Configure JSS & ClassName
const App = ({ Component, pageProps }) => {
  // Set up router event handlers using useEffect to avoid multiple registrations
  useEffect(() => {
    // ========== GLOBAL PWA INSTALL PROMPT CAPTURE ==========
    // Capture beforeinstallprompt EARLY before any component mounts
    // This fixes the race condition where the event fires before PwaInstallButton listens
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store globally so PwaInstallButton can access it
      window.deferredPwaPrompt = e;
      // Dispatch custom event so components know the prompt is ready
      window.dispatchEvent(new CustomEvent("pwaPromptReady"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also capture app installed event
    const handleAppInstalled = () => {
      window.deferredPwaPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);
    // ========================================================

    // Progress bar handlers for route changes
    const handleRouteStart = () => {
      NProgress.start();
    };

    const handleRouteError = () => {
      NProgress.done();
    };

    const handleRouteComplete = (url) => {
      NProgress.done();

      // Track page views in Google Analytics when route changes
      // This enables live tracking of page navigation
      // Check if gtag is available and user has consented to cookies
      if (
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && hasConsent()
      ) {
        // Use a small delay to ensure gtag is loaded, or check if it exists
        const trackPageView = () => {
          if (window.gtag && typeof window.gtag === "function") {
            window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
              page_path: url,
            });
          } else {
            // If gtag is not ready yet, try again after a short delay
            setTimeout(trackPageView, 100);
          }
        };
        trackPageView();
      }
    };

    // Register event listeners
    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeError", handleRouteError);
    Router.events.on("routeChangeComplete", handleRouteComplete);

    // Cleanup: remove event listeners when component unmounts
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeError", handleRouteError);
      Router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <I18nextProvider i18n={language}>
          <Toaster position="top-center" containerClassName="toast-custom" />
          <InspectElement>
            <Routes>
              <Component {...pageProps} />
            </Routes>
          </InspectElement>
        </I18nextProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
