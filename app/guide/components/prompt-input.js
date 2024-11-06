"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { cn } from "@nextui-org/react";
import { GoPlusCircle } from "react-icons/go";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { Chip } from "@nextui-org/react";
import { Suspense } from "react";

const PromptInputContent = React.forwardRef(({ classNames = {}, ...props }, ref) => {
  const supabase = createClient();
  const [buckets, setBuckets] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isReady, setIsReady] = useState(false);
  const [selectedBuckets, setSelectedBuckets] = useState([]);

  useEffect(() => {
    if (searchParams) {
      const params = searchParams.getAll("bucketId")
        .flatMap(param => param.split("&"))
        .filter(Boolean);
      setSelectedBuckets(params);
      setIsReady(true);
    }
  }, [searchParams]);

  const fetchBucketsFromSupabase = async () => {
    const { data: existingBucket, error: fetchError } = await supabase
      .from("buckets")
      .select("*");

    if (existingBucket) {
      const processedBuckets = existingBucket
        .filter((bucket) => bucket.documents && bucket.documents.length > 0)
        .map((bucket) => ({
          bucketId: bucket.bucketId,
          documentName: bucket.documents[0].documentName || "제목 없음",
        }));
      setBuckets(processedBuckets);
    } else if (fetchError) {
      console.error("Error fetching bucket from Supabase:", fetchError);
    }
  };

  useEffect(() => {
    fetchBucketsFromSupabase();
  }, []);

  console.log("buckets:", buckets);
  console.log("selectedBuckets:", selectedBuckets);

  useEffect(() => {
    if (isReady && searchParams) {
      const params = new URLSearchParams(searchParams);
      params.delete("bucketId");
      params.append("bucketId", selectedBuckets.join("&"));

      router.push(`${pathname}?${params.toString()}`);
    }
  }, [selectedBuckets, isReady]);

  if (!isReady) {
    return null;
  }

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
      <div className="p-2 flex gap-2 items-center">
        <Popover placement="left">
          <PopoverTrigger>
            <Button
              size="sm"
              variant="bordered"
              startContent={<GoPlusCircle className="text-xs" />}
              className="bg-white border-2 border-gray-200 rounded-lg text-gray-500 text-xs flex-shrink-0"
            >
              데이터 변경
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-4">
            <CheckboxGroup
              value={selectedBuckets}
              onChange={setSelectedBuckets}
              className="flex flex-col gap-2"
            >
              {buckets.map((bucket) => (
                <Checkbox key={bucket.bucketId} value={bucket.bucketId}>
                  {bucket.documentName}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </PopoverContent>
        </Popover>
        <div className="flex gap-2 flex-wrap">
          {buckets
            .filter((bucket) => selectedBuckets.includes(bucket.bucketId))
            .map((bucket) => (
              <Chip
                key={bucket.bucketId}
                size="sm"
                color="primary"
                onClose={() => setSelectedBuckets(selectedBuckets.filter(id => id !== bucket.bucketId))}
                className="max-w-[100px]"
              >
                <span className="truncate max-w-12 block">
                  {bucket.documentName}
                </span>
              </Chip>
            ))}
        </div>
      </div>
    </>
  );
});

const PromptInput = React.forwardRef((props, ref) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptInputContent {...props} ref={ref} />
    </Suspense>
  );
});

export default PromptInput;

PromptInput.displayName = "PromptInput";
PromptInputContent.displayName = "PromptInputContent";
