"use client";
import React, { useRef, useState } from "react";
import { FaRegCopy, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Link from "next/link";
import giftImg from "@/assets/images/img.png";
import dynamic from "next/dynamic";
import LeftTabProfile from "../Profile/LeftTabProfile";
import { t } from "@/utils";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import coinimg from "@/assets/images/coin.svg";
import ThemeSvg from "../ThemeSvg";
import Image from "next/image";
import Breadcrumb from "../Common/Breadcrumb";
const Layout = dynamic(() => import("../Layout/Layout"), { ssr: false });

const Invite_friends = () => {
  const clickCount = useRef(0);


  const systemconfig = useSelector(sysConfigdata);
  
  const earnCoin = systemconfig?.earn_coin;
  const referCoin = systemconfig?.refer_coin;

  // refer_coin

  const [copyState, setCopyState] = useState(0);

  const userData = useSelector((state) => state.User);

  const clickToCopy = (event) => {
    event.preventDefault();
    if (navigator.clipboard !== undefined) {
      //Chrome
      navigator.clipboard
        .writeText(userData?.data && userData?.data?.refer_code)
        .then(
          function () {},
          function (err) {}
        );
    } else if (window.clipboardData) {
      // Internet Explorer
      window.clipboardData.setData(
        "Text",
        userData?.data && userData?.data?.refer_code
      );
    }

    setCopyState(1);
    setTimeout(() => {
      setCopyState(0);
    }, 1000);
  };

  const refferMessage = `${t("hey_there_earn")} ${systemconfig.refer_coin} ${t(
    "coins"
  )} ${t("apply_referral_code")} ${userData && userData?.data?.refer_code}
 ${t("compete_for_prizes")} ${
    process.env.NEXT_PUBLIC_APP_WEB_URL + "/auth/sign-up/"
  }`;
  return (
    <Layout>
      <div className="container px-2 my-14 ">
      {/* <div className="mb-24 max-1200:mb-20 max-767:mb-12">
            <Breadcrumb
              showBreadcrumb={true}
              title={t("profile")}
              content={t("home")}
              contentFive={t("profile")}
              />
            </div> */}
        <div className="flex flex-wrap relative between-1200-1399:flex-nowrap justify-evenly gap-9">
          <div className="h-max w-full xl:w-1/4 lg:w-2/3 md:w-full">
            <div className="darkSecondaryColor flex flex-col min-w-0 break-words  rounded-[16px] bg-[var(--background-2)] border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] max-1200:p-[12px] relative ">
              {/* Tab headers */}
              <LeftTabProfile />
            </div>
          </div>
          <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] morphisam !m-0 !p-0 darkSecondaryColor">
            <div className="!mt-0 flex flex-wrap">
              <div>
                <div className="p-7">
                  <h3 className="text-center">
                    <b className="text-text-color font-sans text-[42px] font-semibold max-575:text-[24px]">
                      {" "}
                      {t("refer_earn")}
                    </b>
                  </h3>

                  <div className="py-7 relative flex-center after:z-0 after:absolute after:top-[30px] after:ml-[-50px] after:w-[300px] after:h-[180px] after:blur-[75px] after:rounded-[70px] after:bg-[var(--primary-color)] after:opacity-[0.6]">
                    <div className="relative w-[165px] h-[180px]">
                      {/* <ThemeSvg
                        src={giftImg.src}
                        alt="invite-friend"
                        width="100%"
                        height="100%"
                        colorMap={{
                          // Primary color mappings
                          "#E85FB2": "var(--primary-color)",
                          "#8C2968": "var(--primary-color)",
                          "#7F0047": "var(--primary-color)",
                          "#891455": "var(--primary-color)",
                          "#AC5A88": "var(--primary-color)",
                          "#C995B2": "var(--primary-color)",
                          "#E0C2D3": "var(--primary-color)",
                          "#FF7087": "var(--primary-color)",
                          "#FDBB46": "var(--primary-color)",
                          "#FD8946": "var(--primary-color)",
                          "#FDBB46": "#FDBB46",
                          "#FD8946": "#FD8946",
                          "#8C1000": "#8C1000",
                          "#952214": "#952214",
                          "#B4645A": "#B4645A",
                          "#CF9B95": "#CF9B95",
                          "#E3C6C2": "#E3C6C2",
                          "#F2E5E3": "#F2E5E3",
                          "#FBF8F7": "#FBF8F7",
                          "#FFFF87": "#FFFF87",
                          "#B44119": "#B44119",
                          // Secondary color mappings
                          "#090029": "var(--secondary-color)",
                          "#282f39": "var(--secondary-color)",
                        }}
                      /> */}
                      <img src={giftImg.src} alt="invite-friend" />
                    </div>
                    {/* <ImageToSvg imageUrl={giftImg.src} className="custom-svg" /> */}
                  </div>

                  <div className=" flex-center !items-end ">
                    <span className="text-2xl md:text-4xl text-text-color font-bold flex gap-2 items-center">
                      <div className="w-5 h-5">
                        <ThemeSvg
                          src={coinimg.src}
                          width="100%"
                          height="100%"
                          alt="Coin"
                          className="!block"
                          colorMap={{
                            // Primary color mappings
                            "#E85FB2": "var(--primary-color)",
                            "#8C2968": "var(--primary-color)",
                            "#7F0047": "var(--primary-color)",
                            "#891455": "var(--primary-color)",
                            "#AC5A88": "var(--primary-color)",
                            "#C995B2": "var(--primary-color)",
                            "#E0C2D3": "var(--primary-color)",
                            "#FF7087": "var(--primary-color)",
                            "#ef5488": "var(--primary-color)",
                            "#FDBB46": "var(--primary-color)",
                            "#FD8946": "var(--primary-color)",

                            // Secondary color mappings
                            "#090029": "var(--secondary-color)",
                            "#282f39": "var(--secondary-color)",
                          }}
                        />
                      </div>
                      {systemconfig.earn_coin}{" "}
                    </span>
                    <span className="ml-2 text-xl md:text-2xl font-bold text-text-color items-baseline">
                      {t("get_free_coin")}
                    </span>
                  </div>

                  <p className="font-sans text-base md:text-[18px] font-bold text-gray-500 sm:px-[50px] px-0  py-[30px] text-center opacity-50">
                    {t("refer_frd") + " " + earnCoin + " " + t("coins") + " " + t("each_time") + " " + referCoin + " " + t("coins") + " " + t("by_using")}
                  </p>

                  <div className="bg-gradient-to-r from-primary-color to-[#981b46] rounded-[8px] text-white p-[20px] flex-center flex-col">
                    <span>
                      <b>{t("your_referral_code")}</b>
                    </span>
                    <div className="relative m-[30px_auto] after:absolute  after:left-0 after:top-0 after:w-full after:h-full after:z-[-2] after:rounded-[50px]">
                      <span className="bg-transparent rounded-[16px] border-dashed text-white font-bold border-[2px] border-[#ddd] px-[50px] py-[12px]">
                        {userData && userData?.data?.refer_code}
                      </span>
                      <button className="h-[45px] px-[20px] rounded-[16px] bg-transparent cursor-pointer text-white absolute mt-[-12px] ml-[-58px] transition-all duration-2000 ease-out inline-block !shadow-[inset_0_0_0_0_#313131] border-none">
                        <span className="mt-1 inline-block">
                          <Link
                            href={""}
                            onClick={(event) => {
                              clickToCopy(event);
                            }}
                            className="hover:text-primary-color "
                          >
                            <i>
                              <FaRegCopy />
                            </i>
                          </Link>
                        </span>
                      </button>
                    </div>
                    <span>{t("send_to_friend")}</span>
                  </div>
                </div>

                <div className="flex-center flex-col my-4 md:my-6 gap-3">
                  <p className="text-[#090929] font-sans text-[24px] font-bold mb-0">
                    <b>{t("invite_now")}</b>
                  </p>
                  <ul className="list-none flex justify-center items-center mb-3">
                    <li className="mr-5 cursor-pointer">
                      <a
                        href={
                          "https://web.whatsapp.com/send?text=" + refferMessage
                        }
                        target="_blank"
                        rel="noreferrer"
                        // onClick={shareAppButton}
                      >
                        <i className="text-white text-[26px] bg-gradient-to-r from-[var(--primary-color)] to-[#981b46] rounded-full p-[10px] flex justify-center items-center">
                          <FaWhatsapp />
                        </i>
                      </a>
                    </li>
                    <li className="mr-5 cursor-pointer">
                      <a
                        href={
                          "https://twitter.com/intent/tweet?text=" +
                          refferMessage
                        }
                        target="_blank"
                        rel="noreferrer"
                        // onClick={shareAppButton}
                      >
                        <i className="text-white text-[26px] bg-gradient-to-r from-[var(--primary-color)] to-[#981b46] rounded-full p-[10px] flex justify-center items-center">
                          <FaXTwitter />
                        </i>
                      </a>
                    </li>
                    <li className="mr-5 cursor-pointer">
                      <a
                        href={
                          "http://www.facebook.com/sharer.php?u=" +
                          window.location.protocol +
                          "//" +
                          window.location.hostname +
                          "&quote=" +
                          refferMessage
                        }
                        target="_blank"
                        rel="noreferrer"
                        // onClick={shareAppButton}
                      >
                        <i className="text-white text-[26px] bg-gradient-to-r from-[var(--primary-color)] to-[#981b46] rounded-full p-[10px] flex justify-center items-center">
                          <FaFacebook />
                        </i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(Invite_friends);
