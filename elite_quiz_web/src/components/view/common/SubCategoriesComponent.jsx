import React, { useState } from "react";
import elitePlaceholder from "@/assets/images/Elite Placeholder.svg";
import { FiChevronRight } from "react-icons/fi";
import { t } from "@/utils";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { AdSquare } from "@/components/Ads";

const SubCategoriesComponent = ({ subCategory, handleChangeSubCategory }) => {
  const [showAll, setShowAll] = useState(false);
  const systemconfig = useSelector(sysConfigdata);

  // Get either all subcategories or just the first 10
  const visibleSubCategories = subCategory
    ? showAll
      ? subCategory
      : subCategory.slice(0, 12)
    : [];

  // Get display question count - cap at quiz_zone_total_question when hasLevel === 0
  const getDisplayQuestionCount = (data) => {
    const hasLevel = data?.has_level === "0" || data?.has_level === 0;

    const maxQuestions = Number(data?.type === "1" ? systemconfig?.quiz_zone_total_question : systemconfig?.multi_match_total_question);
    const actualQuestions = Number(data?.no_of_que) || 0;

    // Only apply cap when hasLevel is 0
    if (hasLevel && actualQuestions > maxQuestions) {
      return maxQuestions;
    }
    return actualQuestions;
  };

  // Ad interval - valid values: 1, 2, 4, 6 (default: 4)
  const adInterval = [1, 2, 4, 6].includes(
    Number(systemconfig?.adsense_category_interval),
  )
    ? Number(systemconfig?.adsense_category_interval)
    : 4;

  // Check if AdSense credentials are configured
  const hasAdsenseCredentials =
    (systemconfig?.adsense_client_id ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) &&
    (systemconfig?.adsense_square_slot_id ||
      process.env.NEXT_PUBLIC_ADSENSE_SQUARE_SLOT_ID);

  // Check if ads should be shown after this index
  const shouldShowAd = (index) => {
    return (
      hasAdsenseCredentials &&
      (index + 1) % adInterval === 0 &&
      index < visibleSubCategories.length - 1
    );
  };

  return (
    <div className="">
      <div className="quizplay-slider relative px-0">
        <div className="flex justify-center w-full items-center mb-16">
          <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block"></div>
          <h5 className="w-full text-text-color font-[600] text-center max-[1199px]:flex max-[1199px]:p-0 max-[1199px]:w-full max-[1199px]:text-center max-[1199px]:justify-center">
            {t("SubCategories")}
          </h5>
          <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block"></div>
          <div></div>
        </div>

        {subCategory && subCategory?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSubCategories.map((elem, key) => {
              return (
                <React.Fragment key={elem?.id}>
                  <div
                    className=""
                    onClick={(e) => {
                      handleChangeSubCategory(elem);
                    }}
                  >
                    <div className="">
                      <div
                        className={`group relative flex flex-col break-words max-991:h-auto py-[18px] px-3 border-none rounded-[8px] gap-4 cursor-pointer overflow-hidden bg-[var(--background-2)] darkSecondaryColor bordercolor bgWave`}
                      >
                        <div className=" flex items-center justify-start gap-4 w-full relative max-w-[360px]:flex-wrap ">
                          <span className=" ml-3 flex justify-center items-start z-1 text-white">
                            <img
                              className={`w-[30px] h-[30px] max-w-full max-h-full object-contain rounded-[5px] ${
                                process.env
                                  .NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE ===
                                  "true" &&
                                !elem?.image &&
                                "dark:filter dark:brightness-0 dark:invert"
                              }`}
                              src={
                                elem?.image
                                  ? elem?.image
                                  : `${elitePlaceholder.src}`
                              }
                              alt="image"
                            />
                          </span>
                          <div className=" flex flex-col justify-center items-start relative w-full">
                            <p className=" text-base font-bold leading-5 text-text-color ">
                              {elem?.subcategory_name}
                            </p>

                            <div className="flex justify-center items-center w-full mt-4 max-1200:flex-col max-1200:gap-[10px] max-1200:items-start max-1200:w-foll max-767:flex-row max-767:gap-[20px] max-767:items-center max-767:w-full max-[399px]:flex-col max-[399px]:gap-[10px_0px] max-[399px]:item-start max-[399px]:w-full ">
                              {elem?.has_level === "1" && elem?.maxlevel !== "0" && (
                                <p className="text-[14px] w-full font-normal leading-4 text-text-color between-1200-1399:text-[12px] m-0">
                                  {" "}
                                  {t("levels")} : {elem?.maxlevel}
                                </p>
                              )}
                              <p className="text-[14px] w-full font-normal leading-4 text-text-color between-1200-1399:text-[12px]">
                                {" "}
                                {getDisplayQuestionCount(elem) <= 1
                                  ? t("Question")
                                  : t("questions")}{" "}
                                : {getDisplayQuestionCount(elem)}
                              </p>
                            </div>
                          </div>
                          <span className="absolute ltr:right-5 rtl:left-5 rtl:rotate-180 top-[2px] text-text-color text-[20px] invisible transition-visibility ease-in-out duration-300 group-hover:visible">
                            <FiChevronRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Show Ad after every N items */}
                  {shouldShowAd(key) && (
                    <div className="" onClick={(e) => e.stopPropagation()}>
                      <div className="">
                        <div className="group relative flex break-words h-[100px] px-3 border-none rounded-[8px] cursor-default overflow-hidden bg-[var(--background-2)] darkSecondaryColor bordercolor items-center justify-center">
                          <AdSquare isInline={true} />
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Show More/Less button */}
            {subCategory.length > 12 && (
              <div className="col-span-full flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2 bg-primary-color text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  {showAll ? t("show_less") : t("show_more")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="errorDiv">
            <ThemeSvg
              src={errorimg.src}
              className="!w-[110px] !h-[110px]"
              alt="Error"
              colorMap={{
                "#e03c75": "var(--primary-color)",
                "#551948": "var(--secondary-color)",
                "#3f1239": "var(--secondary-color)",
                "#7b2167": "var(--secondary-color)",
                "#ac5e9f": "var(--primary-light)",
                "url(#linear-gradient)": "url(#linear-gradient)",
              }}
            />
            <p className="text-center text-text-color">
              {t("no_subcat_data_found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoriesComponent;
