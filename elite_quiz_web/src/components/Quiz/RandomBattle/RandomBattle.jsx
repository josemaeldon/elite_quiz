"use client";
import React, { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { getImageSource, imgError } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import {
  groupbattledata,
  LoadGroupBattleData,
  loadShowScoreData,
} from "@/store/reducers/groupbattleSlice";
import {
  Loadtempdata,
  playwithFrienddata,
  reviewAnswerShowSuccess,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Timer from "@/components/Common/Timer";
import { FaAngleDown } from "react-icons/fa6";
import vsimg from "@/assets/images/vs.svg";
import { t } from "@/utils";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  getDocs,
  query,
  serverTimestamp,
  addDoc,
  deleteDoc,
  where,
  runTransaction,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategoriesApi } from "@/api/apiRoutes";
const RandomBattle = () => {
  // store data get
  const userData = useSelector((state) => state.User);

  const dispatch = useDispatch();

  const db = getFirestore();

  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const groupBattledata = useSelector(groupbattledata);

  const systemconfig = useSelector(sysConfigdata);

  const [category, setCategory] = useState({
    all: "",
    selected: "",
    category_name: "",
  });

  const random_battle_entry_coin = systemconfig?.battle_mode_random_entry_coin;

  const bot_image = systemconfig && systemconfig.bot_image;

  const [loading, setLoading] = useState(true);

  const [showbattle, setShowBattle] = useState(false);

  const [retrymodal, setretryModal] = useState(false);

  const [showTimer, setShowTimer] = useState(false);

  const [oldtimer, setOldTimer] = useState(false);

  // State for custom select dropdown arrow rotation
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // State to prevent multiple button clicks
  const [isSearching, setIsSearching] = useState(false);

  // userdata
  const [userdata, setUserdata] = useState({
    userName: "",
    profile: "",
  });

  const coninsUpdate = userData && Number(userData?.data?.coins);

  const child = useRef(null);

  const navigate = useRouter();
  let languageid = selectcurrentLanguage.id;

  let category_selected =
    systemconfig && systemconfig.battle_mode_random_category == "1"
      ? category.selected
      : "0";

  let username =
    userData?.data?.name || userData?.data?.email || userData?.data?.mobile;

  let userprofile = userData?.data?.profile ? userData?.data?.profile : "";

  let useruid = userData?.data?.id;

  // coins
  let entrycoins = random_battle_entry_coin && Number(random_battle_entry_coin);

  let timerseconds = Number(systemconfig?.battle_mode_random_search_duration);

  // get category data
  const getAllData = async () => {
    const response = await getCategoriesApi({
      type: 1,
      sub_type: 2,
    });

    if (!response?.error) {
      let categoires = response.data;
      // Filter the categories based on has_unlocked and is_premium
      const filteredCategories = categoires.filter((category) => {
        return category.is_premium === "0";
      });

      setCategory({
        ...category,
        all: filteredCategories,
        selected: filteredCategories[0].id,
        category_name: filteredCategories[0].category_name,
      });
      setLoading(false);
    }

    if (response.error) {
      if (response.message === "102") {
        toast.error(t("no_cat_data_found"));
      } else {
        toast.error(response.message);
      }
      setLoading(false);
    }
  };

  // select category
  const handleSelectCategory = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    let cat_id = el.getAttribute("id");
    let cat_name = el.getAttribute("name");
    setCategory({ ...category, selected: cat_id, category_name: cat_name });
    // Close dropdown after selection
    setIsSelectOpen(false);
  };

  // Toggle select dropdown
  const toggleSelectDropdown = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  // database collection with bot
  const createBattleRoomWithBot = async (
    categoryId,
    name,
    profileUrl,
    uid,
    roomCode,
    roomType,
    entryFee,
    questionlanguageId
  ) => {
    try {
      const lanId = systemconfig?.language_mode === "1" ? questionlanguageId : "";
      let documentreference = addDoc(collection(db, "battleRoom"), {
        categoryId: categoryId,
        createdAt: serverTimestamp(),
        createdBy: uid,
        entryFee: entryFee ? entryFee : 0,
        languageId: lanId,
        readyToPlay: false,
        roomCode: roomCode ? roomCode : "",
        playwithRobot: true,
        user1: {
          answers: [],
          name: name,
          points: 0,
          profileUrl: profileUrl,
          uid: uid,
          correctAnswers: 0,
        },
        user2: {
          answers: [],
          name: t("botname"),
          points: 0,
          profileUrl: bot_image,
          uid: "000",
          correctAnswers: 0,
        },
      });

      return await documentreference;
    } catch (error) {
      toast.error(error);
    }
  };

  // database collection
  const createBattleRoom = async (
    categoryId,
    name,
    profileUrl,
    uid,
    roomCode,
    roomType,
    entryFee,
    questionlanguageId
  ) => {
    try {
      const lanId = systemconfig?.language_mode === "1" ? questionlanguageId : "";
      let documentreference = addDoc(collection(db, "battleRoom"), {
        categoryId: categoryId,
        createdAt: serverTimestamp(),
        createdBy: uid,
        entryFee: entryFee ? entryFee : 0,
        languageId: lanId,
        categoryName: category?.category_name,
        readyToPlay: false,
        roomCode: roomCode ? roomCode : "",
        user1: {
          answers: [],
          name: name,
          points: 0,
          profileUrl: profileUrl,
          uid: uid,
          correctAnswers: 0,
        },
        user2: {
          answers: [],
          name: "",
          points: 0,
          profileUrl: "",
          uid: "",
          correctAnswers: 0,
        },
      });

      return await documentreference;
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  // delete battle room
  const deleteBattleRoom = async (documentId) => {
    try {
      await deleteDoc(doc(db, "battleRoom", documentId));
    } catch (error) {
      toast.error(error);
    }
  };

  // find room
  const searchBattleRoom = async (languageId, categoryId) => {
    const lanId = systemconfig?.language_mode === "1" ? languageId : "";
    try {
      const q = query(
        collection(db, "battleRoom"),
        where("languageId", "==", lanId),
        where("categoryId", "==", categoryId),
        where("roomCode", "==", ""),
        where("user2.uid", "==", "")
      );

      const userFindSnapshot = await getDocs(q);

      let userfinddata = userFindSnapshot.docs;

      let index = userfinddata.findIndex((elem) => {
        return elem.data().createdBy == useruid;
      });

      if (index !== -1) {
        deleteBattleRoom(userfinddata[index].id);
        userfinddata.splice(index, 1);
      }

      return userfinddata;
    } catch (err) {
      toast.error("Error getting document", err);
      console.log(err);
    }
  };

  // join battle room
  const joinBattleRoom = async (
    name,
    profileUrl,
    uid,
    battleRoomDocumentId
  ) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      await runTransaction(db, async (transaction) => {
        const documentSnapshot = await transaction.get(documentRef);
        if (!documentSnapshot.exists()) {
          throw new Error("Document does not exist!");
        }

        const userdetails = documentSnapshot.data();
        const { user2 } = userdetails;

        LoadGroupBattleData("totalusers", 2);

        if (user2.uid === "") {
          transaction.update(documentRef, {
            "user2.name": name,
            "user2.uid": uid,
            "user2.profileUrl": profileUrl,
          });

          return false;
        }

        return true;
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // join battle room with bot
  const joinBattleRoomWithBot = async (
    name,
    profileUrl,
    uid,
    battleRoomDocumentId
  ) => {
    try {
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      await runTransaction(db, async (transaction) => {
        const documentSnapshot = await transaction.get(documentRef);
        if (!documentSnapshot.exists()) {
          throw new Error("Document does not exist!");
        }

        const userdetails = documentSnapshot.data();
        const { user2 } = userdetails;

        LoadGroupBattleData("totalusers", 2);

        if (user2.uid === "") {
          transaction.update(documentRef, {
            "user2.name": name,
            "user2.uid": uid,
            "user2.profileUrl": profileUrl,
          });

          return false;
        }

        return true;
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // waiting seconds before match start
  const seconduserfound = () => {
    let roomid = groupBattledata.roomID;

    navigate.push({ pathname: "/random-battle/random-play" });

    let data = {
      category_id: category_selected,
      room_id: roomid,
    };

    Loadtempdata(data);
  };

  // // redirect question screen
  const TimerScreen = () => {
    setOldTimer(false);
    setShowTimer(true);
    // readytoplaytimer.current.startTimer();
  };

  // time expire
  const onTimerExpire = () => {
    let roomid = groupBattledata.roomID;
    deleteBattleRoom(roomid);
    setretryModal(true);
  };

  // subsscribebattle room
  const subscribeToBattleRoom = (battleRoomDocumentId) => {
    try {
      if (!battleRoomDocumentId) return;
      const documentRef = doc(db, "battleRoom", battleRoomDocumentId);

      const unsubscribe = onSnapshot(
        documentRef,
        { includeMetadataChanges: true },
        (doc) => {
          if (doc.exists && doc.data()) {
            const battleroom = doc.data();
            const { user2 } = battleroom;
            const userNotfound = user2.uid;

            if (userNotfound !== "") {
              setShowBattle(true);
              TimerScreen();
            } else {
              setOldTimer(true);
            }

            // for user1
            if (userData?.data?.id === battleroom.user1.uid) {
              setUserdata({
                ...userdata,
                userName: battleroom.user2.name,
                profile: battleroom.user2.profileUrl,
              });
            } else {
              setUserdata({
                ...userdata,
                userName: battleroom.user1.name,
                profile: battleroom.user1.profileUrl,
              });
            }
          }
        },
        (error) => {
          console.log("err", error);
          toast.error(error.message);
        }
      );

      // Return the unsubscribe function to clean up the listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while subscribing to the battle room.");
    }
  };

  // snapshot listner
  useEffect(() => {
    subscribeToBattleRoom();
  }, []);

  //create room for battle
  const createRoom = async () => {
    // battleroom joiing state

    if (coninsUpdate === "0" && coninsUpdate < 0) {
      setShowBattle(false);
      return;
    }

    // coins deduction
    if (userData?.data?.coins < entrycoins) {
      toast.error(t("no_enough_coins"));
      return false;
    }

    let roomCode = "";

    let data = await createBattleRoom(
      category_selected,
      username,
      userprofile,
      useruid,
      roomCode,
      "public",
      entrycoins,
      languageid
    );

    return data.id;
  };

  //create room for battle with bot
  const createRoomWithBot = async () => {
    // battleroom joiing state

    if (coninsUpdate === "0" && coninsUpdate < 0) {
      setShowBattle(false);
      return;
    }

    // coins deduction
    if (userData?.data?.coins < entrycoins) {
      toast.error(t("no_enough_coins"));
      return false;
    }

    let roomCode = "";

    let data = await createBattleRoomWithBot(
      category_selected,
      username,
      userprofile,
      useruid,
      roomCode,
      "public",
      entrycoins,
      languageid
    );

    return data.id;
  };

  // search room
  const searchRoom = async () => {
    // Prevent multiple clicks
    if (isSearching) {
      return;
    }

    setIsSearching(true);

    if (coninsUpdate === "0" && coninsUpdate < 0) {
      setShowBattle(false);
      setIsSearching(false);
      return;
    }

    // coins deduction
    if (userData?.data?.coins <= entrycoins) {
      toast.error(t("no_enough_coins"));
      setIsSearching(false);
      return false;
    }

    try {
      let documents = await searchBattleRoom(
        languageid,
        category_selected,
        username,
        userprofile,
        useruid
      );

      let roomdocid;

      if (documents && documents.length > 0) {
        let room = documents[Math.floor(Math.random() * documents?.length)];

        roomdocid = room.id;

        let searchAgain = await joinBattleRoom(
          username,
          userprofile,
          useruid,
          roomdocid
        );
        if (searchAgain) {
          searchRoom(
            languageid,
            category_selected,
            username,
            userprofile,
            useruid
          );
        } else {
          subscribeToBattleRoom(roomdocid);
        }
      } else {
        roomdocid = await createRoom();

        // createRoom();
      }
      setShowBattle(true);
      subscribeToBattleRoom(roomdocid);
      LoadGroupBattleData("roomid", roomdocid);
      setIsSearching(false);
    } catch (error) {
      toast.error(error);
      setIsSearching(false);
    }
  };

  // search room wit bot
  const searchRoomWithBot = async () => {
    // Prevent multiple clicks
    if (isSearching) {
      return;
    }

    setIsSearching(true);

    if (coninsUpdate === "0" && coninsUpdate < 0) {
      setShowBattle(false);
      setIsSearching(false);
      return;
    }

    try {
      let documents = await searchBattleRoom(
        languageid,
        category_selected,
        username,
        userprofile,
        useruid
      );

      let roomdocid;

      if (documents && documents.length > 0) {
        let room = documents[Math.floor(Math.random() * documents?.length)];

        roomdocid = room.id;

        let searchAgain = await joinBattleRoomWithBot(
          username,
          userprofile,
          useruid,
          roomdocid
        );
        if (searchAgain) {
          searchRoomWithBot(
            languageid,
            category_selected,
            username,
            userprofile,
            useruid
          );
        } else {
          subscribeToBattleRoom(roomdocid);
        }
      } else {
        roomdocid = await createRoomWithBot();
      }
      setShowBattle(true);
      subscribeToBattleRoom(roomdocid);
      LoadGroupBattleData("roomid", roomdocid);
      setIsSearching(false);
    } catch (error) {
      toast.error(error);
      console.log(error);
      setIsSearching(false);
    }
  };

  // retry play
  const retryPlay = () => {
    setretryModal(false);
    child.current.resetTimer();
    searchRoom();
    loadShowScoreData(false);
  };

  const retryPlaybot = () => {
    setretryModal(false);
    child.current.resetTimer();
    searchRoomWithBot();
    loadShowScoreData(true);
  };

  const PlaywithFriend = () => {
    navigate.push({ pathname: "/random-battle/play-with-friend-battle" });
    let data = {
      category_id: category_selected,
      language_id: languageid,
    };
    playwithFrienddata(data);
  };

  useEffect(() => {
    getAllData();
    dispatch(reviewAnswerShowSuccess(false));
  }, [selectCurrentLanguage]);

  const onBackScreen = () => {
    navigate.push("/quiz-play");
  };

  return (
    <>
      <Breadcrumb title={t("1_vs_1_battle")} content="" contentTwo="" />

      <div>
        <div className="container mt-4 sm:mt-12">
          <div className="morphisam flex flex-col md:flex-row justify-center items-center gap-4 darkSecondaryColor">
            {/* battle screen */}
            {showbattle ? (
              <div className="mx-auto md:w-2/3 w-full my-10">
                <div className="relative">
                  <div className="">
                    <div className=" text-center mb-10">
                      {oldtimer ? (
                        <Timer
                          ref={child}
                          timerSeconds={timerseconds}
                          onTimerExpire={onTimerExpire}
                        />
                      ) : (
                        ""
                      )}

                      {showTimer ? (
                        <>
                          <Timer
                            rt
                            ref={child}
                            timerSeconds={3}
                            onTimerExpire={seconduserfound}
                          />
                          <p className="text-dark mt-5">
                            {t("lets_get_started")}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex-center !justify-between max-479:flex-col">
                      <div className="bg-white p-2 md:p-4 rounded-[12px] darkSecondaryColor flex-center flex-col">
                        <img
                          className="object-contain w-24 h-24 rounded-full"
                          src={getImageSource(userData?.data?.profile)}
                          alt="wrteam"
                          onError={imgError}
                        />
                        <p className="mt-3 text-dark text-center break-all max-w-[200px]">
                          {userData?.data?.name ||
                            userData?.data?.email ||
                            userData?.data?.mobile}
                        </p>
                      </div>
                      <div className="mx-6 max-479:my-6">
                        <img
                          className="w-12 h-12 object-contain"
                          src={getImageSource(vsimg.src)}
                          alt="versus"
                        />
                      </div>
                      <div className="bg-white p-4 rounded-[12px] darkSecondaryColor flex-center flex-col">
                        <img
                          src={
                            typeof userdata.profile === "undefined"
                              ? ""
                              : getImageSource(userdata.profile)
                          }
                          alt="wrteam"
                          className="object-contain w-24 h-24 rounded-full"
                          onError={imgError}
                        />
                        <p className="mt-3 text-dark text-center break-all max-w-[200px]">
                          {typeof userdata.userName === "undefined"
                            ? "waiting..."
                            : userdata.userName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {systemconfig?.battle_mode_random === "1" ? (
                  <div className="w-full mx-3">
                    <div className="bg-white p-4 rounded-[12px] darkSecondaryColor">
                      <div className="">
                        <h3 className=" mb-3 text-xl lg:text-2xl font-bold text-text-color text-center mt-5">
                          {t("random_battle")}
                        </h3>
                        <hr />
                        <div className="flex flex-wrap align-items-center justify-evenly mb-3 mt-4">
                          <div className="">
                            <p className="m-2 sm:m-[15px] mx-auto text-[rgba(9,0,41,.502)]  !text-[16px] font-semibold">
                              {t("entry_fees")}:{" "}
                              <span className="!text-[16px] font-semibold text-text-color">
                                {entrycoins} {""}
                                {t("coins")}
                              </span>
                            </p>
                          </div>
                          <div className="">
                            <p className="m-2 sm:m-[15px] mx-auto text-[rgba(9,0,41,.502)]  !text-[16px] font-semibold">
                              {t("current_coins")}:
                              <span className="text-[16px] font-semibold text-text-color">
                                {coninsUpdate} {t("coins")}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="!px-10">
                          {(() => {
                            if (
                              systemconfig &&
                              systemconfig.battle_mode_random_category == "1"
                            ) {
                              return (
                                <div className="bg-[var(--background-2)] darkSecondaryColor  w-full rounded-[8px] relative">
                                  <select
                                    aria-label="Default select example"
                                    size="lg"
                                    className=" !bg-transparent selectform !p-3 appearance-none"
                                    onChange={(e) => handleSelectCategory(e)}
                                    onClick={toggleSelectDropdown}
                                  >
                                    {loading ? (
                                      <option>{t("loading")}</option>
                                    ) : (
                                      <>
                                        {category.all ? (
                                          category.all.map((cat_data, key) => {
                                            const { category_name } = cat_data;
                                            return (
                                              <option
                                                key={key}
                                                name={cat_data?.category_name}
                                                value={cat_data?.key}
                                                id={cat_data?.id}
                                                no_of={cat_data?.no_of}
                                                 className="dark:bg-[#352c4f]"
                                              >
                                                {category_name}
                                              </option>
                                            );
                                          })
                                        ) : (
                                          <option>
                                            {t("no_cat_data_found")}
                                          </option>
                                        )}
                                      </>
                                    )}
                                  </select>
                                  {/* Custom arrow icon with rotation */}
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <FaAngleDown 
                                      className={`text-text-color transition-transform duration-200 ${
                                        isSelectOpen ? 'rotate-180' : ''
                                      }`}
                                      size={16}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          })()}
                          <div className="">
                            <Button
                              disabled={!category.all || isSearching}
                              type="submit"
                              variant="login"
                              size="login"
                              className="font-bold max-399:p-3 max-399:mt-2 max-399:text-xs"
                              onClick={() => searchRoom()}
                            >
                              {isSearching ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  {t("searching")}
                                </div>
                              ) : (
                                t("play_now")
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {systemconfig?.battle_mode_one === "1" ? (
                  <div className="w-full mx-3">
                    <div className="bg-white p-4 rounded-[12px] darkSecondaryColor">
                      <div className="left-sec right_content">
                        <h3 className=" mb-3 text-lg lg:text-2xl font-bold text-text-color text-center mt-5">
                          {t("play_with_friend")}
                        </h3>
                        <hr />
                        <div className="flex flex-wrap align-items-center justify-evenly mb-3 mt-0 md:mt-4">
                          <div className="px-3 py-2 text-center my-1 md:my-3">
                            <p className="text-center !text-base">
                              {t("play_frd_para")}
                            </p>
                          </div>
                        </div>
                        <div className="px-10">
                          <div className="">
                            <Button
                              variant="login"
                              size="login"
                              className="font-bold max-399:px-3 max-399:text-xs"
                              onClick={() => PlaywithFriend(true)}
                            >
                              {t("play_with_friend")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {/* retry modal */}
      <Dialog
        open={retrymodal}
        onOpenChange={(open) => {
          if (!open) {
            setretryModal(false);
            onBackScreen();
          }
        }}
      >
        <DialogContent className="dialogContent">
          <DialogHeader>
            <DialogTitle className="text-center mt-10 font-normal">
              {t("no_opponent_detected")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <Button
              variant="login"
              className="w-auto"
              onClick={() => retryPlaybot()}
            >
              {t("play_with_bot")}
            </Button>
            <Button
              variant="login"
              className="w-auto"
              onClick={() => retryPlay()}
            >
              {t("retry")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default withTranslation()(RandomBattle);
