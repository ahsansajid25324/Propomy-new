import "../../styles/Investor.css";
import {
  rentalEstimatesStatCardData,
  portfolioGrowthData,
} from "../../libs/constants/Investor";
import StatCard from "../../components/common/StatCard";
import ReusablePieChart from "../../components/common/ReuseablePieChart";
import { COLORS, data } from "../../libs/constants/Investor";

import QuickActions from "../../components/pages/QuickActions";
import AIHeatMap from "../../components/pages/AIHeatMap";
import ReuseableLineChart from "../../components/common/ReuseableLineChart";
import { valuationActions } from "../../libs/constants/QuickActions";
import QuickInsights from "../../components/pages/QuickInsights";
const RentalEstimates = () => (
  <div>
    <div className="stat-card-row">
      {rentalEstimatesStatCardData.map((card, index) => (
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
        title="Factor Weight Distribution"
      />
      <AIHeatMap />
    </div>
    <div className="set-direction">
      <QuickActions className="w-100" actions={valuationActions} />
      <QuickInsights className="w-100" />
    </div>
    <div className="set-direction">
      <ReuseableLineChart title="Predicted Rent Trend" className="w-100" data={portfolioGrowthData} />
    </div>
  </div>
);

export default RentalEstimates;
