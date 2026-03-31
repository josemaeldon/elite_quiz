"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useEffect } from "react";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loadbadgedata } from "@/store/reducers/badgesSlice";
import { websettingsData } from "@/store/reducers/webSettings";
import { battleDataClear } from "@/store/reducers/groupbattleSlice";
import { useRouter } from "next/navigation";
import { getImageSource,t } from "@/utils";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getUserBadgesApi } from "@/api/apiRoutes";
import { currentAppLanguage } from "@/store/reducers/languageSlice";
import { resetremainingSecond } from "@/store/reducers/showRemainingSeconds";
import { percentageSuccess, selectedCategorySuccess, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";

const AllQuiz = () => {
  const router = useRouter();

  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  const websettingsdata = useSelector(websettingsData);

  const system_language_id = useSelector(currentAppLanguage)

  const dispatch = useDispatch();
  // quiz feature image
  const quiz_zone_icon = websettingsdata && websettingsdata.quiz_zone_icon;
  const daily_quiz_icon = websettingsdata && websettingsdata.daily_quiz_icon;
  const true_false_icon = websettingsdata && websettingsdata.true_false_icon;
  const fun_learn_icon = websettingsdata && websettingsdata.fun_learn_icon;
  const self_challange_icon =
    websettingsdata && websettingsdata.self_challange_icon;
  const contest_play_icon =
    websettingsdata && websettingsdata.contest_play_icon;
  const one_one_battle_icon =
    websettingsdata && websettingsdata.one_one_battle_icon;
  const group_battle_icon =
    websettingsdata && websettingsdata.group_battle_icon;
  const audio_question_icon =
    websettingsdata && websettingsdata.audio_question_icon;
  const math_mania_icon = websettingsdata && websettingsdata.math_mania_icon;
  const exam_icon = websettingsdata && websettingsdata.exam_icon;
  const guess_the_word_icon =
    websettingsdata && websettingsdata.guess_the_word_icon;
  const multi_match_icon = websettingsdata && websettingsdata.multi_match_icon;

  // data show
  const [data, setData] = useState([
    {
      id: 0,
      image: quiz_zone_icon,
      quizname: "quiz_zone",
      quizDesc: "select_your_favorite_zone_to_play",
      url: "/quiz-zone",
      quizzonehide: "1",
    },
    {
      id: 1,
      image: daily_quiz_icon,
      quizname: "daily_quiz",
      quizDesc: "daily_basic_new_quiz_game",
      url: "/quiz-play/daily-quiz-dashboard",
      dailyquizhide: "1",
    },
    {
      id: 2,
      image: true_false_icon,
      quizname: "true_false",
      quizDesc: "choice_your_answers",
      url: "/quiz-play/true-and-false-play",
      truefalsehide: "1",
    },

    {
      id: 3,
      image: fun_learn_icon,
      quizname: "fun_learn",
      quizDesc: "its_like_a_comprehension_game",
      url: "/fun-and-learn",
      funandlearnhide: "1",
    },
    {
      id: 4,
      image: guess_the_word_icon,
      quizname: "guess_the_word",
      quizDesc: "fun_vocabulary_game",
      url: "/guess-the-word",
      guessthewordhide: "1",
    },
    {
      id: 5,
      image: self_challange_icon,
      quizname: "self_challenge",
      quizDesc: "challenge_yourself",
      url: "/self-learning",
      selfchallengehide: "1",
    },
    {
      id: 6,
      image: contest_play_icon,
      quizname: "contest_play",
      quizDesc: "play_quiz_contest",
      url: "/contest-play",
      contestplayhide: "1",
    },
    {
      id: 7,
      image: one_one_battle_icon,
      quizname: "1_vs_1_battle",
      quizDesc: "battle_with_one_on_one",
      url: "/random-battle",
      battlequizhide: "1",
    },
    {
      id: 8,
      image: group_battle_icon,
      quizname: "group_battle",
      quizDesc: `its_a_group_quiz_battle`,
      url: "/group-battle",
      groupplayhide: "1",
    },
    {
      id: 9,
      image: audio_question_icon,
      quizname: "audio_questions",
      quizDesc: "select_your_favorite_zone_to_play",
      url: "/audio-questions",
      audioQuestionshide: "1",
    },
    {
      id: 10,
      image: math_mania_icon,
      quizname: "math_mania",
      quizDesc: "challenge_your_mind",
      url: "/math-mania",
      mathQuestionshide: "1",
    },
    {
      id: 11,
      image: exam_icon,
      quizname: "exam",
      quizDesc: "boost_your_knowledge",
      url: "/exam-module",
      examQuestionshide: "1",
    },
    {
      id: 12,
      image: multi_match_icon,
      quizname: "multi_match",
      quizDesc: "multi_select",
      url: "/multi-match-questions",
      multiMatchQuestionHide: "1",
    },
  ]);

  // redirect to page
  const redirectdata = (data) => {
    const isAuthenticated = userData.token;
    if (isAuthenticated === null) {
      router.push("/auth/login");
      toast.error("Please login first");
      return;
    }
    if (!data.disabled) {
      router.push(data.url);
    }
  };

  // hide from system settings
  const checkDisabled = () => {
    const modes = [
      {
        configProperty: "quiz_zone_mode",
        dataProperty: "quizzonehide",
      },
      {
        configProperty: "daily_quiz_mode",
        dataProperty: "dailyquizhide",
      },
      {
        configProperty: "contest_mode",
        dataProperty: "contestplayhide",
      },
      {
        configProperty: "true_false_mode",
        dataProperty: "truefalsehide",
      },
      {
        configProperty: "self_challenge_mode",
        dataProperty: "selfchallengehide",
      },
      {
        configProperty: "fun_n_learn_question",
        dataProperty: "funandlearnhide",
      },
      {
        configProperty: "guess_the_word_question",
        dataProperty: "guessthewordhide",
      },
      {
        configProperty: "battle_mode_one",
        dataProperty: "battlequizhide",
      },
      {
        configProperty: "battle_mode_group",
        dataProperty: "groupplayhide",
      },
      {
        configProperty: "audio_mode_question",
        dataProperty: "audioQuestionshide",
      },
      {
        configProperty: "maths_quiz_mode",
        dataProperty: "mathQuestionshide",
      },
      {
        configProperty: "exam_module",
        dataProperty: "examQuestionshide",
      },
      {
        configProperty: "battle_mode_random",
        dataProperty: "battle_Random_Questionshide",
      },
      {
        configProperty: "multi_match_mode",
        dataProperty: "multiMatchQuestionHide",
      },
    ];

    const newData = data.filter((item) => {
      for (const mode of modes) {
        if (
          item[mode.dataProperty] === "1" &&
          systemconfig[mode.configProperty] === "0"
        ) {
          return false;
        }
      }
      return true;
    });

    setData(newData);
  };

  useEffect(() => {
    checkDisabled();
    // badges api call and load
    if (userData?.data) {
      const userBadges = async () => {
        const response = await getUserBadgesApi();
        if (!response?.error) {
          Loadbadgedata(response.data);
        }
      };
      userBadges();
    }
  }, [userData]);


  useEffect(() => {
    //dispatch percentage success 0 to clear cash other wise it will show previous data
    dispatch(percentageSuccess(0));
    // disable battle if both one vs one and playwithfriend
    if (
      systemconfig.battle_mode_random === "0" &&
      systemconfig.battle_mode_one === "0"
    ) {
      setData((prevData) =>
        prevData.filter((quiz) => quiz.quizname !== "1 v/s 1 Battle")
      );
    }
  }, [systemconfig]);

  useEffect(() => {
    // clear local storage poins
    battleDataClear();
    // clear remaining seconds
    dispatch(resetremainingSecond(0));
    // clear selected category and sub category
    dispatch(selectedCategorySuccess({}));
    dispatch(selectedSubCategorySuccess({}));
  }, []);


let condition = process.env.NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE === "true"  ? 'filter dark:brightness-0 dark:invert' : ""

  return (
    <>
      {/* <Meta /> */}
      <Breadcrumb
        showBreadcrumb={true}
        title={t("quiz_play")}
        content={t("home")}
        contentTwo={t("quiz_play")}
      />
      <div className="Quizzone max-479:mt-8 mt-24 lg:commonMT">
        <div className="container"> 
          {data?.length === 0 ? (
            <p className="text-center">{t("noquiz")} </p>
          ) : (
            <ul className="grid max-479:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-479:gap-y-8 gap-y-20 sm:gap-y-20 gap-x-3">
              {data.map((quiz, index) => (
                <li
                onClick={() => redirectdata(quiz)}
                className={`w-full ${index === data.length - 1 && data.length % 4 === 1
                    ? "lg:col-start-2 lg:col-end-4 lg:flex lg:justify-center "
                    : ""
                  } ${index === data.length - 1 && data.length % 3 === 1
                    ? "md:col-start-2 md:col-end-3 md:flex md:justify-center"
                    : ""
                  } ${index === data.length - 1 && data.length % 2 === 1
                    ? "sm:flex sm:justify-center"
                    : ""
                  } ${index === data.length - 1 && data.length == 7
                    ? "min-1025:col-start-3"
                    : ""
                  }`}
                key={quiz?.id}
              >
                <div
                  className={`px-3 block justify-center ${index === data.length - 1 && data.length % 4 === 1
                      ? "lg:w-[calc(100%/2)]"
                      : index === data.length - 1 && data.length % 3 === 1 && data.length !== 7
                        ? "md:w-[calc(100%/1.5)]"
                        : index === data.length - 1 && data.length % 2 === 1
                          ? "sm:w-[calc(100%/1.2)]"
                          : "w-full"
                    } ${index === data.length - 1 && data.length == 7
                      ? "!w-full"
                      : ""
                    } items-center max-479:mt-12 max-479:mb-3`}
                >
                    {quiz?.disabled ? (
                      <div
                        className="mx-2 flex justify-center item-center h-36 rounded-3xl bg-[var(--background-2)]
                       text-center relative cursor-pointer flex-col shadow-[0_0_10px_0_#00000029] after:absolute
                        after:bg-primary-color after:w-32 after:h-5 after:z-[-1] after:rounded-[30px] bottom-[-5px] 2xl:after:w-[180px] "
                      >
                        <div className=" between-992-1199:mt-[-60px] between-767-910:[-60px]">
                          <img
                            className="h-20 bg-transparent "
                            src={getImageSource(quiz?.image)}
                            alt="icon"
                          />
                        </div>
                        <div className="block p-3 mt-6 max-[364]:p-[0px-8px]">
                          <h5 className="text-text-color capitalize text-xl font-bold tracking-[1px]">
                            {t(quiz?.quizname)}
                          </h5>
                          <span className="font-nunito text-sm font-normal leading-5 text-center text-text-color ">
                            {t(quiz?.quizDesc)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="mt-[-85px] absolute left-1/2  transform -translate-x-1/2 top-[44px] z-10">
                        <div className="dark:group-hover:absolute dark:group-hover:transition-opacity dark:group-hover:duration-1000  dark:group-hover:opacity-50 dark:opacity-0 dark:group-hover:bg-primary-color dark:group-hover:w-20 dark:group-hover:h-20 dark:group-hover:z-[-1] dark:group-hover:rounded-[30px]  dark:group-hover:filter-blur dark:group-hover:blur-[30px]"></div>
                          <img
                            className={`${condition} h-20 bg-transparent group-hover:scale-[1.3] group-hover:transition-all group-hover:duration-1000 dark:group-hover:after:bg-primary-color ${process.env.NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE === "true" && 'dark:filter dark:brightness-0 dark:invert'}`}
                            src={getImageSource(quiz?.image)}
                            alt="icon"
                          />
                        </div>
                      <div
                        className="group flex flex-col justify-center items-center h-44 text-center rounded-3xl border-none bg-[#a6a8aa38] relative cursor-pointer
                      bgWave max-767:h-[170px] overflow-hidden  dark:bg-[#FFFFFF18] dark:border-solid dark:border-[3px] dark:border-[#FFFFFF0A]"
                      >
                        <div className="block p-3 mt-6 max-[364]:p-[0px-8px]">
                          <h5 className="text-text-color capitalize text-xl font-bold tracking-[1px] ">
                            {t(quiz?.quizname)}
                          </h5>
                          <span className="font-nunito text-base font-normal leading-5 text-center text-text-color dark:text-[#FFFFFF80]">
                            {t(quiz?.quizDesc)}
                          </span>
                        </div>
                      </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
export default withTranslation()(AllQuiz);
