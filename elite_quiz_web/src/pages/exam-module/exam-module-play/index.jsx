'use client'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selecttempdata } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
const ExamQuestion = lazy(() => import('@/components/Quiz/Exammodule/ExamQuestion'))
import { t } from '@/utils'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
import { getExamModualQuestionsApi } from '@/api/apiRoutes'

const ExamModulePlay = () => {
  let getData = useSelector(selecttempdata)

  const navigate = useRouter()

  const TIMER_SECONDS = Number(getData.duration * 60)

  const [questions, setQuestions] = useState([{ id: '' }])

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.id)
    }
  }, [])

  const getNewQuestions = async(id) => {

    const response = await getExamModualQuestionsApi({
      exam_module_id: id,})

      if(!response.error){
        let questions = response.data.map(data => {
          let question = data.question

          let note = data?.note

          return {
            ...data,
            note: note,
            question: question,
            selected_answer: '',
            isAnswered: false
          }
        })
        const arrangedQuestions = arrangeQuestions(questions)
        setQuestions(arrangedQuestions)
      }else{
        toast.error(t('no_que_found'))
        navigate.push('/quiz-play')
      }
  }

  const arrangeQuestions = questions => {
    const arrangedQuestions = []
    const marks = [...new Set(questions.map(q => q.marks))].sort((a, b) => a - b)

    for (const questionMark of marks) {
      const filteredQuestions = questions.filter(q => q.marks === questionMark)
      arrangedQuestions.push(...filteredQuestions)
    }

    return arrangedQuestions
  }

  const handleAnswerOptionClick = (questions, score) => {
    setQuestions(questions)
  }

  return (
    <Layout>
      <Breadcrumb title={t('exam_module')} content='' contentTwo='' />
      <div className='container mb-2'>
        {(() => {
          if (questions && questions?.length >= 0) {
            return (
              <Suspense fallback={<QuestionSkeleton />}>
                <ExamQuestion
                  questions={questions}
                  timerSeconds={TIMER_SECONDS}
                  onOptionClick={handleAnswerOptionClick}
                  showQuestions={true}
                />
              </Suspense>
            )
          } else {
            return (
              <div className='text-center text-white'>
                <p>{t('no_que_found')}</p>
              </div>
            )
          }
        })()}
      </div>
    </Layout>
  )
}
export default withTranslation()(ExamModulePlay)
