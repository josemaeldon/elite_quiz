'use client'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { questionsData } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import { lazy, Suspense } from 'react'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const RandomReviewAnswer = lazy(() => import('@/components/Quiz/RandomBattle/RandomReviewAnswer'))

const RandomPlay = () => {
  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push('/random-battle/result')
  }

  return (
    <Layout>
      <Breadcrumb title={t('1_vs_1_battle')} content='' contentTwo='' />

      <div className='container mb-2'>
        <>
          <Suspense fallback={<QuestionSkeleton />}>
            <RandomReviewAnswer questions={questions} goBack={handleReviewAnswerBack} />
          </Suspense>
        </>
      </div>
    </Layout>
  )
}
export default withTranslation()(RandomPlay)
