import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "../../utils/detectMobile";

interface ReuseableLineChartProps {
  data: { month: string; value: number }[];
  title?: string;
  height?: number;
  className?: string;
}
const ReuseableLineChart: React.FC<ReuseableLineChartProps> = ({
  data,
  title = "Portfolio Value Growth Trend",
  height = 300,
  className = "",
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`chart-container line-chart-container ${className}`}>
      <h2 className="portfolio-distribution-title">{title}</h2>
      <ResponsiveContainer
        width="100%"
        height={isMobile ? 300 : height}
        className="mt-4"
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#007aff"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ReuseableLineChart;
