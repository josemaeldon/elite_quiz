import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from '@/components/SEO/Meta'
import PrivacyPolicyComp from '@/components/Static-Pages/PrivacyPolicy'


const PrivacyPolicy = () => {

  return (
    <React.Fragment>
      <Meta />
      <PrivacyPolicyComp />
    </React.Fragment>
  )
}
export default withTranslation()(PrivacyPolicy)
