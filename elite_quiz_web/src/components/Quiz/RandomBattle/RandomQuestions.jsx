import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  decryptAnswer,
  calculateScore,
  showAnswerStatusClass,
  audioPlay,
  getImageSource,
  convertTimeToSeconds,
} from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import {
  groupbattledata,
  LoadGroupBattleData,
} from "@/store/reducers/groupbattleSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
import rightTickIcon from "@/assets/images/check-circle-score-screen.svg";
import {
  percentageSuccess,
  questionsDataSuceess,
  setBattleResultData,
} from "@/store/reducers/tempDataSlice";
import { t } from "@/utils";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import QuestionMiddleSectionOptions from "@/components/view/common/QuestionMiddleSectionOptions";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import RoundTimer from "../../Common/RoundTimer";
import Image from "next/image";
import ShowMessagePopUp from "@/components/messagePopUp/ShowMessagePopUpBtn";
import {
  getUserCoinsApi,
  setUserCoinScoreApi,
  setQuizCoinScoreApi,
} from "@/api/apiRoutes";
import { usePathname } from "next/navigation";
const MySwal = withReactContent(Swal);

const RandomQuestions = ({
  questions: data,
  timerSeconds,
  onOptionClick,
  onQuestionEnd,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playwithrobot, setPlaywithrobot] = useState(false);
  const [msgData, setMsgData] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [user1Id, setUser1Id] = useState();
  const [user2Id, setUser2Id] = useState();
  const [battleUserData, setBattleUserData] = useState([]);
  const battleEmojiSeconsd =
    process.env.NEXT_PUBLIC_BATTLE_EMOJI_TEXT_MILI_SECONDS;
  const dispatch = useDispatch();
  const answerOptionClicked = useRef(false);

  const navigate = useRouter();

  const pathname = usePathname();

  const Score = useRef(0);

  const user1timer = useRef(null);

  const user2timer = useRef(null);

  const scroll = useRef(null);

  const leftFormatedData = useRef({});
  const leftRoomId = useRef({});
  const leftBattleroom = useRef({});
  const resultNavigation = useRef(true);
  const showPopup = useRef(true);


  const db = getFirestore();

  // store data get
  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  const groupBattledata = useSelector(groupbattledata);


  const [answeredQuestions, setAnsweredQuestions] = useState({});

  let user1image = groupBattledata.user1image;
  let user2image = groupBattledata.user2image;

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };
  useEffect(() => {}, [questions]);
  //firestore adding answer in doc
  let battleRoomDocumentId = groupBattledata.roomID;

  useEffect(() => {
    const alreadySaved = localStorage.getItem("saveDocIdSave");
  
    if (!alreadySaved && battleRoomDocumentId) {
      localStorage.setItem("battleRoomDocumentId", battleRoomDocumentId);
      localStorage.setItem("saveDocIdSave", "true");
    }
  }, [battleRoomDocumentId]);

  // delete battle room
  const deleteBattleRoom = async (documentId) => {
    // Add a flag to prevent multiple deletions
    if (window.isDeletingRoom) return;
    
    if (documentId) {
      try {
        window.isDeletingRoom = true;
        await deleteDoc(doc(db, "battleRoom", documentId));
        window.isDeletingRoom = false;
      } catch (error) {
        window.isDeletingRoom = false;
        toast.error(error);
      }finally{
        localStorage.removeItem("saveDocIdSave");
        localStorage.removeItem("battleRoomDocumentId");
      }
    }
  };

  // next questions
  const setNextQuestion = async () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      if (!answerOptionClicked.current) {
        dispatch(questionsDataSuceess(questions));
      }

      await onQuestionEnd();
      // Only delete if we're actually ending the game
      if (!window.isLeaving) {
        deleteBattleRoom(battleRoomDocumentId);
        
        
      }
    }
  };

  // button option answer check
  const handleAnswerOptionClick = async (selected_option) => {
    answerOptionClicked.current = true;

    if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
      addAnsweredQuestion(currentQuestion);

      let { id, answer } = questions[currentQuestion];

      let decryptedAnswer = decryptAnswer(answer, userData?.data?.firebase_id);

      let result_score = Score.current;

      if (decryptedAnswer === selected_option) {
        result_score++;
        Score.current = result_score;
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

      submitAnswer(selected_option);

      dispatch(percentageSuccess(result_score));

      onOptionClick(update_questions, result_score);

      dispatch(questionsDataSuceess(update_questions));
    }
  };

  // auto robot submit answer
  const autoRobotClick = async () => {
    let { id, answer, question_type } = questions[currentQuestion];

    let options = [];

    if (question_type === "1") {
      options.push("a", "b", "c", "d");
    } else if (question_type === "2") {
      options.push("a", "b");
    } else if (questions[currentQuestion].optione !== "") {
      options.push("a", "b", "c", "d", "e");
    }

    const randomIdx = Math.floor(Math.random() * options?.length);
    const submittedAnswer = options[randomIdx];
    robotsubmitAnswer(submittedAnswer);
  };

  // robot submitAnser
  const robotsubmitAnswer = async (selected_option) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let user2ans = battleroom.user2.answers;

      // Push the selected option to the answers array
      user2ans.push(selected_option);

      // Update the document with the new answers array
      await updateDoc(documentRef, {
        "user2.answers": user2ans,
      });

      // Call other functions after successfully updating the document
      answercheckSnapshot();
      checkRobotpoints(selected_option);
      checkRobotCorrectAnswers(selected_option);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // point check
  const checkRobotCorrectAnswers = async (option) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let user2name = battleroom.user2.name;
      let user2image = battleroom.user2.profileUrl;
      let user2correct = battleroom.user2.correctAnswers;
      let user2uid = battleroom.user2.uid;

      // Store data in local storage to get in result screen
      LoadGroupBattleData("user2name", user2name);
      LoadGroupBattleData("user2image", user2image);
      LoadGroupBattleData("user2uid", user2uid);

      let decryptedAnswer = decryptAnswer(
        questions[currentQuestion].answer,
        userData?.data?.firebase_id
      );
      if (decryptedAnswer === option) {
        // Correct answer push
        await updateDoc(documentRef, {
          "user2.correctAnswers": user2correct + 1,
        });
      }
    } catch (error) {
      console.error("Error checking robot correct answers:", error);
    }
  };

  // storing dataa of points in localstorage
  const localStorageData = (
    user1name,
    user2name,
    user1uid,
    user2uid,
    user1image,
    user2image
  ) => {
    LoadGroupBattleData("user1name", user1name);
    LoadGroupBattleData("user2name", user2name);
    LoadGroupBattleData("user1image", user1image);
    LoadGroupBattleData("user2image", user2image);
    LoadGroupBattleData("user1uid", user1uid);
    LoadGroupBattleData("user2uid", user2uid);
  };

  const localStoragePoint = (user1point, user2point) => {
    LoadGroupBattleData("user1point", user1point);
    LoadGroupBattleData("user2point", user2point);
  };

  // submit answer
  const submitAnswer = async (selected_option) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);
      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let user1answers = battleroom.user1.answers || [];
      let user2answers = battleroom.user2.answers || [];

      // Get current time in seconds for both users
      const user1seconds = timerSeconds - (user1timer.current ? convertTimeToSeconds(user1timer.current.getMinuteandSeconds()) : 0);
      const user2seconds = timerSeconds - (user2timer.current ? convertTimeToSeconds(user2timer.current.getMinuteandSeconds()) : 0);

      const newAnswer = {
        answer: selected_option.toString(),
        id: questions[currentQuestion].id.toString(),
        second: user1seconds.toString()
      };

      const newAnswer2 = {
        answer: selected_option.toString(),
        id: questions[currentQuestion].id.toString(),
        second: user2seconds.toString()
      };

      // Answer update in document
      if (userData?.data?.id === battleroom.user1.uid) {
        user1answers.push(newAnswer);
        await updateDoc(documentRef, {
          "user1.answers": user1answers,
        });
        if (playwithrobot) {
          autoRobotClick();
        }
      } else {
        user2answers.push(newAnswer2);
        await updateDoc(documentRef, {
          "user2.answers": user2answers,
        });
      }

       // Set up real-time listener for both users' answers
       
       const unsubscribe = onSnapshot(documentRef, (doc) => {
         if (doc.exists()) {
          const updatedBattleroom = doc.data();
          const updatedUser1Answers = updatedBattleroom.user1.answers || [];
          let updatedUser2Answers = updatedBattleroom.user2.answers || [];
          // Check if both users have completed all questions
          if (updatedUser1Answers.length === questions.length && updatedUser2Answers.length === questions.length) {
            // Format bot's answers if playing with bot
            if (updatedBattleroom.playwithRobot) {
              updatedUser2Answers = updatedUser2Answers.map((answer, index) => ({
                answer: answer.toString(),
                id: questions[index].id.toString(),
                second: "0" // Bot answers are instant
              }));
            }

            // Format and set battle result data
            const formattedData = {
              user1_id: updatedBattleroom.user1.uid,
              user2_id: updatedBattleroom.user2.uid,
              user1_data: updatedUser1Answers,
              user2_data: updatedUser2Answers
            };
            // Check if playing with bot
            const isBot = updatedBattleroom.playwithRobot ? 1 : 0;

            setBattleResultData({
              quiz_type: 1.3,
              match_id: battleRoomDocumentId,
              play_questions: formattedData,
              is_bot: isBot
            });

            // Unsubscribe from the listener
            unsubscribe();
          }
        }
      });

      // Answer check
      answercheckSnapshot();

      // Points
      checkpoints(selected_option);

      // Check correct answer
      checkCorrectAnswers(selected_option);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // point check
  const checkRobotpoints = async (option) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let totalseconds = timerSeconds;
      let seconds = user1timer.current.getTimerSeconds();
      let finalScore = totalseconds - seconds;

      let user2name = battleroom.user2.name;
      let user2point = battleroom.user2.points;
      let user2uid = battleroom.user2.uid;
      let user2image = battleroom.user2.profileUrl;

      LoadGroupBattleData("user2name", user2name);
      LoadGroupBattleData("user2image", user2image);
      LoadGroupBattleData("user2uid", user2uid);
      LoadGroupBattleData("user2point", user2point);

      let decryptedAnswer = decryptAnswer(
        questions[currentQuestion].answer,
        userData?.data?.firebase_id
      );

      // if (decryptedAnswer === option) {
      //   // Point push
      //   let totalpush;
      //   if (finalScore < 2) {
      //     totalpush =
      //       Number(
      //         systemconfig?.battle_mode_random_quickest_correct_answer_extra_score
      //       ) +
      //       Number(
      //         systemconfig?.battle_mode_random_correct_answer_credit_score
      //       );
      //   } else if (finalScore === 3 || finalScore === 4) {
      //     totalpush =
      //       Number(
      //         systemconfig?.battle_mode_random_second_quickest_correct_answer_extra_score
      //       ) +
      //       Number(
      //         systemconfig?.battle_mode_random_correct_answer_credit_score
      //       );
      //   } else {
      //     totalpush = Number(
      //       systemconfig?.battle_mode_random_correct_answer_credit_score
      //     );
      //   }

      //   await updateDoc(documentRef, {
      //     "user2.points": totalpush + user2point,
      //   });
      // }
    } catch (error) {
      console.error("Error checking robot points:", error);
    }
  };

  // point check

  const checkpoints = async (option) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let totalseconds = timerSeconds;
      let seconds = 0;

      if (user1timer.current !== null) {
        seconds = user1timer.current.getTimerSeconds();
      }

      let finalScore = totalseconds - seconds;

      let user1name = battleroom.user1.name;
      let user2name = battleroom.user2.name;
      let user1point = battleroom.user1.points;
      let user2point = battleroom.user2.points;
      let user1uid = battleroom.user1.uid;
      let user2uid = battleroom.user2.uid;
      let user1image = battleroom.user1.profileUrl;
      let user2image = battleroom.user2.profileUrl;

      // Store data in local storage to get in result screen
      localStorageData(
        user1name,
        user2name,
        user1uid,
        user2uid,
        user1image,
        user2image
      );

      let decryptedAnswer = decryptAnswer(
        questions[currentQuestion].answer,
        userData?.data?.firebase_id
      );
      // if (decryptedAnswer === option) {
      //   // Point push logic remains the same
      //   let totalpush;
      //   if (finalScore < 2) {
      //     totalpush =
      //       Number(
      //         systemconfig?.battle_mode_random_quickest_correct_answer_extra_score
      //       ) +
      //       Number(
      //         systemconfig?.battle_mode_random_correct_answer_credit_score
      //       );
      //   } else if (finalScore === 3 || finalScore === 4) {
      //     totalpush =
      //       Number(
      //         systemconfig?.battle_mode_random_second_quickest_correct_answer_extra_score
      //       ) +
      //       Number(
      //         systemconfig?.battle_mode_random_correct_answer_credit_score
      //       );
      //   } else {
      //     totalpush = Number(
      //       systemconfig?.battle_mode_random_correct_answer_credit_score
      //     );
      //   }

      //   if (userData?.data?.id === battleroom.user1.uid) {
      //     await updateDoc(documentRef, {
      //       "user1.points": totalpush + user1point,
      //     });
      //   } else {
      //     await updateDoc(documentRef, {
      //       "user2.points": totalpush + user2point,
      //     });
      //   }
      // }
    } catch (error) {
      console.error("Error checking checkpoints:", error);
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

  // on timer expire
  const onTimerExpire = async () => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        navigate.push("/quiz-play");
        return;
      }
      let { id } = questions[currentQuestion];
      submitAnswer("x", id);

      let battleroom = docSnap.data();

      let user1ans = battleroom.user1.answers;
      let user2ans = battleroom.user2.answers;
      let playwithRobot = battleroom.playwithRobot;

      if (userData?.data?.id === battleroom.user1.uid) {
        user1ans.push({
          answer: 'x',
          id: questions[currentQuestion].id.toString(),
          second: timerSeconds.toString()
        });
        // user1ans.push(-1);

        await updateDoc(documentRef, {
          "user1.answers": user1ans,
        });
      } else {
        user2ans.push({
          answer: 'x',
          id: questions[currentQuestion].id.toString(),
          second: timerSeconds.toString()
        });
        // user2ans.push(-1);
        await updateDoc(documentRef, {
          "user2.answers": user2ans,
        });
      }

      // On time expire submit answer
      if (playwithRobot) {
        autoRobotClick();
      }

      // Answer check
      answercheckSnapshot();
    } catch (error) {
      console.error("Error on timer expire:", error);
    }
  };

  // answercheck snapshot
  const answercheckSnapshot = () => {
    // Safety check - only proceed if we have valid data
    if (!battleRoomDocumentId || !db) {
      console.log("No valid battleRoomDocumentId or db available for answercheckSnapshot");
      return;
    }
    
    const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

    onSnapshot(
      documentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          let battleroom = docSnapshot.data();

          let userOneAnswerLength = battleroom.user1.answers?.length;
          let userTwoAnswerLength = battleroom.user2.answers?.length;
          let entryFee = battleroom.entryFee;

          if (userOneAnswerLength !== 0 || userTwoAnswerLength !== 0) {
            if (userOneAnswerLength === userTwoAnswerLength) {
              setTimeout(() => {
                setNextQuestion();
              }, 1000);
              if (user1timer.current !== null && user2timer.current !== null) {
                user1timer.current.resetTimer();
                user2timer.current.resetTimer();
              }
            } else if (userOneAnswerLength > userTwoAnswerLength) {
              if (userData?.data?.id === battleroom.user1.uid) {
                if (user1timer.current !== null) {
                  user1timer.current.pauseTimer();
                }
              } else {
                if (user2timer.current !== null) {
                  user2timer.current.pauseTimer();
                }
              }
            } else if (userOneAnswerLength < userTwoAnswerLength) {
              if (userData?.data?.id === battleroom.user2.uid) {
                if (user1timer.current !== null) {
                  user1timer.current.pauseTimer();
                }
              } else {
                if (user2timer.current !== null) {
                  user2timer.current.pauseTimer();
                }
              }
            }
          }
        }
      },
      (error) => {
        console.error("Error listening for snapshot:", error);
      }
    );
  };

  // point check
  const checkCorrectAnswers = async (option) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let user1name = battleroom.user1.name;
      let user2name = battleroom.user2.name;
      let user1image = battleroom.user1.profileUrl;
      let user2image = battleroom.user2.profileUrl;
      let user1correct = battleroom.user1.correctAnswers;
      let user2correct = battleroom.user2.correctAnswers;
      let user1uid = battleroom.user1.uid;
      let user2uid = battleroom.user2.uid;

      // Store data in local storage to get in result screen
      LoadGroupBattleData("user1name", user1name);
      LoadGroupBattleData("user2name", user2name);
      LoadGroupBattleData("user1image", user1image);
      LoadGroupBattleData("user2image", user2image);
      LoadGroupBattleData("user1uid", user1uid);
      LoadGroupBattleData("user2uid", user2uid);

      let decryptedAnswer = decryptAnswer(
        questions[currentQuestion].answer,
        userData?.data?.firebase_id
      );
      if (decryptedAnswer === option) {
        // Correct answer push
        if (userData?.data?.id === battleroom.user1.uid) {
          await updateDoc(documentRef, {
            "user1.correctAnswers": user1correct + 1,
          });
        } else if (userData?.data?.id === battleroom.user2.uid) {
          await updateDoc(documentRef, {
            "user2.correctAnswers": user2correct + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error checking correct answers:", error);
    }
  };

  //answerlength check
  const SnapshotData = () => {
    // Safety check - only proceed if we have valid data
    if (!battleRoomDocumentId || !db) {
      console.log("No valid battleRoomDocumentId or db available");
      return;
    }
    
    let documentRef = doc(db, "battleRoom", battleRoomDocumentId);
    
    let executed = false;
    let TotalUserLength = false;

    const unsubscribe = onSnapshot(documentRef, (doc) => {
      let navigatetoresult = true;

      if (doc.exists && doc.data()) {
        let battleroom = doc.data();        
        
        leftBattleroom.current = battleroom;
        let user1point = battleroom.user1.points;

        let entryFee = battleroom.entryFee;

        LoadGroupBattleData("entryFee", entryFee);

        let user2point = battleroom.user2.points;

        let userone = battleroom.user1;

        let usertwo = battleroom.user2;

        let user1uid = battleroom.user1.uid;
        setUser1Id(battleroom.user1.uid);
        let user2uid = battleroom.user2.uid;
        setUser2Id(battleroom.user2.uid);
        let user1correctanswer = userone.correctAnswers;

        let playwithrobot = battleroom?.playwithRobot;

        LoadGroupBattleData("user1CorrectAnswer", user1correctanswer);

        let user2correctanswer = usertwo.correctAnswers;

        LoadGroupBattleData("user2CorrectAnswer", user2correctanswer);

        // this only for robot
        if (playwithrobot) {
          setPlaywithrobot(true);
        }

        // point update in localstorage
        localStoragePoint(user1point, user2point);

        let navigateUserData = [];

        navigateUserData = [userone, usertwo];

        setBattleUserData([userone, usertwo]);

        // if user length is less than 1
        const newUser = [userone, usertwo];

        const usersWithNonEmptyUid = newUser.filter(
          (elem) => elem.uid !== ""
        );

        if (!TotalUserLength) {
          TotalUserLength = true;
          LoadGroupBattleData("totalusers", usersWithNonEmptyUid?.length);
        }

        // here check if user enter the game coin deduct its first time check
        if (!executed) {
          executed = true;
          newUser.forEach((obj) => {
            if (
              userData?.data?.id === obj.uid &&
              obj.uid !== "" &&
              battleroom.entryFee > 0
            ) {
              // when play with robot coin not deducte if user id === 000
              if (user2uid !== "000") {
                const deductCoins = async () => {
                  const response = await setUserCoinScoreApi({
                    coins: "-" + battleroom.entryFee,
                    title: "played_battle",
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
        }

        const usersuid = [user1uid, user2uid];

        const newArray = newUser.filter(
          (obj) => Object.keys(obj.uid)?.length > 0
        );
        if(battleroom.user1?.uid !== "" && battleroom.user2?.uid !== ""){const formattedData = {
          user1_id: battleroom.user1?.uid,
          user2_id: battleroom.user2?.uid,
          user1_data: battleroom.user1?.answers || [],
          user2_data: battleroom.user2?.answers || []
        };
        leftFormatedData.current = formattedData;
        leftRoomId.current = battleroom.roomCode;}
        

        // Handle opponent left logic for all cases
        
        
        // if (usersuid.includes(userData?.data?.id) && newArray?.length < 2) {
        //   // Set the formatted data immediately when opponent leaves

        //    // Only make API call if NOT playing with bot
        //    if (!playwithrobot) {
        //     const deductCoins = async () => {
             
        //       const clearOpponentData = () => {
        //         if (
        //           leftFormatedData.current.user1_id === userData?.data?.id
        //         ) {
        //           leftFormatedData.current.user2_id = "0";
        //         } else {
        //           leftFormatedData.current.user1_id = "0";
        //         }
        //       };

        //       clearOpponentData();
              
        //       const response = await setQuizCoinScoreApi({
        //         quiz_type: 1.3,
        //         play_questions: JSON.stringify(leftFormatedData.current),
        //         match_id: leftRoomId.current,
        //       })
              
        //     }
        //     deductCoins();
        //   }

        //   MySwal.fire({
        //     title: t("opponent_left"),
        //     icon: "warning",
        //     showCancelButton: false,
        //     customClass: {
        //       confirmButton: "Swal-confirm-buttons",
        //       cancelButton: "Swal-cancel-buttons",
        //     },
        //     confirmButtonText: t("ok"),
        //   }).then((result) => {
           
        //     if (result.isConfirmed) {
              
        //       navigate.push("/quiz-play");
        //       deleteBattleRoom(battleRoomDocumentId, 2);

        //     }
        //   });
        // }

        //checking if every user has given all question's answer
        navigateUserData.forEach((elem) => {
          if (elem.uid != "") {
            if (elem.answers?.length < questions?.length) {
              navigatetoresult = false;
              resultNavigation.current = false;
            }
          }
        });

        if (navigatetoresult) {
          resultNavigation.current = true;
          setTimeout(async () => {
            await onQuestionEnd();
            
            // Only delete if we're actually ending the game
            if (!window.isLeaving) {
              deleteBattleRoom(battleRoomDocumentId);
            }
          }, 1000);
        }
      } else {
       
        let navigateOrNot = leftBattleroom?.current?.user1?.answers.length === questions.length && leftBattleroom?.current?.user2?.answers.length === questions.length
        if(leftBattleroom?.current?.user1?.uid === "" || leftBattleroom?.current?.user2?.uid === "" || (!navigateOrNot && showPopup.current === true)){

          const deductCoins = async () => {
            const clearOpponentData = () => {
              if (
                leftFormatedData.current.user1_id === userData?.data?.id
              ) {
                leftFormatedData.current.user2_id = "0";
              } else {
                leftFormatedData.current.user1_id = "0";
              }
            };

            clearOpponentData();
const match_id = localStorage.getItem("battleRoomDocumentId");
            const response = await setQuizCoinScoreApi({
              quiz_type: 1.4,
              play_questions: JSON.stringify(leftFormatedData.current),
              match_id: match_id,
            });
            localStorage.removeItem("battleRoomDocumentId");
          };
          deductCoins();

          MySwal.fire({
            title: t("opponent_left"),
            icon: "warning",
            showCancelButton: false,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: t("ok"),
          }).then((result) => {
            if (result.isConfirmed) {
              
              navigate.push("/quiz-play");

              deleteBattleRoom(battleRoomDocumentId);
            }
          });
        }


        // if (navigatetoresult) {
        //   handleNavigation();
        // } else {
        //   onQuestionEnd(false);
        // }
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    SnapshotData()
  }, []);

  useEffect(() => {

    let isSubscribed = true;
    
    const cleanup = async () => {
      if (!isSubscribed) return;
      
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);
      try {
        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          const battleroom = docSnap.data();
          const user1uid = battleroom?.user1?.uid;
          const user2uid = battleroom?.user2?.uid;
          const playwithRobot = battleroom?.playwithRobot;

          // Handle user leaving for all cases (both bot and real user games)
          if (user1uid === userData?.data?.id) {
            await updateDoc(documentRef, {
              "user1.name": "",
              "user1.uid": "",
              "user1.profileUrl": "",
            });
          } else if (user2uid === userData?.data?.id) {
            await updateDoc(documentRef, {
              "user2.name": "",
              "user2.uid": "",
              "user2.profileUrl": "",
            });
          }
          
          // Only delete if we're actually leaving
          if (window.isLeaving) {
            await deleteBattleRoom(battleRoomDocumentId);
            handleNavigation();
          }
        }
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };

    // Set up listeners
    // const unsubscribeSnapshot = SnapshotData();
    // const unsubscribeAnswerCheck = answercheckSnapshot();
    checkpoints();

    return () => {
      isSubscribed = false;
      cleanup();
      // Cleanup listeners
      // if (unsubscribeSnapshot) unsubscribeSnapshot();
      // if (unsubscribeAnswerCheck) unsubscribeAnswerCheck();
    };
  }, []);

  // Delete room on route change (page navigation)
  useEffect(() => {
    const handleRouteChange = async () => {
      if (!battleRoomDocumentId || !db || !userData?.data?.id || resultNavigation.current === true) return;
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);
      try {
        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          showPopup.current = false;
          const battleroom = docSnap.data();
          if (
            battleroom.user1?.uid === userData.data.id ||
            battleroom.user2?.uid === userData.data.id
          ) {
            await deleteBattleRoom(battleRoomDocumentId);
            navigate.push("/quiz-play");
          }
        }
      } catch (err) {
        // ignore
      }
    };
    if (navigate && navigate.events && navigate.events.on) {
      navigate.events.on("routeChangeStart", handleRouteChange);
      return () => {
        navigate.events.off("routeChangeStart", handleRouteChange);
      };
    }
  }, [battleRoomDocumentId, db, userData, navigate]);

  const loggedInUserData = battleUserData.find(
    (item) => item.uid === userData?.data?.id
  );

  const deleteMsgId = async (messageId) => {
    // Now we receive the messageId as a parameter
    if (messageId && db) {
      try {
        const messageRef = doc(db, "messages", messageId);
        const docSnap = await getDoc(messageRef);
        if (docSnap.exists()) {
          await deleteDoc(messageRef);
        } else {
        }
      } catch (error) {
        console.error("Error in deleteMsgId:", error);
      }
    }
  };

  useEffect(() => {
    if (groupBattledata.roomID && db) {
      const q = query(
        collection(db, "messages"),
        where("roomId", "==", groupBattledata.roomID)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            const docId = change.doc.id; // Get the actual Firestore document ID
            const translatedMessage = t(data.message);
            setMsgData({ ...data, message: translatedMessage });
            setIsVisible(true);
            // Pass the docId directly to the timeout
            setTimeout(() => {
              setIsVisible(false);
              deleteMsgId(docId); // Pass the ID directly to the delete function
            }, battleEmojiSeconsd);
          }
        });
      });
      return () => unsubscribe();
    }
  }, [groupBattledata.roomID]);

  const popUp = () => {
    if (
      msgData !== undefined &&
      (user1Id === msgData.by || user2Id === msgData.by)
    ) {
      return (
        <div className="absolute bottom-[120px] bg-white dark:bg-[#211A3E] dark:after:!text-[#211A3E] darkSecondaryColor rounded-[6px] p-[4px_10px] left-1/2 transform -translate-x-1/2 after:content-['▼'] after:bottom-[-17px] after:left-1/2 after:transform  after:-translate-x-1/2 after:text-white after:right-[20px] after:absolute">
          {msgData ? (
            msgData.isTextMessage ? (
              <div className="whitespace-nowrap">{msgData.message}</div>
            ) : (
              msgData.message && (
                <div>
                  <Image
                    src={`/images/emojis/${msgData.message}`}
                    height={50}
                    width={50}
                    alt="emoji"
                  />
                </div>
              )
            )
          ) : (
            <div>{t("no_message_data_available")}</div>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  // Add this function for navigation
  const handleNavigation = () => {
    window.isLeaving = true;
    navigate.push("/quiz-play");
  };

  return (
    <React.Fragment>
      <div ref={scroll}>
        <QuestionTopSection
          currentQuestion={currentQuestion}
          questions={questions}
          showAnswers={false}
          isBattle={true}
        />

        <QuestionMiddleSectionOptions
          questions={questions}
          currentQuestion={currentQuestion}
          setAnswerStatusClass={setAnswerStatusClass}
          handleAnswerOptionClick={handleAnswerOptionClick}
          probability={false}
          latex={true}
        />

        {/* user1 */}
        <div className="morphisam !mb-14 darkSecondaryColor">
          <div className="max-399:gap-4 mt-[30px] lg:w-[65%] flex-col sm:flex-row w-full max-575:mx-2  flex justify-between items-center text-center flex-wrap mx-auto">
            <div className="flex-center relative mb-4 gap-2 md:gap-4">
              {/* timer */}
              <div className="relative">
                <div className={`${isVisible ? "block" : "hidden"}`}>
                  {msgData !== undefined &&
                    loggedInUserData?.uid == msgData.by &&
                    popUp()}
                </div>
                {questions && questions[0]["id"] !== "" ? (
                  <RoundTimer
                    ref={user1timer}
                    timerSeconds={timerSeconds}
                    onTimerExpire={onTimerExpire}
                    userProfile={user1image}
                  />
                ) : (
                  ""
                )}
              </div>
              {/* userinfo */}
              <div>
                <div className="mb-1">
                  <p>
                    {loggedInUserData?.name
                      ? loggedInUserData?.name
                      : "Waiting..."}
                  </p>
                </div>
                <div className="flex-center">
                  <div className="rightWrongAnsDiv [&>span:first-child]:border-r-0 [&>span:first-child]:pr-0">
                    <span className="font-bold tetx-[18px] text-text-color">
                      <img
                        src={getImageSource(rightTickIcon.src)}
                        alt="correct"
                      />
                      {loggedInUserData?.correctAnswers
                        ? loggedInUserData?.correctAnswers
                        : 0}{" "}
                      / <span>{questions?.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <ShowMessagePopUp></ShowMessagePopUp> */}
            <div className="flex-center mb-4 gap-4">
              {/* timer */}
              <div className="relative">
                <div className={`${isVisible ? "block" : "hidden"}`}>
                  {msgData !== undefined &&
                    loggedInUserData?.uid !== msgData.by &&
                    popUp()}
                </div>
                {questions && questions[0]["id"] !== "" ? (
                  <RoundTimer
                    ref={user2timer}
                    timerSeconds={timerSeconds}
                    onTimerExpire={() => {}}
                    userProfile={user2image}
                  />
                ) : (
                  ""
                )}
              </div>
              {/* userinfo */}
              {battleUserData?.map((data) =>
                data?.uid !== userData?.data?.id && data?.uid !== "" ? (
                  <div key={data?.uid} className="">
                    <div className="mb-1">
                      <p>{data?.name ? data?.name : "Waiting..."}</p>
                    </div>
                    <div className="flex-center">
                      <div className="rightWrongAnsDiv [&>span:first-child]:border-r-0 [&>span:first-child]:pr-0">
                        <span className="font-bold tetx-[18px] text-text-color">
                          <img
                            src={getImageSource(rightTickIcon.src)}
                            alt="correct"
                          />
                          {data?.correctAnswers ? data?.correctAnswers : 0} /{" "}
                          <span>{questions?.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

RandomQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(RandomQuestions);
