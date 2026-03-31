"use client";
import { withTranslation } from "react-i18next";
import { getImageSource, truncate } from "@/utils";
import LineFooterForTitle from "@/components/Common/LineFooterForTitle";
import darkModeStar from "@/assets/images/darkModeStar.png";
const Features = (props) => {
  const data = [
    {
      id: "1",
      image: props?.homeSettings?.section2_image1,
      title: props?.homeSettings?.section2_title1,
      desc: props?.homeSettings?.section2_desc1,
    },
    {
      id: "2",
      image: props?.homeSettings?.section2_image2,
      title: props?.homeSettings?.section2_title2,
      desc: props?.homeSettings?.section2_desc2,
    },
    {
      id: "3",
      image: props?.homeSettings?.section2_image3,
      title: props?.homeSettings?.section2_title3,
      desc: props?.homeSettings?.section2_desc3,
    },
    {
      id: "4",
      image: props?.homeSettings?.section2_image4,
      title: props?.homeSettings?.section2_title4,
      desc: props?.homeSettings?.section2_desc4,
    },
  ];
  return (
    <>
      {!props.isLoading ? (
        <section className="commonMT ">
          <div className="container relative">
          <img src={darkModeStar.src} alt="darkModeStar" className="darkModeStar flip-float -bottom-[80px]  right-[10%] w-[80px] h-[80px]" />
          <img src={darkModeStar.src} alt="darkModeStar" className="darkModeStar flip-float -top-[30px] left-[10%] w-[60px] h-[60px]" />
            <div className="flex flex-wrap">
              <div className="relative w-max mx-auto lg:mb-5">
                <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-semibold">
                  {props?.homeSettings?.section2_heading}
                </h2>
                <LineFooterForTitle />
              </div>
            </div>
            <div className="mt-4 md:mt-8 lg:mt-10">
              <div className="flex flex-wrap">
                {data &&
                  data.map((elem, index) => (
                    <div className="w-full md:w-1/2 group" key={index}>
                      <div className="flex flex-col items-center md:flex-row gap-3 lg:gap-6 relative mb-4 md:mb-6 p-4 lg:p-8 border border-white bg-[var(--background-2)] rounded-2xl m-3 darkSecondaryColor dark:border-none">
                        <div  className="w-20 lg:w-24 flex-shrink-0 mx-auto md:mx-0 dark:after:content-[''] relative dark:after:absolute dark:after:left-1/2 dark:after:top-1/2 dark:after:-translate-x-1/2 dark:after:-translate-y-1/2 dark:after:w-[130%] dark:after:h-[130%] dark:after:rounded-full  dark:after:bg-[#6c3867]/60 dark:after:blur-[120px] dark:after:-z-10">
                          <img
                            className="w-full h-20 lg:h-24 object-contain group-hover:animate-zoominout "
                            src={getImageSource(elem?.image)}
                            alt="line"
                          />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                          <h3 className="text-text-color text-lg md:text-xl lg:text-2xl font-medium mb-2">
                            {truncate(elem?.title, 19)}
                          </h3>
                          <p className="text-[15px] md:text-sm lg:text-base font-normal">
                            {truncate(elem?.desc, 115)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default withTranslation()(Features);
