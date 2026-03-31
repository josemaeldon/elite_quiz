"use client";
import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {
  getSelectedCategory,
  getSelectedSubCategory,
} from "@/store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { AdBanner } from "@/components/Ads";

const CATEGORY_ROUTE_CONFIG = [
  {
    translationKey: "quiz_zone",
    fallbackText: "Quiz Zone",
    path: "/quiz-zone",
  },
  {
    translationKey: "guess_the_word",
    fallbackText: "Guess The Word",
    path: "/guess-the-word",
  },
  {
    translationKey: "fun_and_learn",
    fallbackText: "Fun & Learn",
    path: "/fun-and-learn",
  },
  {
    translationKey: "self_challenge",
    fallbackText: "Self Challenge",
    path: "/self-learning",
  },
  {
    translationKey: "audio_questions",
    fallbackText: "Audio Questions",
    path: "/audio-questions",
  },
  {
    translationKey: "math_mania",
    fallbackText: "Math Mania",
    path: "/math-mania",
  },
  {
    translationKey: "multi_match",
    fallbackText: "Multi Match",
    path: "/multi-match-questions",
  },
  {
    translationKey: "contest_play",
    fallbackText: "Contest Play",
    path: "/contest-play",
  },
  { translationKey: "Exam", fallbackText: "Exam", path: "/exam-module" },
];

const Breadcrumb = ({
  showBreadcrumb,
  title,
  content,
  contentTwo,
  contentThree,
  contentFour,
  allgames,
  contentFive,
}) => {
  const { t } = useTranslation();
  // Get all data from Redux store
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  const systemconfig = useSelector(sysConfigdata);

  // Check if breadcrumb ads are enabled from admin
  const showBreadcrumbAd = systemconfig?.adsense_show_breadcrumb_ads !== "0";

  // Check if AdSense banner credentials are configured
  const hasAdsenseBannerCredentials =
    (systemconfig?.adsense_client_id ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) &&
    (systemconfig?.adsense_banner_slot_id ||
      process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT_ID);

  const getCategoryUrl = () => {
    if (!contentTwo) {
      return `/quiz-play`;
    }

    // Try to resolve a route by comparing the provided label with the current
    // translation of each known category key. This keeps routing stable even
    // when UI text is translated.
    const matchedCategory = CATEGORY_ROUTE_CONFIG.find(
      ({ translationKey, fallbackText }) => {
        const translatedLabel = translationKey ? t(translationKey) : null;

        if (translatedLabel && translatedLabel === contentTwo) {
          return true;
        }

        // Preserve support for legacy hard-coded English strings.
        if (fallbackText === contentTwo) {
          return true;
        }

        return false;
      },
    );

    return matchedCategory?.path ?? `/quiz-play`;
  };

  const getSubcategoryUrl = () => {
    if (contentThree === "Contest Play") {
      return `/contest-play`;
    }
    if (selectedCategory.no_of == "0") {
      return `#`;
    }
    // in guess the word subcat url is with => subcategories (it is diffrent then other )
    if (contentTwo === t("guess_the_word") || contentTwo === "Guess The Word") {
      return `${getCategoryUrl()}/subcategories/${selectedCategory.slug}/`;
    } else {
      return `${getCategoryUrl()}/sub-categories/${selectedCategory.slug}/`;
    }
  };

  const showSubcategoryLink = () => {
    return contentThree && selectedSubCategory?.slug;
  };

  return (
    <React.Fragment>
      {showBreadcrumb && (
        <div className="overflow-hidden ">
          <div className="flex flex-wrap">
            <div className="flex justify-center items-center flex-col relative container my-14">
              <div className="">
                <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-snug tracking-normal capitalize text-text-color max-767:text-inherit">
                  {title}
                </h1>
              </div>
              <div className="breadcrumb__inner">
                <ul className="py-2 px-0 bg-transparent mb-0 flex items-center flex-wrap sm:flex-nowrap justify-center">
                  {/* Home */}
                  <li>
                    <Link
                      className="text-primary-color relative block font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-text-color dark:hover:text-white transition-colors"
                      href={"/"}
                    >
                      {content}
                    </Link>
                  </li>

                  {/* Quiz Zone or All Games */}
                  {allgames && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl transition-colors hover:text-primary-color"
                        href={"/quiz-play"}
                      >
                        {allgames}
                      </Link>
                    </li>
                  )}

                  {/* Category */}
                  {contentTwo && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={getCategoryUrl()}
                      >
                        {contentTwo}
                      </Link>
                    </li>
                  )}

                  {/* Subcategory - only show if data is available */}
                  {contentThree && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={getSubcategoryUrl()}
                      >
                        {contentThree}
                      </Link>
                    </li>
                  )}

                  {/* Fourth level (if needed) */}
                  {contentFour && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={"#"}
                      >
                        {contentFour}
                      </Link>
                    </li>
                  )}
                  {contentFive && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={`/profile`}
                      >
                        {contentFive}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Breadcrumb Banner Ad */}
              {showBreadcrumbAd && hasAdsenseBannerCredentials && (
                <div className="w-full mt-6">
                  <AdBanner />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Breadcrumb.propTypes = {
  showBreadcrumb: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  contentTwo: PropTypes.string,
  contentThree: PropTypes.string,
  contentFour: PropTypes.string,
  contentFive: PropTypes.string,
  allgames: PropTypes.string,
};

export default Breadcrumb;
