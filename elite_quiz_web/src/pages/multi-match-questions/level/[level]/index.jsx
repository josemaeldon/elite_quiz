"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { withTranslation } from "react-i18next";
import { t } from "@/utils/index";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getMultiMatchLevelApi } from "@/api/apiRoutes";
const UnlockLevel = lazy(() =>
  import("@/components/Quiz/QuizZone/UnlockLevel")
);
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const Level = () => {
  const [level, setLevel] = useState([]);
  const [levelloading, setLevelLoading] = useState(true);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const router = useRouter();

  const getAllData = async() => {
    setLevel([]);

    const response =await getMultiMatchLevelApi({
      category_slug: router.query.catid,
      subcategory_slug:
        router?.query?.isSubcategory == 0 ? "" : router.query.subcatid,
    });

    if (!response?.error) {
      let level = response.data;
      setLevel(level);
      setLevelLoading(false);
    } else {
      setLevel("");
      setLevelLoading(false);
      toast.error(error.message);
    }
    
  };

  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectcurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("multi_match")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("multi_match")}
        contentThree={level?.category?.category_name}
        contentFour={level?.subcategory?.subcategory_name}
      />
      <div className="container mx-auto min-h-[300px] px-4 sm:px-6 lg:px-10">
        <div className="pb-10 pt-5 flex flex-col space-x-4">
          {/* sub category middle sec */}
          {level.level > 0 ? (
            <UnlockLevel
              count={level?.max_level}
              category={level?.category?.id}
              subcategory={level?.subcategory?.id}
              unlockedLevel={level?.level}
              levelLoading={levelloading}
              levelslug={router.query.level}
              level={level}
              isPlay={router?.query?.is_play}
            />
          ) : (
            <CatCompoSkeleton />
          )}
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(Level);
