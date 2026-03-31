"use client";
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
import { selectCurrentLanguage, rtlSupport } from "@/store/reducers/languageSlice";
import { settingsData, sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  battleDataClear,
  groupbattledata,
  LoadGroupBattleData,
} from "@/store/reducers/groupbattleSlice";
import { Loadtempdata } from "@/store/reducers/tempDataSlice";
import { getImageSource, imgError, roomCodeGenerator, truncate } from "@/utils/index";
import { websettingsData } from "@/store/reducers/webSettings";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import ShareMenu from "@/components/Common/ShareMenu";
import coinimg from "@/assets/images/coin.svg";
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
  updateDoc,
  deleteDoc,
  where,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import OTPInput from "react-otp-input";
import Image from "next/image";
import ThemeSvg from "@/components/ThemeSvg";
import cat_placeholder_img from "@/assets/images/Elite Placeholder.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createRoomApi, getCategoriesApi } from "@/api/apiRoutes";
const GroupBattle = () => {
  const MySwal = withReactContent(Swal);

  const db = getFirestore();

  // store data get
  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  const groupBattledata = useSelector(groupbattledata);

  const websettingsdata = useSelector(websettingsData);

  const selectdata = useSelector(settingsData);

  const appdata =
    selectdata && selectdata.filter((item) => item.type == "app_name");

  // website link
  const web_link_footer = websettingsdata && websettingsdata.web_link_footer;

  const appName = appdata && appdata?.length > 0 ? appdata[0].message : "";

  // Get RTL support state
  const isRtl = useSelector(rtlSupport);

  const [battleUserData, setBattleUserData] = useState([]);

  const [joinCode, setJoincode] = useState("");

  // const TabPane = Tabs.TabPane

  const [category, setCategory] = useState({
    all: "",
    category_data: "",
    category_name: "",
  });

  let playerremove = useRef(false);

  const [loading, setLoading] = useState(true);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [shouldGenerateRoomCode, setShouldGenerateRoomCode] = useState(false);

  const [selectedCoins, setSelectedCoins] = useState({ all: "", selected: "" });

  const [playwithfriends, setPlaywithfriends] = useState(false);

  const [EntryFeeCoin, setEntryFeeCoin] = useState(0);

  const [showCategoryNameOnJoinRoomS, setShowCategoryNameOnJoinRoomS] =
    useState();

  const [joinuserpopup, setJoinUserPopup] = useState(false);

  const [showStart, setShowStart] = useState(false);

  const [dociddelete, setDocidDelete] = useState(false);

  const [activeTab, setActiveTab] = useState("1");

  const [isCreate, setIsCreate] = useState();

  const battle_mode_group_entry_coin_data =
    systemconfig && systemconfig?.battle_mode_group_entry_coin;

  const [createdByroom, setCreatedByRoom] = useState();

  const [fireCatId, setFireCatId] = useState();

  const [joinImage, setJoinImg] = useState();

  const [isloading, setIsLoading] = useState();

  const [createdBy, setCreatedBy] = useState();

  // State for custom select dropdown arrow rotation
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const navigate = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [roomCodeForJoiner, setRoomCodeForJoiner] = useState();

  const currentUrl = process.env.NEXT_PUBLIC_APP_WEB_URL + navigate.asPath;

  let category_selected =
    systemconfig && systemconfig?.battle_mode_group_category == "1"
      ? category?.category_data?.id
      : "0";

  let username =
    userData?.data?.name || userData?.data?.email || userData?.data?.mobile;

  let userprofile = userData?.data?.profile ? userData?.data?.profile : "";

  let useruid = userData?.data?.id;

  let usercoins = userData && userData?.data?.coins;

  let selectedcoins = Number(selectedCoins.selected);

  let inputText = useRef(null);

  let roomiddata = groupBattledata.roomID;

  let owner = useRef({
    readyplay: null,
    ownerID: null,
    roomid: null,
  });

  // language mode

  // get category data
  const getAllData = async () => {
    const response = await getCategoriesApi({
      type: 1,
      sub_type: 3,
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
    entryFee
  ) => {
    
    try {
      let documentreference = await addDoc(
        collection(db, "multiUserBattleRoom"),
        {
          categoryId: categoryId,
          createdAt: serverTimestamp(),
          createdBy: uid,
          entryFee: entryFee ? entryFee : 0,
          readyToPlay: false,
          categoryName: category?.category_name,
          roomCode: roomCode ? roomCode : "",
          user1: {
            answers: [],
            correctAnswers: 0,
            name: name,
            profileUrl: profileUrl,
            uid: uid,
          },
          user2: {
            answers: [],
            correctAnswers: 0,
            name: "",
            profileUrl: "",
            uid: "",
          },
          user3: {
            answers: [],
            correctAnswers: 0,
            name: "",
            profileUrl: "",
            uid: "",
          },
          user4: {
            answers: [],
            correctAnswers: 0,
            name: "",
            profileUrl: "",
            uid: "",
          },
        }
      );
      // created id by user to check for result screen
      LoadGroupBattleData("createdby", uid);
      setShowStart(true);

      return await documentreference;
    } catch (error) {
      console.log("Errpr", error);
      toast.error(error?.message || error.toString());
    }
  };

  // delete battle room
  const deleteBattleRoom = async (documentId) => {
    try {
      await deleteDoc(doc(db, "multiUserBattleRoom", documentId));
    } catch (error) {
      toast.error(error?.message || error.toString());
    }
  };

  // find room
  const searchBattleRoom = async (categoryId) => {
    try {
      const q = query(
        collection(db, "multiUserBattleRoom"),
        where("categoryId", "==", '0'),
        where("roomCode", "==", ""),
        where("user2.uid", "==", "")
      );

      // Execute the query
      const userFindSnapshot = await getDocs(q);

      // Extract documents from the snapshot
      const userFindData = userFindSnapshot.docs;
      let index = userFindData.findIndex((elem) => {
        return elem.data().createdBy == useruid;
      });

      if (index !== -1) {
        deleteBattleRoom(userFindData[index].id);
        userFindData.splice(userFindData?.length, index);
      }

      return userFindData;
    } catch (err) {
      toast.error("Error getting document: " + (err?.message || err.toString()));
    }
  };

  // search room
  const searchRoom = async () => {
    LoadGroupBattleData("entryFee", selectedCoins.selected)
    setIsLoading(true);
    let inputCoincheck = inputText.current.value;
    let usercoins = userData?.data?.coins;

    if (selectedCoins.selected === "") {
      toast.error("Please select coins and enter value in numeric value");
      return;
    }

    if (Number(inputCoincheck) > Number(usercoins)) {
      toast.error(t("no_enough_coins"));
      setIsLoading(false);
      return;
    }

    try {
      let documents = await searchBattleRoom(category_selected);

      let roomdocid;

      if (documents && documents.length > 0) {
        let room = documents;
        roomdocid = room.id;
      } else {
        roomdocid = await createRoom();
      }

      LoadGroupBattleData("roomid", roomdocid);
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.message || error.toString());
      console.log(error);
      setIsLoading(false);
    }
  };

  // redirect question screen
  const questionScreen = (roomCode, roomid) => {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/quiz-play') {
      navigate.push("/");
    }else{
      navigate.push("/group-battle/group-play");
    }
    let data = {
      roomCode: roomCode,
      roomid: roomid,
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
    roomCode = roomCodeGenerator("groupbattle");

    setShouldGenerateRoomCode(roomCode);

    LoadGroupBattleData("roomCode", roomCode);

    // pass room code in sql database for fetching questions
    createRoommulti(roomCode);
    let data = await createBattleRoom(
      category_selected,
      username,
      userprofile,
      useruid,
      roomCode,
      "public",
      selectedcoins
    );
    // popup user found with friend
    setPlaywithfriends(true);

    return data.id;
  };
  // joinroom
  const joinRoom = async (name, profile, usernameid, roomcode, coin) => {
    setRoomCodeForJoiner(roomcode);
    try {
      if (!roomcode) {
        setIsButtonClicked(false);
        setJoinUserPopup(false);
        toast.error(t("enter_room_code"));
      } else {
        let result = await joinBattleRoomFrd(
          name,
          profile,
          usernameid,
          roomcode,
          coin
        );
        
        if (typeof result === "undefined" || result === 'no_coins') {
          setIsButtonClicked(false);
          setJoinUserPopup(false);
          if(result !== 'no_coins'){
            toast.error(t("room_code_not_valid"));
          }
        } else {
          setJoinUserPopup(true);
          LoadGroupBattleData("roomid", result.id);
        }
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  // get userroom
  const getMultiUserBattleRoom = async (roomcode) => {
    
    try {
      const q = query(
        collection(db, "multiUserBattleRoom"),
        where("roomCode", "==", roomcode)
      );
      const typeBattle = await getDocs(q);
      
      return typeBattle;
    } catch (e) {
      console.log("error", e);
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
      

      // // game started code
      if (mulituserbattle.docs[0].data().readyToPlay) {
        toast.success(t("game_started"));
      }

      // // not enough coins
      if (mulituserbattle.docs[0].data().entryFee > coin) {
        toast.error(t("no_enough_coins"));
        setIsLoading(false);
        return 'no_coins';
      }
      let entryfeecoind = mulituserbattle.docs[0].data().entryFee;
      let showCategoryNameOnJoinRoom =
        mulituserbattle.docs[0].data().categoryName;

      setEntryFeeCoin(entryfeecoind);
      setShowCategoryNameOnJoinRoomS(showCategoryNameOnJoinRoom);
      //user2 update
      let docRef = mulituserbattle.docs[0].ref;

      return runTransaction(db, async (transaction) => {
        let doc = await transaction.get(docRef);

        if (!doc.exists) {
          toast.error("Document does not exist!");
        }

        let userDetails = doc.data();

        let user2 = userDetails.user2;
        let user3 = userDetails.user3;
        let user4 = userDetails.user4;

        if (user2.uid === "") {
          transaction.update(docRef, {
            "user2.name": name,
            "user2.uid": usernameid,
            "user2.profileUrl": profile,
          });
        } else if (user3.uid === "") {
          transaction.update(docRef, {
            "user3.name": name,
            "user3.uid": usernameid,
            "user3.profileUrl": profile,
          });
        } else if (user4.uid === "") {
          transaction.update(docRef, {
            "user4.name": name,
            "user4.uid": usernameid,
            "user4.profileUrl": profile,
          });
        } else {
          toast.error(t("room_full"));
        }

        return doc;
      });

      //
    } catch (e) {
      console.log("error", e);
    }
  };

  // coins data
  const coinsdata = [
    { id: "1", num: battle_mode_group_entry_coin_data },
    { id: "2", num: battle_mode_group_entry_coin_data * 2 },
    { id: "3", num: battle_mode_group_entry_coin_data * 3 },
    { id: "4", num: battle_mode_group_entry_coin_data * 4 },
  ];

  // selected coins data
  const selectedCoinsdata = (data) => {
    setSelectedCoins({ ...selectedCoins, selected: data.num });
    // LoadGroupBattleData("entryFee", data.num);
    inputText.current.value = "";
  };

  // start button
  const startGame = (e) => {
    let roomId = groupBattledata.roomID;

    let docRef = doc(db, "multiUserBattleRoom", roomId);

    return runTransaction(db, async (transaction) => {
      let doc = await transaction.get(docRef);
      if (!doc.exists) {
        toast.error("Document does not exist!");
      }

      let userDetails = doc.data();

      let user2 = userDetails.user2;
      let user3 = userDetails.user3;
      let user4 = userDetails.user4;

      if (user2.uid !== "" || user3.uid !== "" || user4.uid !== "") {
        transaction.update(docRef, {
          readyToPlay: true,
        });
      } else {
        toast.error(t("player_not_join"));
      }
      return doc;
    });
  };

  // get id from localstorage for start button
  let createdby = groupBattledata.createdBy;

  // select category
  const handleSelectCategory = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];

    let cat_data = JSON.parse(el.getAttribute("data-category"));
    let cat_name = el.getAttribute("data-category-name");
    setCategory({
      ...category,
      category_data: cat_data,
      category_name: cat_name,
    });
    // Close dropdown after selection
    setIsSelectOpen(false);
  };

  // Toggle select dropdown
  const toggleSelectDropdown = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  // pass room code in sql database for fetching questions
  const createRoommulti = async(roomCode) => {

    const response = await createRoomApi({
      room_id: roomCode,
      room_type: "public",
      category: category_selected,
      entry_coin: selectedCoins.selected,
    })

    if (response.error) {
      console.log(response,"response");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const documentRef = collection(db, 'multiUserBattleRoom', roomiddata);
        if (!roomiddata) return;
        const documentRef = await doc(db, "multiUserBattleRoom", roomiddata);
        const unsubscribe = onSnapshot(
          documentRef,
          { includeMetadataChanges: true },
          (doc) => {
            if (doc.exists && doc.data()) {
              let battleroom = doc.data();

              // state set doc id
              setCreatedBy(battleroom.createdBy);
              setDocidDelete(doc.id);
              setFireCatId(battleroom.categoryId);
              let roomid = doc.id;

              let user1 = battleroom.user1;

              let user2 = battleroom.user2;

              let user3 = battleroom.user3;

              let user4 = battleroom.user4;

              let user1uid = battleroom.user1.uid;
              let user2uid = battleroom.user2.uid;

              let user3uid = battleroom.user3.uid;

              let user4uid = battleroom.user4.uid;

              let readytoplay = battleroom.readyToPlay;

              // filter user data

              // if user id is equal to login id then remove id
              if (userData?.data?.id === user1uid) {
                setBattleUserData([user2, user3, user4]);
              }

              if (userData?.data?.id === user2uid) {
                setBattleUserData([user1, user3, user4]);
              }

              if (userData?.data?.id === user3uid) {
                setBattleUserData([user1, user2, user4]);
              }

              if (userData?.data?.id === user4uid) {
                setBattleUserData([user1, user2, user3]);
              }

              // check ready to play
              let check = battleroom.readyToPlay;

              //room code
              let roomCode = battleroom.roomCode;

              // question screen
              if (check) {
                questionScreen(roomCode, roomid);
              }

              let createdby = battleroom.createdBy;

              // state popup of create and join room

              if (useruid == createdby) {
                setJoinUserPopup(false);
                setPlaywithfriends(true);
              } else {
                setJoinUserPopup(true);
                setPlaywithfriends(false);
              }

              // LoadGroupBattleData("createdby", createdby);

              owner.current.ownerID = createdby;

              owner.current.readyplay = readytoplay;

              // delete room by owner on click cancel button
              setCreatedByRoom(createdby);

              if (user2uid === "") {
                owner.current.ownerID = null;
                setJoinUserPopup(false);
              }

              const newUser = [user1, user2, user3, user4];

              newUser.forEach((elem) => {
                if (elem.obj === "") {
                  playerremove.current = true;
                }
              });
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
                      navigate.push("/group-battle");
                      return false;
                    }
                  });
                }
              }
            }
          },
          (error) => {
            console.log("Error fetching document:", error);
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
          if (userData?.data?.id == elem && playerremove) {
            navigate.push("/quiz-play"); // Navigate to the desired page

            unsubscribe();
            // LoadGroupBattleData("roomid", "");
            break; // Break the loop after calling the cleanup function
          }
        }
        // Cleanup function
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log("An error occurred:", error);
      }
    };

    fetchData();
  }, [groupBattledata, userData?.data?.id, playerremove]);

  // oncancel creater room popup delete room
  const onCancelbuttondeleteBattleRoom = async (documentId) => {
    let documentRef = doc(db, "multiUserBattleRoom", documentId);

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

  // on cancel join user button
  const onCanceljoinButton = async (roomId) => {
    try {
      setJoinUserPopup(false);
      const documentRef = doc(db, "multiUserBattleRoom", roomId);
      const battleroomSnapshot = await getDoc(documentRef);

      if (battleroomSnapshot.exists && battleroomSnapshot.data()) {
        const battleroom = battleroomSnapshot.data();
        const { user2, user3, user4 } = battleroom;
        const { uid: user2uid } = user2;
        const { uid: user3uid } = user3;
        const { uid: user4uid } = user4;

        if (user2uid === useruid) {
          await updateDoc(documentRef, {
            "user2.name": "",
            "user2.uid": "",
            "user2.profileUrl": "",
          });
          setJoincode("");
        } else if (user3uid === useruid) {
          await updateDoc(documentRef, {
            "user3.name": "",
            "user3.uid": "",
            "user3.profileUrl": "",
          });
          setJoincode("");
        } else if (user4uid === useruid) {
          await updateDoc(documentRef, {
            "user4.name": "",
            "user4.uid": "",
            "user4.profileUrl": "",
          });
          setJoincode("");
        }
      }

      navigate.push("/quiz-play");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    setSelectedCoins({ ...selectedCoins, selected: coinsdata[0].num });
    
    // LoadGroupBattleData("entryFee", coinsdata[0].num);
    // pass room code in sql database for fetching questions
  }, []);

  // Reset playerremove ref when component mounts to prevent unwanted redirects
  // This prevents the redirect to /quiz-play when user intentionally navigates back
  useEffect(() => {
    playerremove.current = false;
  }, []);

  useEffect(() => {
    getAllData();
  }, [selectCurrentLanguage]);

  // Check if join code matches any previous room code
  const isJoinCodeFromPreviousRoom = async (joinCode) => {
    try {
      if (!db || !useruid || !joinCode) {
        return false;
      }

      // Query all rooms created by the current user in multiUserBattleRoom collection
      const q = query(
        collection(db, "multiUserBattleRoom"),
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

  // share room code popUp handlers
  const handleSharePopup = () => {
    setModalVisible(true);
  };
  const closeSharePopup = () => {
    // const sharePopup = document.getElementById('sharePopup');
    // sharePopup.style.display = 'none'
    setModalVisible(false);
  };

  const handleBatlleFeesChange = (e) => {
    e.preventDefault();

    const inputValue = e.target.value;

    // Check if the input is a valid number or an empty string
    if (/^\d+$/.test(inputValue) || inputValue === "") {
      // Check if the numeric value is greater than zero
      if (e.target.value >= 0) {
        // Update state or perform other actions
        // (e.g., setSelectedCoins or handle other logic)
        setSelectedCoins({ ...selectedCoins, selected: e.target.value });
        
        // LoadGroupBattleData("entryFee", e.target.value);
      } else {
        // Show an error message for non-positive values
        setSelectedCoins({ ...selectedCoins, selected: 0 });
        // LoadGroupBattleData("entryFee", 0);
      }
    } else {
      // Show an error message for invalid input
      toast.error("Please Enter Numeric Values");
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
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
      <Breadcrumb title={t("group_battle")} content={t("")} contentTwo="" />

      <div className="container mt-2 md:mt-12">
        <div className="card flex-center">
          <div className="morphisam max-w-[800px] sm:!p-[40px_60px]   darkSecondaryColor">
            <div className="w-full">
              <h2 className="text-center text-text-color text-2xl sm:text-[30px] font-semibold sm:font-bold mb-5 sm:mb-10 ">
                {isCreate == 0
                  ? `${t("create")} ${t("group_battle")} `
                  : `${t("join")} ${t("group_battle")} `}
              </h2>
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
                    if (systemconfig.battle_mode_group_category === "1") {
                      return (
                        <div className=" ">
                          <div className="w-full bg-white rounded-[8px] relative">
                            <form onChange={(e) => handleSelectCategory(e)}>
                              <select
                                className="selectform darkSecondaryColor appearance-none"
                                aria-label="Default select example"
                                onClick={toggleSelectDropdown}
                              >
                                {loading ? (
                                  <option disabled>{t("loading")}</option>
                                ) : (
                                  <>
                                    {category.all ? (
                                      category.all.map((cat_data, key) => {
                                        const { category_name } = cat_data;
                                        return (
                                          <option
                                            key={key}
                                            value={cat_data?.key}
                                            data-no-of={cat_data?.no_of}
                                            data-category-name={
                                              cat_data?.category_name
                                            }
                                            className="dark:bg-[#352c4f]"
                                            data-category={JSON.stringify(
                                              cat_data
                                            )}
                                          >
                                            {category_name}
                                          </option>
                                        );
                                      })
                                    ) : (
                                      <option disabled>
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

                  <div className=" flex mt-3 items-center flex-wrap">
                    <span>{t("entry_fees")}:</span>
                    <ul className="ml-3 flex ps-0 items-center my-3 gap-[16px_24px] flex-wrap justify-around">
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
                              alt="coin"
                              className="w-7 object-center"
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
                          ref={inputText}
                          className="bg-transparent !border-none w-16 text-center focus-visible:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                        />
                      </div>
                    </ul>
                  </div>

                  {/* coins */}
                  <div className="flex justify-start my-4 ml-0">
                    <h5 className=" text-center font-bold text-[16px]">
                      {t("current_coins")} :{" "}
                      {userData?.data?.coins < 0 ? 0 : userData?.data?.coins}
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
                        <div className="w-[30px] h-[30px] border-[7px] border-[#f3f3f3] border-t-[7px] border-t-primary-color rounded-full animate-spin flex items-center justify-center"></div>
                      </Button>
                    ) : (
                      <Button
                        variant="battle"
                        size="login"
                        onClick={() => searchRoom()}
                        disabled ={category.all ? false : true}
                      >
                        {t("create_room")}
                      </Button>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="1">
                  <div>
                    <h5 className=" mb-4 text-center text-text-color  text-[20px] font-normal">
                      {t("enter_room_code_here")}
                    </h5>
                    <div className="">
                      <OTPInput
                        value={joinCode}
                        onChange={setJoincode}
                        numInputs={6}
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
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      {playwithfriends && (
        <Dialog
          open={playwithfriends}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              onCancelbuttondeleteBattleRoom(dociddelete);
              setPlaywithfriends(false);
            }
          }}
        >
          <DialogContent className="dialogContent w-full overflow-hidden">
            <div className="relative ">
              <DialogHeader>
                <DialogTitle className="text-center font-sans text-[24px] font-bold text-text-color mb-5 mt-4">
                  {t("play_with_friend")}
                </DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto customScrollbar max-h-[65vh]">
                <div className="flex flex-col justify-center items-center bg-white relative p-4 rounded-[10px] text-textColor battleComponentBackground">
                  <h6 className="mt-1 mb-3">{t("game_start_soon")}</h6>
                  <h3 className="mt-2 mb-3 font-bold text-text-color">
                    {shouldGenerateRoomCode}
                  </h3>
                  <div className="p-4 h-12 w-auto bg-[var(--background-2)] rounded-[10px] flex items-center justify-center text-[18px] font-normal darkSecondaryColor">
                    {t("entry_fees")} &nbsp;:-&nbsp;
                    <p className="text-[15px] font-normal text-text-color inline flrx-center mb-0">{` ${selectedCoins.selected} Coins`}</p>
                  </div>
                  
                  {process.env.NEXT_PUBLIC_SEO === "true" && (
                    <>
                      <span
                        className=" cursor-pointer"
                        onClick={handleSharePopup}
                      >
                        <IoShareSocialOutline />
                      </span>
                      <p>{t("share_rc_frd")}</p>
                    </>
                  )}
                </div>
                <div
                    className={`${
                      systemconfig &&
                      systemconfig?.battle_mode_group_category == "1"
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {/* <div className="h-[2px] w-full bg-[#eaeaeb] my-[20px] text-text-color"></div> */}
                    <div className="flex-center h-auto w-full mt-6">
                      <div className="flex mr-4 ml-1 h-12 w-11">
                        {category.category_data.image ? (
                          <img
                            src={getImageSource(category.category_data.image)}
                            alt="category"
                            className="w-[50px] h-[50px] rounded-full"
                            onError={imgError}
                          />
                        ) : (
                          <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                            <ThemeSvg
                              src={cat_placeholder_img.src}
                              width="100%"
                              height="100%"
                              alt="category"
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
                      <div className=" flex items-center font-bold text-lg">
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
                      entryFee={selectedCoins?.selected}
                      categoryName={category?.category_name}
                    />
                  )}
                </div>

                <div className="flex items-center mx-auto mt-6 flex-wrap justify-around ">
                  <div className="text-center relative bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]">
                    <img
                      src={getImageSource(userData?.data?.profile)}
                      alt="wrteam"
                      onError={imgError}
                      className="w-12 h-12 rounded-full"
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

                  {battleUserData?.map((data, index) => (
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
                        {truncate(data?.name || t("waiting"), 10)}
                      </h5>
                      <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                        {t("joiner")}
                      </span>
                    </div>
                  ))}
                </div>

                {userData?.data?.id === createdby && showStart && (
                  <div className="flex justify-center items-center">
                    <Button variant="login" size="login" onClick={startGame}>
                      {t("start_game")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
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
          <DialogContent className="dialogContent w-full overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-center">{`${t("join")} ${t(
                "Group Battle"
              )}`}</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto customScrollbar max-h-[65vh]">
              <div className="flex flex-col justify-center items-center bg-white relative p-4 rounded-[10px] text-textColor battleComponentBackground">
                <h6 className="font-bold mt-1 mb-3">{t("game_start_soon")}</h6>
                <h3 className="mt-2 mb-3">{roomCodeForJoiner}</h3>
                <div className="p-4 h-12 w-auto bg-[var(--background-2)] rounded-[10px] flex items-center justify-center text-[18px] font-normal darkSecondaryColor">
                  {t("entry_fees")}&nbsp;:-&nbsp;
                  <p className="Coins">
                    {EntryFeeCoin}&nbsp;{t("coins")}
                  </p>
                </div>
                
              </div>
              <div
                  className={`${
                    systemconfig &&
                    systemconfig?.battle_mode_group_category == "1"
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <div className="flex-center h-auto w-full mt-6 ">
                    <div className="flex mr-4 ml-1 h-12 w-11">
                      {joinImage ? (
                        <Image
                          src={joinImage}
                          width={50}
                          height={50}
                          className="w-[50px] h-[50px] rounded-full"
                          alt="category"
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] rounded overflow-hidden">
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
                      {showCategoryNameOnJoinRoomS}
                    </div>
                  </div>
                </div>
              <div className="flex items-center mx-auto mt-6 flex-wrap justify-around ">
                <div className="text-center relative bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={getImageSource(userData?.data?.profile)}
                    alt="profile"
                    onError={imgError}
                  />
                  <h5 className="my-3 font-bold">
                    {truncate(
                      userData?.data?.name ||
                        userData?.data?.email ||
                        userData?.data?.mobile,
                      12
                    )}
                  </h5>
                  <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                    {t("joiner")}
                  </span>
                </div>

                {battleUserData?.map((data, index) => (
                  <div
                    className="text-center bg-white rounded-[10px] p-3 w-[170px] h-[180px] flex-center flex-col m-2 dark:bg-[#FFFFFF0A]"
                    key={index}
                  >
                    <img
                      className="w-12 h-12 rounded-full"
                      src={getImageSource(data?.profileUrl)}
                      alt="profile"
                      onError={imgError}
                    />
                    <h5 className="my-3 font-bold">
                      {truncate(data?.name ? data?.name : t("waiting"), 10)}
                    </h5>
                    {data?.uid && createdBy && data?.uid === createdBy ? (
                      <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                        {t("creator")}
                      </span>
                    ) : (
                      <span className="bg-[#0900291a] text-text-color rounded-[10px] py-1.5 px-7 darkSecondaryColor">
                        {t("joiner")}
                      </span>
                    )}
                  </div>
                ))}
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

export default withTranslation()(GroupBattle);
