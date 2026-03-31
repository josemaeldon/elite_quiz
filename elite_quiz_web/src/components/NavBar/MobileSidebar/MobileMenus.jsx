"use client";
import React, { useRef, useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import { IoExitOutline } from "react-icons/io5";
import Link from "next/link";
import {
  appLanList,
  currentAppLan,
  currentAppLanguage,
  isRtl,
  languageJson,
  selectCurrentLanguage,
  selectLanguages,
  setCurrentLanguage,
} from "@/store/reducers/languageSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import FirebaseData from "@/utils/Firebase";
import menu_data from "./menu-data";
import { useRouter } from "next/router";
import {
  getClosest,
  getImageSource,
  getSiblings,
  isLogin,
  slideToggle,
  slideUp,
} from "@/utils";
import img6 from "../../../../public/images/profileimages/6.svg";
import { FaRegBell } from "react-icons/fa";
import { logout } from "@/store/reducers/userSlice";
import {
  notifiationTotal,
  notificationData,
} from "@/store/reducers/notificationSlice";
import { signOut } from "firebase/auth";
import { t } from "@/utils";
import { updateI18nTranslations } from "@/utils/language";
import NotificationModal from "@/components/Notifications/NotificationModal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getSystemLanguageJsonApi } from "@/api/apiRoutes";
import ThemeToggle from "@/components/ThemeToggle";

const MySwal = withReactContent(Swal);

const MobileMenus = ({ setIsActive, mobileNav }) => {
  const navigate = useRouter();
  const [navTitle, setNavTitle] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationmodal, setNotificationModal] = useState(false);
  const [webLanWidth, setWebLanWidth] = useState(0);
  const [quizLanWidth, setQuizLanWidth] = useState(0);
  const quizLanWidthRef = useRef(null); 
  const webLanWidthRef = useRef(null);
  //openMobileMenu
  const openMobileMenu = (menu) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };

  const dispatch = useDispatch();

  const { auth } = FirebaseData();
  const router = useRouter();
  const userData = useSelector((state) => state.User);
  const languages = useSelector(selectLanguages);

  const systemconfig = useSelector(sysConfigdata);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const [guestlogout, setGuestLogout] = useState(false);
  const notification = useSelector(notificationData);
  const appLanguageList = useSelector(appLanList);
  const currAppLan = useSelector(currentAppLanguage);
  const notificationtotal = useSelector(notifiationTotal);

  const handleSignout = () => {
    MySwal.fire({
      title: t("logout"),
      text: t("are_you_sure"),
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("Logout"),
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        signOut(auth);
        navigate.push("/");
      }
    });
  };
  // const onClickHandler = (e) => {
  //   // clickOutside(noClose)
  //   const target = e.currentTarget;
  //   const parentEl = target.parentElement;
  //   if (
  //     parentEl?.classList.contains("menu-toggle") ||
  //     target.classList.contains("menu-toggle")
  //   ) {
  //     const element = target.classList.contains("icon") ? parentEl : target;
  //     const parent = getClosest(element, "li");
  //     const childNodes = parent.childNodes;
  //     const parentSiblings = getSiblings(parent);
  //     parentSiblings.forEach((sibling) => {
  //       const sibChildNodes = sibling.childNodes;
  //       sibChildNodes.forEach((child) => {
  //         if (child.nodeName === "UL") {
  //           slideUp(child, 1000);
  //         }
  //       });
  //     });
  //     childNodes.forEach((child) => {
  //       if (child.nodeName === "UL") {
  //         slideToggle(child, 1000);
  //       }
  //     });
  //   }
  // };
  const onClickHandler = (e) => {
    // clickOutside(noClose)
    const target = e.currentTarget;
    const parentEl = target.parentElement;

    if (
      parentEl?.classList.contains("menu-toggle") ||
      target.classList.contains("menu-toggle")
    ) {
      const element = target.classList.contains("icon") ? parentEl : target;
      const parent = getClosest(element, "li");

      // Get only direct siblings of the current menu item
      const siblings = getSiblings(parent);

      // Only slide up ULs that are direct children of siblings
      siblings.forEach((sibling) => {
        const directChildULs = sibling.children;
        for (let i = 0; i < directChildULs.length; i++) {
          if (directChildULs[i].nodeName === "UL") {
            slideUp(directChildULs[i], 1000);
          }
        }
      });

      // Toggle the clicked menu item's ULs as before
      const childNodes = parent.childNodes;
      childNodes.forEach((child) => {
        if (child.nodeName === "UL") {
          slideToggle(child, 1000);
        }
      });
    }
  };
  // const languageChange = async (name, code, id) => {
  // console.log(name, code, id);
  // setCurrentLanguage(name, code, id);
  // };

  const languageChange = async (value) => {
    const selectedLanguage = languages.find((lang) => lang.id === value);
    if (selectedLanguage) {
      setCurrentLanguage(
        selectedLanguage.language,
        selectedLanguage.code,
        selectedLanguage.id
      );
    }
    setIsActive(false);
  };

  // initial username
  let userName = "";

  const checkUserData = (userData) => {
    if (userData?.data && userData?.data?.name !== "") {
      return (userName = userData?.data?.name);
    } else if (userData?.data && userData?.data?.email !== "") {
      return (userName = userData?.data?.email);
    } else {
      return (userName = userData?.data?.mobile);
    }
  };

  // guest logout
  const guestLogout = (e) => {
    e.preventDefault();
    setGuestLogout(true);
    navigate.push("/auth/login");
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

  // const menu = (
  //   <Menu>
  //     {languages &&
  //       languages.map(data => (
  //         <Menu.Item
  //           key={data.id}
  //           onClick={() => {
  //             languageChange(data.language, data.code, data.id)
  //             setIsActive(false)
  //           }}
  //         >
  //           {data.language}
  //         </Menu.Item>
  //       ))}
  //   </Menu>
  // )
  // App language change
  const appLanguageChange = async (name, title) => {
    dispatch(currentAppLan(title));
    const response = await getSystemLanguageJsonApi({
      language: name,
    });

    if (!response?.error) {
      dispatch(languageJson(response));
      dispatch(isRtl(response.rtl_support));
      updateI18nTranslations(response.data);
    }
    setIsActive(false);
  };
  // const appMenu = (
  //   <Menu>
  //     {appLanguageList &&
  //       appLanguageList.map(data => (
  //         <Menu.Item key={data.name} onClick={() => appLanguageChange(data.name, data.title)}>
  //           {data.title}
  //         </Menu.Item>
  //       ))}
  //   </Menu>
  // )
  const onNotificationClick = () => {
    setNotificationModal(true);
    if (!mobileNav) {
      setIsActive(false);
    }
  };



  // Update widths when refs are available
  useEffect(() => {
    const updateWidths = () => {
      if (webLanWidthRef.current) {
        setWebLanWidth(webLanWidthRef.current.offsetWidth);
      }
      if (quizLanWidthRef.current) {
        setQuizLanWidth(quizLanWidthRef.current.offsetWidth);
      }
    };

    // Small delay to ensure elements are rendered
    const timeoutId = setTimeout(updateWidths, 100);
    
    return () => clearTimeout(timeoutId);
  }, [mobileNav]); // Re-run when mobile menu opens/closes

  const getWidth = (width) => {
    if (width > 0) {
      return (width + 2) + "px";
    }
    return "auto";
  };

  return (
    <>
      <nav className="">
        <ul className="m-0 p-0 block w-full text-left max-h-[80vh] overflow-y-auto">
          <li className="float-left w-full relative hover:[&>a]:text-primary-color">
            <div className="flex items-start justify-between flex-col gap-2">
              {appLanguageList && appLanguageList?.length !== 1 ? (
                <div className="flex items-center justify-between w-full">
                  <p className="font-semibold text-white mb-0">{t("web")} :</p>
                  <div className="flex-center text-center [&>p]:mb-0 mr-2">
                    {/* <Select
                      value={currAppLan}
                      onValueChange={(value) => {
                        const selectedLanguage = appLanguageList.find(
                          (lang) => lang.name === value
                        );
                        appLanguageChange(
                          selectedLanguage.name,
                          selectedLanguage.title
                        );
                      }}
                    >
                      <SelectTrigger className="w-[135px] mx-2 bg-primary-color !rounded-[5px] text-white  border-none capitalize">
                        {currAppLan ? currAppLan : t("language")}
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-[5px]">
                        {appLanguageList &&
                          appLanguageList.map((data) => (
                            <SelectItem key={data.name} value={data.name} className="capitalize">
                              {data.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select> */}
                    <NavigationMenu className="[&>:nth-child(2)]:left-2 z-50">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger ref={webLanWidthRef}  className="w-max mx-2 !bg-primary-color !rounded-[5px] !text-white capitalize shadowBtn">
                            {currAppLan ? currAppLan : t("language")}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="bg-white rounded-[5px] " style={{width: getWidth(webLanWidth)}}>
                            {appLanguageList &&
                              appLanguageList.map((data) => (
                                <div
                                  key={data.name}
                                  className="capitalize px-3 py-1 cursor-pointer dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)] hover:bg-[var(--background-2)]"
                                  onClick={() =>
                                    appLanguageChange(data.name, data.title)
                                  }
                                >
                                  {data.title}
                                </div>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
              ) : (
                ""
              )}

              {systemconfig &&
              systemconfig.language_mode === "1" &&
              (router.pathname === "/" || router.pathname === "/quiz-play") &&
              languages &&
              languages.length > 1 ? (
                <div className="flex items-center justify-between w-full ">
                  <p className="font-semibold text-white mb-0">
                    {t("quiz_language")} :
                  </p>
                  <div className="flex-center [&>p]:mb-0 mr-2">
                    {/* <Select value={selectcurrentLanguage?.id?.toString()}
                      onValueChange={languageChange}
                    >
                      <SelectTrigger className="w-[135px] mx-2 bg-primary-color !rounded-[5px] text-white  border-none capitalize">
                        {selectcurrentLanguage && selectcurrentLanguage.name
                          ? selectcurrentLanguage.name
                          : t("language")}
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-[5px]">
                        {languages &&
                          languages.map((data) => (
                            <SelectItem
                              key={data.id}
                              // onClick={() =>
                              //   languageChange(
                              //     data.language,
                              //     data.code,
                              //     data.id
                              //   )
                              // }
                              value={data.id?.toString()}
                              className="capitalize"
                            >
                              {data.language}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select> */}
                    <NavigationMenu className="[&>:nth-child(2)]:left-2">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger ref={quizLanWidthRef} className="w-max mx-2 !bg-primary-color !rounded-[5px] !text-white border-none capitalize shadowBtn">
                            {selectcurrentLanguage?.name
                              ? selectcurrentLanguage.name
                              : t("language")}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="bg-white rounded-[5px] " style={{width: getWidth(quizLanWidth)}}>
                            {languages &&
                              languages.map((data) => (
                                <div
                                  key={data.id}
                                  className="capitalize px-3 py-1 cursor-pointer dark:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)] hover:bg-[var(--background-2)]"
                                  onClick={() => languageChange(data.id)}
                                >
                                  {data.language}
                                </div>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="notification">
                {isLogin() ? (
                  //'antd'
                  <div className="flex">
                    <button
                      className="btnPrimary flex gap-3 items-center !p-[12px_15px] my-2 text-[14px] shadowBtn"
                      onClick={() => onNotificationClick()}
                      data-tooltip-id="custom-my-tooltip"
                    >
                      <span className="notification_badges">
                        {notification?.data && notification?.data?.length
                          ? notification?.data?.length
                          : "0"}
                      </span>
                      <FaRegBell />
                    </button>
                    <div className="darkmode ps-4 mt-2">
                      <ThemeToggle />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </li>

          {isLogin() && checkUserData(userData) ? (
            <li className="float-left w-full relative hover:[&>a]:text-primary-color text-white">
              <Link
                href=""
                className="w-full text-[14px] leading-[1.5] font-bold block float-left rtl:float-right rtl:text-right m-0 text-left no-underline capitalize py-[19px] border-b border-white/10 "
              >
                <span>{userName}</span>
              </Link>
              <span
                className="absolute top-[11px] right-0 flex justify-end items-center w-full h-10 cursor-pointer rounded-full bg-transparent menu-toggle"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <i className="text-white transition-transform duration-300 ease-in-out">
                  <FaAngleDown
                    className={`transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </i>
              </span>
              <ul
                className={`my-3 pl-0 list-none ${
                  isProfileOpen
                    ? "animate-dropdown-open"
                    : "animate-dropdown-close"
                }`}
              >
                <li className="py-2 float-left w-full relative hover:[&>a]:!text-primary-color group">
                  <Link
                    href="/profile"
                    onClick={() => {
                      setIsActive(false);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-[14px] leading-[1.5] font-bold block float-left rtl:float-right rtl:text-right m-0 text-left no-underline capitalize"
                  >
                    <span className="text-[#ffffffb3] group-hover:!text-primary-color">
                      {t("profile")}
                    </span>
                  </Link>
                </li>
                <li className="py-2 float-left w-full relative hover:[&>a]:text-primary-color group">
                  <Link
                    className="w-full text-[14px] leading-[1.5] font-bold block float-left rtl:float-right rtl:text-right m-0 text-left no-underline capitalize"
                    href=""
                    onClick={() => {
                      handleSignout();
                      setIsActive(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    <span className="text-[#ffffffb3] group-hover:!text-primary-color">
                      {t("logout")}
                    </span>
                  </Link>
                </li>
              </ul>
            </li>
          ) : (
            <>
              {!guestlogout ? (
                <div className="inline-flex mb-2">
                  <img
                    className="h-10 mt-2"
                    onClick={(e) => {
                      profileGuest(e);
                      setIsActive(false);
                    }}
                    src={getImageSource(img6.src)}
                    alt="profile"
                  />
                  <button
                    className="btnPrimary !p-[6px_15px] mt-2 ml-2 shadowBtn"
                    onClick={(e) => {
                      profileGuest(e);
                      setIsActive(false);
                    }}
                  >{`${t("hello_guest")}`}</button>
                  <button
                    className="btnPrimary !p-[6px_13px] mt-2 ml-2 shadowBtn"
                    onClick={(e) => {
                      guestLogout(e);
                      setIsActive(false);
                    }}
                  >
                    <IoExitOutline className="text-[22px] ml-[3px]" />
                  </button>
                  <div className="darkmode ps-2 mt-2">
                    <ThemeToggle />
                  </div>
                </div>
              ) : (
                <>
                  <li className="float-left w-full relative hover:[&>a]:text-primary-color text-white">
                    <Link href="/auth/login" onClick={() => setIsActive(false)}>
                      <span className="menu-text">{t("login")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/sign-up"
                      onClick={() => setIsActive(false)}
                    >
                      <span className="menu-text">{t("sign_up")}</span>
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
          {menu_data.map((menu, i) => (
            <React.Fragment key={i}>
              {menu?.has_dropdown && (
                <li className="float-left w-full relative hover:[&>a]:text-primary-color text-white">
                  <Link
                    className="w-full text-[14px] leading-[1.5] font-bold block float-left m-0 text-left rtl:float-right rtl:text-right no-underline capitalize py-[19px] border-b border-white/10"
                    href={menu?.link}
                    onClick={() => openMobileMenu(menu?.title)}
                  >
                    {t(menu?.title)}
                  </Link>
                  <ul
                    className={`${
                      navTitle === menu?.title ? "!block" : "hidden"
                    }`}
                  >
                    {menu.sub_menus.map((sub, i) => (
                      <li
                        key={i}
                        className="relative text-sm text-[#ffffffb3] font-bold float-left rtl:float-right rtl:text-right w-full my-2 hover:[&>a]:text-primary-color"
                      >
                        <Link
                          href={sub?.link}
                          onClick={() => setIsActive(false)}
                        >
                          {t(sub?.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`mt-4 text-lg cursor-pointer  !p-0 border-0 h-[26px] w-full leading-[26px] top-0 font-normal text-center absolute right-0 flex justify-end items-center no-underline capitalize ${
                      navTitle === menu.title
                        ? "text-primary-color"
                        : "text-white"
                    }`}
                    onClick={() => openMobileMenu(menu?.title)}
                  >
                    <FaAngleDown />
                  </a>
                </li>
              )}
              {!menu.has_dropdown && (
                <li className="float-left w-full relative hover:[&>a]:text-primary-color text-white">
                  <Link
                    className="w-full text-[14px] leading-[1.5] font-bold block float-left m-0 text-left no-underline capitalize py-[19px] border-b border-white/10"
                    href={menu.link}
                    onClick={() => setIsActive(false)}
                  >
                    {t(menu.title)}
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
      <NotificationModal
        notificationmodal={notificationmodal}
        setNotificationModal={setNotificationModal}
      />

      <style jsx>{`
        @keyframes dropdownOpen {
          0% {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }

        @keyframes dropdownClose {
          0% {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
        }

        .animate-dropdown-open {
          animation: dropdownOpen 0.3s ease-in-out forwards;
          display: block;
        }

        .animate-dropdown-close {
          animation: dropdownClose 0.3s ease-in-out forwards;
          display: none;
        }
      `}</style>
    </>
  );
};

export default withTranslation()(MobileMenus);
