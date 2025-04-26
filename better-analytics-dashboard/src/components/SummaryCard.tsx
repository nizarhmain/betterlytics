import React from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  changeText: string;
  changeColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, changeText, changeColor = "text-gray-600" }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow flex flex-col">
    <span className="text-sm text-gray-500">{title}</span>
    <span className="text-2xl font-bold text-gray-900 mt-2">{value}</span>
    <span className={`text-xs mt-1 ${changeColor}`}>{changeText}</span>
  </div>
);

export default SummaryCard; 