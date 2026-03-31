'use client'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { questionsData } from '@/store/reducers/tempDataSlice'
// import Mathmaniareviewanswer from '@/components/Quiz/Mathmania/Mathmaniareviewanswer'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import { Suspense } from 'react'
import QuestionSkeleton from '../../../components/view/common/QuestionSkeleton.jsx'
import ReviewAnswer from '../../../components/Common/ReviewAnswer.jsx'

const MathmaniaPlay = () => {
  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push('/math-mania/result')
  }

  return (
    <Layout>
      <Breadcrumb title={t('mathmania_play')} content='' contentTwo='' />
      <div className='container mt-6 md:mt-14'>
        <Suspense fallback={<QuestionSkeleton />}>
          <ReviewAnswer
            showLevel={false}
            reviewlevel={true}
            reportquestions={false}
            questions={questions}
            latex={true}
            goBack={handleReviewAnswerBack}
            showBookmark={false}
          />
        </Suspense>
      </div>
    </Layout>
  )
}
export default withTranslation()(MathmaniaPlay)
