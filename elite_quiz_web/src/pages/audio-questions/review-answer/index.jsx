'use client'
import Breadcrumb from '@/components/Common/Breadcrumb.jsx'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { questionsData } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import { lazy, Suspense } from 'react'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const AudioReviewAnswer = lazy(() => import('@/components/Quiz/AudioQuestions/AudioQuestionReview'))
const AudioQuestionsPlay = () => {
  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push('/audio-questions/result')
  }

  return (
    <Layout>
      <Breadcrumb title={t('audio_questions')} content='' contentTwo='' />
      <div className='container mb-2'>
        <Suspense fallback={<QuestionSkeleton />}>
          <AudioReviewAnswer reportquestions={false} questions={questions} goBack={handleReviewAnswerBack} />
        </Suspense>
      </div>
    </Layout>
  )
}
export default withTranslation()(AudioQuestionsPlay)
