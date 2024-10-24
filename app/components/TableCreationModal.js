"use client";
import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
} from "@nextui-org/react";

const TableCreationModal = ({
  isOpen,
  onClose,
  onOpenChange,
  createDefaultTable,
  createOptionalTable,
  years,
  setYears,
  subsidiaries,
  setSubsidiaries,
  categories,
  setCategories,
}) => {
  const [step, setStep] = useState(1);
  const [scopes, setScopes] = useState([
    "Scope 1(직접 배출)",
    "Scope 2(간접 배출)",
  ]);
  // const [years, setYears] = useState(["2024"]);
  // const [subsidiaries, setSubsidiaries] = useState([
  //   "종속기업 없음(지배 기업만 공시)",
  // ]);
  // const [categories, setCategories] = useState([
  //   "Category 1 제품 서비스 구매",
  //   "Category 2 자본",
  //   "Category 3 구매연료/에너지",
  //   "Category 4 Upstream 운송&유통",
  //   "Category 5 사업장 발생 폐기물",
  // ]);
  const [hasScope3, setHasScope3] = useState(false);

  const handleNext = () => {
    if (step < (hasScope3 ? 4 : 3)) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Step 1: 공시할 데이터의 범위를 선택해 주세요</h3>
            {[
              "Scope 1(직접 배출)",
              "Scope 2(간접 배출)",
              "Scope 3(기타 간접 배출)",
            ].map((scope) => (
              <Checkbox
                classNames={{
                  wrapper:
                    "group-data-[selected=true]:border-[#F25B2B] group-data-[selected=true]:bg-[#F25B2B]",
                }}
                key={scope}
                isSelected={scopes.includes(scope)}
                onValueChange={(isSelected) => {
                  if (scope === "Scope 3(기타 간접 배출)") {
                    setScopes(
                      isSelected
                        ? [...scopes, scope]
                        : scopes.filter((s) => s !== scope)
                    );
                    setHasScope3(isSelected);
                  }
                }}
                isDisabled={scope !== "Scope 3(기타 간접 배출)"}
              >
                {scope}
              </Checkbox>
            ))}
          </>
        );
      case 2:
        return (
          <>
            <h3>Step 2: 공시할 데이터의 연도를 선택해 주세요</h3>
            {["2022", "2023", "2024"].map((year) => (
              <Checkbox
                key={year}
                isSelected={years.includes(year)}
                onValueChange={(isSelected) => {
                  if (isSelected) {
                    setYears([...years, year]);
                  } else {
                    // 마지막 남은 항목을 선택 해제하려고 할 때 방지
                    if (years.length > 1) {
                      setYears(years.filter((y) => y !== year));
                    }
                  }
                }}
              >
                {year}
              </Checkbox>
            ))}
          </>
        );
      case 3:
        return (
          <>
            <h3>
              Step 3: 공시할 데이터의 보고에 포함할 종속기업을 모두 선택해
              주세요
            </h3>
            {[
              "종속기업 없음(지배 기업만 공시)",
              "Linkedin",
              "GitHub",
              "Skype",
            ].map((subsidiary) => (
              <Checkbox
                key={subsidiary}
                isSelected={subsidiaries.includes(subsidiary)}
                onValueChange={(isSelected) => {
                  if (subsidiary === "종속기업 없음(지배 기업만 공시)") {
                    setSubsidiaries(isSelected ? [subsidiary] : []);
                  } else {
                    setSubsidiaries((prevSubsidiaries) => {
                      let newSubsidiaries = isSelected
                        ? [...prevSubsidiaries, subsidiary]
                        : prevSubsidiaries.filter((s) => s !== subsidiary);
                      newSubsidiaries = newSubsidiaries.filter(
                        (s) => s !== "종속기업 없음(지배 기업만 공시)"
                      );
                      // Ensure at least one subsidiary is selected
                      return newSubsidiaries.length === 0
                        ? [subsidiary]
                        : newSubsidiaries;
                    });
                  }
                }}
                // isDisabled={subsidiaries.length === 1 && subsidiaries.includes(subsidiary)}
              >
                {subsidiary}
              </Checkbox>
            ))}
          </>
        );
      case 4:
        return (
          <>
            <h3>Step 4: Scope3에 공시할 데이터의 카테고리를 선택해주세요</h3>
            {[
              "Category 1 제품 서비스 구매",
              "Category 2 자본",
              "Category 3 구매연료/에너지",
              "Category 4 Upstream 운송&유통",
              "Category 5 사업장 발생 폐기물",
              "Category 6 임직원 출장",
              "Category 7 통근",
              "Category 8 리스자산(Upstream)",
              "Category 9 Downstream 운송&유통",
              "Category 10 판매제품 가공",
              "Category 11 판매 제품 사용",
              "Category 12 판매 제품 폐기",
              "Category 13 리스자산(Downstream)",
              "Category 14 프랜차이즈",
              "Category 15 투자",
            ].map((category) => (
              <Checkbox
                key={category}
                isSelected={categories.includes(category)}
                onValueChange={(isSelected) => {
                  setCategories(
                    isSelected
                      ? [...categories, category]
                      : categories.filter((c) => c !== category)
                  );
                }}
              >
                {category}
              </Checkbox>
            ))}
          </>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              테이블 생성하기
            </ModalHeader>
            <ModalBody>{renderStepContent()}</ModalBody>
            <ModalFooter>
              {step > 1 && (
                <Button
                  variant="bordered"
                  onPress={handleBack}
                  className="border-[#F25B2B] text-[#F25B2B]"
                >
                  Back
                </Button>
              )}
              {step === 1 && (
                <Button
                  variant="bordered"
                  className="border-[#F25B2B] text-[#F25B2B]"
                  onPress={createDefaultTable}
                >
                  기본 테이블 생성
                </Button>
              )}
              {step < 3 || (hasScope3 && step < 4) ? (
                <Button
                  color="primary"
                  onPress={handleNext}
                  className="bg-[#F25B2B] hover:bg-[#F25B2B]/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  color="primary"
                  onPress={() => {
                    if (step === 3) {
                      createDefaultTable();
                    } else if (step === 4) {
                      createDefaultTable();
                      createOptionalTable();
                    }
                    setStep(1);
                    onClose();
                  }}
                  className="bg-[#F25B2B] hover:bg-[#F25B2B]/90"
                >
                  Create
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TableCreationModal;
