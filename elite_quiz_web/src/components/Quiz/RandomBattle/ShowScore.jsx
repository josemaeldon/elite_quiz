import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { groupbattledata } from "@/store/reducers/groupbattleSlice";
import { getImageSource, imgError } from "@/utils";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { useRouter } from "next/navigation";
import vsImg from "../../../assets/images/versus.svg";
import showScoreVsImg from "../../../assets/images/versus.svg";
import rightTickIcon from "../../../assets/images/check-circle-score-screen.svg";
import crossIcon from "../../../assets/images/x-circle-score-screen.svg";
import winnerBadge from "../../../assets/images/won bedge.svg";
import userImg from "../../../assets/images/user.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { t } from "@/utils";
import { getUserCoinsApi, setQuizCoinScoreApi } from "@/api/apiRoutes";
import { getBattleResultData } from "@/store/reducers/tempDataSlice";
import ShowScoreSkeleton from "@/components/view/common/ShowScoreSkeleton";

const ShowScore = ({
  onReviewAnswersClick,
  reviewAnswer,
  goBack,
}) => {
  const navigate = useRouter();

  const goToHome = () => {
    navigate.push("/");
  };

  // store data get
  const userData = useSelector((state) => state.User);
  
  const groupBattledata = useSelector(groupbattledata);
  const [user1point, setUser1point] = useState(groupBattledata.user1point);
  const [user2point, setUser2point] = useState(groupBattledata.user2point);
  const [user1quickestBonus, setUser1quickestBonus] = useState(0);
  const [user2quickestBonus, setUser2quickestBonus] = useState(0);
  const [user1CorrectAnswer, setUser1CorrectAnswer] = useState(groupBattledata.user1CorrectAnswer);
  const [user2CorrectAnswer, setUser2CorrectAnswer] = useState(groupBattledata.user2CorrectAnswer);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const [isloading, setIsLoading] = useState(true);
  const [isTie, setIsTie] = useState(false);

  const battleResultData = useSelector(getBattleResultData);


 


  let user1name = groupBattledata.user1name;
  let user2name = groupBattledata.user2name;
  let user1uid = groupBattledata.user1uid;
  let user2uid = groupBattledata.user2uid;
  let user1image = groupBattledata.user1image;
  let user2image = groupBattledata.user2image;
  let entryFee = groupBattledata.entryFee;




  const alluseranswer = [user1point, user2point];

  const alluid = [user1uid, user2uid];

  // find max number
  const max = Math.max(...alluseranswer);

  let maxIndices = [];

  for (let i = 0; i < alluseranswer?.length; i++) {
    if (alluseranswer[i] === max) {
      maxIndices.push(i);
    }
  }

  // Find the user IDs of all users with the max number of correct answers
  const usersWithMax = [];
  for (const index of maxIndices) {
    usersWithMax.push(alluid[index]);
  }


  useEffect(() => {
    setIsLoading(true);


      const deductCoins = async () => {
const resultDataForApi = {
  quiz_type: battleResultData.quiz_type,
  play_questions: JSON.stringify(battleResultData.play_questions),
  match_id: battleResultData.match_id,
}
if(battleResultData.is_bot === 1){
  resultDataForApi.is_bot = 1;
}
        const response = await setQuizCoinScoreApi(resultDataForApi);

        if (!response?.error) {
        setUser1point(response?.data?.user1_data?.userPoints);
        setUser2point(response?.data?.user2_data?.userPoints);
        setUser1CorrectAnswer(response?.data?.user1_data?.correctAnswer);
        setUser2CorrectAnswer(response?.data?.user2_data?.correctAnswer);
        setUser1quickestBonus(response?.data?.user1_data?.quickest_bonus + response?.data?.user1_data?.second_quickest_bonus);
        setUser2quickestBonus(response?.data?.user2_data?.quickest_bonus + response?.data?.user2_data?.second_quickest_bonus);
        setTotalQuestions(response?.data?.total_questions);
        setWinAmount(response?.data?.winner_coin);
        setIsTie(response?.data?.winner_user_id == "0" || null );


          const getCoinsResponse = await getUserCoinsApi();
          if (getCoinsResponse) {
            updateUserDataInfo(getCoinsResponse.data);
          }
          setIsLoading(false);
        }else{
          setIsLoading(false);
        }

        return response;
      };
      deductCoins();

  }, []);

  return (
    <React.Fragment>
      {isloading ? <ShowScoreSkeleton /> : <div className="resultMorphisam">
        {(() => {
          if (userData?.data?.id == user1uid && user1point > user2point) {
            return (
              <>
                <div className="flex flex-col justify-center items-center text-center w-full">
                  <p className="text-text-color text-[40px] font-bold">
                    {t("victory")}
                  </p>
                  <h3 className="text-[25px] mb-8 font-bold text-text-color">
                    {t("congrats")}
                  </h3>
                  {entryFee > 0 && user2uid !== "000" ? (
                    <div className="flex justify-center items-center border-2 border-[#00bf7a] rounded-[8px] w-[70%] p-3 text-[32px] m-3 font-bold text-text-color bgcolor max-575:text-[18px]">
                      <span>{t(`You Won ${winAmount} Coins`)}</span>
                    </div>
                  ) : null}
                </div>
              </>
            );
          } else if (
            userData?.data?.id == user1uid &&
            user1point < user2point
          ) {
            return (
              <div className="flex flex-col justify-center items-center text-center w-full">
                <p className="text-text-color text-[40px] font-bold">
                  {t("defeat")}
                </p>
                <h3 className="text-[25px] mb-8 font-bold text-text-color">
                  {t("better_luck_next_time")}
                </h3>
                {entryFee > 0 && user2uid !== "000" ? (
                  <div className="flex justify-center items-center border-2 !border-[#ff005c] rounded-[8px] w-[70%] p-3 text-[32px] m-3 font-bold text-text-color bgcolor ">
                    <span>
                      {t("you_lose")}&nbsp;{entryFee}&nbsp;{t("coins")}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          } else if (
            userData?.data?.id == user2uid &&
            user1point > user2point
          ) {
            return (
              <div className="flex flex-col justify-center items-center text-center w-full">
                <p className="text-text-color text-[40px] font-bold">
                  {t("defeat")}
                </p>
                <h3 className="text-[25px] mb-8 font-bold text-text-color">
                  {t("better_luck_next_time")}
                </h3>

                {entryFee > 0 && user2uid !== "000" ? (
                  <div className="flex justify-center items-center !border-2 !border-[#ff005c] rounded-[8px] w-[70%] p-3 text-[32px] m-3 font-bold text-text-color bgcolor max-575:text-[18px]">
                    <span>
                      {t("you_lose")}&nbsp;{entryFee}&nbsp;{t("coins")}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          } else if (
            userData?.data?.id == user2uid &&
            user1point < user2point
          ) {
            return (
              <div className="flex flex-col justify-center items-center text-center w-full">
                <p className="text-text-color text-[40px] font-bold">
                  {t("victory")}
                </p>
                <h3 className="text-[25px] mb-8 font-bold text-text-color">
                  {t("congrats")}
                </h3>
                {entryFee > 0 && user2uid !== "000" ? (
                  <div className="flex justify-center items-center border-2 border-[#00bf7a] rounded-[8px] w-[70%] p-3 text-[32px] m-3 font-bold text-text-color bgcolor max-575:text-[18px]">
                    <span>{t(`You Won ${winAmount} Coins`)}</span>
                  </div>
                ) : null}
              </div>
            );
          } else if (isTie) {
            return (
              <div className="flex flex-col justify-center items-center text-center w-full mb-2 md:mb-4 lg:mb-6">
                <h3 className="text-xl sm:text-[25px]  font-bold text-text-color">
                  {t("tie")}
                </h3>
              </div>
            );
          }
        })()}

        {(() => {
          if (user1point > user2point) {
            return (
              <div className="mt-[30px] w-full lg:w-[70%] flex justify-between items-center text-center flex-wrap mx-auto flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-[195px] relative flex-center mx-auto">
                    {user1image ? (
                      <img
                        src={getImageSource(user1image)}
                        alt="user"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                    ) : (
                      <ThemeSvg
                        src={getImageSource(userImg.src)}
                        width="150px"
                        height="150px"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        alt="User"
                        colorMap={{
                          "#e13975": "var(--primary-color)",
                          "#6d1d50": "var(--secondary-color)",
                          "#f7ccdd": "var(--primary-light)",
                        }}
                      />
                    )}
                    <img
                      src={getImageSource(winnerBadge.src)}
                      alt="winnerBadge"
                      className="absolute bottom-0 right-0"
                    />
                  </div>

                  <p className="text-[22px] font-bold text-text-color w-[200px] break-all">
                    {user1name}
                  </p>

                  <div className="rightWrongAnsDiv">
                    <span>
                      <img src={getImageSource(rightTickIcon.src)} alt="correct" />
                      {user1CorrectAnswer}
                    </span>

                    <span>
                      <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                      {totalQuestions - user1CorrectAnswer}
                    </span>
                  </div>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("score")}: {user1point}
                  </p>
                  <p className="text-[22px] font-bold text-text-color">
                    {t("speed_bonus")}: {user1quickestBonus}
                  </p>
                </div>

                {/* vs */}
                <div className="versus_screen">
                  <img
                    className="object-contain aspect-square w-[107px] h-[300px]"
                    src={getImageSource(vsImg.src)}
                    alt="versus"
                  />
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-[195px] relative flex-center mx-auto">
                    {user2image ? (
                      <img
                        src={getImageSource(user2image)}
                        alt="user"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                    ) : (
                      <ThemeSvg
                        src={getImageSource(userImg.src)}
                        width="150px"
                        height="150px"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        alt="User"
                        colorMap={{
                          "#e13975": "var(--primary-color)",
                          "#6d1d50": "var(--secondary-color)",
                          "#f7ccdd": "var(--primary-light)",
                        }}
                      />
                    )}
                  </div>

                  <p className="text-[22px] font-bold text-text-color w-[200px] break-all">
                    {user2name}
                  </p>

                  <div className="rightWrongAnsDiv">
                    <span>
                      <img src={getImageSource(rightTickIcon.src)} alt="correct" />
                      {user2CorrectAnswer}
                    </span>

                    <span>
                      <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                      {totalQuestions - user2CorrectAnswer}
                    </span>
                  </div>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("score")}: {user2point}
                  </p>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("speed_bonus")}: {user2quickestBonus}
                  </p>
                </div>
              </div>
            );
          } else if (user1point < user2point) {
            return (
              <div className="mt-[30px] w-full lg:w-[70%] flex justify-between items-center text-center flex-wrap mx-auto flex-col sm:flex-row gap-4">
                <div className="login_winner flex flex-col gap-2 md:gap-3">
                  <div className="w-[195px] relative flex-center mx-auto">
                    {user2image ? (
                      <img
                        src={getImageSource(user2image)}
                        alt="user"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                    ) : (
                      <ThemeSvg
                        src={getImageSource(userImg.src)}
                        width="150px"
                        height="150px"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        alt="User"
                        colorMap={{
                          "#e13975": "var(--primary-color)",
                          "#6d1d50": "var(--secondary-color)",
                          "#f7ccdd": "var(--primary-light)",
                        }}
                      />
                    )}
                    <img
                      src={getImageSource(winnerBadge.src)}
                      alt="winnerBadge"
                      className="absolute bottom-0 right-0"
                    />
                  </div>

                  <p className="text-[22px] font-bold text-text-color w-[200px] break-all">
                    {user2name}
                  </p>

                  <div className="rightWrongAnsDiv">
                    <span>
                      <img src={getImageSource(rightTickIcon.src)} alt="correct" />
                      {user2CorrectAnswer}
                    </span>

                    <span>
                      <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                      {totalQuestions - user2CorrectAnswer}
                    </span>
                  </div>

                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("score")}: {user2point}
                  </p>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("speed_bonus")}: {user2quickestBonus}
                  </p>
                </div>

                {/* vs */}
                <div>
                  <img
                    className="object-contain aspect-square w-[107px] h-[300px]"
                    src={getImageSource(showScoreVsImg.src)}
                    alt="versus"
                  />
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-[195px] relative flex-center mx-auto">
                    {user1image ? (
                      <img
                        src={getImageSource(user1image)}
                        alt="user"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                    ) : (
                      <ThemeSvg
                        src={getImageSource(userImg.src)}
                        width="150px"
                        height="150px"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        alt="User"
                        colorMap={{
                          "#e13975": "var(--primary-color)",
                          "#6d1d50": "var(--secondary-color)",
                          "#f7ccdd": "var(--primary-light)",
                        }}
                      />
                    )}
                  </div>

                  <p className="text-[22px] font-bold text-text-color w-[200px] break-all">
                    {user1name}
                  </p>

                  <div className="rightWrongAnsDiv">
                    <span>
                      <img src={getImageSource(rightTickIcon.src)} alt="correct" />
                      {user1CorrectAnswer}
                    </span>

                    <span>
                      <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                      {totalQuestions - user1CorrectAnswer}
                    </span>
                  </div>

                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("score")}: {user1point}
                  </p>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("speed_bonus")}: {user1quickestBonus}
                  </p>
                </div>
              </div>
            );
          } else if (isTie) {
            return (
              <div className="mt-[30px] w-full lg:w-[70%] flex justify-between items-center text-center flex-wrap mx-auto flex-col sm:flex-row gap-4">
                <div className="login_winner flex flex-col gap-2 md:gap-3">
                  <div className="w-[195px] relative flex-center mx-auto">
                    {user1image ? (
                      <img
                        src={getImageSource(user1image)}
                        alt="user"
                        className="w-[95px] md:w-[150px] h-[95px] md:h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                    ) : (
                      <ThemeSvg
                        src={getImageSource(userImg.src)}
                        width="150px"
                        height="150px"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        alt="User"
                        colorMap={{
                          "#e13975": "var(--primary-color)",
                          "#6d1d50": "var(--secondary-color)",
                          "#f7ccdd": "var(--primary-light)",
                        }}
                      />
                    )}
                  </div>

                  <p className="text-[22px] font-bold text-text-color w-[200px] break-all">
                    {user1name}
                  </p>

                  <div className="rightWrongAnsDiv">
                    <span>
                      <img src={getImageSource(rightTickIcon.src)} alt="correct" />
                      {user1CorrectAnswer}
                    </span>

                    <span>
                      <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                      {totalQuestions - user1CorrectAnswer}
                    </span>
                  </div>

                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("score")}: {user1point}
                  </p>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("speed_bonus")}: {user1quickestBonus}
                  </p>
                </div>

                {/* vs */}
                <div className="versus_screen">
                  <img
                    className="object-contain aspect-square w-[107px] h-[300px]"
                    src={getImageSource(showScoreVsImg.src)}
                    alt="versus"
                  />
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-[195px] relative flex-center mx-auto">
                    {user2image ? (
                      <img
                        src={getImageSource(user2image)}
                        alt="user"
                        className="w-[95px] md:w-[150px] h-[95px] md:h-[150px] object-contain mb-[10px] rounded-full border-2"
                        onError={imgError}
                      />
                    ) : (
                      <ThemeSvg
                        src={getImageSource(userImg.src)}
                        width="150px"
                        height="150px"
                        className="w-[150px] h-[150px] object-contain mb-[10px] rounded-full border-2"
                        alt="User"
                        colorMap={{
                          "#e13975": "var(--primary-color)",
                          "#6d1d50": "var(--secondary-color)",
                          "#f7ccdd": "var(--primary-light)",
                        }}
                      />
                    )}
                  </div>

                  <p className="text-[22px] font-bold text-text-color w-[200px] break-all">
                    {user2name}
                  </p>

                  <div className="rightWrongAnsDiv">
                    <span className="rightAns">
                      <img src={getImageSource(rightTickIcon.src)} alt="correct" />
                      {user2CorrectAnswer}
                    </span>

                    <span className="wrongAns">
                      <img src={getImageSource(crossIcon.src)} alt="incorrect" />
                      {totalQuestions - user2CorrectAnswer}
                    </span>
                  </div>

                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("score")}: {user2point}
                  </p>
                  <p className="text-[22px] font-bold text-text-color">
                    {" "}
                    {t("speed_bonus")}: {user2quickestBonus}
                  </p>
                </div>
              </div>
            );
          }
        })()}

        <div className="lifelineParantDiv !justify-evenly">
          {reviewAnswer ? (
            <div>
              <button
                className="lifelinebtn mb-2"
                onClick={onReviewAnswersClick}
              >
                {t("review_answers")}
              </button>
            </div>
          ) : (
            ""
          )}
          <div>
            <button className="lifelinebtn mb-2" onClick={goBack}>
              {t("back")}
            </button>
          </div>
          <div>
            <button className="lifelinebtn mb-2" onClick={goToHome}>
              {t("home")}
            </button>
          </div>
        </div>
      </div>}
    </React.Fragment>
  );
};

ShowScore.propTypes = {
  coins: PropTypes.number,
  onReviewAnswersClick: PropTypes.func.isRequired,
  reviewAnswer: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
};
export default withTranslation()(ShowScore);
