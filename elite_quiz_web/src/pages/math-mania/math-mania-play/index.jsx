"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { getBookmarkData } from "@/utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const MathmaniaQuestions = lazy(() =>
  import("@/components/Quiz/Mathmania/MathmaniaQuestions")
);
import { t } from "@/utils";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { getMatchQuestionsApi } from "@/api/apiRoutes";

const MathmaniaPlay = () => {
  const sysconfig = useSelector(sysConfigdata);

  const router = useRouter();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const TIMER_SECONDS = Number(sysconfig?.maths_quiz_seconds);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.isSubcategory !== "0") {
      getNewQuestions("subcategory", router.query.subcatid);
    } else {
      getNewQuestions("category", router.query.catid);
    }
  }, [router.isReady]);

  const getNewQuestions = async (type, type_id) => {
    const response = await getMatchQuestionsApi({
      type: type,
      type_id: type_id,
    });
    console.log(response);

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

        // Use \n to represent line breaks in the data

        let question = data.question;

        let note = data?.note;

        return {
          ...data,

          note: note,
          question: question,
          isBookmarked: isBookmark,
          selected_answer: "",
          isAnswered: false,
        };
      });
      setQuestions(questions);
    }

    if (response.error) {
      toast.error(t("no_que_found"));
      console.log(error);
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  return (
    <Layout>
      <Breadcrumb title={t("mathmania_play")} content="" contentTwo="" />
      <div className="container mb-2">
        {(() => {
          if (questions && questions?.length >= 0) {
            return (
              <Suspense fallback={<QuestionSkeleton />}>
                <MathmaniaQuestions
                  questions={questions}
                  timerSeconds={TIMER_SECONDS}
                  onOptionClick={handleAnswerOptionClick}
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
export default withTranslation()(MathmaniaPlay);
