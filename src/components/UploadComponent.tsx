"use client";

import React, { useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { server } from "@/lib/utils";

const UploadComponent = () => {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const handleFileButtonClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);

      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("pdf", file); // field name must match multer
      });

      startTransition(async () => {
        try {
          const res = await axios.post(
            `${server}/upload/pdf`,
            formData,
            {
              withCredentials: true, // ✅ Sends cookies with request
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (res.data.success) {
            const sessionId = res.data.sessionId
            router.push(`/workspace/${sessionId}`);
          }
        } catch (err) {
          console.error("Upload failed:", err);
        }
      });
      // TODO: Send file to backend or mark as uploaded
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-black space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        className="px-4 py-2 rounded-2xl bg-sky-700 text-white hover:bg-sky-800 transition"
        onClick={handleFileButtonClick}
      >
        📄 Click to Upload File
      </Button>
        {
            isPending && <Loader2 className="animate-spin size-5 text-primary"/>
        }
      {selectedFiles && (
        <p className="text-sm text-gray-700 flex flex-col h-fit space-y-1 bg-gray-300">
          {selectedFiles.map((i, index) => (
            <span key={index}>{i.name}</span>
          ))}
        </p>
      )}
    </div>
  );
};

export default UploadComponent;
