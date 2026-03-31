"use client";
import React from "react";
import { withTranslation } from "react-i18next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import dynamic from "next/dynamic";
import Meta from "@/components/SEO/Meta";
import maintainenceimg from "@/assets/images/maintenance.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import { t } from "@/utils";

const Maintainance = () => {
  return (
    <>
      <Meta />
      <Layout>
        <Breadcrumb title={t("maintainance")} content="" contentTwo="" />
        <div className="container mb-2">
          <div className="morphisam">
            <div className="flex-center mb-10">
              <ThemeSvg
                src={maintainenceimg.src}
                className=""
                width="50%"
                height="50%"
                alt="Maintenance"
                colorMap={{
                  "#e03c75": "var(--primary-color)",
                  "#551948": "var(--secondary-color)",
                  "#3f1239": "var(--secondary-color)",
                  "#7b2167": "var(--secondary-color)",
                  "#ac5e9f": "var(--primary-color)",
                }}
              />
            </div>
            <div className="text-center ">
              <p className="text-2xl font-bold max-767:!text-sm">{t("sry_for_maintenance")}</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default withTranslation()(Maintainance);
