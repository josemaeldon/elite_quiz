"use client";
import { truncate } from "@/utils";
import { withTranslation } from "react-i18next";
import LineFooterForTitle from "@/components/Common/LineFooterForTitle";
import Image from "next/image";

const ChooseUs = (props) => {
  const data = [
    {
      id: "1",
      image: props?.homeSettings?.section1_image1,
      title: props?.homeSettings?.section1_title1,
      desc: props?.homeSettings?.section1_desc1,
    },
    {
      id: "2",
      image: props?.homeSettings?.section1_image2,
      title: props?.homeSettings?.section1_title2,
      desc: props?.homeSettings?.section1_desc2,
    },
    {
      id: "3",
      image: props?.homeSettings?.section1_image3,
      title: props?.homeSettings?.section1_title3,
      desc: props?.homeSettings?.section1_desc3,
    },
  ];

  return (
    <>
      {!props.isLoading ? (
        <section className="commonMT font-lato">
          <div className="container">
            <div className="flex flex-wrap">
              <div className="relative w-max mx-auto mb-5">
                <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-semibold">
                  {props?.homeSettings?.section1_heading}
                </h2>
                <LineFooterForTitle />
              </div>
            </div>
            <div className="mt-14 md:mt-16 lg:mt-20 text-center">
              <div className="flex flex-wrap gap-16 md:gap-0">
                {data &&
                  data.map((elem, index) => (
                    <div
                      className="md:w-1/3 w-full  group"
                      key={index}
                    >
                      <div className="m-2 relative py-5 px-4 rounded-2xl bg-[var(--background-2)] border-2 border-solid border-white darkSecondaryColor dark:border-none dark:after:content-[''] dark:after:absolute dark:after:left-1/2 dark:after:top-1/2 dark:after:-translate-x-1/2 dark:after:-translate-y-1/2 dark:after:w-[70%] dark:after:h-[105%] dark:after:rounded-full dark:after:opacity-40 dark:after:bg-[#6C386799] dark:after:blur-[47px] dark:after:-z-10">
                        <div className="flex justify-center">
                          <Image
                            width={0}
                            height={0}
                            className={`${process.env.NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE === "true" && 'dark:filter dark:brightness-0 dark:invert'} group-hover:animate-zoominout mb-7 mt-[-54px] text-center w-20 md:w-24 h-20 md:h-24 `}
                            src={elem?.image}
                            alt="line"
                          />
                        </div>
                        <div className="title mb-4 mt-2">
                          <h3 className="text-xl lg:text-2xl font-medium">{truncate(elem?.title, 19)}</h3>
                        </div>
                        <div className="desc">
                          <p className="text-text-color font-normal lg:px-10">{truncate(elem?.desc, 115)}</p>
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

export default withTranslation()(ChooseUs);
