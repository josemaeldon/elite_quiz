"use client";
import BattleRoomPanel from "@/components/Quiz/BattleRoom/BattleRoomPanel";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const GroupBattle = () => (
  <BattleRoomPanel
    title={t("group_battle")}
    description={
      t("group_battle_description") ||
      "Crie salas em grupo, convide amigos e acompanhe o chat em tempo real."
    }
    mode="group"
    maxPlayers={6}
  />
);

export default withTranslation()(GroupBattle);
