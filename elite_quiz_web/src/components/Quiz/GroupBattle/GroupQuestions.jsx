"use client";
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  audioPlay,
  decryptAnswer,
  getImageSource,
  imgError,
  showAnswerStatusClass,
} from "@/utils";
import toast from "react-hot-toast";
// import { Popover, Space } from 'antd'
import { useDispatch, useSelector } from "react-redux";

import { updateUserDataInfo } from "@/store/reducers/userSlice";
import {
  groupbattledata,
  LoadGroupBattleData,
} from "@/store/reducers/groupbattleSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";
import {
  percentageSuccess,
  questionsDataSuceess,
  resultTempDataSuccess,
  setBattleResultData,
} from "@/store/reducers/tempDataSlice";
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
  runTransaction,
  getDoc,
} from "firebase/firestore";
import QuestionTopSection from "@/components/view/common/QuestionTopSection";
import ShowMessagePopUp from "@/components/messagePopUp/ShowMessagePopUpBtn";
import Image from "next/image";
import { t } from "@/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getUserCoinsApi,
  setQuizCoinScoreApi,
  setUserCoinScoreApi,
} from "@/api/apiRoutes";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";

const MySwal = withReactContent(Swal);
const battleEmojiSeconsd =
  process.env.NEXT_PUBLIC_BATTLE_EMOJI_TEXT_MILI_SECONDS;

