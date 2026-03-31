"use client";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  userprofileStatictisDataSuccess,
  userStatictisDataSuccess,
} from "@/store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { badgesData } from "@/store/reducers/badgesSlice";
import "react-circular-progressbar/dist/styles.css";
import StatisticsPieChartCanvas from "@/components/Common/StatisticsPieChartCanvas";
import { getImageSource, imgError } from "@/utils";
import LeftTabProfile from "@/components/Profile/LeftTabProfile";
import Layout from "@/components/Layout/Layout";
import { t } from "@/utils";
import { useRouter } from "next/router";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import {
  getBattleStaticticsApi,
  getUserByIdApi,
  getUserStatisticsApi,
} from "@/api/apiRoutes";
import ThemeSvg from "../ThemeSvg";
import userImg from "@/assets/images/user.svg";
import Breadcrumb from "../Common/Breadcrumb";
const Statistics = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const userData = useSelector((state) => state.User);

  const Badges = useSelector(badgesData);


  

  const [battleStatisticsResult, setBattleStatisticsResult] = useState([]);

  // website link

  // user profile data get and statics
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const userData = await getUserByIdApi();
        if (userData) {
          dispatch(userprofileStatictisDataSuccess(userData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserById();

    // Convert to async function
    const fetchUserStatistics = async () => {
      try {
        const userStatistics = await getUserStatisticsApi();
        if (!userStatistics.error) {
          dispatch(userStatictisDataSuccess(userStatistics));
        }
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };

    fetchUserStatistics();
  }, []);



  // get battleStatistics api call
  useEffect(() => {
    const getbattlestaticticsData = async () => {
      const response = await getBattleStaticticsApi({});
      if (!response?.error) {
        setBattleStatisticsResult(response.myreport);
      }
      if (response.error) {
        console.log(response);
      }
    }
    getbattlestaticticsData();
  }, []);

  const correctAnswers = userData?.data?.userStatics.correct_answers;
  const incorrectAnswers =
    parseInt(userData?.data?.userStatics.questions_answered) -
    parseInt(userData?.data?.userStatics.correct_answers);

  const totalQuestions = userData?.data?.userStatics.questions_answered;
  const correctPercentage = (correctAnswers / totalQuestions) * 100;
  const incorrectPercentage = (incorrectAnswers / totalQuestions) * 100;

  const wonBattles =
    battleStatisticsResult && battleStatisticsResult[0]
      ? parseInt(battleStatisticsResult[0].Victories) || 0
      : 0;
  const drawBattles =
    battleStatisticsResult && battleStatisticsResult[0]
      ? parseInt(battleStatisticsResult[0].Drawn) || 0
      : 0;
  const lostBattles =
    battleStatisticsResult && battleStatisticsResult[0]
      ? parseInt(battleStatisticsResult[0].Loose) || 0
      : 0;

  // Calculate the total battles
  const totalBattles = wonBattles + drawBattles + lostBattles;

  // Calculate percentages for each category
  const wonPercentage = (wonBattles / totalBattles) * 100;
  const drawPercentage = (drawBattles / totalBattles) * 100;
  const lostPercentage = (lostBattles / totalBattles) * 100;

  const values = [
    { no: wonPercentage, arcColor: "#15ad5a" },
    { no: drawPercentage, arcColor: "#ffcc00" },
    { no: lostPercentage, arcColor: "#800080" },
  ];

  return (
    <Layout>
      <div className="container  my-14">
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
            <div className="darkSecondaryColor flex flex-col min-w-0 break-words rounded-[16px] bg-[var(--background-2)] border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] max-1200:p-[12px] relative">
              {/* Tab headers */}
              <LeftTabProfile />
            </div>
          </div>
          <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] morphisam !m-0 !p-0 justify-center items-center darkSecondaryColor">
          <div class="font-bold text-[42px] mb-5 mt-10 text-center ">{t("statistics")}</div>
          {/* <div className="font-bold text-[42px] mb-8 text-center w-full">{t("bookmark")}</div> */}
            <div className="!mt-0 !mb-0 flex flex-wrap justify-center items-stretch w-full">
              {/* question details */}
              <div className="w-full md:w-1/2 p-3">
                <div className="h-full p-6 rounded-[16px] bg-white flex flex-col darkSecondaryColor">
                  <p className="text-[#212121] text-center text-2xl !font-semibold mb-3">{`${t(
                    "questions"
                  )} ${t("details")} `}</p>
                  <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="progressBar">
                      <div className="w-[120px] mx-auto mb-4 relative">
                        <CircularProgressbarWithChildren
                          value={incorrectPercentage}
                          strokeWidth={6}
                          styles={buildStyles({
                            pathTransition: "none",
                            textColor: "black",
                            trailColor: "#00bf7a",
                            pathColor: "#ff005c",
                          })}
                        ></CircularProgressbarWithChildren>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-min rounded-full text-center">
                          <span className="font-lato text-[24px] font-bold text-text-color inline-block p-[0px_10px]">
                            {userData?.data?.userStatics.questions_answered}
                          </span>
                          <span className="text-text-color"> {t("att")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-center relative !justify-around mt-2 w-full">
                      <span className="relative before:absolute rtl:before:mr-[-14px] ltr:before:ml-[-14px] before:top-[7px] before:bg-[#00bf7a] before:w-[8px] before:h-[8px] before:rounded-full font-sans text-[14px] font-normal text-text-color">
                        {" "}
                        {t("correct")}{" "}
                        <span>
                          {userData?.data &&
                            (userData?.data?.userStatics.correct_answers
                              ? userData?.data?.userStatics.correct_answers
                              : "0")}
                        </span>
                      </span>
                      <span className="relative before:absolute rtl:before:mr-[-14px] ltr:before:ml-[-14px] before:top-[7px] before:bg-[#ff005c] before:w-[8px] before:h-[8px] before:rounded-full font-sans text-[14px] font-normal text-text-color">
                        {" "}
                        {t("incorrect")}{" "}
                        <span>
                          {userData?.data &&
                            (parseInt(
                              userData?.data?.userStatics.questions_answered
                            ) -
                            parseInt(
                              userData?.data?.userStatics.correct_answers
                            )
                              ? parseInt(
                                  userData?.data?.userStatics.questions_answered
                                ) -
                                parseInt(
                                  userData?.data?.userStatics.correct_answers
                                )
                              : "0")}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/*battle statistics */}
              <div className="w-full md:w-1/2 p-3">
                <div className="h-full p-6 rounded-[16px] bg-white flex flex-col darkSecondaryColor">
                  <p className="text-[#212121] text-center text-2xl !font-semibold mb-3">
                    {t("battle_statistics")}
                  </p>
                  <div className="flex-grow flex flex-col justify-center items-center">
                    <StatisticsPieChartCanvas
                      width={120}
                      height={120}
                      values={values}
                      strokeWidth={8}
                      totalBattles={totalBattles}
                    />

                    <div className="flex-center relative !justify-around mt-2 w-full max-991:gap-[30px] max-575:gap-[25px]">
                      <span className="relative before:absolute rtl:before:mr-[-14px] ltr:before:ml-[-14px] before:top-[7px] before:bg-[#00bf7a] before:w-[8px] before:h-[8px] before:rounded-full font-sans text-[14px] font-normal text-text-colorcorr won">
                        {" "}
                        {t("won")}{" "}
                        <span>
                          {battleStatisticsResult &&
                            battleStatisticsResult.map((ele) => {
                              return <span>{ele?.Victories}</span>;
                            })}
                        </span>
                      </span>
                      <span className="relative before:absolute rtl:before:mr-[-14px] ltr:before:ml-[-14px] before:top-[7px] before:bg-[#ffad01] before:w-[8px] before:h-[8px] before:rounded-full font-sans text-[14px] font-normal text-text-color">
                        {" "}
                        {t("draw")}{" "}
                        <span>
                          {battleStatisticsResult &&
                            battleStatisticsResult.map((ele) => {
                              return <span>{ele?.Drawn}</span>;
                            })}
                        </span>
                      </span>
                      <span className="relative before:absolute rtl:before:mr-[-14px] ltr:before:ml-[-14px] before:top-[7px] before:bg-[#a868fa] before:w-[8px] before:h-[8px] before:rounded-full font-sans text-[14px] font-normal text-text-color">
                        {" "}
                        {t("lost")}{" "}
                        <span>
                          {battleStatisticsResult &&
                            battleStatisticsResult.map((ele) => {
                              return <span>{ele?.Loose}</span>;
                            })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* quiz details */}
              <div className="w-full md:w-1/2 p-3">
                <div className="h-full p-6 rounded-[16px] bg-white flex flex-col darkSecondaryColor">
                  <p className="text-[#212121] text-center text-2xl !font-semibold mb-3">{`${t(
                    "quiz"
                  )} ${t("details")}`}</p>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-center mb-5">
                      {userData?.data?.profile ? <img
                        src={getImageSource(userData?.data?.profile)}
                        alt="userProfileImage"
                        onError={imgError}
                        className="userProfile aspect-square w-[100px] h-[100px] object-contain"
                      />:
                      <ThemeSvg
                      src={userImg.src}
                     className="userProfile aspect-square !w-[100px] !h-[100px] object-contain"
                      width="100%"
                      height="100%"
                      alt="User"
                      colorMap={{
                        "#e13975": "var(--primary-color)",
                        "#6d1d50": "var(--secondary-color)",
                        "#f7ccdd": "var(--primary-light)",
                        "url(#linear-gradient)": "var(--primary-color)",
                        "linear-gradient": "var(--primary-color)",
                      }}
                    />}
                    </div>

                    <div className="flex justify-between w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-[14px]"> {t("rank")}</span>
                        <span className="font-black">
                          {userData?.data &&
                            userData?.data?.userProfileStatics.all_time_rank}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[14px]">{t("coins")}</span>
                        <span className="font-black">
                          {userData?.data &&
                            userData?.data?.userProfileStatics.coins}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[14px]">{t("score")}</span>
                        <span className="font-black">
                          {userData?.data &&
                            userData?.data?.userProfileStatics.all_time_score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* collected badges */}
              <div className="w-full md:w-1/2 p-3">
                <div className="h-full p-6 rounded-[16px] bg-white flex flex-col darkSecondaryColor">
                  <p className="text-[#212121] text-center text-2xl !font-semibold">
                    {t("collected_badges")}
                  </p>
                  <div className="flex-grow flex flex-col justify-center">
                    <ul className="flex justify-between mb-4 pb-0 max-575:!flex-col max-575:flex">
                      {Badges.data && Badges.data?.length > 0 ? (
                        [
                          ...Object.values(Badges.data).filter(
                            (data) => data.status === "1"
                          ),
                        ]
                          .slice(0, 3)
                          .map((data, index) => (
                            <li
                              className="flex-center md:w-1/3 w-full"
                              key={index}
                            >
                              <div
                                className="mb-2 text-center"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={`${data.badge_note}`}
                              >
                                <div className="relative">
                                  <span className='before:content-["⬢"] before:text-[65px] before:text-primary-color' />
                                  <img
                                    className="flex items-center justify-center top-[6px] left-0 right-0 bottom-0 h-[30px] object-contain absolute m-auto"
                                    src={getImageSource(data.badge_icon)}
                                    alt="badges"
                                  />
                                </div>
                                <p className="md:truncate md:w-[100px] mt-1">
                                  {data.badge_label}
                                </p>
                              </div>
                            </li>
                          ))
                      ) : (
                        <div className="no_badges flex-grow flex items-center justify-center w-full">
                          <span>{t("no_badges_founds")}</span>
                        </div>
                      )}
                    </ul>
                    <div>
                      <hr className="mt-2 mb-2 text-[#FFFFFF16] blur-[1px]" />
                      <p
                        className="mb-0 font-semibold text-center cursor-pointer hover:text-primary-color transition-colors"
                        onClick={() => router.push("/profile/badges")}
                      >
                        {t("view_all")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(Statistics);
