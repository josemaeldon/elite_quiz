"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { registerLocal } from "@/api/apiRoutes";
import { loginSuccess } from "@/store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { t } from "@/utils";
import { currentAppLanguage } from "@/store/reducers/languageSlice";
import { fcmToken } from "@/store/reducers/settingsSlice";
import { withTranslation } from "react-i18next";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const mobileRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const appLanguage = useSelector(currentAppLanguage) || "english";
  const webFcmId = useSelector(fcmToken);

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const mobile = mobileRef.current?.value?.trim();
    const password = passwordRef.current?.value;
    const confirmPassword = confirmRef.current?.value;

    if (!name || !email || !password || !confirmPassword) {
      toast.error(t("fill_all_fields"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("password_mismatch_warning"));
      return;
    }

    setLoading(true);
    const res = await registerLocal({
      email,
      password,
      name,
      mobile,
      web_language: appLanguage,
      app_language: appLanguage,
      web_fcm_id: webFcmId,
    });
    setLoading(false);

    if (!res || res.error) {
      toast.error(res?.message ?? t("signup_failed"));
      return;
    }

    dispatch(loginSuccess(res));
    toast.success(t("signup_success"));
    router.push("/quiz-play");
  };

  useEffect(() => {
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }, []);

  return (
    <Layout>
      <div className="relative m-auto flex justify-center items-center mt-20">
        <div className="max-w-[600px] px-[15px] mx-auto w-full">
          <div className="rounded-xl bordercolor bg-white bg-opacity-6 relative dark:rounded-[32px]">
            <div className="p-11 max-767:px-3 bg-[var(--background-2)] rounded-xl darkSecondaryColor dark:rounded-[32px]">
              <h3 className="headline">{t("register")}</h3>
              <form onSubmit={handleSignup} className="mt-8">
                <Input
                  id="name"
                  placeholder={t("name")}
                  ref={nameRef}
                  className="mb-4 w-full rounded-[8px] h-14 px-4"
                  required
                />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("enter_email")}
                  ref={emailRef}
                  className="mb-4 w-full rounded-[8px] h-14 px-4"
                  required
                />
                <Input
                  id="mobile"
                  placeholder={t("mobile_number")}
                  ref={mobileRef}
                  className="mb-4 w-full rounded-[8px] h-14 px-4"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("enter_password")}
                  ref={passwordRef}
                  className="mb-4 w-full rounded-[8px] h-14 px-4"
                  required
                />
                <Input
                  id="confirm"
                  type="password"
                  placeholder={t("confirm_password")}
                  ref={confirmRef}
                  className="mb-6 w-full rounded-[8px] h-14 px-4"
                  required
                />
                <Button variant="login" className="w-full" type="submit" disabled={loading}>
                  {loading ? t("please_wait") : t("register")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withTranslation()(SignUp);
