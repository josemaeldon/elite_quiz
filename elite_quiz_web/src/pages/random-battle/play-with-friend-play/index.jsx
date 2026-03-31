'use client'
import React, { Suspense } from 'react'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { questionsData } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import { groupbattledata } from '@/store/reducers/groupbattleSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const PlaywithFriendBattlequestions = dynamic(
  () => import('@/components/Quiz/RandomBattle/PlaywithFriendBattlequestions'),
  {
    ssr: false
  }
)

const RandomPlay = () => {
  const router = useRouter()


  const groupBattledata = useSelector(groupbattledata)

  let user2uid = groupBattledata?.user2uid

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = Number(systemconfig?.battle_mode_one_in_seconds)

  const questionsdata = useSelector(questionsData)
  const onQuestionEnd = async (isLeft) => {
    try {
      if(isLeft){
        router.push("/quiz-play")
      }else{
        router.push("/random-battle/result")
      }
    } catch (error) {
      console.error("Failed to navigate:", error)
    }
  }

  return (
    <Layout>
      <Breadcrumb title={t('1_vs_1_battle')} content='' contentTwo='' />
      <div className='container mb-2'>
        <>
          <Suspense fallback={<QuestionSkeleton />}>
            <PlaywithFriendBattlequestions
              questions={questionsdata}
              timerSeconds={TIMER_SECONDS}
              onQuestionEnd={onQuestionEnd}
              showQuestions={true}
            />
          </Suspense>
        </>
      </div>
    </Layout>
  )
}
export default withTranslation()(RandomPlay)
