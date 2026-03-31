'use client'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { questionsData } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { lazy, Suspense } from 'react'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const ReviewAnswer = lazy(() => import('@/components/view/common/QuestionSkeleton'))
const ContestPlayBoard = () => {
  const questions = useSelector(questionsData)

  const navigate = useRouter()

  const handleReviewAnswerBack = () => {
    navigate.push('/contest-play/result')
  }

  return (
    <Layout>
      <Breadcrumb title={t('contest_playBoard')} content='' contentTwo='' />
      <div className='container mt-6 md:mt-14'>
        <>
          <Suspense fallback={<QuestionSkeleton />}>
            <ReviewAnswer
              showLevel={false}
              questions={questions}
              goBack={handleReviewAnswerBack}
              showBookmark={false}
            />
          </Suspense>
        </>
      </div>
    </Layout>
  )
}
export default withTranslation()(ContestPlayBoard)
