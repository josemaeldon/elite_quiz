import dynamic from 'next/dynamic'
import Meta from '@/components/SEO/Meta'
const Signup = dynamic(() => import('@/components/auth/Signup'), { ssr: false })

const Index = () => {

  return (
    <>
         <Meta />
      <Signup />
    </>
  )
}
export default Index
