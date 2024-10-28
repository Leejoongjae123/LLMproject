"use client";

import React, { useState } from "react";
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
  const [buckets, setBuckets] = useState(initialBuckets);
  const [selectedBucket, setSelectedBucket] = useState(buckets[0]);
  const [files, setFiles] = useState(initialFiles);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newBucketName, setNewBucketName] = useState(""); // New state for bucket name

  const onDrop = (acceptedFiles) => {
    setFiles((prev) => ({
      ...prev,
      [selectedBucket.id]: [
        ...prev[selectedBucket.id],
        ...acceptedFiles.map((file) => ({
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        })),
      ],
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const openAddBucketModal = () => {
    setNewBucketName(""); // Reset the input field
    onOpen(); // Open the modal
  };

  const createBucket = () => {
    if (newBucketName.trim() === "") return; // Prevent empty bucket names
    const newBucket = {
      id: Date.now(),
      name: newBucketName,
    };
    setBuckets([...buckets, newBucket]);
    setFiles({ ...files, [newBucket.id]: [] });
    onOpenChange(false); // Close the modal
  };

  return (
    <div className="flex h-screen  p-4">
      {/* 좌측 버킷 리스트 */}
      <Card className="w-1/4 mr-4">
        <CardHeader>
          <h2 className="text-lg font-bold">버킷명</h2>
        </CardHeader>
        <CardBody>
          {buckets.map((bucket) => (
            <Button
              key={bucket.id}
              className={`mb-2 w-full justify-start bg-gray-100 ${
                selectedBucket.id === bucket.id ? "bg-primary" : ""
              }`}
              startContent={<FaRegFolder className="text-black" />}
              onPress={() => setSelectedBucket(bucket)}
            >
              {bucket.name}
            </Button>
          ))}
          <Button
            variant="bordered"
            className="mt-4 w-full"
            onPress={openAddBucketModal} // Open modal on button press
          >
            버킷 추가
          </Button>
        </CardBody>
      </Card>

      {/* 우측 파일 리스트 및 업로드 영역 */}
      <Card className="w-3/4">
        <CardHeader>
          <h2 className="text-lg font-bold">
            {selectedBucket.name} 파일리스트
          </h2>
        </CardHeader>
        <CardBody>
          <div
            {...getRootProps()}
            className={`p-4 mb-4 border-2 border-dashed rounded-lg text-center ${
              isDragActive ? "border-primary bg-primary/20" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
          <Table aria-label="Files table">
            <TableHeader>
              <TableColumn className="w-1/4">파일명</TableColumn>
              <TableColumn className="w-1/4">사이즈</TableColumn>
              <TableColumn className="w-1/4">업로드일자</TableColumn>
              <TableColumn className="w-1/4">상태</TableColumn>
            </TableHeader>
            <TableBody>
              {files[selectedBucket.id]?.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>2024-01-01</TableCell>
                  <TableCell>업로드완료</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
    </div>
  );
}
