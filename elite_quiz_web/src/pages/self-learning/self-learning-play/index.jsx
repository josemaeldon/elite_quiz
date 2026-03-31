"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { selecttempdata } from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { getSelfQuestionApi } from "@/api/apiRoutes";
const SelfLearningQuestions = lazy(() =>
  import("@/components/Quiz/SelfLearning/SelfLearningQuestions")
);
const SelfLearningplay = () => {
  let getData = useSelector(selecttempdata);

  const TIMER_SECONDS = getData.timer * 60;

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  useEffect(() => {
    if (getData) {
      getNewQuestions(
        getData.category_id,
        getData.subcategory_id,
        getData.limit
      );
    }
  }, []);

  const getNewQuestions = async (category_id, subcategory_id, limit) => {
    const response = await getSelfQuestionApi({
      category: category_id,
      subcategory: subcategory_id,
      limit: limit,
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
      setQuestions(questions);
    }
    if (response.error) {
      toast.error(t("no_que_found"));
        navigate.push("/quiz-play");

      }
 
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  return (
    <Layout>
      <Breadcrumb title={t("self_challenge")} content="" contentTwo="" />
      <div className="dashboard">
        <div className="container">
          {(() => {
            if (questions && questions?.length >= 0) {
              return (
                <Suspense fallback={<QuestionSkeleton />}>
                  <SelfLearningQuestions
                    questions={questions}
                    timerSeconds={TIMER_SECONDS}
                    onOptionClick={handleAnswerOptionClick}
                    showQuestions={true}
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
      </div>
    </Layout>
  );
};
export default withTranslation()(SelfLearningplay);
