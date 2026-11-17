import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import "../../styles/Investor.css";

import SavedProperties from "../../components/pages/SavedProperties";
import RecentValuations from "../../components/pages/RecentValuation";
import { useQuery } from "@apollo/client/react";
import { GET_USER_PROPERTY_STATS } from "../../apollo/graphql/queries/Investor";
import type { UserPropertyStats } from "../../types/investor";
import { getDynamicStats } from "../../libs/constants/InvestorStats";
import StatCard from "../../components/common/StatCard";
import Strip from "../../components/pages/Strip";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const InvestorDashboard = () => {
  const { data, loading } = useQuery<{
    userPropertyStats: UserPropertyStats;
  }>(GET_USER_PROPERTY_STATS, { fetchPolicy: "cache-and-network" });

  const isLoading = loading && !data;

  const stats: Partial<UserPropertyStats> = data?.userPropertyStats ?? {};
  const dynamicStats = getDynamicStats(stats as UserPropertyStats);

  return (
    <div>
      {/* Dynamic Top Stat Cards */}
      <motion.div
        className="stat-card-row"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {dynamicStats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatCard
              value={stat.value}
              label={stat.label}
              subLabel={stat.subLabel}
              isLoading={isLoading}
              icon={stat.icon}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="show"
        style={{ margin: "20px 0" }}
      >
        <Strip
          analyzingCount={stats.analyzingDealsCount ?? 0}
          negotiatingCount={stats.negotiatingDealsCount ?? 0}
          offerMadeCount={stats.offerMadeDealsCount ?? 0}
          underContractCount={stats.underContractDealsCount ?? 0}
          closedCount={stats.closedDealsCount ?? 0}
          isLoading={isLoading}
        />
      </motion.div>

      <motion.div
        className="set-direction"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <RecentValuations
          recentValuations={data?.userPropertyStats?.recentValuations ?? []}
          isLoading={isLoading}
        />
        <SavedProperties
          properties={data?.userPropertyStats?.savedProperties ?? []}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};

export default InvestorDashboard;
