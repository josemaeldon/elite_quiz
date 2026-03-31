import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
import { useDispatch } from 'react-redux'
import { resetremainingSecond } from '@/store/reducers/showRemainingSeconds'
const RandomBattle = dynamic(() => import('@/components/Quiz/RandomBattle/RandomBattle'), { ssr: false })
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })

const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetremainingSecond(0));
  }, [])
  return (
    <Layout> <Suspense fallback={<QuestionSkeleton />}><RandomBattle /></Suspense></Layout>
  )
}

export default Index