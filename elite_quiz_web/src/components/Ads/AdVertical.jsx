"use client";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import AdBase from "./AdBase";

/**
 * AdVertical - Vertical/Skyscraper ad component
 * Best for: Sidebars, Sticky ads
 * Standard sizes: 160x600, 300x600
 */
const AdVertical = ({ className = "", style = {} }) => {
  const systemconfig = useSelector(sysConfigdata);

  const clientId =
    systemconfig?.adsense_client_id ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId =
    systemconfig?.adsense_vertical_slot_id ||
    process.env.NEXT_PUBLIC_ADSENSE_VERTICAL_SLOT_ID;

  if (!clientId || !slotId) {
    return null;
  }

  return (
    <AdBase
      clientId={clientId}
      slotId={slotId}
      format="vertical"
      responsive={true}
      minHeight={600}
      aspectRatio="300/600"
      className={`ad-vertical ${className}`}
      style={{
        width: "100%",
        maxWidth: "300px",
        margin: "0 auto",
        ...style,
      }}
    />
  );
};

export default AdVertical;
