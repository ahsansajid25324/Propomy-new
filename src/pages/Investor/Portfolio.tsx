import "../../styles/Investor.css";
import {
  portfolioStatCardData,
  COLORS,
  data,
  portfolioGrowthData,
  roiData,
} from "../../libs/constants/Investor";
import StatCard from "../../components/common/StatCard";
import ReusablePieChart from "../../components/common/ReuseablePieChart";
import ReuseableBarChart from "../../components/common/ReuseableBarChart";
import MapView from "../../components/pages/MapView";
import QuickActions from "../../components/pages/QuickActions";

import ReuseableLineChart from "../../components/common/ReuseableLineChart";
import QuickInsights from "../../components/pages/QuickInsights";
import { normalActions } from "../../libs/constants/QuickActions";

const Portfolio = () => (
  <div>
    <div className="stat-card-row">
      {portfolioStatCardData.map((card, index) => (
        <StatCard
          key={index}
          value={card.value}
          label={card.label}
          subLabel={card.subLabel}
          icon={card.icon}
        />
      ))}
    </div>
    <div className="set-direction">
      <ReusablePieChart
        data={data}
        colors={COLORS}
        title="Portfolio Distribution"
      />
      <ReuseableBarChart
        data={roiData}
        title="Year-Over-Year ROI Performance"
        barColor="#388e3c"
      />
    </div>

    <div className="set-direction">
      <MapView />
      <QuickInsights />
    </div>
    <div className="set-direction">
      <ReuseableLineChart data={portfolioGrowthData} />
      <QuickActions actions={normalActions} />
    </div>
  </div>
);

export default Portfolio;
