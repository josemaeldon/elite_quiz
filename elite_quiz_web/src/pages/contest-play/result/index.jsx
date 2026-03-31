'use client'
import Breadcrumb from '@/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import {
  getQuizEndData,
  reviewAnswerShowData,
  reviewAnswerShowSuccess,
  selectPercentage,
  selectResultTempData
} from '@/store/reducers/tempDataSlice'
import { updateUserDataInfo } from '@/store/reducers/userSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import { lazy, Suspense } from 'react'
import ShowScoreSkeleton from '@/components/view/common/ShowScoreSkeleton'
import { getUserCoinsApi, setUserCoinScoreApi } from '@/api/apiRoutes'
const ShowScore = lazy(() => import('@/components/Common/ShowScore'))
const MySwal = withReactContent(Swal)

const ContestPlayBoard = () => {
  const dispatch = useDispatch()

  const reviewAnserShow = useSelector(reviewAnswerShowData)

  const systemconfig = useSelector(sysConfigdata)

  const review_answers_deduct_coin = Number(systemconfig?.review_answers_deduct_coin)

  const navigate = useRouter()

  const percentageScore = useSelector(selectPercentage)

  const resultScore = useSelector(getQuizEndData)

  const showScore = useSelector(selectResultTempData)

  // store data get
  const userData = useSelector(state => state.User)

  const handleReviewAnswers = () => {
    let coins = review_answers_deduct_coin
    if (!reviewAnserShow) {
      if (userData?.data?.coins < coins) {
        toast.error(t('no_enough_coins'))
        return false
      }
    }else{
      navigate.push("/contest-play/review-answer");
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
              title: 'contest_play_review_answer',
            });

            if (!response?.error) {
              const getCoinsResponse = await getUserCoinsApi();
              if (getCoinsResponse) {
                updateUserDataInfo(getCoinsResponse.data);
                navigate.push("/contest-play/review-answer");
                dispatch(reviewAnswerShowSuccess(true));
              }
            }

            return response;
          };
          deductCoins();
        } else {
          navigate.push('/contest-play/review-answer')
        }
      }
    })
  }

  const goBack = () => {
    navigate.push('/contest-play')
  }

  return (
    <Layout>
      <Breadcrumb title={t('contest_playBoard')} content='' contentTwo='' />
      <div className='container mb-2'>
        <>
          <Suspense fallback={<ShowScoreSkeleton />}>
            <ShowScore
              showCoinandScore={false}
              score={percentageScore}
              totalQuestions={showScore.totalQuestions}
              onReviewAnswersClick={handleReviewAnswers}
              goBack={goBack}
              quizScore={showScore.quizScore}
              showQuestions={true}
              reviewAnswer={false}
              playAgain={false}
              coins={showScore.coins}
              corrAns={resultScore.Correctanswer}
              inCorrAns={resultScore.InCorrectanswer}
            />
          </Suspense>
        </>
      </div>
    </Layout>
  )
}
export default withTranslation()(ContestPlayBoard)
