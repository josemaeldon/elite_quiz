"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Link from "next/link";
import { resetLocalPassword } from "@/api/apiRoutes";
import { t } from "@/utils";
import { withTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.error(t("fill_all_fields"));
      return;
    }

    setLoading(true);
    const res = await resetLocalPassword({ email, newPassword: password });
    setLoading(false);

    if (!res || res.error) {
      toast.error(res?.message ?? t("password_reset_failed"));
      return;
    }

    toast.success(t("password_reset_success"));
    router.push("/auth/login");
  };

  return (
    <Layout>
      <div className="container mb-16">
        <div className="max-w-[600px] w-full m-auto mt-14 mb-40">
          <div className="morphisam darkSecondaryColor dark:rounded-[32px]">
            <div className="p-5 relative">
              <h3 className="mb-4 flex flex-start text-[40px] font-semibold text-text-color">{t("forgot_pass")}?</h3>
              <p className="text-text-color">{t("send_link_to_get_account")}</p>
              <form onSubmit={handleReset} className="mt-6">
                <Input
                  id="email"
                  type="email"
                  placeholder={t("enter_email")}
                  ref={emailRef}
                  className="mb-4 w-full rounded-[8px] h-14 px-4"
                  required
                />
                <Input
                  id="new_password"
                  type="password"
                  placeholder={t("enter_password")}
                  ref={passwordRef}
                  className="mb-4 w-full rounded-[8px] h-14 px-4"
                  required
                />
                <Button variant="login" type="submit" className="w-full" disabled={loading}>
                  {loading ? t("please_wait") : t("send")}
                </Button>
                <div className="flex-center mt-3">
                  <Link className="text-text-color flex" href="/auth/login">
                    {t("back_to_login")}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(ResetPassword);
