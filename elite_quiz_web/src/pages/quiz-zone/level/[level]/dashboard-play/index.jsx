"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { getBookmarkData } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  resultTempDataSuccess,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Common/Breadcrumb";
import dynamic from "next/dynamic";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
const Question = lazy(() => import("@/components/Common/Question"));
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import { getQuestionApi, getQuestionsWithoutLevelApi } from "@/api/apiRoutes";

const DashboardPlay = () => {
  const navigate = useRouter();

  const dispatch = useDispatch();

  let getData = useSelector(selecttempdata);

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const [level, setLevel] = useState(1);
  const [hasLevel, setHasLevel] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const systemconfig = useSelector(sysConfigdata);

  const TIMER_SECONDS = Number(systemconfig.quiz_zone_duration);

  useEffect(() => {
    if (!navigate.isReady) return;

    const queryHasLevel = navigate.query.hasLevel;

    if (queryHasLevel === "0" || queryHasLevel === 0) {
      // No levels - call getQuestionsWithoutLevelApi
      setHasLevel(false);
      getQuestionsWithoutLevel();
    } else if (getData) {
      // Has levels - fetch questions normally
      setHasLevel(true);
      getNewQuestions(getData.category, getData.subcategory, getData.level);
    }
  }, [navigate.isReady, navigate.query.hasLevel]);

  // Fetch questions when has_level === 0
  const getQuestionsWithoutLevel = async () => {
    setIsLoading(true);
    const isSubcategory = navigate.query.isSubcategory === "1";
    const type = isSubcategory ? "subcategory" : "category";
    const id = isSubcategory
      ? navigate.query.subcategory_id
      : navigate.query.category_id;

    const questionsResponse = await getQuestionsWithoutLevelApi({
      type: type,
      id: id,
    });

    if (!questionsResponse?.error && questionsResponse?.data?.length > 0) {
      let bookmark = getBookmarkData();
      let questions_ids = Object.keys(bookmark).map((index) => {
        return bookmark[index].question_id;
      });
      let questions = questionsResponse.data.map((data) => {
        let isBookmark = questions_ids.indexOf(data?.id) >= 0;

        return {
          ...data,
          isBookmarked: isBookmark,
          selected_answer: "",
          isAnswered: false,
        };
      });

      setQuestions(questions);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }
  };

  // Fetch questions when has_level === 1 (existing flow)
  const getNewQuestions = async (category_id, subcategory_id, level) => {
    setIsLoading(true);
    setLevel(level);
    const questionsResponse = await getQuestionApi({
      category_id: category_id,
      subcategory_id: subcategory_id !== 0 ? subcategory_id : "",
      level: level,
    });
    console.log(questionsResponse);

    if (!questionsResponse.error) {
      let bookmark = getBookmarkData();
      let questions_ids = Object.keys(bookmark).map((index) => {
        return bookmark[index].question_id;
      });
      let questions = questionsResponse.data.map((data) => {
        let isBookmark = false;
        if (questions_ids.indexOf(data?.id) >= 0) {
          isBookmark = true;
        } else {
          isBookmark = false;
        }

        let question = data?.question;
        let note = data?.note;

        return {
          ...data,
          question: question,
          note: note,
          isBookmarked: isBookmark,
          selected_answer: "",
          isAnswered: false,
        };
      });

      setQuestions(questions);
      setIsLoading(false);
    }
    if (questionsResponse.error) {
      setIsLoading(false);
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }
  };

  const onQuestionEnd = async (questionsLength) => {
    const tempData = {
      totalQuestions: questionsLength,
      currentLevel: hasLevel ? level : null,
      maxLevel: hasLevel ? getData?.maxLevel : null,
      querylevel: navigate.query.level,
      showQuestions: true,
      reviewAnswer: true,
      playAgain: true,
      nextlevel: hasLevel, // Only show next level button if has levels
      hasLevel: hasLevel,
      // Store these for "Play Again" navigation when hasLevel is false
      category_id: navigate.query.category_id || null,
      subcategory_id: navigate.query.subcategory_id || null,
      isSubcategory: navigate.query.isSubcategory || "0",
      catid: navigate.query.catid || null,
      subcatid: navigate.query.subcatid || null,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/quiz-zone/result");
  };

  return (
    <Layout>
      <Breadcrumb
        title={`${t("quiz")} ${t("play")}`}
        content=""
        contentTwo=""
      />
      <div className="dashboard">
        <div className="container mb-2">
          <div className="max-479:pt-0">
            {isLoading ? (
              <QuestionSkeleton />
            ) : questions && questions?.length > 0 ? (
              <Suspense fallback={<QuestionSkeleton />}>
                <Question
                  questions={questions}
                  timerSeconds={TIMER_SECONDS}
                  onQuestionEnd={onQuestionEnd}
                  showQuestions={true}
                  unlockedLevel={getData?.unlockedLevel}
                  currentLevel={getData?.level}
                />
              </Suspense>
            ) : (
              <div className="text-center text-white">
                <p>{t("no_que_found")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(DashboardPlay);
