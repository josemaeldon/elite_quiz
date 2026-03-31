"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import {
  resultTempDataSuccess,
  reviewAnswerShowSuccess,
} from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const TrueandFalseQuestions = lazy(() =>
  import("@/components/Quiz/TrueandFalse/TrueandFalseQuestions")
);
import { t } from "@/utils";
import { getTrueAndFalseQuestionsApi } from "@/api/apiRoutes";

const TrueandFalsePlay = () => {
  //questions
  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  //location
  const navigate = useRouter();

  const systemconfig = useSelector(sysConfigdata);

  const TIMER_SECONDS = Number(systemconfig?.true_false_quiz_in_seconds);

  const dispatch = useDispatch();

  useEffect(() => {
    getTrueandFalseQuestions();
    dispatch(reviewAnswerShowSuccess(false));
  }, []);

  //api
  const getTrueandFalseQuestions = async () => {
    const response = await getTrueAndFalseQuestionsApi({ type: 2 });

    if (!response?.error) {
      if (response.data && !response.data.error) {
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
    }
    if (response.error) {
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }
  };

  //answer option click
  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  const onQuestionEnd = async () => {
    const tempData = {
      // totalQuestions: questions?.length,
      // coins: coins,
      // quizScore: quizScore,
      showQuestions: true,
      reviewAnswer: true,
      playAgain: true,
      nextlevel: false,
      question: questions,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/quiz-play/true-and-false-play/result");
  };

  return (
    <Layout>
      <Breadcrumb title={t("true_false")} content="" contentTwo="" />
      <div className=" dashboard">
        <div className="container mt-5  mb-14">
          {(() => {
            if (questions && questions?.length >= 0) {
              return (
                <Suspense fallback={<QuestionSkeleton />}>
                  <TrueandFalseQuestions
                    questions={questions}
                    timerSeconds={TIMER_SECONDS}
                    onOptionClick={handleAnswerOptionClick}
                    onQuestionEnd={onQuestionEnd}
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

export default withTranslation()(TrueandFalsePlay);
