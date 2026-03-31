"use client";
import BattleRoomPanel from "@/components/Quiz/BattleRoom/BattleRoomPanel";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const PlayWithFriendBattle = () => (
  <BattleRoomPanel
    title={t("play_with_friends")}
    description={
      t("play_with_friends_description") ||
      "Crie uma sala privada para jogar com amigos usando o backend PostgreSQL."
    }
    mode="play_with_friend"
    maxPlayers={4}
  />
);

export default withTranslation()(PlayWithFriendBattle);
