'use client';

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { COLORS, WINDOW_WIDTH, WIX_MADEFOR_TEXT_WEIGHT } from '@/constants';
import { useAppDispatch } from '@/redux/store';
import { closeModal } from '@/redux/reducers';

type Method = 'call' | 'sms' | 'telegram' | 'whatsapp';

type Props = {
  onSuccess?: () => void;
  defaultMethod?: Method;
};

const Shell = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin: 0 0 8px;
  text-align: center;
  color: ${COLORS.CORPORATE_BLUE};
  ${WIX_MADEFOR_TEXT_WEIGHT('800')};
  font-size: 32px;
  letter-spacing: -0.6px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    font-size: 22px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #394150;
  margin: 0 0 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  width: 90%;
  height: 44px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  &:focus { background: #fff; border-color: #cbd5e1; }
`;

const TextArea = styled.textarea`
  width: 95%;
  min-height: 110px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  resize: vertical;
  &:focus { background: #fff; border-color: #cbd5e1; }
`;

const MethodsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MethodBtn = styled.button<{ $active?: boolean }>`
  height: 38px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : '#e5e7eb')};
  background: ${({ $active }) => ($active ? COLORS.CORPORATE_PINK : '#f6f8fb')};
  color: ${({ $active }) => ($active ? '#fff' : '#111827')};
  ${WIX_MADEFOR_TEXT_WEIGHT('700')};
  font-size: 14px;
  cursor: pointer;
  &:hover { filter: brightness(0.98); }
`;

const Submit = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${COLORS.CORPORATE_BLUE};
  color: #fff;
  ${WIX_MADEFOR_TEXT_WEIGHT('800')};
  font-size: 18px;
  letter-spacing: -0.2px;
  cursor: pointer;
  margin-top: 6px;
  opacity: ${({ disabled }) => (disabled ? .7 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

const ErrorText = styled.div`
  margin-top: 6px;
  color: #b91c1c;
  font-size: 14px;
`;

export default function CallbackModal({ onSuccess, defaultMethod = 'call' }: Props) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<Method>(defaultMethod);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const formValid = useMemo(() => name.trim() && phone.trim(), [name, phone]);

  const submit = async () => {
    if (!formValid || submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch('/api/callback/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          question: question.trim(),
          method,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Не удалось отправить заявку');
      }
      if (onSuccess) onSuccess();
      dispatch(closeModal());
    } catch (e: any) {
      setErr(e?.message || 'Ошибка отправки');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <Title>НУЖНА ПОМОЩЬ В ВЫБОРЕ<br/>ИЛИ КОНСУЛЬТАЦИЯ?</Title>
      <Subtitle>Наш менеджер свяжется с вами и проконсультирует по любым вопросам</Subtitle>

      <Grid>
        <Row2>
          <Input
            placeholder="Ваше имя*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Ваш телефон*"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Row2>

        <TextArea
          placeholder="Ваш вопрос"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <MethodsWrap>
          {(['call','sms','telegram','whatsapp'] as Method[]).map(m => (
            <MethodBtn
              key={m}
              $active={method === m}
              type="button"
              onClick={() => setMethod(m)}
              aria-pressed={method === m}
            >
              {m === 'call' ? 'Звонок'
               : m === 'sms' ? 'SMS'
               : m === 'telegram' ? 'Telegram'
               : 'WhatsApp'}
            </MethodBtn>
          ))}
        </MethodsWrap>

        {err && <ErrorText>{err}</ErrorText>}

        <Submit disabled={!formValid || submitting} onClick={submit}>
          {submitting ? 'Отправляем…' : 'Оставить заявку'}
        </Submit>
      </Grid>
    </Shell>
  );
}
