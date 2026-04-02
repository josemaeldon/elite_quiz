"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { loginSuccess } from "@/store/reducers/userSlice";
import { loginLocal } from "@/api/apiRoutes";
import { useRouter } from "next/navigation";
import { withTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { t } from "@/utils";
import { useDispatch } from "react-redux";
import Link from "next/link";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignin = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.error(t("fill_all_fields"));
      return;
    }

    setLoading(true);
    const res = await loginLocal({ email, password });
    setLoading(false);

    if (!res || res.error) {
      toast.error(res?.message ?? t("invalid_credentials"));
      return;
    }

    dispatch(loginSuccess(res));
    toast.success(t("successfully_login"));
    router.push("/quiz-play");
  };

  useEffect(() => {
    setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
  }, []);

  return (
    <Layout>
      <div className="relative m-auto flex justify-center items-center mt-20">
        <div className="max-w-[600px] px-[15px] mx-auto w-full">
          <div className="rounded-xl bordercolor bg-white bg-opacity-6 relative dark:rounded-[32px]">
            <div className="p-11 max-767:px-3 bg-[var(--background-2)] rounded-xl darkSecondaryColor dark:rounded-[32px]">
              <h3 className="headline">{t("login")}</h3>
              <form onSubmit={handleSignin} className="mt-8">
                <div className="mb-4">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("enter_email")}
                    ref={emailRef}
                    className="w-full rounded-[8px] h-14 px-4"
                    required={true}
                  />
                </div>
                <div className="mb-4">
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("enter_password")}
                    ref={passwordRef}
                    className="w-full rounded-[8px] h-14 px-4"
                    required={true}
                  />
                </div>
                <Button variant="login" className="w-full" type="submit" disabled={loading}>
                  {loading ? t("please_wait") : t("login")}
                </Button>
              </form>
              <p className="text-center mt-6 text-sm">
                {t("dont_have_acc")}{" "}
                <Link href="/auth/sign-up/" className="text-[var(--primary)] font-semibold hover:underline">
                  {t("sign_up")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(Login);
