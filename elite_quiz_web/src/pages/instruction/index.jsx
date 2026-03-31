import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from '@/components/SEO/Meta'
import Instructions from '@/components/Static-Pages/Instructions'


const Instruction = () => {

  return (
    <React.Fragment>
      <Meta />
      <Instructions />
    </React.Fragment>
  )
}

export default withTranslation()(Instruction)
