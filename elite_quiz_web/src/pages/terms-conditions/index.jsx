import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from '@/components/SEO/Meta'
import TermsAndConditions from '@/components/Static-Pages/TermsAndConditions'

const TermAndConditions = () => {

  return (
    <React.Fragment>
      <Meta />
      <TermsAndConditions />
    </React.Fragment>
  )
}
export default withTranslation()(TermAndConditions)
