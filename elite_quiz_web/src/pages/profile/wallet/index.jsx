"use client";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { getImageSource, t } from "@/utils";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
// import { Modal } from 'antd'
import Skeleton from "react-loading-skeleton";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import coinimg from "@/assets/images/coin.svg";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import Layout from "@/components/Layout/Layout";
import LeftTabProfile from "@/components/Profile/LeftTabProfile";
import paypal from "@/assets/images/Paypal.svg";
import paytm from "@/assets/images/Paytm.svg";
import stripe from "@/assets/images/Stripe.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  deletePendingPaymentRequestApi,
  getPaymentRequestApi,
  getUserCoinsApi,
  setPaymentRequestApi,
} from "@/api/apiRoutes";
import { errorCodeCanNotMakeRequest } from "@/api/apiEndPoints";
import Breadcrumb from "@/components/Common/Breadcrumb";

const Wallet = () => {
  // payment modal
  const [modal, setModal] = useState(false);

  const [activeTab, setActiveTab] = useState("all");

  const [inputId, setInputId] = useState([]);

  const [walletvalue, setWalletValue] = useState("");

  const [redeemInput, setRedeemInput] = useState(0);

  const [paymentData, setPaymentData] = useState([]);

  const [totalCoinUsed, setTotalCoinUsed] = useState();

  const [loading, setLoading] = useState(true);

  const [paymentIdModal, setPaymentIdModal] = useState(false);

  const [paytmOptions, setPaytmOptions] = useState({
    name: "",
    placeholder: "",
  });

  const systemconfig = useSelector(sysConfigdata);

  // per coin
  const per_coin = systemconfig?.per_coin;

  // per amount
  const coin_amount = systemconfig?.coin_amount;

  // minimun coin for request
  const coin_limit = systemconfig?.coin_limit;

  // payment sign
  const currency_symbol = systemconfig?.currency_symbol;
  

  // store data get
  const userData = useSelector((state) => state.User);

  // here math.max use for check negative value if negative then it set 0
  const usercoins = Math.max(
    Number(userData?.data && userData?.data?.userProfileStatics.coins),
    0
  );

  // payment option icon, name and placeholder
  const paymentIcones = [
    { src: paypal.src, name: "paypal", placeholder: "enter_paypalid" },
    { src: paytm.src, name: "paytm", placeholder: "enter_mobilenumber" },
    { src: stripe.src, name: "stripe", placeholder: "enter_upi_id" },
  ];

  // user coins
  useEffect(() => {
    let data = usercoins;
    let newData = (data / Number(per_coin)) * Number(coin_amount);
    // here if newData is negative then it set 0
    if (newData < 0) {
      newData = 0;
    }
    setWalletValue(newData);
  }, []);

  // inputcoinused (reverse process based input value data passed)
  const inputCoinUsed = () => {
    let inputCoin = redeemInput ? redeemInput : walletvalue;
    let totalCoinUsed = (inputCoin * Number(per_coin)) / Number(coin_amount);
    setTotalCoinUsed(totalCoinUsed);
  };

  // minimum value
  const minimumValue = () => {
    const minimumvalue = Number(coin_limit);
    const percoin = Number(per_coin);
    
    const totalvalue = minimumvalue / percoin;
    return totalvalue;
  };

  // reedem button
  const redeemNow = (e) => {
    e.preventDefault();
    inputCoinUsed();
    if (Number(redeemInput) < minimumValue()) {
      setModal(false);
      toast.error(
        t(`Minimum redeemable amount is ${currency_symbol}${minimumValue()}`)
      );
      return;
    } else if (Number(redeemInput) > walletvalue) {
      setModal(false);
      toast.error(t(`You cannot redeem more than your wallet balance`));
      return;
    } else {
      setModal(true);
    }
  };

  // payment type
  const paymentModal = (e, type) => {
    e.preventDefault();
    if (type === paymentIcones[0].name) {
      setPaytmOptions({
        name: paymentIcones[0].name,
        placeholder: paymentIcones[0].placeholder,
      });
      setPaymentIdModal(true);
      setModal(false);
    } else if (type === paymentIcones[1].name) {
      setPaytmOptions({
        name: paymentIcones[1].name,
        placeholder: paymentIcones[1].placeholder,
      });
      setPaymentIdModal(true);
      setModal(false);
    } else if (type === paymentIcones[2].name) {
      setPaytmOptions({
        name: paymentIcones[2].name,
        placeholder: paymentIcones[2].placeholder,
      });
      setPaymentIdModal(true);
      setModal(false);
    }
  };
  // input data
  const handleMerchantIdChange = (event) => {
    setInputId(event.target.value);
  };

  // cancel button
  const onCancelbutton = () => {
    setInputId(0);
  };

  // make request
  const makeRequest = async (event, type) => {
    event.preventDefault();
    // if input field is empty
    if (inputId == "") {
      toast.error("please fill your id");
      return;
    }
    // set payment api call with coin update api

    const response = await setPaymentRequestApi({
      payment_type: type,
      payment_address: `["${inputId}"]`,
      payment_amount: redeemInput,
      coin_used: totalCoinUsed,
      details: "Redeem Request",
    });

    if (!response?.error) {
      setModal(false);
      setPaymentIdModal(false);

      const response = await getUserCoinsApi({});
      
      if (!response?.error) {
        setActiveTab("pending");
        setRedeemInput(0);
        updateUserDataInfo(response.data);
      } else {
      }
    } else {
      setModal(false);
      if (response?.message == errorCodeCanNotMakeRequest) {
        toast.error(t("next_payment_48_hours_latter"));
      }
    }
  };

  // get payment api fetch
  useEffect(() => {
    const getPaymentRequestData = async () => {
      const response = await getPaymentRequestApi({});
      if (!response?.error) {
        const resposneData = response.data;
        setPaymentData(resposneData);
        // const totalAmount = resposneData.reduce((accumulator, currentObject) => {
        //   if (currentObject.status === '1') {
        //     const paymentAmount = parseFloat(currentObject.payment_amount);
        //     return accumulator + paymentAmount;
        //   }
        //   return accumulator;
        // }, 0);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getPaymentRequestData();
  }, [activeTab]);

  // status data
  const statusData = (status) => {
    if (status === "0") {
      return "pending";
    } else if (status === "1") {
      return "completed";
    } else if (status === "2") {
      return "invalid details";
    }
  };

  // date format
  const dataFormat = (date) => {
    const dateString = date.substring(0, 10);
    const dateArray = dateString.split("-");
    const reversedDateArray = dateArray.reverse();
    const newDateStr = reversedDateArray.join("-");
    return newDateStr;
  };

  // input value of redeem amount
  const handleInputchange = (event) => {
    event.preventDefault();
    let targetValue = event.target.value;
    setRedeemInput(Number(targetValue));
  };

  // return value of popup coins
  const modalCoinValue = () => {
    const divisionResult = redeemInput / minimumValue();
    const centsValue = Math.floor(divisionResult * 100);
    return centsValue;
  };

  // update wallet value of input by default input value and selected value
  useEffect(() => {
    setRedeemInput(walletvalue);
  }, [walletvalue]);

  const getStatusColor = (status) => {
    switch (status) {
      case "0":
        return "pending-color";
      case "1":
        return "completed-color";
      case "2":
        return "invalid-color";
      default:
        return ""; // Default color or add a class for other statuses
    }
  };

  // delete request
  const deleteRequest = async (id) => {
    const response = await deletePendingPaymentRequestApi({
      payment_id: id,
    });

    if (!response?.error) {
      toast.success(t("successfully_delete"));
      setActiveTab("pending");
      setPaymentData([]);
      const response = await getUserCoinsApi();
      if (!response?.error) {
        setRedeemInput(0);
        updateUserDataInfo(response.data);
      } else {
        console.log(response);
      }
    } else {
      console.log(response);
    }
  };
  const pendingData = paymentData?.filter((data) => data.status === "0");
  const renderDataByStatus = (status) => {
    const filteredData = status === "2" ? paymentData : paymentData.filter((data) => data.status === status);

    return (
      <>
        {filteredData?.length > 0 ? (
          filteredData.map((data, index) => (
            <div
              className={`bg-[var(--background-2)] p-5 m-5 rounded-[10px] darkSecondaryColor ${getStatusColor(
                data?.status
              )}`}
              key={index}
            >
              <div className="flex justify-between items-center">
                <p className="mb-0 !text-primary-color">
                  {t("redeem_request")}
                </p>
                <p className="bg-primary-color p-[5px] rounded-[10px] !text-white mb-0">
                  {currency_symbol}
                  {data?.payment_amount}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="mb-0 !text-primary-color">
                  {data?.payment_type} &#9679; {dataFormat(data?.date)}
                </p>
                <p className="mb-0 !text-primary-color">
                  {statusData(data?.status)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center flex-center flex-col">
            <div className="h-20">
              <ThemeSvg
                src={errorimg.src}
                width="100%"
                height="100%"
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
            <p className="text-dark">{t("no_data_found")}</p>
          </div>
        )}
      </>
    );
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
              <div className="w-full md:w-full lg:w-[70%] xl:w-[70%] morphisam !m-0 darkSecondaryColor">
              <div className="font-bold text-[42px] mb-5 text-center ">{t("wallet")}</div>
                <div>
                  <div className="w-full flex flex-col gap-8 ">
                    <div className="bg-white rounded-[16px] font-sans pb-5 pt-4 darkSecondaryColor">
                      <h2 className="text-text-color font-bold font-sans text-lg sm:text-[24px] text-center ">
                        {t("request_payment")}
                      </h2>
                      <div className="mt-6 flex justify-around items-center max-991:flex-col">
                        <div className="flex-center flex-col gap-3">
                          <span className="opacity-50">{`${t("total")} ${t("coins")} `}</span>
                          <span className="font-sans text-[24px] text-text-color font-bold flex-center ">
                            <img
                              className="w-5 h-5 object-contain max-w-full mr-1"
                              src={getImageSource(coinimg.src)}
                              alt="coin"
                            />
                            {usercoins}
                          </span>
                        </div>
                        <div className="flex-center flex-col gap-3">
                          <span className="opacity-50">{`${t(
                            "redeemable_amount"
                          )} ${currency_symbol}`}</span>
                          <span>
                            {" "}
                            <input
                              type="number"
                              className="text-text-color outline-none dark:border-[#FFFFFF29] dark:border-[2px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none appearance-none border-transparent h-10 text-center font-semibold darkSecondaryColor"
                              defaultValue={`${walletvalue}`}
                              onChange={(event) => handleInputchange(event)}
                              min={0}
                            />
                          </span>
                        </div>
                        <div className="">
                          <button
                            className="btnPrimary text-base sm:text-[20px] font-semibold shadowBtn"
                            onClick={(e) => redeemNow(e)}
                          >
                            {t("redeem_now")}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-center flex-col p-2 md:flex-row !items-start text-text-color md:gap-3">
                      <p className="notes dark:opacity-50">{t("notes")} :</p>
                      <ul className="flex flex-col list-disc list-inside">
                        <li>{t("payout_days")}</li>
                        <li>{`${t(
                          "minimum_redeemable_amount"
                        )} ${currency_symbol}${minimumValue()} ( ${Number(coin_limit)}  ${t("coins")} )`}</li>
                      </ul>
                    </div>
                    {/* {paymentData?.length > 0 ? ( */}
                    <div className="bg-white pb-8 rounded-[16px] darkSecondaryColor">
                      <h2 className="text-text-color font-sans text-[24px] font-bold text-center py-[20px]">
                        {t("transaction")}
                      </h2>
                      {loading ? (
                        <div className="text-center">
                          <Skeleton count={5} className="skeleton"/>
                        </div>
                      ) : (
                        <>
                          <Tabs defaultValue="all">
                            <TabsList className="flex !justify-evenly h-auto gap-y-5 w-[70%] m-auto">
                              <TabsTrigger
                                value="all"
                                className="profileTabBtn px-20 text-[18px] !mx-0 !py-2 w-[30%] max-479:text-[13px]"
                              >
                                {t("all")}
                              </TabsTrigger>
                              <TabsTrigger
                                value="completed"
                                className="profileTabBtn px-20 text-[18px] !mx-0 !py-2 w-[30%] max-479:text-[13px]"
                              >
                                {t("completed")}
                              </TabsTrigger>
                              <TabsTrigger
                                value="pending"
                                className="profileTabBtn px-20 text-[18px] !mx-0 !py-2 w-[30%] max-479:text-[13px]"
                              >
                                {t("pending")}
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" title={t("all")}>
                              {renderDataByStatus("2")}
                            </TabsContent>

                            <TabsContent
                              value="completed"
                              title={t("completed")}
                            >
                              {renderDataByStatus("1")}
                            </TabsContent>

                            <TabsContent value="pending" title={t("pending")}>
                              {renderDataByStatus("0")}
                              {pendingData && pendingData.length > 0 ? (
                                <div className="flex-center">
                                  <button
                                    className="m-auto btnPrimary shadowBtn"
                                    onClick={() =>
                                      deleteRequest(paymentData[0].id)
                                    }
                                  >
                                    {t("delete_request")}
                                  </button>
                                </div>
                              ) : null}
                            </TabsContent>
                          </Tabs>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="bg-white !rounded-[10px] !gap-2">
          <DialogTitle>{t("wallet")}</DialogTitle>
          <DialogDescription>
            <h4>
              {t("redeemable_amount")} {currency_symbol}
              {redeemInput}
            </h4>
            <p>
              {modalCoinValue()} {t("coins_deducted")}
            </p>
            <hr className="my-4 text-text-color bg-[#80808094] opacity-25" />
            <p>{t("select_payout_option")}</p>
            <ul className="flex items-center flex-wrap ps-0">
              {paymentIcones.map((icon) => {
                return (
                  <li
                    onClick={(e) => paymentModal(e, icon?.name)}
                    className="mr-5 rounded-[5px] px-6 text-white flex-center mt-1 border-[2px] border-gray-600 cursor-pointer"
                  >
                    <i className="text-[20px]">
                      <img
                        className="h-5 w-11"
                        src={getImageSource(icon?.src)}
                        alt={icon}
                      />
                    </i>
                  </li>
                );
              })}
            </ul>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentIdModal} onOpenChange={setPaymentIdModal}>
        <DialogContent className="bg-white !rounded-[10px]">
          <DialogTitle className="text-center">{t("wallet")}</DialogTitle>
          <DialogDescription>
            <h3 className="mb-2">
              {t("payout_method")} - {t(paytmOptions.name)}
            </h3>
            <div>
              <input
                className="placeholder:text-center w-full max-w-full text-[14px] font-normal relative pl-5 h-10 rounded-[5px] border-none bg-[#e1e5e8] transition-colors duration-300 outline-none tracking-wider text-text-color"
                type="text"
                placeholder={t(paytmOptions.placeholder)}
                value={inputId}
                onChange={(event) => handleMerchantIdChange(event)}
              />
            </div>
            <div className="text-end mt-3">
              <button
                className="btnPrimary !p-2 shadowBtn"
                onClick={(event) => makeRequest(event, paytmOptions.name)}
              >
                {t("make_req")}
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default withTranslation()(Wallet);
