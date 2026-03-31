"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { t } from "@/utils";
import { withTranslation } from "react-i18next";

const Layout = dynamic(() => import("@/components/Layout/Layout"), { ssr: false });

const OtpVerify = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-1)] text-center px-4">
        <h1 className="text-2xl font-semibold mb-4">{t("login")}</h1>
        <p className="text-base mb-6">
          {t("sms_login_unavailable") ||
            "O login via SMS/OTP está desativado. Use o formulário de e-mail/senha."}
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-[8px] bg-primary-color px-6 py-3 text-white"
        >
          {t("go_to_login") || "Ir para o login"}
        </Link>
      </div>
    </Layout>
  );
};

export default withTranslation()(OtpVerify);
