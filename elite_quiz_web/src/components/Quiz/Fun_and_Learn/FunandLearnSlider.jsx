import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { lazy } from "react";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
const FunandLearnIntro = lazy(() => import("./FunandLearnIntro"));

const FunandLearnSlider = (data) => {
  console.log(data);
  return (
    <>
      <div >
        {data?.funandlearningloading ? (
          <div className="text-center">
            <CatCompoSkeleton />
          </div>
        ) : (
          <>
            {data?.data?.length > 0 ? (
              <>
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
                {data?.data?.length > 0 &&
                  data.data.map((Fundata, key) => {
                    return (
                      <div key={key}>
                        <FunandLearnIntro
                            categoryall={data.categoryall}
                            subcategoryall={data.subcategoryall}
                            data={Fundata}
                            funandlearn={Fundata?.id}
                          />
                      </div>
                    );
                  })}
                  </div>
              </>
            ) : (
              <div className="  flex-center flex-col gap-4 mt-[-100px]">
            <ThemeSvg
              src={errorimg.src}
              className="!w-[110px] !h-[110px]"
              alt="Error"
              colorMap={{
                "#e03c75": "var(--primary-color)",
                "#551948": "var(--secondary-color)",
                "#3f1239": "var(--secondary-color)",
                "#7b2167": "var(--secondary-color)",
                "#ac5e9f": "var(--primary-light)",
                "url(#linear-gradient)": "url(#linear-gradient)",
              }}
            />
            <p className="text-center text-text-color">
              {t("no_data_found")}
            </p>
          </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default withTranslation()(FunandLearnSlider);
