import React from "react";
import { Icon } from "@iconify/react";
import FeatureCard from "./components/feature-card";
import { Card, CardHeader, CardTooltip, Button } from "@nextui-org/react";

function page() {
  const featuresCategories = [
    {
      key: "ISSB",
      title: "ISSB",
      descriptions: ["BETA"],
      tooltipContent:
        "글로벌 기준서인 ISSB 보고서는 지속가능성 관련 재무정보 공시에 대한 일반요구사항(S1) 및 기후 관련 공시(S2) 등을 다루는 보고서",
    },
    {
      key: "KSSB",
      title: "KSSB",
      descriptions: ["BETA"],
      tooltipContent:
        "한국의 지속가능성 공시 기준서인 KSSB 보고서는 일반사항(제1호), 기후 관련 공시사항(제2호)과 추가공시(제101호) 등을 다루는 보고서",
    },
    {
      key: "CSRD",
      title: "CSRD",
      descriptions: ["개발중"],
      tooltipContent: "",
    },
    {
      key: "SEC",
      title: "SEC",
      descriptions: ["개발중"],
      tooltipContent: "",
    },
    {
      key: "GRI",
      title: "GRI",
      descriptions: ["개발중"],
      tooltipContent: "",
    },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-center items-center overflow-hidden">
      <div className="w-full h-1/10 flex justify-start items-center">
        <h1 className="text-start text-lg">기업의 2024년 공시할 보고서 기준을 선택하실 수 있습니다.</h1>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full h-1/2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          {featuresCategories.map((category) => (
            <FeatureCard
              key={category.key}
              descriptions={category.descriptions}
              icon={category.icon}
              title={category.title}
              tooltipContent={category.tooltipContent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
