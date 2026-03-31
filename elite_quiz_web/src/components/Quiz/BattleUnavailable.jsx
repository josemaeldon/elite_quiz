"use client";
import { withTranslation } from "react-i18next";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout/Layout"), { ssr: false });

const BattleUnavailable = ({ title, description, action }) => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-base text-muted mb-6">{description}</p>
        {action && (
          <div className="inline-flex rounded-lg border border-primary-color px-5 py-3 text-primary-color">
            {action}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withTranslation()(BattleUnavailable);
