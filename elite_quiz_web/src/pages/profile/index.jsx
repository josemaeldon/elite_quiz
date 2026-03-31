import dynamic from 'next/dynamic'

const Profile = dynamic(() => import('@/components/Profile/ProfileData'), { ssr: false })
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
const Index = () => {
  return (
    <Layout><Profile /></Layout>
  )
}

export default Index