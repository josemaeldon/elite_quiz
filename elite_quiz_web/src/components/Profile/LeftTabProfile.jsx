import userSettingIcon from "@/assets/images/Usersetting.svg";
import bookmarkIcon from "@/assets/images/bookmark.svg";
import statisticsIcon from "@/assets/images/Statistics.svg";
import badgesIcon from "@/assets/images/badges.svg";
import leaderboardIcon from "@/assets/images/leaderboard.svg";
import walletIcon from "@/assets/images/Wallet.svg";
import inviteIcon from "@/assets/images/invitedfriend.svg";
import coinIcon from "@/assets/images/Coinhistory.svg";
import { getImageSource, t } from "@/utils";
import { useRouter } from "next/router";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import Swal from "sweetalert2";
import { logout } from "@/store/reducers/userSlice";
import warningImg from "@/assets/images/logout.svg";
import deleteAccImg from "@/assets/images/deleteAcc.svg";
import logouttabImg from "@/assets/images/logout-tab.svg";
import DeleteImg from "@/assets/images/Delete.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { deleteAccountApi } from "@/api/apiRoutes";
import { errorCodeDataUpdateSuccess } from "@/api/apiEndPoints";
import ThemeSvg from "@/components/ThemeSvg";
const LeftTabProfile = () => {
  const demoValue = process.env.NEXT_PUBLIC_DEMO === "true";

  const systemconfig = useSelector(sysConfigdata);

  const router = useRouter();


  const [logoutModal, setLogoutModal] = useState(false);

  const [deleteAccModal, setDeleteAccModal] = useState(false);

  const path = router.pathname;

  const DarkMode = document.documentElement.classList.contains("dark");
  // sign out
  const handleSignout = (e) => {
    e.preventDefault();
    setLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    router.push("/");
    setLogoutModal(false);
  };

  const handleConfirmDeleteAcc = async () => {
    if (demoValue) {
      Swal.fire(t("ops"), t("not_allowed_in_demo"));
      return;
    }

    const deleteAccountResponse = await deleteAccountApi();

    if (deleteAccountResponse.message === errorCodeDataUpdateSuccess) {
      Swal.fire({
        title: t("deleted"),
        text: t("account_deleted"),
        icon: "success",
        confirmButtonText: t("ok"),
      });
      // Current signed-in user to delete
      logout();
      router.push("/");
      setDeleteAccModal(false);
    }

    if (deleteAccountResponse.error) {
      Swal.fire(t("ops"), t("please "), t("try_again"), "error");
    }
  };

  // delete user account
  const deleteAccountClick = (e) => {
    e.preventDefault();
    setDeleteAccModal(true);
  };

  return (
    <>
      <div className="flex max-1200:flex-row flex-col max-1200:gap-[6px] gap-[10px] px-[9px] py-0 max-1200:overflow-x-scroll max-1200:p-0 max-1200:py-2">
        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[19px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile"
              ? "bg-primary-color text-white invert(1.5) rounded-tl-[16px] -mt-[2px] rounded-tr-[16px] [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile")}
        >
          <span>
            <img
              src={getImageSource(userSettingIcon.src)}
              alt="profile"
              className="dark:[filter:brightness(300)] dark:opacity-60"
            />
          </span>
          <span> {t("profile")}</span>
        </div>
        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile/statistics"
              ? "bg-primary-color text-white invert(1.5) [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile/statistics")}
        >
          <span>
            <img src={getImageSource(statisticsIcon.src)} alt="statistics" className="dark:[filter:brightness(300)] dark:opacity-60" />
          </span>
          <span> {t("statistics")}</span>
        </div>

        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile/bookmark"
              ? "bg-primary-color text-white  invert(1.5)  [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile/bookmark")}
        >
          <span>
            <img
              src={getImageSource(bookmarkIcon.src)}
              alt="bookmark"
              className="dark:[filter:brightness(300)] dark:opacity-60"
            />{" "}
          </span>
          <span>{t("bookmark")}</span>
        </div>

        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile/badges"
              ? "bg-primary-color text-white invert(1.5)  [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile/badges")}
        >
          <span>
            <img src={getImageSource(badgesIcon.src)} alt="badges" className="dark:[filter:brightness(300)] dark:opacity-60"/>
          </span>
          <span>{t("badges")}</span>
        </div>

        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile/leaderboard"
              ? "bg-primary-color text-white invert(1.5)  [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile/leaderboard")}
        >
          <span>
            <img src={getImageSource(leaderboardIcon.src)} alt="leaderboard" className="dark:[filter:brightness(300)] dark:opacity-60"/>
          </span>
          <span>{t("leader_board")}</span>
        </div>

        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile/coin-history"
              ? "bg-primary-color text-white invert(1.5)  [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile/coin-history")}
        >
          <span>
            <img src={getImageSource(coinIcon.src)} alt="coin-history" className="dark:[filter:brightness(300)] dark:opacity-60"/>
          </span>
          <span>{t("coin_history")}</span>
        </div>
        {systemconfig?.payment_mode === "1" ? (
          <div
            className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
              path === "/profile/wallet"
                ? "bg-primary-color text-white invert(1.5)  [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
                : ""
            }`}
            onClick={() => router.push("/profile/wallet")}
          >
            <span>
              <img src={getImageSource(walletIcon.src)} alt="wallet" className="dark:[filter:brightness(300)] dark:opacity-60"/>
            </span>
            <span> {t("wallet")}</span>
          </div>
        ) : null}
        <div
          className={`max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px] ${
            path === "/profile/invite-friends"
              ? "bg-primary-color text-white invert(1.5)  [&>span>img]:[filter:invert(1.5)_brightness(1.5)] max-1200:rounded-full [&>span>img]:dark:opacity-100"
              : ""
          }`}
          onClick={() => router.push("/profile/invite-friends")}
        >
          {/* <span>
            <ThemeSvg
              src={inviteIcon.src}
              width={16}
              height={16}
              alt="invite-friends"
              colorMap={{ "#090029": "var(--primary-color)" }}
            />
          </span> */}
           <span>
              <img src={getImageSource(inviteIcon.src)} alt="wallet" className="dark:[filter:brightness(300)] dark:opacity-60"/>
            </span>
          <span> {t("invite_friends")} </span>
        </div>
        <div
          className="max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px]"
          onClick={(e) => handleSignout(e)}
        >
          <span>
            <img src={getImageSource(logouttabImg.src)} alt="invite-friends" className="dark:[filter:brightness(300)] dark:opacity-60"/>
          </span>
          <span> {t("logout_account")} </span>
        </div>
        <div
          className="max-1200:py-2 max-1200:px-4 max-1200:gap-[12px] max-1200:[&>span]:w-max px-[24px] py-[18px] cursor-pointer max-1200:mx-0 -mx-[10px]  text-[16px] font-bold text-center flex justify-start items-center gap-[20px]"
          onClick={(e) => deleteAccountClick(e)}
        >
          <span>
            <img src={getImageSource(DeleteImg.src)} alt="invite-friends" className="dark:[filter:brightness(300)] dark:opacity-60"/>
          </span>
          <span> {t("delete_account")} </span>
        </div>
      </div>
      <Dialog open={logoutModal} onOpenChange={setLogoutModal}>
        <DialogContent className="bg-[#F1F0F2] !rounded-[32px] p-[20px_24px] [&>button]:hidden">
          <DialogHeader>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center gap-1 text-text-color font-sans ">
                <span>
                <ThemeSvg 
                  className="w-[200px] sm:w-[190px]"
                  src={warningImg.src}
                  colorMap={DarkMode ? {
                    "#090029": "var(--primary-color)",
                    "#3B82F6": "var(--primary-color)",
                    "#212121": "var(--primary-color)",
                    "#C564BB": "var(--primary-color)",
                    "#45536D": "var(--primary-color)",
                    "#ffcaf9": "var(--primary-light)",
                    "#CECCD4": "var(--primary-light)",
                    "0.2": "1",
                    "white": "#221a3f",
                  } : {
                    "#090029": "black",
                  }}
                  />
                </span>
                <span className="text-[24px] font-semibold sm:text-[42px] sm:p-4 font-sans">
                  {t("logout")}
                </span>
                <span className="text-[16px] font-normal sm:text-[20px] sm:p-4">
                  {t("sure_logout")}
                </span>
              </div>

              <div className="flex justify-center items-center gap-5 mt-3">
                <span
                  className="bg-primary-color p-[12px_48px] max-767:p-[12px_18px] rounded-[8px] text-white text-base font-semibold cursor-pointer shadowBtn"
                  onClick={handleConfirmLogout}
                >
                  {t("yes_logout")}
                </span>
                <span
                  className="bg-white p-[10px_48px] max-767:p-[10px_18px] dark:border-[#FFFFFF0A] rounded-[8px] text-text-color text-base font-semibold cursor-pointer border-2 border-[#949191] darkSecondaryColor"
                  onClick={() => setLogoutModal(false)}
                >
                  {t("keep_login")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteAccModal} onOpenChange={setDeleteAccModal}>
        <DialogContent className="bg-[#F1F0F2] !rounded-[32px] p-[20px_24px] [&>button]:hidden">
          <DialogHeader>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center gap-1 text-text-color font-sans">
                <span>
                <ThemeSvg
                  className="w-[200px] sm:w-[190px]"
                  src={deleteAccImg.src}
                  colorMap={DarkMode ? {
                    "#090029": "var(--primary-color)",
                    "#3B82F6": "var(--primary-color)",
                    "#212121": "var(--primary-color)",
                    "#C564BB": "var(--primary-color)",
                    "#45536D": "var(--primary-color)",
                    "#ffcaf9": "var(--primary-light)",
                    "#CECCD4": "var(--primary-light)",
                    "#7f7d91": "var(--primary-light)",
                    "0.2": "1",
                    "white": "#221a3f",
                  } : {
                    "#090029": "black",
                  }}
                  />
                  {/* <img
                    className="w-[200px] sm:w-[190px] dark:[filter:invert(0.9)]"
                    src={getImageSource(deleteAccImg.src)}
                    alt="delete-account"
                  /> */}
                </span>
                <span className="text-[24px] font-semibold sm:text-[42px] sm:p-4 font-sans">
                  {t("delete_account")}
                </span>
                <span className="text-[16px] font-normal sm:text-[20px] sm:p-4">
                  {t("sure_delete_ac")}
                </span>
              </div>

              <div className="flex justify-center items-center gap-5 mt-3">
                <span
                  className="bg-primary-color p-[12px_48px] max-767:p-[12px_18px] rounded-[8px] text-white text-base font-semibold cursor-pointer shadowBtn"
                  onClick={handleConfirmDeleteAcc}
                >
                  {t("yes_delete")}
                </span>
                <span
                  className="bg-white p-[10px_48px] max-767:p-[10px_18px] dark:border-[#FFFFFF0A] rounded-[8px] text-text-color text-base font-semibold cursor-pointer border-2 border-[#949191] darkSecondaryColor"
                  onClick={() => setDeleteAccModal(false)}
                >
                  {t("keep_account")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeftTabProfile;
