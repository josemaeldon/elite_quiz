import dynamic from 'next/dynamic'
import Meta from '@/components/SEO/Meta'
const Login = dynamic(() => import('@/components/auth/Login'), { ssr: false })

const Index = () => {
  return (
    <>
      <Meta />
      <Login />
    </>
  )
}
export default Index
