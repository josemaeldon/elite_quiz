"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { t } from "@/utils";
import {
  getQuizEndData,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectPercentage,
  selectResultTempData,
} from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import toast from "react-hot-toast";
import { lazy, Suspense } from "react";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import { getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const ShowScore = lazy(() => import("@/components/Common/ShowScore"));

const DailyQuizDashboard = () => {
  const navigate = useRouter();

  const dispatch = useDispatch();

  const showScore = useSelector(selectResultTempData);

  const percentageScore = useSelector(selectPercentage);

  const resultScore = useSelector(getQuizEndData);

  const reviewAnserShow = useSelector(reviewAnswerShowData);

  const systemconfig = useSelector(sysConfigdata);

  const review_answers_deduct_coin = Number(
    systemconfig?.review_answers_deduct_coin
  );

  const userData = useSelector((state) => state.User);

  const MySwal = withReactContent(Swal);

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin;
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t("no_enough_coins"));
        return false;
      }
    }else{
      navigate.push("/quiz-play/daily-quiz-dashboard/review-answer");
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
              title: 'daily_quiz_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                navigate.push("/quiz-play/daily-quiz-dashboard/review-answer");
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
          navigate.push("/quiz-play/daily-quiz-dashboard/review-answer");
        }
      }
    });
  };

  const goBack = () => {
    navigate.push("/quiz-play");
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
          <Suspense fallback={<ShowScoreSkeleton />}>
            <ShowScore
              score={percentageScore}
              totalQuestions={showScore.totalQuestions}
              onReviewAnswersClick={handleReviewAnswers}
              goBack={goBack}
              showQuestions={showScore.showQuestions}
              corrAns={resultScore.Correctanswer}
              inCorrAns={resultScore.InCorrectanswer}
              reviewAnswer={true}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(DailyQuizDashboard);
