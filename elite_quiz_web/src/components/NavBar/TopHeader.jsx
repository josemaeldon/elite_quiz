"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaRegBell } from "react-icons/fa";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { IoExitOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  appLanList,
  appLanListData,
  currentAppLan,
  currentAppLanguage,
  isRtl,
  languageJson,
  languageJsonFile,
  languagesReceived,
  rtlSupport,
  selectCurrentLanguage,
  selectLanguages,
  setCurrentLanguage,
} from "@/store/reducers/languageSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { getImageSource, isLogin } from "@/utils";
import { logout, selectUser } from "@/store/reducers/userSlice";
import img6 from "../../../public/images/profileimages/6.svg";
import warningImg from "../../assets/images/logout.svg";
import {
  notifiationTotal,
  notificationClear,
  notificationData,
  notificationSuccess,
  updateTotal,
} from "@/store/reducers/notificationSlice";
import { t } from "@/utils";
import { updateI18nTranslations } from "@/utils/language";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip } from "react-tooltip";
import { capitalize } from "@/lib/utils";
import NotificationModal from "../Notifications/NotificationModal";
import {
  getLanguagesApi,
  getNotificationApi,
  getSystemLanguageJsonApi,
  getSystemLanguageListApi,
  updateUserProfileDataApi,
} from "@/api/apiRoutes";
import { errorCodeDataNotFound } from "@/api/apiEndPoints";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeSvg from "../ThemeSvg";

const MySwal = withReactContent(Swal);

