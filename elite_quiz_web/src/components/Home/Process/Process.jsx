"use client";
import workline from "../../../assets/images/lightline.svg";
import { withTranslation } from "react-i18next";
import { getImageSource, truncate } from "@/utils";
import LineFooterForTitle from "@/components/Common/LineFooterForTitle";

const Process = (props) => {
  const data = [
    {
      firstCss: "",
      secondCss: "1.",
      src: props?.homeSettings?.section3_image1,
      title: props?.homeSettings?.section3_title1,
      des: props?.homeSettings?.section3_desc1,
      before: "top-0 left-0",
      qq: "",
    },
    {
      firstCss: "lg:mt-24",
      secondCss: "2.",
      src: props?.homeSettings?.section3_image2,
      title: props?.homeSettings?.section3_title2,
      des: props?.homeSettings?.section3_desc2,
      before: "bottom-0 right-0 top-auto left-auto",
      qq: "",
    },
    {
      firstCss: "lg:mt-12",
      secondCss: "3.",
      src: props?.homeSettings?.section3_image3,
      title: props?.homeSettings?.section3_title3,
      des: props?.homeSettings?.section3_desc3,
      before: "top-0 left-0",
      qq: "",
    },
    {
      firstCss: "",
      secondCss: "4.",
      src: props?.homeSettings?.section3_image4,
      title: props?.homeSettings?.section3_title4,
      des: props?.homeSettings?.section3_desc4,
      before: "bottom-0 right-0 top-auto left-auto",
      qq: "",
    },
  ];
  return (
    <>
      {!props.isLoading ? (
        <section className="relative block commonMT [counter-reset:count] z-[1] dark:before:content-[''] dark:before:absolute dark:before:w-[74%] dark:before:aspect-[1/1] dark:before:top-[-100%] dark:before:right-[-46%] dark:before:bg-[#351F8B] dark:before:blur-[91px] dark:before:-z-10 dark:before:opacity-35 dark:before:rounded-full">
          <div className="container">
            <div className="flex flex-wrap">
              <div className="relative w-max m-auto">
                <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-semibold">
                  {props?.homeSettings?.section3_heading}
                </h2>
                <LineFooterForTitle />
              </div>
            </div>
            <div className="flex flex-wrap filter-layout masonary-layout mt-10 md:mt-12 relative">
              <div className="absolute mx-auto w-full flex justify-center top-[25%] left-0 right-0 text-center z-[0] max-1200:hidden transform -translate-y-1/2">
                <img className="opacity-80" src={getImageSource(workline.src)} alt="line" />
              </div>
              {data.map((data, key) => {
                return (
                  <div className="w-full md:w-1/2 lg:w-1/4 xl:w-1/4" key={key}>
                    <div className={`relative block mb-7 ${data.firstCss}`}>
                      <div className="relative block w-40 mx-auto mb-[23px] z-[2]">
                        <div className="relative flex items-center justify-center h-36 w-36  rounded-full my-0 mx-auto bg-white dark:bg-transparent shadow-sm overflow-hidden">
                          <div className="absolute inset-0 bg-[var(--background-2)] rounded-full darkSecondaryColor dark:after:content-[''] dark:after:absolute dark:after:left-1/2 dark:after:top-1/2 dark:after:-translate-x-1/2 dark:after:-translate-y-1/2 dark:after:w-[70%] dark:after:h-[70%] dark:after:rounded-full dark:after:opacity-25 dark:after:bg-[#c564bb]/80 dark:after:blur-[25px] dark:after:-z-10"></div>
                          <img
                            className={`${process.env.NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE === "true" && 'dark:filter dark:brightness-0 dark:invert'} w-16 h-16 object-contain relative z-[1]`}
                            src={getImageSource(data.src)}
                            alt="process"
                          />
                        </div>
                        <div
                          className={`${data.before} absolute w-10 h-10 text-base bg-primary-color text-white rounded-full font-normal tracking-tight z-[2] transition-all duration-300 ease-linear 
                          delay-100 text-center before:top-[-35px] before:lef-[75px] before:w-10 before:h-10 before:text-center before:text-base before:leading-10 before:font-normal
                          `}
                          style={{ content: `'${"1"}'` }}
                        >
                          <span className="absolute top-[23%] left-[32%] text-white">
                            {data.secondCss}
                          </span>
                        </div>
                      </div>

                      <div className="relative block text-center">
                        <h2 className="text-lg md:text-xl font-medium mb-2">
                          <a>{truncate(data.title, 19)}</a>
                        </h2>
                        <p className="text-sm font-normal">
                          {truncate(data.des, 72)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default withTranslation()(Process);
