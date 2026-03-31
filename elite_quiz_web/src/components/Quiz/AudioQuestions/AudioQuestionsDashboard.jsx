import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

import {
  decryptAnswer,
  showAnswerStatusClass,
  audioPlay,
} from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  LoadQuizZoneCompletedata,
  percentageSuccess,
  questionsDataSuceess,
  setQuizResultData,
} from "@/store/reducers/tempDataSlice";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import { t } from "@/utils";
import {
  setQuizCoinScoreApi,
} from "@/api/apiRoutes";

const AudioQuestionsDashboard = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
  isBookmarkPlay,
  ref,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const [totalTimerAudio, setTotalTimerAudio] = useState();
  const [currentTimeaudio, setCurrentTimeaudio] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [timerhide, setTimerhide] = useState(false);

  const child = useRef(null);
  const scroll = useRef(null);
  const audioRef = useRef(null);
  const answerOptionClicked = useRef(false);

  const dispatch = useDispatch();

  // store data get
  const userData = useSelector((state) => state.User);


  const Score = useRef(0);


  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  // show answer button
  const ShowAnswersbtn = () => {
    // answershow
    setShowAnswers(true);
    // show button hide
    setHidden(true);
    // timer start
    setTimerhide(true);
  };

  // total audio timer value
  const onLoadedMetadata = () => {
    setTotalTimerAudio(parseInt(audioRef.current.duration));
  };

  // current audio timer value
  const handleTimeUpdate = () => {
    setCurrentTimeaudio(parseInt(audioRef.current.currentTime));
    // check audio condition

    if (currentTimeaudio == totalTimerAudio - 1) {
      ShowAnswersbtn();
    }
  };

  setTimeout(() => {
    setQuestions(data);
  }, 800);

  const setNextQuestion = async (update_questions) => {
    if (!isBookmarkPlay) {
      let seconds = child.current?.getMinuteandSeconds();
      dispatch(setTotalSecond(timerSeconds));
      dispatch(setSecondSnap(seconds));
    }
    setShowAnswers(false);
    setHidden(false);
    setTimerhide(false);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions?.length) {
      if (isBookmarkPlay) {
        let seconds = child.current?.getMinuteandSeconds();
        dispatch(setTotalSecond(timerSeconds));
        dispatch(setSecondSnap(seconds));
      }
      setCurrentQuestion(nextQuestion);
      child.current.resetTimer();
    } else {


      const questionsForApi = update_questions?.map((item) => ({
        id: item.id,
        answer: item.selected_answer,
      }));
      
      const response = await setQuizCoinScoreApi({
        quiz_type: 4,
        category: questions[currentQuestion].category,
        subcategory: questions[currentQuestion].subcategory,
        play_questions: JSON.stringify(questionsForApi),
      });
      if (!response?.error) {
        setQuizResultData(response.data);
      } else {
        console.log(response);
      }

      await onQuestionEnd();
      
      
    }
  };

  // button option answer check
  const handleAnswerOptionClick = (selected_option) => {
    answerOptionClicked.current = true;
    
    if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
      addAnsweredQuestion(currentQuestion);

      let { id, answer } = questions[currentQuestion];
      let decryptedAnswer = decryptAnswer(answer, userData?.data?.id);
      let result_score = Score.current;
      if (decryptedAnswer === selected_option) {
        result_score++;
        Score.current = result_score;
        setCorrAns(corrAns + 1);
      } else {
        setInCorrAns(inCorrAns + 1);
      }

      // this for only audio
      const currentIndex = currentQuestion;

      const currentQuestionq = questions[currentIndex];

      {
        !isBookmarkPlay && audioPlay(selected_option, currentQuestionq.answer);
      }

      let update_questions = questions.map((data) => {
        return data?.id === id
          ? { ...data, selected_answer: selected_option, isAnswered: true }
          : data;
      });
      
      
      setQuestions(update_questions);
      setTimeout(() => {
        setNextQuestion(update_questions);
      }, 1000);
      dispatch(percentageSuccess(result_score));
      onOptionClick(update_questions, result_score);
      dispatch(questionsDataSuceess(update_questions));
    }
  };

  // option answer status check
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

  const onTimerExpire = () => {
    let { id } = questions[currentQuestion];

    let update_questions = questions.map((data) => {
      return data?.id === id
        ? { ...data, selected_answer: "", isAnswered: true }
        : data;
    });
    setQuestions(update_questions);
    dispatch(questionsDataSuceess(update_questions));
    setTimeout(() => {
      setNextQuestion(update_questions);
    }, 1000);
    // ShowAnswersbtn()
    setInCorrAns(inCorrAns + 1);
  };

  useEffect(() => {
    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;

    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect);
  }, [corrAns, inCorrAns]);

  return (
    <React.Fragment>
      <div className={`${isBookmarkPlay ? "hidden" : "block"}`}>
        <QuestionTopSection
          corrAns={corrAns}
          inCorrAns={inCorrAns}
          currentQuestion={currentQuestion}
          questions={questions}
          showAnswers={true}
          timerSeconds={timerSeconds}
          onTimerExpire={onTimerExpire}
          timerhide={timerhide}
          ref={child}
        />
      </div>
      <div className="morphisam mb-6 lg:flex darkSecondaryColor " ref={scroll}>
        <div className="w-full lg:w-2/3 flex-center h-auto bg-white rounded-[10px]  flex-col py-4 text-center dark:bg-[#3c3555] mb-[10px] lg:mb-0">
          <p className="text-2xl font-medium mb-6 pt-4">
            {questions[currentQuestion].question}
          </p>
          {/* Audio Questions Player */}
          <div className="flex-center text-center p-2 pt-4 w-full">
            <audio
              src={questions[currentQuestion].audio}
              controls
              autoPlay
              controlsList="nodownload noplaybackrate"
              id="audio"
              ref={audioRef}
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* options */}
        <div className="w-full lg:w-1/3">
          <div className="mr-5 ml-5 lg:mr-0  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 ">
            {questions[currentQuestion].optiona ? (
              <div className="">
                <div className={`optionButton ${!showAnswers && "dark:bg-[#3c3555]"}`}>
                  {showAnswers ? (
                    <button
                      className={`optionBtn ${setAnswerStatusClass("a")}`}
                      onClick={(e) => handleAnswerOptionClick("a")}
                    >
                      <div className="flex flex-wrap break-words ">
                        <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color">
                          <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                            {t("a")}&nbsp;
                          </span>
                          {questions[currentQuestion].optiona}
                        </div>
                        {questions[currentQuestion].probability_a ? (
                          <div className="col text-end">
                            {questions[currentQuestion].probability_a}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </button>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].optionb ? (
              <div className="">
                <div className={`optionButton ${!showAnswers && "dark:bg-[#3c3555]"}`}>
                  {showAnswers ? (
                    <button
                      className={`optionBtn ${setAnswerStatusClass("b")}`}
                      onClick={(e) => handleAnswerOptionClick("b")}
                    >
                      <div className="flex flex-wrap break-words ">
                        <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color">
                          <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                            {t("b")}&nbsp;
                          </span>
                          {questions[currentQuestion].optionb}
                        </div>
                        {questions[currentQuestion].probability_b ? (
                          <div className="col text-end">
                            {questions[currentQuestion].probability_b}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </button>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].question_type === "1" ? (
              <>
                {questions[currentQuestion].optionc ? (
                  <div className="">
                    <div className={`optionButton ${!showAnswers && "dark:bg-[#3c3555]"}`}>
                      {showAnswers ? (
                        <button
                          className={`optionBtn ${setAnswerStatusClass("c")}`}
                          onClick={(e) => handleAnswerOptionClick("c")}
                        >
                          <div className="flex flex-wrap break-words ">
                            <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color">
                              <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                                {t("c")}&nbsp;
                              </span>
                              {questions[currentQuestion].optionc}
                            </div>
                            {questions[currentQuestion].probability_c ? (
                              <div className="col text-end">
                                {questions[currentQuestion].probability_c}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </button>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion].optiond ? (
                  <div className="">
                    <div className={`optionButton ${!showAnswers && "dark:bg-[#3c3555]"}`}>
                      {showAnswers ? (
                        <button
                          className={`optionBtn ${setAnswerStatusClass("d")}`}
                          onClick={(e) => handleAnswerOptionClick("d")}
                        >
                          <div className="flex flex-wrap break-words ">
                            <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color">
                              <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                                {t("d")}&nbsp;
                              </span>
                              {questions[currentQuestion].optiond}
                            </div>
                            {questions[currentQuestion].probability_d ? (
                              <div className="col text-end">
                                {questions[currentQuestion].probability_d}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </button>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {questions[currentQuestion].optione ? (
                  <div className="row d-flex justify-content-center mob_resp_e">
                    <div className="">
                      <div className={`optionButton ${!showAnswers && "dark:bg-[#3c3555]"}`}>
                        {showAnswers ? (
                          <button
                            className={`optionBtn ${setAnswerStatusClass("e")}`}
                            onClick={(e) => handleAnswerOptionClick("e")}
                          >
                            <div className="flex flex-wrap break-words ">
                              <div className="flex align-baseline text-start gap-[10px] [&>div]:break-all text-text-color">
                                <span className="font-bold text-[20px] leading-[30px] text-primary-color whitespace-nowrap">
                                  {t("e")}&nbsp;
                                </span>
                                {questions[currentQuestion].optione}
                              </div>
                              {questions[currentQuestion].probability_e ? (
                                <div
                                  className="col"
                                  style={{ textAlign: "right" }}
                                >
                                  {questions[currentQuestion].probability_e}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </button>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* show answers button */}
      </div>
      <div className="flex-center my-5">
        <button
          className={`bg-primary-color text-white p-2 rounded-[5px] w-40 ${
            hidden ? "hidden" : ""
          }`}
          onClick={ShowAnswersbtn}
        >
          {t("show_option")}
        </button>
      </div>
    </React.Fragment>
  );
};

AudioQuestionsDashboard.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(AudioQuestionsDashboard);
