"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb.jsx";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { getBookmarkData } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { resultTempDataSuccess } from "@/store/reducers/tempDataSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { getAudioQuestionApi } from "@/api/apiRoutes";
const AudioQuestionsDashboard = lazy(() =>
  import("@/components/Quiz/AudioQuestions/AudioQuestionsDashboard")
);
const AudioQuestionsPlay = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const systemconfig = useSelector(sysConfigdata);

  const TIMER_SECONDS = Number(systemconfig?.audio_quiz_seconds);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.isSubcategory !== "0") {
      getNewQuestions("subcategory", router.query.subcatid);
    } else {
      getNewQuestions("category", router.query.catid);
    }
  }, [router.isReady]);

  const getNewQuestions = async (type, type_id) => {
    const response = await getAudioQuestionApi({
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
      router.push("/quiz-play");
      console.log(response);
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: coins,
      quizScore: quizScore,
    };
    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await router.push("/audio-questions/result");
  };

  return (
    <Layout>
      <Breadcrumb title={t("audio_questions")} content="" contentTwo="" />
      <div className="container mb-2">
        {(() => {
          if (questions && questions?.length >= 0) {
            return (
              <Suspense  fallback={<QuestionSkeleton />}>
                <AudioQuestionsDashboard
                  questions={questions}
                  timerSeconds={TIMER_SECONDS}
                  onOptionClick={handleAnswerOptionClick}
                  onQuestionEnd={onQuestionEnd}
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
      </div>
    </Layout>
  );
};
export default withTranslation()(AudioQuestionsPlay);
