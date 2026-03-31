import React from 'react'
import { withTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { funandlearnComphremsionDataSuccess, Loadtempdata } from '@/store/reducers/tempDataSlice'
import { t } from "@/utils";
import { useDispatch } from 'react-redux';
const FunandLearnIntro = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const handleSubcategory = subdata => {
    Loadtempdata(data);    
    dispatch(funandlearnComphremsionDataSuccess(subdata))
    router.push({
      pathname: `/fun-and-learn/fun-data/${subdata.id}/fun-and-learn-play`,
      query: {
        fun_learn_id: subdata.id,
      }
    })
  }

  return (
    <div className="relative">
      <div onClick={() => handleSubcategory(data)} >
        <div className=" darkSecondaryColor group overflow-hidden p-4 w-full bgcolor border-none rounded-lg cursor-pointer min-h-24 flex items-center justify-center bgWave relative bordercolor">
          <div className=" w-full">
            <p className="text-center font-bold text-xl sm:text-2xl line-clamp-1 mb-2">
              {data.title}
            </p>
            <p className="text-center line-clamp-1 transition-all duration-500 ease-in-out ">
              {t('questions')} : {data.no_of_que}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withTranslation()(FunandLearnIntro)
