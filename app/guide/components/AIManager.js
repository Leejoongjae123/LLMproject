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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import Conversation from "./conversation";
import { v4 as uuidv4 } from 'uuid';
function AIManager({ reference, setReference, selectedText, setSelectedText, chatReference, setChatReference }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedReferenceFileName, setSelectedReferenceFileName] =
    useState(null);
  const [selectedReferencePageName, setSelectedReferencePageName] =
    useState(null);
  const [selectedReferenceContext, setSelectedReferenceContext] =
    useState(null);
  const [chatList, setChatList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [writeLonger, setWriteLonger] = useState(false);
  const [writeShorter, setWriteShorter] = useState(false);
  const [refineSentence, setRefineSentence] = useState(false);
  const [selectedQuestionSeq, setSelectedQuestionSeq] = useState(null);
  
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatList, answerList]);

  // console.log("reference:", reference);

  useEffect(() => {
    if (selectedText.includes("이사회의 역할 및 책임")) {
      setSelectedQuestionSeq(0);
    } else if (selectedText.includes("관리 감독 체계")) {
      setSelectedQuestionSeq(1);
    } else if (selectedText.includes("경영진의 역할 및 감독 프로세스")) {
      setSelectedQuestionSeq(2);
    }
  }, [selectedText]);

  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatList.find(chat => chat.chatId === currentChatId);
      if (currentChat && currentChat.context) {
        setChatReference(currentChat.context);
      }
    }
  }, [currentChatId, chatList]);

  return (
    <div className="grid grid-rows-12 w-full h-[calc(100vh-11rem)]">
      <div className="row-span-2 w-full h-full flex flex-col gap-y-2">
        <Card className="bg-gray-200 w-full flex flex-col justify-center p-2">
          <div className="flex flex-col gap-y-2">
            <p className="text-center">
              생성된 초안 박스별로 EDK AI와 협업하실 수 있어요
            </p>
            <p className="text-center">
              퀵 AI 버튼과 대화를 통해서 초안을 수정해 보세요!
            </p>
          </div>
        </Card>
        <div className="flex flex-row gap-x-5 w-full justify-between py-2">
          <Button
            variant="bordered"
            startContent={<AiOutlineExpandAlt className="text-lg font-bold" />}
            className=""
            onPress={() => setWriteLonger((prev) => !prev)}
          >
            더 길게 쓰기
          </Button>
          <Button
            variant="bordered"
            startContent={<AiOutlineShrink className="text-lg font-bold" />}
            className=""
            onPress={() => setWriteShorter((prev) => !prev)}
          >
            더 짧게 쓰기
          </Button>
          <Button
            variant="bordered"
            startContent={<MdOutlineEdit className="text-lg font-bold" />}
            className=""
            onPress={() => setRefineSentence((prev) => !prev)}
          >
            문장 다듬기
          </Button>
        </div>
      </div>
      <div className="row-span-7 w-full flex flex-col gap-y-2 overflow-hidden">
        <div className="h-full overflow-y-auto flex-1 chat-container">
          {chatList.length === 0 && (
            <>
              <div className="w-full border border-gray-100 p-2 rounded-lg flex flex-row gap-x-2">
                <FaWandMagicSparkles className="text-lg font-bold" />
                <p className="text-start text-sm">
                  혹은 AI 매니저에게 요청을 직접 입력하실 수도 있어요
                </p>
              </div>
              <div className="w-full p-1 ">
                <Button
                  className="bg-white text-start text-sm text-[#247ee3] hover:text-[#4499ff] cursor-pointer transition-colors"
                  onClick={() =>
                    setChatList([
                      ...chatList,
                      {
                        role: "user",
                        message:
                          "기후 관련 이사회의 책임범위를 보다 구체적으로 작성해줘",
                        chatId: uuidv4()
                      },
                    ])
                  }
                >
                  기후 관련 이사회의 책임범위를 보다 구체적으로 작성해줘
                </Button>
              </div>
              <div className="w-full p-1 ">
                <Button
                  className="bg-white text-start text-sm text-[#247ee3] hover:text-[#4499ff] cursor-pointer transition-colors"
                  onClick={() =>
                    setChatList([
                      ...chatList,
                      {
                        role: "user",
                        message:
                          "경영진이 기후 리스크 평가를 어떻게 하고 있는지 내용을 추가해줘",
                        chatId: uuidv4()
                      },
                    ])
                  }
                >
                  경영진이 기후 리스크 평가를 어떻게 하고 있는지 내용을 추가해줘
                </Button>
              </div>
            </>
          )}
          {chatList.length > 0 && (
            <Conversation
              chatList={chatList}
              answerList={answerList}
              isLoading={isLoading}
              currentChatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
            />
          )}
        </div>
      </div>
      <div className="row-span-3 w-full flex flex-col justify-end z-50">
        <Accordion
          isCompact
          className="w-full mb-2 bg-gray-100 text-sm border-2 border-gray-200 rounded-lg"
        >
          <AccordionItem
            className="w-full text-sm"
            title={
              <span className="text-sm">
                초안 생성 출처(Reference) 확인하기
              </span>
            }
          >
            <div className="max-h-[30vh] overflow-y-auto">
              {chatReference.length > 0 ? (
                chatReference.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-2 p-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={() => {
                        setSelectedReferenceFileName(item.fileName);
                        setSelectedReferencePageName(item.pageName);
                        setSelectedReferenceContext(item.context);
                        onOpen();
                      }}
                    >
                      번호: {item.referenceIdx} / 파일명: {item.fileName} /
                      페이지: {item.pageName}
                    </Button>
                  </div>
                ))
              ) : (
                reference
                  .filter((item) => item.questionSeq === selectedQuestionSeq)
                  .map((item, index) => (
                    <div key={index} className="flex flex-col space-y-2 p-2">
                      <Button
                        variant="bordered"
                        size="sm"
                        onPress={() => {
                          setSelectedReferenceFileName(item.fileName);
                          setSelectedReferencePageName(item.pageName);
                          setSelectedReferenceContext(item.context);
                          onOpen();
                        }}
                      >
                        번호: {item.referenceIdx} / 파일명: {item.fileName} /
                        페이지: {item.pageName}
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </AccordionItem>
        </Accordion>
        <TextInputs
          chatList={chatList}
          setChatList={setChatList}
          answerList={answerList}
          setAnswerList={setAnswerList}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          reference={reference}
          setReference={setReference}
          selectedText={selectedText}
          setSelectedText={setSelectedText}
          writeLonger={writeLonger}
          writeShorter={writeShorter}
          refineSentence={refineSentence}
          setWriteLonger={setWriteLonger}
          setWriteShorter={setWriteShorter}
          setRefineSentence={setRefineSentence}
          chatReference={chatReference}
          setChatReference={setChatReference}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
        />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-xl font-bold">초안 생성 출처</p>
                <hr className="my-2" />
                <p className="font-medium">
                  파일명: {selectedReferenceFileName}
                </p>
                <p className="font-medium">
                  페이지: {selectedReferencePageName}
                </p>
              </ModalHeader>
              <ModalBody className="max-h-[50vh] overflow-y-auto">
                <p className="text-xl font-bold">본문 내용</p>
                <p>{selectedReferenceContext}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AIManager;
