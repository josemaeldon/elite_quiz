"use client";
import React, { useState, useEffect, Suspense } from "react";
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
import {
  reviewAnswerShowSuccess,
  selectedCategorySuccess,
} from "@/store/reducers/tempDataSlice";
import CategoriesComponent from "@/components/view/common/CategoriesComponent";
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

const QuizZone = () => {
  const [category, setCategory] = useState({ all: "", selected: "" });
  const [isLoading, setIsLoading] = useState(true);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const router = useRouter();

  const dispatch = useDispatch();

  const getAllData = async () => {
    setCategory([]);

    const response = await getCategoriesApi({
      type: 1,
    });

    if (!response?.error) {
      let categories = response.data;

      setCategory({ ...category, all: categories, selected: categories[0] });
      setIsLoading(false);
    }

    if (response.error) {
      setIsLoading(false);
      setCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle category
  const handleChangeCategory = async (data) => {
    dispatch(selectedCategorySuccess(data));

    // this is for premium category only - needs unlock first
    if (data.has_unlocked === "0" && data.is_premium === "1") {
      const getCoinsResponse = await getUserCoinsApi();
      if (!getCoinsResponse.error) {
        if (Number(data.coins) > Number(getCoinsResponse.data.coins)) {
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
                // Deduct coins
                const deductCoinsResponse = await setUserCoinScoreApi({
                  coins: "-" + data.coins,
                  title: "quiz_zone_premium_cat",
                });

                if (!deductCoinsResponse?.error) {
                  const getCoinsResponse = await getUserCoinsApi();
                  if (getCoinsResponse) {
                    updateUserDataInfo(getCoinsResponse.data);
                  }
                }

                if (deductCoinsResponse?.error) {
                  Swal.fire(t("ops"), t("please "), t("try_again"), "error");
                  return;
                }

                // After premium unlock, navigate based on subcategories and has_level
                navigateAfterCategorySelect(data);
              } else {
                console.log(response);
              }
            }
          });
        }
      } else {
        console.log(getCoinsResponse);
      }
    } else {
      // Not a locked premium category - navigate directly
      navigateAfterCategorySelect(data);
    }
    //mobile device scroll handle
    scrollhandler(500);
  };

  // Helper function to navigate after category selection
  const navigateAfterCategorySelect = (data) => {
    const slug = data.slug;

    // Step 1: Check if category has subcategories
    if (data.no_of !== "0") {
      // Has subcategories - go to subcategories page
      if (isValidSlug(slug)) {
        router.push({
          pathname: `/quiz-zone/sub-categories/${slug}`,
        });
      } else {
        console.log("Invalid slug, not redirecting");
      }
      return;
    }

    // Step 2: No subcategories - check has_level
    if (data.has_level === "0" || data.has_level === 0) {
      // No levels - go directly to play screen (API will be called in dashboard-play)
      if (isValidSlug(slug)) {
        router.push({
          pathname: `/quiz-zone/level/${slug}/dashboard-play`,
          query: {
            catid: slug,
            category_id: data.id,
            isSubcategory: 0,
            is_play: data?.is_play,
            hasLevel: 0,
          },
        });
      } else {
        console.log("Invalid slug, not redirecting");
      }
    } else {
      // Has levels - go to level selection page
      if (isValidSlug(slug)) {
        router.push({
          pathname: `/quiz-zone/level/${slug}`,
          query: {
            catid: slug,
            isSubcategory: 0,
            is_play: data?.is_play,
          },
        });
      } else {
        console.log("Invalid slug, not redirecting");
      }
    }
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
        title={t("quiz_zone")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={t("quiz_zone")}
      />
      <div className="container  mb-14">
        <ul>
          {isLoading ? (
            <CatCompoSkeleton />
          ) : (
            <CategoriesComponent
              category={category}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </ul>
      </div>
    </Layout>
  );
};
export default withTranslation()(QuizZone);
