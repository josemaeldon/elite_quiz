"use client";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import Lifelines from "@/components/Common/Lifelines";
import { withTranslation } from "react-i18next";

import { decryptAnswer, showAnswerStatusClass, audioPlay } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
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
import { setQuizCoinScoreApi } from "@/api/apiRoutes";

const DailyQuizQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  showLifeLine,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);

  const child = useRef(null);
  const scroll = useRef(null);
  const fiftyFiftyClicked = useRef(false);
  const audiencePollClicked = useRef(false);
  const timerResetClicked = useRef(false);
  const skipQuestionClicked = useRef(false);

  const dispatch = useDispatch();

  const navigate = useRouter();

  const Score = useRef(0);

  // store data get
  const userData = useSelector((state) => state.User);

  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  setTimeout(() => {
    setQuestions(data);
  }, 500);

  const setNextQuestion = async (update_questions) => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
      child?.current?.resetTimer();
    } else {

      dispatch(questionsDataSuceess(questions));

      // function for apiQuestions
      let mainQuestions = update_questions?.length > 0 ? update_questions : questions;
      const questionsForApi = mainQuestions?.map((item) => ({
        id: item.id,
        answer: item.selected_answer,
      }));

      const response = await setQuizCoinScoreApi({
        quiz_type: "1.1",
        play_questions: JSON.stringify(questionsForApi),
      });
      if (!response?.error) {
        setQuizResultData(response.data);
      }else{
        console.log(response);
      }


      let questionsLength;
      if (skipQuestionClicked.current === true) {
        questionsLength = questions.length - 1;
      } else {
        questionsLength = questions.length;
      }
      await onQuestionEnd(questionsLength);
    }
  };

  const onQuestionEnd = async (questionsLength) => {
    const tempData = {
      totalQuestions: questionsLength,
      question: questions,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/quiz-play/daily-quiz-dashboard/result");
  };

  // button option answer check
  const handleAnswerOptionClick = (selected_option) => {
    if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
      addAnsweredQuestion(currentQuestion);
      let { id, answer } = questions[currentQuestion];

      let decryptedAnswer = decryptAnswer(answer, userData?.data?.firebase_id);
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

      audioPlay(selected_option, currentQuestionq.answer);

      const newObj = [...questions];

      newObj[currentQuestion].selected_answer = selected_option;
      newObj[currentQuestion].isAnswered = true;

      setQuestions(newObj);

      setTimeout(() => {
        setNextQuestion(newObj);
      }, 1000);
      onOptionClick(newObj, result_score);
      dispatch(percentageSuccess(result_score));
    }

    let seconds = child.current?.getMinuteandSeconds();
    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));
  };

  useEffect(() => {
    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;

    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect);
  }, [corrAns, inCorrAns]);

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

  const handleFiftyFifty = () => {
    fiftyFiftyClicked.current = true;

    let update_questions = [...questions];
    if (update_questions[currentQuestion].question_type === "2") {
      toast.error(t("lifeline_not_allowed"));
      return false;
    }
    let all_option = ["optiona", "optionb", "optionc", "optiond", "optione"];

    //Identify the correct answer option and add that to visible option array
    let decryptedAnswer = decryptAnswer(
      questions[currentQuestion].answer,
      userData?.data?.firebase_id
    );

    let index = all_option.indexOf("option" + decryptedAnswer);

    let visible_option = [all_option[index]];

    //delete correct option from all option array
    all_option.splice(index, 1);

    //Remove Options that are empty
    all_option.map((data, key) => {
      if (questions[currentQuestion][data] === "") {
        all_option.splice(key, 1);
      }
      return data;
    });

    //Generate random key to select the second option from all option array
    let random_number = Math.floor(Math.random() * (all_option?.length - 1));
    // let random_number = Math.floor(Math.random() * all_option?.length)

    visible_option.push(all_option[random_number]);

    //delete that option from all option array
    all_option.splice(random_number, 1);

    //at the end delete option from the current question that are available in all options
    all_option =
      all_option &&
      all_option.map((data) => {
        delete update_questions[currentQuestion][data];
        return data;
      });

    update_questions[currentQuestion].fiftyUsed = true;

    setQuestions(update_questions);
    // setUpdateQuestions(questions => [...questions, ...updatequestion]);
    return true;
  };

  function generate(max, thecount) {
    let r = [];
    let currsum = 0;
    for (let i = 0; i < thecount - 1; i++) {
      r[i] = randombetween(1, max - (thecount - i - 1) - currsum);
      currsum += r[i];
    }
    r[thecount - 1] = max - currsum;
    return r;
  }

  function randombetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const handleAudiencePoll = () => {
    audiencePollClicked.current = true;
    let update_questions = [...questions];
    let { answer, optione, question_type } = update_questions[currentQuestion];
    let decryptedAnswer = decryptAnswer(answer, userData?.data?.firebase_id);
    let all_option = [];
    if (question_type === "2") {
      all_option = ["a", "b"];
    } else {
      all_option = ["a", "b", "c", "d"];
      if (questions[currentQuestion].optione ) {
        if (optione !== "") {
          all_option.push("e");
        }
      }
    }

    //Generate Random % for all the options
    let numbers = generate(100, all_option?.length);

    //Get the Maximum number and assign that number to correct number
    let maximum = Math.max(...numbers);
    update_questions[currentQuestion]["probability_" + [decryptedAnswer]] =
      maximum + " %";

    //Remove correct option and maximum number from the array
    all_option.splice(all_option.indexOf(decryptedAnswer), 1);
    numbers.splice(numbers.indexOf(maximum), 1);

    //apply map function and assign the remaining numbers to incorrect options
    all_option = all_option.map((data, key) => {
      update_questions[currentQuestion]["probability_" + [data]] =
        numbers[key] + " %";
      return data;
    });
    update_questions[currentQuestion].audeincePoll = true;
    setQuestions(update_questions);
    // setUpdateQuestions(questions => [...questions, ...update_questions]);
  };

  const handleSkipQuestion = () => {
    skipQuestionClicked.current = true;
    setCurrentQuestion((prevQuestion) => prevQuestion - 1); // Decrement currentQuestion by 1

    // Check if there are negative indices and set it to 0 to prevent errors
    if (currentQuestion <= 0) {
      setCurrentQuestion(0);
    }
    setNextQuestion();
  };

  const onTimerExpire = () => {
    let seconds = child.current?.getMinuteandSeconds();
    child.current.pauseTimer();
    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));
    setNextQuestion();
    setInCorrAns(inCorrAns + 1);
  };

  const handleTimerReset = () => {
    timerResetClicked.current = true;
    child.current.resetTimer();
  };

  return (
    <React.Fragment>
      <QuestionTopSection
        corrAns={corrAns}
        inCorrAns={inCorrAns}
        currentQuestion={currentQuestion}
        questions={questions}
        showAnswers={true}
        timerSeconds={timerSeconds}
        onTimerExpire={onTimerExpire}
        ref={child}
      />

      <QuestionMiddleSectionOptions
        questions={questions}
        currentQuestion={currentQuestion}
        setAnswerStatusClass={setAnswerStatusClass}
        handleAnswerOptionClick={handleAnswerOptionClick}
        probability={true}
        latex={true}
      />

      {showLifeLine ? (
        <>
          <Lifelines
            handleFiftFifty={handleFiftyFifty}
            handleAudiencePoll={handleAudiencePoll}
            handleResetTime={handleTimerReset}
            handleSkipQuestion={handleSkipQuestion}
            currentquestions={questions[currentQuestion]}
            showFiftyFifty={
              questions[currentQuestion]["question_type"] == 2 ? false : true
            }
            audiencepoll={
              questions[currentQuestion]["question_type"] == 2 ? false : true
            }
            totalQuestions={questions.length}
          />
        </>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

DailyQuizQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

DailyQuizQuestions.defaultProps = {
  showLifeLine: true,
};

export default withTranslation()(DailyQuizQuestions);
