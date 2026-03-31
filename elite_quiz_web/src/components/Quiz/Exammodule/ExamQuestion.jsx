"use client";
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Timer from "@/components/Common/Timer";
import { decryptAnswer, calculateScore } from "@/utils";
import { FaArrowsAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  LoadQuizZoneCompletedata,
  LoadexamCompletedata,
  Loadexamsetquiz,
  getexamQuestion,
  percentageSuccess,
  questionsDataSuceess,
  resultTempDataSuccess,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import { useRouter } from "next/router";
import QuestionMiddleSectionOptions from "@/components/view/common/QuestionMiddleSectionOptions";
import { t } from "@/utils";
import { setExamModualResultApi } from "@/api/apiRoutes";

function ExamQuestion({ questions: data, timerSeconds, onOptionClick }) {
  
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const child = useRef(null);
  const scroll = useRef(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [update_questions, setUpdate_questions] = useState(data);
  const [notificationmodal, setNotificationModal] = useState(false);
  const [isClickedAnswer, setisClickedAnswer] = useState(false);

  const [score, setScore] = useState(0);

  const navigate = useRouter();

  const systemconfig = useSelector(sysConfigdata);

  const dispatch = useDispatch();

  const getData = useSelector(selecttempdata);

  const examquestion = useSelector(getexamQuestion);

  const NotRunScreen = useRef(false);

  // store data get
  const userData = useSelector((state) => state.User);

  const selecttempData = useSelector(selecttempdata);

  const exam_latex = systemconfig.exam_latex_mode === "1" ? true : false;

  const answerOptionClicked = useRef(false);

  setTimeout(() => {
    setQuestions(data);
  }, 500);

  //disabled click on option
  const disabledQuestions = (questions) => {
    let isanswered;
    questions.map((question, index) => {
      isanswered = question.isAnswered;
      if (selecttempData.answer_again === "0" && isanswered === true) {
        setisClickedAnswer(true);
      }
    });
  };

  // button option answer check
  const handleAnswerOptionClick = (selected_option) => {
    answerOptionClicked.current = true;
    
    let { id } = questions[currentQuestion];

    let update_questions = questions.map((data) =>
      data.id === id
        ? { ...data, selected_answer: selected_option, isAnswered: true }
        : data
    );

    setUpdate_questions(update_questions);

    disabledQuestions(update_questions);

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
        return "bg-theme";
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getStatistics = (questions) => {
    const uniqueMarks = [
      ...new Set(questions.map((question) => question.marks)),
    ];
    let abc = [];

    uniqueMarks.forEach((mark) => {
      const markQuestions = questions.filter(
        (question) => question.marks == mark
      );

      const correctAnswers = markQuestions.filter((question) => {
        const decryptedAnswer = decryptAnswer(
          question.answer,
          userData?.data?.id
        );
        return question.selected_answer === decryptedAnswer;
      }).length;

      const incorrectAnswers = markQuestions.length - correctAnswers;

      abc.push({
        mark: `${mark}`,
        correct_answer: `${correctAnswers}`,
        incorrect: `${incorrectAnswers}`,
      });
    });
    return JSON.stringify(abc);
  };

  // new added for total question get and above is for server
  const newgetStatistics = (questions) => {
    const uniqueMarks = [
      ...new Set(questions.map((question) => question.marks)),
    ];
    const statistics = uniqueMarks.map((mark) => {
      const markQuestions = questions.filter(
        (question) => question.marks === mark
      );
      const correctAnswers = markQuestions.filter(
        (question) =>
          question.selected_answer ===
          decryptAnswer(question.answer, userData?.data?.id)
      )?.length;
      return {
        mark: mark,
        correct_answer: correctAnswers,
        incorrect: markQuestions?.length - correctAnswers,
      };
    });

    return JSON.stringify(statistics);
  };

  // total questions get;
  const totalQuestions = async (totaldata) => {
    let totalQuestions = 0;
    let parsingdata = JSON.parse(totaldata);
    parsingdata.forEach((markStatistics) => {
      totalQuestions +=
        parseInt(markStatistics.correct_answer) +
        parseInt(markStatistics.incorrect);
    });
    return totalQuestions;
  };

  // total correct answer get;
  const totalQuestionsCorrect = async (totaldata) => {
    let totalQuestioncorrect = 0;
    let parsingdata = JSON.parse(totaldata);
    parsingdata.forEach((markStatistics) => {
      totalQuestioncorrect += parseInt(markStatistics.correct_answer);
    });
    return totalQuestioncorrect;
  };

  // total correct answer get;
  const totalQuestionsInCorrect = async (totaldata) => {
    let totalQuestionIncorrect = 0;
    let parsingdata = JSON.parse(totaldata);
    parsingdata.forEach((markStatistics) => {
      totalQuestionIncorrect += parseInt(markStatistics.incorrect);
    });
    return totalQuestionIncorrect;
  };

  // all complete data
  const allcompletedData = async (totaldata) => {
    let newtotaldata = await totalQuestions(totaldata);
    let newcorrect = await totalQuestionsCorrect(totaldata);
    let newincorrect = await totalQuestionsInCorrect(totaldata);
    LoadexamCompletedata(newtotaldata, newcorrect, newincorrect);
  };

  // total duration find of minute
  const durationMinutes = (minute) => {
    let durationInSeconds = minute * 60;
    let hours = Math.floor(durationInSeconds / 3600);
    let minutes = Math.floor(durationInSeconds / 60) % 60;
    let seconds = durationInSeconds % 60;

    if (seconds === 0) {
      seconds = 60;
      minutes--;
    }

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  // total seconds find
  const totalsecondsFinds = () => {
    //duration exam
    const durationofExamTime = durationMinutes(Number(selecttempData.duration));

    const durationpart = durationofExamTime.split(":");

    const durationhours = parseInt(durationpart[0]);

    const durationminutes = parseInt(durationpart[1]);

    const durationseconds = parseInt(durationpart[2]);

    const totaldurationSeconds =
      durationhours * 3600 + durationminutes * 60 + durationseconds;

    //remaining timer
    const remainingTimeofTimer = child.current.getMinuteandSeconds();

    const parts = remainingTimeofTimer.split(":");

    const remaininghours = parseInt(parts[0]);

    const remainingminutes = parseInt(parts[1]);

    const remainingseconds = parseInt(parts[2]);

    const totalremianingseconds =
      remaininghours * 3600 + remainingminutes * 60 + remainingseconds;

    const TotalTimerRemainingData =
      totaldurationSeconds - totalremianingseconds;

    return TotalTimerRemainingData;
  };

  // on submit events after questions over
  const onSubmit = async () => {
    
    NotRunScreen.current = true;
    let result_score = score;
    let totalMarks = 0;
    update_questions.map((data) => {
      let selectedAnswer = data.selected_answer;
      let decryptedAnswer = decryptAnswer(
        data.answer,
        userData?.data?.id
      );

      if (decryptedAnswer == selectedAnswer) {
        totalMarks += Number(data.marks);
        result_score++;
        setScore(result_score);
        setCorrAns(result_score);
        setInCorrAns(update_questions.length - result_score);

        LoadQuizZoneCompletedata(
          result_score,
          update_questions.length - result_score
        );
        // LoadQuizZoneCompletedata(corrAns, inCorrAns)
      }
    });

    const markStatistics = getStatistics(update_questions);
    

    const totaldata = newgetStatistics(update_questions);

    await allcompletedData(totaldata);

    const totalremainingtimer = totalsecondsFinds();

    Loadexamsetquiz(totalremainingtimer, markStatistics, totalMarks);

    dispatch(percentageSuccess(result_score));

    onOptionClick(update_questions, result_score);

    // Check if handleAnswerOptionClick was executed
    if (!answerOptionClicked.current) {
      dispatch(questionsDataSuceess(questions));
    }

    // let userScore = null;

    // userScore = await calculateScore(result_score, update_questions?.length);

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
    await navigate.push("/exam-module/result");
  };

  // time expire
  const onTimerExpire = () => {
    onSubmit();
    setInCorrAns(inCorrAns + 1);
  };

  // prevoius questions
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

  // next questions
  const nextQuestion = () => {
    
    // disable option check on next question
    update_questions.map((item) => {
      if (!item.isAnswered) setisClickedAnswer(false);
    });

    // next question
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

  // if user leave screen in between exam
  const leaveScreen = async () => {
    const statistics = getStatistics(examquestion);
    const totaldata = newgetStatistics(examquestion);
    allcompletedData(totaldata);

    const resposne = await setExamModualResultApi({
      exam_module_id: Number(getData.id),
      total_duration: 1,
      obtained_marks: 0,
      statistics: statistics,
      rules_violated: 1,
      captured_question_ids: [],
    })
    if(resposne.error){
      console.log(resposne);
    };
  };

  // if user left from question screen
  useEffect(() => {
    return () => {
      if (!NotRunScreen.current) {
        leaveScreen();
      }
    };
  }, []);
useEffect(() => {
  // Check if questions are valid (not the default empty question)
  if(questions && questions?.length == 1 && questions[0]?.id === ""){
    setDisableNext(true);
    setDisablePrev(true);
  } else if(questions && questions?.length > 1) {
    // Handle previous button state
    if (currentQuestion === 0) {
      setDisablePrev(true);
    } else {
      setDisablePrev(false);
    }
    
    // Handle next button state
    if (currentQuestion + 1 === questions?.length) {
      setDisableNext(true);
    } else {
      setDisableNext(false);
    }
  }
}, [questions, data, currentQuestion]);
  return (
    <React.Fragment>
      <div className="m-[15px_0px] p-8 relative rounded-2xl border-[2px] bgcolor max-575:p-[11px] pb-[30px]  mb-6 max-479:!pb-6">
        <div className="flex items-center justify-between between-480-575:mt-[-10px] between-480-575:flex-wrap between-480-575:gap-[20px] max-399:mt-[-10px] max-399:mb-[0px] max-399:relative max-399:gap:12px max-479:flex-col max-399:item-baseline text-end p-2 max-479:items-start max-575:gap-5 ">
          <div className="flex justify-center items-center gap-10 between-576-767:gap-3 max-575:gap-1 max-575:w-full max-575:justify-between max-399:!gap-0">
            <div className="coins md:!p-[16px_30px]">
              <span>
                {t("coins")} : {userData?.data?.coins}
              </span>
            </div>

            <div className="coins md:!p-[16px_30px]">
              <span>
                {questions[currentQuestion].marks} {t("marks")}
              </span>
            </div>
          </div>

          <div className="">
            <div className="rightWrongAnsDiv !p-[12px_20px] [&>span:first-child]:pr-0 [&>span:first-child]:border-r-0">
              <span className="text-[18px] font-bold text-text-color ">
                {currentQuestion + 1} - {questions?.length}
              </span>
            </div>
          </div>
        </div>
        <div className="timerWrapper">
          <div className="w-full flex justify-center items-center capitalize text-white max-479:flex-col max-479:gap-[20px] max-479:pt-0">
            {questions && questions[0]["id"] !== "" ? (
              <Timer
                ref={child}
                timerSeconds={timerSeconds}
                onTimerExpire={onTimerExpire}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="questions examModule" ref={scroll}>
        <QuestionMiddleSectionOptions
          isClickedAnswer={isClickedAnswer}
          questions={questions}
          currentQuestion={currentQuestion}
          setAnswerStatusClass={setAnswerStatusClass}
          handleAnswerOptionClick={handleAnswerOptionClick}
          probability={false}
          latex={true}
          exam_latex={exam_latex}
        />
        {/* <div className='divider'>
                    <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
                </div> */}
        <div className="lifelineParantDiv">
          <div className="  mb-3 w-full md:w-1/4 pr-10 max-767:px-5 between-576-767:w-1/2">
            <button
              className="lifelinebtn group "
              onClick={previousQuestion}
              disabled={disablePrev}
            >
              <span className="opacity-100 block group-hover:hidden group-hover:opacity-0">
                {" "}
                <RiArrowLeftDoubleLine size={25} />
              </span>
              <span className="group-hover:opacity-100 group-hover:block hidden opacity-0">
                {t("previous_question")}
              </span>
            </button>
          </div>

          <div className=" mb-3 w-full md:w-1/4 px-5 between-576-767:w-1/2">
            <button
              className="lifelinebtn group  "
              onClick={() => setNotificationModal(true)}
            >
              <span className="opacity-100 block group-hover:hidden group-hover:opacity-0">
                {" "}
                <FaArrowsAlt />
              </span>
              <span className="group-hover:opacity-100 group-hover:block hidden opacity-0">
                {t("view_question_dashboard")}
              </span>
            </button>

            <Dialog
              open={notificationmodal}
              onOpenChange={setNotificationModal}
            >
              <DialogContent className="bg-white  !rounded-[10px] max-h-[80vh] overflow-y-auto">
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
                                  : "bg-transparent text-text-color darkSecondaryColor"
                              }`}
                              onClick={() => handlePagination(index)}
                            >
                              {index + 1}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {/* <hr className=" text-[#000000e0] bg-[#80808094] opacity-25 m-4" />
                    <div className="resettimer">
                      <button className="btn btn-primary" onClick={onSubmit}>
                        {t("submit")}
                      </button>
                    </div> */}
                    <hr />
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
          <div className=" mb-3 w-full md:w-1/4 px-5 between-576-767:w-1/2">
            <button
              className="lifelinebtn group "
              onClick={nextQuestion}
              disabled={disableNext}
            >
              <span className="opacity-100 block group-hover:hidden group-hover:opacity-0">
                <RiArrowRightDoubleLine size={25} />
              </span>
              <span className="group-hover:opacity-100 group-hover:block hidden opacity-0">{`${t(
                "next"
              )} ${t("questions")} `}</span>
            </button>
          </div>
          <div className="  mb-3 w-full md:w-1/4 pl-10 max-767:px-5 between-576-767:w-1/2">
            <button className="lifelinebtn group " onClick={onSubmit}>
              {t("submit")}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ExamQuestion.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(ExamQuestion);
