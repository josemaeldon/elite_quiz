'use client'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { withTranslation } from 'react-i18next'
import { selectResultTempData, selecttempdata } from '@/store/reducers/tempDataSlice'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from '@/utils'
import { lazy, Suspense, useEffect } from 'react'
import ShowScoreSkeleton from '@/components/view/common/ShowScoreSkeleton'
import { groupbattledata } from '@/store/reducers/groupbattleSlice'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import FirebaseData from '@/utils/Firebase'
const GroupBattleScore = lazy(() => import('@/components/Quiz/GroupBattle/GroupBattleScore'))
const GroupPlay = () => {
  const showScore = useSelector(selectResultTempData)

  let getData = useSelector(selecttempdata)
    const groupBattledata = useSelector(groupbattledata)
    const systemconfig = useSelector(sysConfigdata)
    let battleRoomDocumentId = groupBattledata.roomID
    
    // Initialize Firebase properly
    const { db } = FirebaseData();
    
    const deleteBattleRoom = async () => {

        try {
            await deleteDoc(doc(db, "multiUserBattleRoom", battleRoomDocumentId));
        } catch (error) {
            toast.error(error);
        }
    };
    useEffect(() => {
        deleteBattleRoom()
    }, []);

  return (
    <Layout>
      <Breadcrumb title={t('group_battle')} content={t('')} contentTwo='' />
      <div className='container mb-2'>
        <>
          <Suspense fallback={<ShowScoreSkeleton />}>
            <GroupBattleScore totalQuestions={showScore.totalQuestions} />
          </Suspense>
        </>
      </div>
    </Layout>
  )
}
export default withTranslation()(GroupPlay)
