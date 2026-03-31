"use client";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { getBookmarkData, decryptAnswer, getImageSource } from "@/utils/index";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  LoadQuizZoneCompletedata,
  percentageSuccess,
  questionsData,
  questionsDataSuceess,
  resultTempDataSuccess,
  selecttempdata,
  setQuizResultData,
} from "@/store/reducers/tempDataSlice";
import QuestionTopSection from "@/components/view/common/QuestionTopSection.jsx";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import { t } from "@/utils/index";
import SelectQuestionMiddleSection from "@/components/Quiz/MultiMatch/SelectQuestionMiddleSection";
import Layout from "@/components/Layout/Layout.jsx";
import { useRouter } from "next/router";
import rightTickIcon from "@/assets/images/check-circle-score-screen.svg";
import crossIcon from "@/assets/images/x-circle-score-screen.svg";
import {
  getMultiMatchQuestionByLevelApi,
  getMultiMatchQuestionsApi,
  setQuizCoinScoreApi,
} from "@/api/apiRoutes";

const ArrangeQuestion = () => {
  const router = useRouter();
  let getData = useSelector(selecttempdata);
  const updatedQuestionsData = useSelector(questionsData);
  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const [level, setLevel] = useState(1);
  const [isFunctionCalled, setIsFunctionCalled] = useState(false);
  const [hasLevel, setHasLevel] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [update_questions, setUpdate_questions] = useState(questions);
  const [selectedoptions, setSelectedoptions] = useState([]);

  const [isAnswerd, setIsAnswerd] = useState(false);
  const [selOpt, setSelOpt] = useState(false);

  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);

  const child = useRef(null);
  const answerOptionClicked = useRef(false);

  const systemconfig = useSelector(sysConfigdata);

  const dispatch = useDispatch();

  const Score = useRef(0);

  const navigate = useRouter();

  // store data get
  const userData = useSelector((state) => state.User);

  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  const [isSelectAns, setIsSelectAns] = useState(false);
  const [decryptedAnswers, setDecryptedAnswers] = useState([]);

  useEffect(() => {
    if (!navigate.isReady) return;

    const queryHasLevel = navigate.query.hasLevel;

    if (queryHasLevel === "0" || queryHasLevel === 0) {
      // No levels - call getMultiMatchQuestionsApi
      setHasLevel(false);
      getQuestionsWithoutLevel();
    } else if (getData) {
      // Has levels - fetch questions normally
      setHasLevel(true);
      getNewQuestions(getData.category, getData.subcategory, getData.level);
    }
  }, [navigate.isReady, navigate.query.hasLevel]);

  // Fetch questions when has_level === 0
  const getQuestionsWithoutLevel = async () => {
    const isSubcategory = navigate.query.isSubcategory === "1";
    const type = isSubcategory ? "subcategory" : "category";
    const id = isSubcategory
      ? navigate.query.subcategory_id
      : navigate.query.category_id;

    const response = await getMultiMatchQuestionsApi({
      type: type,
      id: id,
    });

    if (!response?.error && response?.data?.length > 0) {
      let bookmark = getBookmarkData();
      let questions_ids = Object.keys(bookmark).map((index) => {
        return bookmark[index].question_id;
      });
      let questions = response.data.map((data) => {
        let isBookmark = questions_ids.indexOf(data?.id) >= 0;

        return {
          ...data,
          isBookmarked: isBookmark,
          selected_answer: "",
          isAnswered: false,
        };
      });

      setQuestions(questions);
      setUpdate_questions(questions);
    } else {
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }
  };

  // Fetch questions when has_level === 1 (existing flow)
  const getNewQuestions = async (category_id, subcategory_id, level) => {
    setLevel(level);
    const response = await getMultiMatchQuestionByLevelApi({
      category: category_id !== "" ? category_id : "",
      subcategory: subcategory_id !== 0 ? subcategory_id : "",
      level: level,
    });

    if (!response?.error) {
      let bookmark = getBookmarkData();
      let questions_ids = Object.keys(bookmark).map((index) => {
        return bookmark[index].question_id;
      });
      let questions = response.data.map((data) => {
        let isBookmark = false;
        if (questions_ids.indexOf(data?.id) >= 0) {
          isBookmark = true;
        } else {
          isBookmark = false;
        }

        let question = data?.question;
        let note = data?.note;

        return {
          ...data,
          //
          question: question,
          note: note,
          isBookmarked: isBookmark,
          selected_answer: "",
          isAnswered: false,
        };
      });

      setQuestions(questions);
      setUpdate_questions(questions);
    } else {
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }
  };

  useEffect(() => {
    if (questions[currentQuestion].answer_type == "1") {
      setIsSelectAns(true);
    } else if (questions[currentQuestion].answer_type == "2") {
      setIsSelectAns(false);
    }
  }, [questions, currentQuestion]);

  const selectedOptions = () => {
    if (isSelectAns) {
      let selOpt = selectedoptions.length === 0 ? [""] : selectedoptions;
      return selOpt;
    } else {
      const totalOptions = ["a", "b", "c", "d", "e"];
      const questionOptions = questions[currentQuestion].answer.length;
      const selectedOptions = totalOptions.slice(0, questionOptions);
      let selOpt =
        selectedoptions.length === 0 ? selectedOptions : selectedoptions;
      return selOpt;
    }
  };

  const setNextQuestion = async () => {
    setIsFunctionCalled(false);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions?.length) {
      setDecryptedAnswers([]);
      setCurrentQuestion(nextQuestion);
      child?.current?.resetTimer();
    } else {
      dispatch(questionsDataSuceess(update_questions));

      await onQuestionEnd();
    }
  };

  // button option answer check
  const checkAnswer = async () => {
    if (isFunctionCalled) {
      return;
    }
    setIsFunctionCalled(true);
    answerOptionClicked.current = true;
    let latestUpdateQuestions = null;
    let seconds = child.current?.getMinuteandSeconds();
    child.current.pauseTimer();
    dispatch(setTotalSecond(TIMER_SECONDS));
    dispatch(setSecondSnap(seconds));

    let result_score = Score.current;
    let correct = [];
    setIsAnswerd(true);
    let selOpt = selectedOptions();
    let decryptedAnsArr = [];
    questions[currentQuestion].answer?.map((data) => {
      decryptedAnsArr.push(decryptAnswer(data, userData?.data?.id));
    });
    setDecryptedAnswers([...decryptedAnsArr]);
    if (isSelectAns) {
      let { id } = questions[currentQuestion];

      let updatedQuestions = update_questions.map((data) => {
        return data.id === id
          ? {
              ...data,
              selected_answer: selOpt,
              isAnswered: selectedoptions?.length > 0 ? true : false,
            }
          : data;
      });
      setUpdate_questions(updatedQuestions);
      latestUpdateQuestions = updatedQuestions;

      const isCorrect =
        selectedoptions.length === decryptedAnsArr.length &&
        selectedoptions.every((option) => decryptedAnsArr.includes(option)) &&
        decryptedAnsArr.every((answer) => selectedoptions.includes(answer));

      if (isCorrect) {
        result_score++;
        Score.current = result_score;
        setCorrAns(corrAns + 1);
      } else {
        setInCorrAns(inCorrAns + 1);
      }
    } else {
      decryptedAnsArr?.map((data, index) => {
        if (data === selOpt[index]) {
          correct.push(data);
        }
      });

      if (correct.length === decryptedAnsArr?.length) {
        result_score++;
        Score.current = result_score;
        setCorrAns(corrAns + 1);
      } else {
        setInCorrAns(inCorrAns + 1);
      }

      let { id } = questions[currentQuestion];

      let updatedQuestions = update_questions.map((data) => {
        return data.id === id
          ? {
              ...data,
              selected_answer: selOpt,
              isAnswered: selOpt?.length > 0 ? true : false,
            }
          : data;
      });
      setUpdate_questions(updatedQuestions);
      latestUpdateQuestions = updatedQuestions;
    }

    dispatch(percentageSuccess(result_score));

    const nextQuestionForApi = currentQuestion + 1;
    if (nextQuestionForApi == questions?.length) {
      // function for apiQuestions
      const questionsForApi = latestUpdateQuestions?.map((item) => ({
        id: item.id,
        answer:
          item.selected_answer.length > 0
            ? isSelectAns
              ? item.selected_answer.sort().join(",")
              : item.selected_answer.join(",")
            : "",
      }));

      const response = await setQuizCoinScoreApi({
        quiz_type: "6",
        category: questions[currentQuestion].category,
        subcategory: questions[currentQuestion].subcategory,
        play_questions: JSON.stringify(questionsForApi),
      });

      if (!response?.error) {
        setQuizResultData(response.data);
      } else {
        console.log(response);
      }
    }
  };

  useEffect(() => {
    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;
    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect);
  }, [corrAns, inCorrAns]);

  // option answer status check

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

  const onTimerExpire = () => {
    let seconds = child.current?.getMinuteandSeconds();
    child.current.pauseTimer();
    dispatch(setTotalSecond(TIMER_SECONDS));
    dispatch(setSecondSnap(seconds));
    let result_score = Score.current;
    setInCorrAns(inCorrAns + 1);
    setIsAnswerd(true);
    let selOpt = selectedOptions();

    // Sequence Question
    let { id } = questions[currentQuestion];
    let updatedQuestions = update_questions.map((data) => {
      return data.id === id
        ? { ...data, selected_answer: selOpt, isAnswered: false }
        : data;
    });
    setUpdate_questions(updatedQuestions);
    dispatch(percentageSuccess(result_score));
    checkAnswer();
  };

  const TIMER_SECONDS = Number(systemconfig.multi_match_duration);

  const onQuestionEnd = async () => {
    const tempData = {
      currentLevel: hasLevel ? level : null,
      maxLevel: hasLevel ? getData?.maxLevel : null,
      querylevel: navigate.query.level,
      showQuestions: true,
      reviewAnswer: true,
      playAgain: true,
      nextlevel: hasLevel, // Only show next level button if has levels
      isPremium: getData?.isPremium,
      hasLevel: hasLevel,
      // Store these for "Play Again" navigation when hasLevel is false
      category_id: navigate.query.category_id || null,
      subcategory_id: navigate.query.subcategory_id || null,
      isSubcategory: navigate.query.isSubcategory || "0",
      catid: navigate.query.catid || null,
      subcatid: navigate.query.subcatid || null,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/multi-match-questions/result");
  };

  const handleAnswerOptionClick = (selected_option) => {
    setSelOpt(selected_option);
    if (selectedoptions.includes(selected_option)) {
      setSelectedoptions(
        selectedoptions.filter((totalOpt) => totalOpt !== selected_option)
      );
    } else {
      setSelectedoptions([...selectedoptions, selected_option]);
    }

    let { id } = questions[currentQuestion];

    let update_questions = questions.map((data) => {
      return data.id === id
        ? { ...data, selected_answer: selectedoptions, isAnswered: true }
        : data;
    });
  };

  let count = 0;
  const setAnswerStatusClass = (option) => {
    if (!isSelectAns) {
      if (isAnswerd) {
        if (option === decryptedAnswers[count]) {
          // Compare with decrypted answers
          count++;
          return "!border !border-green-600 !border-[2px]";
        } else {
          count++;
          return "!border !border-red-600 !border-[2px]";
        }
      } else {
        return false;
      }
    }

    if (selectedoptions && isAnswerd) {
      if (decryptedAnswers.includes(option)) {
        // Check if option exists in decrypted answers
        return "!border !border-green-600 !border-[2px]";
      } else if (
        !decryptedAnswers.includes(option) &&
        selectedoptions.includes(option)
      ) {
        return "!border !border-red-600 !border-[2px]";
      } else {
        return false;
      }
    }

    if (selectedoptions && !isAnswerd) {
      if (systemconfig && systemconfig.answer_mode === "1") {
        // Additional logic if needed for "answer_mode"
      }
      if (selectedoptions.includes(option)) {
        return "border border-theme !border-[2px]";
      } else {
        return false;
      }
    }
  };

  const nextQuestion = () => {
    if (questions?.length != currentQuestion + 1) {
      setIsAnswerd(false);
      setSelectedoptions([]);
    }

    setTimeout(() => {
      setNextQuestion();
    }, 1000);
  };
  const rightWrongIcon = (option) => {
    if (isAnswerd) {
      if (
        decryptedAnswers.includes(option) &&
        selectedoptions.includes(option)
      ) {
        return (
          <img
            src={getImageSource(rightTickIcon.src)}
            className="right_wrong_ans"
            alt="rightTickIcon"
          />
        );
      } else if (
        !decryptedAnswers.includes(option) &&
        selectedoptions.includes(option)
      ) {
        return (
          <img
            src={getImageSource(crossIcon.src)}
            className="right_wrong_ans"
            alt="crossIcon"
          />
        );
      } else if (
        decryptedAnswers.includes(option) &&
        !selectedoptions.includes(option)
      ) {
        return (
          <img
            src={getImageSource(crossIcon.src)}
            className="right_wrong_ans"
            alt="crossIcon"
          />
        );
      } else if (
        !decryptedAnswers.includes(option) &&
        !selectedoptions.includes(option)
      ) {
        return false;
      }
    }
  };
  const arrangedOptions = (option) => {
    setSelectedoptions(option);
  };

  return (
    <React.Fragment>
      <Layout>
        <div className="dashboard">
          <div className="container">
            <QuestionTopSection
              corrAns={corrAns}
              inCorrAns={inCorrAns}
              currentQuestion={currentQuestion}
              questions={questions}
              showAnswers={true}
              showQuestions={true}
              timerSeconds={TIMER_SECONDS}
              onTimerExpire={onTimerExpire}
              ref={child}
              isQuiz={true}
            />
            <SelectQuestionMiddleSection
              questions={questions}
              currentQuestion={currentQuestion}
              setAnswerStatusClass={setAnswerStatusClass}
              handleAnswerOptionClick={handleAnswerOptionClick}
              isAnswerd={isAnswerd}
              checkAnswer={checkAnswer}
              nextQuestion={nextQuestion}
              isSelectAns={isSelectAns}
              arrangedOptions={arrangedOptions}
              rightWrongIcon={rightWrongIcon}
              decryptedAnswers={decryptedAnswers}
            />
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

ArrangeQuestion.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

ArrangeQuestion.defaultProps = {
  showLifeLine: true,
};

export default withTranslation()(ArrangeQuestion);
