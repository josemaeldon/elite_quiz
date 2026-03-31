"use client";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "@/utils/AnimatedProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { getImageSource, imgError } from "@/utils";
import {
  examCompletedata,
  getexamsetQuiz,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/navigation";
import rightTickIcon from "../../../assets/images/check-circle-score-screen.svg";
import crossIcon from "../../../assets/images/x-circle-score-screen.svg";
import { websettingsData } from "@/store/reducers/webSettings";
import userImg from "../../../assets/images/user.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { t } from "@/utils";
import winnweAnimation from "@/assets/images/winner_animation.gif";
import Image from "next/image";
import { setExamModualResultApi } from "@/api/apiRoutes";
import { AdSquare } from "@/components/Ads";

const ExamScore = ({ score, totalQuestions }) => {
  const navigate = useRouter();

  const percentage = (score * 100) / totalQuestions;

  // store data get
  const userData = useSelector((state) => state.User);

  const websettingsdata = useSelector(websettingsData);

  const themecolor = websettingsdata && websettingsdata?.primary_color;

  const examData = useSelector(examCompletedata);

  const systemconfig = useSelector(sysConfigdata);

  let getData = useSelector(selecttempdata);

  const examsetquiz = useSelector(getexamsetQuiz);

  const goToHome = () => {
    navigate.push("/");
  };

  const goBack = () => {
    navigate.push("/exam-module");
  };

  useEffect(() => {
    const setResult = async () => {
      const response = await setExamModualResultApi({
        exam_module_id: Number(getData.id),
        total_duration: examsetquiz.remianingtimer,
        obtained_marks: examsetquiz.totalmarks,
        statistics: examsetquiz.statistics,
        rules_violated: 1,
      });
      if (response.error) {
        console.log(response);
      }
    };
    setResult();
  }, []);

  let newdata = Math.round(percentage);

  return (
    <>
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
                    src={winnweAnimation}
                    height={400}
                    width={400}
                    alt="winnweAnimation"
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
                            width="70%"
                            height="70%"
                            className="rounded-full border-[2px]"
                            alt="User"
                            colorMap={{
                              "#e13975": "var(--primary-color)",
                              "#6d1d50": "var(--secondary-color)",
                              "#f7ccdd": "var(--primary-light)",
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

          <div className="text-center flex-center flex-col gap-3 mt-7 ">
            {percentage >= Number(systemconfig.quiz_winning_percentage) ? (
              <>
                <div className="w-1/3 md:w-1/6 flex-center text-center">
                  <h1 className="font-bold text-lg text-inherit">{newdata}%</h1>
                </div>
                <h4 className="mb-[-3px] mt-[18px] text-[#00bf7a]">
                  <b>
                    {t("great_job")}{" "}
                    <span className="text-text-color">
                      {t(`${userData?.data && userData?.data?.name}`)}
                    </span>
                  </b>
                </h4>
                <h5>{t(`Closer_to_mastery`)}</h5>
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
                <h5>{t(`Getting Closer to mastery!keep going!`)}</h5>
              </>
            )}
          </div>
        </div>

        <div className="my-4 md:flex-row flex-col md:gap-3 lg:gap-5 flex-center gap-3 mt-3">
          <div className="questionIndexDiv">
            <span>{examsetquiz.totalmarks + " / " + getData.total_marks}</span>
            <span>{t("marks")}</span>
          </div>

          <div className="rightWrongAnsDiv [&>*]:text-2xl">
            <span>
              <img src={getImageSource(rightTickIcon.src)} alt="correct" />
              {examData?.Correctanswer}
            </span>

            <span>
              <img src={getImageSource(crossIcon.src)} alt="incorrect" />
              {examData?.InCorrectanswer}
            </span>
          </div>
        </div>
        <div className="lifelineParantDiv">
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
    </>
  );
};

ExamScore.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  quizScore: PropTypes.number.isRequired,
};
export default withTranslation()(ExamScore);
