import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "../../styles/Investor.css";
import { useIsMobile } from "../../utils/detectMobile";

interface PieChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}
interface ReusablePieChartProps {
  data: PieChartDataItem[];
  colors: string[];
  title: string;
  className?: string;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const ReusablePieChart = ({
  data,
  colors,
  title,
  className,
}: ReusablePieChartProps) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomizedLabelProps) => {
    if (
      innerRadius === undefined ||
      outerRadius === undefined ||
      midAngle === undefined ||
      percent === undefined
    ) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const isMobile = useIsMobile();

  return (
    <div
      className={` chart-container portfolio-distribution-container ${className}`}
    >
      <h3 className="portfolio-distribution-title">{title}</h3>
      <div className="pie-section mt-0 mt-md-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={"95%"}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Legend
              verticalAlign={isMobile ? "bottom" : "top"}
              align={isMobile ? "center" : "right"}
              layout={isMobile ? "horizontal" : "vertical"}
              iconSize={10}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReusablePieChart;
