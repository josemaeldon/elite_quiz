"use client";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { withTranslation } from "react-i18next";
import Link from "next/link";
import img404 from "../assets/images/404.svg";
import Meta from "@/components/SEO/Meta";
import Layout from "@/components/Layout/Layout";
import { t } from "@/utils";
import ThemeSvg from "@/components/ThemeSvg";

const NotFound = () => {
  return (
    <>
      <Meta />
      <Layout>
        {/* <Breadcrumb title={t('404')} content="" contentTwo="" /> */}
        <div className="error_page morphisam flex flex-col justify-center items-center h-screen darkSecondaryColor">
          <div className="image_error w-full max-w-[600px] h-[400px]">
            <ThemeSvg
              src={img404.src}
              alt="404"
              width="100%"
              height="100%"
              colorMap={{
                // Primary color mappings
                "#ef5488": "var(--primary-color)",
                "#6c245a": "var(--primary-color)",
                "#8f235c": "var(--primary-color)",
                "#80234e": "var(--primary-color)",
                "#8c2854": "var(--primary-color)",
                "#ad3665": "var(--primary-color)",
                "#e04d80": "var(--primary-color)",
                "#9f315e": "var(--primary-color)",
                "#c53469": "var(--primary-color)",
                "#ef8fb4": "var(--primary-color)",
                "#E85FB2": "var(--primary-color)",
                "#8C2968": "var(--primary-color)",
                "#FDBB46": "var(--primary-color)",
                "#FD8946": "var(--primary-color)",

                // Secondary color mappings
                "#090029": "var(--secondary-color)",
                "#282f39": "var(--secondary-color)",
                "#39414d": "var(--secondary-color)",
                "#717982": "var(--secondary-color)",
                "#414954": "var(--secondary-color)",
              }}
            />
          </div>

          <div className="error_button mt-4 flex justify-center">
            <Link href="/" className="flex items-center btnPrimary gap-2">
              <i>
                <FaArrowLeft />
              </i>{" "}
              {t("back")}
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default withTranslation()(NotFound);
