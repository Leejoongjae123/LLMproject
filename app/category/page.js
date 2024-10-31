"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spacer,
  Tab,
  Tabs,
  Input,
} from "@nextui-org/react";
import { FrequencyEnum } from "./components/pricing-types";
import { frequencies, tiers } from "./components/pricing-tiers";
import { SearchIcon } from "./components/SearchIcon";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./components/ListboxWrapper";
import { FaCheckCircle } from "react-icons/fa";
import { RiArrowUpDownLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

export default function Component() {
  const [selectedFrequency, setSelectedFrequency] = useState(frequencies[0]);

  const onFrequencyChange = (selectedKey) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);

    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  return (
    <div className="flex w-full h-full flex-col items-center">
      <div className="flex justify-end items-center gap-x-5 w-full h-24 px-6">
        <Button
          size="sm"
          radius="full"
          className="font-bold text-sm text-white"
          color="primary"
        >
          담당자 지정
        </Button>
        <Button
          size="sm"
          radius="full"
          className=" font-bold text-sm bg-[#f25b2b] text-white"
          color="primary"
        >
          담당자 일괄 지정
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-4 px-12 pb-12 gap-x-6">
        {tiers.map((tier) => (
          <Card key={tier.key} className="relative p-3" shadow="md">
            <CardHeader className="flex flex-col items-center gap-2 ">
              <h2 className="text-lg font-bold text-center">{tier.title}</h2>
              <p className="text-sm text-default-500">{tier.description}</p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              <Input
                startContent={
                  <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
              ></Input>
              <ListboxWrapper>
                <Listbox aria-label="Example with disabled actions">
                  <ListboxItem
                    startContent={<FaCircle className="text-gray-500" />}
                    key="main1"
                    className="group bg-gray-300 text-gray-700 hover:text-gray-500 hover:bg-gray-300"
                    endContent={<div className="flex gap-2 text-xs">순서</div>}
                    isDisabled

                  >
                    목차이름
                  </ListboxItem>
                  {tier.features.map((feature,index) => (
                    <ListboxItem
                      startContent={<FaCheckCircle className="text-gray-700" />}
                    key={`main${index}`}
                    className="group"
                    endContent={
                      <div className="flex gap-2">
                        <FaRegEdit className="text-red-500 hidden group-hover:block transition-opacity duration-1000 opacity-0 group-hover:opacity-100" />
                        <MdDeleteOutline className="text-red-500 hidden group-hover:block transition-opacity duration-1000 opacity-0 group-hover:opacity-100" />
                        <RiArrowUpDownLine className="text-gray-700" />
                      </div>
                    }
                  >
                    {feature}
                  </ListboxItem>
                  ))}
                </Listbox>
              </ListboxWrapper>
            </CardBody>
            
          </Card>
        ))}
      </div>
    </div>
  );
}
