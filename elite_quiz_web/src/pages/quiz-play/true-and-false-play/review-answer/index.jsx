'use client'
import { t } from '@/utils'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { questionsData } from '@/store/reducers/tempDataSlice'
import { Suspense } from 'react'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const ReviewAnswer = dynamic(() => import('@/components/Common/ReviewAnswer'), { ssr: false })

const Index = () => {
  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push('/quiz-play/true-and-false-play/result')
  }
  const loading = () => {
   alert(123456);
   
  }

  return (
    <Layout>
      <Breadcrumb title={`${t('daily')} ${t('quiz')}`} content='' contentTwo='' />
      <div className='dashboard mt-6 md:mt-14'>
        <div className='container'>
          <Suspense fallback={<QuestionSkeleton />}>
            <ReviewAnswer
              isLoading={loading}
              showLevel={false}
              reviewlevel={false}
              reportquestions={true}
              questions={questions}
              latex={true}
              goBack={handleReviewAnswerBack}
              showBookmark={false}
            />
          </Suspense>
        </div>
      </div>
    </Layout>
  )
}

export default Index
