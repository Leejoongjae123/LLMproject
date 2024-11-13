"use client";
import React, { useState, useEffect } from "react";
import { CircularProgress } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { MdRefresh } from "react-icons/md";

function AIAnalysis({ currentText, setCurrentText, analysis, setAnalysis, isLoadingAIAnalysis, setIsLoadingAIAnalysis, handleSecondQuestion, selectedText }) {
  const [guideText, setGuideText] = useState("");
  const [analysisText, setAnalysisText] = useState("");

  const formatAnalysisText = (text) => {
    if (!text) return '';
    // Bold text between ** markers
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace - with line breaks
    formattedText = formattedText.replace(/\s*-\s*/g, '<br/>- ');
    return formattedText;
  };

  const handleGuideTextChange = () => {
    const categories = {
      "이사회의 역할 및 책임":
        "<strong>기후 관련 위험과 기회에 대한 책임과 역할</strong>이 명확히 정의된 <strong>의사결정기구의 정보 및 운영 규정</strong>이 명확히 설명되어야 해요. 또한, <strong>기후변화 대응을 위한 기업의 전문성과 역량 강화</strong> 노력이 어떤지 작성해 주세요.",
      "관리 감독 체계":
        "<strong>기후 관련 위험 및 기회 관련 정보</strong>를 제공하는 <strong>정기적인 보고 체계</strong>가 어떻게 구축되어 있는지 설명해 주세요. 또한 이러한 체계가 <strong>조직 내 의사결정에 어떻게 기여하는지</strong> 구체적으로 작성되면 좋습니다.<br/><br/> <strong>투자 및 경영 계획에 기후 리스크와 기회를 반영하기 위한 역할과 책임</strong>이 어떻게 설정되어 있는지, <strong>경영 관련 의사결정 시 기후 요소가 어떻게 연계</strong>되는지 명확히 설명해 주세요.<br/><br/> <strong>기후 관련 목표 설정과 이를 모니터링하는 체계</strong>가 잘 구축되어 있는지, <strong>성과 기반 보상 정책</strong>에 이러한 목표가 반영되고 있는지 작성해 주세요",
      "경영진의 역할 및 감독 프로세스":
        "<strong>기후 변화 대응을 위한 경영진의 보고 및 감독 프로세스</strong>가 어떻게 마련되어 있는지 작성해 주세요. 특히, <strong>기후 관련 위험 및 기회 대응을 위해 전담 조직</strong>이 지정되어 있는지와 <strong>정기적인 보고 체계가 어떻게 운영</strong>되는지 설명해 주시면 좋아요.<br/><br/> 또한, <strong>전사 차원의 리스크 관리 체계에 기후 관련 리스크가 어떻게 통합</strong>되어 있는지, <strong>내부 통제 시스템을 통해 기후 리스크를 효과적으로 관리하고 있는지</strong> 구체적으로 작성해 주세요.",
    };

    const matchedCategory = Object.keys(categories).find((category) =>
      selectedText?.includes(category)
    );

    if (matchedCategory) {
      setGuideText(categories[matchedCategory]);
    }
  };

  const handleAnalysisText = () => {
    const categories = [
      "이사회의 역할 및 책임",
      "관리 감독 체계",
      "경영진의 역할 및 감독 프로세스",
    ];

    const matchedCategory = categories.find((category) =>
      selectedText?.includes(category)
    );

    if (matchedCategory) {
      const index = categories.indexOf(matchedCategory);
      setAnalysisText(formatAnalysisText(analysis[index]));
    }
  };

  useEffect(() => {
    handleGuideTextChange();
    handleAnalysisText();
  }, [selectedText,isLoadingAIAnalysis]);



  
  return (
    <div className="grid grid-rows-3 gap-5 w-full h-full">
      <div className="row-span-1 flex flex-col gap-3">
        <h1 className="font-bold">해당 박스에는 아래 내용이 주로 작성되어야 해요.</h1>
        {/* <div
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300"
          dangerouslySetInnerHTML={{ __html: guideText }}
        /> */}
        <Card className="bg-gray-200 w-full flex flex-col justify-center p-2  overflow-y-auto py-5">
          <p
            className="text-start h-full overflow-y-auto text-sm"
            dangerouslySetInnerHTML={{ __html: guideText }}
          />
        </Card>
      </div>

      <div className="row-span-2 flex flex-col gap-3 justify-between items-center w-full h-full py-10">
        <div className="flex gap-3 justify-between items-center w-full">
          <h1 className="font-bold">AI 진단 결과</h1>

          <div>
            <Button
              startContent={
                isLoadingAIAnalysis ? (
                  <div role="status">
                    <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-[#F25B2B]"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                    </svg>
                  </div>
                ) : <MdRefresh className="text-2xl font-bold"/>
              }
              disabled={isLoadingAIAnalysis}
              className="p-5"
              variant="bordered"
              onClick={() => handleSecondQuestion(currentText)}
            >
              <p>AI진단 다시하기</p>
            </Button>
          </div>
        </div>

        <Card className="bg-gray-200 w-full flex flex-col p-2 h-full">
          <p
            className="text-start overflow-y-auto px-2 text-sm"
            dangerouslySetInnerHTML={{ __html: analysisText }}
          />
        </Card>
      </div>
    </div>
  );
}

export default AIAnalysis;
