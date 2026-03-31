"use client"
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { settingsData } from '@/store/reducers/settingsSlice'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })
import { t } from "@/utils";

const PrivacyPolicy = () => {
    const selectdata = useSelector(settingsData)

    const appdata = selectdata && selectdata.filter(item => item.type === 'privacy_policy')

    const data = appdata && appdata[0]?.message

    return (
        <Layout>
            {/* <Breadcrumb showBreadcrumb={true} content={t("home")} title={t('privacy_policy')} contentFour={t('privacy_policy')} /> */}
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
export default withTranslation()(PrivacyPolicy)
