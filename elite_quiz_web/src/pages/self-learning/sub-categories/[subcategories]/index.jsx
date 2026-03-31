"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import toast from "react-hot-toast";
import { t } from "@/utils";
import { Loadtempdata, getSelectedCategory, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";
import { isValidSlug, scrollhandler } from "@/utils";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getSubcategoriesApi } from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
const SubCategoriesComponent = lazy(() =>
  import("@/components/view/common/SubCategoriesComponent")
);
const SelfLearning = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedCategory = useSelector(getSelectedCategory);
  const cateSlug = router.query.subcategories;

  // subcategory
  const [subcategory, setsubcategory] = useState({
    all: "",
    selected: "",
  });

  // all data
  const getAllData = async () => {
    if (cateSlug) {
      const response = await getSubcategoriesApi({
        category_id: cateSlug,
      });

      if (!response?.error) {
        let subcategories = response.data;
        setsubcategory({
          all: subcategories,
          selected: subcategories[0],
        });
      } else {
        setsubcategory("");
        toast.error(t("no_subcat_data_found"));
      }
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (subcategory_data) => {
    // this is for premium subcategory only
    dispatch(selectedSubCategorySuccess(subcategory_data));
    Loadtempdata(subcategory_data);
    const slug = subcategory_data.slug;
    if (isValidSlug(slug)) {
      router.push({
        pathname: `/self-learning/selection/${subcategory_data.slug}`,
        query: {
          catslug: cateSlug,
          subcatslug: subcategory_data.slug,
        },
      });
    }
    scrollhandler(700);
  };

  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectCurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("self_challenge")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("self_challenge")}
        contentThree={selectedCategory?.category_name}
      />
      <div className="quizplay quizplay mb-5">
        <div className="container mb-2">
          <div className="row morphisam mb-5">
            {/* sub category middle sec */}
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12">
              <div className="right-sec">
                <div className="subcat__slider__context">
                  <div className="quizplay-slider">
                    {subcategory.all ? (
                      <SubCategoriesComponent
                        subCategory={subcategory.all}
                        handleChangeSubCategory={handleChangeSubCategory}
                      />
                    ) : (
                      <CatCompoSkeleton />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(SelfLearning);
