import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import {
  notifiationTotal,
  notificationData,
} from "@/store/reducers/notificationSlice";
import noNotificationImg from "@/assets/images/notification.svg";
import Notification from "./Notification";
import { t } from "@/utils/index";
import Link from "next/link";

const NotificationModal = ({ notificationmodal, setNotificationModal }) => {
  const notifications = useSelector(notificationData);
  const notificationTotal = useSelector(notifiationTotal);

  return (
    <Dialog open={notificationmodal} onOpenChange={setNotificationModal}>
      <DialogContent className="dialogContent max-h-[90vh] sm:max-h-[80vh] md:!w-[700px] sm:w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-[28px]">
            {t("notifications")}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto overflow-x-hidden customScrollbar max-h-[65vh] md:px-4">
          {notifications?.data?.length ? (
            <div className="flex flex-col items-center justify-center gap-4">
              {notifications.data.map((data, key) => (
                <Notification data={data} key={key} />
              ))}
              {notificationTotal > notifications?.data?.length && (
                <div className="text-center mt-4">
                  <Link
                    href={"/notifications"}
                    onClick={() => setNotificationModal(false)}
                    // onClick={handleMoreNotifications}
                    className="btnPrimary w-full"
                  >
                    {t("view_more")}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="w-[200px] block mx-auto sm:w-[260px]">
              <img src={noNotificationImg.src} alt="noNotificationsImg" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
