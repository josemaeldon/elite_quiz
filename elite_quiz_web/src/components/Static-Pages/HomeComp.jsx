"use client";
import ScrollToTop from "@/components/Common/ScrollToTop";
import IntroSlider from "@/components/Home/IntroSlider/IntroSlider";
import Features from "@/components/Home/Features/Features";
import Process from "@/components/Home/Process/Process";
import ChooseUs from "@/components/Home/WhyChooseUs/ChooseUs";
import { useSelector } from "react-redux";
import { selectHome } from "@/store/reducers/homeSlice";
import noDataImage from "../../assets/images/no_data_found.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { t } from "@/utils/index.jsx";

const HomeComp = () => {
  // const selectcurrentLanguage = useSelector(selectCurrentLanguage)
  const selectHomeData = useSelector(selectHome);

  return (
    <main>
      {selectHomeData.data !== "102" ? (
        <>
          <IntroSlider
            homeSettings={selectHomeData?.data}
            isLoading={selectHomeData?.loading}
          />
          {selectHomeData?.data?.section_1_mode === "1" ? (
            <ChooseUs
              homeSettings={selectHomeData?.data}
              isLoading={selectHomeData?.loading}
            />
          ) : null}
          {selectHomeData?.data?.section_2_mode === "1" ? (
            <Features
              homeSettings={selectHomeData?.data}
              isLoading={selectHomeData?.loading}
            />
          ) : null}
          {selectHomeData?.data?.section_3_mode === "1" ? (
            <Process
              homeSettings={selectHomeData?.data}
              isLoading={selectHomeData?.loading}
            />
          ) : null}
          <ScrollToTop />
        </>
      ) : (
        <div className="container mx-auto mb-14">
          <div className="flex justify-center">
            <ThemeSvg
              className="max-w-[500px] w-full h-full"
              width="100%"
              height="100%"
              src={noDataImage.src}
              alt="no data found"
              colorMap={{
                "#e03c75": "var(--primary-color)",
                "#551948": "var(--secondary-color)",
                "#3f1239": "var(--secondary-color)",
                "#7b2167": "var(--secondary-color)",
                "#ac5e9f": "var(--primary-color)",
              }}
            />
          </div>
          <h3 className="flex justify-center pt-5">{t("no_data_found")} </h3>
        </div>
      )}
    </main>
  );
};

export default HomeComp;
