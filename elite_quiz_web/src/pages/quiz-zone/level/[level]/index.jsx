"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getLevelDataApi } from "@/api/apiRoutes";
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

  const getAllData = async () => {
    setLevel([]);

    if (router.query.isSubcategory == 0) {
      // level data api
      const levelDataResponse = await getLevelDataApi({
        category_id: router.query.catid,
        subcategory_id: "",
      });
      if (levelDataResponse) {
        let level = levelDataResponse.data;
        setLevel(level);
        setLevelLoading(false);
      }
      if (levelDataResponse.error) {
        setLevel("");
        setLevelLoading(false);
        toast.error(levelDataResponse.error.message);
      }
    } else {
      const levelDataResponse = await getLevelDataApi({
        category_id: router.query.catid,
        subcategory_id: router.query.subcatid,
      });

      if (levelDataResponse) {
        let level = levelDataResponse.data;
        setLevel(level);
        setLevelLoading(false);
      }
      if (levelDataResponse.error) {
        setLevel("");
        setLevelLoading(false);
        toast.error(levelDataResponse.error.message);
        console.error(levelDataResponse);
      }
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
        title={t("quiz_zone")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("quiz_zone")}
        contentThree={level?.category?.category_name}
        contentFour={level?.subcategory?.subcategory_name}
      />
      <div className=" mb-5">
        <div className="container mb-2">
          <div className="">
            {/* sub category middle sec */}
            <Suspense fallback={<CatCompoSkeleton />}>
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
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(Level);
