"use client";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { withTranslation } from "react-i18next";
import { getImageSource, imgError, truncate } from "@/utils";
import dynamic from "next/dynamic";
import FormattedNumberData from "@/components/FormatNumber/FormatedNumberData";
import { t } from "@/utils";
import LeftTabProfile from "@/components/Profile/LeftTabProfile";
import {
  getDailyLeaderBoardApi,
  getGlobleLeaderBoardApi,
  getMonthlyLeaderBoardApi,
} from "@/api/apiRoutes";
import ThemeSvg from "@/components/ThemeSvg";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});
import userImg from "@/assets/images/user.svg";
const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState({
    my_rank: "",
    other_users_rank: "",
    total: "",
  });
  const [category, setCategory] = useState("Daily");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [showleaderboard, setShowleaderboard] = useState();
  const [getWidthData, setWidthData] = useState("");
  const [topRankers, setTopRankers] = useState([]);

  const myElementRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedData, setDisplayedData] = useState([]);
  console.log("displayedData", displayedData);

  const shouldSliceData = getWidthData >= 768;

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
          {row.profile ? (
            <img
              src={getImageSource(row.profile)}
              className="rounded-full object-cover w-[60px] h-[60px] border-2 border-gray-200"
              alt={row.name}
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

  const getDailyLeaderBoard = async (offset, limit) => {
    setLoading(true);

    const response = await getDailyLeaderBoardApi({
      offset: offset,
      limit: limit,
    });

    if (!response?.error) {
      if (offset === 0) {
        setTopRankers(response?.data?.top_three_ranks);
        setTableData(
          response.data,
          response?.data?.my_rank,
          response.data.other_users_rank,
          response.total,
        );

        // Set initial displayed data
        const initialData = shouldSliceData
          ? response.data.other_users_rank.filter(
              (user) => ![1, 2, 3].includes(parseInt(user.user_rank, 10)),
            )
          : response.data.other_users_rank;
        setDisplayedData(initialData);
        console.log("iiiiiiiiiiiiiiiiiiiiiiii", initialData);

        // If initial data is less than the limit, there are likely no more items to load
        if (response.data.other_users_rank.length < limit) {
          setHasMore(false);
        }
      } else {
        // Load more - append data
        const newData = response.data.other_users_rank;

        // Check if we have any data to add
        if (newData.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        } else {
          // Check if we've reached the total number of records
          if (
            leaderBoard.other_users_rank.length + newData.length >=
            leaderBoard.total
          ) {
            setHasMore(false);
          }

          // Filter out any duplicate ranks that might already exist in our data
          const existingRanks = leaderBoard.other_users_rank.map((user) =>
            parseInt(user.user_rank, 10),
          );

          const uniqueNewData = newData.filter(
            (user) => !existingRanks.includes(parseInt(user.user_rank, 10)),
          );

          if (uniqueNewData.length === 0) {
            setHasMore(false);
            setLoading(false);
            return;
          }

          // If we got fewer items than the limit, there are likely no more items to load
          if (uniqueNewData.length < limit) {
            setHasMore(false);
          }

          // Update leaderboard data with new unique data
          const updatedData = [
            ...leaderBoard.other_users_rank,
            ...uniqueNewData,
          ];
          setLeaderBoard((prev) => ({
            ...prev,
            other_users_rank: updatedData,
          }));

          // Update displayed data
          setDisplayedData((prev) => [...prev, ...uniqueNewData]);
          console.log(11);
        }
      }
      setLoading(false);
    }

    if (response.error || response.total === 0) {
      setLoading(false);
      setHasMore(false);
    }
  };

  const getMonthlyLeaderBoard = async (offset, limit) => {
    setLoading(true);

    const response = await getMonthlyLeaderBoardApi({
      offset: offset,
      limit: limit,
    });

    if (!response?.error) {
      if (offset === 0) {
        // Initial load
        setTopRankers(response?.data.top_three_ranks);
        setTableData(
          response.data,
          response.data.my_rank,
          response.data.other_users_rank,
          response.total,
        );

        // Set initial displayed data
        const initialData = shouldSliceData
          ? response.data.other_users_rank.filter(
              (user) => ![1, 2, 3].includes(parseInt(user.user_rank, 10)),
            )
          : response.data.other_users_rank;
        setDisplayedData(initialData);

        // If initial data is less than the limit, there are likely no more items to load
        if (response.data.other_users_rank.length < limit) {
          setHasMore(false);
        }
      } else {
        // Load more - append data
        const newData = response.data.other_users_rank;

        // Check if we have any data to add
        if (newData.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        } else {
          // Check if we've reached the total number of records
          if (
            leaderBoard.other_users_rank.length + newData.length >=
            leaderBoard.total
          ) {
            setHasMore(false);
          }

          // Filter out any duplicate ranks that might already exist in our data
          const existingRanks = leaderBoard.other_users_rank.map((user) =>
            parseInt(user.user_rank, 10),
          );

          const uniqueNewData = newData.filter(
            (user) => !existingRanks.includes(parseInt(user.user_rank, 10)),
          );

          if (uniqueNewData.length === 0) {
            setHasMore(false);
            setLoading(false);
            return;
          }

          // If we got fewer items than the limit, there are likely no more items to load
          if (uniqueNewData.length < limit) {
            setHasMore(false);
          }

          // Update leaderboard data with new unique data
          const updatedData = [
            ...leaderBoard.other_users_rank,
            ...uniqueNewData,
          ];
          setLeaderBoard((prev) => ({
            ...prev,
            other_users_rank: updatedData,
          }));

          // Update displayed data
          setDisplayedData((prev) => [...prev, ...uniqueNewData]);
        }
      }
      setLoading(false);
    }

    if (response.error || response.total === 0) {
      setLoading(false);
      setHasMore(false);
    }
  };

  const getGlobleLeaderBoard = async (offset, limit) => {
    setLoading(true);

    const response = await getGlobleLeaderBoardApi({
      offset: offset,
      limit: limit,
    });

    if (!response?.error) {
      if (offset === 0) {
        // Initial load
        setTopRankers(response?.data?.top_three_ranks);
        setTableData(
          response.data,
          response.data.my_rank,
          response.data.other_users_rank,
          response.total,
        );

        // Set initial displayed data
        const initialData = shouldSliceData
          ? response.data.other_users_rank.filter(
              (user) => ![1, 2, 3].includes(parseInt(user.user_rank, 10)),
            )
          : response.data.other_users_rank;
        setDisplayedData(initialData);

        // If initial data is less than the limit, there are likely no more items to load
        if (response.data.other_users_rank.length < limit) {
          setHasMore(false);
        }
      } else {
        // Load more - append data
        const newData = response.data.other_users_rank;

        // Check if we have any data to add
        if (newData.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        } else {
          // Check if we've reached the total number of records
          if (
            leaderBoard.other_users_rank.length + newData.length >=
            leaderBoard.total
          ) {
            setHasMore(false);
          }

          // Filter out any duplicate ranks that might already exist in our data
          const existingRanks = leaderBoard.other_users_rank.map((user) =>
            parseInt(user.user_rank, 10),
          );

          const uniqueNewData = newData.filter(
            (user) => !existingRanks.includes(parseInt(user.user_rank, 10)),
          );

          if (uniqueNewData.length === 0) {
            setHasMore(false);
            setLoading(false);
            return;
          }

          // If we got fewer items than the limit, there are likely no more items to load
          if (uniqueNewData.length < limit) {
            setHasMore(false);
          }

          // Update leaderboard data with new unique data
          const updatedData = [
            ...leaderBoard.other_users_rank,
            ...uniqueNewData,
          ];
          setLeaderBoard((prev) => ({
            ...prev,
            other_users_rank: updatedData,
          }));

          // Update displayed data
          setDisplayedData((prev) => [...prev, ...uniqueNewData]);
        }
      }
      setLoading(false);
    }

    if (response.error || response.total === 0) {
      setLoading(false);
      setHasMore(false);
    }
  };

  const fetchData = (category, limit, offset, isLoadMore = false) => {
    limit = limit ? limit : 10;
    offset = offset ? offset : 0;

    if (!isLoadMore) {
      // Reset states for new category
      setDisplayedData([]);
      setHasMore(true);
    }

    // If we're already loading, don't trigger another load
    if (loading && isLoadMore) return;

    if (category === "Daily") {
      getDailyLeaderBoard(offset, limit);
    } else if (category === "Monthly") {
      getMonthlyLeaderBoard(offset, limit);
    } else {
      getGlobleLeaderBoard(offset, limit);
    }
  };

  const checkLeaderboardData = () => {
    const otherUsersRank = leaderBoard?.other_users_rank;
    if (otherUsersRank && otherUsersRank?.length > 0) {
      setShowleaderboard(true);
    } else {
      setShowleaderboard(false);
    }
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
    setLimit(10);
    setOffset(0);
    fetchData(category, 10, 0);
  };

  const loadMore = () => {
    // If we're already loading, don't trigger another load
    if (loading) return;

    // Calculate the correct offset based on current data length
    // We need to use the actual rank of the last item to ensure we get the next set of ranks
    const lastRank =
      leaderBoard.other_users_rank.length > 0
        ? parseInt(
            leaderBoard.other_users_rank[
              leaderBoard.other_users_rank.length - 1
            ].user_rank,
            10,
          )
        : 0;

    // Use the last rank as the offset to get the next set of ranks
    const newOffset = lastRank;
    setOffset(newOffset);
    fetchData(category, limit, newOffset, true);
  };

  useEffect(() => {
    checkLeaderboardData();
  }, [leaderBoard]);

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

  useEffect(() => {
    // Update displayed data when screen size changes
    // Only update if we have actual data (not empty string or empty array)
    if (
      leaderBoard.other_users_rank &&
      Array.isArray(leaderBoard.other_users_rank) &&
      leaderBoard.other_users_rank.length > 0 &&
      offset === 0 &&
      getWidthData !== "" // Only run after width is determined
    ) {
      const newDisplayedData = shouldSliceData
        ? leaderBoard.other_users_rank.filter(
            (user) => ![1, 2, 3].includes(parseInt(user.user_rank, 10)),
          )
        : leaderBoard.other_users_rank;
      setDisplayedData(newDisplayedData);
    }
  }, [shouldSliceData]);

  useEffect(() => {
    getDailyLeaderBoard(0, 10);
  }, []);

  const setTableData = (totaldata, myRank, otherusers_rank, allData) => {
    const topThreeRanks = totaldata.top_three_ranks;
    const filteredOtherUsersRank = totaldata.other_users_rank
      .filter((user) => ![1, 2, 3].includes(parseInt(user.user_rank, 10)))
      .concat(topThreeRanks.slice(3)); // Append users starting from index 4
    setLeaderBoard({
      my_rank: myRank,
      other_users_rank: !shouldSliceData
        ? otherusers_rank
        : filteredOtherUsersRank,
      total: allData,
    });
  };

  return (
    <div ref={myElementRef}>
      <Layout>
        <div className="container px-1 my-14">
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
              <div className="flex flex-wrap relative justify-evenly gap-5">
                <div className="h-max w-full xl:w-1/4 lg:w-2/3 md:w-full">
                  <div className="darkSecondaryColor flex flex-col min-w-0 break-words  rounded-[16px] bg-[var(--background-2)] border border-[#f5f5f5] dark:border-[#ffffff1a] dark:border-[2px] relative">
                    <LeftTabProfile />
                  </div>
                </div>
                <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] bg-transparent !m-0 !p-0">
                  <div
                    className={
                      topRankers.length !== 0
                        ? "max-767:mt-0 mt-36 pb-16 relative"
                        : "noLeaderboardData"
                    }
                  >
                    <div className="container mb-2">
                      {topRankers.length !== 0 && (
                        <div className="w-full max-767:hidden mb-[-37px]">
                          <div className="flex-center">
                            <ul className="flex-center gap-3 w-full">
                              {/* third winner */}
                              {topRankers &&
                                topRankers.slice(1, 2).map((data, index) => {
                                  return (
                                    <div
                                      className="max-991:w-[30%]  bg-gradient-to-b from-[#fca702] to-[rgba(252,167,2,0)] relative h-[150px] w-[210px] rounded-t-[16px]"
                                      key={index}
                                    >
                                      <li className="list-none text-center mt-[-50px] relative ">
                                        <div className="flex-center">
                                          {data?.profile ? (
                                            <img
                                              className="w-[100px] h-[100px] rounded-full relative object-cover bg-white border-4 border-white dark:border-[#150e33]"
                                              src={getImageSource(
                                                data?.profile,
                                              )}
                                              alt="second"
                                              onError={imgError}
                                            />
                                          ) : (
                                            <ThemeSvg
                                              src={userImg.src}
                                              className="!w-[100px] !h-[100px] rounded-full relative object-cover bg-white border-4 border-white"
                                              alt="User"
                                              colorMap={{
                                                "#e13975":
                                                  "var(--primary-color)",
                                                "#6d1d50":
                                                  "var(--secondary-color)",
                                                "#f7ccdd":
                                                  "var(--primary-light)",
                                                "url(#linear-gradient)":
                                                  "var(--primary-color)",
                                                "linear-gradient":
                                                  "var(--primary-color)",
                                              }}
                                            />
                                          )}
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
                              {topRankers &&
                                topRankers.slice(0, 1).map((data, index) => {
                                  return (
                                    <div
                                      className=" max-991:w-[30%]  bg-gradient-to-b from-[#ef83aa] to-[rgba(252,167,2,0)] relative h-[180px] w-[210px] rounded-t-[16px] mt-[-43px]"
                                      key={index}
                                    >
                                      <li className="list-none text-center mt-[-50px] relative">
                                        <div className="flex-center">
                                          {data?.profile ? (
                                            <img
                                              className="w-[100px] h-[100px] rounded-full relative object-cover bg-white border-4 border-white dark:border-[#150e33]"
                                              src={getImageSource(
                                                data?.profile,
                                              )}
                                              alt="second"
                                              onError={imgError}
                                            />
                                          ) : (
                                            <ThemeSvg
                                              src={userImg.src}
                                              className="!w-[100px] !h-[100px] rounded-full relative object-cover bg-white border-4 border-white"
                                              alt="User"
                                              colorMap={{
                                                "#e13975":
                                                  "var(--primary-color)",
                                                "#6d1d50":
                                                  "var(--secondary-color)",
                                                "#f7ccdd":
                                                  "var(--primary-light)",
                                                "url(#linear-gradient)":
                                                  "var(--primary-color)",
                                                "linear-gradient":
                                                  "var(--primary-color)",
                                              }}
                                            />
                                          )}
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
                              {topRankers &&
                                topRankers.slice(2, 3).map((data, index) => {
                                  return (
                                    <div
                                      className="max-991:w-[30%]  bg-gradient-to-b from-[#43e8ff] to-[rgba(252,167,2,0)] relative mb-[-20px] h-[120px] w-[210px] rounded-t-[16px]"
                                      key={index}
                                    >
                                      <li className="list-none text-center mt-[-50px] relative">
                                        <div className="flex-center">
                                          {data?.profile ? (
                                            <img
                                              className="w-[100px] h-[100px] rounded-full relative object-cover bg-white border-4 border-white dark:border-[#150e33]"
                                              src={getImageSource(
                                                data?.profile,
                                              )}
                                              alt="second"
                                              onError={imgError}
                                            />
                                          ) : (
                                            <ThemeSvg
                                              src={userImg.src}
                                              className="!w-[100px] !h-[100px] rounded-full relative object-cover bg-white border-4 border-white"
                                              alt="User"
                                              colorMap={{
                                                "#e13975":
                                                  "var(--primary-color)",
                                                "#6d1d50":
                                                  "var(--secondary-color)",
                                                "#f7ccdd":
                                                  "var(--primary-light)",
                                                "url(#linear-gradient)":
                                                  "var(--primary-color)",
                                                "linear-gradient":
                                                  "var(--primary-color)",
                                              }}
                                            />
                                          )}
                                        </div>
                                        <h5 className="text-[#212121] dark:text-white">
                                          {truncate(data?.name, 17)}
                                        </h5>
                                        <p className="text-[#212121] dark:text-white">
                                          {data?.score}
                                        </p>
                                        <span className="absolute top-[-54%] right-[70px] bg-transparent text-[75px] font-black opacity-15 text-[#090029] dark:text-[#FFFFFF] p-[5px_11px] rounded-[30px] z-[-1] max-1200:top-[-48%] max-1200:right-[54px]">
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
                        <div className="w-full ">
                          <div className="mt-3 ">
                            <div className="flex-center mb-12 py-2 rounded-full  ">
                              <div className=" flex-center w-1/3">
                                <span
                                  className={`p-[15px_50px] rounded-[48px] text-center text-text-color font-sans text-[18px] font-bold leading-[16px] cursor-pointer max-575:p-[10px_20px] max-575:text-[14px] ${
                                    category === "Global"
                                      ? "bg-[#d5d3da] dark:bg-[#FFFFFF29] dark:text-white"
                                      : ""
                                  }`}
                                  onClick={() => handleCategoryChange("Global")}
                                >{`${t("all")} ${t("time")} `}</span>
                              </div>
                              <div className="flex-center w-1/3">
                                <span
                                  className={`p-[15px_50px] rounded-[48px] text-center text-text-color font-sans text-[18px] font-bold leading-[16px] cursor-pointer max-575:p-[10px_20px] max-575:text-[14px] ${
                                    category === "Monthly"
                                      ? "bg-[#d5d3da] dark:bg-[#FFFFFF29] dark:text-white"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleCategoryChange("Monthly")
                                  }
                                >
                                  {t("monthly")}
                                </span>
                              </div>
                              <div className="flex-center w-1/3">
                                <span
                                  className={`p-[15px_50px] rounded-[48px] text-center text-text-color font-sans text-[18px] font-bold leading-[16px] cursor-pointer max-575:p-[10px_20px] max-575:text-[14px] ${
                                    category === "Daily"
                                      ? "bg-[#d5d3da] dark:bg-[#FFFFFF29] dark:text-white"
                                      : ""
                                  }`}
                                  onClick={() => handleCategoryChange("Daily")}
                                >
                                  {t("today")}
                                </span>
                              </div>
                            </div>
                          </div>
                          {leaderBoard.total !== "0" ? (
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
                                      className="bg-[var(--primary-color)] text-white font-bold py-2 px-6 rounded-full transition-all duration-300 disabled:opacity-50"
                                    >
                                      {loading
                                        ? t("loading") + "..."
                                        : t("load_more")}
                                    </button>
                                  </div>
                                )}
                            </>
                          ) : (
                            <dev className="flex-center mb-24 text-text-color">
                              {t("no_records")}
                            </dev>
                          )}
                          {/* my rank show */}
                          {leaderBoard.my_rank.name && (
                            <table className="bg-[var(--background-2)] darkSecondaryColor rounded-t-[10px] !rounded-tr-[10px] !rounded-tl-[10px] py-2.5 w-full mx-auto border-collapse text-sm">
                              <thead>
                                <tr>
                                  <th className="!p-[8px_16px] text-center max-575:p-1">
                                    {t("my_rank")}{" "}
                                  </th>
                                  <th className="!p-[8px_16px] text-center  max-575:p-1">
                                    {t("profile")}
                                  </th>
                                  <th className="!p-[8px_16px] text-center  max-575:p-1">
                                    {t("player")}
                                  </th>
                                  <th className="!p-[8px_16px] text-center  max-575:p-1">
                                    {t("score")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="!p-[8px_16px] text-center  max-575:p-1 w-[25%]">
                                    <strong>
                                      {leaderBoard.my_rank.user_rank}
                                    </strong>
                                  </td>
                                  <td className="!p-[8px_16px] flex justify-start items-center  max-575:p-1">
                                    <img
                                      className="rounded-full object-cover w-[60px] h-[60px] border-2 border-gray-200"
                                      src={getImageSource(
                                        leaderBoard.my_rank.profile,
                                      )}
                                      alt="Profile"
                                      onError={imgError}
                                    />
                                  </td>
                                  <td className="!p-[8px_16px] text-center  max-575:p-1 w-[25%]">
                                    <strong>
                                      {leaderBoard.my_rank.name ||
                                        leaderBoard.my_rank.email}
                                    </strong>
                                  </td>
                                  <td className="!p-[8px_16px] text-center  max-575:p-1 w-[25%]">
                                    <strong>
                                      <FormattedNumberData
                                        value={leaderBoard.my_rank.score}
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
export default withTranslation()(LeaderBoard);
