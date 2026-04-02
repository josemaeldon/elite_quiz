"use client";
import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { websettingsData } from "@/store/reducers/webSettings";
import Link from "next/link";
import Logo from "../Logo/Logo";
import { getImageSource, t } from "@/utils";
import appstoreimg from "@/assets/images/appstore.svg";
import palystoreimg from "@/assets/images/playstore.svg";

const Footer = () => {
  const systemconfig = useSelector(sysConfigdata);

  const appLink = systemconfig?.app_link;

  const appiosLink = systemconfig?.ios_app_link;

  const websettingsdata = useSelector(websettingsData);

  const SocialMedia = websettingsdata && websettingsdata.social_media;

  // footer logo
  const footer_logo = websettingsdata && websettingsdata.footer_logo;

  // company text
  const company_text = websettingsdata && websettingsdata.company_text;

  // address
  const address_text = websettingsdata && websettingsdata.address_text;

  // email
  const email_footer = websettingsdata && websettingsdata.email_footer;

  // phone number
  const phone_number_footer =
    websettingsdata && websettingsdata.phone_number_footer;

  // web link
  const web_link_footer = websettingsdata && websettingsdata.web_link_footer;

  // company name
  const company_name_footer =
    websettingsdata && websettingsdata.company_name_footer;

  return (
    <Fragment>
      <div style={{ background: "var(--secondary-color)" }} className="text-white commonMT darkSecondaryColor overflow-hidden">
      <div className="h-[3px] bg-primary-color filter blur-[3px]"></div>
        <div className="container mx-auto px-4 pt-8 pb-4 md:pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Left Section */}
            <div className="mb-4">
              <div className="mb-8" role="banner">
                <Logo image={footer_logo} />
              </div>
              <p className="text-md text-gray-300 max-w-sm mb-[52px]">{company_text}</p>
              <div className="flex items-center gap-4">
              {appiosLink && (
                  <Link
                    href={appiosLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                    aria-label="Download from App Store"
                  >
                    <img
                      className="w-32 md:w-40 object-contain"
                      src={getImageSource(appstoreimg.src)}
                      alt="Download from App Store"
                      loading="lazy"
                    />
                  </Link>
                )}
                {appLink && (
                  <Link
                    href={appLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                    aria-label="Download from Play Store"
                  >
                    <img
                      className="w-32 md:w-40 object-contain"
                      src={getImageSource(palystoreimg.src)}
                      alt="Download from Play Store"
                      loading="lazy"
                    />
                  </Link>
                )}
                
              </div>
            </div>

            {/* Policy Section */}
            <div className="space-y-8">
              <h4 className="text-xl md:text-2xl font-medium" role="heading">{t("policy")}</h4>
              <nav aria-label="Policy links">
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="footerEffect"
                    >
                      {t("privacy_policy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-conditions"
                      className="footerEffect mt-5"
                    >
                      {t("t_c")}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Company Section */}
            <div className="space-y-8">
              <h4 className="text-xl md:text-2xl font-medium" role="heading">{t("company")}</h4>
              <nav aria-label="Company links">
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/about-us"
                      className="footerEffect"
                    >
                      {t("about_us")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact-us"
                      className="footerEffect mt-5"
                    >
                      {t("contact_us")}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Find Us Section */}
            <div className="space-y-4">
              <h4 className="text-xl md:text-2xl font-medium" role="heading">{t("find_us_here")}</h4>
              <address className="not-italic">
                <ul className="space-y-3">
                  {address_text && (
                    <li className="text-gray-300">{address_text}</li>
                  )}
                  {email_footer && (
                    <li>
                      <Link
                        href={`mailto:${email_footer}`}
                        className="text-gray-300 hover:text-white transition-colors duration-200 inline-block"
                      >
                        {email_footer}
                      </Link>
                    </li>
                  )}
                  {phone_number_footer && (
                    <li className="!mt-0">
                      <Link
                        href={`tel:${phone_number_footer}`}
                        className="text-gray-300 hover:text-white transition-colors duration-200 inline-block"
                      >
                        {phone_number_footer}
                      </Link>
                    </li>
                  )}
                </ul>
              </address>
              <div className="flex flex-wrap items-center gap-10 pt-6">
                {SocialMedia &&
                  SocialMedia.map((data, index) => {
                    const cleanLink = data?.link?.replace(/\\/g, '') || '#';
                    const siteName = cleanLink.split('.')[1] || '';
                    return (
                      <Link
                        key={index}
                        href={cleanLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110 rounded-full border border-white p-[2px]"
                        aria-label={`Visit our ${siteName} page`}
                      >
                        <img
                          src={getImageSource(data?.icon)}
                          alt={`${siteName} icon`}
                          className="w-6 h-6"
                          loading="lazy"
                        />
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-800 mt-8 mb-4 w-[200%] relative right-[15%] dark:bg-[#312654] h-[3px]" />

          <div className="text-center">
            <p className="text-sm md:text-md text-white ">
              {t("copyright")} &copy; {new Date().getFullYear()} {t("made_by")}{" "}
              {web_link_footer ? (
                <Link
                  href={web_link_footer?.replace(/\\/g, '') || web_link_footer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                >
                  {company_name_footer}
                </Link>
              ) : (
                <span className="text-gray-300">{company_name_footer}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(Footer);
