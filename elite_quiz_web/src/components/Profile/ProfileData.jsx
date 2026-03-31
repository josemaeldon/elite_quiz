"use client";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMobileAlt,
  FaPhoneAlt,
  FaPlus,
  FaRegUser,
} from "react-icons/fa";

import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getImageSource, imgError } from "@/utils";
import { HiOutlineMail } from "react-icons/hi";
import profileImages from "@/assets/json/profileImages";
import Breadcrumb from "@/components/Common/Breadcrumb";
import userImg from "../../assets/images/user.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { t } from "@/utils";
import LeftTabProfile from "./LeftTabProfile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  updateUserProfileDataApi,
  updateUserProfileImageApi,
} from "@/api/apiRoutes";
import { handleProfileImageResponse, handleProfileDataResponse } from "@/utils";

const ProfileData = () => {
  const dispatch = useDispatch();

  const demoValue = process.env.NEXT_PUBLIC_DEMO === "true";

  const userData = useSelector((state) => state?.User);

  const systemconfig = useSelector(sysConfigdata);

  const [showBookMark, setShowBookMark] = useState(false);

  const [api, setApi] = useState();

  const [profile, setProfile] = useState({
    name: userData?.data?.name ? userData?.data?.name : "",
    email: userData?.data?.email ? userData?.data?.email : "",
    mobile: userData?.data?.mobile ? userData?.data?.mobile : "",
  });


  const userMobile = userData?.data?.mobile || "";

  // dummy profile update
  const dummyProfileImage = (e) => {
    e.preventDefault();
    const fileName = e.target.getAttribute("data-file");
    const url = `${window.location.origin}/images/profileimages/${fileName}`;
    fetch(url).then(async (response) => {
      const contentType = response.headers.get("content-type");
      const blob = await response.blob();
      const file = new File([blob], fileName, { contentType });
      if (demoValue) {
        toast.error(t("no_update_in_demo"));
      } else {
        const updateProfileImageResponse = await updateUserProfileImageApi({
          image: file,
        });

        handleProfileImageResponse(updateProfileImageResponse, dispatch);
      }
    });
  };

  // onchange name and mobile
  const handleChange = (event) => {
    const field_name = event.target.name;
    const field_value = event.target.value;
    if (field_name === "mobile" && event.target.value?.length > 16) {
      event.target.value = field_value.slice(0, event.target.maxLength);
      return false;
    }
    setProfile((values) => ({ ...values, [field_name]: field_value }));
  };

  const validateForm = () => {
    if (!profile.name || !profile.mobile || !profile.email) {
      toast.error(t("fill_all_details"));
      return false;
    }
    return true;
  };

  // update profile data
  const updateProfileData = async () => {
    if (demoValue) {
      toast.error(t("no_update_in_demo"));
    } else {
      const updateProfileDataResponse = await updateUserProfileDataApi({
        email: profile.email,
        name: profile.name,
        mobile: profile.mobile,
      });

      handleProfileDataResponse(updateProfileDataResponse, dispatch, profile);
    }
  };

  // form submit
  const formSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateProfileData();
    }
  };

  // // update profile image
  const handleImageChange = async (e) => {
    e.preventDefault();
    if (demoValue) {
      toast.error(t("no_update_in_demo"));
    } else {
      const updateProfileImageResponse = await updateUserProfileImageApi({
        image: e.target.files[0],
      });

      handleProfileImageResponse(updateProfileImageResponse, dispatch);
    }
  };


  // check if the quiz mode are unable or not
  const checkBookmarData = () => {
    if (
      systemconfig.quiz_zone_mode !== "1" &&
      systemconfig.guess_the_word_question !== "1" &&
      systemconfig.audio_mode_question !== "1" &&
      systemconfig.maths_quiz_mode !== "1"
    ) {
      toast.error("No Bookmark Questions Found");
      setShowBookMark(false);
    } else {
      setShowBookMark(true);
    }
  };

  useEffect(() => {
    checkBookmarData();
  }, [showBookMark]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {});
  }, [api]);

  const onNext = () => {
    api.scrollNext();
  };

  const onPre = () => {
    api.scrollPrev();
  };

  return (
    <>
      <div className="container px-2 my-14 ">
        <div className="">
          {/* <div className="mb-24 max-1200:mb-20 max-767:mb-12">
            <Breadcrumb
              showBreadcrumb={true}
              title={t("profile")}
              content={t("home")}
              contentFive={t("profile")}
              />
            </div> */}
          <div className="flex flex-wrap relative between-1200-1399:flex-nowrap justify-evenly gap-9">
            <div className=" h-max w-full xl:w-1/4 lg:w-2/3 md:w-full ">
              <div className=" flex flex-col min-w-0 break-words  rounded-[16px] bg-[var(--background-2)] darkSecondaryColor border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] max-1200:p-[12px] relative">
                {/* Tab headers */}
                <LeftTabProfile />
              </div>
            </div>
            <div className="w-full md:w-full lg:w-[70%] xl:w-[70%]">
              <div className="morphisam !mt-0 darkSecondaryColor">
                <form onSubmit={formSubmit} className="block m-auto h-full">
                  {/* Content based on active tab */}

                  <div className="flex-center flex-col">
                    <div className="w-[120px] h-[120px] flex justify-center items-center rounded-full border-2 border-dashed border-[var(--text-color)] relative p-1.25 mt-[30px]">
                      {userData?.data && userData?.data?.profile ? (
                        <img
                          src={getImageSource(userData?.data?.profile)}
                          alt="profile"
                          id="user_profile"
                          className="w-[100px] h-[100px] rounded-full"
                          onError={imgError}
                        />
                      ) : (
                        <ThemeSvg
                          src={userImg.src}
                          width="100px"
                          height="100px"
                          className="rounded-full"
                          alt="User"
                          colorMap={{
                            "#e13975": "var(--primary-color)",
                            "#6d1d50": "var(--secondary-color)",
                            "#f7ccdd": "var(--primary-light)",
                            "url(#linear-gradient)": "var(--primary-color)",
                            "linear-gradient": "var(--primary-color)",
                          }}
                        />
                      )}
                      <div className="select__profile">
                        <input
                          type="file"
                          name="profile"
                          className="w-0 h-0 !border-none"
                          id="file"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="file"
                          className="cursor-pointer outline-none transition-all duration-300 align-middle m-0 absolute bottom-[20px] right-[-6px] bg-[#00bf7a] text-white h-[35px] w-[35px] rounded-full border border-white text-[0.75rem] flex justify-center items-center"
                        >
                          <em className="flex-center m-auto text-[16px]">
                            <FaPlus />
                          </em>
                        </label>
                        <input
                          type="text"
                          className="p-11 bg-black"
                          placeholder={t("upload_file")}
                          id="file1"
                          name="myfile"
                          disabled
                          hidden
                        />
                      </div>
                    </div>
                    <div className="flex-center pt-5">
                      <h3 className="text-text-color text-2xl md:text-[32px] ">
                        {userData?.data && userData?.data?.name}
                      </h3>
                    </div>
                    {userData?.data && userData?.data?.type === "gmail" || userData?.data?.type === "email" ? (
                      <div className="flex-center pt-1 mb-2">
                        <span className="flex-center text-text-color gap-2 mt-4">
                          <i className="flex-center">
                            <HiOutlineMail className="text-[16px]" />
                          </i>
                          <p className="mb-0 !text-[16px]">{userData?.data?.email}</p>
                        </span>
                      </div>
                    ) : (
                      <div className="mobile__number justify-content-center">
                        <span className="flex-center mt-4 gap-2">
                          <i>
                            <FaPhoneAlt />
                          </i>
                          <p>{userData?.data?.mobile}</p>
                        </span>
                      </div>
                    )}

                    <p className="w-full justify-center items-center flex opacity-60 before:right-[20px] before:ml-[-50%] after:left-[20px] after:mr-[-50%] relative text-text-color  text-[16px] font-normal text-center my-[22px] before:block before:bg-[#d3d3d3] before:h-[2px] before:w-[30%] before:opacity-20 before:align-middle before:relative after:block after:bg-[#d3d3d3] after:h-[2px] after:w-[30%] after:opacity-20 after:align-middle after:relative after:max-399:w-[20%] before:max-399:w-[20%] ">
                      {t("or_select_avtar")}
                    </p>
                    {/* dummy image slider */}
                    <div className="w-[80%] lg:w-1/2 relative flex-center flex-wrap">
                      <div className="absolute left-[-43px] " onClick={onPre}>
                        <span>
                          <FaChevronLeft size={25} className="text-text-color" />
                        </span>
                      </div>
                      <Carousel
                        setApi={setApi}
                        opts={{
                          align: "start",
                        }}
                        className="w-full"
                      >
                        <CarouselContent>
                          {profileImages &&
                            profileImages.map((elem, index) => (
                              <CarouselItem
                                key={index}
                                className="max-399:basis-1/4 basis-1/5"
                              >
                                <div className="p-1 image_section">
                                  <div className="!bg-transparent rounded-lg  flex items-center justify-center aspect-square">
                                    <img
                                      src={getImageSource(elem?.img)}
                                      alt="profile"
                                      className="cursor-pointer w-full h-full object-cover rounded-lg"
                                      onClick={(e) => dummyProfileImage(e)}
                                      data-file={elem?.img.split("/").pop()}
                                    />
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                        </CarouselContent>
                      </Carousel>
                      <div className="absolute right-[-37px]" onClick={onNext}>
                        <span>
                          <FaChevronRight
                            size={25}
                            className="text-text-color"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col w-full">
                      <div className="flex flex-wrap sm:flex-nowrap gap-3">
                        <div className="w-full md:w-1/2 max-767:pr-0">
                          <label htmlFor="fullName" className="inputIsideLabel">
                            <input
                              type="text"
                              name="name"
                              id="fullName"
                              placeholder={t("enter_name")}
                              defaultValue={
                                userData?.data && userData?.data?.name
                              }
                              className="darkSecondaryColor"
                              onChange={handleChange}
                              required
                            />
                            <i className="custom-icon">
                              <FaRegUser />
                            </i>
                          </label>
                        </div>
                        <div className="w-full md:w-1/2 max-767:pl-0">
                          {userData?.data &&
                          userData?.data?.type === "gmail" || userData?.data?.type === "email" ? (
                            <label
                              htmlFor="mobilenumber"
                              className="inputIsideLabel"
                            >
                              <input
                                type="number"
                                name="mobile"
                                id="mobilenumber"
                                placeholder={t("enter_num")}
                                defaultValue={userMobile}
                                onChange={handleChange}
                                min="0"
                                onWheel={(event) => event.currentTarget.blur()}
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none darkSecondaryColor"
                              />

                              <i>
                                <FaMobileAlt />
                              </i>
                            </label>
                          ) : (
                            <label htmlFor="email" className="inputIsideLabel">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder={t("enter_email")}
                                defaultValue={
                                  userData?.data && userData?.data?.email
                                }
                                onChange={handleChange}
                                min="0"
                                className="darkSecondaryColor"
                                onWheel={(event) => event.currentTarget.blur()}
                              />

                              <i>
                                <HiOutlineMail />
                              </i>
                            </label>
                          )}
                        </div>
                      </div>
                      <button
                        className="p-[20px_48px] bg-primary-color w-full rounded-[16px] text-white text-capitalize mt-4 shadowBtn"
                        type="submit"
                        value="submit"
                        name="submit"
                        id="mc-embedded-subscribe"
                      >
                        {t("update")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withTranslation()(ProfileData);
