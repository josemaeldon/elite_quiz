import React, { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { getImageSource, t } from "@/utils";

import { withTranslation } from "react-i18next";
import errorimg from "@/assets/images/error.svg";
import { truncate } from "@/utils";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";

const Upcoming = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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
            <Skeleton height={350} key={index} className="skeleton" borderRadius={15} />
          ))
        ) : (
          <>
            {data ? (
              data?.map((upcomingData, index) => {
                const isExpanded = expanded[index];
                const titleTruncated = upcomingData?.name && upcomingData?.name.length > 23;
                const descTruncated = upcomingData?.description && upcomingData?.description.length > 27;
                const showButton = titleTruncated || descTruncated;
                return (
                  <div className="" key={index}>
                    <div className="rounded-[15px] p-[10px_14px] bg-[var(--background-2)] border-2 border-white/10  darkSecondaryColor">
                      <div className="card-image">
                        <img
                          className="w-full h-[14rem] object-contain m-auto rounded-[15px]"
                          src={getImageSource(upcomingData?.image)}
                          alt="wrteam"
                        />
                      </div>
                      <div className="p-2">
                        <div className="relative flex items-center justify-between text-left text-[20px] font-bold text-text-color">
                          <div>
                            <h3>{isExpanded ? upcomingData?.name : truncate(upcomingData?.name, 23)}</h3>
                            <p className="text-left text-text-color dark:text-[#FFFFFF99] text-[16px] my-1">{isExpanded ? upcomingData?.description : truncate(upcomingData?.description, 27)}</p>
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
                              className="relative -top-1"
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
                        <div className="border-t border-solid border-[#cccad2]  dark:border-[#ae9c9f21] mt-2 mb-3 mx-2"></div>
                        <div className="p-[6px_12px]">
                          <div className="flex-center !justify-between pb-4 relative text-center before:absolute before:top-0 before:w-[1px] before:h-[52px] before:bg-[#cccad2] dark:before:bg-[#ae9c9f21] after:absolute after:top-0 after:w-px after:h-[52px] after:bg-[#cccad2] dark:after:bg-[#ae9c9f21] after:right-[66px] xl:after:right-[72px] lg:after:right-[62px]   before:left-[98px] xl:before:left-[98px] lg:before:left-[96px] ">
                            <div className="card-entry-fees">
                              <p className="text-[#6c757d] mb-1">
                                {t("entry_fees")}
                              </p>
                              <span className="text-text-color">
                                {upcomingData?.entry}
                              </span>
                            </div>
                            <div className="card-players">
                              <p className="text-[#6c757d] mb-1">
                                {t("start_on")}
                              </p>
                              <span className="text-text-color">
                                {upcomingData?.start_date}
                              </span>
                            </div>
                            <div className="card-ends-on">
                              <p className="text-[#6c757d] mb-1">
                                {t("ends_on")}
                              </p>
                              <span className="text-text-color">
                                {upcomingData?.end_date}
                              </span>
                            </div>
                          </div>

                          <div className="bottom-footer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center m-auto pt-9 ">
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
                <p>{t("no_upcoming_contest")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
};

export default withTranslation()(Upcoming);
