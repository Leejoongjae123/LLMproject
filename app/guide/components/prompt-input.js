"use client";

import React from "react";
import {Button,Textarea, Popover, PopoverTrigger, PopoverContent, Checkbox} from "@nextui-org/react";
import {cn} from "@nextui-org/react";
import { GoPlusCircle } from "react-icons/go";

const PromptInput = React.forwardRef(({classNames = {}, ...props}, ref) => {
  return (
    <>
    <Textarea
      ref={ref}
      aria-label="Prompt"
      className="min-h-[40px] bg-white border-2 border-gray-200 rounded-lg relative"
      classNames={{
        ...classNames,
        label: cn("hidden", classNames?.label),
        input: cn("py-0", classNames?.input),
        innerWrapper: cn("bg-white", classNames?.innerWrapper),
        base: cn("border border-gray-100", classNames?.base),
      }}
      minRows={1}
      placeholder="EDK AI 매니저에게 무엇이든 물어보세요"
      radius="lg"
      variant="flat"
      {...props}
    />

    <Popover placement="left">
      <PopoverTrigger>
        <Button 
          size='sm' 
          variant="bordered" 
          startContent={<GoPlusCircle className="text-xs"/>} 
          className="absolute bottom-10 left-10 bg-white border-2 border-gray-200 rounded-lg text-gray-500 text-xs"
        >
          데이터 변경
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <div className="flex flex-col gap-2">
          <Checkbox defaultSelected={false}>
            옵션 1
          </Checkbox>
          <Checkbox defaultSelected={false}>
            옵션 2
          </Checkbox>
          <Checkbox defaultSelected={false}>
            옵션 2
          </Checkbox>
          <Checkbox defaultSelected={false}>
            옵션 2
          </Checkbox>
          <Checkbox defaultSelected={false}>
            옵션 2
          </Checkbox>
          
          <Checkbox defaultSelected={false}>
            옵션 3
          </Checkbox>
        </div>
      </PopoverContent>
    </Popover>
 
    </>
  );
});

export default PromptInput;

PromptInput.displayName = "PromptInput";
