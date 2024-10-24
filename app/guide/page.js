"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Avatar,
  ScrollShadow,
  Listbox,
  ListboxItem,
  ListboxSection,
  Spacer,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Switch,
  cn,
  ButtonGroup,
} from "@nextui-org/react";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ListboxWrapper } from "./components/ListboxWrapper";
import { sampleText } from "./components/sampleText";
// TextEditor를 동적으로 불러오기
const TextEditor = dynamic(() => import("../components/TextEditor"), {
  ssr: false,
});
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import TipTap from "../components/TipTap";
import { dummyData } from "./components/guide";
import { guideText } from "./components/guideText";
function Page() {
  const [selected, setSelected] = useState("가이드");
  const [content, setContent] = useState({ guide: "", sample: "" });
  const [selectedItem, setSelectedItem] = useState("weather");
  const [selectedText, setSelectedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("kr");
  const [category, setCategory] = useState("");
  const [guideContents, setGuideContents] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["edk"]));
  const [sampleContents, setSampleContents] = useState(null);
  const [sampleStep, setSampleStep] = useState(1);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  console.log("category:", category);

  const handleContentChange = () => {
    const selectedData = dummyData.find((item) => item.label === category);
    if (selectedData) {
      setContent({ guide: selectedData.guide, sample: selectedData.sample });
    } else {
      setContent({ guide: "", sample: "" });
    }
  };
  useEffect(() => {
    handleContentChange();
  }, [category]);

  const guideRef = useRef(null);

  useEffect(() => {
    if (guideRef.current) {
      const selectedElement = guideRef.current.querySelector(".is-selected");
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedText]);

  useEffect(() => {
    const selectedGuide = guideText.find(
      (item) => item.lan === selectedLanguage && item.title === selectedItem
    );
    if (selectedGuide) {
      setGuideContents(selectedGuide.description);
    } else {
      setGuideContents(null);
    }
  }, [selectedLanguage, selectedItem]);

  useEffect(() => {
    const selectedSample = sampleText.find(
      (item) =>
        item.title === selectedItem &&
        selectedKeys.has(item.key) &&
        item.text === category
    );
    if (selectedSample) {
      setSampleContents(selectedSample);
    } else {
      setSampleContents(null);
    }
  }, [selectedItem, selectedKeys, category]);

  return (
    <div className="w-full h-full grid grid-cols-6 gap-4">
      <div className="col-span-1 border-r px-5">
        <ScrollShadow className="-mr-6 h-full max-h-full pr-6 ">
          <Listbox aria-label="Recent chats" variant="flat">
            <ListboxSection
              classNames={{
                base: "py-0 space-y-3 w-full flex-1 justify-center items-center",
                heading: "py-0 pl-[10px] text-small text-default-400 ",
              }}
            >
              <ListboxItem
                key="react-19-example"
                className=" my-3 group h-12 text-gray-400 bg-gray-100 rounded-lg"
                textValue="Climate-related Disclosures"
              >
                리스크 관리
              </ListboxItem>

              <ListboxItem
                key="email-template"
                className=" my-3 group h-12 text-gray-400 bg-gray-100 rounded-lg"
                textValue="General Requirements"
              >
                전략
              </ListboxItem>
              <ListboxItem
                key="email-template"
                className=" my-3 group h-12 text-gray-400 bg-gray-100 rounded-lg"
                textValue="General Requirements"
                endContent={
                  <FaChevronRight className="text-gray-400 text-medium" />
                }
              >
                거버넌스
              </ListboxItem>

              <ListboxItem
                key="custom-support-message"
                className="my-3 group h-12 text-[#1c9ea6] rounded-lg ml-5 hover:none"
                textValue="Governance"
                onClick={() => setSelectedItem("weather")}
              >
                <p
                  className={cn(
                    "text-sm pr-5",
                    selectedItem === "weather" && "font-bold"
                  )}
                >
                  기후 관련 위험 및 기회에 관한 관리 감독 기구
                </p>
              </ListboxItem>
              <ListboxItem
                key="resignation-letter"
                className="my-3 group h-12 text-[#1c9ea6] rounded-lg ml-5"
                textValue="Strategy"
                onClick={() => setSelectedItem("manager")}
              >
                <p
                  className={cn(
                    "text-sm pr-5",
                    selectedItem === "manager" && "font-bold"
                  )}
                >
                  경영진의 역할 및 감독 방법
                </p>
              </ListboxItem>

              <ListboxItem
                key="how-a-taximeter-works"
                className=" my-3 group h-12 text-gray-400 bg-gray-100 rounded-lg"
                textValue="Appendix"
              >
                지표 및 목표
              </ListboxItem>
            </ListboxSection>
          </Listbox>
        </ScrollShadow>
      </div>
      <PanelGroup direction="horizontal" className="col-span-5">
        <Panel defaultSize={60} minSize={30}>
          <div className="overflow-y-auto h-full">
            <TipTap
              category={category}
              setCategory={setCategory}
              selectedItem={selectedItem}
              selectedText={selectedText}
              setSelectedText={setSelectedText}
            ></TipTap>
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors" />
        </PanelResizeHandle>
        <Panel defaultSize={40} minSize={30}>
          <div className="flex flex-col w-full h-full p-1">
            <Card className="flex-1 shadow-none border border-gray-300">
              <CardBody className="overflow-hidden">
                <Tabs
                  fullWidth
                  size="md"
                  aria-label="Tabs form"
                  selectedKey={selected}
                  onSelectionChange={setSelected}
                  variant="underlined"
                  classNames={{
                    // tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-[#f25b2b]",
                    // tab: "max-w-fit px-0 h-12",
                    // tabContent: "group-data-[selected=true]:text-[#f25b2b]"
                  }}
                >
                  <Tab key="AI 매니저" title="AI 매니저">
                    <form className="flex flex-col gap-4">
                      <Input
                        isRequired
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                      />
                      <Input
                        isRequired
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                      />
                      <p className="text-center text-small">
                        Need to create an account?{" "}
                        <Link size="sm" onPress={() => setSelected("sign-up")}>
                          Sign up
                        </Link>
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          radius="full"
                          className="w-full bg-[#f25b2b] text-white"
                        >
                          Button
                        </Button>
                      </div>
                    </form>
                  </Tab>
                  <Tab key="AI 진단" title="AI 진단">
                    <form className="flex flex-col gap-4 h-[300px]">
                      <Input
                        isRequired
                        label="Name"
                        placeholder="Enter your name"
                        type="password"
                      />
                      <Input
                        isRequired
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                      />
                      <Input
                        isRequired
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                      />

                      <div className="flex gap-2 justify-end">
                        <Button
                          radius="full"
                          className="w-full bg-[#f25b2b] text-white"
                        >
                          저장하기
                        </Button>
                      </div>
                    </form>
                  </Tab>
                  <Tab key="가이드" title="가이드" className="">
                    <Accordion
                      variant="splitted"
                      defaultExpandedKeys={["1", "2"]}
                    >
                      <AccordionItem
                        key="1"
                        aria-label="Accordion 1"
                        title={
                          <div className="flex items-center justify-between ㄹ">
                            <strong>가이드라인 보기</strong>
                            <Switch
                              size="sm"
                              onChange={() =>
                                setSelectedLanguage(
                                  selectedLanguage === "kr" ? "en" : "kr"
                                )
                              }
                            >
                              <p className="text-xs">
                                {selectedLanguage === "kr"
                                  ? "영문변환"
                                  : "한글변환"}
                              </p>
                            </Switch>
                          </div>
                        }
                        className=""
                      >
                        <div
                          className="overflow-y-auto max-h-[30vh]"
                          ref={guideRef}
                        >
                          <h1 className="guide_title_kr text-lg font-semibold">
                            {guideContents?.title}
                          </h1>
                          <br />
                          <p className={`guide_base_kr`}>
                            {guideContents?.base}
                          </p>
                          <br />
                          <p
                            className={`guide_ga_kr ${
                              selectedText.includes("(가)") ? "is-selected" : ""
                            }`}
                          >
                            {guideContents?.ga}
                          </p>
                          <br />
                          <p
                            className={`guide_na_kr ${
                              selectedText.includes("(나)") ? "is-selected" : ""
                            }`}
                          >
                            {guideContents?.na}
                          </p>
                          <br />
                          <p
                            className={`guide_da_kr ${
                              selectedText.includes("(다)") ? "is-selected" : ""
                            }`}
                          >
                            {guideContents?.da}
                          </p>
                          <br />

                          <p
                            className={`guide_ra_kr ${
                              selectedText.includes("(라)") ? "is-selected" : ""
                            }`}
                          >
                            {guideContents?.ra}
                          </p>
                          <br />

                          <p
                            className={`guide_ma_kr ${
                              selectedText.includes("(마)") ? "is-selected" : ""
                            }`}
                          >
                            {guideContents?.ma}
                          </p>
                        </div>
                      </AccordionItem>
                      <AccordionItem
                        key="2"
                        aria-label="Accordion 2"
                        title={<strong>샘플 보기</strong>}
                      >
                        <div className="overflow-y-auto max-h-[30vh]">
                          <ListboxWrapper className="w-full">
                            <Listbox
                              aria-label="Single selection example"
                              variant="flat"
                              disallowEmptySelection
                              selectionMode="single"
                              selectedKeys={selectedKeys}
                              onSelectionChange={(keys) => {
                                setSelectedKeys(keys);
                                setSampleStep(1); // Reset sample step to 1 for any selection
                              }}
                            >
                              <ListboxItem key="edk">EDK샘플</ListboxItem>
                              <ListboxItem key="domestic">
                                국내 기업 샘플
                              </ListboxItem>
                              <ListboxItem key="foreign">
                                해외 기업 샘플
                              </ListboxItem>
                            </Listbox>
                          </ListboxWrapper>

                          <div className="text-sm p-3 pb-0">
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  sampleStep === 1
                                    ? sampleContents?.contents1
                                    : sampleContents?.contents2,
                              }}
                            />
                            <div className="flex flex-col justify-start items-start gap-2 my-3">
                              {sampleContents?.link1_1 && (
                                <div className="flex justify-start items-center gap-2 w-full">
                                  {(sampleStep === 1
                                    ? sampleContents.link1_1
                                    : sampleContents.link2_1) && (
                                    <>
                                      <p
                                        className="w-12 flex-shrink-0 whitespace-nowrap "
                                        color="primary"
                                      >
                                        보고서1
                                      </p>
                                      <div className="flex-grow truncate">
                                        <Link
                                          target="_blank"
                                          href={
                                            sampleStep === 1
                                              ? sampleContents.link1_1
                                              : sampleContents.link2_1
                                          }
                                          className="block truncate"
                                        >
                                          {sampleStep === 1
                                            ? sampleContents.link1_1
                                            : sampleContents.link2_1}
                                        </Link>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              {sampleContents?.link1_2 && (
                                <div className="flex justify-start items-center gap-2 w-full">
                                  {(sampleStep === 1
                                    ? sampleContents.link1_2
                                    : sampleContents.link2_2) && (
                                    <>
                                      <p
                                        className="w-12 flex-shrink-0 whitespace-nowrap "
                                        color="primary"
                                      >
                                        보고서2
                                      </p>
                                      <div className="flex-grow truncate">
                                        <Link
                                          target="_blank"
                                          href={
                                            sampleStep === 1
                                              ? sampleContents.link1_2
                                              : sampleContents.link2_2
                                          }
                                          className="block truncate"
                                        >
                                          {sampleStep === 1
                                            ? sampleContents.link1_2
                                            : sampleContents.link2_2}
                                        </Link>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              {sampleContents?.link1_3 && (
                                <div className="flex justify-start items-center gap-2 w-full">
                                  {(sampleStep === 1
                                    ? sampleContents.link1_3
                                    : sampleContents.link2_3) && (
                                    <>
                                      <p
                                        className="w-12 flex-shrink-0 whitespace-nowrap "
                                        color="primary"
                                      >
                                        전문
                                      </p>
                                      <div className="flex-grow truncate">
                                        <Link
                                          target="_blank"
                                          href={
                                            sampleStep === 1
                                              ? sampleContents.link1_3
                                             : sampleContents.link2_3
                                          }
                                          className="block truncate"
                                        >
                                          {sampleStep === 1
                                            ? sampleContents.link1_3
                                            : sampleContents.link2_3}
                                        </Link>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {Array.from(selectedKeys).some(
                            (key) => key === "domestic" || key === "foreign"
                          ) && (
                            <ButtonGroup className="w-full justify-end p-3">
                              <Button
                                size="sm"
                                variant="flat"
                                onClick={() => setSampleStep(1)}
                                disabled={sampleStep === 1}
                              >
                                <FaChevronLeft />
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                onClick={() => setSampleStep(2)}
                                disabled={sampleStep === 2}
                              >
                                <FaChevronRight />
                              </Button>
                            </ButtonGroup>
                          )}
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Page;
