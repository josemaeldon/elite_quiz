"use client";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { withTranslation } from "react-i18next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import { contestleaderboard } from "@/store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import { getImageSource, imgError, truncate } from "@/utils";
import ResizeObserver from "resize-observer-polyfill";
import dynamic from "next/dynamic";
import FormattedNumberData from "@/components/FormatNumber/FormatedNumberData";
import { t } from "@/utils";
import { getContestLeaderboardApi } from "@/api/apiRoutes";
import { useRouter } from "next/navigation";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const ContestLeaderBoard = () => {


  let getData = useSelector(contestleaderboard);

  const [leaderBoard, setLeaderBoard] = useState({
    myRank: "",
    data: "",
    total: "",
  });
  const [showleaderboard, setShowleaderboard] = useState();
  const [getWidthData, setWidthData] = useState("");
  const [topRankers, setTopRankers] = useState([]);
  const myElementRef = useRef(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedData, setDisplayedData] = useState([]);

  const shouldSliceData = getWidthData >= 768;
  const router = useRouter();

  const columns = [
    {
      name: t("rank"),
      selector: (row) => {
        const value = row.user_rank;
        return (
          <div className="w-10 flex-center">
            {typeof value === "string" ? parseInt(value, 10) : value}
          </div>
        );
      },
      sortable: false,
    },
    {
      name: t("profile"),
      selector: (row) => (
        <div className="h-[80px] flex justify-center items-center">
          <img
            src={getImageSource(row.profile)}
            className="rounded-full object-cover w-[60px] h-[60px] border-2 border-gray-200"
            alt={row.name}
            onError={imgError}
          />
        </div>
      ),
      sortable: false,
    },
    {
      name: t("player"),
      selector: (row) => `${row.name}`,
      sortable: false,
    },
    {
      name: t("score"),
      selector: (row) => <FormattedNumberData value={row.score} />,
    },
  ];

  const fetchLeaderboardData = async(offset, limit) => {
    setLoading(true);
    const response = await getContestLeaderboardApi({
      contest_id: getData.past_id,
      offset: offset,
      limit: limit,
    })

    if (!response?.error) {
      if (offset === 0) {
        // Initial load
        setTableData(response, response.total);
        setTopRankers(response.data.slice(0, 3));

        // Set initial displayed data
        const initialData = shouldSliceData
          ? response.data.slice(3)
          : response.data;
        setDisplayedData(initialData);

        // If initial data is less than the limit, there are likely no more items to load
        if (response.data.length < limit) {
          setHasMore(false);
        }
      } else {
        // Load more - append data
        const newData = response.data;
        if (newData.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        } else {
          // Check if we've reached the total number of records
          if (leaderBoard.data.length + newData.length >= leaderBoard.total) {
            setHasMore(false);
          }

          // If we got fewer items than the limit, there are likely no more items to load
          if (newData.length < limit) {
            setHasMore(false);
          }

          // Update leaderboard data with new data
          const updatedData = [...leaderBoard.data, ...newData];
          setLeaderBoard((prev) => ({
            ...prev,
            data: updatedData,
          }));

          // Update displayed data
          const additionalData = shouldSliceData ? newData : newData;
          setDisplayedData((prev) => [...prev, ...additionalData]);
        }
      }
      setLoading(false);
    }

    if(response.error) {
      toast.error(t("no_data_found"));
        console.log(response);
        setLoading(false);
        setHasMore(false);
    }
  };

  const loadMore = () => {
    // If we're already loading, don't trigger another load
    if (loading) return;

    // Calculate the correct offset based on current data length
    const newOffset = leaderBoard.data.length;
    setOffset(newOffset);
    fetchLeaderboardData(newOffset, limit);
  };

  useEffect(() => {
    // Initial data load
    fetchLeaderboardData(0, limit);
  }, []);


  const setTableData = (data, total) => {
    setLeaderBoard({ myRank: data.my_rank, data: data.data, total: total });
  };

  const checkLeaderboardData = () => {
    const otherUsersRank = leaderBoard?.data;
    if (otherUsersRank && otherUsersRank?.length > 0) {
      setShowleaderboard(true);
    } else {
      setShowleaderboard(false);
    }
  };

  useEffect(() => {
    checkLeaderboardData();
  }, [leaderBoard]);

  useEffect(() => {
    // Update displayed data when leaderBoard.data changes
    if (leaderBoard.data && leaderBoard.data.length > 0) {
      // For initial load or when screen size changes
      if (offset === 0 || displayedData.length === 0) {
        const newDisplayedData = shouldSliceData
          ? leaderBoard.data.slice(3)
          : leaderBoard.data;
        setDisplayedData(newDisplayedData);
      }
      // We don't need an else case here because we're handling the append in fetchLeaderboardData
    }
  }, [leaderBoard.data, shouldSliceData]);



  useEffect(() => {
    const observeElement = myElementRef.current;

    if (observeElement) {
      // Create a new ResizeObserver
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // Access the new width of the observed element
          const newWidth = entry.contentRect.width;
          setWidthData(newWidth);
        }
      });

      // Start observing the element
      resizeObserver.observe(observeElement);

      // Cleanup function to disconnect the observer when the component unmounts
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [shouldSliceData]);

  const goBack = () => {
    router.push("/contest-play");
  }

  return (
    <div ref={myElementRef}>
      <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("leaderboard")}
        content={t("home")}
        contentTwo={t("quiz_play")}
        contentThree={t("contest_play")}
        contentFour={t("leaderboard")}
      />
        <div className="container px-1 mb-14">
          <div className="">
            <div className="">
              <div
                className={
                  showleaderboard === true
                    ? "mt-36 pb-16 relative"
                    : "noLeaderboardData"
                }
              >
                <div className="container mb-2">
                {showleaderboard && (
                      <div className="w-full max-767:hidden">
                        <div className="flex-center">
                          <ul className="flex-center gap-3 w-full mb-[-37px]">
                            {/* third winner */}
                            {leaderBoard.data &&
                              leaderBoard.data
                                .slice(1, 2)
                                .map((data, index) => {
                                  return (
                                    <div
                                      className="max-991:w-[30%] bg-gradient-to-b from-[#fca702] to-[rgba(252,167,2,0)] relative h-[150px] w-[210px] rounded-t-[16px]"
                                      key={index}
                                    >
                                      <li className="list-none text-center mt-[-50px] relative ">
                                        <div className="flex-center">
                                          <img
                                            className="w-[100px] h-[100px] rounded-full relative object-cover bg-white border-4 border-white dark:border-[#150e33]"
                                            src={getImageSource(data?.profile)}
                                            alt="third"
                                            onError={imgError}
                                          />
                                        </div>

                                        <h5 className="text-[#212121] dark:text-white">
                                          {truncate(data?.name, 17)}
                                        </h5>
                                        <p className="text-[#212121] dark:text-white">
                                          {data?.score}
                                        </p>
                                        <span className="absolute top-[-54%] right-[70px] bg-transparent text-[75px] font-black opacity-15 text-[#090029] dark:text-[#FFFFFF] p-[5px_11px] rounded-[30px] z-[-1] max-1200:top-[-48%] max-1200:right-[54px]">
                                          2
                                        </span>
                                      </li>
                                    </div>
                                  );
                                })}

                            {/* first winner */}
                            {leaderBoard.data &&
                              leaderBoard.data
                                .slice(0, 1)
                                .map((data, index) => {
                                  return (
                                    <div
                                      className="max-991:w-[30%] bg-gradient-to-b from-[#ef83aa] to-[rgba(252,167,2,0)] relative h-[180px] w-[210px] rounded-t-[16px] mt-[-43px]"
                                      key={index}
                                    >
                                      <li className="list-none text-center mt-[-50px] relative">
                                        <div className="flex-center">
                                          <img
                                            className="w-[100px] h-[100px] rounded-full relative object-cover bg-white border-4 border-white dark:border-[#150e33]"
                                            src={getImageSource(data?.profile)}
                                            alt="first"
                                            onError={imgError}
                                          />
                                        </div>
                                        <h5 className="text-[#212121] dark:text-white">
                                          {truncate(data?.name, 17)}
                                        </h5>
                                        <p className="text-[#212121] dark:text-white">
                                          {data?.score}
                                        </p>
                                        <span className="absolute top-[-54%] right-[76px] bg-transparent text-[75px] font-black opacity-15 text-[#090029] dark:text-[#FFFFFF] p-[5px_11px] rounded-[30px] z-[-1] max-1200:top-[-48%] max-1200:right-[54px]">
                                          1
                                        </span>
                                      </li>
                                    </div>
                                  );
                                })}

                            {/* second winner */}
                            {leaderBoard.data &&
                              leaderBoard.data
                                .slice(2, 3)
                                .map((data, index) => {
                                  return (
                                    <div
                                      className="max-991:w-[30%] bg-gradient-to-b from-[#43e8ff] to-[rgba(252,167,2,0)] relative mb-[-20px] h-[120px] w-[210px] rounded-t-[16px]"
                                      key={index}
                                    >
                                      <li className="list-none text-center mt-[-50px] relative">
                                        <div className="flex-center">
                                          <img
                                            className="w-[100px] h-[100px] rounded-full relative object-cover bg-white border-4 border-white dark:border-[#150e33]"
                                            src={getImageSource(data?.profile)}
                                            alt="second"
                                            onError={imgError}
                                          />
                                        </div>
                                        <h5 className="text-[#212121] dark:text-white">
                                          {truncate(data?.name, 17)}
                                        </h5>
                                        <p className="text-[#212121] dark:text-white">
                                          {data?.score}
                                        </p>
                                        <span className="absolute top-[-54%] right-[76px] bg-transparent text-[75px] font-black opacity-15 text-[#090029] dark:text-[#FFFFFF] p-[5px_11px] rounded-[30px] z-[-1] max-1200:top-[-48%] max-1200:right-[54px]">
                                          3
                                        </span>
                                      </li>
                                    </div>
                                  );
                                })}
                          </ul>
                        </div>
                      </div>
                    )}
                  <div className="morphisam !pb-0 darkSecondaryColor">
                    
                    <div className="w-full">
                      <div className="mt-3">
                        {leaderBoard.total !== "0" && (
                          <>
                            <DataTable
                              title=""
                              columns={columns}
                              data={displayedData}
                              pagination={false}
                              highlightOnHover
                              noDataComponent={t("no_records")}
                              className="dt-center rankTableData"
                            />

                            {/* Load More Button */}
                            {hasMore &&
                              displayedData.length > 0 &&
                              !loading && (
                                <div className="flex justify-center mt-6 mb-4">
                                  <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="bg-[var(--primary-color)]  text-white font-bold py-2 px-6 rounded-full transition-all duration-300 disabled:opacity-50 shadowBtn"
                                  >
                                    {loading
                                      ? t("loading") + "..."
                                      : t("load_more")}
                                  </button>
                                </div>
                              )}
                          </>
                        )}

                        {/* my rank show */}
                        {leaderBoard.myRank && (
                          <table className="bg-[var(--background-2)] darkSecondaryColor rounded-t-[10px] !rounded-tr-[10px] !rounded-tl-[10px] py-2.5 w-full mx-auto border-collapse text-sm">
                            <thead>
                              <tr>
                                <th className="!p-[8px_16px] text-center max-575:p-1">
                                  {t("my_rank")}{" "}
                                </th>
                                <th className="!p-[8px_16px] text-center max-575:p-1">
                                  {t("profile")}
                                </th>
                                <th className="!p-[8px_16px] text-center max-575:p-1">
                                  {t("player")}
                                </th>
                                <th className="!p-[8px_16px] text-center max-575:p-1">
                                  {t("score")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="!p-[8px_16px] text-center  max-575:p-1 w-[25%]">
                                  <strong>
                                    {leaderBoard.myRank.user_rank}
                                  </strong>
                                </td>
                                <td className="!p-[8px_16px] flex justify-start items-center  max-575:p-1">
                                  <img
                                    className="rounded-full object-cover w-[60px] h-[60px] border-2 border-gray-200"
                                    src={getImageSource(leaderBoard.myRank.profile)}
                                    alt="Profile"
                                    onError={imgError}
                                  />
                                </td>
                                <td className="!p-[8px_16px] text-center  max-575:p-1 w-[25%]">
                                  <strong>
                                    {leaderBoard.myRank.name ||
                                      leaderBoard.myRank.email}
                                  </strong>
                                </td>
                                <td className="!p-[8px_16px] text-center  max-575:p-1 w-[25%]">
                                  <strong>
                                    <FormattedNumberData
                                      value={leaderBoard.myRank.score}
                                    />
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                    <div className="flex justify-center items-center">
                      <button onClick={goBack} className="mt-5 bg-primary-color text-white font-bold py-2 px-10 rounded-full transition-all duration-300 disabled:opacity-50 shadowBtn">
                        {t("back")}
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
export default withTranslation()(ContestLeaderBoard);
