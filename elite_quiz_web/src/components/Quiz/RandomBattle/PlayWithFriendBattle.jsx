"use client";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage, rtlSupport } from "@/store/reducers/languageSlice";
import {
  battleDataClear,
  groupbattledata,
  LoadGroupBattleData,
} from "@/store/reducers/groupbattleSlice";
import {
  Loadtempdata,
  playwithfreind,
  questionsDataSuceess,
  reviewAnswerShowSuccess,
} from "@/store/reducers/tempDataSlice";
import { getImageSource, imgError, roomCodeGenerator, truncate } from "@/utils";
import { settingsData, sysConfigdata } from "@/store/reducers/settingsSlice";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Common/Breadcrumb";
import versusImg from "@/assets/images/versus.svg";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import ShareMenu from "@/components/Common/ShareMenu";
import { t } from "@/utils";
import coinimg from "@/assets/images/coin.svg";
import vsimg from "@/assets/images/vs.svg";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  getDocs,
  query,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import OTPInput from "react-otp-input";
import Image from "next/image";
import ThemeSvg from "@/components/ThemeSvg";
import cat_placeholder_img from "../../../assets/images/Elite Placeholder.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getCategoriesApi,
  getRandomQuestionsApi
} from "@/api/apiRoutes";
const PlaywithFriendBattle = () => {
  const MySwal = withReactContent(Swal);

  const db = getFirestore();

  const dispatch = useDispatch();

  // store data getz
  const userData = useSelector((state) => state.User);

  const groupBattledata = useSelector(groupbattledata);

  const selectdata = useSelector(settingsData);

  const systemconfig = useSelector(sysConfigdata);

  const appdata =
    selectdata && selectdata.filter((item) => item.type == "app_name");

  const appName = appdata && appdata?.length > 0 ? appdata[0].message : "";

  const getData = useSelector(playwithfreind);

  // Get RTL support state
  const isRtl = useSelector(rtlSupport);

  const [joinCode, setJoincode] = useState("");

  const [isCreate, setIsCreate] = useState();

  const TabPane = Tabs.TabPane;

  const [category, setCategory] = useState({
    all: "",
    category_data: "",
    category_name: "",
  });
  const [loading, setLoading] = useState(true);

  const [shouldGenerateRoomCode, setShouldGenerateRoomCode] = useState(false);

  const [selectedCoins, setSelectedCoins] = useState({ all: "", selected: "" });

  const [playwithfriends, setPlaywithfriends] = useState(false);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [showStart, setShowStart] = useState(false);

  const [dociddelete, setDocidDelete] = useState(false);

  const [battleUserData, setBattleUserData] = useState([]);

  const [joinuserpopup, setJoinUserPopup] = useState(false);

  const [EntryFeeCoin, setEntryFeeCoin] = useState(0);

  const [createdByroom, setCreatedByRoom] = useState();

  const [showCategoryNameOnJoinRoomS, setShowCategoryNameOnJoinRoomS] =
    useState("");

  const [roomCodeForJoiner, setRoomCodeForJoiner] = useState();

  const [fireCatId, setFireCatId] = useState();

  const [joinImage, setJoinImg] = useState();

  const [isloading, setIsLoading] = useState();

  // State for custom select dropdown arrow rotation
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [selectedCoin, setSelectedCoin] = useState();

  const enteryFee = groupBattledata;

  const navigate = useRouter();

  let languageid = getData.language_id;

  let category_selected =
    systemconfig && systemconfig?.battle_mode_one_category == "1"
      ? category?.category_data?.id
      : "0";

  let battle_mode_one_entry_coin_data =
    systemconfig && systemconfig?.battle_mode_one_entry_coin;

  let username =
    userData?.data?.name || userData?.data?.email || userData?.data?.mobile;

  let userprofile = userData?.data?.profile ? userData?.data?.profile : "";

  let useruid = userData?.data?.id;

  let usercoins = userData && userData?.data?.coins;

  // let cat_placeholder_img = '../../../assets/images/Elite Placeholder.svg'

  let selectedcoins = Number(selectedCoins.selected);

  let inputText = useRef(null);

  let roomiddata = groupBattledata.roomID;

  let owner = useRef({
    readyplay: null,
    ownerID: null,
    roomid: null,
  });

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
        category_data: filteredCategories[0],
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
      if (!db) {
        console.error("Firebase database not initialized");
        return;
      }
const lanId = systemconfig?.language_mode === "1" ? questionlanguageId : "";
      let documentreference = await addDoc(collection(db, "battleRoom"), {
        categoryId: categoryId,
        createdAt: serverTimestamp(),
        createdBy: uid,
        entryFee: entryFee ? entryFee : 0,
        languageId: lanId,
        readyToPlay: false,
        categoryName: category?.category_name,
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
      // created id by user to check for result screen
      LoadGroupBattleData("createdby", uid);
      LoadGroupBattleData("entryFee", entryFee);

      setShowStart(true);

      return await documentreference;
    } catch (error) {
      console.error("Error in createBattleRoom:", error);
      return null;
    }
  };

  // delete battle room
  const deleteBattleRoom = async (documentId) => {
    try {
      if (!db) {
        console.error("Firebase database not initialized");
        return;
      }

      if (!documentId) {
        console.error("No document ID provided");
        return;
      }

      await deleteDoc(doc(db, "battleRoom", documentId));
    } catch (error) {
      console.error("Error in deleteBattleRoom:", error);
    }
  };

  // find room
  const searchBattleRoom = async (languageId, categoryId) => {  
    try {
      if (!db) {
        console.error("Firebase database not initialized");
        return [];
      }
      const lanId = systemconfig?.language_mode === "1" ? languageId : "";

      const q = query(
        collection(db, "battleRoom"),
        where("languageId", "==", lanId),
        where("categoryId", "==", categoryId),
        where("roomCode", "==", ""),
        where("user2.uid", "==", "")
      );

      // Execute the query
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
      console.error("Error in searchBattleRoom:", err);
      return [];
    }
  };

  // search room
  const searchRoom = async () => {
    setIsLoading(true);

    if (selectedCoins.selected === "") {
      console.log("Please select coins and enter value in numeric value");
      return;
    }

    let inputCoincheck = inputText.current.value;
    if (Number(inputCoincheck) > Number(usercoins)) {
      toast.error(t("no_enough_coins"));
      setIsLoading(false);
      return;
    }

    try {
      let documents = await searchBattleRoom(languageid, category_selected);

      let roomdocid;

      if (documents && Array.isArray(documents) && documents.length > 0) {
        let room = documents[0];
        roomdocid = room.id;
      } else {
        roomdocid = await createRoom();
      }

      // await subscribeToBattleRoom(roomdocid);
      LoadGroupBattleData("roomid", roomdocid);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      
      const errorMessage = error?.message || error?.toString() || "An error occurred while searching for a room";
      console.log(errorMessage, "errorMessage");
    }
  };

  // redirect question screen
  const questionScreen = (roomcode, catid) => {
    navigate.push("/random-battle/play-with-friend-play");
    let data = {
      category_id: catid,
      room_id: roomcode,
    };
    Loadtempdata(data);
  };

  //create room for battle
  const createRoom = async () => {
    // battleroom joiing state
    let inputCoincheck = inputText.current.value;
    if ((usercoins < 0 || usercoins === "0") && inputCoincheck !== "0") {
      toast.error(t("no_enough_coins"));
      setIsLoading(false);
      return;
    }

    let roomCode = "";

    //genarate room code
    roomCode = roomCodeGenerator("onevsone");
    setShouldGenerateRoomCode(roomCode);
    LoadGroupBattleData("roomCode", roomCode);

    let data = await createBattleRoom(
      category_selected,
      username,
      userprofile,
      useruid,
      roomCode,
      "public",
      selectedcoins,
      languageid
    );

    const response = await getRandomQuestionsApi({
      match_id: roomCode,
      category: category_selected,
      entry_coin: selectedcoins,
    });

    if (!response?.error) {
      let questions = response.data.map((data) => {
        let question = data?.question;

        let note = data?.note;

        return {
          ...data,
          note: note,
          question: question,
          selected_answer: "",
          isAnswered: false,
        };
      });

      dispatch(questionsDataSuceess(questions)); // set questions
    }

    if (response.error) {
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }

    // popup user found with friend
    setPlaywithfriends(true);

    return data.id;
  };
  // img from firestore for joiner

  // joinroom
  const joinRoom = async (name, profile, usernameid, roomcode, coin) => {
    setRoomCodeForJoiner(roomcode);
    try {
      if (!roomcode) {
        setIsButtonClicked(false);
        setJoinUserPopup(false);
        toast.error(t("enter_room_code"));
        return;
      }

      // Check if Firebase is properly initialized
      if (!db) {
        console.error("Firebase database not initialized");
        setIsButtonClicked(false);
        setJoinUserPopup(false);
        return;
      }

      let result = await joinBattleRoomFrd(
        name,
        profile,
        usernameid,
        roomcode,
        coin
      );
      
      if (typeof result === "undefined") {
        setIsButtonClicked(false);
        setJoinUserPopup(false);
        // toast.error(t("room_code_not_valid"));
      } else {
        setJoinUserPopup(true);

        // await subscribeToBattleRoom(result.id);
        LoadGroupBattleData("roomid", result.id);

        
      }
    } catch (e) {
      console.error("Error in joinRoom:", e);
      const errorMessage = e?.message || e?.toString() || "Error joining room";
      console.log(errorMessage);
      setIsButtonClicked(false);
      setJoinUserPopup(false);
    }
  };

  // get userroom
  const getMultiUserBattleRoom = async (roomcode) => {
    try {
      if (!db) {
        console.error("Firebase database not initialized");
        return { docs: [] };
      }

      const q = query(
        collection(db, "battleRoom"),
        where("roomCode", "==", roomcode)
      );
      const typeBattle = await getDocs(q);
      return typeBattle;
    } catch (e) {
      console.error("Error in getMultiUserBattleRoom:", e);
      // Return empty docs array to prevent undefined errors
      return { docs: [] };
    }
  };

  // joinBattleRoomFrd
  const joinBattleRoomFrd = async (
    name,
    profile,
    usernameid,
    roomcode,
    coin
  ) => {
    try {
      // check roomcode is valid or not
      let mulituserbattle = await getMultiUserBattleRoom(roomcode);

      // Safety check for mulituserbattle
      if (!mulituserbattle || !mulituserbattle.docs || mulituserbattle.docs.length === 0) {
        toast.error(t("invalid_room_code"));
        return undefined;
      }

      // invalid room code
      if (mulituserbattle.docs.length === 0) {
        toast.error(t("invalid_room_code"));
        return undefined;
      }

      // // game started code
      // if (mulituserbattle.docs[0].data().readyToPlay) {
      //   toast.success(t("game_started"));
      // }

      // // not enough coins
      // if (mulituserbattle.docs[0].data().entryFee > coin) {
      //     toast.error("no_enough_coins");
      //     setIsLoading(false)
      //     return;
      // }

      //user2 update
      let entryfeecoind = mulituserbattle.docs[0].data().entryFee;
      let showCategoryNameOnJoinRoom =
        mulituserbattle.docs[0].data().categoryName;
      setEntryFeeCoin(entryfeecoind);
      setShowCategoryNameOnJoinRoomS(showCategoryNameOnJoinRoom);
      let docRef = mulituserbattle.docs[0].ref;
      let categoryID = mulituserbattle.docs[0].data().categoryId;

      const response = await getRandomQuestionsApi({
        match_id: roomcode,
        category: categoryID,
        entry_coin: entryfeecoind,
      });
      
      if (!response?.error) {
        let questions = response.data.map((data) => {
          let question = data?.question;
          let note = data?.note;
          return {
            ...data,
            note: note,
            question: question,
            selected_answer: "",
            isAnswered: false,
          };
        });

        dispatch(questionsDataSuceess(questions));
      }

      if (response.error) {
        toast.error(t("no_que_found"));
        navigate.push("/quiz-play");
        console.log(response); 
        return undefined;
      }
      
      return runTransaction(db, async (transaction) => {
        let doc = await transaction.get(docRef);
        if (!doc.exists) {
          toast.error(t("document_not_exist"));
          return undefined;
        }

        let userdetails = doc.data();

        let user2 = userdetails.user2;

        if (user2.uid === "") {
          transaction.update(docRef, {
            "user2.name": name,
            "user2.uid": usernameid,
            "user2.profileUrl": profile,
          });
        }
        return doc;
      });

      //
    } catch (e) {
      console.error("Error in joinBattleRoomFrd:", e);
      return undefined;
    }
  };

  // coins data
  const coinsdata = [
    { id: "1", num: battle_mode_one_entry_coin_data },
    { id: "2", num: battle_mode_one_entry_coin_data * 2 },
    { id: "3", num: battle_mode_one_entry_coin_data * 3 },
    { id: "4", num: battle_mode_one_entry_coin_data * 4 },
  ];

  // selected coins data
  const selectedCoinsdata = (data) => {
    setSelectedCoin(data.num);
    setSelectedCoins({ ...selectedCoins, selected: data.num });
    inputText.current.value = "";
  };

  // start button
  const startGame = (e) => {
    try {
      if (!db) {
        console.error("Firebase database not initialized");
        return;
      }

      let roomid = groupBattledata.roomID;
      
      if (!roomid) {
        console.error("No room ID found");
        return;
      }

      let docRef = doc(db, "battleRoom", roomid);

      return runTransaction(db, async (transaction) => {
        let doc = await transaction.get(docRef);
        if (!doc.exists) {
          toast.error(t("document_not_exist"));
          return;
        }

        let userdetails = doc.data();

        let user2 = userdetails.user2;

        if (user2.uid !== "") {
          transaction.update(docRef, {
            readyToPlay: true,
          });
          // subscribeToBattleRoom(roomid)
        } else {
          toast.error(t("player_not_join"));
        }

        return doc;
      });
    } catch (error) {
      console.error("Error in startGame:", error);
      const errorMessage = error?.message || error?.toString() || "Error starting game";
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    getAllData();
  }, [selectCurrentLanguage]);

  // get id from localstorage for start button
  let createdby = groupBattledata.createdBy;

  // oncancel creater room popup delete room
  const onCancelbuttondeleteBattleRoom = async (documentId) => {
    let documentRef = doc(db, "battleRoom", documentId);

    onSnapshot(
      documentRef,
      { includeMetadataChanges: true },
      (doc) => {
        if (doc.exists && doc.data()) {
          let battleroom = doc.data();

          let roomid = doc.id;

          let createdby = battleroom.createdBy;

          if (useruid == createdby) {
            MySwal.fire({
              text: t("room_deleted"),
            });
            setJoincode("");
            deleteBattleRoom(roomid);
            battleDataClear();
          }
        }
      },
      (error) => {
        console.log("err", error);
      }
    );
  };

  // snapshot listner
  useEffect(() => {
    // subsscribebattle room
    if (!roomiddata) return;
    let documentRef = doc(db, "battleRoom", roomiddata);
    onSnapshot(
      documentRef,
      { includeMetadataChanges: true },
      (doc) => {
        if (doc.exists && doc.data()) {
          let battleroom = doc.data();

          // state set doc id
          setDocidDelete(doc.id);

          let user1 = battleroom.user1;

          let user2 = battleroom.user2;

          let category_id = battleroom.categoryId;

          setFireCatId(category_id);

          let user1uid = battleroom.user1.uid;

          let user2uid = battleroom.user2.uid;

          let readytoplay = battleroom.readyToPlay;

          let createdby = battleroom.createdBy;

          if (userData?.data?.id === user1uid) {
            setBattleUserData([user2]);
          } else {
            setBattleUserData([user1]);
          }

          let check = battleroom.readyToPlay;

          let roomCode = battleroom.roomCode;

          if (check) {
            questionScreen(roomCode, category_id);
          }

          // state popup of create and join room
          if (useruid == createdby) {
            setJoinUserPopup(false);
            setPlaywithfriends(true);
          } else {
            setJoinUserPopup(true);
            setPlaywithfriends(false);
          }

          owner.current.ownerID = createdby;

          owner.current.readyplay = readytoplay;

          // delete room by owner on click cancel button
          setCreatedByRoom(createdby);

          // if user2 empty then popup will remove
          if (user2uid == "") {
            owner.current.ownerID = null;
            setJoinUserPopup(false);
          }
        } else {
          if (
            owner.current.readyplay == false &&
            owner.current.ownerID !== null
          ) {
            if (useruid !== owner.current.ownerID) {
              setJoinUserPopup(false);
              MySwal.fire({
                text: t("room_delet_owner"),
              }).then((result) => {
                if (result.isConfirmed) {
                  setIsButtonClicked(false);
                  setJoincode("");
                  owner.current.ownerID = null;
                  owner.current.readyplay = false;
                  navigate.push("/random-battle/play-with-friend-battle");
                  return false;
                }
              });
            }
          }
        }
      },
      (error) => {
        console.log("err", error);
      }
    );
  }, [groupBattledata]);

  useEffect(() => {
    setSelectedCoins({ ...selectedCoins, selected: coinsdata[0].num });
  }, []);

  // on cancel join user button
  const onCanceljoinButton = async (roomid) => {
    setJoinUserPopup(false);

    try {
      setJoinUserPopup(false);
      const documentRef = doc(db, "battleRoom", roomid);
      const battleroomSnapshot = await getDoc(documentRef);
      if (battleroomSnapshot.exists && battleroomSnapshot.data()) {
        await updateDoc(documentRef, {
          "user2.name": "",
          "user2.uid": "",
          "user2.profileUrl": "",
        });
      }

      navigate.push("/random-battle/play-with-friend-battle");
      setIsButtonClicked(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleJoinButtonClick = async () => {
    setIsButtonClicked(true);
    
    // Check if join code is from a previous room
    const isPreviousCode = await isJoinCodeFromPreviousRoom(joinCode);
    
    if (isPreviousCode) {
      toast.error(t("cannot_join_with_this_room_code"));
      setIsButtonClicked(false);
      return;
    }
    
    joinRoom(username, userprofile, useruid, joinCode, usercoins);
  };

  // select category
  const handleSelectCategory = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    let cat_data = JSON.parse(el.getAttribute("data"));
    let cat_name = el.getAttribute("name");
    setCategory({
      ...category,
      category_data: cat_data,
      category_name: cat_name,
    });
    // Close dropdown after selection
    setIsSelectOpen(false);
  };

  // Check if join code matches any previous room code
  const isJoinCodeFromPreviousRoom = async (joinCode) => {
    try {
      if (!db || !useruid || !joinCode) {
        return false;
      }

      // Query all rooms created by the current user
      const q = query(
        collection(db, "battleRoom"),
        where("createdBy", "==", useruid)
      );

      const querySnapshot = await getDocs(q);
      
      // Check if any room has the same roomCode
      const isPreviousCode = querySnapshot.docs.some(doc => {
        const roomData = doc.data();
        return roomData.roomCode === joinCode;
      });

      return isPreviousCode;
    } catch (error) {
      console.error("Error checking previous room codes:", error);
      return false;
    }
  };

  // Toggle select dropdown
  const toggleSelectDropdown = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  // share room code popUp handlers
  const handleSharePopup = () => {
    const sharePopup = document.getElementById("sharePopup");
    sharePopup.style.display = "block";
  };
  const closeSharePopup = () => {
    const sharePopup = document.getElementById("sharePopup");
    sharePopup.style.display = "none";
  };

  const currentUrl = process.env.NEXT_PUBLIC_APP_WEB_URL + navigate.asPath;
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleBatlleFeesChange = (e) => {
    // toast.error(e.target.value)
    e.preventDefault();

    const inputValue = e.target.value;

    // Check if the input is a valid number or an empty string
    if (/^\d+$/.test(inputValue) || inputValue === "") {
      // Check if the numeric value is greater than zero
      if (e.target.value >= 0) {
        // Update state or perform other actions
        // (e.g., setSelectedCoins or handle other logic)
        setSelectedCoins({ ...selectedCoins, selected: e.target.value });
      } else {
        // Show an error message for non-positive values
        setSelectedCoins({ ...selectedCoins, selected: 0 });
      }
    } else {
      // Show an error message for invalid input
      console.log("Please Enter Numeric Values");
    }
  };

  useEffect(() => {
    dispatch(reviewAnswerShowSuccess(false));
  }, []);

  useEffect(() => {
    if (fireCatId !== undefined && category.all !== "") {
      category.all.map((id) => {
        if (id.id == fireCatId) {
          setJoinImg(id.image);
        }
      });
    }
  }, [fireCatId]);

  return (
    <>
      <Breadcrumb title={t("1_vs_1_battle")} content="" contentTwo="" />
      <div className="">
        <div className="container mb-2">
          <div className="card flex-center">
            <div className="morphisam max-w-[800px] sm:!p-[40px_60px] darkSecondaryColor">
              {/* battle screen */}
              <div className="w-full">
                <h3 className="text-center text-text-color text-xl sm:text-[30px] font-bold mb-2 sm:mb-10 ">
                  {t("play_with_friend")}
                </h3>

                <Tabs
                  value={isCreate}
                  onValueChange={setIsCreate}
                  defaultValue="0"
                  className="w-full"
                >
                  <TabsList className="flex flex-wrap mb-14 h-auto">
                    <TabsTrigger
                      value="0"
                      className={`profileTabBtn `}
                      onSelect={(isSelected) => {
                        setIsCreate(isSelected);
                      }}
                    >
                      {t("create_room")}
                    </TabsTrigger>
                    <TabsTrigger value="1" className={`profileTabBtn `}>
                      {t("join_room")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="0">
                    {(() => {
                      if (
                        systemconfig &&
                        systemconfig.battle_mode_one_category == "1"
                      ) {
                        return (
                          <div className="">
                            <div className="w-full bg-white rounded-[8px] relative">
                              <form
                                aria-label="Default select example"
                                size="lg"
                                onChange={(e) => handleSelectCategory(e)}
                              >
                                <select
                                  className="selectform darkSecondaryColor appearance-none"
                                  aria-label="Default select example"
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
                                              value={cat_data?.key}
                                              no_of={cat_data?.no_of}
                                              name={cat_data?.category_name}
                                              data={JSON.stringify(cat_data)}
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
                            </form>
                          </div>
                        </div>
                        );
                      }
                    })()}
                    <div className="flex mt-3 items-center flex-wrap">
                      <span>{t("entry_fees")}:</span>
                      <ul
                        className={`ml-3 flex ps-0 items-center my-3 gap-[16px_24px] flex-wrap justify-around`}
                      >
                        {coinsdata.map((data, idx) => {
                          return (
                            <li
                              key={idx}
                              className={`selectCoin hover:cursor-pointer ${
                                data?.num == selectedcoins
                                  ? "!bg-[var(--background-2)] darkSecondaryColor"
                                  : "!bg-transparent"
                              }`}
                              onClick={(e) => selectedCoinsdata(data)}
                            >
                              <img
                                src={getImageSource(coinimg.src)}
                                className="w-7 object-center"
                                alt="coin"
                              />

                              <span>{data?.num}</span>
                            </li>
                          );
                        })}
                        <div className="selectCoin dark:bg-transparent">
                          <input
                            type="number"
                            placeholder="00"
                            min="0"
                            value={selectedCoins.selected}
                            onChange={(e) => handleBatlleFeesChange(e)}
                            // onChange={e => }
                            ref={inputText}
                            className="bg-transparent dark:border-none w-16 text-center focus-visible:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          />
                        </div>
                      </ul>
                    </div>

                    {/* coins */}
                    <div className="flex justify-start my-4 ml-0">
                      <h5 className=" text-center font-bold text-[16px]">
                        {t("current_coins")} : {usercoins < 0 ? 0 : usercoins}
                      </h5>
                    </div>

                    {/* create room */}
                    <div>
                      {isloading ? (
                        <Button
                          variant="battle"
                          size="login"
                          className="!focus:outline-none"
                        >
                          <div
                            className="w-[30px] h-[30px] border-[7px] border-[#f3f3f3] border-t-[7px] border-t-primary-color 
rounded-full animate-spin flex items-center justify-center"
                          ></div>
                        </Button>
                      ) : (
                        <Button
                        disabled ={category.all ? false : true}
                          variant="battle"
                          size="login"
                          onClick={() => searchRoom()}
                        >
                          {t("create_room")}
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="1">
                    <div>
                      <h5 className=" mb-4 text-center text-text-color  text-[20px] font-normal -mt-5">
                        {t("enter_room_code_here")}
                      </h5>
                      <OTPInput
                        value={joinCode}
                        onChange={setJoincode}
                        numInputs={6}
                        shouldAutoFocus={true}
                        containerStyle={`flex-center flex-wrap ${isRtl === "1" ? "flex-row-reverse" : ""}`}
                        renderSeparator={<span className="space"></span>}
                        renderInput={(props) => (
                          <input
                            {...props}
                            className="!w-14 !h-14 rounded-[8px] !m-2 darkSecondaryColor"
                            dir={isRtl === "1" ? "rtl" : "ltr"}
                          ></input>
                        )}
                      />
                    </div>
                    <div className=" mt-4">
                      <Button
                        variant="battle"
                        size="login"
                        onClick={handleJoinButtonClick}
                        disabled={isButtonClicked}
                      >
                        {t("join_room")}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* play with friends modal */}

      <Dialog
        open={playwithfriends}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onCancelbuttondeleteBattleRoom(dociddelete);
            setPlaywithfriends(false);
          }
        }}
      >
        <DialogContent className="dialogContent">
          <div className="relative">
            <div className="">
              <DialogHeader>
                <DialogTitle className="text-center font-sans text-[24px] font-bold text-text-color mb-5 mt-4">
                  {t("play_with_friend")}
                </DialogTitle>
              </DialogHeader>

              {playwithfriends ? (
                <>
                  <div className="">
                    <div className="">
                      <div className="h-[29px] font-semibold text-[14px] leading-[28.8px] text-center mb-5">
                        {t("ready_for_quiz")}
                      </div>
                      <div className="flex flex-col justify-center items-center bg-white relative p-4 rounded-[10px] text-textColor battleComponentBackground">
                        <h6 className="mt-1 mb-3">{t("game_start_soon")} </h6>
                        <h3 className="mt-2 mb-3 font-bold text-text-color">
                          {shouldGenerateRoomCode}
                        </h3>
                        <div className="p-4 h-12 w-auto bg-[var(--background-2)] rounded-[10px] flex items-center justify-center text-[17px] font-bold darkSecondaryColor">
                          {t("entry_fees")} &nbsp; :-&nbsp;
                          <p className="text-[15px] font-normal text-text-color inline flrx-center mb-0">{` ${selectedCoins.selected} Coins`}</p>{" "}
                        </div>

                        {process.env.NEXT_PUBLIC_SEO === "true" ? (
                          <>
                            <span
                              className=" cursor-pointer"
                              onClick={showModal}
                            >
                              <IoShareSocialOutline />
                            </span>
                            <p>{t("share_rc_frd")}</p>
                          </>
                        ) : null}
                      </div>
                      <div
                          className={`${
                            systemconfig &&
                            systemconfig?.battle_mode_one_category == "1"
                              ? "block"
                              : "hidden"
                          }`}
                        >
                          <div className="flex-center h-auto w-full mt-6 ">
                            <div className="flex mr-4 ml-1 h-12 w-11">
                              {category.category_data.image !== "" ? (
                                <Image
                                  src={category.category_data.image}
                                  width={50}
                                  className="w-[50px] h-[50px] rounded-full"
                                  height={50}
                                  alt="category"
                                ></Image>
                              ) : (
                                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                  <ThemeSvg
                                    src={cat_placeholder_img.src}
                                    width="100%"
                                    height="100%"
                                    alt="placeholder"
                                    colorMap={{
                                      "#ef5488": "var(--primary-color)",
                                      "#E85FB2": "var(--primary-color)",
                                      "#8C2968": "var(--primary-color)",
                                      "#090029": "var(--secondary-color)",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="mb-2.5 flex items-center font-bold text-lg">
                              {category.category_name}
                            </div>
                          </div>
                        </div>
                      <div className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-300 shadow-lg z-50 p-7.5">
                        {modalVisible && (
                          <ShareMenu
                            currentUrl={currentUrl}
                            shouldGenerateRoomCode={shouldGenerateRoomCode}
                            appName={appName}
                            showModal={modalVisible}
                            hideModal={() => setModalVisible(false)}
                            entryFee={groupBattledata?.entryFee}
                            categoryName={category?.category_name}
                          />
                        )}
                      </div>

                      <div className="flex items-center mx-auto mt-6 max-479:flex-col justify-around">
                        <div className="text-center relative bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]">
                          <img
                            className="w-12 h-12 rounded-full"
                            src={getImageSource(userData?.data?.profile)}
                            alt="wrteam"
                            onError={imgError}
                          />
                          <h5 className="my-3 font-bold">
                            {truncate(
                              userData?.data?.name ||
                                userData?.data?.email ||
                                userData?.data?.mobile,
                              10
                            )}
                          </h5>
                          <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                            {t("creator")}
                          </span>
                        </div>
                        {battleUserData?.map((data, index) => {
                          return (
                            <>
                              <div className="">
                                <img
                                  src={getImageSource(versusImg.src)}
                                  className="h-[200px]"
                                  alt="versus"
                                  height={300}
                                  width={107}
                                />
                              </div>
                              <div
                                className="text-center bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]"
                                key={index}
                              >
                                <img
                                  src={getImageSource(data?.profileUrl)}
                                  alt="wrteam"
                                  onError={imgError}
                                  className="w-12 h-12 rounded-full"
                                />
                                <h5 className="my-3 font-bold">
                                  {truncate(
                                    data?.name ? data?.name : t("waiting"),
                                    10
                                  )}
                                </h5>
                                <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                                  {t("joiner")}
                                </span>
                              </div>
                            </>
                          );
                        })}
                      </div>
                      {(() => {
                        if (userData?.data?.id == createdby) {
                          return (
                            <>
                              {showStart ? (
                                <div className="flex justify-center items-center">
                                  <Button
                                    variant="login"
                                    size="login"
                                    onClick={(e) => startGame(e)}
                                  >
                                    {t("start_game")}
                                  </Button>
                                </div>
                              ) : null}
                            </>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* join user popup */}
      {joinuserpopup ? (
        <Dialog
          open={joinuserpopup}
          onOpenChange={(open) => {
            if (!open) {
              setJoinUserPopup(false);
              onCanceljoinButton(roomiddata);
            }
          }}
        >
          <DialogContent className="dialogContent">
            <DialogHeader>
              <DialogTitle className="text-center font-sans text-[24px] font-bold text-text-color mb-5 mt-4">
                {t("play_with_friend")}
              </DialogTitle>
            </DialogHeader>

            <div className="">
              <div className="">
                <div className="h-[29px] font-semibold text-[14px] leading-[28.8px] text-center mb-5">
                  {t("ready_for_quiz")}
                </div>
                <div className="flex flex-col justify-center items-center bg-white relative p-4 rounded-[10px] text-textColor battleComponentBackground">
                  <h6 className="mt-1 mb-3">{t("game_start_soon")}</h6>
                  <h3 className="mt-2 mb-3 font-bold text-text-color">
                    {roomCodeForJoiner}
                  </h3>
                  <div className="p-4 h-12 w-auto bg-[var(--background-2)] rounded-[10px] flex items-center justify-center text-[17px] font-bold darkSecondaryColor">
                    {t("entry_fees")}&nbsp;:-&nbsp;
                    <p className="text-[15px] font-normal text-text-color inline flrx-center mb-0">{` ${EntryFeeCoin} Coins`}</p>{" "}
                  </div>
                </div>
                <div
                          className={`${
                            systemconfig &&
                            systemconfig?.battle_mode_one_category == "1"
                              ? "block"
                              : "hidden"
                          }`}
                        >
                          <div className="flex-center h-auto w-full mt-6 ">
                            <div className="flex mr-4 ml-1 h-12 w-11">
                              {category.category_data.image !== "" ? (
                                <Image
                                  src={category.category_data.image}
                                  width={50}
                                  className="w-[50px] h-[50px] rounded-full"
                                  height={50}
                                  alt="category"
                                ></Image>
                              ) : (
                                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                  <ThemeSvg
                                    src={cat_placeholder_img.src}
                                    width="100%"
                                    height="100%"
                                    alt="placeholder"
                                    colorMap={{
                                      "#ef5488": "var(--primary-color)",
                                      "#E85FB2": "var(--primary-color)",
                                      "#8C2968": "var(--primary-color)",
                                      "#090029": "var(--secondary-color)",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="mb-2.5 flex items-center font-bold text-lg">
                              {category.category_name}
                            </div>
                          </div>
                        </div>
                <div className="flex items-center mx-auto mt-6 max-479:flex-col justify-around">
                  <div className="text-center relative bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={getImageSource(userData?.data?.profile)}
                      alt="wrteam"
                      onError={imgError}
                    />
                    <h5 className="my-3 font-bold">
                      {" "}
                      {truncate(
                        userData?.data?.name ||
                          userData?.data?.email ||
                          userData?.data?.mobile,
                        12
                      )}
                    </h5>
                    <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                      {t("creator")}
                    </span>
                  </div>
                  {battleUserData?.map((data, index) => {
                    return (
                      <>
                        <div>
                          <img
                            src={getImageSource(versusImg.src)}
                            className="h-[200px]"
                            alt="versus"
                            height={300}
                            width={107}
                          />
                        </div>
                        <div
                          className="text-center bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]"
                          key={index}
                        >
                          <img
                            className="w-12 h-12 rounded-full"
                            src={getImageSource(data?.profileUrl)}
                            alt="wrteam"
                            onError={imgError}
                          />
                          <h5 className="my-3 font-bold">
                            {truncate(
                              data?.name ? data?.name : t("waiting"),
                              12
                            )}
                          </h5>
                          <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                            {t("joiner")}
                          </span>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
    </>
  );
};

export default withTranslation()(PlaywithFriendBattle);
