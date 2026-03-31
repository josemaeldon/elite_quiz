import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { RenderHtmlContent, deleteBookmarkData } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import Layout from "@/components/Layout/Layout";
import LeftTabProfile from "@/components/Profile/LeftTabProfile";
import { bookmarkId } from "@/store/reducers/bookmarkSlice";
import { t } from "@/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getBookmarkApi, setBookmarkApi } from "@/api/apiRoutes";
import Breadcrumb from "@/components/Common/Breadcrumb";

const Bookmark = () => {
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("Quizzone");
  const [quizzoneQue, setQuizzoneQue] = useState([]);
  const [guessthewordQue, setGuesstheWordQue] = useState([]);
  const [audioquizQue, setAudioQuizQue] = useState([]);
  const [visible, setVisible] = useState(5);

  const navigate = useRouter();

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.User);
  const systemconfig = useSelector(sysConfigdata);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  // check if the quiz mode are unable or not
  const checkBookmarData = () => {
    if (
      systemconfig.quiz_zone_mode !== "1" &&
      systemconfig.guess_the_word_question !== "1" &&
      systemconfig.audio_mode_question !== "1"
    ) {
      toast.error("No Bookmark Questions Found");
      // navigate('/profile')
    }
  };

  // set the default key if any other quiz mode is unable
  const checkForDefaultKey = () => {
    if (systemconfig.quiz_zone_mode !== "1") {
      setKey("GuesstheWord");
    }
    if (systemconfig.guess_the_word_question !== "1") {
      setKey("AudioQuestion");
    }
    if (systemconfig.audio_mode_question !== "1") {
      setKey("Quizzone");
    }
    if (
      systemconfig.guess_the_word_question !== "1" &&
      systemconfig.audio_mode_question !== "1"
    ) {
      setKey("Quizzone");
    }
  };

  useEffect(() => {
    checkBookmarData();
    checkForDefaultKey();

    const quizzonetype = 1;
    const guessthewordtype = 3;
    const audioquiztype = 4;

    const getQuizzoneBookmark = async () => {
      const response = await getBookmarkApi({ type: quizzonetype });

      if (response.error) {
        toast.error(t("no_que_found"));
        navigate.push("/");
      }

      if (response.data.length > 0) {
        let questions = response.data.map((data) => ({
          ...data,
        }));
        setQuizzoneQue(questions);
        setLoading(false);
      }

      if (response.data.length === 0) {
        setQuizzoneQue([]);
        setLoading(false);
      }
    };

    getQuizzoneBookmark();

    const getGuesstheWordBookmark = async () => {
      const response = await getBookmarkApi({ type: guessthewordtype });

      if (response.error) {
        toast.error(t("no_que_found"));
        navigate.push("/");
      }

      if (response.data.length > 0) {
        let questions = response.data.map((data) => ({
          ...data,
        }));
        setGuesstheWordQue(questions);
        setLoading(false);
      }

      if (response.data.length === 0) {
        setGuesstheWordQue([]);
        setLoading(false);
      }
    };

    getGuesstheWordBookmark();

    const getAudioQuizBookmark = async () => {
      const response = await getBookmarkApi({ type: audioquiztype });

      if (response.error) {
        toast.error(t("no_que_found"));
        navigate.push("/");
      }

      if (response.data.length > 0) {
        let questions = response.data.map((data) => ({
          ...data,
        }));
        setAudioQuizQue(questions);
        setLoading(false);
      }

      if (response.data.length === 0) {
        setAudioQuizQue([]);
        setLoading(false);
      }
    };

    getAudioQuizBookmark();
  }, []);

  // quizzone delete
  const quizzonedeleteBookmark = async (question_id, bookmark_id) => {
    const quizzonetype = 1;
    const bookmark = "0";

    const response = await setBookmarkApi({
      question_id: question_id,
      bookmark: bookmark,
      type: quizzonetype,
    });

    if (response.error) {
      const old_questions = quizzoneQue;
      setQuizzoneQue(old_questions);
      console.log(error);
    }

    if (!response?.error) {
      const new_questions = quizzoneQue.filter((data) => {
        return data.question_id !== question_id;
      });
      setQuizzoneQue(new_questions);
      toast.success(t("que_removed_bookmark"));
      deleteBookmarkData(bookmark_id);
    }
  };
  // guess the word delete
  const guesstheworddeleteBookmark = async (question_id, bookmark_id) => {
    const guessthewordtype = 3;
    const bookmark = "0";

    const response = await setBookmarkApi({
      question_id: question_id,
      bookmark: bookmark,
      type: guessthewordtype,
    });

    if (response.error) {
      const old_questions = guessthewordQue;
      setGuesstheWordQue(old_questions);
      console.log(error);
    }

    if (!response?.error) {
      const new_questions = guessthewordQue.filter((data) => {
        return data.question_id !== question_id;
      });
      setGuesstheWordQue(new_questions);
      toast.success(t("que_removed_bookmark"));
      deleteBookmarkData(bookmark_id);
    }
  };
  // audio quiz delete
  const AudioquizdeleteBookmark = async (question_id, bookmark_id) => {
    const audioquiztype = 4;
    const bookmark = "0";

    const response = await setBookmarkApi({
      question_id: question_id,
      bookmark: bookmark,
      type: audioquiztype,
    });

    if (response.error) {
      const old_questions = audioquizQue;
      setAudioQuizQue(old_questions);
      console.log(error);
    }

    if (!response?.error) {
      const new_questions = audioquizQue.filter((data) => {
        return data.question_id !== question_id;
      });
      setAudioQuizQue(new_questions);
      toast.success(t("que_removed_bookmark"));
      deleteBookmarkData(bookmark_id);
    }
  };

  const handleClick = (id) => {
    navigate.push("/play-bookmark-questions/");
    dispatch(bookmarkId(id));
  };
  return (
    <Layout>
      <div className="container px-2 my-14 ">
      {/* <div className="mb-24 max-1200:mb-20 max-767:mb-12">
            <Breadcrumb
              showBreadcrumb={true}
              title={t("profile")}
              content={t("home")}
              contentFive={t("profile")}
              />
            </div> */}
        <div className="flex flex-wrap relative between-1200-1399:flex-nowrap justify-evenly gap-9">
          <div className="h-max w-full xl:w-1/4 lg:w-2/3 md:w-full">
            <div className="darkSecondaryColor flex flex-col min-w-0 break-words  rounded-[16px] bg-[var(--background-2)] border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] max-1200:p-[12px]  relative">
              {/* Tab headers */}
              <LeftTabProfile />
            </div>
          </div>
          <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] morphisam !m-0 darkSecondaryColor">
            <div className="font-bold text-[42px] mb-8 text-center ">{t("bookmark")}</div>
            <Tabs defaultValue="quizZone">
              <TabsList className="flex flex-col sm:flex-row w-full !justify-evenly h-auto gap-y-5 ">
                <TabsTrigger
                  value="quizZone"
                  className="profileTabBtn !w-full px-20 text-[18px] !mx-0 !py-2"
                >
                  {t("quiz_zone")}
                </TabsTrigger>
                <TabsTrigger
                  value="gussTheWord"
                  className="profileTabBtn !w-full px-20 text-[18px] !mx-0 !py-2"
                >
                  {t("guess_the_word")}
                </TabsTrigger>
                <TabsTrigger
                  value="audioQuiz"
                  className="profileTabBtn !w-full px-20 text-[18px] !mx-0 !py-2"
                >
                  {t("audio_questions")}
                </TabsTrigger>
              </TabsList>
              {systemconfig.quiz_zone_mode !== "1" ? null : (
                <TabsContent value="quizZone" >
                  <>
                    {quizzoneQue?.length > 0 && (
                      <div className="bookmarkBox">
                        <span className="flex-center">
                          {t("total")} {t("bookmark")} :&nbsp;{" "}
                          <span className="font-semibold">
                            {quizzoneQue?.length}
                          </span>
                        </span>
                        <button
                          className="btnPrimary"
                          onClick={() => handleClick("1")}
                        >
                          {`${t("play")} ${t("bookmark")}`}
                        </button>
                      </div>
                    )}
                    {loading ? (
                      <div className="text-center ">
                        <Skeleton count={5} className="skeleton"/>
                      </div>
                    ) : quizzoneQue?.length > 0 ? (
                      quizzoneQue.slice(0, visible).map((question, key) => {
                        return (
                          <div className="bookmarkBox" key={key}>
                            <div className="flex item-center justify-between w-full flexCol575">
                              <div className="flex flexCol575 gap-x-8">
                                <span className=" rounded-full items-center flex justify-start  text-[20px] font-semibold text-text-color max-575:justify-center">
                                  {key + 1}
                                </span>
                                <p className="text-[#212121] flex items-center font-bold text-[1.1em] mb-0 break-words max-575:text-center">
                                  {systemconfig.latex_mode === "1" ? (
                                    <RenderHtmlContent
                                      htmlContent={question?.question}
                                    />
                                  ) : (
                                    question?.question
                                  )}
                                </p>
                              </div>
                              <div className="delete__stage">
                                <button
                                  className="btnPrimary !p-3"
                                  onClick={() =>
                                    quizzonedeleteBookmark(
                                      question?.question_id,
                                      question?.id
                                    )
                                  }
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <h4 className="text-center mb-4 mt-5">
                          {t("no_data_found")}
                        </h4>
                        <div className="w-full flex-center mt-5 ">
                          <Link href="/" className="btnPrimary ">
                            {t("back")}
                          </Link>
                        </div>
                      </>
                    )}

                    {visible < quizzoneQue?.length && (
                      <div className="w-full flex-center">
                        <div
                          id="load-more"
                          className="btnPrimary"
                          onClick={showMoreItems}
                        >
                          <span>{t("load_more")}</span>
                        </div>
                      </div>
                    )}
                  </>
                </TabsContent>
              )}
              {systemconfig.guess_the_word_question !== "1" ? null : (
                <TabsContent value="gussTheWord" >
                  <>
                    {guessthewordQue?.length > 0 && (
                      <div className="bookmarkBox">
                        <span className="flex-center">
                          {t("total")} {t("bookmark")} :&nbsp;{" "}
                          <span className="font-semibold">
                            {guessthewordQue?.length}
                          </span>
                        </span>
                        <button
                          className="btnPrimary"
                          onClick={() => handleClick("3")}
                        >
                          {`${t("play")} ${t("bookmark")}`}
                        </button>
                      </div>
                    )}
                    {loading ? (
                      <div className="text-center ">
                        <Skeleton count={5} className="skeleton"/>
                      </div>
                    ) : guessthewordQue?.length > 0 ? (
                      guessthewordQue.slice(0, visible).map((question, key) => {
                        return (
                          <div className="bookmarkBox" key={key}>
                            <div className="flex item-center justify-between w-full flexCol575">
                              <div className="flex flexCol575 gap-x-8">
                                <span className=" rounded-full items-center flex justify-start  text-[20px] font-semibold text-text-color max-575:justify-center">
                                  {key + 1}
                                </span>
                                <p className="text-[#212121] flex items-center font-bold text-[1.1em] mb-0 break-words max-575:text-center">
                                  {question?.question}
                                </p>
                              </div>
                              <div></div>
                              <div className="delete__stage">
                                <button
                                  className="btnPrimary !p-3"
                                  onClick={() =>
                                    guesstheworddeleteBookmark(
                                      question?.question_id,
                                      question?.id
                                    )
                                  }
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <h4 className="text-center mb-4 mt-5">
                          {t("no_data_found")}
                        </h4>
                        <div className="w-full flex-center mt-5">
                          <Link href="/" className="btnPrimary">
                            {t("back")}
                          </Link>
                        </div>
                      </>
                    )}

                    {visible < guessthewordQue?.length && (
                      <div className="w-full flex-center">
                        <div
                          id="load-more"
                          className="btnPrimary"
                          onClick={showMoreItems}
                        >
                          <span>{t("load_more")}</span>
                        </div>
                      </div>
                    )}
                  </>
                </TabsContent>
              )}
              {systemconfig.audio_mode_question !== "1" ? null : (
                <TabsContent value="audioQuiz" title={t("audio_questions")}>
                  <>
                    {audioquizQue?.length > 0 && (
                      <div className="bookmarkBox">
                        <span className="flex-center">
                          {t("total")} {t("bookmark")} :&nbsp;{" "}
                          <span className="font-semibold">
                            {audioquizQue?.length}
                          </span>
                        </span>
                        <button
                          className="btnPrimary"
                          onClick={() => handleClick("4")}
                        >
                          {`${t("play")} ${t("bookmark")}`}
                        </button>
                      </div>
                    )}
                    {loading ? (
                      <div className="text-center ">
                        <Skeleton count={5} className="skeleton"/>
                      </div>
                    ) : audioquizQue?.length > 0 ? (
                      audioquizQue.slice(0, visible).map((question, key) => {
                        return (
                          <div className="bookmarkBox" key={key}>
                            <div className="flex item-center justify-between w-full flexCol575">
                              <div className="flex flexCol575 gap-x-8">
                                <span className=" rounded-full items-center flex justify-start  text-[20px] font-semibold text-text-color max-575:justify-center">
                                  {key + 1}
                                </span>
                                <p className="text-[#212121] flex items-center font-bold text-[1.1em] mb-0 break-words max-575:text-center">
                                  {question?.question}
                                </p>
                              </div>
                              <div className="delete__stage">
                                <button
                                  className="btnPrimary !p-3"
                                  onClick={() =>
                                    AudioquizdeleteBookmark(
                                      question?.question_id,
                                      question?.id
                                    )
                                  }
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <h4 className="text-center mb-4 mt-5">
                          {t("no_data_found")}
                        </h4>
                        <div className="w-full flex-center mt-5">
                          <Link href="/" className="btnPrimary">
                            {t("back")}
                          </Link>
                        </div>
                      </>
                    )}
                    {visible < audioquizQue?.length && (
                      <div className="w-full flex-center">
                        <div
                          id="load-more"
                          className="btnPrimary"
                          onClick={showMoreItems}
                        >
                          <span>{t("load_more")}</span>
                        </div>
                      </div>
                    )}
                  </>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(Bookmark);
