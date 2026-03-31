import { withTranslation } from 'react-i18next'
import AboutUs from '@/components/Static-Pages/AboutUs'
import Meta from '@/components/SEO/Meta'

const About_us = () => {
  return (
    <>
      <Meta />
      <AboutUs />
    </>
  )
}

export default withTranslation()(About_us)
