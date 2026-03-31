import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  decryptAnswer,
  showAnswerStatusClass,
  audioPlay,
} from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  LoadQuizZoneCompletedata,
  percentageSuccess,
  questionsDataSuceess,
  resultTempDataSuccess,
  selecttempdata,
  setQuizResultData,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/router";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import {
  setQuizCoinScoreApi,
} from "@/api/apiRoutes";
const QuestionMiddleSectionOptions = lazy(() =>
  import("@/components/view/common/QuestionMiddleSectionOptions")
);
const MathmaniaQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const child = useRef(null);
  const scroll = useRef(null);
  const answerOptionClicked = useRef(false);

  const Score = useRef(0);

  const systemconfig = useSelector(sysConfigdata);

  const dispatch = useDispatch();

  const router = useRouter();

  // store data get
  const userData = useSelector((state) => state.User);

  let getData = useSelector(selecttempdata);

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
      // Check if handleAnswerOptionClick was executed
      if (!answerOptionClicked.current) {
        dispatch(questionsDataSuceess(questions));
      }

      const questionsForApi = update_questions?.map((item) => ({
        id: item.id,
        answer: item.selected_answer,
      }));

      const response = await setQuizCoinScoreApi({
        quiz_type: 5,
        category: questions[currentQuestion].category,
        subcategory: questions[currentQuestion].subcategory,
        play_questions: JSON.stringify(questionsForApi),
      });

      if (!response?.error) {
        setQuizResultData(response?.data);
      } else {
        console.log(response);
      }
      await onQuestionEnd();

     
    }
  };

  const onQuestionEnd = async () => {
    const tempData = {
      totalQuestions: questions?.length
    };
    dispatch(resultTempDataSuccess(tempData));
    await router.push("/math-mania/result");
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
        return data?.id === id
          ? { ...data, selected_answer: selected_option, isAnswered: true }
          : data;
      });
      setQuestions(update_questions);
      setTimeout(async () => {
        await setNextQuestion(update_questions);
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
    let seconds = child.current?.getMinuteandSeconds();
    child.current.pauseTimer();
    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));
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

      <Suspense  fallback={<QuestionSkeleton />}>
        <QuestionMiddleSectionOptions
          questions={questions}
          currentQuestion={currentQuestion}
          setAnswerStatusClass={setAnswerStatusClass}
          handleAnswerOptionClick={handleAnswerOptionClick}
          probability={false}
          latex={true}
          math={true}
        />
      </Suspense>
    </React.Fragment>
  );
};

MathmaniaQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(MathmaniaQuestions);
