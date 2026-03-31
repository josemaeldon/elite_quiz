"use client";
import React, { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils/index";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { isValidSlug } from "@/utils/index";
import {
  getSelectedCategory,
  getSelectedSubCategory,
  selectedSubCategorySuccess,
} from "@/store/reducers/tempDataSlice";
import SubCategoriesComponent from "@/components/view/common/SubCategoriesComponent";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getSubcategoriesApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const QuizZone = () => {
  const [subCategory, setsubCategory] = useState([]);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  const router = useRouter();
  const cateSlug = router.query.subcategories;
  const dispatch = useDispatch();
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
      setsubCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (data) => {
    dispatch(selectedSubCategorySuccess(data));
    const slug = data.slug;

    // Check if subcategory has levels
    if (data.has_level === "0" || data.has_level === 0) {
      // No levels - go directly to play screen (API will be called in dashboard-play)
      if (isValidSlug(slug)) {
        router.push({
          pathname: `/multi-match-questions/level/${slug}/dashboard-play`,
          query: {
            catid: cateSlug,
            subcatid: slug,
            subcategory_id: data.id,
            isSubcategory: 1,
            is_play: data?.is_play,
            hasLevel: 0,
          },
        });
      }
    } else {
      // Has levels - go to level selection
      if (isValidSlug(slug)) {
        router.push({
          pathname: `/multi-match-questions/level/${data.slug}`,
          query: {
            catid: cateSlug,
            subcatid: data.slug,
            isSubcategory: 1,
            is_play: data?.is_play,
          },
        });
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
        title={t("multi_match")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("multi_match")}
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
export default withTranslation()(QuizZone);
