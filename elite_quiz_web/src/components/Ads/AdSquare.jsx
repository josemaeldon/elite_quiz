"use client";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import AdBase from "./AdBase";

/**
 * AdSquare - Square/Rectangle ad component
 * Best for: Sidebars, Inline with content, Between cards
 * Standard sizes: 300x250, 336x280
 *
 * For inline card mode: pass isInline={true} to match parent card height
 */
const AdSquare = ({ className = "", style = {}, isInline = false }) => {
  const systemconfig = useSelector(sysConfigdata);

  const clientId =
    systemconfig?.adsense_client_id ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId =
    systemconfig?.adsense_square_slot_id ||
    process.env.NEXT_PUBLIC_ADSENSE_SQUARE_SLOT_ID;

  if (!clientId || !slotId) {
    return null;
  }

  // When inline, remove fixed sizing to let parent control dimensions
  const inlineStyles = isInline
    ? {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        margin: "0",
      }
    : {
        width: "100%",
        maxWidth: "336px",
        margin: "0 auto",
      };

  return (
    <AdBase
      clientId={clientId}
      slotId={slotId}
      format={isInline ? "auto" : "rectangle"}
      responsive={true}
      minHeight={isInline ? 0 : 250}
      aspectRatio={isInline ? null : "336/280"}
      className={`ad-square ${className}`}
      style={{
        ...inlineStyles,
        ...style,
      }}
    />
  );
};

export default AdSquare;
