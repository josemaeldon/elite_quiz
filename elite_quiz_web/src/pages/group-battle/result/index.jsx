"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { selectResultTempData } from "@/store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { t } from "@/utils";

const Layout = dynamic(() => import("@/components/Layout/Layout"), { ssr: false });
const GroupBattleScore = dynamic(() => import("@/components/Quiz/GroupBattle/GroupBattleScore"), { ssr: false });

const GroupPlay = () => {
  const showScore = useSelector(selectResultTempData);
  return (
    <Layout>
      <Breadcrumb title={t("group_battle")} content="" contentTwo="" />
      <div className="container mb-2">
        <GroupBattleScore totalQuestions={showScore.totalQuestions} />
      </div>
    </Layout>
  );
};

export default withTranslation()(GroupPlay);
