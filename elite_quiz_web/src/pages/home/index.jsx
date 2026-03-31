"use client"
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
const HomeComp = dynamic(() => import('@/components/Static-Pages/HomeComp'), { ssr: false })

const Home = () => {
  return (
    <Layout>
      <HomeComp />
    </Layout>
  )
}

export default Home
