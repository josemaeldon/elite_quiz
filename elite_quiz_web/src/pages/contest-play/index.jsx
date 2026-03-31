"use client";
import React, { useEffect, useState } from "react";
import { getClientTimeZone, getClientTimeZoneGMTFormat, t } from "@/utils";
import {
  LoadcontestLeaderboard,
  Loadtempdata,
  reviewAnswerShowSuccess,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Past from "@/components/Quiz/ContestPlay/Past";
import Live from "@/components/Quiz/ContestPlay/Live";
import Upcoming from "@/components/Quiz/ContestPlay/Upcoming";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getContestApi, getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
import { resetremainingSecond } from "@/store/reducers/showRemainingSeconds";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const ContestPlay = () => {
  const dispatch = useDispatch();
  //states
  const [livecontest, setLiveContest] = useState();

  const [pastcontest, setPastContest] = useState();

  const [upcoming, setUpComing] = useState();


  const navigate = useRouter();

  // store data get
  const userData = useSelector((state) => state.User);

  const timezone = getClientTimeZone();
  const gmt_format = getClientTimeZoneGMTFormat();

  const AllData = async () => {
    const getContestResponse = await getContestApi({
      timezone: timezone,
      gmt_format: gmt_format,
    })
    if (getContestResponse) {
      let liveData = getContestResponse.live_contest.data;
      setLiveContest(liveData);

      let pastData = getContestResponse.past_contest.data;
      setPastContest(pastData);

      let upcomingData = getContestResponse.upcoming_contest.data;
      setUpComing(upcomingData);
    }

    if (getContestResponse.error) {
      console.log(getContestResponse.error);
    }
  };

  //live play btn
  const playBtn = (contestid, entrycoin) => {
    if (Number(entrycoin) > Number(userData?.data?.coins)) {
      toast.error(t("no_enough_coins"));
      return false;
    }
    navigate.push({ pathname: "/contest-play/contest-play-board" });
    let data = { contest_id: contestid, entry_coin: entrycoin };
    Loadtempdata(data);

    const deductCoins = async () => {
      const response = await setUserCoinScoreApi({
        coins: "-" + entrycoin,
        title: 'contest_entry_point',
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
  };

  //past leaderboard btn
  const LeaderBoard = (contest_id) => {
    navigate.push({ pathname: "/contest-play/contest-leaderboard" });
    let data = { past_id: contest_id };
    LoadcontestLeaderboard(data);
  };

  useEffect(() => {
    AllData();
    dispatch(reviewAnswerShowSuccess(false));
  }, [selectCurrentLanguage]);

  useEffect(() => {
    dispatch(resetremainingSecond(0));
  }, [])



  
  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("contest_play")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("contest_play")}
      />
      <div className="container mt-5 my-10">
        <Tabs defaultValue="live" className="w-full ">
          <TabsList className="flex flex-wrap h-full dark:!bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)] !p-0 bg-[var(--background-2)]">
            <TabsTrigger
              value="past"
              className={`w-1/3 max-479:w-1/2 data-[state=active]:bg-primary-color data-[state=active]:text-white data-[state=active]:dark:!bg-gradient-to-r data-[state=active]:dark:!from-[var(--gradient-from)] data-[state=active]:dark:!to-[var(--gradient-to)] data-[state=active]:outline-none capitalize p-2 text-base sm:p-3 md:text-lg font-bold  border-none outline-none  data-[state=active]:!rounded-[8px] !shadow-none !rounded-[0px]`}
            >
              {t("finished")}
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className={`w-1/3 max-479:w-1/2 data-[state=active]:bg-primary-color data-[state=active]:text-white data-[state=active]:dark:!bg-gradient-to-r data-[state=active]:dark:!from-[var(--gradient-from)] data-[state=active]:dark:!to-[var(--gradient-to)] data-[state=active]:outline-none capitalize p-2 text-base sm:p-3 md:text-lg font-bold  border-none outline-none  data-[state=active]:!rounded-[8px]  !shadow-none !rounded-[0px]`}
            >
              {t("ongoing")}
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className={`w-1/3 max-479:w-1/2 data-[state=active]:bg-primary-color data-[state=active]:text-white data-[state=active]:dark:!bg-gradient-to-r data-[state=active]:dark:!from-[var(--gradient-from)] data-[state=active]:dark:!to-[var(--gradient-to)] data-[state=active]:outline-none capitalize p-2 text-base sm:p-3 md:text-lg font-bold  border-none outline-none  data-[state=active]:!rounded-[8px] !shadow-none !rounded-[0px]`}
            >
              {t("upcoming")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="past">
            <Past data={pastcontest} LeaderBoard={LeaderBoard} />
          </TabsContent>

          <TabsContent value="live">
            <Live data={livecontest} playBtn={playBtn} />
          </TabsContent>

          <TabsContent value="upcoming">
            <Upcoming data={upcoming} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContestPlay;
