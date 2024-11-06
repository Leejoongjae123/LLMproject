"use client";
import React from "react";
import {
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Textarea,
  cn,
  CardHeader,
  CardFooter,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { AiOutlineShrink } from "react-icons/ai";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { FaWandMagicSparkles } from "react-icons/fa6";
import TextInputs from "./TextInputs";
function AIManager() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <Card className="bg-gray-200 w-full h-36 flex flex-col justify-center">
        <div>
          {" "}
          <p className="text-center">
            생성된 초안 박스별로 EDK AI와 협업하실 수 있어요
          </p>
          <p className="text-center">
            퀵 AI 버튼과 대화를 통해서 초안을 수정해 보세요!
          </p>
        </div>
      </Card>
      <div className="flex flex-row gap-x-5">
        <Button
          variant="bordered"
          startContent={<AiOutlineExpandAlt className="text-lg font-bold" />}
          className=""
        >
          더 길게 쓰기
        </Button>
        <Button
          variant="bordered"
          startContent={<AiOutlineShrink className="text-lg font-bold" />}
          className=""
        >
          더 짧게 쓰기
        </Button>
        <Button
          variant="bordered"
          startContent={<MdOutlineEdit className="text-lg font-bold" />}
          className=""
        >
          문장 다듬기
        </Button>
      </div>
      <div className="w-full border border-gray-100 p-2 rounded-lg flex flex-row gap-x-2">
        <FaWandMagicSparkles className="text-lg font-bold" />
        <p className="text-start text-sm">
          혹은 AI 매니저에게 요청을 직접 입력하실 수도 있어요
        </p>
      </div>
      <div className="w-full border border-gray-100 p-1 rounded-lg">
        <p className="text-start text-sm text-[#247ee3] hover:text-[#4499ff] cursor-pointer transition-colors">
          기후 관련 이사회의 책임범위를 보다 구체적으로 작성해줘
        </p>
      </div>
      <div className="w-full border border-gray-100 p-1 rounded-lg">
        <p className="text-start text-sm text-[#247ee3] hover:text-[#4499ff] cursor-pointer transition-colors">
          경영진이 기후 리스크 평가를 어떻게 하고 있는지 내용을 추가해줘
        </p>
      </div>

      <div className="w-full h-full flex flex-col justify-end">
        <Accordion isCompact className="w-full my-2 bg-gray-100 text-sm border-2 border-gray-200 rounded-lg">
          <AccordionItem
            className="w-full text-sm"
            title={
              <span className="text-sm">
                초안 생성 출처(Reference) 확인하기
              </span>
            }
            css={{
              overflow: "hidden",
              transformOrigin: "top",
              transition: "transform 0.3s ease",
              "&[data-state='open']": {
                transform: "scaleY(-1)", // 위쪽으로 펼쳐지도록 애니메이션 조절
              },
            }}
          >
            <p>위로 펼쳐지는 컨텐츠 내용입니다.</p>
            <p>위로 펼쳐지는 컨텐츠 내용입니다.</p>
          </AccordionItem>
        </Accordion>
        <TextInputs></TextInputs>
      </div>
    </div>
  );
}

export default AIManager;
