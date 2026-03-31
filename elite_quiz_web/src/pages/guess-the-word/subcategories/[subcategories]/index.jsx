"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import { Loadtempdata, getSelectedCategory } from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getSubcategoriesApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const SubCategoriesComponent = lazy(() =>
  import("@/components/view/common/SubCategoriesComponent")
);

const Guessthewordplay = () => {
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
    Loadtempdata(data);
    router.push({
      pathname: "/guess-the-word/guess-the-word-play",
      query: {
        subcategory_id: data.id,
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
        title={t("guess_the_word")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("guess_the_word")}
        contentThree={selectedCategory?.category_name}
      />

      <div className="container mb-2 ">
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
export default withTranslation()(Guessthewordplay);
