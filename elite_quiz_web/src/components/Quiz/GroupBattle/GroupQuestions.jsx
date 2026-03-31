"use client";
import BattleUnavailable from "@/components/Quiz/BattleUnavailable";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const GroupQuestions = () => (
  <BattleUnavailable
    title={t("group_questions")}
    description={
      t("group_questions_unavailable") ||
      "As perguntas do modo Group Battle serão carregadas da nova API PostgreSQL."
    }
  />
);

export default withTranslation()(GroupQuestions);
