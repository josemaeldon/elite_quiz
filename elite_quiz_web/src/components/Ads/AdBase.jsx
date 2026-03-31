"use client";
import { useEffect, useRef, useState, useId } from "react";

/**
 * AdBase - Core AdSense component with all the logic
 * This component handles:
 * - Loading AdSense script
 * - Displaying ads
 * - Hiding when ad doesn't fill
 * - Preventing layout shift
 * - Unique ID tracking to prevent duplicate pushes
 */
const AdBase = ({
  slotId,
  clientId,
  format = "auto",
  responsive = true,
  style = {},
  className = "",
  minHeight = 90,
  aspectRatio = null, // e.g., "336/280" for square ads
}) => {
  const adRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAd, setHasAd] = useState(true);
  const [isPushed, setIsPushed] = useState(false);
  const uniqueId = useId(); // React 18+ unique ID hook

  useEffect(() => {
    // Early exit if no credentials - but hooks are already called above
    if (!slotId || !clientId) {
      return;
    }

    // Generate unique push ID for this ad instance
    const pushId = `${slotId}-${uniqueId}`;

    // Initialize global tracking object
    if (typeof window !== "undefined") {
      window.__adsPushed = window.__adsPushed || {};
    }

    // Skip if already pushed
    if (window.__adsPushed?.[pushId]) {
      setIsPushed(true);
      setIsLoaded(true);
      return;
    }

    // Check if AdSense script is already loaded
    const existingScript = document.querySelector(
      'script[src*="pagead2.googlesyndication.com"]',
    );

    if (!existingScript) {
      // Load AdSense script
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        pushAd(pushId);
      };
      script.onerror = () => {
        setHasAd(false);
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded, just push the ad
      // Small delay to ensure AdSense is fully initialized
      const timer = setTimeout(() => {
        pushAd(pushId);
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      // Cleanup - remove from tracking on unmount
      if (window.__adsPushed?.[pushId]) {
        delete window.__adsPushed[pushId];
      }
    };
  }, [slotId, clientId, uniqueId]);

  const pushAd = (pushId) => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        // Mark as pushed before pushing to prevent duplicates
        window.__adsPushed[pushId] = true;
        setIsPushed(true);

        window.adsbygoogle.push({});
        setIsLoaded(true);

        // Check if ad filled after a delay
        setTimeout(() => {
          if (adRef.current) {
            const insElement = adRef.current.querySelector("ins");
            if (insElement && insElement.dataset.adStatus === "unfilled") {
              setHasAd(false);
            }
          }
        }, 2000);
      }
    } catch (error) {
      // Silently handle errors in production
      if (process.env.NODE_ENV === "development") {
        console.error("AdSense error:", error);
      }
      setHasAd(false);
    }
  };

  // Don't render if no credentials or ad doesn't fill
  if (!slotId || !clientId || !hasAd) {
    return null;
  }

  // Calculate container styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...(aspectRatio
      ? { aspectRatio: aspectRatio }
      : { minHeight: isLoaded ? "auto" : `${minHeight}px` }),
    ...style,
  };

  // Don't show anything until ad is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={containerStyle}
    >
      {/* AdSense Ins Element */}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdBase;
