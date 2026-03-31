"use client"
import React, { lazy, Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { resultTempDataSuccess, selecttempdata } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from "@/utils";
import Breadcrumb from '@/components/Common/Breadcrumb'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
import { getContestQuestionsApi } from '@/api/apiRoutes'
const ContestPlayQuestions = lazy(() => import('@/components/Quiz/ContestPlay/ContestPlayQuestions'))
const ContestPlayBoard = () => {

  let getData = useSelector(selecttempdata)

  const navigate = useRouter()

  const dispatch = useDispatch()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.contest_id)
    }
  }, [])

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration)

  const getNewQuestions = async(contest_id) => {
    const contestQuestionResponse = await getContestQuestionsApi({
      contest_id: contest_id
    })
    if (contestQuestionResponse) {
      let questions = contestQuestionResponse.data.map(data => {
        return {
          ...data,
          selected_answer: '',
          isAnswered: false
        }
      })
      setQuestions(questions)
    }
    if (contestQuestionResponse.error) {
      toast.error(t('no_que_found'))
      navigate.push('/quiz-play')
      console.log(contestQuestionResponse.error);
    }

  }

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async () => {
    const tempData = {
      totalQuestions: questions?.length,
      playAgain: false,
      nextlevel: false
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/contest-play/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('contest_playBoard')} content="" contentTwo="" />
        <div className='container mb-2'>
                <>
                  {(() => {
                    if (questions && questions?.length >= 0) {
                      return (
                        <Suspense fallback={<QuestionSkeleton />}>
                          <ContestPlayQuestions
                            questions={questions}
                            timerSeconds={TIMER_SECONDS}
                            onOptionClick={handleAnswerOptionClick}
                            onQuestionEnd={onQuestionEnd}
                          />
                        </Suspense>
                      )
                    } else {
                      return (
                        <div className='text-center text-white'>
                          <p>{t('no_que_found')}</p>
                        </div>
                      )
                    }
                  })()}
                </>
              </div>
    </Layout>
  )
}
export default withTranslation()(ContestPlayBoard)
