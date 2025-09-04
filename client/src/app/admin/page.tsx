'use client';

import styled from "styled-components";
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { useCheckAuth, useCloseLoader } from "@/hooks";
import { useState } from "react";

const BodyWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const BodyWrapperMini = styled.div`
  width: 1200px;
  min-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (${WINDOW_WIDTH.MOBILE}) {
    width: 100%;
    ${WINDOW_WIDTH.SUPER_MINI};
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  outline: none;
  margin: 10px 0;
  width: 100%;
  max-width: 300px;
  
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${COLORS.CORPORATE_BLUE};
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${COLORS.CORPORATE_BLUE};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: ${COLORS.CORPORATE_GRAY};
  ${WIX_MADEFOR_TEXT_WEIGHT('500')};
  letter-spacing: -0.5px;
  cursor: pointer;
  margin-top: 12px;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #005ecb;
  }
`;

export default function Admin() {
  useCloseLoader();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin = useCheckAuth();

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password }),
    });

    if (res.ok) {
      setMessage("✅ Успешный вход");
    } else {
      setMessage("❌ Неверный пароль");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };


  return (
    <BodyWrapper>
      <BodyWrapperMini>
        {isAdmin ? (
          <>
            <Button onClick={handleLogout}>Выйти из учётной записи</Button>
            {message && <div>{message}</div>}
          </>
        ) : (
          <>
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Войти</Button>
            {message && <div>{message}</div>}
          </>
        )}
      </BodyWrapperMini>
    </BodyWrapper>
  );
}
