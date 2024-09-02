import React from "react";

interface BadgeProps {
  status: string;
}

export default function Badge({ status }: BadgeProps): JSX.Element {
  let bgColor = "";
  let textColor = "";

  switch (status) {
    case "new":
      bgColor = "bg-green-100";
      textColor = "text-green-400";
      break;
    case "closed":
      bgColor = "bg-blue-100";
      textColor = "text-blue-400";
      break;
    case "low":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-400";
      break;
    case "medium":
      bgColor = "bg-orange-100";
      textColor = "text-orange-400";
      break;
    case "high":
      bgColor = "bg-red-100";
      textColor = "text-red-400";
      break;
  }

  return (
    <div
      className={`h-8 px-2 flex justify-center items-center rounded-xl ${bgColor}`}
    >
      <span className={`font-bold capitalize ${textColor}`}>{status}</span>
    </div>
  );
}
