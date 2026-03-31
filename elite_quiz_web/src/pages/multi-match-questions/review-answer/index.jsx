"use client"
import { t } from "@/utils/index";
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
// const ReviewAnswer = dynamic(() => import('@/components/Common/ReviewAnswer'), { ssr: false })

import MultiMatchReviewAnswer from "@/components/Quiz/MultiMatch/MultiMatchReviewAnswer";
import { questionsData } from "@/store/reducers/tempDataSlice";

const Index = () => {

  const navigate = useRouter()

  const questions = useSelector(questionsData)


  const handleReviewAnswerBack = () => {
    navigate.push("/multi-match-questions/result")
  }

  return (
    <Layout>
      <Breadcrumb title={t('multi_match')} content="" contentTwo="" />
      <div className='container'>
        <Suspense fallback={<QuestionSkeleton />}>
          <MultiMatchReviewAnswer
            reportquestions={true}
            reviewlevel={false}
            questions={questions}
            showLevel={false}
            latex={false}
            goBack={handleReviewAnswerBack}
            showBookmark={false}
            isMulti={true}
          />
        </Suspense>
      </div>
    </Layout >

  )
}

export default Index
















































