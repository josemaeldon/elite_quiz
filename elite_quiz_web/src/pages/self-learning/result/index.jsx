"use client";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/navigation";
import {
  getQuizEndData,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectPercentage,
  selectResultTempData,
} from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import { lazy, Suspense } from "react";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import { getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
const ShowScore = lazy(() => import("@/components/Common/ShowScore"));
const MySwal = withReactContent(Swal);

const SelfLearningplay = () => {
  const dispatch = useDispatch();

  const reviewAnserShow = useSelector(reviewAnswerShowData);

  const percentageScore = useSelector(selectPercentage);

  const resultScore = useSelector(getQuizEndData);

  const showScore = useSelector(selectResultTempData);

  const systemconfig = useSelector(sysConfigdata);

  const review_answers_deduct_coin = Number(
    systemconfig?.review_answers_deduct_coin
  );

  const navigate = useRouter();

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
      navigate.push("/self-learning/review-answer");
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
              title: 'self_challenge_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                navigate.push("/self-learning/review-answer");
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
          navigate.push("/self-learning/review-answer");
        }
      }
    });
  };

  const goBack = () => {
    navigate.push("/self-learning");
  };

  return (
    <Layout>
      <Breadcrumb title={t("self_challenge")} content="" contentTwo="" />
      <div className="dashboard">
        <div className="container mb-2">
          <Suspense fallback={<ShowScoreSkeleton />}>
            <ShowScore
              showCoinandScore={true}
              score={percentageScore}
              totalQuestions={showScore.totalQuestions}
              onReviewAnswersClick={handleReviewAnswers}
              goBack={goBack}
              coins={showScore.coins}
              quizScore={showScore.quizScore}
              showQuestions={true}
              reviewAnswer={true}
              corrAns={resultScore.Correctanswer}
              inCorrAns={resultScore.InCorrectanswer}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(SelfLearningplay);
