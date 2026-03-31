"use client";
import BattleUnavailable from "@/components/Quiz/BattleUnavailable";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

const RandomQuestions = () => (
  <BattleUnavailable
    title={t("random_questions")}
    description={
      t("random_questions_unavailable") ||
      "A lista de perguntas do modo Random Battle está sendo reescrita para o backend PostgreSQL."
    }
  />
);

export default withTranslation()(RandomQuestions);
