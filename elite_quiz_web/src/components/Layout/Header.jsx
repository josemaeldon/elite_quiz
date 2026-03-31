"use client";
import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { websettingsData } from "@/store/reducers/webSettings";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { logout, updateUserDataInfo } from "@/store/reducers/userSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getUserCoinsApi } from "@/api/apiRoutes";
const Sidebar = dynamic(() => import("../NavBar/Sidebar"), { ssr: false });
const NavBar = dynamic(() => import("../NavBar/NavBar"), { ssr: false });
const Logo = dynamic(() => import("../Logo/Logo"), { ssr: false });
const MySwal = withReactContent(Swal);

const Header = () => {
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [stickylogo, setStickyLogo] = useState(false);

  // logo
  const websettingsdata = useSelector(websettingsData);

  useEffect(() => {
    const header = document.querySelector(".header-section");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
    if (window.scrollY > 20) {
      setStickyLogo(true);
    } else {
      setStickyLogo(false);
    }
  };

  const userData = useSelector((state) => state.User);
  // sticky logo
  const stickylogoimage = websettingsdata && websettingsdata.sticky_header_logo;

  // logo
  const logoimage = websettingsdata && websettingsdata.header_logo;

  const TOKEN_EXPIRED = "129";

  const handleLogout = async () => {
    logout();
    await router.push("/auth/login");
  };

  useEffect(() => {
    if (userData && userData?.isLogin === true) {
      const loadUserCoinData = async () => {
        const response = await getUserCoinsApi({});

        if (!response?.error) {
          updateUserDataInfo(response?.data);
        } else {
          // if same user login in other brower then its logout
          if (response.message  == TOKEN_EXPIRED) {
            MySwal.fire({
              text: "Your session has expired. Please log in again.",
              icon: "warning",
              showCancelButton: false,
              customClass: {
                confirmButton: "Swal-confirm-buttons",
                cancelButton: "Swal-cancel-buttons",
              },
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                handleLogout();
              }
            });
          }
        }
      };
      loadUserCoinData();
    }
  }, []);



  return (
    <Fragment>
      <div
        className={`min-h-[100px] z-30 relative  header-section ${
          scroll > headerTop ? "is-sticky" : ""
        } mt-0 bg-white darkSecondaryColor`}
      >
        <div
          className={`z-10 flex-center min-h-20 mt-0 ${
            scroll > headerTop
              ? "fixed top-0 left-0 w-full h-[105px] bg-white shadow-[0_8px_20px_0_rgba(33,33,33,0.1)] animate-headerSlideDown dark:shadow-[0_8px_20px_0_rgba(255,255,255,0.05)]"
              : "mb-[13px]"
          }`}
        >
          <div className="container relative ">
            <div className="flex justify-between items-center">
              <div className="xl:w-1/6 w-auto order-0 pt-3 pb-3">
                {scroll > headerTop  ? (
                  <Logo
                    image={stickylogoimage}
                    isActive={isActive}
                    setIsActive={setIsActive}
                  />
                ) : (
                  <Logo
                    image={logoimage}
                    isActive={isActive}
                    setIsActive={setIsActive}
                  />
                )}
              </div>
              <div className="w-auto flex items-center justify-end order-2 xl:justify-center xl:order-1">
                <div className="hidden xl:block static">
                  <NavBar />
                </div>

                <div className="sm:ml-2 xl:hidden">
                  <button
                    onClick={() => setIsActive(true)}
                    className="!outline-none "
                  >
                    <i
                      className="relative bg-primary-color block w-6 h-[3px] overflow-hidden
                      before:transition-transform before:duration-600 before:ease-header-ease before:delay-200 before:transform before:scale-x-0 before:origin-right before:translate-z-0
                      after:transition-transform after:duration-600 after:ease-header-ease after:delay-200 after:transform after:scale-x-1 after:origin-left after:translate-z-0"
                    ></i>
                    <i
                      className="relative mt-1 bg-primary-color block w-6 h-[3px] overflow-hidden
                      before:transition-transform before:duration-600 before:ease-header-ease before:delay-200 before:origin-left before:scale-x-0 before:translate-z-0
                      after:transition-transform after:duration-600 after:ease-header-ease after:delay-200 after:origin-right after:scale-x-0 after:translate-z-0"
                    ></i>
                    <i
                      className="relative mt-1 bg-primary-color block w-6 h-[3px] overflow-hidden
                      before:transition-transform before:duration-600 before:ease-header-ease before:delay-200 before:scale-x-0 before:origin-right
                      after:transition-transform after:duration-600 after:ease-header-ease after:delay-200 after:scale-x-1 after:origin-left"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* side bar start */}
      <Sidebar
        isActive={isActive}
        setIsActive={setIsActive}
        image={logoimage}
      />
      {/* side bar end */}
    </Fragment>
  );
};

export default Header;