const GroupQuestions = ({ questions: data, timerSeconds, onOptionClick }) => {
  const [questions, setQuestions] = useState(data);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [isShowAnsState, setIsShowAnsState] = useState(false);

  const dispatch = useDispatch();

  const db = getFirestore();
  const [waitforothers, setWaitforOthers] = useState(false);

  const [battleUserData, setBattleUserData] = useState([]);

  const child = useRef(null);

  const navToResult = useRef(true);
  


  const Score = useRef(0);

  const navigate = useRouter();

  // store data get
  const userData = useSelector((state) => state.User);


  const groupBattledata = useSelector(groupbattledata);



  let playerremove = useRef(false);


  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const [msgData, setMsgData] = useState();
  const [isVisible, setIsVisible] = useState(false);

  const answerOptionClicked = useRef(false);
  
  // Store original user count when battle starts
  const [originalUserCount, setOriginalUserCount] = useState(0);

  

  const addAnsweredQuestion = (item) => {
    setAnsweredQuestions({ ...answeredQuestions, [item]: true });
  };

  setTimeout(() => {
    setQuestions(data);
  }, 500);

  //firestore adding answer in doc
  let battleRoomDocumentId = groupBattledata.roomID;

  // delete battle room
  const deleteBattleRoom = async (documentId) => {
    try {
      await deleteDoc(doc(db, "multiUserBattleRoom", documentId));
    } catch (error) {
      toast.error(error?.message || error.toString());
    }
  };


  // next questions
  const setNextQuestion = async () => {
    setIsShowAnsState(false);
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions?.length) {
      setCurrentQuestion(nextQuestion);
      child.current.resetTimer();
    } else {
      let result_score = Score.current;

      let percentage = (100 * result_score) / questions?.length;

      // Check if handleAnswerOptionClick was executed
      if (!answerOptionClicked.current) {
        dispatch(questionsDataSuceess(questions));
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

  // storing dataa of points in localstorage
  const localStorageData = (
    user1name,
    user2name,
    user3name,
    user4name,
    user1image,
    user2image,
    user3image,
    user4image,
    user1uid,
    user2uid,
    user3uid,
    user4uid
  ) => {
    LoadGroupBattleData("user1name", user1name);
    LoadGroupBattleData("user2name", user2name);
    LoadGroupBattleData("user3name", user3name);
    LoadGroupBattleData("user4name", user4name);
    LoadGroupBattleData("user1image", user1image);
    LoadGroupBattleData("user2image", user2image);
    LoadGroupBattleData("user3image", user3image);
    LoadGroupBattleData("user4image", user4image);
    LoadGroupBattleData("user1uid", user1uid);
    LoadGroupBattleData("user2uid", user2uid);
    LoadGroupBattleData("user3uid", user3uid);
    LoadGroupBattleData("user4uid", user4uid);
  };

  // Add this useEffect for real-time updates
  useEffect(() => {
    if (!battleRoomDocumentId) return;

    const documentRef = doc(db, "multiUserBattleRoom", battleRoomDocumentId);
    
    const unsubscribe = onSnapshot(documentRef, (doc) => {
      if (!doc.exists()) return;

      const updatedBattleroom = doc.data();
      
      // Get all active users
      const activeUsers = [
        { uid: updatedBattleroom.user1?.uid, answers: updatedBattleroom.user1?.answers || [] },
        { uid: updatedBattleroom.user2?.uid, answers: updatedBattleroom.user2?.answers || [] },
        { uid: updatedBattleroom.user3?.uid, answers: updatedBattleroom.user3?.answers || [] },
        { uid: updatedBattleroom.user4?.uid, answers: updatedBattleroom.user4?.answers || [] }
      ].filter(user => user.uid && user.uid !== "");

      // Check if all active users have completed all questions
      const allUsersCompleted = activeUsers.every(user => 
        user.answers.length === questions.length
      );

      if (allUsersCompleted) {
        // Format and set battle result data
        const formattedData = {
          user1_id: updatedBattleroom.user1?.uid || 0,
          user2_id: updatedBattleroom.user2?.uid || 0,
          user3_id: updatedBattleroom.user3?.uid || 0,
          user4_id: updatedBattleroom.user4?.uid || 0,
          user1_data: updatedBattleroom.user1?.answers || [],
          user2_data: updatedBattleroom.user2?.answers || [],
          user3_data: updatedBattleroom.user3?.answers || [],
          user4_data: updatedBattleroom.user4?.answers || []
        };

        setBattleResultData({
          quiz_type: 1.5,
          match_id: updatedBattleroom.roomCode,
          play_questions: formattedData
        });
      }
    }, (error) => {
      console.error("Error in onSnapshot:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [battleRoomDocumentId, questions.length,isShowAnsState]);

  useEffect(() => {
    
    const currentPath = window.location.pathname;
    if(currentPath === '/group-battle/group-play' && groupBattledata.totalusers !== undefined){
      const fatchTotalusera = localStorage.getItem('totalusers');
      if(!fatchTotalusera){
        
        localStorage.setItem('totalusers', groupBattledata.totalusers);
      }
    }
    return () => {
      localStorage.removeItem('totalusers');
    }
  }, [groupBattledata]);

  // Modify submitAnswer to remove onSnapshot
  const submitAnswer = async (selected_option) => {
    try {
      const documentRef = doc(db, "multiUserBattleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef);

      if (!docSnap.exists()) {
        console.error("Battle room not found");
        return;
      }

      const battleroom = docSnap.data();

      // Create structured answer objects for each user
      const newAnswer = {
        answer: selected_option.toString(),
        id: questions[currentQuestion].id.toString()
      };

      // Get existing answers arrays
      let user1ans = battleroom.user1?.answers || [];
      let user2ans = battleroom.user2?.answers || [];
      let user3ans = battleroom.user3?.answers || [];
      let user4ans = battleroom.user4?.answers || [];

      // Update answers based on current user
      if (userData?.data?.id === battleroom.user1?.uid) {
        user1ans.push(newAnswer);
        await updateDoc(documentRef, { "user1.answers": user1ans });
      } else if (userData?.data?.id === battleroom.user2?.uid) {
        user2ans.push(newAnswer);
        await updateDoc(documentRef, { "user2.answers": user2ans });
      } else if (userData?.data?.id === battleroom.user3?.uid) {
        user3ans.push(newAnswer);
        await updateDoc(documentRef, { "user3.answers": user3ans });
      } else if (userData?.data?.id === battleroom.user4?.uid) {
        user4ans.push(newAnswer);
        await updateDoc(documentRef, { "user4.answers": user4ans });
      }

      setTimeout(() => {
        setNextQuestion();
      }, 1000);

      // Check for correct answers
      await checkCorrectAnswers(selected_option);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error?.message || error.toString());
    }
  };

  // point check
  const checkCorrectAnswers = async (option) => {
    try {
      const documentRef = doc(db, "multiUserBattleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef); // Use getDoc for fetching document

      if (docSnap.exists()) {
        const battleroom = docSnap.data();

        let user1name = battleroom?.user1?.name;
        let user2name = battleroom?.user2?.name;
        let user3name = battleroom?.user3?.name;
        let user4name = battleroom?.user4?.name;

        let user1image = battleroom?.user1?.profileUrl;
        let user2image = battleroom?.user2?.profileUrl;
        let user3image = battleroom?.user3?.profileUrl;
        let user4image = battleroom?.user4?.profileUrl;

        let user1correct = battleroom?.user1?.correctAnswers;
        let user2correct = battleroom?.user2?.correctAnswers;
        let user3correct = battleroom?.user3?.correctAnswers;
        let user4correct = battleroom?.user4?.correctAnswers;

        let user1uid = battleroom?.user1?.uid;
        let user2uid = battleroom?.user2?.uid;
        let user3uid = battleroom?.user3?.uid;
        let user4uid = battleroom?.user4?.uid;

        // Store data in local storage to get in result screen
        localStorageData(
          user1name,
          user2name,
          user3name,
          user4name,
          user1image,
          user2image,
          user3image,
          user4image,
          user1uid,
          user2uid,
          user3uid,
          user4uid
        );

        if (userData?.data?.id === battleroom?.user1?.uid) {
          let decryptedAnswer = decryptAnswer(
            questions[currentQuestion].answer,
            userData?.data?.firebase_id
          );
          if (decryptedAnswer === option) {
            // Correct answer push
            await updateDoc(documentRef, {
              "user1.correctAnswers": user1correct + 1,
            });
          }
        } else if (userData?.data?.id === battleroom?.user2?.uid) {
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
        } else if (userData?.data?.id === battleroom.user3.uid) {
          let decryptedAnswer = decryptAnswer(
            questions[currentQuestion].answer,
            userData?.data?.firebase_id
          );
          if (decryptedAnswer === option) {
            // Correct answer push
            await updateDoc(documentRef, {
              "user3.correctAnswers": user3correct + 1,
            });
          }
        } else if (userData?.data?.id === battleroom.user4.uid) {
          let decryptedAnswer = decryptAnswer(
            questions[currentQuestion].answer,
            userData?.data?.firebase_id
          );
          if (decryptedAnswer === option) {
            // Correct answer push
            await updateDoc(documentRef, {
              "user4.correctAnswers": user4correct + 1,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking correct answers:", error);
    }
  };

  // option answer status check
  const setAnswerStatusClass = (option) => {
    const currentIndex = currentQuestion;
    const currentQuestionq = questions[currentIndex];
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
      const documentRef = doc(db, "multiUserBattleRoom", battleRoomDocumentId);

      const docSnap = await getDoc(documentRef); // Use getDoc for fetching document

      if (docSnap.exists()) {
        const battleroom = docSnap.data();

        let user1ans = battleroom.user1.answers;
        let user2ans = battleroom.user2.answers;
        let user3ans = battleroom.user3.answers;
        let user4ans = battleroom.user4.answers;

        // Create structured answer object for timeout (no answer selected)
        const timeoutAnswer = {
          answer: "-1",
          id: questions[currentQuestion].id.toString()
        };

        if (userData?.data?.id === battleroom.user1.uid) {
          user1ans.push(timeoutAnswer);
          await updateDoc(documentRef, { "user1.answers": user1ans });
        } else if (userData?.data?.id === battleroom.user2.uid) {
          user2ans.push(timeoutAnswer);
          await updateDoc(documentRef, { "user2.answers": user2ans });
        } else if (userData?.data?.id === battleroom.user3.uid) {
          user3ans.push(timeoutAnswer);
          await updateDoc(documentRef, { "user3.answers": user3ans });
        } else if (userData?.data?.id === battleroom.user4.uid) {
          user4ans.push(timeoutAnswer);
          await updateDoc(documentRef, { "user4.answers": user4ans });
        }
      }
    } catch (error) {
      console.error("Error on timer expire:", error);
    } finally {
      setTimeout(() => {
        setNextQuestion();
      }, 1000);
    }
  };

  //snapshot realtime data fetch
  useEffect(() => {
    if(!db || !battleRoomDocumentId){
      navigate.push("/group-battle");
      return;
    }
    const documentRef = doc(db, "multiUserBattleRoom", battleRoomDocumentId);
    let executed = false;
    let TotalUserLength = false;

    let unsubscribe = onSnapshot(
      documentRef,
      (doc) => {
        let navigatetoresult = true;

        let waiting = false;

        if (doc.exists && doc.data()) {
          let battleroom = doc.data();

          let user1 = battleroom.user1;

          let user2 = battleroom.user2;

          let user3 = battleroom.user3;

          let user4 = battleroom.user4;

          let entryFee = battleroom.entryFee;

          LoadGroupBattleData("entryFee", entryFee);

          // set answer in localstorage

          let user1correctanswer = user1.correctAnswers;

          LoadGroupBattleData("user1CorrectAnswer", user1correctanswer);

          let user2correctanswer = user2.correctAnswers;

          LoadGroupBattleData("user2CorrectAnswer", user2correctanswer);

          let user3correctanswer = user3.correctAnswers;

          LoadGroupBattleData("user3CorrectAnswer", user3correctanswer);

          let user4correctanswer = user4.correctAnswers;

          LoadGroupBattleData("user4CorrectAnswer", user4correctanswer);

          let navigateUserData = [];

          navigateUserData = [user1, user2, user3, user4];

          setBattleUserData([user1, user2, user3, user4]);

          // if user length is less than 1
          const newUser = [user1, user2, user3, user4];

          const usersWithNonEmptyUid = newUser.filter(
            (elem) => elem.uid !== ""
          );

          if (!TotalUserLength) {
            TotalUserLength = true;
            LoadGroupBattleData("totalusers", usersWithNonEmptyUid?.length);
            // Store original user count for API calls
            setOriginalUserCount(usersWithNonEmptyUid?.length);
          }

          // here check if user enter the game coin deduct its first time check
          if (!executed) {
            executed = true;
            newUser.forEach((obj) => {
              if (
                userData?.data?.id === obj.uid &&
                obj.uid !== "" &&
                entryFee > 0
              ) {

                const deductCoins = async () => {
                  const response = await setUserCoinScoreApi({
                    coins: "-" + battleroom.entryFee,
                    title: 'played_battle',
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

          const newArray = newUser.filter(
            (obj) => Object.keys(obj.uid)?.length > 0
          );
          newUser.forEach((elem) => {
            if (elem.obj === "") {
              
              playerremove.current = true;
            }
          });
          if (newArray?.length == 1 && newArray[0]?.uid == userData?.data?.id) {

            MySwal.fire({
              title: t("everyone_left"),
              icon: "warning",
              showCancelButton: false,
              customClass: {
                confirmButton: "Swal-confirm-buttons",
                cancelButton: "Swal-cancel-buttons",
              },
              confirmButtonText: t("ok"),
            }).then((result) => {
              if(result.isConfirmed){
                newArray.forEach((obj) => {
                  if (userData?.data?.id == obj.uid && entryFee > 0) {
                   
                    const deductCoins = async () => {
                      
                      // Format battle data from Firebase for API
                      const battleDataForApi = {
                        user1_id: user1?.uid || 0,
                        user2_id: user2?.uid || 0,
                        user3_id: user3?.uid || 0,
                        user4_id: user4?.uid || 0,
                        user1_data: user1?.answers || [],
                        user2_data: user2?.answers || [],
                        user3_data: user3?.answers || [],
                        user4_data: user4?.answers || []
                      };
                      
                      // Count users who actually played (have non-empty answer data)
                      const playedUsersCount = [
                        battleDataForApi.user1_data.length > 0 ? 1 : 0,
                        battleDataForApi.user2_data.length > 0 ? 1 : 0,
                        battleDataForApi.user3_data.length > 0 ? 1 : 0,
                        battleDataForApi.user4_data.length > 0 ? 1 : 0
                      ].reduce((sum, count) => sum + count, 0);
                      const totalUsers = localStorage.getItem('totalusers');
                      
                      const response = await setQuizCoinScoreApi({
                        quiz_type: 1.5,
                        play_questions: JSON.stringify(battleDataForApi),
                        match_id: battleroom.roomCode,
                        joined_users_count: totalUsers,
                      })
                      
                      if (!response?.error) {
                        const getCoinsResponse = await getUserCoinsApi();
                        if (getCoinsResponse) {
                          updateUserDataInfo(getCoinsResponse.data);
                          setTimeout(async () => {
                            await deleteBattleRoom(battleRoomDocumentId);
                          }, 1000);
                        }
                      }
                    }
                    deductCoins();
                  }
                });
    
                navigate.push("/quiz-play");
              }
            })
          }

          //checking if every user has given all question's answer
          navigateUserData.forEach((elem) => {
            if (elem.uid != "") {
              if (elem.answers?.length < questions?.length) {
                navigatetoresult = false;
              } else if (
                elem.uid == userData?.data?.id &&
                elem.answers?.length >= questions?.length
              ) {
                child.current.pauseTimer();
                waiting = true;
              }
            }
          });

          //user submitted answer and check other users answers length
          if (waiting) {
            setWaitforOthers(true);
          }

                    //if  all user has submitted answers
          
          if (navigatetoresult && navToResult.current) {
            navToResult.current = false;
            
            const tempData = {
              totalQuestions: questions?.length,
              question: questions,
            };
            // Dispatch the action with the data
            dispatch(resultTempDataSuccess(tempData));
            
            
            setTimeout(() => {
              navigate.push("/group-battle/result");
              return;
            }, 1000);
          }
        }
      },
      (error) => {
        console.log("err", error);
      }
    );

    let alluserArray = [
      groupBattledata.user1uid,
      groupBattledata.user2uid,
      groupBattledata.user3uid,
      groupBattledata.user4uid,
    ];
    for (let i = 0; i < alluserArray?.length; i++) {
      const elem = alluserArray[i];
      if (userData?.data?.id == elem && playerremove.current) {
        
        navigate.push("/quiz-play"); // Navigate to the desired page

        unsubscribe();

        break; // Break the loop after calling the cleanup function
      }
    }

    return () => {
      // Cleanup function
      unsubscribe();
      // Clear navigation timeout to prevent memory leaks
    };
  }, [userData?.data?.id, playerremove]);

  useEffect(() => {
    checkCorrectAnswers();
  }, []);

  // Reset playerremove ref when component mounts to prevent unwanted redirects
  // This prevents the redirect to /quiz-play when user intentionally navigates back
  useEffect(() => {
    playerremove.current = false;
  }, []);

  useEffect(() => {
    if(!db || !battleRoomDocumentId){
      navigate.push("/group-battle");
      return;
    }
    return () => {
      const documentRef = doc(db, "multiUserBattleRoom", battleRoomDocumentId);

      try {
        runTransaction(db, async (transaction) => {
          let doc = await transaction.get(documentRef);
          let battleroom = doc.data();

          let user1uid = battleroom && battleroom.user1.uid;
          let user2uid = battleroom && battleroom.user2.uid;
          let user3uid = battleroom && battleroom.user3.uid;
          let user4uid = battleroom && battleroom.user4.uid;

          if (user1uid == userData?.data?.id) {
            transaction.update(documentRef, {
              "user1.name": "",
              "user1.uid": "",
              "user1.profileUrl": "",
            });
          } else if (user2uid == userData?.data?.id) {
            transaction.update(documentRef, {
              "user2.name": "",
              "user2.uid": "",
              "user2.profileUrl": "",
            });
          } else if (user3uid == userData?.data?.id) {
            transaction.update(documentRef, {
              "user3.name": "",
              "user3.uid": "",
              "user3.profileUrl": "",
            });
          } else if (user4uid == userData?.data?.id) {
            transaction.update(documentRef, {
              "user4.name": "",
              "user4.uid": "",
              "user4.profileUrl": "",
            });
          }
        });
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    };
  }, []);

  const loggedInUserData = battleUserData.find(
    (item) => item.uid === userData?.data?.id
  );

  // delete message id

  const deleteMsgId = async (messageId) => {
    // Now we receive the messageId as a parameter
    if (messageId) {
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

  // send chat message

  useEffect(() => {
    if (groupBattledata.roomID) {
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
    if (msgData !== undefined) {
      return (
        <div className="absolute bottom-[80px]  md:bottom-[120px] bg-white dark:bg-[#211A3E] dark:after:!text-[#211A3E] rounded-[6px] p-[4px_10px] left-1/2 transform -translate-x-1/2 after:content-['▼'] after:bottom-[-17px] after:left-1/2 after:transform  after:-translate-x-1/2 after:text-white after:right-[20px] after:absolute">
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

  // Check if required data exists before proceeding
  if (!groupBattledata || !groupBattledata.roomID) {
    return (
      <div className="flex-center flex-col text-center w-full mb-10">
        <QuestionSkeleton />
      </div>
    );
  }

  return (
    <React.Fragment>
      <QuestionTopSection
        corrAns=""
        inCorrAns=""
        currentQuestion={currentQuestion}
        questions={questions}
        showAnswers={false}
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

      {/* <div className='divider'>
        <hr style={{ width: '112%', backgroundColor: 'gray', height: '2px' }} />
      </div> */}
      <div className="morphisam !mb-12 darkSecondaryColor">
        <div className="flex-center my-4">
          <ShowMessagePopUp />
        </div>
        <div className=" px-6 pt-1 max-399:mt-5">
          <div className="flex justify-evenly items-center text-center flex-wrap w-full mx-auto max-399:gap-6">
            {loggedInUserData && (
              <>
                <div className="flex flex-col items-center md:flex-row gap-3 md:items-end justify-center md:pb-7">
                  <div className="relative">
                    <div className={`${isVisible ? "block" : "hidden"}`}>
                      {msgData !== undefined &&
                        loggedInUserData?.uid == msgData.by &&
                        popUp()}
                    </div>
                    <img
                      className="w-[65px] h-[65px] md:h-[100px] md:w-[100px] object-contain rounded-[50px]"
                      src={getImageSource(loggedInUserData.profileUrl)}
                      alt="wrteam"
                      onError={imgError}
                    />
                  </div>
                  <div className="relative flex flex-col items-center gap-3">
                    <p className="mt-3">
                      {loggedInUserData.name
                        ? loggedInUserData.name
                        : "Waiting..."}
                    </p>
                    <div className="userpoints">
                      <div className="flex justify-center items-center px-2 md:px-5 py-1 md:py-3 border-2 border-gray-300 rounded-[48px] gap-4 w-[100px] md:w-[160px]">
                        <span className="text-[18px] font-extrabold">
                          {loggedInUserData.correctAnswers
                            ? loggedInUserData.correctAnswers
                            : 0}{" "}
                          / <span>{questions?.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Show the rest of the data */}

            {battleUserData?.map((data) =>
              data?.uid !== userData?.data?.id && data?.uid !== "" ? (
                <>
                  <div className="flex flex-col items-center md:flex-row gap-3 md:items-end justify-center md:pb-7">
                    <div className="relative">
                      <div className={`${isVisible ? "block" : "hidden"}`}>
                        {msgData !== undefined &&
                          loggedInUserData?.uid !== data?.uid &&
                          data?.uid == msgData.by &&
                          popUp()}
                      </div>
                      <img
                        className="w-[65px] h-[65px] md:h-[100px] md:w-[100px] object-contain rounded-[50px]"
                        src={getImageSource(data?.profileUrl)}
                        alt="wrteam"
                        onError={imgError}
                      />
                    </div>
                    <div className="relative flex flex-col items-center gap-3">
                      <p className="mt-3">
                        {data?.name ? data?.name : "Waiting..."}
                      </p>
                      <div className="flex justify-center items-center px-2 md:px-5 py-1 md:py-3 border-2 border-gray-300 rounded-[48px] gap-4 w-[100px] md:w-[160px]">
                        <span className="text-[18px] font-extrabold">
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
      {/* waiting popup */}

      <Dialog
        closable={false}
        keyboard={false}
        centered
        open={waitforothers}
        onOpenChange={() => setWaitforOthers(!waitforothers)}
        footer={null}
        className="custom_modal_notify retry-modal playwithfriend"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <DialogContent className="dialogContent" aria-describedby="waiting-description">
          {waitforothers ? (
            <>
              <p id="waiting-description">{t("wait_for_other_complete")}</p>
            </>
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

GroupQuestions.propTypes = {
  questions: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(GroupQuestions);
