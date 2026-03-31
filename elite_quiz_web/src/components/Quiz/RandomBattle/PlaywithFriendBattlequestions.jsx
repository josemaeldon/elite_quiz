import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  decryptAnswer,
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
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  deleteDoc,
  where,
  getDoc,
} from "firebase/firestore";
import ShowMessagePopUp from "@/components/messagePopUp/ShowMessagePopUpBtn";
import RoundTimer from "@/components/Common/RoundTimer";

import Image from "next/image";
import {
  getUserCoinsApi,
  setQuizCoinScoreApi,
  setUserCoinScoreApi,
} from "@/api/apiRoutes";

const MySwal = withReactContent(Swal);

const PlaywithFriendBattlequestions = ({
  questions: data,
  timerSeconds,
  onQuestionEnd,
}) => {
  const [questions, setQuestions] = useState(data);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [battleUserData, setBattleUserData] = useState([]);
  // const [idForMsgPopUp, setIdForMsgPopUp] = useState()
  const [newMsgCreatedId, setNewMsgCreatedId] = useState();
  const [msgData, setMsgData] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const battleEmojiSeconsd =
    process.env.NEXT_PUBLIC_BATTLE_EMOJI_TEXT_MILI_SECONDS;
  const [user1Id, setUser1Id] = useState();
  const [user2Id, setUser2Id] = useState();
  const [isShowAnsState, setIsShowAnsState] = useState(false);
  const [userProfile, setUserProfile] = useState({ user1: "", user2: "" });
  const Score = useRef(0);
  const answerOptionClicked = useRef(false);

  const dispatch = useDispatch();

  const navigate = useRouter();

  const user1timer = useRef(null);

  const user2timer = useRef(null);

  const scroll = useRef(null);

  const isLeft = useRef(false);

  const leftFormatedData = useRef({});

  const leftRoomId = useRef({});
  const leftBattleroom = useRef({});

  // const isCombatWinnerIsRemaining = useRef(true);

  const db = getFirestore();

  // store data get
  const idForMsgPopUp = useSelector((state) => state.message);

  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  const groupBattledata = useSelector(groupbattledata);

  //firestore adding answer in doc
  let battleRoomDocumentId = groupBattledata.roomID;

  // Check if required data is available
  useEffect(() => {
    if (!battleRoomDocumentId) {
      console.error("No battle room document ID found");
      navigate.push("/random-battle");
      return;
    }
  }, [battleRoomDocumentId, navigate]);

  // Check if questions data is available
  useEffect(() => {
    if (!questions || questions.length === 0) {
      console.error("No questions data found");
      console.log("No questions available. Please try again.");
      navigate.push("/random-battle");
      return;
    }
  }, [questions, navigate]);

  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  // delete message id

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

  // delete battle room
  const deleteBattleRoom = async (documentId) => {
    try {
      if (!documentId || !db) {
        console.log("No valid documentId or db available for deleteBattleRoom");
        return;
      }
      await deleteDoc(doc(db, "battleRoom", documentId));
    } catch (error) {
      const errorMessage =
        error?.message || error?.toString() || "Error deleting battle room";
      console.log(errorMessage, "errorMessage");
      console.error("Error deleting battle room:", error);
    }
  };

  // recive id for individual popup show
  useEffect(() => {
    const showMsgToUser = async () => {
      if (idForMsgPopUp.firestoreId !== null) {
        const db = getFirestore();
        let documentRef = doc(db, "messages", idForMsgPopUp.firestoreId);

        onSnapshot(
          documentRef,
          (doc) => {
            if (doc.exists && doc.data()) {
              let data = doc.data();
              setNewMsgCreatedId(data.by);
            }
          },
          (error) => {
            console.log("err", error);
          }
        );
      }
    };
    showMsgToUser();
  }, [idForMsgPopUp.firestoreId]);

  // next questions
  const setNextQuestion = async () => {
    setIsShowAnsState(false);
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      await onQuestionEnd();
      deleteBattleRoom(battleRoomDocumentId);
    }
  };

  // button option answer check
  const handleAnswerOptionClick = async (selected_option) => {
    answerOptionClicked.current = true;

    // Safety checks
    if (!questions || !questions[currentQuestion]) {
      console.error("No question data available");
      console.log("Question data not available");
      return;
    }

    if (!userData?.data?.firebase_id) {
      console.error("User firebase ID not available");
      console.log("User authentication error");
      return;
    }

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

      submitAnswer(selected_option, id);
      dispatch(percentageSuccess(result_score));

      dispatch(questionsDataSuceess(update_questions));
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
  const submitAnswer = async (selectedOption, id) => {
    try {
      if (!battleRoomDocumentId) {
        console.error("No battle room document ID found");
        return;
      }

      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.error("Battle room document does not exist");
        navigate.push("/random-battle");
        return;
      }
      let battleroom = docSnap.data();

      let user1answers = battleroom.user1?.answers || [];
      let user2answers = battleroom.user2?.answers || [];

      const user1seconds =
        timerSeconds -
        convertTimeToSeconds(user1timer.current.getMinuteandSeconds());
      const user2seconds =
        timerSeconds -
        convertTimeToSeconds(user2timer.current.getMinuteandSeconds());

      const newAnswer = {
        answer: selectedOption.toString(),
        id: id.toString(),
        second: user1seconds.toString(),
      };

      const newAnswer2 = {
        answer: selectedOption.toString(),
        id: id.toString(),
        second: user2seconds.toString(),
      };

      if (userData?.data?.id === battleroom.user1?.uid) {
        user1answers.push(newAnswer);
        await updateDoc(documentRef, {
          "user1.answers": user1answers,
        });
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
          const updatedUser1Answers = updatedBattleroom.user1?.answers || [];
          const updatedUser2Answers = updatedBattleroom.user2?.answers || [];

          // Check if both users have completed all questions
          if (
            updatedUser1Answers.length === questions.length &&
            updatedUser2Answers.length === questions.length
          ) {
            // Format and set battle result data
            const formattedData = {
              user1_id: updatedBattleroom.user1?.uid,
              user2_id: updatedBattleroom.user2?.uid,
              user1_data: updatedUser1Answers,
              user2_data: updatedUser2Answers,
            };
            leftFormatedData.current = formattedData;
            leftRoomId.current = updatedBattleroom.roomCode;
            leftBattleroom.current = updatedBattleroom;
            setBattleResultData({
              quiz_type: 1.4,
              match_id: updatedBattleroom.roomCode,
              play_questions: formattedData,
            });

            // Unsubscribe from the listener
            unsubscribe();
          }
        }
      });

      // Proceed with other operations after successful update
      answercheckSnapshot(selectedOption);
      checkpoints(selectedOption);
      checkCorrectAnswers(selectedOption);
    } catch (error) {
      console.error("Error submitting answer:", error);
      // Handle Firebase permission errors specifically
      if (error.code === "permission-denied") {
        console.log(
          "Permission denied. Please check your authentication status."
        );
      } else {
        const errorMessage =
          error?.message || error?.toString() || "Error submitting answer";
        console.log(errorMessage, "errorMessage");
      }
    }
  };

  // point check
  const checkpoints = async (option) => {
    try {
      if (!battleRoomDocumentId) {
        console.error("No battle room document ID found");
        return;
      }

      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);
      if (!docSnap.exists()) {
        console.error("Battle room document does not exist");
        navigate.push("/random-battle");
        return;
      }

      const battleroom = docSnap.data();

      const totalseconds = timerSeconds;
      const seconds = user1timer.current.getTimerSeconds();
      const finalScore = totalseconds - seconds;

      const user1name = battleroom.user1?.name;
      const user2name = battleroom.user2?.name;
      const user1point = battleroom.user1?.points || 0;
      const user2point = battleroom.user2?.points || 0;
      const user1uid = battleroom.user1?.uid;
      const user2uid = battleroom.user2?.uid;
      const user1image = battleroom.user1?.profileUrl;
      const user2image = battleroom.user2?.profileUrl;

      // Store data in local storage to get in result screen
      localStorageData(
        user1name,
        user2name,
        user1uid,
        user2uid,
        user1image,
        user2image
      );

      // if (userData?.data?.id === battleroom.user1?.uid) {
      //   let decryptedAnswer = decryptAnswer(
      //     questions[currentQuestion].answer,
      //     userData?.data?.firebase_id
      //   );
      //   if (decryptedAnswer === option) {
      //     // Point push logic remains the same
      //     let totalpush;
      //     if (finalScore < 2) {
      //       totalpush =
      //         Number(
      //           systemconfig?.battle_mode_one_quickest_correct_answer_extra_score
      //         ) +
      //         Number(systemconfig?.battle_mode_one_correct_answer_credit_score);
      //     } else if (finalScore === 3 || finalScore === 4) {
      //       totalpush =
      //         Number(
      //           systemconfig?.battle_mode_one_second_quickest_correct_answer_extra_score
      //         ) +
      //         Number(systemconfig?.battle_mode_one_correct_answer_credit_score);
      //     } else {
      //       totalpush = Number(
      //         systemconfig?.battle_mode_one_correct_answer_credit_score
      //       );
      //     }

      //     await updateDoc(documentRef, {
      //       [`user1.points`]: totalpush + user1point,
      //     });
      //   }
      // } else {
      //   let decryptedAnswer = decryptAnswer(
      //     questions[currentQuestion].answer,
      //     userData?.data?.firebase_id
      //   );
      //   if (decryptedAnswer === option) {
      //     // Similar logic for user2
      //     let totalpush;
      //     if (finalScore < 2) {
      //       totalpush =
      //         Number(
      //           systemconfig?.battle_mode_one_quickest_correct_answer_extra_score
      //         ) +
      //         Number(systemconfig?.battle_mode_one_correct_answer_credit_score);
      //     } else if (finalScore === 3 || finalScore === 4) {
      //       totalpush =
      //         Number(
      //           systemconfig?.battle_mode_one_second_quickest_correct_answer_extra_score
      //         ) +
      //         Number(systemconfig?.battle_mode_one_correct_answer_credit_score);
      //     } else {
      //       totalpush = Number(
      //         systemconfig?.battle_mode_one_correct_answer_credit_score
      //       );
      //     }

      //     // await updateDoc(documentRef, {
      //     //   [`user2.points`]: totalpush + user2point,
      //     // });
      //   }
      // }
    } catch (error) {
      console.error("Error processing checkpoints:", error);
      // Handle Firebase permission errors specifically
      if (error.code === "permission-denied") {
        console.log(
          "Permission denied. Please check your authentication status."
        );
      } else {
        const errorMessage =
          error?.message || error?.toString() || "Error processing checkpoints";
        console.log(errorMessage, "errorMessage");
      }
    }
  };

  // option answer status check
  const setAnswerStatusClass = (option) => {
    const currentIndex = currentQuestion;

    // Safety check for questions array
    if (!questions || !questions[currentIndex]) {
      return "";
    }

    const currentQuestionq = questions[currentIndex];

    // Safety check for question properties
    if (!currentQuestionq) {
      return "";
    }

    let decryptedAnswer = decryptAnswer(
      questions[currentIndex].answer,
      userData?.data?.firebase_id
    );

    let selected_answer = isShowAnsState
      ? decryptedAnswer
      : currentQuestionq.selected_answer;
    let isAnswered = isShowAnsState ? true : currentQuestionq.isAnswered;
    const color = showAnswerStatusClass(
      option,
      isAnswered,
      currentQuestionq.answer,
      selected_answer
    );
    return color;
  };

  // on timer expire
  const onTimerExpire = async () => {
    setIsShowAnsState(true);
    try {
      if (!battleRoomDocumentId) {
        console.error("No battle room document ID found");
        return;
      }

      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);
      if (!docSnap.exists()) {
        return;
      }
      let { id } = questions[currentQuestion];
      submitAnswer("x", id);

      const battleroom = docSnap.data();

      let user1ans = battleroom.user1?.answers || [];
      let user2ans = battleroom.user2?.answers || [];

      if (userData?.data?.id === battleroom.user1?.uid) {
        user1ans.push({
          answer: "x",
          id: questions[currentQuestion].id.toString(),
          second: timerSeconds.toString(),
        });
        // user1ans.push(-1);
        await updateDoc(documentRef, {
          ["user1.answers"]: user1ans,
        });
      } else {
        user2ans.push({
          answer: "x",
          id: questions[currentQuestion].id.toString(),
          second: timerSeconds.toString(),
        });
        // user2ans.push(-1);
        await updateDoc(documentRef, {
          ["user2.answers"]: user2ans,
        });
      }

      // Call answer check function
      answercheckSnapshot();
    } catch (error) {
      console.error("Error updating timer expire:", error);
      // Handle Firebase permission errors specifically
      if (error.code === "permission-denied") {
        console.log(
          "Permission denied. Please check your authentication status."
        );
      } else {
        const errorMessage =
          error?.message || error?.toString() || "Error updating timer";
        console.log(errorMessage, "errorMessage");
      }
    }
  };

  // answercheck snapshot
  const answercheckSnapshot = (selectedOption) => {
    if (!battleRoomDocumentId) {
      console.error("No battle room document ID found");
      return;
    }

    let documentRef = doc(db, "battleRoom", battleRoomDocumentId);

    onSnapshot(
      documentRef,
      (doc) => {
        if (doc.exists && doc.data()) {
          let battleroom = doc.data();

          let useroneAnswerLength = battleroom.user1?.answers?.length || 0;

          let usertwoAnswerLength = battleroom.user2?.answers?.length || 0;

          let entryFee = battleroom.entryFee;

          if (useroneAnswerLength != 0 || usertwoAnswerLength != 0) {
            if (useroneAnswerLength === usertwoAnswerLength) {
              setTimeout(() => {
                setNextQuestion();
              }, 1000);
              if (user1timer.current !== null && user2timer.current !== null) {
                user1timer.current.resetTimer();
                user2timer.current.resetTimer();
              }
            } else if (useroneAnswerLength > usertwoAnswerLength) {
              if (userData?.data?.id === battleroom.user1?.uid) {
                if (user1timer.current !== null) {
                  user1timer.current.pauseTimer();
                }
              } else {
                if (user2timer.current !== null) {
                  user2timer.current.pauseTimer();
                }
              }
            } else if (useroneAnswerLength < usertwoAnswerLength) {
              if (userData?.data?.id === battleroom.user2?.uid) {
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
        console.log("err", error);
        // Handle Firebase permission errors specifically
        if (error.code === "permission-denied") {
          console.log(
            "Permission denied. Please check your authentication status."
          );
        }
      }
    );
  };

  // point check
  const checkCorrectAnswers = async (option) => {
    try {
      if (!battleRoomDocumentId) {
        console.error("No battle room document ID found");
        return;
      }

      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
        return;
      }

      let battleroom = docSnap.data();

      let user1name = battleroom.user1?.name;

      let user2name = battleroom.user2?.name;

      let user1image = battleroom.user1?.profileUrl;

      let user2image = battleroom.user2?.profileUrl;

      let user1correct = battleroom.user1?.correctAnswers || 0;

      let user2correct = battleroom.user2?.correctAnswers || 0;

      let user1uid = battleroom.user1?.uid;

      let user2uid = battleroom.user2?.uid;

      // store data in local storage to get in result screen
      LoadGroupBattleData("user1name", user1name);
      LoadGroupBattleData("user2name", user2name);
      LoadGroupBattleData("user1image", user1image);
      LoadGroupBattleData("user2image", user2image);
      LoadGroupBattleData("user1uid", user1uid);
      LoadGroupBattleData("user2uid", user2uid);

      if (userData?.data?.id === battleroom.user1?.uid) {
        let decryptedAnswer = decryptAnswer(
          questions[currentQuestion].answer,
          userData?.data?.firebase_id
        );
        if (decryptedAnswer === option) {
          // correctanswer push
          await updateDoc(documentRef, {
            "user1.correctAnswers": user1correct + 1,
          });
        }
      } else if (userData?.data?.id === battleroom.user2?.uid) {
        let decryptedAnswer = decryptAnswer(
          questions[currentQuestion].answer,
          userData?.data?.firebase_id
        );
        if (decryptedAnswer === option) {
          // correctanswer push
          await updateDoc(documentRef, {
            "user2.correctAnswers": user2correct + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error checking correct answers:", error);
      // Handle Firebase permission errors specifically
      if (error.code === "permission-denied") {
        console.log(
          "Permission denied. Please check your authentication status."
        );
      } else {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          "Error checking correct answers";
        console.log(errorMessage);
      }
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

    onSnapshot(
      documentRef,
      (doc) => {
        let navigatetoresult = true;

        if (doc.exists && doc.data()) {
          let battleroom = doc.data();
          leftBattleroom.current = battleroom;

          if (battleroom.user1?.uid !== "" && battleroom.user2?.uid !== "") {
            const formattedData = {
              user1_id: battleroom.user1?.uid,
              user2_id: battleroom.user2?.uid,
              user1_data: battleroom.user1?.answers || [],
              user2_data: battleroom.user2?.answers || [],
            };
            leftFormatedData.current = formattedData;
            leftRoomId.current = battleroom.roomCode;
          }

          // Check if current user is still in the room
          const currentUserId = userData?.data?.id;
          const roomUser1uid = battleroom.user1?.uid;
          const roomUser2uid = battleroom.user2?.uid;

          // If current user is not found in the room, delete the room and redirect
          if (
            currentUserId &&
            roomUser1uid !== currentUserId &&
            roomUser2uid !== currentUserId
          ) {
            console.log(
              "Current user not found in room - deleting room and redirecting"
            );
            deleteBattleRoom(battleRoomDocumentId);
            navigate.push("/random-battle");
            return;
          }

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

          setUserProfile({
            user1: battleroom.user1.profileUrl,
            user2: battleroom.user2.profileUrl,
          });
          let user1correctanswer = userone.correctAnswers;

          LoadGroupBattleData("user1CorrectAnswer", user1correctanswer);

          let user2correctanswer = usertwo.correctAnswers;

          LoadGroupBattleData("user2CorrectAnswer", user2correctanswer);

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
            });
          }

          const usersuid = [user1uid, user2uid];

          const newArray = newUser.filter(
            (obj) => Object.keys(obj.uid)?.length > 0
          );
          if (battleroom.user1?.uid !== "" && battleroom.user2?.uid !== "") {
            const formattedData = {
              user1_id: battleroom.user1?.uid,
              user2_id: battleroom.user2?.uid,
              user1_data: battleroom.user1?.answers || [],
              user2_data: battleroom.user2?.answers || [],
            };
            leftFormatedData.current = formattedData;
            leftRoomId.current = battleroom.roomCode;
          }

          if (usersuid.includes(userData?.data?.id) && newArray?.length < 2) {
            isLeft.current = true;

            // Set the formatted data immediately when opponent leaves

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

                  const response = await setQuizCoinScoreApi({
                    quiz_type: 1.4,
                    play_questions: JSON.stringify(leftFormatedData.current),
                    match_id: leftRoomId.current,
                  });
                };
                deductCoins();
                navigate.push("/quiz-play");

                deleteBattleRoom(battleRoomDocumentId);
              }
            });
          }

          // checking if every user has given all question's answer
          navigateUserData.forEach((elem) => {
            if (elem.uid != "") {
              if (elem.answers?.length < questions?.length) {
                navigatetoresult = false;
              }
            }
          });

          if (navigatetoresult) {
            // end screen
            setTimeout(async () => {
              await onQuestionEnd();
              deleteBattleRoom(battleRoomDocumentId);
            }, 1000);
          }
        } else {
          // Only show popup if current user is still in the room (not the one who left)

          let navigateOrNot =
            leftBattleroom?.current?.user1?.answers.length ===
              questions.length &&
            leftBattleroom?.current?.user2?.answers.length === questions.length;

          if (
            !navigateOrNot &&
            (leftBattleroom?.current?.user1?.uid === userData?.data?.id ||
              leftBattleroom?.current?.user2?.uid === userData?.data?.id)
          ) {

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

                  const response = await setQuizCoinScoreApi({
                    quiz_type: 1.4,
                    play_questions: JSON.stringify(leftFormatedData.current),
                    match_id: leftRoomId.current,
                  });
                };
                deductCoins();
                navigate.push("/quiz-play");

                deleteBattleRoom(battleRoomDocumentId);
              }
            });
          }

          if (navigatetoresult && questions?.length < currentQuestion) {
            navigate.push("/");
          }
          //  else {
          //   console.log('this is navigatetoresult',navigatetoresult);
          //   navigate.push("/quiz-play");
          //   // onQuestionEnd(true);
          // }
        }
      },
      (error) => {
        console.log("err", error);
      }
    );
  };

  useEffect(() => {
    checkCorrectAnswers();
  }, []);

  useEffect(() => {
    // Only execute these functions if we have a valid battleRoomDocumentId
    if (battleRoomDocumentId && db) {
      SnapshotData();
      answercheckSnapshot();
      checkpoints();

      return () => {
        // Only set up cleanup if we have valid data
        if (battleRoomDocumentId && db) {
          let documentRef = doc(db, "battleRoom", battleRoomDocumentId);

          onSnapshot(
            documentRef,
            (doc) => {
              if (doc.exists && doc.data()) {
                let battleroom = doc.data();

                let user1uid = battleroom && battleroom.user1.uid;

                let user2uid = battleroom && battleroom.user2.uid;

                let roomid = doc.id;

                if (user1uid === userData?.data?.id) {
                  updateDoc(documentRef, {
                    "user1.name": "",
                    "user1.uid": "",
                    "user1.profileUrl": "",
                  });
                } else if (user2uid === userData?.data?.id) {
                  updateDoc(documentRef, {
                    "user2.name": "",
                    "user2.uid": "",
                    "user2.profileUrl": "",
                  });
                }

                navigate.push("/quiz-play");
                // deleteBattleRoom(roomid);
              }
            },
            (error) => {
              console.log("err", error);
            }
          );
        }
      };
    }
  }, [battleRoomDocumentId, db]);

  // message snapShote

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

  const loggedInUserData = battleUserData.find(
    (item) => item.uid === userData?.data?.id
  );
  const popUp = () => {
    if (
      msgData !== undefined &&
      (user1Id === msgData.by || user2Id === msgData.by)
    ) {
      return (
        <div className="absolute bottom-[120px] bg-white dark:bg-[#211A3E] dark:after:!text-[#211A3E] rounded-[6px] p-[4px_10px] left-1/2 transform -translate-x-1/2 after:content-['▼'] after:bottom-[-17px] after:left-1/2 after:transform  after:-translate-x-1/2 after:text-white after:right-[20px] after:absolute">
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

  return (
    <React.Fragment>
      <QuestionTopSection
        currentQuestion={currentQuestion}
        questions={questions}
        showAnswers={false}
        isBattle={true}
      />

      <div ref={scroll}>
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
            <div className="flex-center relative mb-4">
              {/* timer */}
              <div className="relative">
                <div className={`${isVisible ? "block" : "hidden"}`}>
                  {msgData !== undefined &&
                    loggedInUserData?.uid == msgData.by &&
                    popUp()}
                </div>
                {questions ? (
                  <RoundTimer
                    ref={user1timer}
                    timerSeconds={timerSeconds}
                    onTimerExpire={onTimerExpire}
                    userProfile={userProfile.user1}
                  />
                ) : (
                  ""
                )}
              </div>
              {/* userinfo */}
              <div className="">
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
            <ShowMessagePopUp></ShowMessagePopUp>
            <div className="flex-center mb-4">
              {/* timer */}
              <div className="relative">
                <div className={`${isVisible ? "block" : "hidden"}`}>
                  {msgData !== undefined &&
                    loggedInUserData?.uid !== msgData.by &&
                    popUp()}
                </div>
                {questions ? (
                  <RoundTimer
                    ref={user2timer}
                    timerSeconds={timerSeconds}
                    onTimerExpire={() => {}}
                    userProfile={userProfile.user2}
                  />
                ) : (
                  ""
                )}
              </div>

              {/* userinfo */}
              {battleUserData?.map((data) =>
                data?.uid !== userData?.data?.id && data?.uid !== "" ? (
                  <>
                    {" "}
                    <div className="">
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
                  </>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

PlaywithFriendBattlequestions.propTypes = {
  questions: PropTypes.array.isRequired,
};

export default withTranslation()(PlaywithFriendBattlequestions);
