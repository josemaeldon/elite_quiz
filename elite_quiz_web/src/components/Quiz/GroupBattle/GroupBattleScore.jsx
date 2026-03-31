import {
  groupbattledata,
  battleDataClear,
} from "@/store/reducers/groupbattleSlice";
import { getImageSource, imgError } from "@/utils";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import rightTickIcon from "../../../assets/images/check-circle-score-screen.svg";
import crossIcon from "../../../assets/images/x-circle-score-screen.svg";
import vsImg from "../../../assets/images/versus.svg";
import { getBattleResultData } from "@/store/reducers/tempDataSlice";
import { setQuizCoinScoreApi } from "@/api/apiRoutes";
import { useRouter } from "next/router";
import winnerBadge from "../../../assets/images/won bedge.svg";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import rank1 from "@/assets/images/rank_1.svg";
import rank2 from "@/assets/images/rank_2.svg";
import rank3 from "@/assets/images/rank_3.svg";
import rank4 from "@/assets/images/rank_4.svg";

const GroupBattleScore = () => {
  const battleResultData = useSelector(getBattleResultData);
  const playBattledata = useSelector(groupbattledata);
  const navigate = useRouter();

  const [isTie, setIsTie] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isTwoplayer, setIsTwoplayer] = useState(true);
  const [userRank, setUserRank] = useState([]);
  const [winnerData, setWinnerData] = useState([]);
  const [otherUsersData, setOtherUsersData] = useState([]);

  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // Check if required data exists before proceeding
    if (!battleResultData || !playBattledata) {
      return;
    }

    const resultDataForApi = {
      quiz_type: battleResultData.quiz_type,
      play_questions: JSON.stringify(battleResultData.play_questions),
      match_id: battleResultData.match_id,
      joined_users_count: playBattledata.totalusers,
    };
    const quizcoinAndScore = async () => {
      const response = await setQuizCoinScoreApi(resultDataForApi);

      if (!response?.error) {
        setIsTwoplayer(
          (response.data?.user3_id == 0 ||
            response.data?.user3_id == undefined) &&
            (response.data?.user4_id == 0 ||
              response.data?.user4_id == undefined)
        );
        setUserRank(response.data.user_rank);
        setWinnerData(response.data.user_rank[response.data.winner[0]]);

        const { winner, user_rank } = response.data;

        // Check if all winners have the same correct_answer value
        setIsTie(response.data.joined_users_count == response.data.totalWinner);

        // Set other users data - exclude the first user (winner) and get 2nd, 3rd, 4th based on rank
        const sortedUserRank = Object.values(user_rank).sort(
          (a, b) => a.rank - b.rank
        );
        const nonWinners = sortedUserRank.slice(1); // Remove first user (winner) and get remaining users
        setOtherUsersData(nonWinners);

        setTotalQuestions(response.data.total_questions);
        setIsLoading(false);
        updateAllData(Object.values(response.data.user_rank), nonWinners);
      } else {
        setIsLoading(false);
      }
    };
    quizcoinAndScore();
  }, []);
  const updateAllData = (userRank, nonWinners) => {
    // Convert user_rank object to array and sort by rank
    const sortedUsers = userRank.sort((a, b) => a.rank - b.rank);

    const users = [];
    const usercount = userRank.length;

    for (let i = 0; i < usercount; i++) {
      const name = playBattledata[`user${i + 1}name`];
      const image = playBattledata[`user${i + 1}image`];
      const uid = playBattledata[`user${i + 1}uid`];

      // Check if uid is non-empty and non-null
      if (uid && uid !== "") {
        users.push({ name, image, uid });
      } else {
        console.warn(`user${i + 1}uid is missing or empty`);
      }
    }

    // Update winner data with correct name and image
    // Get the first winner from the sorted userRank array
    const winnerUser = userRank[0];
    const matchingWinner = users.find((user) => user.uid == winnerUser.user_id);

    // Update winner data with correct name and image from playBattledata
    // Use fallback to API data if playBattledata doesn't have the user
    setWinnerData((prev) => ({
      ...prev,
      name: matchingWinner ? matchingWinner.name : winnerUser.name,
      image: matchingWinner ? matchingWinner.image : winnerUser.image,
    }));

    // Update other users data with correct names and images
    const updatedOtherUsers = nonWinners.map((otherUser) => {
      const matchingUser = users.find((user) => user.uid == otherUser.user_id);
      if (matchingUser) {
        return {
          ...otherUser,
          name: matchingUser.name,
          image: matchingUser.image,
        };
      }
      return otherUser;
    });

    setOtherUsersData(updatedOtherUsers);
  };
  // updateAllData()
  const goToHome = () => {
    navigate.push("/");
  };
  const goBack = () => {
    // Clear battle data to prevent unwanted redirects when navigating back
    battleDataClear();
    navigate.push("/group-battle/");
  };

  const rankImage = (rank) => {
    let rankImage = rank1;
    if (rank == 2) {
      rankImage = rank2;
    } else if (rank == 3) {
      rankImage = rank3;
    } else if (rank == 4) {
      rankImage = rank4;
    }
    return (
      <img
        src={getImageSource(rankImage.src)}
        alt="winnerBadge"
        className="absolute bottom-0 right-0 h-[65px]"
      />
    );
  };
  return (
    <div>
      {isLoading ? (
        <ShowScoreSkeleton />
      ) : (
        <div>
          {isTwoplayer && (
            <div className="flex-center text-center w-[80%] mx-auto max-575:flex-col mt-10">
              <div className="flex flex-col gap-3" key={winnerData?.user_id}>
                <div
                  className={`break-all relative flex-center mx-auto flex-col `}
                >
                  <div className="relative">
                    <img
                      src={getImageSource(winnerData?.image)}
                      alt="user"
                      className="w-[125px] h-[125px] md:w-[150px] md:h-[150px] object-contain mb-[10px] rounded-full border-2"
                      onError={imgError}
                    />
                    {rankImage(userRank[winnerData?.user_id]?.rank)}
                  </div>
                  <p className="text-base md:text-[22px] font-bold text-text-color m-5 w-[150px] text-center">
                    {winnerData?.name}
                  </p>
                </div>
                <div className="rightWrongAnsDiv">
                  <span>
                    <img
                      src={getImageSource(rightTickIcon.src)}
                      alt="correct"
                    />
                    {winnerData?.correct_answer}
                  </span>
                  <span>
                    <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                    {totalQuestions - winnerData?.correct_answer}
                  </span>
                </div>
              </div>
              <div className="flex-center text-center w-[20%]">
                <img src={getImageSource(vsImg.src)} alt="versus" />
              </div>
              <div
                className="flex flex-col gap-3"
                key={otherUsersData[0]?.user_id}
              >
                <div
                  className={`break-all relative flex-center mx-auto flex-col `}
                >
                  <div className="relative">
                    <img
                      src={getImageSource(otherUsersData[0]?.image)}
                      alt="user"
                      className="w-[125px] h-[125px] md:w-[150px] md:h-[150px] object-contain mb-[10px] rounded-full border-2"
                      onError={imgError}
                    />
                    {rankImage(userRank[otherUsersData[0]?.user_id]?.rank)}
                  </div>
                  <p className="text-base md:text-[22px] font-bold text-text-color m-5 w-[150px] text-center ">
                    {otherUsersData[0]?.name}
                  </p>
                </div>
                <div className="rightWrongAnsDiv">
                  <span>
                    <img
                      src={getImageSource(rightTickIcon.src)}
                      alt="correct"
                    />
                    {otherUsersData[0]?.correct_answer}
                  </span>
                  <span>
                    <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                    {totalQuestions - otherUsersData[0]?.correct_answer}
                  </span>
                </div>
              </div>
            </div>
          )}
          {!isTwoplayer && (
            <div className="">
              <div className="flex-center text-center w-[80%] mx-auto max-575:flex-col">
                <div className="flex flex-col gap-3" key={winnerData?.user_id}>
                  <div
                    className={`break-all relative flex-center mx-auto flex-col `}
                  >
                    <div className="relative">
                      <img
                        src={getImageSource(winnerData?.image)}
                        alt="user"
                        className="w-[125px] h-[125px] md:w-[150px] md:h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                      {rankImage(userRank[winnerData?.user_id]?.rank)}
                    </div>
                    <p className="text-base md:text-[22px] font-bold text-text-color m-5 w-[150px] text-center">
                      {winnerData?.name}
                    </p>
                  </div>
                  <div className="rightWrongAnsDiv">
                    <span>
                      <img
                        src={getImageSource(rightTickIcon.src)}
                        alt="correct"
                      />
                      {winnerData?.correct_answer}
                    </span>
                    <span>
                      <img
                        src={getImageSource(crossIcon.src)}
                        alt="incorrect"
                      />
                      {totalQuestions - winnerData?.correct_answer}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-[80%] mx-auto mt-16">
                {otherUsersData?.map((elem, i) => (
                  <div
                    key={i}
                    className="flex justify-between mx-auto gap-3 mb-5 items-center max-767:flex-col max-767:mb-10"
                  >
                    <div
                      className={`break-all relative flex-center max-960:flex-col max-960:m-auto max-767:m-0`}
                    >
                      <div className="relative">
                        <img
                          src={getImageSource(elem?.image)}
                          alt="user"
                          className="max-960:w-[125px] max-960:h-[125px] w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                          onError={imgError}
                        />
                        {rankImage(userRank[elem?.user_id]?.rank)}
                      </div>
                      <p className="max-960:text-[18px] text-[22px] font-bold text-text-color m-5 ps-3 max-767:ps-0 max-767:!m-5 max-960:m-0 ">
                        {elem?.name}
                      </p>
                    </div>
                    <div className="rightWrongAnsDiv h-12 w-48 ">
                      <span>
                        <img
                          src={getImageSource(rightTickIcon.src)}
                          alt="correct"
                        />
                        {elem?.correct_answer}
                      </span>
                      <span>
                        <img
                          src={getImageSource(crossIcon.src)}
                          alt="incorrect"
                        />
                        {totalQuestions - elem?.correct_answer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="lifelineParantDiv justify-evenly w-[80%]">
            <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
              <button className="lifelinebtn" onClick={goToHome}>
                {t("home")}
              </button>
            </div>
            <div className="mb-3 w-full between-576-767:w-1/2 md:w-1/5 pr-2 max-767:px-2">
              <button className="lifelinebtn" onClick={goBack}>
                {t("back")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupBattleScore;
