'use client';

import styled from "styled-components";
import { useRef, useState } from "react";
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { Cover } from "@/types";

const ExchangeContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ExchangeItemWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 48%;
  margin: 20px 0 0px 0;
`;

const WallpaperImageExchange = styled.img`
  width: 100%;
  border-radius: 12px;
`;

const InputExchange = styled.input`
  width: 100%;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SaveButton = styled.button`
  cursor: pointer;
  background: ${COLORS.CORPORATE_PINK};
  width: 180px;
  height: 80px;
  font-size: 18px;
  color: ${COLORS.CORPORATE_GRAY};
  ${WIX_MADEFOR_TEXT_WEIGHT('500')};
  letter-spacing: -1.5px;
  border: none;
  border-radius: 12px;
  margin: 20px 0 0px 0;
`;

const RemoveButton = styled.button`
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 12px;
    width: 28px;
    height: 28px;
    font-size: 24px;
`;

export default function CoverExchangeComponent({ wallpapers, type, isAdmin }: { wallpapers: Cover[]; type: Cover["type"]; isAdmin: boolean;}) {

    const [descriptions, setDescriptions] = useState<string[]>(wallpapers.map(w => w.description as string));
    const [paths, setPaths] = useState<string[]>(wallpapers.map(w => w.path));

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newDescriptions, setNewDescriptions] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const originalPaths = useRef<string[]>(wallpapers.map(w => w.path));

    const deleteRemovedCovers = async () => {
        const removedPaths = originalPaths.current.filter(orig => !paths.includes(orig));

        for (const path of removedPaths) {
            try {
            const res = await fetch("/api/covers/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path }),
            });
            if (!res.ok) throw new Error("Не удалось удалить: " + path);
            } catch (err) {
            console.error("❌ Ошибка удаления:", err);
            }
        }
    };

    const updateDescriptions = async () => {
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const description = descriptions[i];
            const original = wallpapers.find(w => w.path === path);
            if (!original || original.description === description) continue;

            try {
            const res = await fetch("/api/covers/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path, description }),
            });
            if (!res.ok) throw new Error("Ошибка обновления описания");
            } catch (err) {
            console.error("❌ Ошибка обновления:", err);
            }
        }
    };

    const uploadNewCovers = async () => {
        for (let i = 0; i < newFiles.length; i++) {
            const formData = new FormData();
            formData.append("file", newFiles[i]);
            // formData.append("type", "wallpaper");
            formData.append("type", type);
            formData.append("description", newDescriptions[i]);

            try {
            const res = await fetch("/api/covers/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Ошибка при загрузке");

            const data = await res.json();
            console.log("✅ Загружено:", data.cover);
            } catch (err) {
            console.error("❌ Ошибка загрузки:", err);
            }
        }
    };

    const onSave = async () => {
        if (!isAdmin) return alert("Нет прав");

        await deleteRemovedCovers();
        await updateDescriptions();
        await uploadNewCovers();

        alert("✅ Обложки обновлены");
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setNewFiles(prev => [...prev, file]);
        type === 'wallpaper' ||  type === 'floor' && setNewDescriptions(prev => [...prev, "Введите описание"]);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveExisting = (index: number) => {
        setDescriptions(prev => prev.filter((_, i) => i !== index));
        setPaths(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNew = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewDescriptions(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <ExchangeContentWrapper>
        {/* Существующие обложки */}
        {paths.map((src, i) => (
            <ExchangeItemWrapper key={`existing_${i}`}>
            <RemoveButton onClick={() => handleRemoveExisting(i)}>×</RemoveButton>
            <WallpaperImageExchange src={src} alt={`wallpaper_${i}`} />
            {type === 'wallpaper' ||  type === 'floor' && <InputExchange
                value={descriptions[i] || ""}
                onChange={(e) => {
                const updated = [...descriptions];
                updated[i] = e.target.value;
                setDescriptions(updated);
                }}
            />}
            </ExchangeItemWrapper>
        ))}

        {/* Новые выбранные изображения */}
        {newFiles.map((file, i) => (
            <ExchangeItemWrapper key={`new_${i}`}>
                <RemoveButton onClick={() => handleRemoveNew(i)}>×</RemoveButton>
                <div>{file.name}</div>
                {type === 'wallpaper' ||  type === 'floor' && <InputExchange
                    value={newDescriptions[i]}
                    onChange={(e) => {
                    const updated = [...newDescriptions];
                    updated[i] = e.target.value;
                    setNewDescriptions(updated);
                    }}
                />}
            </ExchangeItemWrapper>
        ))}

        <ButtonsWrapper>
            <SaveButton onClick={triggerFileSelect}>Добавить</SaveButton>
            <SaveButton onClick={onSave}>Сохранить</SaveButton>
        </ButtonsWrapper>

        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
        />
        </ExchangeContentWrapper>
    );
}
