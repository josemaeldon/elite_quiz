"use client";
import { t } from "@/utils";

import { useDispatch, useSelector } from "react-redux";
import {
  getQuizEndData,
  getSelectedCategory,
  getSelectedSubCategory,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectedCategorySuccess,
  selectedSubCategorySuccess,
  selectPercentage,
  selectQuizZonePercentage,
  selectResultTempData,
  selecttempdata,
  updateTempdata,
} from "@/store/reducers/tempDataSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { lazy, Suspense } from "react";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getUserCoinsApi, setUserCoinScoreApi } from "@/api/apiRoutes";
import { resetremainingSecond } from "@/store/reducers/showRemainingSeconds";
const ShowScore = lazy(() => import("@/components/Common/ShowScore"));
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const MySwal = withReactContent(Swal);

const Index = () => {
  const navigate = useRouter();

  const dispatch = useDispatch();

  const reviewAnserShow = useSelector(reviewAnswerShowData);

  const showscreenornot = useSelector(selectQuizZonePercentage);

  const percentageScore = useSelector(selectPercentage);

  const showScore = useSelector(selectResultTempData);

  const resultScore = useSelector(getQuizEndData);

  const systemconfig = useSelector(sysConfigdata);
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);

  const review_answers_deduct_coin = Number(
    systemconfig?.review_answers_deduct_coin
  );

  const userData = useSelector((state) => state.User);

  let getData = useSelector(selecttempdata);

  const playAgain = () => {
    dispatch(resetremainingSecond(0));

    // Check if this was a no-level quiz
    if (showScore.hasLevel === false) {
      // Build query params for no-level play
      const query = {
        catid: showScore.catid,
        isSubcategory: showScore.isSubcategory,
        hasLevel: 0,
        category_id:
          showScore.isSubcategory === "1" ? undefined : showScore.category_id,
        subcatid:
          showScore.isSubcategory === "1" ? showScore.subcatid : undefined,
        subcategory_id:
          showScore.isSubcategory === "1"
            ? showScore.subcategory_id
            : undefined,
      };

      navigate.push({
        pathname: `/quiz-zone/level/${showScore.querylevel}/dashboard-play`,
        query: query,
      });
    } else {
      // Normal flow with levels
      navigate.push(`/quiz-zone/level/${showScore.querylevel}/dashboard-play`);
    }
  };

  const nextLevel = () => {
    let temp_level = getData.level + 1;
    updateTempdata(temp_level);
    navigate.push(`/quiz-zone/level/${showScore.querylevel}/dashboard-play`);
  };

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin;

    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t("no_enough_coins"));
        return false;
      }
    } else {
      navigate.push("/quiz-zone/review-answer");
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
              title: "quiz_zone_review_answer",
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                navigate.push("/quiz-zone/review-answer");
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
          navigate.push("/quiz-zone/review-answer");
        }
      }
    });
  };

  const goBack = () => {
    navigate.push("/quiz-zone");
  };

  return (
    <Layout>
      <Breadcrumb title={t("quiz_play")} content="" contentTwo="" />
      <div className="dashboard">
        <div className="container mb-2">
          <Suspense fallback={<ShowScoreSkeleton />}>
            <ShowScore
              showCoinandScore={showscreenornot}
              score={percentageScore}
              totalQuestions={showScore.totalQuestions}
              onPlayAgainClick={playAgain}
              onReviewAnswersClick={handleReviewAnswers}
              onNextLevelClick={nextLevel}
              goBack={goBack}
              coins={showScore.coins}
              quizScore={showScore.quizScore}
              isPremium={getData.isPremium}
              currentLevel={showScore.currentLevel}
              maxLevel={showScore.maxLevel}
              showQuestions={showScore.showQuestions}
              reviewAnswer={showScore.reviewAnswer}
              playAgain={showScore.playAgain}
              nextlevel={showScore.nextlevel}
              corrAns={resultScore.Correctanswer}
              inCorrAns={resultScore.InCorrectanswer}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
