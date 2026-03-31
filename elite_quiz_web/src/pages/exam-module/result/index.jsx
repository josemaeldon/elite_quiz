'use client'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import { getQuizEndData, selectPercentage, selectResultTempData } from '@/store/reducers/tempDataSlice'
import { useSelector } from 'react-redux'
import { lazy, Suspense } from 'react'
import ShowScoreSkeleton from '@/components/view/common/ShowScoreSkeleton'
const ExamScore = lazy(() => import('@/components/Quiz/Exammodule/ExamScore'))
const ExamModulePlay = () => {
  const percentageScore = useSelector(selectPercentage)

  const showScore = useSelector(selectResultTempData)

  const resultScore = useSelector(getQuizEndData)

  return (
    <Layout>
      <Breadcrumb title={t('exam_module')} content='' contentTwo='' />

      <div className='container mb-2'>
        <Suspense fallback={<ShowScoreSkeleton />}>
          <ExamScore
            score={percentageScore}
            totalQuestions={showScore.totalQuestions}
            coins={showScore.coins}
            quizScore={showScore.quizScore}
            showQuestions={true}
            corrAns={resultScore.Correctanswer}
            inCorrAns={resultScore.InCorrectanswer}
          />
        </Suspense>
      </div>
    </Layout>
  )
}
export default withTranslation()(ExamModulePlay)
