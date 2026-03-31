"use client";
import { useState, useRef, useEffect } from "react";
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
import QuestionMiddleSectionOptions from "@/components/view/common/QuestionMiddleSectionOptions";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import {
  setQuizCoinScoreApi,
} from "@/api/apiRoutes";

const TrueandFalseQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const child = useRef(null);
  const scroll = useRef(null);
  const answerOptionClicked = useRef(false);

  const dispatch = useDispatch();

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
      child.current.resetTimer();
    } else {

      // function for apiQuestions
      let mainQuestions = update_questions?.length > 0 ? update_questions : questions;
      const questionsForApi = mainQuestions?.map((item) => ({
        id: item.id,
        answer: item.selected_answer,
      }));
      const response = await setQuizCoinScoreApi({
        // category: update_questions[0].category,
        quiz_type: "1.2",
        play_questions: JSON.stringify(questionsForApi),
      });
      if (!response?.error) {
        setQuizResultData(response.data);
      } else {
        console.log(response);
      }
      if (!answerOptionClicked.current) {
        dispatch(questionsDataSuceess(questions));
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

      let update_questions = questions.map((data) => {
        return data.id === id
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

  const onTimerExpire = () => {
    let seconds = child.current?.getMinuteandSeconds();
    child.current.pauseTimer();
    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));
    
    setNextQuestion();
    setInCorrAns(inCorrAns + 1);
  };

  return (
    <>
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
        probability={false}
        latex={true}
      />
    </>
  );
};

TrueandFalseQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

TrueandFalseQuestions.defaultProps = {
  showLifeLine: true,
  showBookmark: true,
};

export default withTranslation()(TrueandFalseQuestions);
