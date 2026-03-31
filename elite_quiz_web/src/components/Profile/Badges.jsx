"use client";
import React, { useEffect, useState } from "react";
import { getImageSource, t } from "@/utils";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { badgesData, Loadbadgedata } from "@/store/reducers/badgesSlice";
import Skeleton from "react-loading-skeleton";
import Layout from "@/components/Layout/Layout";
import LeftTabProfile from "@/components/Profile/LeftTabProfile";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import { imgError } from "@/utils";
import { getUserBadgesApi } from "@/api/apiRoutes";
import Breadcrumb from "../Common/Breadcrumb";

const Badges = () => {
  const badgesdata = useSelector(badgesData);

  const power_eliteBadge = badgesdata?.data?.find(
    (badge) => badge?.type === "power_elite"
  );

  const power_elite_status = power_eliteBadge && power_eliteBadge?.status;

  const power_elite_coin = power_eliteBadge && power_eliteBadge?.badge_reward;

  const userData = useSelector((state) => state.User);

  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  // const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [visibleBadges, setVisibleBadges] = useState(6);

  useEffect(() => {
    setIsLoading(false);
  }, []);


  useEffect(() => {
    if (userData?.data) {
      const userBadges = async () => {
        const response = await getUserBadgesApi();
        if (!response?.error) {
          Loadbadgedata(response.data);
        }
      };
      userBadges();
    }
  }, [selectcurrentLanguage]);

  const handleShowMore = () => {
    setShowMore(!showMore);
    setVisibleBadges(showMore ? 6 : Object.values(badgesdata.data)?.length);
  };

  return (
    <Layout>
      <section>
        <div className="container px-2 my-14 ">
          <div className=" ">
            {/* <div className="mb-24 max-1200:mb-20 max-767:mb-12">
            <Breadcrumb
              showBreadcrumb={true}
              title={t("profile")}
              content={t("home")}
              contentFive={t("profile")}
              />
            </div> */}
            <div className="flex flex-wrap relative between-1200-1399:flex-nowrap justify-evenly gap-9">
              <div className="h-max w-full xl:w-1/4 lg:w-2/3 md:w-full">
                <div className=" flex flex-col min-w-0 break-words  rounded-[16px] bg-[var(--background-2)] border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] max-1200:p-[12px] relative darkSecondaryColor">
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] morphisam !m-0 !p-0 darkSecondaryColor">
                <div className="mb-12">
                  <div className="p-7 ">
                    <div className="font-bold text-[42px] mb-5  text-center ">{t("badges")}</div>
                    {isLoading ? (
                      // Show skeleton loading when data is being fetched
                      <div className="w-full ">
                        <Skeleton height={20} count={5} className="skeleton" />
                      </div>
                    ) : (
                      // Show data if available
                      badgesdata.data &&
                      [
                        ...Object.values(badgesdata.data).filter(
                          (data) => data.status === "1"
                        ),
                        ...Object.values(badgesdata.data).filter(
                          (data) => data.status === "0"
                        ),
                      ]
                        .slice(0, visibleBadges)
                        .map((data, index) => (
                          <div className="w-full" key={index}>
                            <div
                              className="text-center mb-[22px] bg-white rounded-[10px] flex items-center pl-[20px] max-479:pl-0  max-479:flex-col max-479:align-middle darkSecondaryColor"
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={`${data?.badge_note}`}
                            >
                              <div className="relative max-479:my-[-10px]">
                                {data?.status === "0" ? (
                                  <span className='text-[100px] text-primary-color before:content-["⬢"] before:text-[100px] before:text-[#808080]' />
                                ) : (
                                  <span className='text-[100px] text-primary-color before:content-["⬢"] before:text-[100px] before:text-primary-color' />
                                )}
                                <img
                                  src={getImageSource(data?.badge_icon)}
                                  alt="badges"
                                  onError={imgError}
                                  className="flex items-center justify-center top-[12px] left-0 right-0 bottom-0 w-[35px] h-[35px] object-contain absolute m-auto"
                                />
                                {/* <span className='counter_badge'>{data.badge_reward}</span> */}
                              </div>
                              <div className="flex flex-col items-start justify-center gap-[12px] p-[8px] max-479:items-center">
                                <span className="text-text-color font-sans text-start text-[18px] font-semibold">
                                  {t(data?.type + "_label")}
                                </span>
                                <span className="text-[14px] font-normal break-words text-text-color font-sans text-start max-479:text-center">
                                  {t(data?.type + "_note")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                    <div className="w-full text-center mt-3">
                      <span
                        onClick={handleShowMore}
                        className="text-text-color font-semibold text-[18px] cursor-pointer"
                      >
                        {showMore ? t("show_less") : t("show_more")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Tooltip id='my-tooltip' /> */}
      </section>
    </Layout>
  );
};

export default withTranslation()(Badges);
