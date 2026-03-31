"use client";
import React from "react";
import { withTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import dropdownIcon from "../../../public/images/dropdown_icon.svg";
import Image from "next/image";
import { t } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { rtlSupport } from "@/store/reducers/languageSlice";
const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isRtl = useSelector(rtlSupport);
  
  const isActive = (to) => {
    return router.pathname === to;
  };

  return (
    <nav className="">
      <ul className="flex flex-wrap ">
        <li>
          <Link
            href="/"
            className={`text-sm font-medium leading-5 block py-2.5 px-4 rounded-lg text-text-color`}
          >
            <span
              className={`${
                pathname === "/" &&
                "!border !border-primary-color darkSecondaryColor"
              } tracking-wide flex font-semibold text-left capitalize p-2 hover:border hover:border-primary-color rounded-[5px] border border-transparent text-[16px] `}
            >
              {t("home")}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/quiz-play"
            className={`text-sm font-medium leading-5 block py-2.5 px-4 rounded-lg text-text-color`}
          >
            <span
              className={`${
                pathname === "/quiz-play/" &&
                "!border !border-primary-color darkSecondaryColor"
              } tracking-wide flex font-semibold text-left capitalize p-2 hover:border hover:border-primary-color rounded-[5px] border border-transparent text-[16px] `}
            >{`${t("quiz")} ${t("play")}`}</span>
          </Link>
        </li>
        <li>
          <Link
            href="/instruction"
            className={`text-sm font-medium leading-5 block py-2.5 px-4 rounded-lg text-text-color`}
          >
            <span
              className={`${
                pathname === "/instruction/" &&
                "!border !border-primary-color darkSecondaryColor"
              } tracking-wide flex font-semibold text-left capitalize p-2 hover:border hover:border-primary-color rounded-[5px] border border-transparent text-[16px] `}
            >
              {t("instruction")}
            </span>
          </Link>
        </li>
        <li className="relative">
          <DropdownMenu className="bg-black">
            <DropdownMenuTrigger asChild>
              <Link
                href=""
                className={`text-sm font-medium leading-5 block py-2.5 px-4 rounded-lg text-text-color group outline-none ${ isRtl === "1" ? "pl-0" : "pr-0" }`}
              >
                <span
                  className={`${
                    (pathname === "/contact-us/" ||
                      pathname === "/about-us/" ||
                      pathname === "/terms-conditions/" ||
                      pathname === "/privacy-policy/") &&
                    "!border !border-primary-color darkSecondaryColor"
                  } tracking-wide flex gap-1 font-semibold text-left capitalize p-2 hover:border hover:border-primary-color rounded-[5px] border border-transparent text-[16px] ${ isRtl === "1" ? "pl-0" : "pr-0" }`}
                >
                  {t("more")}{" "}
                  <Image
                    src={dropdownIcon}
                    alt="Dropdown Icon"
                    className={`flex-center w-auto ${ isRtl === "1" ? "mr-2" : "ml-2" }`}
                    width={10}
                    height={10}
                  />{" "}
                </span>
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="!text-left toparrow shadow-dropdownShadow outline-none rounded-[8px] !bg-[var(--background-2)] dark:!bg-[#211A3E]">
              {/* <span className=''>
                <i className=''>
                  <FaAngleDown />
                </i>
              </span> */}
              <ul className="mb-0 p-3">
                <li>
                  <Link
                    href="/contact-us"
                    className={
                      isActive("/contact-us") ? "navbar__link--active" : ""
                    }
                  >
                    <span className="tracking-wide flex font-normal text-left capitalize !mb-3">
                      {t("contact_us")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className={
                      isActive("/about-us") ? "navbar__link--active" : ""
                    }
                  >
                    <span className="tracking-wide flex font-normal text-left capitalize !mb-3">
                      {t("about_us")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className={
                      isActive("/terms-conditions")
                        ? "navbar__link--active"
                        : ""
                    }
                  >
                    <span className="tracking-wide flex font-normal text-left capitalize !mb-3">
                      {t("t_c")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className={
                      isActive("/privacy-policy") ? "navbar__link--active" : ""
                    }
                  >
                    <span className="tracking-wide flex font-normal text-left capitalize">
                      {t("privacy_policy")}
                    </span>
                  </Link>
                </li>
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
};

export default withTranslation()(NavBar);
