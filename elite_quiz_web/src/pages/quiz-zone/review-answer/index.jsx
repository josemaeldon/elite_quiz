"use client"
import { t } from "@/utils";
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { questionsData } from '@/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
const ReviewAnswer = dynamic(() => import('@/components/Common/ReviewAnswer'), { ssr: false })

const Index = () => {

  const navigate = useRouter()

  const questions = useSelector(questionsData)
  const showLevel = questions[0].level !== "0" ? true : false

  const handleReviewAnswerBack = () => {
    navigate.push("/quiz-zone/result")
  }
  const loading = () => {
    return true;
   }
  return (

    <Layout>
      <Breadcrumb title={`${t('quiz')} ${t('play')}`} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container mt-6 md:mt-14'>
                <Suspense fallback={<QuestionSkeleton />}>
                  <ReviewAnswer
                    isLoading={loading}
                    showLevel={showLevel}
                    reviewlevel={true}
                    reportquestions={true}
                    questions={questions}
                    latex={true}
                    goBack={handleReviewAnswerBack}
                    showBookmark={true}
                  />
                </Suspense>
              </div>
            </div>
    </Layout>

  )
}

export default Index