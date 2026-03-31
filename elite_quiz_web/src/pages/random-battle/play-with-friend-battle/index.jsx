import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const PlayWithFriendBattle = dynamic(() => import('@/components/Quiz/RandomBattle/PlayWithFriendBattle'), {
  ssr: false
})
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })

const Index = () => {
  return (
    <Layout>
      <Suspense fallback={<QuestionSkeleton />}>
        <PlayWithFriendBattle />
      </Suspense>
    </Layout>
  )
}

export default Index
