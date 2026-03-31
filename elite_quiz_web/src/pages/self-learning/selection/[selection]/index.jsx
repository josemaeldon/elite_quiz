"use client";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Common/Breadcrumb";
import QuestionSlider from "@/components/Quiz/SelfLearning/QuestionSlider";
import TimerSlider from "@/components/Quiz/SelfLearning/TimerSlider";
import {
  Loadtempdata,
  getSelectedCategory,
  getSelectedSubCategory,
} from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import { useSelector } from "react-redux";

const SelfLearning = () => {
  // questions
  const [totalquestions, setTotalQuestions] = useState({
    selected: "",
  });

  //timer
  const [timerseconds, setTimerseconds] = useState({
    selected: "",
  });

  // active elenment for questions
  const [activeIndex, setActiveIndex] = useState(0);

  // active element for timer
  const [timeractiveIndex, setTimerActiveIndex] = useState(0);

  const router = useRouter();
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  // questionsclick
  const handleQuestionsClick = (selecteddata) => {
    setActiveIndex(selecteddata);
    setTotalQuestions({ ...totalquestions, selected: selecteddata });
  };

  // timerclick
  const handleTimerClick = (selecteddata) => {
    setTimerActiveIndex(selecteddata);
    setTimerseconds({ ...timerseconds, selected: selecteddata });
  };

  //start
  const handleStart = () => {
    if (!totalquestions.selected) {
      toast.error(t("select_questions"));
    } else if (!timerseconds.selected) {
      toast.error(t("select_time"));
    } else {
      router.push({ pathname: `/self-learning/self-learning-play` });

      let data = {
        category_id: router.query.catslug,
        subcategory_id:
          router.query.isSubcategory !== "0" ? router.query.subcatslug : "",
        limit: totalquestions.selected,
        timer: timerseconds.selected,
      };
      Loadtempdata(data);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  return (
    <Layout>
      <div className="section_data">
        <Breadcrumb
          showBreadcrumb={true}
          title={t("self_challenge")}
          content={t("home")}
          allgames={t("quiz_play")}
          contentTwo={t("self_challenge")}
          contentThree={selectedCategory?.category_name}
          contentFour={selectedSubCategory?.subcategory_name}
        />

        <div className="container mb-2">
          {/* questions */}
          {/* questions slider */}
          <div className="mb-8">
            <QuestionSlider
              onClick={handleQuestionsClick}
              activeIndex={activeIndex}
            />
          </div>
          <div className="">
            {/* timer slider */}
            <TimerSlider
              onClick={handleTimerClick}
              timeractiveIndex={timeractiveIndex}
            />
          </div>
        </div>

        {/* Start button */}
        <div className="flex-center my-7 ">
          <button
            className="w-36 md:w-60 h-12 md:h-20 font-bold bg-primary-color text-white rounded-[8px] shadowBtn"
            onClick={() => handleStart()}
          >
            {t("l_start")}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(SelfLearning);
