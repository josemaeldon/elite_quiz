"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { getSelectedCategory, Loadtempdata } from "@/store/reducers/tempDataSlice";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getSubcategoriesApi } from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const SubCategoriesComponent = lazy(() =>
  import("@/components/view/common/SubCategoriesComponent")
);
const MySwal = withReactContent(Swal);

const MathMania = () => {
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
      setsubCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (data) => {
    Loadtempdata(data);
    router.push({
      pathname: `/math-mania/math-mania-play`,
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
        title={t("math_mania")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("math_mania")}
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
export default withTranslation()(MathMania);
