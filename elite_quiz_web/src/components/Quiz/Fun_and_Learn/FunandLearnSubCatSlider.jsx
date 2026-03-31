import { lazy, Suspense } from 'react'
import { withTranslation } from 'react-i18next'
import CatCompoSkeleton from '@/components/view/common/CatCompoSkeleton'
const SubCategoriesComponent = lazy(() => import('@/components/view/common/SubCategoriesComponent'))

// import SubCategoriesComponent from '@/components/view/common/SubCategoriesComponent";

const FunandLearnSubCatSlider = data => {
  console.log(data);
  const handleChangeSubCategory = subcat => {
    data.onClick(subcat)
  }
  return (
    <>
      {!data?.subloading  ? (
        <SubCategoriesComponent subCategory={data.data} handleChangeSubCategory={handleChangeSubCategory} />
      ) : (
        <CatCompoSkeleton />
      )}
    </>
  )
}
export default withTranslation()(FunandLearnSubCatSlider)
