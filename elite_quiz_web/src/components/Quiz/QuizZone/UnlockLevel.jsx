import React, { Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { t } from "@/utils";
import { Loadtempdata } from "@/store/reducers/tempDataSlice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const UnlockLevel = (data) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLockClick = () => {
    toast.error(t("play_previous_to_unlock"));
  };

  const handleLoadData = (alldata) => {
    router.push(
      `/${pathname.split("/")[1]}/level/${data.levelslug}/dashboard-play`
    );
    Loadtempdata(alldata);
  };

  const currentLevel = data.level.level - 1;

  return (
    <Fragment>
      <div className="flex justify-center w-full items-center mb-10">
        <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block "></div>
        <h5 className="w-full text-lg font-semibold text-center max-[1199px]:flex max-[1199px]:p-0 max-[1199px]:w-full max-[1199px]:text-center max-[1199px]:justify-center">
          {t("levels")}
        </h5>
        <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block "></div>
        <div></div>
      </div>
      {data.levelLoading ? (
        <div className="text-center">
          <Skeleton count={5} className="skeleton" />
        </div>
      ) : (
        <>
          <div className={`${data.count > 0 ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-3" : "flex-center"}`}>
            {data.count > 0 ? (
              Array.from(Array(parseInt(data.count)), (e, i) => {
                const isLevelPlayed = currentLevel >= i + 1;
                return (
                  <div className="" key={i + 1}>
                    {(() => {
                      if (Number(data.unlockedLevel) >= i + 1) {
                        let alldata = {
                          category:
                            data?.level?.category && data?.level?.category?.id,
                          subcategory:
                            data?.level?.subcategory &&
                            data?.level?.subcategory?.id,
                          level: i + 1,
                          unlockedLevel: data.unlockedLevel,
                          maxLevel: data?.level?.max_level,
                          isPlay: data?.isPlay,
                          isPremium:
                            data?.level?.category &&
                            data?.level?.category?.is_premium,
                        };
                        return (
                          <div onClick={() => handleLoadData(alldata)}>
                            <div className={`relative top-0 left-0 mt-4`}>
                              <div
                                className={`h-[85px] rounded-[8px] bg-[var(--background-2)] darkSecondaryColor  flex justify-center items-center flex-col cursor-pointer relative border-[2px] gap-4 overflow-hidden transition-all duration-500 ease-in-out   ${
                                  isLevelPlayed
                                    ? "border-[3px] border-solid border-[#00bf7a] bg-white "
                                    : "bgWave before:opacity-[0.2] "
                                }`}
                              >
                                <div className="flex justify-center items-center flex-col gap-[12px_0px] z-[12] relative">
                                  <div className="flex">
                                    <span className="font-lato text-lg md:text-[22px] font-bold leading-4 md:leading-6 text-text-color">
                                      {t("level")} : {i + 1}
                                    </span>
                                    {isLevelPlayed ? (
                                      <span className="text-[#00bf7a] relative rtl:-left-[10px] ltr:left-[10px] text-[18px]">
                                        <IoMdCheckmarkCircleOutline />
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <span className="font-lato text-[12px] md:text-[14px] font-normal leading-4 md:leading-6 text-text-color relative top-0 transition-top duration-500 ease-in-out">
                                    {data?.level?.level_data[i]?.no_of_ques <= 1
                                      ? t("Question")
                                      : t("questions")}{" "}
                                    : {data?.level?.level_data[i]?.no_of_ques}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="relative top-0 left-0  mt-4 ">
                            <div
                              className="h-[85px] opacity-[0.5] bg-[var(--background-2)] darkSecondaryColor rounded-[8px] after:blur-[16px] flex justify-center items-center flex-col cursor-pointer relative border-[2px] gap-4 overflow-hidden transition-all duration-500 ease-in-out after:absolute after:bg-[#212121] after:opacity-[0.1] after:w-full after:h-[57px] after:z-[-1] after:mt-[33px] after:rounded-[30px] after:right-0 bordercolor"
                              onClick={handleLockClick}
                            >
                              <div className="flex justify-center items-center flex-col gap-[12px_0px] z-[12] relative">
                                <span className="font-lato text-xl md:text-[22px] font-bold leading-4 md:leading-6 text-text-color">
                                  {t("level")} : {i + 1}
                                </span>
                                <span className="font-lato text-[12px] md:text-[14px] font-normal leading-4 md:leading-6 text-text-color relative top-0 transition-top duration-500 ease-in-out">
                                  {data?.level?.level_data[i]?.no_of_ques <= 1
                                    ? t("Question")
                                    : t("questions")}{" "}
                                  : {data?.level?.level_data[i]?.no_of_ques}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                );
              })
            ) : (
              <div className="text-center mt-4 commonerror">
                <div className="w-[163px]">
                  <ThemeSvg
                    src={errorimg.src}
                    width="100%"
                    height="100%"
                    alt="Error"
                    colorMap={{
                      "#e03c75": "var(--primary-color)",
                      "#551948": "var(--secondary-color)",
                      "#3f1239": "var(--secondary-color)",
                      "#7b2167": "var(--secondary-color)",
                      "#ac5e9f": "var(--primary-color)",
                    }}
                  />
                </div>
                <p>{t("no_levels_data_found")}</p>
              </div>
            )}
          </div>
        </>
      )}
    </Fragment>
  );
};
export default UnlockLevel;
