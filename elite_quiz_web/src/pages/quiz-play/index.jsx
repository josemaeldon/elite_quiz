import dynamic from "next/dynamic"
import { Suspense } from "react"
import QuestionSkeleton from "@/components/view/common/QuestionSkeleton"

const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
const AllQuiz = dynamic(() => import('@/components/AllQuiz/AllQuiz'), { ssr: false })

const Index = () => {
  return (
    <Layout>
      <Suspense fallback={<QuestionSkeleton />}>
        <AllQuiz />
      </Suspense>
    </Layout>
  )
}

export default Index