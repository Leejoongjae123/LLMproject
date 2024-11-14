"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const FeatureCard = React.forwardRef(
  ({ title, descriptions = [], icon, tooltipContent, index, ...props }, ref) => {
    const isNonInteractiveTitle = ["CSRD", "SEC", "GRI"].includes(title);
    const router = useRouter();

    return (
      <Card
        // ref={ref}
        // className={`bg-content2 w-full h-full transition-transform transform ${
        //   isNonInteractiveTitle ? "" : "hover:scale-105"
        // } border border-transparent ${
        //   isNonInteractiveTitle ? "" : "hover:border-[#F25B2B] hover:border-2"
        // }`}
        className="w-full h-full transition-transform transform hover:scale-105 border border-transparent hover:border-primary hover:border-2"
      >
        <CardHeader className="w-full h-1/6 flex flex-col gap-2 px-4 pb-4 pt-6">
          <div className="flex ">
            <p
              className={`text-2xl font-bold ${
                isNonInteractiveTitle
                  ? "text-gray-500"
                  : "text-content2-foreground"
              }`}
            >
              {title}
            </p>
            {!isNonInteractiveTitle && (
              <Tooltip className="z-50" content={tooltipContent}>
                <div>
                  <IoMdInformationCircleOutline />
                </div>
              </Tooltip>
            )}
          </div>
        </CardHeader>

        <CardBody className="w-full h-full flex flex-col gap-2 justify-center items-center">
          {/* <div className="flex justify-center items-center h-2/3 relative">
            <Image 
              src={`/logo/${title.toLowerCase()}.png`} 
              alt={`${title} logo`} 
              fill
              className="object-contain"

            />
          </div> */}

          {descriptions.map((description, index) => (
            <div
              key={index}
              className={`flex flex-col w-full h-full justify-center items-center rounded-medium px-3 py-2 ${
                isNonInteractiveTitle
                  ? "text-gray-500"
                  : "text-content3-foreground"
              }`}
            >
              <Button
                color={["ISSB", "KSSB"].includes(title) ? "primary" : "default"}
                radius="full"
                className="w-full text-small text-center"
                onClick={() => {
                  router.push("/category");
                }}
              >
                <p
                  className={`${isNonInteractiveTitle ? "text-gray-500" : ""}`}
                >
                  {description}
                </p>
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
