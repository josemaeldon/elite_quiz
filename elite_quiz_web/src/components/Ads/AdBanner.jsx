"use client";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import AdBase from "./AdBase";

/**
 * AdBanner - Horizontal banner ad component
 * Best for: Headers, Footers, Between content sections
 * Standard sizes: 728x90 (Desktop), 320x50 (Mobile)
 */
const AdBanner = ({ className = "", style = {} }) => {
  const systemconfig = useSelector(sysConfigdata);

  const clientId =
    systemconfig?.adsense_client_id ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId =
    systemconfig?.adsense_banner_slot_id ||
    process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT_ID;

  if (!clientId || !slotId) {
    return null;
  }

  return (
    <AdBase
      clientId={clientId}
      slotId={slotId}
      format="horizontal"
      responsive={true}
      minHeight={90}
      aspectRatio="728/90"
      className={`ad-banner ${className}`}
      style={{
        width: "100%",
        maxWidth: "728px",
        margin: "0 auto",
        ...style,
      }}
    />
  );
};

export default AdBanner;
