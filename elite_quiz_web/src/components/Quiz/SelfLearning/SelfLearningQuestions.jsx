import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { decryptAnswer } from "@/utils";
import { FaArrowsAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import {
  LoadQuizZoneCompletedata,
  percentageSuccess,
  questionsDataSuceess,
  resultTempDataSuccess,
  setQuizResultData,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/router";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import QuestionMiddleSectionOptions from "@/components/view/common/QuestionMiddleSectionOptions";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import { t } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SelfLearningQuestions({
  questions: data,
  timerSeconds,
  onOptionClick,
}) {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const child = useRef(null);
  const scroll = useRef(null);
  const answerOptionClicked = useRef(false);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [update_questions, setUpdate_questions] = useState(data);
  const [notificationmodal, setNotificationModal] = useState(false);
  const [score, setScore] = useState(0);
  const systemconfig = useSelector(sysConfigdata);

  const dispatch = useDispatch();

  const navigate = useRouter();

  // store data get
  const userData = useSelector((state) => state.User);

  setTimeout(() => {
    setQuestions(data);
  }, 500);

  // button option answer check
  const handleAnswerOptionClick = (selected_option) => {
    answerOptionClicked.current = true;

    let { id } = questions[currentQuestion];
    let update_questions = questions.map((data) => {
      return data.id === id
        ? { ...data, selected_answer: selected_option, isAnswered: true }
        : data;
    });
    setUpdate_questions(update_questions);

    if (questions[currentQuestion].selected_answer)
      setQuestions(update_questions);

    onOptionClick(update_questions);
    dispatch(questionsDataSuceess(update_questions));
  };

  // option answer status check
  const setAnswerStatusClass = (option) => {
    if (questions[currentQuestion].isAnswered) {
      if (systemconfig && systemconfig.answer_mode === "1") {
      }
      if (questions[currentQuestion].selected_answer === option) {
        return "bg-theme [&>div>div>span]:text-white";
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const onSubmit = async () => {
    let seconds = child.current?.getMinuteandSeconds();

    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));

    // Check if handleAnswerOptionClick was executed
    if (!answerOptionClicked.current) {
      dispatch(questionsDataSuceess(questions));
    }

    // let result_score = Score.current;
    let result_score = score;
    update_questions.map((data) => {
      let selectedAnswer = data.selected_answer;
      let decryptedAnswer = decryptAnswer(
        data.answer,
        userData?.data?.id
      );
      if (decryptedAnswer === selectedAnswer) {
        result_score++;

        setScore(result_score);
        setCorrAns(result_score);
        setInCorrAns(update_questions.length - result_score);

        // LoadQuizZoneCompletedata(result_score, update_questions.length - result_score)
        LoadQuizZoneCompletedata(
          result_score,
          update_questions.length - result_score
        );
      }
    });
    dispatch(percentageSuccess(result_score));
    onOptionClick(questions, result_score);
    setQuizResultData({
      total_questions: update_questions?.length,
      correctAnswer: result_score,
      winningPer: (result_score * 100) / update_questions?.length,
    });

    await onQuestionEnd();
  };

  const onQuestionEnd = async () => {
    const tempData = {
      totalQuestions: update_questions?.length,
      showQuestions: true,
      reviewAnswer: false,
    };
    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/self-learning/result");
  };

  const onTimerExpire = () => {
    onSubmit();
    setInCorrAns(inCorrAns + 1);
  };

  const previousQuestion = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      if (prevQuestion > 0) {
        setDisablePrev(false);
      } else {
        setDisablePrev(true);
      }
      setDisableNext(false);
      setCurrentQuestion(prevQuestion);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions?.length) {
      if (nextQuestion + 1 === questions?.length) {
        setDisableNext(true);
      } else {
        setDisableNext(false);
      }
      setDisablePrev(false);
      setCurrentQuestion(nextQuestion);
    }
  };

  // pagination
  const handlePagination = (index) => {
    setCurrentQuestion(index);
  };

  return (
    <React.Fragment>
      <QuestionTopSection
        currentQuestion={currentQuestion}
        questions={questions}
        showAnswers={false}
        timerSeconds={timerSeconds}
        onTimerExpire={onTimerExpire}
        ref={child}
      />

      <QuestionMiddleSectionOptions
        questions={questions}
        currentQuestion={currentQuestion}
        setAnswerStatusClass={setAnswerStatusClass}
        handleAnswerOptionClick={handleAnswerOptionClick}
        probability={false}
        latex={true}
      />

      <div className="lifelineParantDiv">
        <div className="mb-3 w-full md:w-1/4 pr-10 max-767:px-5 between-576-767:w-1/2 ">
          <button
            className="lifelinebtn group"
            onClick={previousQuestion}
            disabled={disablePrev}
          >
            <span className="hoverbtn">
              <RiArrowLeftDoubleLine size={25} />
            </span>
            <span className="onhoverbtn">{t("previous_question")}</span>
          </button>
        </div>
        {/* {/ pagination /} */}

        <div className=" mb-3 w-full md:w-1/4 px-5 between-576-767:w-1/2">
          <Dialog>
            <DialogTrigger
              open={notificationmodal}
              onOpenChange={setNotificationModal}
              className="w-full"
            >
              <button
                className="lifelinebtn group"
                onClick={() => setNotificationModal(true)}
              >
                <span className="hoverbtn">
                  <FaArrowsAlt />
                </span>
                <span className="onhoverbtn">
                  {t("view_question_dashboard")}
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white !rounded-[10px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  <h4 className="flex-center pb-5 font-bold ">
                    {t("q_att")}
                  </h4>
                </DialogTitle>
                <DialogDescription>
                  <div
                    className={`flex-center flex-wrap p-4 gap-4  ${
                      questions?.length > 50 ? "questions-scrollbar" : ""
                    }`}
                  >
                    {questions?.map((que_data, index) => {
                      return (
                        <div className="mb-3 mr-3 cursor-pointer" key={index}>
                          <p className="hidden">{que_data?.id}</p>

                          <p
                            className={`p-[10px_15px] rounded-[5px] mb-0 border border-[#2724244f] flex-center font-sans text-[25px] font-bold text-text-color h-14 w-14  ${
                              update_questions &&
                              update_questions[index]?.isAnswered
                                ? "bg-primary-color text-white dark:bg-gradient-to-r dark:from-[var(--gradient-from)] dark:to-[var(--gradient-to)]"
                                : " text-text-color darkSecondaryColor"
                            }`}
                            onClick={() => handlePagination(index)}
                          >
                            {index + 1}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <hr className=" text-[#000000e0] bg-[#80808094] opacity-25 m-4 dark:bg-white" />
                  {/* check and unchecked */}
                  <div className="flex items-center justify-evenly flex-wrap p-[20px_10px]">
                    <div className="flex-center">
                      <input
                        type="radio"
                        name=""
                        className="mr-2 accent-primary-color"
                        checked
                        readOnly
                      />
                      <h5 className="mb-0">{t("att")}</h5>
                    </div>
                    <div className="flex-center">
                      <input
                        type="radio"
                        name=""
                        className="mr-2"
                        disabled
                        readOnly
                      />
                      <h5 className="mb-0">{t("un_att")}</h5>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-3 w-full md:w-1/4 px-5 between-576-767:w-1/2">
          <button
            className="lifelinebtn group"
            onClick={nextQuestion}
            disabled={disableNext}
          >
            {/* <span className='lifelineText'>{t("Next Question")}</span> */}
            <span className="hoverbtn">
              <RiArrowRightDoubleLine size={25} />
            </span>
            <span className="onhoverbtn">{`${t("next")} ${t(
              "questions"
            )} `}</span>
          </button>
        </div>

        <div className="mb-3 w-full md:w-1/4 pl-10 max-767:px-5 between-576-767:w-1/2">
          <button className="lifelinebtn" onClick={onSubmit}>
            {t("submit")}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

SelfLearningQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(SelfLearningQuestions);
