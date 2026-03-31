"use client";
import React, { Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import {
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { getQuestionByRoomIdApi } from "@/api/apiRoutes";
const GroupQuestions = dynamic(
  () => import("@/components/Quiz/GroupBattle/GroupQuestions"),
  {
    ssr: false,
  }
);

const GroupPlay = () => {
  const navigate = useRouter();


  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  let getData = useSelector(selecttempdata);

  const systemconfig = useSelector(sysConfigdata);

  const TIMER_SECONDS = Number(systemconfig?.battle_mode_group_in_seconds);

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.roomCode);
    }
  }, []);

  const getNewQuestions = async (match_id) => {
    const response = await getQuestionByRoomIdApi({
      room_id: match_id, 
    });
    if (!response?.error) {
      let questions = response.data.map((data) => {
        // Use \n to represent line breaks in the data

        let question = data.question;

        let note = data?.note;

        return {
          ...data,

          note: note,
          question: question,
          selected_answer: "",
          isAnswered: false,
        };
      });

      if (response.error) {
        toast.error(t("no_que_found"));
        navigate.push("/quiz-play");
      }
      setQuestions(questions);
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  return (
    <Layout>
      <Breadcrumb title={t("group_battle")} content={t("")} contentTwo="" />
      <div className="container mb-2">
        <>
          {(() => {
            if (questions && questions?.length > 0 && questions[0]?.id !== "") {
              return (
                <Suspense fallback={<QuestionSkeleton />}>
                  <GroupQuestions
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
        </>
      </div>
    </Layout>
  );
};
export default withTranslation()(GroupPlay);
