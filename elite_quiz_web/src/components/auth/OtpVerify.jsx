"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FirebaseData from "@/utils/Firebase.js";
import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useRouter } from "next/router";
import NewUser from "@/components/Common/NewUser.jsx";
import OtpInput from "react-otp-input";
import { t } from "@/utils";
import { withTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import {
  RecaptchaVerifier,
  getAdditionalUserInfo,
  signInWithPhoneNumber,
} from "firebase/auth";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { registerApi } from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { errorCodeAccountHasBeenDeactivated } from "@/api/apiEndPoints";
import { loginSuccess } from "@/store/reducers/userSlice";
import { fcmToken } from "@/store/reducers/settingsSlice";
import { currentAppLan, currentAppLanguage, rtlSupport } from "@/store/reducers/languageSlice";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const OtpVerify = () => {
  const [phoneNumber, setPhoneNumber] = useState(process.env.NEXT_PUBLIC_VERCEL === "true" ? "+91 88494 93106" : "");
  const [confirmResult, setConfirmResult] = useState("");
  const [otp, setOtp] = useState(process.env.NEXT_PUBLIC_VERCEL === "true" ? "123456" : "");
  const [isSend, setIsSend] = useState(false);
  const [newUserScreen, setNewUserScreen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    profile: "",
    all_time_rank: "",
    all_time_score: "",
    coins: "",
    friends_code: "",
  });

  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);
  const router = useRouter();

  const web_fcm_id = useSelector(fcmToken);

  const currAppLan = useSelector(currentAppLanguage);

  // Get RTL support state
  const isRtl = useSelector(rtlSupport);

  const { auth, firebase } = FirebaseData();
  // window recaptcha
  useEffect(() => {
    setTimeout(() => {
      const recaptchaContainer = document.getElementById("recaptcha-container");

      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = ""; // Clear the container

        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          recaptchaContainer,
          {
            size: "invisible",
            // other options
          }
        );

        return () => {
          window.recaptchaVerifier.clear();
        };
      } else {
        console.error(
          "Error: Could not find the recaptcha-container element in the DOM."
        );
      }
    }, 1000);
  }, [firebase]);

  // Load the libphonenumber library
  const phoneUtil =
    require("google-libphonenumber").PhoneNumberUtil.getInstance();

  // Validate a phone number
  const validatePhoneNumber = (phone_number) => {
    try {
      const parsedNumber = phoneUtil.parse(phone_number);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
      return false;
    }
  };

  // otp sigin with phone number
  const onSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    let phone_number = "+" + phoneNumber;
    try {
      if (validatePhoneNumber(phone_number)) {
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phone_number, appVerifier)
          .then((response) => {
            // success
            setIsSend(true);
            setLoad(false);
            setConfirmResult(response);
          })
          .catch((error) => {
            // window.recaptchaVerifier.render().then(function (widgetId) {
            //     window.recaptchaVerifier.reset(widgetId)
            // })
            if (error.code == "auth/too-many-requests") {
              router.push("/");
              toast.error("please try after some time latter");
            } else {
              console.log(error);
              handleVerificationError(error);
              setLoad(false);
            }
          });
      } else {
        setLoad(false);
        toast.error(t("enter_num_with_country_code"));
      }
    } catch (error) {
      console.log(error);
    }
    setSeconds(60);
    setIsCounting(true);
  };

  useEffect(() => {}, [onSubmit]);

  useEffect(() => {
    let timer;
    if (isCounting && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [isCounting, seconds]);

  // resend otp
  const resendOtp = (e) => {
    e.preventDefault();
    setLoad(true);
    let phone_number = "+" + phoneNumber;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone_number, appVerifier)
      .then((response) => {
        setIsSend(true);
        setLoad(false);
        setConfirmResult(response);
        toast.success(t("otp_sent"));
      })
      .catch((error) => {
        // window.recaptchaVerifier.render().then(function (widgetId) {
        //     window.recaptchaVerifier.reset(widgetId)
        // })
        handleVerificationError(error);
        toast.error(error.message);
        setLoad(false);
      });
    setSeconds(60);
    setIsCounting(true);
  };

  // verify code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setLoad(true);
    if (confirmResult) {
      // Check if confirmResult is not null
      confirmResult
        .confirm(otp)
        .then(async (response) => {
          setLoad(false);
          setProfile(response.user);
          let firebase_id = response.user.uid;
          let phone = response.user.phoneNumber;

          const { isNewUser } = getAdditionalUserInfo(response);

          const registerResponse = await registerApi({
            firebase_id: firebase_id,
            type: "mobile",
            mobile: phone,
            web_fcm_id: web_fcm_id,
            web_language: currAppLan,
          });

          if (registerResponse.message === errorCodeAccountHasBeenDeactivated) {
            toast.error(t("ac_deactive"));
          } else {
            dispatch(loginSuccess(registerResponse));
            if (isNewUser) {
              setNewUserScreen(true);
            } else {
              dispatch(currentAppLan(registerResponse.web_language));
              toast.success(t("successfully_login"));
              router.push("/quiz-play");
            }
          }

          if (isNewUser) {
            setNewUserScreen(true);
          } else {
            router.push("/quiz-play");
          }
        })
        .catch((error) => {
          handleVerificationError(error);
          setLoad(false);
        })
        .finally(() => {
          setLoad(false);
        });
    } else {
      setLoad(false);
      toast.error("Confirmation result is null. Please try again.");
    }
  };

  const handleVerificationError = (error) => {
    switch (error.code) {
      case "auth/invalid-verification-code":
        toast.error(
          "Invalid verification code. Please double-check the code entered."
        );
        break;
      case "auth/missing-verification-code":
        toast.error("Verification code is missing.");
        break;
      case "auth/code-expired":
        toast.error("Verification code has expired. Request a new code.");
        break;
      case "auth/invalid-verification-id":
        toast.error(
          "Invalid verification ID. Please retry the verification process."
        );
        break;
      case "auth/user-disabled":
        toast.error("The user account has been disabled.");
        break;
      case "auth/quota-exceeded":
        toast.error(
          "Quota for verification attempts exceeded. Please try again later."
        );
        break;
      case "auth/captcha-check-failed":
        toast.error(
          "reCAPTCHA verification failed. Check your reCAPTCHA configuration."
        );
        break;
      case "auth/invalid-phone-number":
        toast.error(
          "Invalid phone number. Double-check the phone number format."
        );
        break;
      case "auth/app-not-authorized":
        toast.error(
          "Firebase app not authorized. Check Firebase configuration."
        );
        break;
      case "auth/invalid-credential":
        toast.error(
          "Invalid credential. Double-check the authentication credential."
        );
        break;
      case "auth/credential-already-in-use":
        toast.error("Credential (phone number) is already in use.");
        break;
      case "auth/unverified-email":
        toast.error(
          "User account has an unverified email. Verify the email first."
        );
        break;
      default:
        toast.error("Error: " + error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  return (
    <Layout>
      <div className="container mt-20">
        {!newUserScreen  ? (
          <div className="max-w-[600px] w-full m-auto mt-14 mb-40">
            <div className=" morphisam !p-[55px_0px_0px_0px] sm:!p-[55px_55px_0px_55px] darkSecondaryColor dark:rounded-[32px]">
              <div className="p-5 relative">
                {!isSend ? (
                  <form onSubmit={onSubmit}>
                    <h3 className="headline sm:!text-start !mb-4 max-399:text-[25px]">
                      {t("sign_mobile")}
                    </h3>
                    <div>
                      <label htmlFor="number" className="mb-2">
                        {t("digit_code")}
                      </label>
                      <PhoneInput
                        value={phoneNumber}
                        country={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
                        countryCodeEditable={false}
                        // autoFocus={true}
                        onChange={(phone) => setPhoneNumber(phone)}
                        inputProps={{
                          autoFocus: true,
                        }}
                        onKeyDown={handleKeyDown}
                        className="relative inline-block w-full   my-3 "
                      />
                      <div>
                        <Button variant="login" size="login" type="submit">
                          {!load ? t("req_otp") : t("please_wait")}
                        </Button>
                      </div>
                      <div className="flex-center">
                        <Link
                          className="text-text-color flex"
                          href={"/auth/login"}
                          type="button"
                        >
                          <IoMdArrowRoundBack className="mr-2 mt-1" />{" "}
                          {t("Back_to_login")}
                        </Link>
                      </div>
                    </div>
                  </form>
                ) : null}
                {isSend ? (
                  <form onSubmit={handleVerifyCode}>
                    <h3 className="headline sm:!text-start !mb-4 max-399:text-[25px]">
                      {t("otp_Verification")}
                    </h3>
                    <div className="">
                      <label htmlFor="code" className="mb-2">
                        {t("send_code")} <div>+{phoneNumber}</div>
                      </label>
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        containerStyle={"flex flex-wrap"}
                        shouldAutoFocus
                        renderSeparator={<span className="space"></span>}
                        renderInput={(props) => (
                          <input
                            {...props}
                            placeholder={'-'}
                            className="relative inline-block mr-[26px] darkSecondaryColor  my-3 !w-12 h-12 rounded-[4px] dark:rounded-[8px]"
                            dir={isRtl === "1" ? "rtl" : "ltr"}
                          ></input>
                        )}
                      />

                      <div className="text-center my-2">
                        {seconds == 0 ? (
                          <div className="flex-center my-4">
                            {" "}
                            <p>{t("didnt_get")} &nbsp;</p>
                            <Link
                              className="text-primary-color"
                              href="#"
                              onClick={resendOtp}
                            >
                              {t("otp_resend")}
                            </Link>
                          </div>
                        ) : (
                          <p>
                            {" "}
                            {t("please_wait")} {seconds}
                          </p>
                        )}
                      </div>
                      <div className="">
                        <Button variant="login" size="login" type="submit">
                          {!load ? t("submit") : t("please_wait")}
                        </Button>
                      </div>
                      <div className="flex-center">
                        <Link
                          className="text-text-color flex"
                          href={"/auth/login"}
                          type="button"
                        >
                          <IoMdArrowRoundBack className="mr-2 mt-1" />{" "}
                          {t("Back_to_login")}
                        </Link>
                      </div>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
            <div id="recaptcha-container"></div>
          </div>
        ) : (
          <>
            <NewUser profile={profile} setProfile={setProfile} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default withTranslation()(OtpVerify);
