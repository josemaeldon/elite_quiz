"use client";
// ShareMenu.js
import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { t } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShareMenu = ({
  currentUrl,
  shouldGenerateRoomCode,
  appName,
  showModal,
  hideModal,
  entryFee,
  categoryName,
}) => {
  const shareButtons = (
    <>
      <FacebookShareButton
        url={currentUrl}
        title={`Dive into the ultimate quiz battle showdown on Elite Quiz, Join the squad using code: ${shouldGenerateRoomCode} Category : ${categoryName}, Just ${entryFee} Coins to play—let's crush it!`}
        hashtag={appName}
      >
        <FacebookIcon size={30} round /> {""} {t("Facebook")}
      </FacebookShareButton>
      <TwitterShareButton
        url={currentUrl}
        title={`Dive into the ultimate quiz battle showdown on Elite Quiz, Join the squad using code: ${shouldGenerateRoomCode} Category : ${categoryName}, Just ${entryFee} Coins to play—let's crush it!`}
      >
        <XIcon size={30} round /> {""} {t("Twitter")}
      </TwitterShareButton>
      <WhatsappShareButton
        url={currentUrl}
        title={`Dive into the ultimate quiz battle showdown on Elite Quiz, Join the squad using code: ${shouldGenerateRoomCode} Category : ${categoryName}, Just ${entryFee} Coins to play—let's crush it!`}
        hashtag={appName}
      >
        <WhatsappIcon size={30} round /> {""} {t("Whatsapp")}
      </WhatsappShareButton>
    </>
  );

  return (
    <>
      
      <Dialog>
        <DialogTrigger open={showModal}></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("share_room_code")}</DialogTitle>
            <DialogDescription>
              <div
                id="share-buttons-container"
                className="d-flex gap-5 align-center justify-center"
              >
                {shareButtons}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareMenu;
