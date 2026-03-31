"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import dynamic from "next/dynamic";
import {
  notifiationTotal,
  updateTotal,
} from "@/store/reducers/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./Notification";
import noNotificationImg from "@/assets/images/notification.svg";
import { getImageSource, isLogin, t } from "@/utils/index";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { errorCodeDataNotFound} from "@/api/apiEndPoints";
import { getNotificationApi } from "@/api/apiRoutes";
import Skeleton from "react-loading-skeleton";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const NotificationsPage = () => {
  const router = useRouter();
  // const notifications = useSelector(notificationData)
  const totalNotifications = useSelector(notifiationTotal);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogin()) {
        if (router.pathname === "/notifications") {
            const getNotificationData = async () => {
              setIsLoading(true);
          const response = await getNotificationApi({
            order: "DESC",
            offset: offset,
            limit: limit,
          });
          
          if (!response?.error) {
            setIsLoading(false);
            let notificationResponse = response.total;
            setNotifications((prevData) => [...prevData, ...response.data]);
            dispatch(updateTotal(notificationResponse));
          } else {
            if (response?.message === errorCodeDataNotFound) {
              dispatch(updateTotal(0));
            }
          }
        };
        getNotificationData()
      }
    }
  }, [offset]);

  const handleMoreNotifications = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + limit);
    setLimit((prevLimit) => prevLimit + 10);
  };
  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} title="Notifications" />
      <div className="container my-4 mx-auto h-full">
       {isLoading ?    <Skeleton count={5} className="skeleton" /> : <div className="flex flex-col items-center justify-center morphisam gap-4">
          {notifications?.length ? (
            <>
              {notifications.map((data, key) => (
                <Notification data={data} key={key} />
              ))}

              {notifications?.length < totalNotifications && (
                <div className="text-center mt-4">
                  <Button
                    onClick={handleMoreNotifications}
                    className="btnPrimary w-full"
                  >
                    {t("view_more")}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="w-[200px] block mx-auto sm:w-[260px]">
              <img src={getImageSource(noNotificationImg.src)} alt="noNotificationsImg" />
            </div>
          )}
        </div>}
      </div>
    </Layout>
  );
};

export default NotificationsPage;