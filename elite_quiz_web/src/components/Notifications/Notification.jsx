import { useState } from "react";
import userImg from "@/assets/images/user.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { getImageSource, imgError, t } from "@/utils/index";
const Notification = ({ data }) => {
  
  const [seeMore, setSeeMore] = useState(false);

  // Toggle between seeing more and less text
  const toggleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  return (
    <div className="flex max-399:flex-col items-center bg-[var(--background-2)] rounded-[16px] p-[12px] w-full gap-3 darkSecondaryColor">
      {data?.image ? (
        <img
          className="object-contain w-[60px] h-[80px] rounded-[30px] md:mr-[20px]"
          src={getImageSource(data.image)}
          alt="notification"
          id="image"
          onError={imgError}
        />
      ) : (
        <ThemeSvg
          src={userImg.src}
         className="!w-[60px] min-w-[60px] !h-[80px] min-h-[80px] rounded-[30px] md:mr-[20px]"
          width="100%"
          height="100%"
          alt="User"
          colorMap={{
            "#e13975": "var(--primary-color)",
            "#6d1d50": "var(--secondary-color)",
            "#f7ccdd": "var(--primary-light)",
            "url(#linear-gradient)": "var(--primary-color)",
            "linear-gradient": "var(--primary-color)",
          }}
        />
      )}
      <div className="flex flex-col items-start max-399:items-center gap-1">
        <p className="text-[var(--text-color)] mb-0 !font-bold text-[18px]">
          {data?.title}
        </p>
        <p
          className={`text-start max-399:text-center w-full text-[var(--text-color)] !font-normal text-[16px] mb-0 transition-all duration-500 ease-in-out ${
            seeMore ? "line-clamp-0" : "line-clamp-3"
          }`}
        >
          {data?.message}
        </p>
        {data?.message && data.message.length > 100 && (
          <button
            onClick={toggleSeeMore}
            className="text-primary-color  text-[14px] cursor-pointer hover:underline transition-all duration-500"
          >
            {seeMore ? t("see_less") : t("see_more")}
          </button>
        )}
        <span className="text-start text-gray-500 text-[14px] !font-normal">
          {data?.date_sent}
        </span>
      </div>
    </div>
  );
};

export default Notification;
