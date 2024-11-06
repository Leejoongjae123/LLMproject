"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  CardFooter,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { FaRegFolder } from "react-icons/fa6";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import axios from "axios";
import { IoMdRefresh } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { createClient } from "@/utils/supabase/client";
// 가상의 버킷 및 파일 데이터
const initialBuckets = [
  { id: 1, name: "버킷1" },
  { id: 2, name: "버킷2" },
  { id: 3, name: "버킷3" },
];

const initialFiles = {
  1: [
    { name: "document1.pdf", size: "1.2 MB" },
    { name: "document2.docx", size: "800 KB" },
  ],
  2: [
    { name: "image1.jpg", size: "2.5 MB" },
    { name: "image2.png", size: "1.8 MB" },
  ],
  3: [{ name: "video1.mp4", size: "15 MB" }],
};

export default function BucketFileManager() {
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = createClient();
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
  const [newBucketName, setNewBucketName] = useState(""); // New state for bucket name
  const [isLoading, setIsLoading] = useState(false);
  const tooltipContent = `첨부된 파일은 AI 초안을 완성하는데 활용돼요. 공시자료 파일을 업로드해주세요.\n
    
    업로드된 데이터를 바탕으로 문장이 생성되며, 좋은 답변을 받기 위한 파트별 추천자료를 안내 드립니다.
    다만, 대외비 문서나 민감한 자료는 업로드를 삼가해 주세요.
    -추천 데이타 : 사업보고서,지속가능경영보고서,기업지배구조보고서,TCFD,CDP,SASB 등
    `;
  const apiKey = process.env.NEXT_PUBLIC_SCIONIC_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_SCIONIC_BASE_URL;
  const agentId = process.env.NEXT_PUBLIC_SCIONIC_AGENT_ID;
  console.log(apiKey, baseUrl, agentId);

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

      const results = response.data;

      setBuckets(results.data.data);
      setSelectedBucket(results.data.data[0]);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setErrorMessage(
        "한 번에 한 개의 파일만 업로드할 수 있습니다. 파일을 다시 선택해주세요."
      );
      onOpen2();
      return;
    }
    if (files.length > 0) {
      setErrorMessage(
        "버킷 한개당 한개 파일만 등록 가능합니다. 기존 파일을 삭제해주세요."
      );
      onOpen2();
      return;
    }
    const supportedExtensions = [
      "PDF",
      "DOCX",
      "XLSX",
      "XLS",
      "PPTX",
      "PPT",
      "HWP",
      "HWPX",
      "CSV",
    ];
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes

    for (const file of acceptedFiles) {
      const fileExtension = file.name.split(".").pop().toUpperCase();
      if (!supportedExtensions.includes(fileExtension)) {
        setErrorMessage(
          "지원되지 않는 파일입니다. PDF, DOCX, XLSX, XLS, PPTX, PPT, HWP, HWPX, CSV 파일만 업로드 가능합니다."
        );
        onOpen2();
        return;
      }
      if (file.size > maxFileSize) {
        setErrorMessage(
          "파일 용량이 10MB가 넘습니다. 10MB 이내 파일만 업로드 가능합니다."
        );
        onOpen2();
        return;
      }
    }

    const uploadFile = async (bucketId, file) => {
      const ENDPOINT = "/api/v2/documents/by-file";
      const FULL_URL = baseUrl + ENDPOINT;
      const data = new FormData();
      data.append("bucketId", bucketId);
      data.append("file", file);

      try {
        const response = await axios.post(FULL_URL, data, {
          headers: {
            "storm-api-key": apiKey,
            "Content-Type": "multipart/form-data",
          },
        });
        const results = response.data;
        console.log("Upload results:", results);
        return results;
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    };

    for (const file of acceptedFiles) {
      await uploadFile(selectedBucket.id, file);
    }

    // Fetch the updated file list after all uploads are complete
    fetchFileList(agentId, selectedBucket.id);

  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const openAddBucketModal = () => {
    setNewBucketName(""); // Reset the input field
    onOpen1(); // Open the modal
  };

  const createBucket = async () => {



    if (newBucketName.trim() === "") return; // Prevent empty bucket names

    const ENDPOINT = `/api/v2/buckets`;
    const FULL_URL = baseUrl + ENDPOINT;
    const data = {
      agentId: agentId,
      name: newBucketName,
    };

    try {
      const response = await axios.post(FULL_URL, data, {
        headers: {
          "storm-api-key": apiKey,
        },
      });

      const results = response.data;
      console.log(results);

      // Optionally, update the state with the new bucket from the response
      const newBucket = {
        id: results.data.id, // Assuming the response contains the new bucket ID
        name: newBucketName,
      };

      const { data: existingBucket, error: fetchError } = await supabase
        .from('buckets')
        .select('bucketId')
        .eq('bucketId', newBucket.id)
        .single();

      if (!existingBucket) {
        const { data: insertData, error: insertError } = await supabase
          .from('buckets')
          .insert([{ bucketId: newBucket.id, bucketName: newBucketName }]);

        if (insertError) {
          console.error("Error inserting new bucket into Supabase:", insertError);
        } else {
          console.log("New bucket inserted into Supabase:", insertData);
        }
      } else if (fetchError) {
        console.error("Error fetching bucket from Supabase:", fetchError);
      }

      fetchBuckets();
    } catch (error) {
      console.error("Error creating bucket:", error);
    } finally {
      onOpenChange1(false); // Close the modal
    }
  };
  const fetchFileList = async (agentId, bucketId) => {
    const BASE_URL = process.env.NEXT_PUBLIC_SCIONIC_BASE_URL; // Ensure this is set in your environment variables
    const SIONIC_API_KEY = process.env.NEXT_PUBLIC_SCIONIC_API_KEY; // Ensure this is set in your environment variables

    const ENDPOINT = `/api/v2/documents`;
    const FULL_URL = BASE_URL + ENDPOINT;
    const params = {
      agentId: agentId,
      bucketId: bucketId,
      page: 1,
      size: 100,
    };

    try {
      const response = await axios.get(FULL_URL, {
        headers: {
          "storm-api-key": SIONIC_API_KEY,
        },
        params: params,
      });

      const results = response.data;
      console.log('results:',results)
      const { data: existingBucket, error: fetchError } = await supabase
        .from('buckets')
        .select('*')
        .eq('bucketId', bucketId)
      console.log("existingBucket:", existingBucket);
      if (existingBucket.length > 0) {
        const documents = results.data.data.map((file) => ({
          documentId: file.id,
          documentName: file.name,
        }));
        console.log("업데이트시작")
        const { data: updateData, error: updateError } = await supabase
          .from('buckets')
          .update({ documents: documents })
          .eq('bucketId', bucketId);

        if (updateError) {
          console.error("Error updating documents in Supabase:", updateError);
        } else {
          console.log("Documents updated in Supabase:", updateData);
        }
      } else if (fetchError) {
        console.error("Error fetching bucket from Supabase:", fetchError);
      }

      setFiles(results.data.data); // Optionally, you can return the results to be used elsewhere in your component
      return results;
    } catch (error) {
      console.error("Error fetching file list:", error);
      return null;
    }
  };

  const deleteDocument = async (documentId) => {
    const ENDPOINT = `/api/v2/documents/${documentId}`;
    const FULL_URL = baseUrl + ENDPOINT;

    try {
      const response = await axios.delete(FULL_URL, {
        headers: {
          "storm-api-key": apiKey,
        },
      });

      const results = response.data;
      console.log(results);

      // Optionally, update the state or perform other actions with the results
      // For example, you might want to remove the deleted document from the UI
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== documentId)
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    if (selectedBucket) {
      fetchFileList(agentId, selectedBucket?.id);
    }
  }, [selectedBucket]);
  useEffect(() => {
    fetchBuckets();
  }, []);

  console.log("files:", files);
  console.log("buckets:", buckets);

  return (
    <div className="flex h-[calc(100vh-6rem)] p-12">
      <Card className="w-1/4 mr-4 p-3">
        <CardHeader>
          <h2 className="text-lg font-bold">버킷명</h2>
        </CardHeader>
        <CardBody className="overflow-y-auto h-[calc(100vh-12rem)]">
          {buckets.map((bucket) => (
            <Button
              key={bucket.id}
              className={`mb-2 w-full justify-start min-h-12 ${
                selectedBucket.id === bucket.id
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
              startContent={
                <FaRegFolder
                  className={`${
                    selectedBucket.id === bucket.id
                      ? "text-white"
                      : "text-black"
                  }`}
                />
              }
              onPress={() => setSelectedBucket(bucket)}
            >
              {bucket.name}
            </Button>
          ))}
        </CardBody>
        <CardFooter>
          <Button
            variant="bordered"
            className="mt-4 w-full min-h-12"
            onPress={openAddBucketModal}
          >
            버킷 추가
          </Button>
        </CardFooter>
      </Card>

      {/* 우측 파일 리스트 및 업로드 영역 */}
      <Card className="w-3/4 p-3">
        <CardHeader>
          <div className="w-full flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">
                {selectedBucket?.name} 파일리스트
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <Button
                startContent={<IoMdRefresh className="font-bold text-2xl" />}
                variant="light"
                onPress={() => {
                  fetchFileList(agentId, selectedBucket?.id);
                }}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex">
            <p className="text-sm text-gray-500 mb-4">기본자료 리스트 </p>
            <Tooltip
              className="z-50"
              content={
                <div className="px-1 py-2">
                  <p>
                    첨부된 파일은 AI 초안을 완성하는데 활용돼요. 공시자료 파일을
                    업로드해주세요.
                  </p>
                  <br />
                  <p>
                    업로드된 데이터를 바탕으로 문장이 생성되며, 좋은 답변을 받기
                    위한 파트별 추천자료를 안내 드립니다.
                  </p>
                  <p>
                    다만, 대외비 문서나 민감한 자료는 업로드를 삼가해 주세요.
                  </p>
                  <p>
                    -추천 데이타 :
                    사업보고서,지속가능경영보고서,기업지배구조보고서,TCFD,CDP,SASB
                    등
                  </p>
                </div>
              }
            >
              <div>
                <IoMdInformationCircleOutline className="text-xs" />
              </div>
            </Tooltip>
          </div>
          <div
            {...getRootProps()}
            className={`p-4 mb-4 h-32 flex flex-col justify-center items-center border-2 border-dashed rounded-lg text-center ${
              isDragActive ? "border-primary bg-primary/20" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>파일을 드래그해주시거나 PC에서 직접 선택해주세요</p>
            )}
            <div className="flex">
              <p className="text-sm text-gray-500">
                확장자:PDF, DOCX, XLSX, XLS, PPTX, PPT, HWP, HWPX, CSV
                (최대10MB)
              </p>
              <Tooltip
                className="z-50"
                content={
                  <div className="px-1 py-2">
                    <p>
                      업로드 하는 파일이 10MB를 초과할 경우 마크스폰
                      컨설턴트에게 문의 주세요
                    </p>
                  </div>
                }
              >
                <div>
                  <IoMdInformationCircleOutline className="text-xs text-gray-500" />
                </div>
              </Tooltip>
            </div>
          </div>
          <Table aria-label="Files table">
            <TableHeader>
              <TableColumn className="w-1/5 text-center">파일명</TableColumn>
              <TableColumn className="w-1/5 text-center">날짜</TableColumn>
              <TableColumn className="w-1/5 text-center">글자수</TableColumn>
              <TableColumn className="w-1/5 text-center">상태</TableColumn>
              <TableColumn className="w-1/5 text-center">비고</TableColumn>
            </TableHeader>
            <TableBody>
              {files?.map((file, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{file.name}</TableCell>
                  <TableCell className="text-center">
                    {formatDateToKorean(file.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {file.characters}
                  </TableCell>
                  <TableCell
                    className={`text-center font-bold ${
                      file.status === "completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {file.status}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="light"
                      onPress={() => deleteDocument(file.id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                버킷 만들기
              </ModalHeader>
              <ModalBody>
                <Input
                  label="버킷명"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)} // Update state on input change
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={createBucket}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">에러</ModalHeader>
              <ModalBody>
                <p>버킷 생성에 실패했습니다.</p>
                <p>{errorMessage}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onOpenChange2}>
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

function formatDateToKorean(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}${month}${day} ${hours}:${minutes}`;
}
