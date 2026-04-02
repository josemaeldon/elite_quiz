import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
import { useDispatch } from 'react-redux'
import { resetremainingSecond } from '@/store/reducers/showRemainingSeconds'
const RandomBattle = dynamic(() => import('@/components/Quiz/RandomBattle/RandomBattle'), { ssr: false })
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })

const Index = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [initialJoinCode, setInitialJoinCode] = useState("");

  useEffect(() => {
    dispatch(resetremainingSecond(0));
  }, [])

  useEffect(() => {
    if (router.isReady && router.query.join) {
      setInitialJoinCode(String(router.query.join).toUpperCase());
    }
  }, [router.isReady, router.query.join])

  return (
    <Layout>
      <Suspense fallback={<QuestionSkeleton />}>
        <RandomBattle initialJoinCode={initialJoinCode} />
      </Suspense>
    </Layout>
  )
}

export default Index