const TopHeader = () => {
  const dispatch = useDispatch();


  const router = useRouter();

  const languages = useSelector(selectLanguages);

  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  // store data get

  const userData = useSelector((state) => state.User);

  const notification = useSelector(notificationData);

  const notificationtotal = useSelector(notifiationTotal);

  const systemconfig = useSelector(sysConfigdata);

  const languageJsondata = useSelector(languageJsonFile);

  const appLanguageList = useSelector(appLanList);

  const currAppLan = useSelector(currentAppLanguage);

  const isrtl = useSelector(rtlSupport);

  const profile = useSelector(selectUser);

  const nameWidthRef = useRef(null);
  const webLanWidthRef = useRef(null);
  const quizLanWidthRef = useRef(null);

  const DarkMode = document.documentElement.classList.contains("dark");
  //notification
  const [notificationmodal, setNotificationModal] = useState(false);

  const [logoutModal, setLogoutModal] = useState(false);

  const [guestlogout, setGuestLogout] = useState(false);

  const [userHasLoggedIn, setUserHasLoggedIn] = useState(false);

  // App language change
  const appLanguageChange = async (name) => {
    setUserHasLoggedIn(false);
    dispatch(currentAppLan(name));
    const response = await getSystemLanguageJsonApi({
      language: name,
    });

    if (!response?.error) {
      dispatch(languageJson(response));
      dispatch(isRtl(response.rtl_support));
      updateI18nTranslations(response.data);
    }

    if (profile.data) {
      const updateProfileDataResponse = await updateUserProfileDataApi({
        email: profile.data.email,
        name: profile.data.name,
        mobile: profile.data.mobile,
      });
    }
  };
  // language change
  const languageChange = async (name, code, id) => {
    setCurrentLanguage(name, code, id);
    // await i18n.changeLanguage(code)
  };

  // if APP language change and if it rtl supported then rtl else ltr
  useEffect(() => {
    if (isrtl && isrtl === "1") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [isrtl]);

  //api render
  useEffect(() => {
    if (router.pathname === "/" || router.pathname === "/quiz-play") {
      const getLanguages = async () => {
        const response = await getLanguagesApi({
          id: "",
        });

        if (!response?.error) {
          dispatch(languagesReceived(response));
          if (selectcurrentLanguage.code == null) {
            let index = response?.data?.filter((data) => {
              if (response?.data?.length == 1) {
                return { code: data.code, name: data.name, id: data.id };
              } else if (data.default_active == "1") {
                return { code: data.code, name: data.name, id: data.id };
              }
            });

            setCurrentLanguage(index[0].language, index[0].code, index[0].id);
          }
        }

        if (response.message == errorCodeDataNotFound) {
          setCurrentLanguage("English (US)", "en", "14");
        }
      };

      getLanguages();
    }
  }, [router, selectcurrentLanguage]);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (isLogin()) {
      if (router.pathname === "/" || router.pathname === "/quiz-play") {
        const getNotificationData = async () => {
          const response = await getNotificationApi({
            order: "DESC",
            offset: offset,
            limit: limit,
          });

          if (!response?.error) {
            let notResponse = response.total;
            dispatch(notificationSuccess(response));
            dispatch(updateTotal(Number(notResponse)));
          } else {
            if (response.message === errorCodeDataNotFound) {
              dispatch(notificationClear());
              dispatch(updateTotal(0));
            }
          }
        };
        getNotificationData();
      }
    }
  }, [offset]);

  // sign out
  const handleSignout = () => {
    setLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    router.push("/");
    setLogoutModal(false);
  };

  // check user data for username
  let userName = "";

  const checkUserData = (userData) => {
    if (userData?.data && userData?.data?.name != "") {
      return (userName = userData?.data?.name);
    } else if (userData?.data && userData?.data?.email != "") {
      return (userName = userData?.data?.email);
    } else {
      return (userName = userData?.data?.mobile);
    }
  };

  // guest logout
  const guestLogout = (e) => {
    e.preventDefault();
    setGuestLogout(true);
    router.push("/auth/login");
  };

  // profile image logout
  const profileGuest = (e) => {
    e.preventDefault();
    MySwal.fire({
      text: t("login_first"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("cancel"),
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("login"),
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        guestLogout(e);
      }
    });
  };

  // notification tooltip leave on mouse
  const handleMouseLeave = () => {
    const tooltipElement = document.querySelector(
      '[data-tooltip-id="custom-my-tooltip"]'
    );
    if (tooltipElement) {
      tooltipElement.removeAttribute("data-tooltip-content");
    }
  };

  // notification tooltip enter on mouse
  const handleMouserEnter = () => {
    const tooltipElement = document.querySelector(
      '[data-tooltip-id="custom-my-tooltip"]'
    );
    if (tooltipElement) {
      tooltipElement.setAttribute(
        "data-tooltip-content",
        `${t("notifications")}`
      );
    }
  };

  useEffect(() => {
    if (
      profile?.data?.web_language !== undefined &&
      !localStorage.getItem("firstLoadWithLan")
    ) {
      localStorage.setItem("firstLoadWithLan", "true");
      setUserHasLoggedIn(true);
    }
  }, [profile?.data?.web_language, userHasLoggedIn]);

  useEffect(() => {
    const firstLoad = sessionStorage.getItem("firstLoad_App_Language");
    const manualRefresh = sessionStorage.getItem("manualRefresh_App_Language");
    const shouldFetchData = !firstLoad || manualRefresh === "true";

    if (shouldFetchData || languageJsondata == null || userHasLoggedIn) {
      let defaultLang = null;

      const languageListData = async () => {
        const langaugeListResponse = await getSystemLanguageListApi({});

        if (!langaugeListResponse.error) {
          langaugeListResponse.data.filter((lan) => {
            if (lan.web_default == 1) {
              defaultLang = lan.name;
            }
          });
          sessionStorage.setItem("firstLoad_App_Language", "true");
          dispatch(appLanListData(langaugeListResponse));

          if (profile?.data?.web_language && userHasLoggedIn) {
            dispatch(currentAppLan(profile?.data?.web_language));
          } else if (currAppLan) {
            dispatch(currentAppLan(currAppLan));
          } else {
            dispatch(currentAppLan(defaultLang));
          }
          let lanForJson =
            profile?.data?.web_language && userHasLoggedIn
              ? profile?.data?.web_language
              : currAppLan || defaultLang;

          const response = await getSystemLanguageJsonApi({
            language: lanForJson,
          });

          if (!response?.error) {
            sessionStorage.setItem("lastFetch_App_language", "true");
            dispatch(isRtl(response.rtl_support));
            dispatch(languageJson(response));
            updateI18nTranslations(response.data);
          }

          if (profile.data) {
            const updateProfileDataResponse = await updateUserProfileDataApi({
              email: profile.data.email,
              name: profile.data.name,
              mobile: profile.data.mobile,
            });
          }
        }
      };
      languageListData();
    }
    sessionStorage.removeItem("manualRefresh_App_Language");
    sessionStorage.setItem("firstLoad_App_Language", "true");
  }, [userHasLoggedIn]);

  // Event listener to set manualRefresh flag when page is manually refreshed
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("manualRefresh_App_Language", "true");
    });

    window.addEventListener("load", () => {
      // Check if this is a manual refresh by checking if lastFetch is set
      if (!sessionStorage.getItem("lastFetch_App_language")) {
        sessionStorage.setItem("manualRefresh_App_Language", "true");
      }
    });
  }

  const handleMoreNotifications = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + limit);
    setLimit((prevLimit) => prevLimit + 10);
  };

  const width = (width) => {
    const newWidth = width + 2 + "px";
    return newWidth;
  };
  return (
    <React.Fragment>
      <div className=" bg-secondary-color text-white z-40 relative hidden xl:block dark:bg-transparent">
        <div className="container ">
          <div className=" justify-between items-center grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              {(router.pathname === "/" || router.pathname === "/quiz-play" || router.pathname === "/auth/sign-up" || router.pathname === "/auth/login") &&
              !(
                appLanguageList &&
                appLanguageList.length === 1 &&
                languages &&
                languages.length === 1
              ) ? (
                <div className="flex">
                  {appLanguageList && appLanguageList.length !== 1 && (
                    <div className="flex-center [&>p]:mb-0 mr-2 ">
                      <p>{t("web")} :</p>
                      <NavigationMenu className="[&>:nth-child(2)]:left-2">
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger
                              ref={webLanWidthRef}
                              className="!bg-primary-color flex items-center mx-2 !text-white shadowBtn"
                            >
                              {currAppLan
                                ? capitalize(currAppLan)
                                : t("language")}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent
                              className="bg-white rounded-[5px] min-w-[100px]"
                              style={{
                                width: width(
                                  webLanWidthRef.current?.offsetWidth
                                ),
                              }}
                            >
                              <ul className="w-full">
                                {appLanguageList &&
                                  appLanguageList.map((data) => (
                                    <li
                                      key={data.name}
                                      className="cursor-pointer w-full px-5 py-2 hover:bg-[var(--background-2)] capitalize dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)]"
                                      onClick={() =>
                                        appLanguageChange(data.name, data.title)
                                      }
                                    >
                                      {data.title}
                                    </li>
                                  ))}
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                    </div>
                  )}
                  {systemconfig &&
                    systemconfig.language_mode === "1" &&
                    languages &&
                    languages.length > 1 && (
                      <div className="flex-center [&>p]:mb-0">
                        <p>{t("quiz_language")} :</p>
                        <NavigationMenu className="[&>:nth-child(2)]:left-2">
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger
                                ref={quizLanWidthRef}
                                className="!bg-primary-color flex items-center mx-2 !text-white shadowBtn"
                              >
                                {selectcurrentLanguage &&
                                selectcurrentLanguage.name
                                  ? selectcurrentLanguage.name
                                  : t("language")}
                              </NavigationMenuTrigger>
                              <NavigationMenuContent
                                className="bg-white rounded-[5px] min-w-[100px]"
                                style={{
                                  width: width(
                                    quizLanWidthRef.current?.offsetWidth
                                  ),
                                }}
                              >
                                <ul className="w-full">
                                  {languages &&
                                    languages.map((data) => (
                                      <li
                                        key={data.id}
                                        className="cursor-pointer w-full px-3 py-2 hover:bg-[var(--background-2)] capitalize dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)]"
                                        onClick={() =>
                                          languageChange(
                                            data.language,
                                            data.code,
                                            data.id
                                          )
                                        }
                                      >
                                        {data.language}
                                      </li>
                                    ))}
                                </ul>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      </div>
                    )}
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="">
              <div className="flex gap-3 justify-center items-center md:justify-end">
                <div className="rtl:mr-0 rtl:ml-2 flex float-right py-2.5 px-0 font-extrabold tracking-widest cursor-pointer">
                  {isLogin() && checkUserData(userData) ? (
                    <>
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger
                              ref={nameWidthRef}
                              className="!bg-primary-color text-base text-white py-2.5 px-3 rounded-[8px] font-normal hover:text-white active:text-white focus:text-white cursor-pointer shadowBtn"
                            >
                              {`${t("hello")} ${userName}`}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="dark:bg-[#090029] rounded-[5px]">
                              <div
                                className="flex flex-col gap-1 w-28 "
                                style={{
                                  width: width(
                                    nameWidthRef.current?.offsetWidth
                                  ),
                                }}
                              >
                                <button
                                  onClick={() => router.push("/profile")}
                                  className="w-full text-left px-2 py-2 text-sm font-normal rounded-t-md dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)] cursor-pointer hover:bg-[var(--background-2)]"
                                >
                                  {t("profile")}
                                </button>

                                <button
                                  onClick={handleSignout}
                                  className="w-full text-left px-2 py-2 text-sm font-normal rounded-b-md dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)] cursor-pointer hover:bg-[var(--background-2)]"
                                >
                                  {t("logout")}
                                </button>
                              </div>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                    </>
                  ) : (
                    <div>
                      {!guestlogout ? (
                        <div className="flex items-center rtl:gap-2.5">
                          <img
                            className="w-9 h-9 object-cover mr-2.5 rounded-full text-white bg-[var(--primary-color)] transition-all duration-500 ease-in border-transparent p-0.5"
                            onClick={(e) => profileGuest(e)}
                            src={getImageSource(img6.src)}
                            alt="profile"
                          />
                          <button
                            id="dropdown-basic-button"
                            className="btn btn-primary py-[10px] px-4 font-medium tracking-normal rounded-[8px] h-[41px] dark:text-white shadowBtn"
                          >{`${t("hello_guest")}`}</button>
                          <button
                            className="btn bg-[var(--primary-color)] text-white transition-all duration-500 ease-in rounded-[8px] border-transparent flex items-center justify-center p-[11px] ms-2 rtl:rotate-180 h-[41px] shadowBtn"
                            onClick={(e) => guestLogout(e)}
                          >
                            <IoExitOutline className="text-[22px] ml-[3px]" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="relative">
                            <Link
                              href="/auth/login"
                              className="hover:text-white mr-3 after:w-[2px] after:h-full  after:bg-white after:absolute after:right-[5px]"
                            >
                              {t("login")}
                            </Link>
                          </span>
                          <span>
                            <Link
                              href="/auth/sign-up"
                              className="font-semibold hover:text-white"
                            >
                              {t("sign_up")}
                            </Link>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {isLogin() ? (
                    <Button
                      className="hover:bg-primary-color flex items-center text-white h-[41px] relative bg-primary-color transition ease-in duration-500 rounded-[8px] border-transparent shadowBtn"
                      onClick={() => setNotificationModal(true)}
                      onMouseEnter={handleMouserEnter}
                      onMouseLeave={handleMouseLeave}
                      data-tooltip-id="custom-my-tooltip"
                    >
                      <span className="absolute top-[2px] right-[6px] bg-[#212121] rounded-full w-[17px] text-[10px] text-white flex items-center justify-center">
                        {notificationtotal ? notificationtotal : "0"}
                      </span>
                      <FaRegBell />
                    </Button>
                  ) : (
                    ""
                  )}

                  <NotificationModal
                    notificationmodal={notificationmodal}
                    setNotificationModal={setNotificationModal}
                  />
                </div>
                <div className="darkmode ">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="custom-my-tooltip" />

      <Dialog open={logoutModal} onOpenChange={setLogoutModal}>
        <DialogContent className="bg-[#F1F0F2] !rounded-[32px] p-[20px_24px] [&>button]:hidden">
          <DialogHeader>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center gap-1 text-text-color font-sans">
                <span>
                  <ThemeSvg
                    className="w-[200px] sm:w-[190px]"
                    src={warningImg.src}
                    colorMap={
                      DarkMode
                        ? {
                            "#090029": "var(--primary-color)",
                            "#3B82F6": "var(--primary-color)",
                            "#212121": "var(--primary-color)",
                            "#C564BB": "var(--primary-color)",
                            "#45536D": "var(--primary-color)",
                            "#ffcaf9": "var(--primary-light)",
                            "#CECCD4": "var(--primary-light)",
                            0.2: "1",
                            white: "#221a3f",
                          }
                        : {
                            "#090029": "black",
                          }
                    }
                  />
                </span>
                <span className="text-[24px] font-semibold sm:text-[42px] sm:p-4 font-sans">
                  {t("logout")}
                </span>
                <span className="text-[16px] font-normal sm:text-[20px] sm:p-4">
                  {t("sure_logout")}
                </span>
              </div>

              <div className="flex justify-center items-center gap-5 mt-3">
                <span
                  className="bg-primary-color p-[12px_48px] max-767:p-[12px_18px] rounded-[8px] text-white text-base font-semibold cursor-pointer shadowBtn"
                  onClick={handleConfirmLogout}
                >
                  {t("yes_logout")}
                </span>
                <span
                  className="bg-white p-[10px_48px] max-767:p-[10px_18px] dark:border-[#FFFFFF0A] rounded-[8px] text-text-color text-base font-semibold cursor-pointer border-2 border-[#949191] darkSecondaryColor"
                  onClick={() => setLogoutModal(false)}
                >
                  {t("keep_login")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
export default withTranslation()(TopHeader);
