"use client";
import React, { Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  resultTempDataSuccess,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/router";
import { groupbattledata } from "@/store/reducers/groupbattleSlice";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { getRandomQuestionsApi } from "@/api/apiRoutes";
const RandomQuestions = dynamic(
  () => import("@/components/Quiz/RandomBattle/RandomQuestions"),
  {
    ssr: false,
  }
);

const RandomPlay = () => {
  const navigate = useRouter();

  let getData = useSelector(selecttempdata);

  const dispatch = useDispatch();

  const groupBattledata = useSelector(groupbattledata);

  let user2uid = groupBattledata?.user2uid;

  const [questions, setQuestions] = useState([]);

  const systemconfig = useSelector(sysConfigdata);

  const TIMER_SECONDS = Number(systemconfig?.battle_mode_random_in_seconds);

  useEffect(() => {
    if (getData) {
      getNewQuestions(
        getData.room_id,
        getData.category_id,
      );
    }
  }, []);

  const getNewQuestions = async (match_id, category) => {
    if (systemconfig.battle_mode_random_category == "1") {
      const response = await getRandomQuestionsApi({
        random: "",
        match_id: match_id,
        category: category,
        entry_coin: groupBattledata.entryFee,
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
      } else {
        toast.error(t("no_que_found"));
        navigate.push("/quiz-play");
        console.log(response);
      }
    } else {
      const response = await getRandomQuestionsApi({
        random: "",
        match_id: match_id,
        category: category,
        entry_coin: groupBattledata.entryFee,
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
      } else {
        toast.error(t("no_que_found"));
        navigate.push("/quiz-play");
        console.log(response);
      }
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  const onQuestionEnd = async (type) => {
    
    if (type === false) {
      
      await navigate.push("/quiz-play");
    } else {
      
      await navigate.push("/random-battle/result");
    }
  };

  return (
    <Layout>
      <Breadcrumb title={t("1_vs_1_battle")} content="" contentTwo="" />
      <div className="container mb-2">
        <>
          {questions.length > 0 ? (
            <Suspense fallback={<QuestionSkeleton />}>
              <RandomQuestions
                questions={questions}
                timerSeconds={TIMER_SECONDS}
                onOptionClick={handleAnswerOptionClick}
                onQuestionEnd={onQuestionEnd}
                showQuestions={true}
              />
            </Suspense>
          ) : (
            <QuestionSkeleton />
          )}
        </>
      </div>
    </Layout>
  );
};
export default withTranslation()(RandomPlay);
