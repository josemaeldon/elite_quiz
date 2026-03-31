'use client'
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { settingsData } from '@/store/reducers/settingsSlice'
import { t } from '@/utils'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const AboutUs = () => {
  const selectdata = useSelector(settingsData)

  const appdata = selectdata && selectdata.filter(item => item.type === 'about_us')

  const data = appdata && appdata[0]?.message

  return (
    <Layout>
      {/* <Breadcrumb showBreadcrumb={true} content={t("home")} title={t('about_us')} contentFour={t('about_us')} /> */}
      <div className='mt-6 md:my-[60px] mx-0 max-479:mb-8'>
        <div className='container mb-2'>
            {data ? (
              <div className='morphisam darkSecondaryColor' dangerouslySetInnerHTML={{ __html: data }}></div>
            ) : (
              <div className='text-center text-white'>
                <Skeleton count={5} />
              </div>
            )}
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(AboutUs)
