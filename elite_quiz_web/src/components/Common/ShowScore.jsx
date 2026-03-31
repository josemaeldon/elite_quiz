"use client";
import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "@/utils/AnimatedProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { getImageSource, imgError } from "@/utils";
import { useRouter } from "next/navigation";
import rightTickIcon from "../../assets/images/check-circle-score-screen.svg";
import crossIcon from "../../assets/images/x-circle-score-screen.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import {
  getQuizEndData,
  getQuizResultData,
} from "@/store/reducers/tempDataSlice";
import { websettingsData } from "@/store/reducers/webSettings";
import winnweAnimation from "../../assets/images/winner_animation.gif";

import userImg from "@/assets/images/user.svg";
import { t } from "@/utils";
import Image from "next/image";
import { AdSquare } from "@/components/Ads";

function ShowScore({
  onPlayAgainClick,
  onReviewAnswersClick,
  onNextLevelClick,
  currentLevel,
  maxLevel,
  reviewAnswer,
  playAgain,
  nextlevel,
  goBack,
}) {
  const navigate = useRouter();

  const websettingsdata = useSelector(websettingsData);

  const themecolor = websettingsdata && websettingsdata?.primary_color;
  const remaining = useSelector((state) => state.showSeconds.remainingSecond);

  // store data get
  const userData = useSelector((state) => state.User);
  const quizResultData = useSelector(getQuizResultData);

  const percentage = quizResultData?.winningPer || 0;
  const coins = quizResultData?.earnCoin || 0;
  const quizScore = quizResultData?.userScore || 0;
  const showCoinandScore = coins ? true : false;

  const systemconfig = useSelector(sysConfigdata);
  const goToHome = () => {
    navigate.push("/");
  };

  let newdata = Math.round(percentage);

  return (
    <React.Fragment>
      <div className="resultMorphisam">
        <div className="my-4 flex-center flex-col">
          {/* Mobile: Top Ad */}
          <div className="flex lg:hidden justify-center mb-4 w-full">
            <AdSquare />
          </div>

          <div className="flex flex-row items-center justify-center gap-4 w-full">
            {/* Desktop: Left Ad */}
            <div className="hidden lg:flex w-[336px] flex-shrink-0 justify-center">
              <AdSquare />
            </div>

            {/* Score Circle Section */}
            <div className="flex-center flex-col lg:w-1/6 w-1/3 text-center font-bold">
              {percentage >= Number(systemconfig.quiz_winning_percentage) && (
                <div className="h-8 w-full object-contain z-[-1] absolute flex-center text-transparent">
                  <Image
                    src={winnweAnimation.src}
                    height={400}
                    width={400}
                    alt="winningAnimation"
                  />
                </div>
              )}
              <div className="inline-block">
                <AnimatedProgressProvider
                  valueStart={0}
                  valueEnd={percentage}
                  duration={0.2}
                  easingFunction={easeQuadInOut}
                >
                  {(value) => {
                    return (
                      <CircularProgressbarWithChildren
                        value={newdata}
                        strokeWidth={5}
                        styles={buildStyles({
                          pathTransition: "none",
                          textColor: themecolor,
                          trailColor: "#f5f5f8",

                          pathColor:
                            percentage >=
                            Number(systemconfig.quiz_winning_percentage)
                              ? "#15ad5a"
                              : themecolor,
                        })}
                      >
                        {userData?.data && userData?.data?.profile ? (
                          <img
                            src={getImageSource(userData?.data?.profile)}
                            alt="user"
                            className="w-[70%] h-[70%] rounded-full border-[2px]"
                            onError={imgError}
                          />
                        ) : (
                          <ThemeSvg
                            src={userImg.src}
                            className="rounded-full border-[2px] !w-[70%] !h-[70%] "
                            alt="User"
                            colorMap={{
                              "#e13975": "var(--primary-color)",
                              "#6d1d50": "var(--secondary-color)",
                              "#f7ccdd": "var(--primary-light)",
                              "url(#linear-gradient)": "var(--primary-color)",
                              "linear-gradient": "var(--primary-color)",
                            }}
                          />
                        )}
                      </CircularProgressbarWithChildren>
                    );
                  }}
                </AnimatedProgressProvider>
              </div>
            </div>

            {/* Desktop: Right Ad */}
            <div className="hidden lg:flex w-[336px] flex-shrink-0 justify-center">
              <AdSquare />
            </div>
          </div>

          {/* Mobile: Bottom Ad */}
          <div className="flex lg:hidden justify-center mt-4 w-full">
            <AdSquare />
          </div>

          <div className=" text-center flex-center flex-col gap-3 mt-7 ">
            {percentage >= Number(systemconfig.quiz_winning_percentage) ? (
              <>
                <div className=" w-1/3 md:w-1/6 flex-center text-center">
                  <h1 className=" font-bold text-lg text-inherit">
                    {newdata}%
                  </h1>
                </div>
                <h4 className="mb-[-3px] mt-[18px] text-[#00bf7a]">
                  <b>
                    {t(`wow_fantastic_job`)}{" "}
                    <span className="text-text-color">
                      {t(`${userData?.data && userData?.data?.name}`)}
                    </span>
                  </b>
                </h4>
                <h5>{t(`youve_achieved_mastery`)}</h5>
              </>
            ) : (
              <>
                <div className=" w-1/3 md:w-1/6 flex-center text-center">
                  <h1 className=" font-bold text-lg text-inherit">
                    {newdata}%
                  </h1>
                </div>
                <h4 className="mb-[-3px] mt-[18px] text-[#ff005c]">
                  <b>
                    {t(`good_effort`)}{" "}
                    <span className="text-text-color">
                      {t(`${userData?.data && userData?.data?.name}`)}
                    </span>
                  </b>
                </h4>
                <h5>{t(`keep_learning`)}</h5>
              </>
            )}
          </div>
        </div>

        <div className="my-4 flex flex-wrap md:gap-3 lg:gap-5 flex-center gap-3 mt-3">
          {showCoinandScore ? (
            <>
              {coins ? (
                <div className="questionIndexDiv sm:text-xl">
                  <span>+ {coins ? Number(coins) : "0"}</span>
                  <span>{t("coins")}</span>
                </div>
              ) : null}
            </>
          ) : null}

          <div className="rightWrongAnsDiv [&>*]:text-xl md:[&>*]:text-2xl">
            <span>
              <img src={rightTickIcon.src} alt="correct" />
              {quizResultData?.correctAnswer || 0}
            </span>

            <span>
              <img src={getImageSource(crossIcon.src)} alt="incorrect" />
              {quizResultData?.total_questions -
                quizResultData?.correctAnswer || 0}
            </span>
          </div>

          <div className="questionIndexDiv">
            <span>{remaining}</span>
            <span>{t("time")}</span>
          </div>

          <>
            {quizScore ? (
              <div className="questionIndexDiv">
                <span>{quizScore ? quizScore : "0"}</span>
                <span>{t("score")}</span>
              </div>
            ) : null}
          </>
        </div>

        <div className={`lifelineParantDiv`}>
          {percentage >= Number(systemconfig.quiz_winning_percentage) &&
          maxLevel !== String(currentLevel) ? (
            nextlevel ? (
              <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
                <button className="lifelinebtn" onClick={onNextLevelClick}>
                  {`${t("next")} ${t("level")} `}
                </button>
              </div>
            ) : (
              ""
            )
          ) : percentage < Number(systemconfig.quiz_winning_percentage) &&
            playAgain ? (
            <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
              <button className="lifelinebtn" onClick={onPlayAgainClick}>
                {t("play_again")}
              </button>
            </div>
          ) : (
            ""
          )}

          {reviewAnswer ? (
            <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
              <button className="lifelinebtn " onClick={onReviewAnswersClick}>
                {t("review_answers")}
              </button>
            </div>
          ) : (
            ""
          )}
          <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
            <button className="lifelinebtn" onClick={goBack}>
              {t("back")}
            </button>
          </div>
          <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
            <button className="lifelinebtn" onClick={goToHome}>
              {t("home")}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ShowScore.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  // coins: PropTypes.number.isRequired,
  quizScore: PropTypes.number.isRequired,
  // onPlayAgainClick: PropTypes.func.isRequired,
  // onReviewAnswersClick: PropTypes.func.isRequired,
  // onNextLevelClick: PropTypes.func.isRequired,
};
export default withTranslation()(ShowScore);
