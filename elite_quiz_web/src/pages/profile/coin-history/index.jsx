"use client";
import React, { use, useEffect, useState } from "react";
import { t } from "@/utils";
import { withTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Layout from "@/components/Layout/Layout";
import LeftTabProfile from "@/components/Profile/LeftTabProfile";
import FormattedNumberData from "@/components/FormatNumber/FormatedNumberData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getTableTrackerDataApi } from "@/api/apiRoutes";
import { errorCodeDataNotFound } from "@/api/apiEndPoints";
import Breadcrumb from "@/components/Common/Breadcrumb";

const CoinHistory = () => {
  // state
  const [allData, setAllData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [loseData, setLoseData] = useState([]);
  const [total, setTotal] = useState(0);
  const [incometotal, setInocmetotal] = useState(0);
  const [losetotal, setLosetotal] = useState(0);
  const [allCurrentPage, setAllCurrentPage] = useState(0);
  
  const [incomeCurrentPage, setIncomeCurrentPage] = useState(0);
  const [loseCurrentPage, setLoseCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dataPerPage = 10; // number of posts per page
  const [activeTab, setActiveTab] = useState("all");
  const [incomeApiCall, setIncomeApiCall] = useState(false);
  const [loseApiCall, setLoseApiCall] = useState(false);
  const [allApiCall, setAllApiCall] = useState(false);
  
  const handlePageChange = (selectedPage, eventKey) => {
    
    switch (eventKey) {
      case "all":
        setAllCurrentPage(selectedPage.selected);
        break;
      case "income":
        setIncomeCurrentPage(selectedPage.selected);
        break;
      case "lose":
        setLoseCurrentPage(selectedPage.selected);
        break;
      default:
        break;
    }
  };

  const fetchAllData = async () => {
    const response = await getTableTrackerDataApi({
      offset: allCurrentPage * dataPerPage,
      limit: dataPerPage,
    });

    setIsLoading(false);

    if (!response?.error) {
      
      setAllData(response.data);
      setTotal(response.total);
    }

    if (response.message === errorCodeDataNotFound) {
      setTotal(0);
      setIsLoading(false);
    }

  };

  const fetchIncomeData = async () => {
    const response = await getTableTrackerDataApi({
      offset: incomeCurrentPage * dataPerPage,
      limit: dataPerPage,
      type: "1",
    });

    setIsLoading(false);

    if (!response?.error) {
      setIncomeData(response.data);
      setInocmetotal(response.total);
    }

    if (response.message === errorCodeDataNotFound) {
      setInocmetotal(0);
      setIsLoading(false);
    }
  };

  const fetchLoseData = async () => {
    const response = await getTableTrackerDataApi({
      offset: loseCurrentPage * dataPerPage,
      limit: dataPerPage,
      type: "2",
    });

    setIsLoading(false);

    if (!response?.error) {
      setLoseData(response.data);
      setLosetotal(response.total);
    }

    if (response.message === errorCodeDataNotFound) {
      setLosetotal(0);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (activeTab === "all") {
      setAllApiCall(true);
      fetchAllData();
    } else if (activeTab === "income") {
      setIncomeApiCall(true);
      fetchIncomeData();
    } else if (activeTab === "lose") {
      setLoseApiCall(true);
      fetchLoseData();
    }
  }, [activeTab,allCurrentPage,incomeCurrentPage,loseCurrentPage ]);

  // render data of points based on status and welcome bonus with type check
  const renderPoints = (data) => {
    const pointsValue = parseFloat(data.points);

    if (activeTab === "income" || data.type === "welcomeBonus") {
      return (
        <p className="!text-white w-[60px] h-[30px] flex-center rounded-[50px] !mb-0 bg-[#00bf7a]">
          +<FormattedNumberData value={pointsValue} />
        </p>
      );
    } else if (activeTab === "income" || data.status === "0") {
      return (
        <p className="!text-white w-[60px] h-[30px] flex-center rounded-[50px] !mb-0 bg-[#00bf7a]">
          +<FormattedNumberData value={pointsValue} />
        </p>
      );
    } else {
      return (
        <p className="!text-white w-[60px] h-[30px] flex-center rounded-[50px] !mb-0 bg-[#ff005c]">
          <FormattedNumberData value={pointsValue} />
        </p>
      );
    }
  };

  // render date in correct format
  const renderDate = (data) => {
    const getDateFormat = data.date.split("-");
    const newDateFormat = getDateFormat.reverse().join("-");
    return newDateFormat;
  };
  return (
    <Layout>
      <section className="container px-2 my-14 ">
      {/* <div className="mb-24 max-1200:mb-20 max-767:mb-12">
            <Breadcrumb
              showBreadcrumb={true}
              title={t("profile")}
              content={t("home")}
              contentFive={t("profile")}
              />
            </div> */}
        <div className="">
          <div className="">
            <div className="flex flex-wrap relative between-1200-1399:flex-nowrap justify-evenly gap-9">
              <div className="h-max w-full xl:w-1/4 lg:w-2/3 md:w-full">
                <div className="darkSecondaryColor flex flex-col min-w-0 break-words  rounded-[16px] bg-[var(--background-2)] border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] max-1200:p-[12px] relative">
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] morphisam !m-0 !p-0 darkSecondaryColor">
                <div className="p-7">
                  <div className="font-bold text-[42px] mb-5 text-center ">{t("coin_history")}</div>
                  <Tabs defaultValue="all" onValueChange={setActiveTab}>
                    <TabsList className="flex  w-full !justify-evenly h-auto gap-y-5">
                      <TabsTrigger
                        value="all"
                        className="profileTabBtn px-4 md:px-20 text-[18px] !mx-0 !py-2 w-[30%]"
                      >
                        {t("all")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="income"
                        className="profileTabBtn px-4 md:px-20 text-[18px] !mx-0 !py-2 w-[30%]"
                      >
                        {t("income")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="lose"
                        className="profileTabBtn px-4 md:px-20 text-[18px] !mx-0 !py-2 w-[30%]"
                      >
                        {t("lose")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" title={t("all")}>
                      {isLoading ? (
                        // Show skeleton loading
                        <div className="w-full">
                          <Skeleton height={20} count={5} className="skeleton"/>
                        </div>
                      ) : allData?.length > 0 ? (
                        allData.map((data, index) => (
                          <div className="w-full" key={index}>
                            <div className="p-[10px] mb-[25px] border-b border-black/10 dark:border-[#FFFFFF29]">
                              <div className="flex justify-between items-center max-575:flex-col max-575:items-start">
                                <div className="font-bold">
                                  <p className="text-text-color font-sans text-[16px] font-medium capitalize">
                                    <strong className="!text-black dark:!text-white">
                                      {t(data.type)}
                                    </strong>
                                  </p>
                                  {/* <span>{renderDate(data)}</span> */}
                                </div>
                                <div className="text-text-color p-2 rounded-[10px] flex-center gap-7">
                                  <span className="font-sans text-[16px] font-semibold text-text-color">
                                    {renderDate(data)}
                                  </span>
                                  <span>{renderPoints(data)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show "No data found" message
                        <div className="w-full">
                          <p className="text-center">{t("no_data_found")}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="income" title={t("income")}>
                      {isLoading ? (
                        // Show skeleton loading
                        <div className="w-full">
                          <Skeleton height={20} count={5} className="skeleton"/>
                        </div>
                      ) : incomeData?.length > 0 ? (
                        incomeData.map((data, index) => (
                          <div className="w-full" key={index}>
                            <div className="p-[10px] mb-[25px] border-b border-black/10 dark:border-[#FFFFFF29]">
                              <div className="flex justify-between items-center max-575:flex-col max-575:items-start">
                                <div className="font-bold">
                                  <p className="text-text-color font-sans text-[16px] font-medium capitalize">
                                    <strong className="!text-black dark:!text-white">
                                      {t(data.type)}
                                    </strong>
                                  </p>
                                  {/* <span>{renderDate(data)}</span> */}
                                </div>
                                <div className="text-text-color p-2 rounded-[10px] flex-center gap-7">
                                  <span className="font-sans text-[16px] font-semibold text-text-color">
                                    {renderDate(data)}
                                  </span>
                                  <span>{renderPoints(data)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show "No data found" message
                        <div className="w-full">
                          <p className="text-center">{t("no_data_found")}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="lose" title={t("lose")}>
                      {isLoading ? (
                        // Show skeleton loading
                        <div className="w-full">
                          <Skeleton height={20} count={5} className="skeleton"/>
                        </div>
                      ) : loseData?.length > 0 ? (
                        loseData.map((data, index) => (
                          <div className="w-full" key={index}>
                            <div className="p-[10px] mb-[25px] border-b border-black/10 dark:border-[#FFFFFF29]">
                              <div className="flex justify-between items-center max-575:flex-col max-575:items-start ">
                                <div className="font-bold">
                                  <p className="text-text-color font-sans text-[16px] font-medium capitalize">
                                    <strong className="!text-black dark:!text-white">
                                      {t(data.type)}
                                    </strong>
                                  </p>
                                  {/* <span>{renderDate(data)}</span> */}
                                </div>
                                <div className="text-text-color p-2 rounded-[10px] flex-center gap-7">
                                  <span className="font-sans text-[16px] font-semibold text-text-color">
                                    {renderDate(data)}
                                  </span>
                                  <span>{renderPoints(data)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show "No data found" message
                        <div className="w-full">
                          <p className="text-center">{t("no_data_found")}</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {activeTab === "all" && total > 9 ? (
                    <ReactPaginate
                      initialPage={allCurrentPage}
                      previousLabel={<FaArrowLeft />}
                      nextLabel={<FaArrowRight />}
                      pageCount={Math.ceil(total / dataPerPage)}
                      onPageChange={(selectedPage) =>
                        handlePageChange(selectedPage, activeTab)
                      }
                      containerClassName="flex-center font-sans pl-0 [&>li]:relative [&>li]:block [&>li]:px-[6px] [&>li]:text-center [&>li]:leading-[45px] [&>li]:m-[0_5px] [&>li]:text-[var(--text-color)] [&>li]:text-[18px] [&>li]:font-bold [&>li]:rounded-[5px] [&>li]:transition-all [&>li]:duration-500 [&>li]:ease-out;"
                      previousLinkClassName=" !relative block px-[6px] text-center leading-[45px] mx-[5px] text-text-color text-[18px] font-bold rounded-[5px] transition-all duration-500 ease-out"
                      nextLinkClassName="relative block px-[6px] text-center leading-[45px] mx-[5px] text-text-color text-[18px] font-bold rounded-[5px] transition-all duration-500 ease-out"
                      disabledClassName="[&>a]:!cursor-not-allowed !bg-transparent [&>a]:!text-[#c6c6c6] hover:text-text-color"
                      activeClassName="text-text-color !font-bold"
                    />
                  ) : null}

                  {activeTab === "income" && incometotal > 9 ? (
                    <ReactPaginate
                      initialPage={incomeCurrentPage}
                      previousLabel={<FaArrowLeft />}
                      nextLabel={<FaArrowRight />}
                      pageCount={Math.ceil(incometotal / dataPerPage)}
                      onPageChange={(selectedPage) =>
                        handlePageChange(selectedPage, activeTab)
                      }
                      containerClassName="flex-center font-sans pl-0 [&>li]:relative [&>li]:block [&>li]:px-[6px] [&>li]:text-center [&>li]:leading-[45px] [&>li]:m-[0_5px] [&>li]:text-[var(--text-color)] [&>li]:text-[18px] [&>li]:font-bold [&>li]:rounded-[5px] [&>li]:transition-all [&>li]:duration-500 [&>li]:ease-out;"
                      previousLinkClassName=" !relative block px-[6px] text-center leading-[45px] mx-[5px] text-text-color text-[18px] font-bold rounded-[5px] transition-all duration-500 ease-out"
                      nextLinkClassName="relative block px-[6px] text-center leading-[45px] mx-[5px] text-text-color text-[18px] font-bold rounded-[5px] transition-all duration-500 ease-out"
                      disabledClassName="[&>a]:!cursor-not-allowed !bg-transparent [&>a]:!text-[#c6c6c6] hover:text-text-color"
                      activeClassName="text-text-color !font-bold "
                    />
                  ) : null}

                  {activeTab === "lose" && losetotal > 9 ? (
                    <ReactPaginate
                      initialPage={loseCurrentPage}
                      previousLabel={<FaArrowLeft />}
                      nextLabel={<FaArrowRight />}
                      pageCount={Math.ceil(losetotal / dataPerPage)}
                      onPageChange={(selectedPage) =>
                        handlePageChange(selectedPage, activeTab)
                      }
                      containerClassName="flex-center font-sans pl-0 [&>li]:relative [&>li]:block [&>li]:px-[6px] [&>li]:text-center [&>li]:leading-[45px] [&>li]:m-[0_5px] [&>li]:text-[var(--text-color)] [&>li]:text-[18px] [&>li]:font-bold [&>li]:rounded-[5px] [&>li]:transition-all [&>li]:duration-500 [&>li]:ease-out;"
                      previousLinkClassName=" !relative block px-[6px] text-center leading-[45px] mx-[5px] text-text-color text-[18px] font-bold rounded-[5px] transition-all duration-500 ease-out"
                      nextLinkClassName="relative block px-[6px] text-center leading-[45px] mx-[5px] text-text-color text-[18px] font-bold rounded-[5px] transition-all duration-500 ease-out"
                      disabledClassName="[&>a]:!cursor-not-allowed !bg-transparent [&>a]:!text-[#c6c6c6] hover:text-text-color"
                      activeClassName="text-text-color !font-bold "
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default withTranslation()(CoinHistory);
