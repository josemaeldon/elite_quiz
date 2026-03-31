"use client";
import BattleRoomPanel from "@/components/Quiz/BattleRoom/BattleRoomPanel";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const RandomBattle = () => (
  <BattleRoomPanel
    title={t("random_battle")}
    description={
      t("random_battle_description") ||
      "Crie uma sala Postgres, junte seus amigos e troque mensagens."
    }
    mode="random"
  />
);

export default withTranslation()(RandomBattle);
