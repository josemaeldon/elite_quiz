import { t } from "i18next";
import { useSelector } from "react-redux";
import rightTickIcon from "@/assets/images/check-circle-score-screen.svg";
import crossIcon from "@/assets/images/x-circle-score-screen.svg";
import Timer from "../../Common/Timer";
import { forwardRef } from "react";
import { getImageSource } from "@/utils";
import { useRouter } from "next/router";

const QuestionTopSection = forwardRef(
  (
    { corrAns, inCorrAns, currentQuestion, questions, showAnswers, showQuestions, timerSeconds, onTimerExpire, isQuiz, isBattle, timerhide },
    ref
  ) => {
    const userData = useSelector((state) => state.User);
    const router = useRouter();
    const hasLevel =
      router.query?.hasLevel !== "0" && router.query?.hasLevel !== 0;

    return (
      <>
        <div className='mt-4 md:mt-12 m-[15px_0px] p-8 relative rounded-2xl border-[2px] bordercolor bgcolor max-575:p-[11px] pb-[30px]  mb-6 max-479:!pb-6 darkSecondaryColor'>
          <div className='flex flex-wrap gap-6 items-center justify-between between-480-575:mt-[-10px] between-480-575:flex-wrap between-480-575:gap-[20px] max-399:mt-[-10px] max-399:mb-[0px] max-399:relative max-399:gap:12px max-399:item-baseline text-end p-2 max-479:items-start max-575:gap-5 '>
            <div className='flex justify-center items-center gap-10 between-576-767:gap-3 max-575:gap-1 max-575:justify-between max-399:!gap-0    '>
              <div className='coins'>
                <span>
                  {t('coins')} : {userData?.data?.coins}
                </span>
              </div>

              {showAnswers ? (
                <div className='rightWrongAnsDiv'>
                  <span className=''>
                    <img src={getImageSource(rightTickIcon.src)} alt='correct' />
                    {corrAns}
                  </span>

                  <span className=''>
                    <img src={crossIcon.src} alt='incorrect' />
                    {inCorrAns}
                  </span>
                </div>
              ) : null}
            </div>
            <div className={`rightSec ${!showAnswers && 'right_section_inner_data'}`}>
              <div className='rightWrongAnsDiv [&>span:first-child]:pr-0 [&>span:first-child]:border-r-0'>
                <span className='text-[18px] font-bold text-text-color '>
                  {currentQuestion + 1} - {questions?.length}
                </span>
              </div>
            </div>
          </div>
          {showQuestions && hasLevel ? (
            <div className="mt-[10px] absolute left-[50%] top-[122px] -translate-x-1/2 max-399:top-[71px] max-575:top-[83px] ">
              <h5 className="text-text-color font-lato text-lg font-bold leading-4 ">
                {t("level")} : {questions[currentQuestion]?.level}
              </h5>
            </div>
          ) : (
            ""
          )}

          {isBattle === true ? (
            ""
          ) : (
            <div className='timerWrapper'>
              <div className='w-full flex justify-center items-center capitalize text-white max-479:flex-col max-479:gap-[20px] max-479:pt-0'>
                {questions && questions[0]['id'] !== '' && timerhide === false ? false : true ? (
                  <Timer ref={ref} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} isQuiz={isQuiz} />
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default QuestionTopSection;
