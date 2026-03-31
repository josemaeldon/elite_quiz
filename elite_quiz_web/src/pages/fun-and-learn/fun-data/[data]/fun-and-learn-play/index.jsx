"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useRouter } from "next/router";
import {
  funandlearnComphremsionData,
  resultTempDataSuccess,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
import { t } from "@/utils";
import dynamic from "next/dynamic";
import { setTotalSecond } from "@/store/reducers/showRemainingSeconds";
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton";
import { funandlearnquestionsApi } from "@/api/apiRoutes";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const FunandLearnQuestions = lazy(() =>
  import("@/components/Quiz/Fun_and_Learn/FunandLearnQuestions")
);
const FunandLearnPlay = () => {
  const funandlearnComphremsion = useSelector(funandlearnComphremsionData);

  const router = useRouter();

  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const [detail, setDetail] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  // store data get
  const systemconfig = useSelector(sysConfigdata);

  let getData = useSelector(selecttempdata)

  const timerseconds = Number(systemconfig.fun_and_learn_time_in_seconds);
  dispatch(setTotalSecond(timerseconds));
  const TIMER_SECONDS = timerseconds;

  useEffect(() => {
    if (funandlearnComphremsion) {
      getNewQuestions(funandlearnComphremsion.id);
    }
  }, []);

  const getNewQuestions = async (fun_n_learn_id) => {

    const response = await funandlearnquestionsApi({ fun_n_learn_id: fun_n_learn_id });
    console.log(response);

    if (!response?.error) {
      let questions = response.data.map((data) => {
        return {
          ...data,
          selected_answer: "",
          isAnswered: false,
        };
      });
      setQuestions(questions);
    }
    if (response.error) {
      toast.error(t("no_que_found"));
      router.push('/quiz-play')
      console.log(response);
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions);
  };

  const onQuestionEnd = async () => {
    const tempData = {
      totalQuestions: questions?.length,
      playAgain: false,
      nextlevel: false,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await router.push("/fun-and-learn/result");
  };

  return (
    <Layout>
      <Breadcrumb
        title={`${t("fun_learn")} ${t("play")} `}
        content=""
        contentTwo=""
      />
      <div className="container my-6 md:my-14">
        {detail ? (
          <div className='text-center my-5 bgcolor p-[30px_30px_40px_30px] lg:p-[80px_110px_50px_110px] sm:p-[60px_50px_50px_50px] rounded-[8px] darkSecondaryColor'>

            <h2 className='font-bold text-2xl md:text-[30px] mb-8 md:mb-12'>{getData?.title}</h2>

            {getData.content_type && getData.content_type !== '0' &&
              <div className='flex-center'>
                {getData.content_type === '1' ?
                  <div className="relative max-w-[500px] w-full mx-auto my-5 pb-[50%] h-0 rounded-[12px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] border-4 border-white bg-white transform -translate-y-1 lg:pb-[27%]">

                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-none bg-black p-5"
                      src={`https://www.youtube.com/embed/${getData.content_data}`}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                  :
                  <div className="FAL_pdf">
                    <button
                      className='btnPrimary mb-5 shadowBtn'
                      onClick={() => setOpenDialog(true)}
                    >
                      {t('open')}
                    </button>

                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogContent className="sm:max-w-4xl w-[90vw] h-[90vh] p-0">
                        <iframe
                          src={`${getData.content_data}`}
                          width="100%"
                          height="100%"
                          title="PDF Viewer"
                          className="rounded-lg"
                        ></iframe>
                      </DialogContent>
                    </Dialog>
                  </div>

                }
              </div>
            }

            <h4
              className='fun__title pb-3 text-[20px] mb-5 [&>p]:opacity-80'
              dangerouslySetInnerHTML={{ __html: getData && getData?.detail }}
            ></h4>

            <button className='bg-[var(--background-2)] darkSecondaryColor text-text-color rounded-lg px-10 py-3 font-sans text-[20px] font-bold' onClick={e => setDetail(false)}>
              {t('l_start')}
            </button>
          </div>
        ) : (
          <div className="">
            {(() => {
              if (questions && questions?.length >= 0) {
                return (
                  <Suspense fallback={<QuestionSkeleton />}>
                    <FunandLearnQuestions
                      questions={questions}
                      timerSeconds={TIMER_SECONDS}
                      onOptionClick={handleAnswerOptionClick}
                      onQuestionEnd={onQuestionEnd}
                      showQuestions={false}
                      showLifeLine={false}
                      showGuesstheword={false}
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
          </div>
        )}
      </div>
    </Layout>
  );
};
export default withTranslation()(FunandLearnPlay);
