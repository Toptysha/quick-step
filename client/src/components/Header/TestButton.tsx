"use client";

import { useCheckAuth } from "@/hooks";
import { sendPhotos } from "@/utils";
import { useRef, useState } from "react";
import styled from "styled-components";

const TestButtonWrapper = styled.button`
  border: 2px solid red;
  cursor: pointer;
  background: green;
  width: 150px;
  height: 150px;
  color: white;
  margin: 10px;
`;

export default function TestButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // 👉 Открыть меню выбора файлов
  const upload = () => {
    fileInputRef.current?.click();
  };

  // 👉 Когда файл выбран
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const isAdmin = useCheckAuth();

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        multiple
        accept="image/*"
      />

      <TestButtonWrapper onClick={upload}>Выбрать файл</TestButtonWrapper>
      <TestButtonWrapper onClick={async () => await sendPhotos(isAdmin, files, 'testik', ['test_00.jpg'])}>Отправить файл</TestButtonWrapper>

      {files.length > 0 && (
        <div>
          <p>Файлы для отправки:</p>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
