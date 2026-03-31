"use client";
import BattleUnavailable from "@/components/Quiz/BattleUnavailable";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const PlaywithFriendBattlequestions = () => (
  <BattleUnavailable
    title={t("play_with_friends_questions")}
    description={
      t("play_with_friends_questions_unavailable") ||
      "As perguntas do modo Jogar com amigos ainda estão sendo migradas para o novo backend."
    }
  />
);

export default withTranslation()(PlaywithFriendBattlequestions);
