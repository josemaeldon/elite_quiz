"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb.jsx";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuizEndData,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectPercentage,
  selectResultTempData,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { useRouter } from "next/router.js";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
const ShowScore = lazy(() => import("@/components/Common/ShowScore.jsx"));
const MySwal = withReactContent(Swal);

const AudioQuestionsPlay = () => {
  const dispatch = useDispatch();

  const reviewAnserShow = useSelector(reviewAnswerShowData);

  let getData = useSelector(selecttempdata);

  const percentageScore = useSelector(selectPercentage);

  const resultScore = useSelector(getQuizEndData);

  const showScore = useSelector(selectResultTempData);

  const systemconfig = useSelector(sysConfigdata);

  const review_answers_deduct_coin = Number(
    systemconfig?.review_answers_deduct_coin
  );

  const router = useRouter();

  const [showCoinandScore, setShowCoinScore] = useState(false);

  useEffect(() => {
    if (getData.is_play === "0") {
      setShowCoinScore(true);
    }
  }, []);

  // store data get

  const userData = useSelector((state) => state.User);

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin;
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t("no_enough_coins"));
        return false;
      }
    }else{
      router.push("/audio-questions/review-answer");
      return false;
    }

    MySwal.fire({
      title: t("are_you_sure"),
      text: !reviewAnserShow
        ? review_answers_deduct_coin + " " + t("coin_will_deduct")
        : null,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("continue"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (!reviewAnserShow) {

          const deductCoins = async () => {
            const response = await setUserCoinScoreApi({
              coins: "-" + coins,
              title: 'audio_quiz_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                router.push("/audio-questions/review-answer");
                dispatch(reviewAnswerShowSuccess(true));
              }
            }

            if (response.error) {
              Swal.fire(t("ops"), t("please "), t("try_again"), "error");
            }

            return response;
          };
          deductCoins();

        } else {
          router.push("/audio-questions/review-answer");
        }
      }
    });
  };

  const goBack = () => {
    router.push("/audio-questions");
  };

  return (
    <Layout>
      <Breadcrumb title={t("audio_questions")} content="" contentTwo="" />
      <div className="container mb-2">
        <Suspense fallback={<ShowScoreSkeleton />}>
          <ShowScore
            showCoinandScore={showCoinandScore}
            score={percentageScore}
            totalQuestions={showScore.totalQuestions}
            onReviewAnswersClick={handleReviewAnswers}
            goBack={goBack}
            quizScore={showScore.quizScore}
            showQuestions={true}
            reviewAnswer={true}
            coins={showScore.coins}
            isPremium={getData.is_premium}
            corrAns={resultScore.Correctanswer}
            inCorrAns={resultScore.InCorrectanswer}
          />
        </Suspense>
      </div>
    </Layout>
  );
};
export default withTranslation()(AudioQuestionsPlay);
