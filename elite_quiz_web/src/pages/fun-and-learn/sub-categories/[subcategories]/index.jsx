"use client";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import FunandLearnSubCatSlider from "@/components/Quiz/Fun_and_Learn/FunandLearnSubCatSlider";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import { getSelectedCategory } from "@/store/reducers/tempDataSlice";
import { isValidSlug } from "@/utils";
import { getSubcategoriesApi } from "@/api/apiRoutes";
import toast from "react-hot-toast";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const Fun_and_Learn = () => {
  const [subCategory, setsubCategory] = useState({ all: "", selected: "" });
  const selectedCategory = useSelector(getSelectedCategory); 


  const [subloading, setSubLoading] = useState(true);

  const router = useRouter();

  const cateSlug = router.query.subcategories;

  const getAllData = async () => {
    setsubCategory([]);
    if (cateSlug) {
      const response = await getSubcategoriesApi({
        category_id: cateSlug,
      });

      if (!response?.error) {
        let subcategories = response.data;
        setsubCategory({
          all: subcategories,
          selected: subcategories[0],
        });
        setSubLoading(false);
      }

      if (response.error) {
        setsubCategory("");
        setSubLoading(false);
        toast.error(t("no_subcat_data_found"));
      }
    } else {
      toast.error(t("no_data_found"));
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (subcategory_data) => {
    // this is for premium subcategory only    
    const slug = subcategory_data.slug;
    if (isValidSlug(slug)) {
      router.push({
        pathname: `/fun-and-learn/fun-data/${subcategory_data.slug}`,
        query: {
          catid: subcategory_data.id,
          subcatid: subcategory_data.id,
          isSubcategory: 1,
        },
      });
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectCurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("fun_learn")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("fun_learn")}
        contentThree={selectedCategory?.category_name}
      />
      <div className="container mb-2">
        <FunandLearnSubCatSlider
          data={subCategory?.all}
          selected={subCategory.selected}
          onClick={handleChangeSubCategory}
          subloading={subloading}
        />
      </div>
    </Layout>
  );
};

export default withTranslation()(Fun_and_Learn);
