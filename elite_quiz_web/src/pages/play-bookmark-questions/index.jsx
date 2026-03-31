"use client";
import React, { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import dynamic from "next/dynamic";
import QuestionMiddleSectionOptions from "@/components/view/common/QuestionMiddleSectionOptions";
import { audioPlay, showAnswerStatusClass } from "@/utils";
import bookmarkPlayEnd from "../../assets/images/bookmark_play_end.gif";
import Timer from "@/components/Common/Timer";
import AudioQuestionsDashboard from "@/components/Quiz/AudioQuestions/AudioQuestionsDashboard";
import GuessthewordQuestions from "@/components/Quiz/Guesstheword/GuessthewordQuestions";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import Image from "next/image";
import { getBookmarkApi } from "@/api/apiRoutes";

const BookmarkPlay = () => {
  const navigate = useRouter();

  const bookmarkId = useSelector((state) => state.Bookmark.bookmarkId);

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const [showBackButton, setShowBackButton] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAns, setSelectedAns] = useState();

  const [delay, setDelay] = useState(false);

  const systemconfig = useSelector(sysConfigdata);

  const child = useRef(null);

  const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration);
  useEffect(() => {
    getNewQuestions();
  }, []);

  // bookmark api
  const getNewQuestions = async () => {
    if (delay && questions.length < currentQuestion) {
      setShowBackButton(true);
    } else {
      const response = await getBookmarkApi({ type: bookmarkId });

      if (response.error) {
        toast.error(t("no_que_found"));
        navigate.push("/");
      }

      let questions = response.data.map((data) => ({
        ...data,
        isBookmarked: false,
        selected_answer: "",
        isAnswered: false,
      }));
      setQuestions(questions);
      if (questions?.length === 0) {
        toast.error(t("no_data_found"));
        navigate.push("/");
      }
    }
  };

  const nextQuestion = () => {
    // this is only for Question end
    setTimeout(() => {
      setCurrentQuestion(currentQuestion);

      if (delay && questions.length == currentQuestion + 1) {
        setShowBackButton(true);
      }
    }, 50);

    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
    }, 1000);
  };
  //answer option click
  const handleAnswerOptionClick = (selAns) => {
    nextQuestion();
    setSelectedAns(selAns);
    child.current.resetTimer();
    questions[currentQuestion].isAnswered = true;
    questions[currentQuestion].selected_answer = selAns;
    audioPlay(selAns, questions[currentQuestion].answer);
  };
  //Audio answer option click
  const handleAudioAnswerOptionClick = (selAns) => {
    nextQuestion();
    setSelectedAns(selAns);
    child.current.resetTimer();
    audioPlay(
      selAns[currentQuestion].selected_answer,
      questions[currentQuestion].answer
    );
  };

  const onTimerExpire = () => {
    nextQuestion();
    child.current.resetTimer();
  };

  useEffect(() => {
    setTimeout(() => {
      setDelay(true);
    }, 500);
  }, [currentQuestion]);

  //go back button
  const goBack = () => {
    navigate.push("/profile/bookmark");
  };
  // option answer click
  const setAnswerStatusClass = (option) => {
    const currentIndex = currentQuestion;
    const currentQuestionq = questions[currentIndex];
    const color = showAnswerStatusClass(
      option,
      currentQuestionq.isAnswered,
      currentQuestionq.answer,
      currentQuestionq.selected_answer
    );
    return color;
  };

  const onQuestionEnd = async () => {
    setShowBackButton(true);
  };

  return (
    <Layout>
      <Breadcrumb title={t("bookmark_play")} content="" contentTwo="" />
      <div className="">
        <div className="container mb-2">
          <div className="">
            <div className="mt-24">
              {(() => {
                if (showBackButton) {
                  return (
                    <div className=" morphisam flex-center flex-col !mb-14 darkSecondaryColor">
                      <Image
                        src={bookmarkPlayEnd.src}
                        height={200}
                        width={200}
                        alt="bookmarkPlayEnd"
                      />
                      <div className="">
                        <button className="reviewBtn" onClick={goBack}>
                          {t("back")}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return questions && questions?.length > 0 ? (
                    <>
                      <div className="morphisam flex justify-end darkSecondaryColor">
                        <div className="border-2 border-[#D1D5DB] p-[12px_20px] w-[82px] rounded-[48px]">
                          {currentQuestion + 1} - {questions?.length}
                        </div>
                      </div>
                      <div className="hidden">
                        {" "}
                        <Timer
                          ref={child}
                          timerSeconds={TIMER_SECONDS}
                          onTimerExpire={onTimerExpire}
                        />
                      </div>

                      {bookmarkId === "1" && (
                        <QuestionMiddleSectionOptions
                          questions={questions}
                          currentQuestion={currentQuestion}
                          setAnswerStatusClass={setAnswerStatusClass}
                          handleAnswerOptionClick={handleAnswerOptionClick}
                          probability={true}
                          onQuestionEnd={onQuestionEnd}
                          latex={true}
                        />
                      )}
                      {bookmarkId === "3" && (
                        <GuessthewordQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          showQuestions={false}
                          showLifeLine={false}
                          onQuestionEnd={onQuestionEnd}
                          isBookmarkPlay={true}
                        />
                      )}
                      {bookmarkId === "4" && (
                        <AudioQuestionsDashboard
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAudioAnswerOptionClick}
                          isBookmarkPlay={true}
                          onQuestionEnd={onQuestionEnd}
                          ref={child}
                        />
                      )}
                      <div className="mb-14"></div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <Skeleton count={5} className="skeleton"/>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(BookmarkPlay);
