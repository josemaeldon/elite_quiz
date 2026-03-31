"use client";
import { useEffect, useState } from "react";
import { getImageSource, imgError } from "@/utils";
import { Switch } from "@/components/ui/switch";
import {
  FaPlus ,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
} from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import { LuFileImage } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import profileImages from "@/assets/json/profileImages";
import { loginSuccess } from "@/store/reducers/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { t } from "@/utils";
import userImg from "../../assets/images/user.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  registerApi,
  updateUserProfileImageApi,
  updateUserProfileDataApi,
  updateFcmIdApi,
} from "@/api/apiRoutes";
import { errorCodeAccountHasBeenDeactivated } from "@/api/apiEndPoints";
import { handleProfileImageResponse, handleProfileDataResponse } from "@/utils";
import { fcmToken } from "@/store/reducers/settingsSlice";
import { currentAppLanguage } from "@/store/reducers/languageSlice";
const NewUser = ({ profile, setProfile }) => {
  const dispatch = useDispatch();

  const [showReferCode, setShowReferCode] = useState(false);

  const [api, setApi] = useState();

  const userData = useSelector((state) => state.User);

  const loginType = userData?.data?.type;

  const web_fcm_id = useSelector(fcmToken);

  const currAppLan = useSelector(currentAppLanguage);

  const router = useRouter();

  // dummy profile update
  const dummyProfileImage = (e) => {
    e.preventDefault();
    const fileName = e.target.getAttribute("data-file");
    const url = `${window.location.origin}/images/profileimages/${fileName}`;

    fetch(url).then(async (response) => {
      const contentType = response.headers.get("content-type");
      const blob = await response.blob();
      const file = new File([blob], fileName, { contentType });

      const updateProfileImageResponse = await updateUserProfileImageApi({
        image: file,
      });

      handleProfileImageResponse(updateProfileImageResponse, dispatch);
    });
  };

  // new user form submit
  const formSubmit = async (e) => {
    e.preventDefault();
    let firebase_id = profile.uid;
    let email = profile.email ? profile.email : null;
    let phone = profile.phoneNumber ? profile.phoneNumber : null;
    let image_url = profile.photoURL ? profile.photoURL : null;
    let name = profile.name;
    let friends_code = profile.friends_code;

    const registerResponse = await registerApi({
      firebase_id: firebase_id,
      type: loginType,
      username: name,
      email: email,
      image_url: image_url,
      mobile: phone,
      friends_code: friends_code,
      web_fcm_id: web_fcm_id,
      web_language: currAppLan,
    });

    web_fcm_id && updateFcmIdApi({ web_fcm_id: web_fcm_id });

    if (registerResponse.message === errorCodeAccountHasBeenDeactivated) {
      toast.error(t("ac_deactive"));
    } else {
      dispatch(loginSuccess(registerResponse));
      router.push("/quiz-play");
    }

    if (profile.image) {
      const updateProfileImageResponse = await updateUserProfileImageApi({
        image: profile.image,
      });

      handleProfileImageResponse(updateProfileImageResponse, dispatch);
    }

    if (loginType == "mobile") {
      const updateProfileDataResponse = await updateUserProfileDataApi({
        email: profile.email,
        name: profile.name,
        mobile: profile.mobile,
      });

      handleProfileDataResponse(updateProfileDataResponse, dispatch, profile);
    }
  };

  // handle image change
  const handleImageChange = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    const updateProfileImageResponse = await updateUserProfileImageApi({
      image: file,
    });

    handleProfileImageResponse(updateProfileImageResponse, dispatch);
  };

  // set input field data
  const handleChange = (event) => {
    const field_name = event.target.name;
    const field_value = event.target.value;
    setProfile((values) => ({ ...values, [field_name]: field_value }));
  };

  // refer code
  const changeReferCodeCheckbox = () => {
    let state = !showReferCode;
    setShowReferCode(state);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      console.log(api);
    });
  }, [api]);

  const onNext = () => {
    api.scrollNext();
  };

  const onPre = () => {
    api.scrollPrev();
  };
  return (
    <>
      <div className="container mt-20  mb-14">
        <div className="max-w-[600px] w-full m-auto mt-5 mb-40">
          <div className="morphisam darkSecondaryColor dark:rounded-[32px]">
            <form onSubmit={formSubmit}>
              <div className="">
                
                <div className="">
                  <div className="flex-center p-5 flex-col">
                    <h2 className="headline">{t("user_settings")}</h2>
                    <p className="text-center">{t("upload_your_photo")}</p>
                    <div className="h-[80px] w-[80px] flex-center rounded-full border-2 border-dashed border-[#8f8c9e] relative p-[5px] mt-[30px] darkSecondaryColor">
                      {userData?.data && userData?.data?.profile ? (
                        <img
                          className="max-w-full max-h-full rounded-full mx-auto w-[100px] h-[100px] overflow-hidden"
                          src={getImageSource(userData?.data?.profile)}
                          alt="profile"
                          id="user_profile"
                          onError={imgError}
                        />
                      ) : (
                        <div className="">
                          <LuFileImage className="w-10 h-10 text-[#8f8c9e]"/>
                        </div>
                      )}
                      <div className="block">
                        <input
                          type="file"
                          name="profile"
                          id="file"
                          onChange={handleImageChange}
                          className="h-0 w-0 !border-none"
                        />
                        <label
                          className="cursor-pointer outline-none transition-all duration-300 align-middle m-0 absolute bottom-[55px] right-[0] bg-[#00bf7a] text-white h-[24px] w-[24px] rounded-full border border-white text-[0.75rem] flex justify-center items-center"
                          htmlFor="file"
                        >
                          {" "}
                          <em>
                          <FaPlus />
                          </em>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Upload File"
                          id="file1"
                          name="myfile"
                          disabled
                          hidden
                        />
                      </div>
                    </div>

                    <div className=" mt-3 flex justify-center items-center w-full">
                      <span className="h-px w-[24%] opacity-15 bg-black dark:bg-white max-575:hidden"></span>
                      <p className="mx-5 dark:text-[#adaab8]">
                        {t("or_select_avtar")}
                      </p>
                      <span className="h-px w-[24%] opacity-15 bg-black dark:bg-white max-575:hidden "></span>
                    </div>

                    {/* dummy image slider */}
                    <div className="w-[85%]  relative flex-center flex-wrap my-5">
                      <div className="absolute left-[-43px] " onClick={onPre}>
                        <span>
                          <FaChevronLeft
                            size={25}
                            className="text-text-color"
                          />
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
                                className="max-399:basis-1/3 sm:basis-1/6 basis-1/5"
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

                    <div className="py-4 flex flex-col w-full">
                      <div className="relative mb-8">
                        <label htmlFor="">
                          <Input
                            type="text"
                            name="name"
                            id="fullName"
                            placeholder={t("enter_name")}
                            defaultValue={profile.displayName}
                            onChange={handleChange}
                            required
                            className=" darkSecondaryColor w-full rounded-[8px] bg-white h-16 pl-14 text-text-color border border-gray-300"
                          />
                          <span className="absolute top-0 left-0 bottom-0 flex items-center justify-center text-[#767272] font-semibold p-[5px_15px] h-16 text-[20px] rounded-tl-[5px] rounded-bl-[5px] overflow-hidden">
                          <LuUserRound />
                          </span>
                        </label>
                      </div>

                      {loginType == "mobile" && (
                        <div className="relative">
                          <label htmlFor="">
                            <Input
                              type="email"
                              name="email"
                              id="email"
                              placeholder={t("enter_email")}
                              defaultValue={profile.email}
                              onChange={handleChange}
                              className="w-full rounded-[8px] bg-white h-16 pl-14 text-[#212529] border border-gray-300"
                            />
                            <span className="absolute top-0 left-0 bottom-0 flex items-center justify-center text-[#767272] font-semibold p-[5px_15px] h-16 text-[20px] rounded-tl-[5px] rounded-bl-[5px] overflow-hidden">
                              <FaEnvelope />
                            </span>
                          </label>
                        </div>
                      )}

                      <div className="mb-3 flex justify-between">
                        <p>{t("do_you_have_refer_code")}</p>
                        <Switch
                          className={`${showReferCode ? "!bg-[var(--primary-color)]" : "!bg-gray-500 "} dark:!rounded-[24px]`}
                          // checked={showReferCode}
                          onCheckedChange={changeReferCodeCheckbox}
                        />
                      </div>

                      {showReferCode ? (
                        <label htmlFor="w-full !relative flex justify-center items-center overflow-hidden text-text-color">
                          <div className="relative mt-5 mb-5">
                            <Input
                              type="text"
                              name="friends_code"
                              id="friends_code"
                              placeholder={t("refer_code")}
                              defaultValue={profile.friends_code}
                              onChange={handleChange}
                              required
                              className=" darkSecondaryColor w-full rounded-[8px] bg-white h-16 pl-14 text-[#212529] border border-gray-300"
                            />
                            <span className="absolute top-0 left-0 bottom-0 flex items-center justify-start text-[#767272] font-semibold p-[0px_15px] h-[63px] text-[20px] rounded-tl-[5px] rounded-bl-[5px] overflow-hidden ">
                              <AiOutlineUsergroupAdd />
                            </span>
                          </div>
                        </label>
                      ) : (
                        ""
                      )}
                      <Button
                        className="capitalize"
                        type="submit"
                        value="submit"
                        name="submit"
                        id="mc-embedded-subscribe"
                        variant="login"
                        size="login"
                      >
                        {t("submit")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUser;
