import React, { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { getImageSource, t } from "@/utils";

import { withTranslation } from "react-i18next";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { truncate } from "@/utils";

const Live = ({ data, playBtn }) => {
  const [loading, setLoading] = useState(true);

  const [trancateNumber, setTrancateNumber] = useState(23);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    const screenWidth = window.innerWidth;

    if (screenWidth > 1500) {
      setTrancateNumber(40);
    } else if (screenWidth >= 320 && screenWidth < 360) {
      setTrancateNumber(27);
    } else if (screenWidth >= 360 && screenWidth < 400) {
      setTrancateNumber(33);
    } else if (screenWidth >= 400 && screenWidth < 440) {
      setTrancateNumber(38);
    } else if (screenWidth >= 440 && screenWidth < 480) {
      setTrancateNumber(43);
    } else if (screenWidth >= 480 && screenWidth < 520) {
      setTrancateNumber(48);
    } else if (screenWidth >= 520 && screenWidth < 560) {
      setTrancateNumber(53);
    } else if (screenWidth >= 560 && screenWidth < 600) {
      setTrancateNumber(55);
    } else if (screenWidth >= 600 && screenWidth < 700) {
      setTrancateNumber(60);
    } else if (screenWidth >= 700 && screenWidth < 767) {
      setTrancateNumber(75);
    } else if (screenWidth >= 767 && screenWidth <= 960) {
      setTrancateNumber(30);
    } else if (screenWidth >= 960 && screenWidth < 1024) {
      setTrancateNumber(40);
    } else if (screenWidth >= 1024 && screenWidth < 1150) {
      setTrancateNumber(23);
    } else if (screenWidth >= 1150 && screenWidth < 1440) {
      setTrancateNumber(32);
    } else {
      setTrancateNumber(40); // Default value for smaller screens
    }
  }, [loading]);

  return (
    <Fragment>
      <div
        className={`${
          data
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            : "w-full"
        } ${
          loading ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : ""
        } my-14 `}
      >
        {loading ? (
          Array.from({ length: 6 })?.map((_, index) => (
            <Skeleton
              height={350}
              key={index}
              className="skeleton"
              borderRadius={15}
            />
          ))
        ) : (
          <>
            {data ? (
              data?.map((livedata, index) => {
                const isExpanded = expanded[index];
                const titleTruncated = livedata?.name && livedata?.name.length > 23;
                const descTruncated = livedata?.description && livedata?.description.length > trancateNumber;
                const showButton = titleTruncated || descTruncated;
                return (
                  <div className="" key={index}>
                    <div className="rounded-[15px] p-[10px_14px] bg-[var(--background-2)] border-2 border-white/10 darkSecondaryColor">
                      <div className="">
                        <img
                          className="w-full h-[14rem] object-contain m-auto rounded-[15px]"
                          src={getImageSource(livedata?.image)}
                          alt="Contest Image"
                        />
                      </div>
                      <div>
                        <div className="p-2">
                          <div className=" relative flex items-center justify-between text-left text-lg md:text-[20px] font-bold text-text-color">
                            <div>
                              <h3>{isExpanded ? livedata?.name : truncate(livedata?.name, 23)}</h3>
                              <p className="text-left text-text-color dark:text-[#FFFFFF99] text-[16px]  my-1">{isExpanded ? livedata?.description : truncate(livedata?.description, trancateNumber)}</p>
                            </div>
                            {showButton && (
                              <button
                                onClick={() => setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))}
                                className="absolute right-0 !rounded-[4px] h-[18px] w-[24px] border border-solid border-[#cccad2] dark:border-[#ae9c9f21] top-2 darkSecondaryColor"
                                aria-label="Toggle expand"
                                type="button"
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  className="relative -top-1 pr-[2px]"
                                  style={{
                                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s",
                                  }}
                                >
                                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="border-t border-solid border-[#cccad2]  dark:border-[#ae9c9f21] mt-2 mb-3 mx-2"></div>
                        <div className="p-[6px_12px]">
                          <div className="flex-center !justify-between pb-4 relative text-center before:absolute before:top-0 before:w-[1px] before:h-[52px] before:bg-[#cccad2] dark:before:bg-[#ae9c9f21] after:absolute after:top-0 after:w-px after:h-[52px] after:bg-[#cccad2] dark:after:bg-[#ae9c9f21] after:right-[80px] xl:after:right-[84px] lg:after:right-[75px]   before:left-[98px] xl:before:left-[98px] lg:before:left-[96px]">
                            <div>
                              <p className="text-[#6c757d] mb-1">
                                {t("entry_fees")}
                              </p>
                              <span className="text-text-color">
                                {livedata?.entry} {t("coins")}
                              </span>
                            </div>

                            <div className="card-players text-center">
                              <p className="text-[#6c757d] mb-1">
                                {t("players")}
                              </p>
                              <span className="text-text-color">
                                {livedata?.participants}
                              </span>
                            </div>
                            <div className="card-ends-on text-center">
                              <p className="text-[#6c757d] mb-1">
                                {t("ends_on")}
                              </p>
                              <span className="text-text-color">
                                {livedata?.end_date}
                              </span>
                            </div>
                          </div>

                          <div
                            className="flex-center"
                            onClick={() =>
                              playBtn(livedata?.id, livedata?.entry)
                            }
                          >
                            <div className="bg-[rgba(9,0,41,.129)] dark:bg-[rgba(255,255,255,0.08)] w-full h-14 rounded-[8px] text-center p-1.5 border border-transparent cursor-pointer transition-all duration-300 ease-in-out flex-center">
                              <p className="text-text-color mb-0  text-[14px] font-bold">
                                {t("play")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center m-auto pt-9">
                <div className="w-full h-24 mb-5">
                  <ThemeSvg
                    src={errorimg.src}
                    width="100%"
                    height="100%"
                    alt="Error"
                    colorMap={{
                      "#e03c75": "var(--primary-color)",
                      "#551948": "var(--secondary-color)",
                      "#3f1239": "var(--secondary-color)",
                      "#7b2167": "var(--secondary-color)",
                      "#ac5e9f": "var(--primary-color)",
                    }}
                  />
                </div>
                <p>{t("no_live_contest")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
};

export default withTranslation()(Live);
