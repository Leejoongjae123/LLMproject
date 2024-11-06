"use client";

import React from "react";
import {
  Avatar,
  Button,
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
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { usePathname} from "next/navigation";
import axios from "axios";
import { AcmeIcon } from "./acme";
import SidebarDrawer from "./sidebar-drawer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
function AvatarDropdownIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3076_10614)">
        <path
          d="M6.6665 7.50008L9.99984 4.16675L13.3332 7.50008"
          stroke="#A1A1AA"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <path
          d="M13.3332 12.5L9.99984 15.8333L6.6665 12.5"
          stroke="#A1A1AA"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3076_10614">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  );
}

function RecentPromptDropdown() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Icon
          className="hidden text-default-500 group-hover:block"
          icon="solar:menu-dots-bold"
          width={24}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown menu with icons"
        className="py-2"
        variant="faded"
      >
        <DropdownItem
          key="share"
          className="text-default-500 data-[hover=true]:text-default-500"
          startContent={
            <Icon
              className="text-default-300"
              height={20}
              icon="solar:square-share-line-linear"
              width={20}
            />
          }
        >
          Share
        </DropdownItem>
        <DropdownItem
          key="rename"
          className="text-default-500 data-[hover=true]:text-default-500"
          startContent={
            <Icon
              className="text-default-300"
              height={20}
              icon="solar:pen-linear"
              width={20}
            />
          }
        >
          Rename
        </DropdownItem>
        <DropdownItem
          key="archive"
          className="text-default-500 data-[hover=true]:text-default-500"
          startContent={
            <Icon
              className="text-default-300"
              height={20}
              icon="solar:folder-open-linear"
              width={20}
            />
          }
        >
          Archive
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger-500 data-[hover=true]:text-danger-500"
          color="danger"
          startContent={
            <Icon
              className="text-danger-500"
              height={20}
              icon="solar:trash-bin-minimalistic-linear"
              width={20}
            />
          }
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function Component({
  children,
  header,
  title,
  subTitle,
  classNames = {},
}) {
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const apiKey = process.env.NEXT_PUBLIC_SCIONIC_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_SCIONIC_BASE_URL;
  const agentId = process.env.NEXT_PUBLIC_SCIONIC_AGENT_ID;
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchBuckets = async () => {
    const ENDPOINT = `/api/v2/buckets`;
    const FULL_URL = baseUrl + ENDPOINT;
    const params = {
      agentId: agentId,
      page: 1,
      size: 100,
    };

    try {
      setIsLoading(true);
      const response = await axios.get(FULL_URL, {
        headers: {
          "storm-api-key": apiKey,
        },
        params: params,
      });

      setBuckets(response.data.data.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBucketsFromSupabase = async () => {
    const { data: existingBucket, error: fetchError } = await supabase
      .from('buckets')
      .select('*')
      .eq('agentId', agentId);

    if (existingBucket) {
      const processedBuckets = existingBucket
        .filter(bucket => bucket.documents && bucket.documents.length > 0)
        .map(bucket => ({
          bucketId: bucket.bucketId,
          documentName: bucket.documents[0].documentName || '제목 없음'
        }));
      setBuckets(processedBuckets);
    } else if (fetchError) {
      console.error("Error fetching bucket from Supabase:", fetchError);
    }
  };

  const handleAIReport = () => {
    fetchBucketsFromSupabase();
    onOpen2();
  };

  const handleCheckboxChange = (values) => {
    const selectedBuckets = buckets
      .filter(bucket => values.includes(bucket.bucketId))
      .map(bucket => ({
        bucketId: bucket.bucketId,
        documentName: bucket.documentName
      }));
    setSelectedBucket(selectedBuckets);
  };

  const content = (
    <div className="relative flex h-full w-40 flex-1 flex-col p-6 bg-[#444444]">
      <div className="flex items-center gap-2 px-2 my-5">
        <span className="text-white text-4xl font-bold uppercase leading-6 text-foreground">
          <Link href="/select">EDK</Link>
        </span>
      </div>

      <Spacer y={8} />

      <ScrollShadow className="-mr-6 h-full max-h-full pr-6">
        <Listbox aria-label="Recent chats" variant="flat">
          <ListboxSection
            classNames={{
              base: "py-0",
              heading: "py-0 pl-[10px] text-small text-default-400",
            }}
          >
            <ListboxItem
              key="financial-planning"
              className="group h-[44px] px-[12px] py-5 text-gray-400"
            >
              대시보드
            </ListboxItem>
            <ListboxItem
              key="email-template"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              인벤토리
            </ListboxItem>
            <ListboxItem
              key="react-19-example"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              진단
            </ListboxItem>
            <ListboxItem
              key="custom-support-message"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              보고서
            </ListboxItem>
            <ListboxItem
              key="resignation-letter"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              공시
            </ListboxItem>
            <ListboxItem
              key="design-test-review"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              게시판
            </ListboxItem>
            <ListboxItem
              key="design-system-modules"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              설정{" "}
            </ListboxItem>
            <ListboxItem
              key="how-a-taximeter-works"
              className="h-[44px] px-[12px] py-[10px] text-gray-400"
            >
              AI보고서
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </ScrollShadow>

      <Spacer y={8} />
    </div>
  );
  console.log("buckets222", buckets);
  console.log("selectedBucket:", selectedBucket);
  return (
    <div className="w-screen h-screen flex py-4 px-4 overflow-hidden">
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                업로드 파일 목록
              </ModalHeader>
              <ModalBody>
                <CheckboxGroup
                  label="파일선택"
                  defaultValue={[]}
                  className="max-h-[300px] overflow-y-auto"
                  onChange={handleCheckboxChange}
                >
                  {buckets.map((bucket, index) => (
                    <Checkbox key={index} value={bucket.bucketId}>
                      {bucket.documentName}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => {
                  onClose();
                  if (selectedBucket.length > 0) {
                    router.push("/guide?bucketId=" + selectedBucket.map(b => b.bucketId).join('&'));
                  }
                }}>
                  AI 초안 생성
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <SidebarDrawer
        className="h-full rounded-[14px] bg-default-50 overflow-hidden"
        isOpen={isOpen1}
        onOpenChange={onOpenChange1}
      >
        {content}
      </SidebarDrawer>
      <div className="flex w-full h-full flex-col px-4 overflow-hidden">
        <header
          className={cn(
            "flex h-16 min-h-16 items-center justify-between gap-2 rounded-none rounded-t-medium border-small border-divider px-4 py-3",
            classNames?.["header"]
          )}
        >
          <Button
            isIconOnly
            className="flex sm:hidden"
            size="sm"
            variant="light"
            onPress={onOpen1}
          >
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:hamburger-menu-outline"
              width={24}
            />
          </Button>
          {(title || subTitle) && (
            <div className="w-full min-w-[120px] sm:w-auto">
              <div className="truncate text-small font-semibold leading-5 text-foreground">
                {title}
              </div>
              <div className="truncate text-small font-normal leading-5 text-default-500">
                {subTitle}
              </div>
            </div>
          )}

          <p className="text-2xl font-bold px-3">{header}</p>
          <div className="flex gap-5">
            <Button
              radius="full"
              variant="bordered"
              className="w-[10vw] h-10 font-bold text-lg text-[#f25b2b] border-primary"
              onPress={() => router.back()}
            >
              이전
            </Button>
            <Button
              radius="full"
              className="w-[10vw] h-10 font-bold text-lg bg-[#f25b2b] text-white"
              color="primary"
              onPress={handleAIReport}
            >
              다음
            </Button>
          </div>
        </header>
        <main className="h-full overflow-auto">
          <div className="flex h-full w-full flex-col gap-4 rounded-none rounded-b-medium border-0 border-b border-l border-r border-divider">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
