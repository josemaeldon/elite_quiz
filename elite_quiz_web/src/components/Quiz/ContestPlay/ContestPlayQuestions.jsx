import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  decryptAnswer,
    // calculateScore,
    // calculateCoins,
  showAnswerStatusClass,
} from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  LoadQuizZoneCompletedata,
  percentageSuccess,
  questionsDataSuceess,
  selecttempdata,
  setQuizResultData,
} from "@/store/reducers/tempDataSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import QuestionMiddleSectionOptions from "@/components/view/common/QuestionMiddleSectionOptions";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import { setQuizCoinScoreApi } from "@/api/apiRoutes";
const ContestPlayQuestions = ({
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
  let getData = useSelector(selecttempdata);

  const systemconfig = useSelector(sysConfigdata);

  setTimeout(() => {
    setQuestions(data);
  }, 500);

  const Score = useRef(0);

  const dispatch = useDispatch();

  // store data get
  const userData = useSelector((state) => state.User);

  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  const setNextQuestion = async (update_questions) => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
      child.current.resetTimer();
    } else {
      // let coins = null;
      // let userScore = null;
      // let result_score = Score.current;
      // let percentage = (100 * result_score) / questions?.length;
      
      if (!answerOptionClicked.current) {
        dispatch(questionsDataSuceess(questions));
      }
      const questionData = update_questions.map((data) => {
        return {
          id: data.id,
          answer: data.selected_answer,
        };
      });
      
      const response = await setQuizCoinScoreApi({
        quiz_type: "contest",
        play_questions: JSON.stringify(questionData),
      });
      if (response.error) {
        console.error("response", response);
      }else{
       setQuizResultData(response.data);
      }

      await onQuestionEnd();

    }
  };

  // button option answer check
  const handleAnswerOptionClick = async (selected_option) => {
    answerOptionClicked.current = true;
    
    let seconds = child.current?.getMinuteandSeconds();
    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));

    if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
      addAnsweredQuestion(currentQuestion);

      let { id, answer } = questions[currentQuestion];

      let decryptedAnswer = decryptAnswer(answer, userData?.data?.id);
      let result_score = Score.current;

      if (decryptedAnswer === selected_option) {
        result_score++;
        Score.current = result_score;
        setCorrAns(corrAns + 1);
        // rightClick.play();
      } else {
        // wrongClick.play();
        setInCorrAns(inCorrAns + 1);
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
    
    setNextQuestion(update_questions);
    setInCorrAns(inCorrAns + 1);
  };

  useEffect(() => {
    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;

    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect);
  }, [corrAns, inCorrAns]);

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
        probability={false}
        latex={false}
      />
    </React.Fragment>
  );
};

ContestPlayQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(ContestPlayQuestions);
