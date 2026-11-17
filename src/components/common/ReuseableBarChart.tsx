import React from "react";
import "../../styles/Investor.css";
import { useIsMobile } from "../../utils/detectMobile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: { name: string; value: number }[];
  title?: string;
  barColor?: string;
}

const ReuseableBarChart: React.FC<BarChartProps> = ({
  data,
  title = "",
  barColor = "#388e3c",
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="chart-container portfolio-distribution-container">
      {title && <h3 className="portfolio-distribution-title mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={isMobile ? 320 : 380}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => `${v} %`} />
          <Tooltip formatter={(v) => `${v} %`} />
          <Bar dataKey="value" fill={barColor} barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReuseableBarChart;
