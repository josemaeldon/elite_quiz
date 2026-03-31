"use client";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  decryptAnswer,
  imgError,
  audioPlayGuessthework,
  getImageSource,
} from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import Skeleton from "react-loading-skeleton";
import {
  getTotalNumOfHint,
  LoadQuizZoneCompletedata,
  percentageSuccess,
  questionsDataSuceess,
  ResetTotalNumOfHint,
  selecttempdata,
  setQuizResultData,
  setTotalNumOfHint,
} from "@/store/reducers/tempDataSlice";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import {
  setSecondSnap,
  setTotalSecond,
} from "@/store/reducers/showRemainingSeconds";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { t } from "@/utils";
import {
  getUserCoinsApi,
  setQuizCoinScoreApi,
  setUserCoinScoreApi,
} from "@/api/apiRoutes";
const GuessthewordQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
  isBookmarkPlay,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [corrAns, setCorrAns] = useState(0);
  const [inCorrAns, setInCorrAns] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [useHint, setUseHint] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const child = useRef(null);
  const answerOptionClicked = useRef(false);

  // start of logic guess the word
  const [random, setRandom] = useState();

  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  // store data get
  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  const dispatch = useDispatch();

  const Score = useRef(0);

  const guess_the_word_hint_deduct_coin =
    systemconfig?.guess_the_word_hint_deduct_coin;

  const guess_the_word_max_hints_counter =
    systemconfig?.guess_the_word_max_hints;

  let getData = useSelector(selecttempdata);

  useEffect(() => {
    let decryptedAnswer = ""; // Default value

    if (questions[currentQuestion]?.answer) {
      // Check if 'ciphertext' exists
      if (questions[currentQuestion].answer.ciphertext) {
        // Decrypt the answer
        decryptedAnswer = decryptAnswer(
          questions[currentQuestion].answer,
          userData?.data?.firebase_id
        );
      } else {
        // Use the answer as is
        decryptedAnswer = questions[currentQuestion].answer;
      }
    }
    // Update the state with the decrypted or original answer
    setAnswer(decryptedAnswer);
  }, [questions, currentQuestion, decryptAnswer, userData]);

  // Reset submit button when question changes
  useEffect(() => {
    setIsSubmitDisabled(false);
  }, [currentQuestion]);

  const shuffle = (arr) => {
    for (let i = arr?.length - 1; i > 0; i--) {
      let temp = arr[i];
      let j = Math.floor(Math.random() * (i + 1));
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  };

  useEffect(() => {
    setRandom(
      shuffle(
        answer
          .toUpperCase()
          .split("")
          .map((val, i) => {
            return { value: val === " " ? "_" : val, ansIndex: i };
          })
      )
    );

    setInput(
      answer
        .toUpperCase()
        .split("")
        .map((val) => {
          return { value: "", index: null };
        })
    );
  }, [answer]);

  //array to string convert
  const arrtostr = () => {
    let str = input.map((obj) => {
      return obj.value;
    });
    let newstr = str.join("");
    return newstr;
  };
  //focus input
  const useActiveElement = () => {
    const [active, setActive] = useState(document.activeElement);
    const handleFocusIn = (e) => {
      setActive(document.activeElement);
    };
    useEffect(() => {
      document.addEventListener("focusin", handleFocusIn);
      return () => {
        document.removeEventListener("focusin", handleFocusIn);
      };
    }, []);
    return active;
  };

  //focus states and input states
  const focusedElement = useActiveElement();
  const [actIndex, setActIndex] = useState(0);
  const [news, setNew] = useState(false);
  const [hintDisabled, setHintDisabled] = useState(1);
  const coninsUpdate = userData && userData?.data?.coins;
  const totalNumOfHint = useSelector(getTotalNumOfHint);
  // Check if all inputs are filled
  const areAllInputsFilled = () => {
    return input.every((item) => item.value !== "");
  };

  // Update hint button disabled state based on inputs
  useEffect(() => {
    const hintButton = document.getElementById("hntBtn");
    if (useHint) {
      setIsDisabled(true);
    }
    if (hintButton && !useHint) {
      areAllInputsFilled() ? setIsDisabled(true) : setIsDisabled(false);
    }
  }, [input, isDisabled]);

  //focus useeffect
  useEffect(() => {
    if (focusedElement) {
      focusedElement.value;
      const val = parseInt(focusedElement.getAttribute("data-index"));
      if (!isNaN(val) && val !== null) {
        setActIndex(val);
      }
    }
  }, [focusedElement]);

  useEffect(() => {
    if (actIndex < 0) {
      setActIndex(0);
    }
    if (actIndex > answer?.length) {
      setActIndex(answer?.length - 1);
    }
    if (document.querySelector(`[data-index="${actIndex}"]`) != null) {
      document.querySelector(`[data-index="${actIndex}"]`).focus();
    }
  }, [actIndex]);

  // input field data
  const inputfield = () => {
    setNew((prevState) => false);
  };

  const buttonAnswer = (e, item, btnId) => {
    if (input === null) {
      return;
    }
    let newVal = input;
    
    // If actIndex is out of bounds, find first empty input or reset to 0
    let currentIndex = actIndex;
    if (currentIndex < 0 || currentIndex >= newVal.length || !newVal[currentIndex]) {
      // Find first empty input
      const firstEmptyIndex = newVal.findIndex(item => item.value === "");
      currentIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      setActIndex(currentIndex);
    }
    
    if (newVal[currentIndex].value !== "") {
      const btnElement = document.getElementById(`btn-${newVal[currentIndex].index}`);
      if (btnElement) {
        btnElement.disabled = false;
      }
    }
    newVal[currentIndex].value = item;

    newVal[currentIndex].index = btnId;
    document.getElementById(`btn-${btnId}`).disabled = true;
    const index = currentIndex;
    setActIndex(index + 1);
    setInput((prevState) => [...newVal]);
    setNew((prevState) => true);
  };

  // back button input clear
  const backinputclear = (e) => {
    e.preventDefault();
    let newVal = input;
    if (news) {
      newVal[actIndex - 1].value = "";
      const buttonElement = document.getElementById(
        `btn-${newVal[actIndex - 1].index}`
      );
      if (buttonElement) {
        buttonElement.disabled = false;
      }
      setNew((prevState) => false);
      newVal[actIndex - 1].value = "";
    } else {
      const buttonElement = document.getElementById(
        `btn-${newVal[actIndex].index}`
      );
      if (buttonElement) {
        buttonElement.disabled = false;
      }
      newVal[actIndex].value = "";
    }
    setActIndex((prevState) => prevState - 1);
    setInput((prevState) => [...newVal]);
  };

  //random number for hint
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // handle hints
  const handleHints = (e) => {
    let coins =
      guess_the_word_hint_deduct_coin &&
      Number(guess_the_word_hint_deduct_coin);
    if (coninsUpdate === "0") {
      toast.error(t("no_enough_coins"));
      return false;
    }
    if (userData?.data?.coins < coins) {
      toast.error(t("no_enough_coins"));
      return false;
    }

    let enabledBtnId = new Array();
    random.map((item, i) => {
      const inputElement = document.getElementById(`input-${i}`);
      if (inputElement && inputElement.value === "") {
        enabledBtnId.push(i);
      }
    });
    let ind = null;
    if (enabledBtnId?.length != 0) {
      ind = shuffle(enabledBtnId)[0];
    }
    random.map((val, i) => {
      if (val.ansIndex == ind) {
        const btnElement = document.getElementById(`btn-${i}`);
        if (btnElement && !btnElement.disabled) {
          val.ansIndex, btnElement.innerText;
          let newVal = input;
          newVal[val.ansIndex].value = btnElement.innerText;
          newVal[val.ansIndex].index = i;
          const index = val.ansIndex;
          btnElement.disabled = true;
          setActIndex(index + 1);
          setInput((prevState) => [...newVal]);
          setNew((prevState) => true);

          // button disabled
          setHintDisabled(hintDisabled + 1);
          setTotalNumOfHint(1);

          hintDisabled >= Number(guess_the_word_max_hints_counter)
            ? setUseHint(true)
            : setUseHint(false);

          if (userData?.data?.coins < coins) {
            toast.error(t("no_enough_coins"));
            return false;
          }

          const deductCoins = async () => {
            const response = await setUserCoinScoreApi({
              coins: "-" + coins,
              title: "used_guesstheword_hint",
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
              }
            }

            return response;
          };
          deductCoins();
        }
      }
    });
  };

  //clear all input
  const clearallInput = () => {
    let v = input;
    v = v.map((obj) => {
      if (obj.index !== null) {
        const buttonElement = document.getElementById(`btn-${obj.index}`);
        if (buttonElement) {
          buttonElement.disabled = false;
        }
      }
      return { ...obj, value: "" };
    });
    setInput((prevState) => v);
    setActIndex(0);
  };

  const handleSubmit = () => {
    setIsSubmitDisabled(true); // Disable submit button immediately
    let inputstr = arrtostr().replace(/_/g, " ");
    setHintDisabled(0);
    document.getElementById("hntBtn").disabled = false;
    clearallInput();
    guessthewordCheck(inputstr);
    let seconds = child.current?.getMinuteandSeconds();

    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));
  };

  // end of logic guess the word

  setTimeout(() => {
    setQuestions(data);
  }, 500);

  const setNextQuestion = async (update_questions) => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
      {
        child.current !== null && child.current.resetTimer();
      }
      clearallInput();
    } else {
      // Check if guessthewordCheck was executed
      if (!answerOptionClicked.current) {
        dispatch(questionsDataSuceess(questions));
      }

      const questionsForApi = update_questions?.map((item) => ({
        id: item.id,
        answer: item.selected_answer,
      }));

      const response = await setQuizCoinScoreApi({
        quiz_type: 3,
        category: questions[currentQuestion].category,
        subcategory: questions[currentQuestion].subcategory,
        play_questions: JSON.stringify(questionsForApi),
        no_of_hint_used: totalNumOfHint,
      });

      if (!response?.error) {
        setQuizResultData(response?.data);
        ResetTotalNumOfHint();
      } else {
        console.log(response);
      }

      await onQuestionEnd();
    }
  };

  //guesstheword answer click
  const guessthewordCheck = (selected_option) => {
    answerOptionClicked.current = true;

    let { id, answer } = questions[currentQuestion];
    let decryptedAnswer = decryptAnswer(
      answer,
      userData?.data?.firebase_id
    ).toUpperCase();
    let result_score = Score.current;
    if (decryptedAnswer === selected_option) {
      result_score++;
      Score.current = result_score;
      setCorrAns(corrAns + 1);
      toast.success(t("correct_answer"));
    } else {
      toast.error(t("incorrect_answer"));
      setInCorrAns(inCorrAns + 1);
    }

    // this for only audio
    const currentIndex = currentQuestion;

    const currentQuestionq = questions[currentIndex];

    audioPlayGuessthework(selected_option, currentQuestionq.answer);

    let seconds = child.current.getTimerSeconds();

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

    checktotalQuestion(update_questions);
    setQuestions(update_questions);
    setTimeout(() => {
      setNextQuestion(update_questions);
    }, 1000);

    dispatch(percentageSuccess(result_score));
    onOptionClick(update_questions, result_score);
    dispatch(questionsDataSuceess(update_questions));
  };

  const onTimerExpire = () => {
    let { id } = questions[currentQuestion];
    let seconds = child.current?.getMinuteandSeconds();
    child.current.pauseTimer();
    dispatch(setTotalSecond(timerSeconds));
    dispatch(setSecondSnap(seconds));
    let update_questions = questions.map((data) => {
      return data?.id === id
        ? { ...data, selected_answer: "", isAnswered: true }
        : data;
    });
    setQuestions(update_questions);
    setTimeout(() => {
      setNextQuestion(update_questions);
    }, 1000);
    setInCorrAns(inCorrAns + 1);
  };

  // super sonic badge logic
  const checktotalQuestion = (update_question) => {
    if (questions?.length < 5) {
      return;
    }

    const allTimerSeconds = update_question
      .map((quizDataObj) => {
        // Skip if timer_seconds is undefined or null
        if (!quizDataObj?.timer_seconds) return null;

        try {
          // If timer_seconds is already a number, use it directly
          if (typeof quizDataObj.timer_seconds === "number") {
            return quizDataObj.timer_seconds;
          }

          // If it's a string, try to parse it
          if (typeof quizDataObj.timer_seconds === "string") {
            const timeParts = quizDataObj.timer_seconds.split(":");
            if (timeParts.length !== 3) return null;

            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;

            return hours * 3600 + minutes * 60 + seconds;
          }

          return null;
        } catch (error) {
          console.error("Error processing timer:", error);
          return null;
        }
      })
      .filter((seconds) => seconds !== null);
  };
  // for update correct and incorrect ans in redux
  useEffect(() => {
    const queEnddatacorrect = corrAns;
    const queEnddataIncorrect = inCorrAns;

    LoadQuizZoneCompletedata(queEnddatacorrect, queEnddataIncorrect);
  }, [corrAns, inCorrAns]);

  function handleBookmarkSubmit() {
    let inputstr = arrtostr().replace(/_/g, " ");
    let inputAns = inputstr.toUpperCase().replaceAll(/\s/g, "");
    let answer = questions[currentQuestion].answer
      .toUpperCase()
      .replaceAll(/\s/g, "");
    if (inputAns === answer) {
      toast.success(t("correct_answer"));
    } else {
      toast.error(t("incorrect_answer"));
    }
    setHintDisabled(0);
    clearallInput();
    setNextQuestion();
  }

  return (
    <>
      {!isBookmarkPlay && (
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
      )}
      <div className="morphisam mb-6 darkSecondaryColor">
        <div className="text-center py-4">
          <p className="question-text py-4">
            {questions[currentQuestion].question}
          </p>
        </div>

        {questions[currentQuestion].image ? (
          <div className="flex-center m-auto mb-4">
            <img
              className="h-80 max-w-full max-h-full mb-3 object-contain rounded-[5px]"
              src={getImageSource(questions[currentQuestion].image)}
              onError={imgError}
              alt="Error Image"
            />
          </div>
        ) : (
          ""
        )}

        {loading ? (
          <div className="text-center">
            <Skeleton count={5} className="skeleton" />
          </div>
        ) : (
          <>
            {/* {showAnswers ? ( */}
            <div className="flex-center flex-col">
              <span className="flex-center flex-wrap">
                {random && 
                  random.map((data, index) => {
                    return (
                      <input
                        key={index}
                        data-index={index}
                        type="text"
                        value={input[index]?.value || ""}
                        id={`input-${index}`}
                        onClick={() => inputfield()}
                        className=" darkSecondaryColor w-16 h-[60px] mb-3 text-center rounded relative mr-5 border-[#e3e3e3] text-base font-bold text-text-color"
                        readOnly
                      />
                    );
                  })}
              </span>
              <div className="w-full my-4">
                <ul className="w-full flex-center !p-0 flex-wrap">
                  {random ? (
                    random.map((item, i) => {
                      return (
                        <li key={i}>
                          <button
                            className="w-12 h-12 bg-primary-color text-white rounded border-transparent mr-5 mb-3"
                            id={`btn-${i}`}
                            onClick={(e) => buttonAnswer(e, item?.value, i)}
                          >
                            {item?.value}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <div className="text-center">
                      <Skeleton count={5} className="skeleton" />
                    </div>
                  )}
                </ul>
              </div>
              <div className="divider py-0">
                <hr
                  style={{
                    width: "112%",
                    backgroundColor: "gray",
                    height: "2px",
                  }}
                />
              </div>
              {!isBookmarkPlay && (
                <div className="flex justify-evenly w-full flex-col sm:flex-row ">
                  <div className=" mb-2">
                    <button
                      className="lifelinebtn "
                      onClick={(e) => backinputclear(e)}
                    >
                      {t("back")}
                    </button>
                  </div>
                  <div className=" mb-2">
                    <button
                      id="hntBtn"
                      className="lifelinebtn "
                      disabled={isDisabled}
                      onClick={(e) => handleHints(e)}
                    >
                      {t("hint")}
                    </button>
                  </div>
                  <div className=" mb-2">
                    <button
                      className="lifelinebtn "
                      onClick={() => handleSubmit()}
                      disabled={isSubmitDisabled}
                    >
                      {t("submit")}
                    </button>
                  </div>
                </div>
              )}
              {isBookmarkPlay && (
                <div className="bottom_button dashoptions mb-4 guessTheWordOtions">
                  <button
                    className="lifelinebtn "
                    onClick={() => handleBookmarkSubmit()}
                  >
                    {t("submit")}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

GuessthewordQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(GuessthewordQuestions);
