'use client'
import { t } from '@/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
const ReviewAnswer = dynamic(() => import('@/components/Common/ReviewAnswer'), { ssr: false })
import { questionsData } from '@/store/reducers/tempDataSlice'

const Index = () => {
  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push('/fun-and-learn/result')
  }

  return (
    <Layout>
      <Breadcrumb title={`${t('quiz')} ${t('play')}`} content='' contentTwo='' />
      <div className='container mt-6 md:mt-14'>
        <Suspense fallback={<QuestionSkeleton />}>
          <ReviewAnswer
            reportquestions={false}
            reviewlevel={false}
            questions={questions}
            showLevel={false}
            goBack={handleReviewAnswerBack}
            showBookmark={false}
          />
        </Suspense>
      </div>
    </Layout>
  )
}

export default Index
