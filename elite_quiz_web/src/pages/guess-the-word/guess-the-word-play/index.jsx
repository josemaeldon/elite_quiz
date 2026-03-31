"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { resultTempDataSuccess } from "@/store/reducers/tempDataSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import { getBookmarkData } from "@/utils";
import { t } from "@/utils";
import dynamic from "next/dynamic";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { guessthewordApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const GuessthewordQuestions = lazy(() =>
  import("@/components/Quiz/Guesstheword/GuessthewordQuestions.jsx")
);
const Guessthewordplay = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const systemconfig = useSelector(sysConfigdata);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.isSubcategory !== "0") {
      getNewQuestions("subcategory", router.query.subcategory_id);
    } else {
      getNewQuestions("category", router.query.category_id);
    }
  }, [router.isReady]);

  const TIMER_SECONDS = Number(systemconfig.guess_the_word_seconds);

  const getNewQuestions = async (type, type_id) => {
    const response = await guessthewordApi({
      type: type,
      type_id: type_id,
    });
    if (!response?.error) {
      let bookmark = getBookmarkData();
        let questions_ids = Object.keys(bookmark).map((index) => {
          return bookmark[index].question_id;
        });
        let questions = response.data.map((data) => {
          let isBookmark = false;
          if (questions_ids.indexOf(data.id) >= 0) {
            isBookmark = true;
          } else {
            isBookmark = false;
          }
          return {
            ...data,
            isBookmarked: isBookmark,
            selected_answer: "",
            isAnswered: false,
          };
        });
        setQuestions(questions);
    }
    if (response.error) {
      toast.error(t("no_que_found"));
      router.push('/')
      console.log(response.error);
    }
  };

  const handleAnswerOptionClick = async (questions) => {
    setQuestions(questions);
  };

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: quizScore,
      question: questions,
      playAgain: false,
      nextlevel: false,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));

    router.push({
      pathname: `/guess-the-word/result`,
    });
  };

  return (
    <Layout>
      <Breadcrumb title={t("guess_the_word")} content="" contentTwo="" />
      <div className="container mb-2">
        <>
          {(() => {
            if (questions && questions?.length >= 0) {
              return (
                <Suspense fallback={<QuestionSkeleton />}>
                  <GuessthewordQuestions
                    questions={questions}
                    timerSeconds={TIMER_SECONDS}
                    onOptionClick={handleAnswerOptionClick}
                    onQuestionEnd={onQuestionEnd}
                    showQuestions={false}
                    showLifeLine={false}
                    isBookmarkPlay={false}
                  />
                </Suspense>
              );
            } else {
              return (
                <div className="text-center text-white">
                  <p>{t("no_que_found")}</p>
                </div>
              );
            }
          })()}
        </>
      </div>
    </Layout>
  );
};
export default withTranslation()(Guessthewordplay);
