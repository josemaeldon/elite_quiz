import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from '@/components/SEO/Meta'
import ContactUs from '@/components/Static-Pages/ContactUs'


const Contact_us = () => {

  return (
    <React.Fragment>
      <Meta />
      <ContactUs />
    </React.Fragment>
  )
}
export default withTranslation()(Contact_us)
