"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { getImageSource, t } from "@/utils";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { truncate } from "@/utils";
import darkModeStar from "@/assets/images/darkModeStar.png";

const IntroSlider = ({ homeSettings, isLoading }) => {
  return (
    <div className="intro-slider-wrap bg-[var(--background-2)] -mt-[112px] pt-[100px] relative max-[479px]:flex max-[479px]:justify-center max-[479px]:items-center max-[479px]:bg-transparent section  dark:before:content-[''] dark:before:absolute dark:before:w-[58%] dark:before:aspect-[1/1] dark:before:top-[-50%] dark:before:left-[-24%] dark:before:bg-[#6C386799] dark:before:blur-[91px] dark:before:-z-10 dark:before:opacity-35 dark:before:rounded-full">
      <div className="container mb-2 ">
        <Swiper
          // loop={true}
          spaceBetween={30}
          effect={"fade"}
          speed={500}
          autoplay={true}
          navigation={false}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active",
          }}
          fadeEffect={{
            crossFade: true,
          }}
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          className="mySwiper intro-slider"
        >
          {isLoading ? (
            // Show skeleton loading when data is being fetched
            <div className="col-12 absolute top-[9%] w-[73%] left-0 right-0 mx-auto max-991:relative">
              <Skeleton height={20} count={22} />
            </div>
          ) : homeSettings && homeSettings?.sliderData?.length > 0 ? (
            homeSettings?.sliderData.map((data, key) => (
              <SwiperSlide key={key}>
                <div className="flex items-center relative text-left mx-auto my-[40px] sm:text-center">
                  <img src={darkModeStar.src} alt="darkModeStar" className="darkModeStar flip-float -top-[30px] right-0 w-[40px] h-[40px]" />
                  <img src={darkModeStar.src} alt="darkModeStar" className="darkModeStar flip-float -bottom-[40px] left-[30%] w-[40px] h-[40px]" />
                  <div className="container relative px-0">
                    <div className="flex flex-col lg:flex-row items-center gap-5 lg:gap-3">
                      <div className="w-full lg:w-1/2 mb-4 text-left">
                        <div className="text-xl sm:text-2xl font-medium break-words overflow-hidden text-ellipsis lg:line-clamp-2 line-clamp-none lg:justify-start justify-center items-center">
                          <h3 className="capitalize text-xl sm:text-3xl md:text-4xl lg:text-6xl sm:leading-tight font-bold break-words text-center lg:text-start !leading-normal text-text-color	">
                            {data && truncate(data?.title, 44)}
                          </h3>
                          <p className="overflow-hidden text-ellipsis line-clamp-2 text-base sm:text-[24px] font-medium text-text-color break-words my-2 md:my-4 text-center lg:text-start !leading-tight">
                            {data && data?.description ? (
                              data?.description
                            ) : (
                              <Skeleton />
                            )}
                          </p>
                        </div>
                        <div className="flex justify-center lg:justify-normal mt-4 md:mt-6">
                          <Link
                            href={"/quiz-play"}
                            className="btn btn-primary rounded-[8px] slider1__btn me-2 "
                          >
                            <Button variant="login" className="w-auto py-3 md:py-[25px] ">
                              {t("lets_lay")}
                            </Button>
                          </Link>
                          <Link
                            href={"/contact-us"}
                            className="btn slider1__btn2 text-white "
                          >
                            <Button
                              variant="login"
                              className="w-auto bg-secondary-color !py-3 md:!py-6 flex-center dark:border dark:border-white"
                            >
                              {t("contact_us")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2">
                        <div className="bg-center bg-no-repeat w-full relative max-w-full max-h-full">
                          {data?.image ? (
                            <img
                              className="animate-updown w-full h-full max-h-[450px] object-contain"
                              src={getImageSource(data?.image)}
                              alt="slider"
                            />
                          ) : (
                            <Skeleton height={400} count={5} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : null}
        </Swiper>
      </div>
    </div>
  );
};

export default withTranslation()(IntroSlider);
