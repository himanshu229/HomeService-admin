import React from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "orange";
  trend?: { value: number; label: string };
}

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600",   text: "text-blue-600" },
  green:  { bg: "bg-green-50",  icon: "bg-green-100 text-green-600", text: "text-green-600" },
  yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-600",text: "text-yellow-600" },
  red:    { bg: "bg-red-50",    icon: "bg-red-100 text-red-600",     text: "text-red-600" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600",text: "text-purple-600" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600",text: "text-orange-600" },
};

const StatsCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend,
}) => {
  const colors = colorMap[color];
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`text-xs font-medium ${
                trend.value >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-gray-400">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
