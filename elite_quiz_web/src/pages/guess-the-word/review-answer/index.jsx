'use client'
import { withTranslation } from 'react-i18next'
import GuessthewordReviewAnswer from '@/components/Quiz/Guesstheword/GuessthewordReviewAnswer.jsx'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { useRouter } from 'next/router'
import { questionsData } from '@/store/reducers/tempDataSlice'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
// import ReviewAnswer from '@/src/components/Common/ReviewAnswer'

const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })

const Guessthewordplay = () => {
  const navigate = useRouter()

  const questions = useSelector(questionsData)

  const handleReviewAnswerBack = () => {
    navigate.push('/guess-the-word/result')
  }

  return (
    <Layout>
      <Breadcrumb title={t('guess_the_word')} content='' contentTwo='' />
      <div className='container mt-6 md:mt-14'>
        <GuessthewordReviewAnswer questions={questions} goBack={handleReviewAnswerBack} />
        {/* <ReviewAnswer
                    showLevel={true}
                    reviewlevel={true}
                    reportquestions={true}
                    questions={questions}
                    latex={true}
                    goBack={handleReviewAnswerBack}
                    showBookmark={true}
                  /> */}
      </div>
    </Layout>
  )
}
export default withTranslation()(Guessthewordplay)
