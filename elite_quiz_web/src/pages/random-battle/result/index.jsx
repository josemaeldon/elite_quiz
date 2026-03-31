"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {  sysConfigdata } from "@/store/reducers/settingsSlice";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import {
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectResultTempData,
} from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";
import { lazy, Suspense } from "react";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import { getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
const ShowScore = lazy(() =>
  import("@/components/Quiz/RandomBattle/ShowScore")
);
const MySwal = withReactContent(Swal);

const RandomPlay = () => {
  const dispatch = useDispatch();

  const reviewAnserShow = useSelector(reviewAnswerShowData);

  const navigate = useRouter();

  const systemconfig = useSelector(sysConfigdata);

  const showScore = useSelector(selectResultTempData);

  const review_answers_deduct_coin = systemconfig?.review_answers_deduct_coin;

  // store data get
  const userData = useSelector((state) => state.User);

  const handleReviewAnswers = () => {
    let coins =
      review_answers_deduct_coin &&
      Number(review_answers_deduct_coin);
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t("no_enough_coins"));
        return false;
      }
    }else{
      navigate.push("/random-battle/review-answer");
      return false;
    }

    MySwal.fire({
      title: t("are_you_sure"),
      text: !reviewAnserShow
        ? coins + " " + t("coin_will_deduct")
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
              title: 'random_battle_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                navigate.push("/random-battle/review-answer");
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
          navigate.push("/random-battle/review-answer");
        }
      }
    });
  };

  const goBack = () => {
    navigate.push("/random-battle");
  };

  return (
    <Layout>
      <Breadcrumb title={t("1_vs_1_battle")} content="" contentTwo="" />
      <div className="container mb-2">
        <>
          <Suspense fallback={<ShowScoreSkeleton />}>
            <ShowScore
              score={showScore.score}
              totalQuestions={showScore.totalQuestions}
              onReviewAnswersClick={handleReviewAnswers}
              goBack={goBack}
              quizScore={showScore.quizScore}
              reviewAnswer={false}
              coins={showScore.coins}
            />
          </Suspense>
        </>
      </div>
    </Layout>
  );
};
export default withTranslation()(RandomPlay);
