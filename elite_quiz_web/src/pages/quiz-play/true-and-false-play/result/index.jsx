'use client'
import { withTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { updateUserDataInfo } from '@/store/reducers/userSlice'
import { useRouter } from 'next/navigation'
import {
  getQuizEndData,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectPercentage,
  selectResultTempData
} from '@/store/reducers/tempDataSlice'
import ShowScore from '@/components/Common/ShowScore'
import { t } from '@/utils'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ShowScoreSkeleton from '@/components/view/common/ShowScoreSkeleton'
import { getUserCoinsApi, setUserCoinScoreApi } from '@/api/apiRoutes'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })

const MySwal = withReactContent(Swal)

const TrueandFalsePlay = () => {
  const dispatch = useDispatch()

  const reviewAnserShow = useSelector(reviewAnswerShowData)

  const showScore = useSelector(selectResultTempData)

  const percentageScore = useSelector(selectPercentage)

  const resultScore = useSelector(getQuizEndData)

  //location
  const navigate = useRouter()

  const systemconfig = useSelector(sysConfigdata)

  const review_answers_deduct_coin = Number(systemconfig?.review_answers_deduct_coin)

  const userData = useSelector(state => state.User)

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t('no_enough_coins'))
        return false
      }
    }else{
      navigate.push("/quiz-play/true-and-false-play/review-answer");
      return false;
    }

    MySwal.fire({
      title: t('are_you_sure'),
      text: !reviewAnserShow ? review_answers_deduct_coin + ' ' + t('coin_will_deduct') : null,
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'Swal-confirm-buttons',
        cancelButton: 'Swal-cancel-buttons'
      },
      confirmButtonText: t('continue'),
      cancelButtonText: t('cancel')
    }).then(result => {
      if (result.isConfirmed) {
        if (!reviewAnserShow) {

          const deductCoins = async () => {
            const response = await setUserCoinScoreApi({
              coins: "-" + coins,
              title: 'true_false_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
               navigate.push("/quiz-play/true-and-false-play/review-answer");
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
          navigate.push('/quiz-play/true-and-false-play/review-answer')
        }
      }
    })
  }

  const goBack = () => {
    navigate.push('/quiz-play')
  }

  return (
    <Layout>
      <Breadcrumb title={t('true_false')} content='' contentTwo='' />
      <div className=' dashboard'>
        <div className='container md:mb-14'>
          <Suspense fallback={<ShowScoreSkeleton />}>
            <ShowScore
              showCoinandScore={false}
              score={percentageScore}
              totalQuestions={showScore.totalQuestions}
              onReviewAnswersClick={handleReviewAnswers}
              goBack={goBack}
              coins={showScore.coins}
              quizScore={showScore.quizScore}
              showQuestions={showScore.showQuestions}
              reviewAnswer={showScore.reviewAnswer}
              corrAns={resultScore.Correctanswer}
              inCorrAns={resultScore.InCorrectanswer}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(TrueandFalsePlay)
