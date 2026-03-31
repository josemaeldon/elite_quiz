"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import {
  getQuizEndData,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectPercentage,
  selectResultTempData,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { useRouter } from "next/router";
import { t } from "@/utils";
import dynamic from "next/dynamic";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import { getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const ShowScore = lazy(() => import("@/components/Common/ShowScore.jsx"));
const MySwal = withReactContent(Swal);

const Guessthewordplay = () => {
  const dispatch = useDispatch();

  const reviewAnserShow = useSelector(reviewAnswerShowData);

  const showScore = useSelector(selectResultTempData);

  const percentageScore = useSelector(selectPercentage);

  const resultScore = useSelector(getQuizEndData);

  let getData = useSelector(selecttempdata);

  const systemconfig = useSelector(sysConfigdata);

  const review_answers_deduct_coin = Number(
    systemconfig?.review_answers_deduct_coin
  );

  const router = useRouter();

  const [showCoinandScore, setShowCoinScore] = useState(false);

  // store data get
  const userData = useSelector((state) => state.User);

  useEffect(() => {
    if (getData.is_play === "0") {
      setShowCoinScore(true);
    }
  }, []);

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin;
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t("no_enough_coins"));
        return false;
      }
    }else{
      router.push("/guess-the-word/review-answer");
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
              title: 'guess_the_word_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                router.push(`/guess-the-word/review-answer`);
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
          router.push(`/guess-the-word/review-answer`);
        }
      }
    });
  };

  const goBack = () => {
    router.push("/guess-the-word");
  };

  return (
    <Layout>
      <Breadcrumb title={t("guess_the_word")} content="" contentTwo="" />
      <div className="container mb-2">
        <Suspense fallback={<ShowScoreSkeleton />}>
          <ShowScore
            showCoinandScore={showCoinandScore}
            score={percentageScore}
            totalQuestions={showScore.totalQuestions}
            onReviewAnswersClick={handleReviewAnswers}
            goBack={goBack}
            isPremium={getData.is_premium}
            quizScore={showScore.quizScore}
            coins={showScore.coins}
            corrAns={resultScore.Correctanswer}
            inCorrAns={resultScore.InCorrectanswer}
            showQuestions={true}
            reviewAnswer={true}
            playAgain={false}
          />
        </Suspense>
      </div>
    </Layout>
  );
};
export default withTranslation()(Guessthewordplay);
