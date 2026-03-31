import dynamic from 'next/dynamic'
import Meta from '@/components/SEO/Meta'
const ResetPassword = dynamic(() => import('@/components/auth/ResetPassword'), { ssr: false })

const Index = () => {
  return (
    <>
         <Meta />
      <ResetPassword />
    </>
  )
}

export default Index
