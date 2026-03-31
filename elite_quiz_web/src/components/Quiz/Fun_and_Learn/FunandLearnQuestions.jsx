import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  decryptAnswer,
  showAnswerStatusClass,
  audioPlay,
  convertTimeToSeconds,
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
import { currentAppLanguage } from "@/store/reducers/languageSlice";
const FunandLearnQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
  showQuestions,
}) => {
  const [questions, setQuestions] = useState(data);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentQuestionApi, setCurrentQuestionApi] = useState(0);
  const child = useRef(null);
  const [questionCount, setQuestionCount] = useState(0);

  const systemconfig = useSelector(sysConfigdata);

  const answerOptionClicked = useRef(false);
  // store data get
  const userData = useSelector((state) => state.User);

  const Score = useRef(0);

  const dispatch = useDispatch();

  let getData = useSelector(selecttempdata);

  const system_language_id = useSelector(currentAppLanguage);

  setTimeout(() => {
    setQuestions(data);
  }, 800);

  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  const setNextQuestion = async (update_questions) => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
      child?.current?.resetTimer();
    } else {
      const questionsForApi = update_questions?.map((item) => ({
        id: item.id,
        answer: item.selected_answer,
      }));
      const total_play_time = convertTimeToSeconds(
        child?.current?.getMinuteandSeconds()
      );
      const response = await setQuizCoinScoreApi({
        quiz_type: 2,
        category: questions[currentQuestion].category,
        subcategory: questions[currentQuestion].subcategory,
        play_questions: JSON.stringify(questionsForApi),
        total_play_time: total_play_time,
      });

      if (!response?.error) {
        setQuizResultData(response?.data);
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

      audioPlay(selected_option, currentQuestionq.answer);

      let seconds = child.current?.getMinuteandSeconds();

      let update_questions = questions.map((data) => {
        return data.id === id
          ? {
              ...data,
              selected_answer: selected_option,
              isAnswered: true,
              timer_seconds: seconds,
            }
          : data;
      });
      setCurrentQuestionApi(update_questions);

      let snap = update_questions[questionCount].timer_seconds;
      dispatch(setSecondSnap(snap));

      setQuestionCount((pre) => pre + 1);
      // checktotalQuestion(update_questions);
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
    let seconds = child.current?.getMinuteandSeconds();
    child?.current?.pauseTimer();
    dispatch(setTotalSecond(timerSeconds));
    
    dispatch(setSecondSnap(seconds));

    let update_questions = questions.map((data) => {
      return data.id === id
        ? {
            ...data,
            selected_answer: "",
            isAnswered: true,
            timer_seconds: seconds,
          }
        : data;
    });

    setQuestionCount((pre) => pre + 1);
    setQuestions(update_questions);
    dispatch(questionsDataSuceess(update_questions));
    setTimeout(() => {
      setNextQuestion(update_questions);
    }, 1000);
    setInCorrAns(inCorrAns + 1);
  };

  // for update correct and incorrect ans in redux
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
        showQuestions={showQuestions}
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

FunandLearnQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(FunandLearnQuestions);
