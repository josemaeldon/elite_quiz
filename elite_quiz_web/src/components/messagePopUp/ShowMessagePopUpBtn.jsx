import React, { useEffect, useState } from "react";
import { sendBattleMessage } from "@/api/apiRoutes";
import { useSelector } from "react-redux";
import { groupbattledata } from "@/store/reducers/groupbattleSlice";
import emoji from "./emoji_src";
import msgIcone from "../../assets/images/messageIcon.svg";
import ThemeSvg from "@/components/ThemeSvg/ThemeSvg";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { t } from "@/utils/index";
import toast from "react-hot-toast";

const ShowMessagePopUp = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isTextMessage, setIsTextMessage] = useState(true);
  const [newDocID, setNewDocID] = useState();
  const groupBattledata = useSelector(groupbattledata);
  const dispatch = useDispatch();
  const by = useSelector((state) => state.User);
  const [activeTab, setActiveTab] = useState("0");

  const onChange = (value) => {
    // Update isTextMessage based on the tab value
    setIsTextMessage(value === "0");
  };

  const messageListData = [
    "Hello..!!",
    "How are you..?",
    "Fine..!!",
    "Have a nice day..",
    "Well played",
    "What a performance..!!",
    "Thanks..",
    "Welcome..",
    "Merry Christmas",
    "Happy new year",
    "Happy Diwali",
    "Good night",
    "Hurry Up",
    "Dudeeee",
  ];

  const handleClick = async (msg) => {

    if (by.data.id) {
      setDialogOpen(false);
      try {
        await sendBattleMessage({
          room_id: groupBattledata.roomID,
          sender_id: by.data.id,
          message: msg,
          is_text: isTextMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      }
    }
  };

  const msg = messageListData.map((data) => (
    <button
      className="bg-transparent border-none flex flex-col p-1.5 text-[15px]  text-start"
      onClick={() => handleClick(data)}
      key={data}
    >
      {data}
    </button>
  ));
  const emojis = emoji.map((data) => (
    <button
      className="bg-transparent border-none m-[5px]"
      onClick={() => handleClick(data.src)}
      key={data.id}
    >
      <img src={`/images/emojis/${data.src}`} height="50px" width="50px" alt="emoji"/>
    </button>
  ));

  const items = [
    {
      key: "1",
      label: "messages",
      children: msg,
    },
    {
      key: "2",
      label: "emojis",
      children: emojis,
    },
  ];

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    setIsTextMessage(value === "0");
    onChange(value);
  };

  // Reset to text message tab when popup is opened
  useEffect(() => {
    setIsTextMessage(true);
  }, []);

  return (
    <>
      <div className="message-icon" onClick={() => setDialogOpen(true)}>
        <ThemeSvg
          src={msgIcone.src}
          height={50}
          width={50}
          alt="Message Icon"
          colorMap={{
            "#e03c75": "var(--primary-color)",
            "#551948": "var(--secondary-color)",
            "#3f1239": "var(--secondary-color)",
            "#7b2167": "var(--secondary-color)",
            "#ac5e9f": "var(--primary-color)",
          }}
        />
      </div>
      <Dialog
        title=""
        centered
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        footer={null}
      >
        <DialogContent className="dialogContent w-full sm:w-[450px]">
          <Tabs
            defaultValue="0"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="flex flex-wrap mb-14 h-auto">
              <TabsTrigger value="0" className={`battelTabBtn `}>
                {t("messages")}
              </TabsTrigger>
              <TabsTrigger value="1" className={`battelTabBtn `}>
                {t("emojis")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="0">
              <div className="">{msg}</div>
            </TabsContent>
            <TabsContent value="1">
              <div className="">{emojis}</div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowMessagePopUp;
