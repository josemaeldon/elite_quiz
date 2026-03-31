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
import {
  Loadtempdata,
  reviewAnswerShowSuccess,
  selectedCategorySuccess,
} from "@/store/reducers/tempDataSlice";
import dynamic from "next/dynamic";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import {
  getCategoriesApi,
  getUserCoinsApi,
  setUserCoinScoreApi,
  unlockPremiumCatApi,
} from "@/api/apiRoutes";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
const CategoriesComponent = lazy(() =>
  import("@/components/view/common/CategoriesComponent")
);
const Guess_the_Word = () => {
  const [category, setCategory] = useState({ all: "", selected: "" });
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const router = useRouter();

  const dispatch = useDispatch();

  const getAllData = async () => {
    setCategory([]);

    const response = await getCategoriesApi({
      type: 3,
    });

    if (!response?.error) {
      let categories = response.data;
      setCategory({ ...category, all: categories, selected: categories[0] });
    }

    if (response.error) {
      setCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle category
  const handleChangeCategory = async (data) => {
    dispatch(selectedCategorySuccess(data));
    // this is for premium category only
    if (data.has_unlocked === "0" && data.is_premium === "1") {
      const response = await getUserCoinsApi({});

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
                    title: "guess_the_word_premium_cat",
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
            pathname: `/guess-the-word/subcategories/${data.slug}`,
          });
        }
      } else {
        Loadtempdata(data);
        router.push({
          pathname: "/guess-the-word/guess-the-word-play",
          query: {
            category_id: data.id,
            isSubcategory: 0,
          },
        });
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
  useEffect(() => {}, [category]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("guess_the_word")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("guess_the_word")}
      />
      <div className="container mb-2">
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
export default withTranslation()(Guess_the_Word);
