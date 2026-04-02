"use client";
import BattleRoomPanel from "@/components/Quiz/BattleRoom/BattleRoomPanel";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const RandomBattle = ({ initialJoinCode = "" }) => (
  <BattleRoomPanel
    title={t("random_battle")}
    description={
      t("random_battle_description") ||
      "Crie uma sala Postgres, junte seus amigos e troque mensagens."
    }
    mode="random"
    initialJoinCode={initialJoinCode}
  />
);

export default withTranslation()(RandomBattle);
