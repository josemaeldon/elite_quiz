"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { isValidSlug, scrollhandler } from "@/utils";
import { t } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
const MySwal = withReactContent(Swal);
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import {
  Loadtempdata,
  reviewAnswerShowSuccess,
  selectedCategorySuccess,
  selectedSubCategorySuccess,
} from "@/store/reducers/tempDataSlice";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import {
  getCategoriesApi,
  getUserCoinsApi,
  setUserCoinScoreApi,
  unlockPremiumCatApi,
} from "@/api/apiRoutes";
const CategoriesComponent = lazy(() =>
  import("@/components/view/common/CategoriesComponent")
);
const SelfLearning = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState({ all: "", selected: "" });
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const router = useRouter();

  const getAllData = async () => {
    setCategory([]);

    const response = await getCategoriesApi({
      type: 1,
      sub_type: 1,
    });

    if (!response?.error) {
      let categories = response.data;
      setCategory({ ...category, all: categories });
    }

    if (response.error) {
      setCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle category
  const handleChangeCategory = async (data) => {
    dispatch(selectedCategorySuccess(data));
    dispatch(selectedSubCategorySuccess({}));
    // this is for premium category only
    if (data.has_unlocked === "0" && data.is_premium === "1") {
      const response = await getUserCoinsApi();
      if (!response?.error) {
        if (Number(data.coins) > Number(response.data.coins)) {
          MySwal.fire({
            text: t("no_enough_coins"),
            icon: "warning",
            showCancelButton: false,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: `OK`,
            allowOutsideClick: false,
          });
        } else {
          MySwal.fire({
            text: t("double_coins_achieve_higher_score"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: `use ${data.coins} coins`,
            allowOutsideClick: false,
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await unlockPremiumCatApi({
                cat_id: data.id,
              });

              if (!response?.error) {
                getAllData();

                const deductCoins = async () => {
                  const response = await setUserCoinScoreApi({
                    coins: "-" + data.coins,
                    title: 'self_challenge_premium_cat',
                  });

                  if (!response?.error) {
                    const getCoinsResponse = await getUserCoinsApi();
                    if (getCoinsResponse) {
                      updateUserDataInfo(getCoinsResponse.data);
                    }
                  }

                  if (response.error) {
                    Swal.fire(t("ops"), t("please "), t("try_again"), "error");
                  }

                  return response;
                };
                deductCoins();
              } else {
                console.log(response);
              }
            }
          });
        }
      } else {
        console.log(response);
      }
    } else {
      if (data.no_of !== "0") {
        const slug = data.slug;
        if (isValidSlug(slug)) {
          router.push({
            pathname: `/self-learning/sub-categories/${data.slug}`,
          });
        }
      } else {
        Loadtempdata(data);
        const slug = data.slug;
        if (isValidSlug(slug)) {
          router.push({
            pathname: `/self-learning/selection/${data.slug}`,
            query: {
              catslug: data.slug,
              isSubcategory: 0,
              is_play: data?.is_play,
            },
          });
        }
      }
    }
    //mobile device scroll handle
    scrollhandler(500);
  };

  //truncate text
  const truncate = (txtlength) =>
    txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength;

  useEffect(() => {
    getAllData();
    dispatch(reviewAnswerShowSuccess(false));
  }, [selectcurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("self_challenge")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("self_challenge")}
        contentThree=""
      />
      <div className="container  mb-14">
        {category.all ? (
          <CategoriesComponent
            category={category}
            handleChangeCategory={handleChangeCategory}
          />
        ) : (
          <CatCompoSkeleton />
        )}
      </div>
    </Layout>
  );
};
export default withTranslation()(SelfLearning);
