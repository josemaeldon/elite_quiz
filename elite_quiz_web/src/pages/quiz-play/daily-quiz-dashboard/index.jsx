"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { reviewAnswerShowSuccess } from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/router";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { getClientTimeZone, getClientTimeZoneGMTFormat, t } from "@/utils";
import { getDailyQuizApi } from "@/api/apiRoutes";
import { errorCodeDailyQuizAlreadyPlayed, errorCodeDataNotFound } from "@/api/apiEndPoints";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const DailyQuizQuestions = lazy(() =>
  import("@/components/Quiz/DailyQuiz/DailyQuizQuestions")
);
const DailyQuizDashboard = () => {
  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const systemconfig = useSelector(sysConfigdata);

  const dispatch = useDispatch();

  const navigate = useRouter();



  let timerseconds = parseInt(systemconfig.quiz_zone_duration);

  const TIMER_SECONDS = timerseconds;

  const timezone = getClientTimeZone();
  const gmt_format = getClientTimeZoneGMTFormat();

  useEffect(() => {
    getNewQuestions();
    dispatch(reviewAnswerShowSuccess(false));
  }, []);

  const getNewQuestions = async () => {
    const dailyQuizReaponse = await getDailyQuizApi({
      timezone: timezone,
      gmt_format: gmt_format,
    });
    if (dailyQuizReaponse) {
      if (dailyQuizReaponse.data && !dailyQuizReaponse.data.error) {
        let questions = dailyQuizReaponse.data.map((data) => {
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
if (dailyQuizReaponse.message === errorCodeDailyQuizAlreadyPlayed) {
      toast.error(t("already_played"));
      navigate.push("/quiz-play");
      return false;
    }
    if (dailyQuizReaponse.message === errorCodeDataNotFound) {
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");

      return false;
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };



  return (
    <Layout>
      <Breadcrumb
        title={t("daily_quiz")}
        content=""
        contentTwo=""
      />
      <div className="dashboard">
        <div className="container mb-2">
          {(() => {
            if (questions && questions?.length >= 0) {
              return (
                <Suspense fallback={<QuestionSkeleton />}>
                  <DailyQuizQuestions
                    questions={questions}
                    timerSeconds={TIMER_SECONDS}
                    onOptionClick={handleAnswerOptionClick}
                    showQuestions={true}
                    showLifeLine={true}
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

export default withTranslation()(DailyQuizDashboard);
