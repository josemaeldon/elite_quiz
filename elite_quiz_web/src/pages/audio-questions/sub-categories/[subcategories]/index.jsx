"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import { getSelectedCategory, Loadtempdata, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";

import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getSubcategoriesApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const SubCategoriesComponent = lazy(() =>
  import("@/components/view/common/SubCategoriesComponent")
);

const AudioQuestions = () => {
  const dispatch = useDispatch();
  const [subCategory, setsubCategory] = useState([]);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);

  const router = useRouter();
  const cateSlug = router.query.subcategories;

  const getAllData = async () => {
    if (cateSlug) {
      const response = await getSubcategoriesApi({
        category_id: cateSlug,
      });

      if (!response?.error) {
        let subcategories = response.data;

        setsubCategory(subcategories);
      }

      if (response.error) {
        setsubCategory("");
        toast.error(t("no_subcat_data_found"));
      }
    } else {
      toast.error(t("no_data_found"));
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (data) => {
    dispatch(selectedSubCategorySuccess(data));
    Loadtempdata(data);
    router.push({
      pathname: `/audio-questions/audio-questions-play`,
      query: {
        subcatid: data.id,
        is_play: data.is_play,
      },
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectcurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("audio_questions")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("audio_questions")}
        contentThree={selectedCategory?.category_name}
      />

      <div className="container mb-2">
        {subCategory.length > 0 ? (
          <SubCategoriesComponent
            subCategory={subCategory}
            handleChangeSubCategory={handleChangeSubCategory}
          />
        ) : (
          <CatCompoSkeleton />
        )}
      </div>
    </Layout>
  );
};
export default withTranslation()(AudioQuestions);
