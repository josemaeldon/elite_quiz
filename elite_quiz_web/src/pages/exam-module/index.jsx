"use client";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Skeleton from "react-loading-skeleton";
import {
  examCompletedata,
  Loadtempdata,
  selecttempdata,
} from "@/store/reducers/tempDataSlice";
// import { Modal } from 'antd'
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import gk from "@/assets/images/Gk.svg";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import {
  getClientTimeZone,
  getClientTimeZoneGMTFormat,
  getImageSource,
  t,
} from "@/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { getExamModualApi, setExamModualResultApi } from "@/api/apiRoutes";
import { resetremainingSecond } from "@/store/reducers/showRemainingSeconds";

const ExamModule = () => {
  const demoValue = process.env.NEXT_PUBLIC_DEMO === "true";

  const [key, setKey] = useState("Today");

  const [loading, setLoading] = useState(true);

  const [todayData, setTodaydata] = useState([]);

  const [completeData, setCompleteData] = useState([]);

  const [popupCompleteData, setPopupCompleteData] = useState([]);

  const [notificationmodal, setNotificationModal] = useState(false);

  const [ExamCompleteModal, setExamCompleteModalModal] = useState(false);

  const examKeyRef = useRef(null);

  examKeyRef.current = examKeyRef.current || [];
  
  const [examData, setExamData] = useState("");

  const [isChecked, setIsChecked] = useState(false);
  

  const selecttempData = useSelector(selecttempdata);

  const allQuestionData = useSelector(examCompletedata);

  const navigate = useRouter();

  const timezone = getClientTimeZone();

  const gmt_format = getClientTimeZoneGMTFormat();

  const dispatch = useDispatch();

  const [showAllRules, setShowAllRules] = useState(false);

  //all data render
  const getAllData = async () => {
    setLoading(true);

    // today data get
    const response = await getExamModualApi({
      type: 1,
      offset: 0,
      limit: 10,
      timezone,
      gmt_format,
    });

    if (!response?.error) {
      let todayallData = response.data;
      setLoading(false);
      const filteredArray = todayallData.filter(
        (obj) => obj.exam_status !== "3" && obj.no_of_que !== "0",
      );
      setTodaydata(filteredArray);
    }

    if (response.error) {
      console.log(response);
      setLoading(false);
    }

    // completed data get
    const completedDataResponse = await getExamModualApi({
      type: 2,
      offset: 0,
      limit: 10,
      timezone,
      gmt_format,
    });

    if (!completedDataResponse.error) {
      let completeallData = completedDataResponse.data;
      setCompleteData(completeallData);
      setLoading(false);
    } else {
      console.log(completedDataResponse);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, [selectCurrentLanguage]);

  // questions screen
  const QuestionScreen = (data) => {
    setExamData(data.exam_key);
    Loadtempdata(data);
    setNotificationModal(true);
  };

  const getExamCode = () =>
    examKeyRef?.current?.map((input) => input?.value || '').join('');
    // examKeyRef?.current && console.log(getExamCode());

  // popup handle validation
  const handleSubmit = async(e) => {
    const getExamCode = () =>
      examKeyRef.current.map((input) => input?.value || '').join('');
    
    e.preventDefault();
    // Compare the input value with the API data
    if (examData && examData == getExamCode()) {
      if (isChecked) {
        navigate.push("/exam-module/exam-module-play");
      } else {
        toast.error(t("agree_exam_rules"));
      }
    } else {
      toast.error(t("invalid_exam_key"));
    }
const response = await setExamModualResultApi({
  exam_module_id: Number(selecttempData.id),
  rules_violated: 1,  
})

if (response.error) {
  console.log(response);
  
}
  };

  // duration minute
  const durationMinutes = (minute) => {
    let durationInSeconds = minute * 60;
    let hours = Math.floor(durationInSeconds / 3600);
    let minutes = Math.floor((durationInSeconds % 3600) / 60);
    let seconds = durationInSeconds % 60;
    return `${hours}:${minutes}:${seconds} hh:mm:ss`;
  };

  // duration seconds in minutes and hours
  const durationsecondstominutes = (minute) => {
    let hours = Math.floor(minute / 3600);
    let minutes = Math.floor((minute % 3600) / 60);
    let seconds = minute % 60;
    return `${hours}:${minutes}:${seconds} hh:mm:ss`;
  };

  const convertMinutesToDaysHoursMinutes = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = minutes % 60;

    let result = "";

    if (days > 0) {
      result += `${days}d `;
    }

    if (hours > 0 || (days === 0 && hours === 0)) {
      result += `${hours}h `;
    }

    result += `${remainingMinutes}m`;

    return result.trim();
  };

  // complete popup data
  const Completepopup = (e, data) => {
    e.preventDefault();
    setExamCompleteModalModal(true);

    // Convert data object to array of key-value pairs
    const dataEntries = Object.entries(data);
    // Convert statistics property to array of objects
    // const statistics = dataEntries.reduce((acc, [key, value]) => {
    //   if (key === "statistics") {
    //     return [...acc, ...value];
    //   } else {
    //     return acc;
    //   }
    // }, []);

    // Convert answers property to array of objects
    const newdata = dataEntries.reduce((acc, [key, value]) => {
      if (key === "statistics") {
        try {
          value = value && value.replace(/'/g, '"');
          value = value && value.replace(/,\s*]/, "]");
          value = JSON.parse(value);
        } catch (error) {
          console.error("Error parsing statistics:", error);
          // Handle the error or provide a default value for value
        }
      }
      return { ...acc, [key]: value };
    }, {});

    setPopupCompleteData([newdata]);
  };

  useEffect(() => {}, [popupCompleteData]);

  const totals = popupCompleteData.reduce(
    (acc, data) => {
      data?.statistics?.forEach((stat) => {
        acc.totalQuestions +=
          parseInt(stat.correct_answer) + parseInt(stat.incorrect);
        acc.totalCorrect += parseInt(stat.correct_answer);
        acc.totalIncorrect += parseInt(stat.incorrect);
      });
      return acc;
    },
    { totalQuestions: 0, totalCorrect: 0, totalIncorrect: 0 }
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate(); // gets the day as a number (1-31)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()]; // getMonth() returns a zero-based index
    const year = date.getFullYear(); // gets the full year (e.g., 2024)

    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    dispatch(resetremainingSecond(0));
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d?$/.test(value)) return;

    // Move to next box if digit entered
    if (value && index < 3) {
      examKeyRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // On Backspace, go to previous input if empty
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      examKeyRef.current[index - 1]?.focus();
    }
  };
  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("exam")}
        content={t("home")}
        allgames={t("quiz_play")}
        contentTwo={`${t("exam")}`}
      />

      <div className="container mb-2">
        <div className="lg:w-[80%] mx-auto">
          <Tabs defaultValue={`${t("today")} ${t("exam")}`} className="w-full ">
            <TabsList className="flex flex-wrap mb-14 dark:!bg-[linear-gradient(180deg,rgba(255,255,255,0.0512)_0%,rgba(255,255,255,0.1024)_100%)] !p-0 bg-[var(--background-2)]">
              <TabsTrigger
                value={`${t("today")} ${t("exam")}`}
                className="w-1/2 max-479:text-[14px] max-479:w-1/2 data-[state=active]:text-white  data-[state=active]:bg-primary-color data-[state=active]:bg-gradient-to-r data-[state=active]:dark:from-[var(--gradient-from)] data-[state=active]:dark:to-[var(--gradient-to)] data-[state=active]:outline-none capitalize p-2 md:p-3 text-[24px] font-bold  border-none outline-none !shadow-none   data-[state=active]:!rounded-[8px] "
              >
                {`${t("today")} ${t("exam")}`}
              </TabsTrigger>
              <TabsTrigger
                value={`${t("completed")} ${t("exam")}`}
                className="w-1/2  max-479:text-[14px] max-479:w-1/2 data-[state=active]:text-white data-[state=active]:bg-primary-color data-[state=active]:bg-gradient-to-r data-[state=active]:dark:from-[var(--gradient-from)] data-[state=active]:dark:to-[var(--gradient-to)]  data-[state=active]:outline-none capitalize p-2 md:p-3 text-[24px] font-bold  border-none outline-none !shadow-none   data-[state=active]:!rounded-[8px]"
              >
                {`${t("completed")} ${t("exam")}`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={`${t("today")} ${t("exam")}`}>
              <>
                <div
                  className={`${
                    todayData?.length > 0
                      ? "grid grid-cols-1 xxl:grid-cols-3 md:grid-cols-2 gap-5"
                      : "w-full"
                  }  my-14`}
                >
                  {loading ? (
                    <div className="text-center">
                      <Skeleton count={5} className="skeleton" />
                    </div>
                  ) : todayData?.length > 0 ? (
                    todayData.map((data, index) => {
                      const duration = convertMinutesToDaysHoursMinutes(
                        data?.duration
                      );
                      const parts = data?.date.split("-");
                      const newDateStr = parts.reverse().join("-");
                      return (
                        <div className="" key={index}>
                          <div className="relative rounded-[10px] mb-3 cursor-pointer">
                            <div
                              className="relative rounded-[10px] mb-3 cursor-pointer"
                              onClick={() => QuestionScreen(data)}
                            >
                              <div className="relative darkSecondaryColor bgWave px-5 py-7 bg-[var(--background-2)] border-none rounded-[8px] cursor-pointer overflow-hidden mt-0 mb-0">
                                <div className="flex justify-between w-full relative item-center">
                                  <span className="ml-2 flex justify-center items-center z-10 text-white gap-3">
                                    <img
                                      className={`w-[30px] h-[30px] object-contain rounded-[8px] ${
                                        process.env
                                          .NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE ===
                                          "true" &&
                                        "filter dark:brightness-0 dark:invert"
                                      }`}
                                      src={`${gk.src}`}
                                      alt="image"
                                    />
                                    <div className="flex justify-center items-start flex-col relative">
                                      <p className="text-[16px] font-bold leading-[20px] text-text-color break-words mb-2  ">
                                        {data?.title}
                                      </p>
                                      <div className="flex justify-center items-center gap-[15px]">
                                        <p className="text-[14px] font-normal leading-[16px] text-text-color">
                                          {" "}
                                          {newDateStr}
                                        </p>
                                        <div className="border-l border-l-text-color self-start h-[15px] dark:border-l-[#FFFFFF16]"></div>
                                        <p className=" text-[14px] font-normal leading-[16px] text-text-color">
                                          {" "}
                                          {duration}
                                        </p>
                                      </div>
                                    </div>
                                  </span>
                                  <span className="bg-white text-text-color  text-[16px] font-semibold rounded-[8px] mx-2.5 my-1.5 px-2 text-center flex-center darkSecondaryColor">
                                    {" "}
                                    {data?.total_marks} {t("marks")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="errorDiv">
                      <ThemeSvg
                        src={errorimg.src}
                        width="100%"
                        height="100%"
                        className="!w-[110px] !h-[110px]"
                        alt="Error"
                        colorMap={{
                          "#e03c75": "var(--primary-color)",
                          "#551948": "var(--secondary-color)",
                          "#3f1239": "var(--secondary-color)",
                          "#7b2167": "var(--secondary-color)",
                          "#ac5e9f": "var(--primary-color)",
                        }}
                      />

                      <h6>{t("no_exam_for_today")}</h6>
                    </div>
                  )}
                </div>
              </>
            </TabsContent>

            <TabsContent value={`${t("completed")} ${t("exam")}`}>
              <>
                <div
                  className={`${
                    completeData?.length > 0
                      ? "grid grid-cols-1 xxl:grid-cols-3 md:grid-cols-2 gap-5"
                      : "w-full"
                  }  my-14`}
                >
                  {loading ? (
                    <div className="text-center">
                      <Skeleton count={5} className="skeleton" />
                    </div>
                  ) : completeData?.length > 0 ? (
                    completeData.map((data, index) => {
                      const partscom = data?.date?.split("-");
                      const newDateStrcom = partscom.reverse().join("-");
                      return (
                        <div className="" key={index}>
                          <div
                            className="relative rounded-[10px] mb-3 cursor-pointer"
                            onClick={(e) => Completepopup(e, data)}
                          >
                            <div className="relative darkSecondaryColor bgWave px-5 py-7 bg-[var(--background-2)] border-none rounded-[8px] cursor-pointer overflow-hidden mt-0 mb-0">
                              <div className="flex justify-between w-full relative item-center ">
                                <span className="ml-2 flex justify-center items-center z-10 text-white gap-3">
                                  <img
                                   className={`w-[30px] h-[30px] object-contain rounded-[8px] ${
                                    process.env
                                      .NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE ===
                                      "true" &&
                                    "filter dark:brightness-0 dark:invert"
                                  }`}
                                    src={`${gk.src}`}
                                    alt="image"
                                  />
                                  <div className="flex justify-center items-start flex-col relative">
                                    <p className=" text-[16px] font-bold leading-[20px] text-text-color break-words mb-2 ">
                                      {data?.title}
                                    </p>
                                    <div className="flex justify-center items-center gap-[15px]">
                                      <p className=" text-[14px] font-normal leading-[16px] text-text-color">
                                        {" "}
                                        {newDateStrcom}
                                      </p>
                                    </div>
                                  </div>
                                </span>
                                <span className="bg-white text-text-color  text-[16px] font-semibold rounded-[8px] px-2.5 py-1.5 text-center darkSecondaryColor mb-[5px]">
                                  {" "}
                                  {data?.total_marks} {t("marks")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="errorDiv ">
                      <div>
                        <ThemeSvg
                          src={getImageSource(errorimg.src)}
                          width="100%"
                          height="100%"
                          className="!w-[110px] !h-[110px]"
                          alt="Error"
                          colorMap={{
                            "#e03c75": "var(--primary-color)",
                            "#551948": "var(--secondary-color)",
                            "#3f1239": "var(--secondary-color)",
                            "#7b2167": "var(--secondary-color)",
                            "#ac5e9f": "var(--primary-color)",
                          }}
                        />
                      </div>
                      <h6>{t("have_not_completed_any_exam_yet")}</h6>
                    </div>
                  )}
                </div>
              </>
            </TabsContent>
          </Tabs>
        </div>
        <Dialog open={notificationmodal} onOpenChange={setNotificationModal} >
          <DialogTrigger></DialogTrigger>

          <DialogContent className="bg-[#f1f0f2] !rounded-[12px] p-[20px_24px]">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                <div className="flex-center  flex-col max-399:gap-3">
                  <div className="flex flex-col justify-center gap-1 m-2 items-center">
                    <span className="text-center mb-3 !font-sans text-text-color text-2xl font-bold">
                      {t("enter_in_exam")}
                    </span>
                    <span className="text-center mb-4 text-text-color font-normal text-xl">
                      {t("enter_exam_key")}
                    </span>
                  </div>
                  <form
                    className="flex flex-col gap-2 md:gap-4"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="flex gap-3 justify-center">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (examKeyRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          maxLength={1}
                          onChange={(e) => handleChange(e, idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          className="w-12 h-12 rounded-xl text-center text-black font-medium bg-white outline-none border-none dark:bg-[#FFFFFF0A] dark:text-[white]"
                        />
                      ))}
                    </div>
                    {/* <hr /> */}
                    <div className="bg-white rounded-2xl px-6 py-3 dark:!bg-[#FFFFFF0A] dark:!text-[white] dark:font-light ">
                      <p className="text-left mb-2 mt-1 text-text-color font-semibold">
                        {t("exam_rules")}
                      </p>
                      <ul className="marker:black list-disc list-inside">
                        {(showAllRules
                          ? [
                              t("no_copy_exam_honesty"),
                              t("lock_phone_exam_complete"),
                              t("minimize_app"),
                              t("screen_recording_prohibited"),
                              t("no_android_screenshot"),
                              t("ios_screenshot_inform_examinator"),
                            ]
                          : [
                              t("no_copy_exam_honesty"),
                              t("lock_phone_exam_complete"),
                            ]
                        ).map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                      {!showAllRules && (
                        <button
                          type="button"
                          onClick={() => setShowAllRules(true)}
                          className="underline text-[#fff] mt-2"
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            color: "inherit",
                            font: "inherit",
                          }}
                        >
                          View all rules
                        </button>
                      )}
                    </div>

                    {/* <hr /> */}
                    <div className="flex-center">
                      <label className=" flex-center text-center text-text-color font-semibold">
                        <input
                          type="checkbox"
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="me-2  w-5 h-5 accent-primary-color"
                        />
                        {t("i_agree_exam_rules")}
                      </label>
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="btnPrimary !p-2 w-[80%] disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isChecked}>
                        {t("start_exam")}
                      </button>
                    </div>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* complete data */}
        <Dialog
          open={ExamCompleteModal}
          onOpenChange={setExamCompleteModalModal}
          className=""
        >
          <DialogContent className="bg-[#f1f0f2] !rounded-[12px] p-[20px_24px] md:h-[600px] overflow-y-scroll customScrollbar">
            <DialogHeader>
              <DialogDescription>
                <div>
                  <h1 className="text-[18px] md:text-[21px] font-semibold text-text-color text-center">
                    {t("exam_result")}
                  </h1>

                  {popupCompleteData &&
                    popupCompleteData.map((data, index) => {
                      return (
                        <div key={index}>
                          <p className="text-text-color text-center text-[11px] sm:text-[12px] my-2 sm:my-4">
                            {formatDate(data?.date)}
                          </p>
                          <p className="text-center mt-1 text-[16px] sm:text-[18px] text-text-color">
                            {data?.title}
                          </p>
                          <h1 className="text-[18px] md:text-[21px] font-semibold text-text-color text-center bg-white py-2 sm:py-3 mt-2 rounded-[32px] dark:!bg-[#1c143a]">
                            {t("obtained_marks")} :{" "}
                            {data?.obtained_marks + "/" + data?.total_marks}
                          </h1>
                          <div className="p-3 sm:p-[15px_20px] md:p-[15px_40px] bg-white mt-4 sm:mt-6 rounded-[16px] text-text-color dark:!bg-[#1c143a]">
                            <div className="flex items-center justify-between border-b border-b-[#666] pb-3 sm:pb-4 dark:border-b-[#FFFFFF16]">
                              <p className="text-[16px] sm:text-[18px]">{`${t(
                                "total"
                              )} ${t("questions")} `}</p>
                              <p className="text-[16px] sm:text-[18px]">
                                [ {totals.totalQuestions} {t("Que")} ]
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-3 sm:mt-4 text-[14px] sm:text-[16px]">
                              <div className="text-center flex flex-col gap-3 sm:gap-4">
                                <p>{totals.totalCorrect}</p>
                                <p>{t("correct_answer")}</p>
                              </div>
                              <div className="text-center flex flex-col gap-3 sm:gap-4">
                                <p>{totals.totalIncorrect}</p>
                                <p>{t("incorrect_answer")}</p>
                              </div>
                            </div>
                          </div>
                          {data?.statistics?.map((item, idx) => (
                            <div key={idx} className="mt-5 sm:mt-7">
                              <div className="flex items-center justify-between px-2 md:px-4">
                                <p className="text-[16px] sm:text-[18px] text-text-color">
                                  {t("all")} {t("Question")} {item?.mark}{" "}
                                  {t("marks")}
                                </p>
                                <p className="text-[16px] sm:text-[18px] text-text-color">
                                  [{" "}
                                  {parseInt(item?.correct_answer) +
                                    parseInt(item?.incorrect)}{" "}
                                  {t("Que")} ]
                                </p>
                              </div>
                              <div className="bg-white mt-4 sm:mt-5 p-[5px_5px_0px] sm:p-[17px_20px_0px] md:p-[17px_40px_0px] rounded-[16px] dark:!bg-[#1c143a]">
                                <div className="flex items-center justify-between mt-3 sm:mt-4 text-[14px] sm:text-[16px]">
                                  <div className="text-center flex flex-col gap-3 sm:gap-4">
                                    <p>{item?.correct_answer}</p>
                                    <p>{t("correct_answer")}</p>
                                    <div className="border-[5px] border-[#00bf7a] rounded-[7px_7px_0px_0px]"></div>
                                  </div>
                                  <div className="border-l border-l-[#666] h-14 sm:h-16 self-start dark:border-l-[#FFFFFF16]"></div>
                                  <div className="text-center flex flex-col gap-3 sm:gap-4">
                                    <p>{item?.incorrect}</p>
                                    <p>{t("incorrect_answer")}</p>
                                    <div className="border-[5px] border-[#ff005c] rounded-[7px_7px_0px_0px]"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default withTranslation()(ExamModule);
