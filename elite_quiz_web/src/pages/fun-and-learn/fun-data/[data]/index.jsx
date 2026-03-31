"use client";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { t } from "@/utils";
import { getFunAndLearnApi } from "@/api/apiRoutes";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import FunandLearnSlider from "@/components/Quiz/Fun_and_Learn/FunandLearnSlider";

const Fun_and_Learn = () => {
  const [funandlearn, setFunandLearn] = useState({ all: "", selected: "" });

  const router = useRouter();

  const [funandlearningloading, setfunandlearnLoading] = useState(true);

  const getAllData = async () => {
    setFunandLearn([]);

    if (router.query.isSubcategory === "0") {
      // subcategory api
      const response = await getFunAndLearnApi({
        type: "category",
        type_id: router.query.catid,
      });

      if (!response?.error) {
        let funandlearn_data = response.data;
        setFunandLearn({
          all: funandlearn_data,
          selected: funandlearn_data[0],
        });
        setfunandlearnLoading(false);
      } else {
        setFunandLearn({
          all: [],
          selected: "",
          error: true,
        });
        setfunandlearnLoading(false);
        console.log(response);
        toast.error(t("no_data_found"));
      }
    } else {
      const response = await getFunAndLearnApi({
        type: "subcategory",
        type_id: router.query.catid,
      });

      if (!response?.error) {
        let funandlearn_data = response.data;
        setFunandLearn({
          all: funandlearn_data,
          selected: funandlearn_data[0],
        });
        setfunandlearnLoading(false);
      } else {
        setfunandlearnLoading(false);
        console.log(response);
        setFunandLearn({
          all: [],
          selected: "",
          error: true,
        });
        toast.error(t("no_data_found"));
      }
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
        contentThree={funandlearn?.selected?.category_name}
        contentFour={funandlearn?.selected?.subcategory_name}
      />
      <div className="container mb-2">
        <div className="px-4 py-12 rounded-[46px]  bg-white xl:py-22 relative my-14">
        <FunandLearnSlider
              data={funandlearn.all}
              selected={funandlearn.selected}
              funandlearningloading={funandlearningloading}
            />
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(Fun_and_Learn);
