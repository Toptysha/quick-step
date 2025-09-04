"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { WINDOW_WIDTH, COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import type { OrderCookie } from "@/interfaces";
import { useRouter } from "next/navigation";
import { clearOrderCookie } from "@/utils";

/** Мини-карточка товара для сумм */
export type ProductLite = {
  article: string;
  name: string;
  cover?: string | null;
  priceOfPack: number;
};

type Props = {
  order: OrderCookie;
  productMap: Record<string, ProductLite>;
  onClose?: () => void;
};

/* ======================= конфиг ======================= */

const PICKUP_ADDRESSES = [
  { id: "vrn_donbasskaya_5", label: "г. Воронеж, ул. Донбасская, 5" },
] as const;

type ContactMethod = "call" | "sms" | "telegram" | "whatsapp";
type DeliveryType = "pickup" | "courier";
type PaymentType = "card" | "cash" | "link" | "split";

/* ======================= styled ======================= */

const Wrap = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 12px;

  @media (${WINDOW_WIDTH.MOBILE}) {
    grid-template-columns: 1fr;
  }
`;

const Block = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.08);
  padding: 16px;

  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  ${WIX_MADEFOR_TEXT_WEIGHT("700")};
  letter-spacing: -0.2px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-width: 0;

  @media (${WINDOW_WIDTH.MOBILE}) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  min-width: 0;
`;

const Input = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
  background: #fafafa;

  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  &:focus {
    background: #fff;
    border-color: #cbd5e1;
  }
`;

const Select = styled.select`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
  background: #fafafa;

  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  &:focus {
    background: #fff;
    border-color: #cbd5e1;
  }
`;

const TextArea = styled.textarea`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
  min-height: 88px;
  resize: vertical;
  background: #fafafa;

  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  &:focus {
    background: #fff;
    border-color: #cbd5e1;
  }
`;

const RadioGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const RadioLine = styled.label`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;

  input {
    transform: translateY(1px);
  }
`;

const Summary = styled(Block)`
  position: sticky;
  top: 0;
  align-self: start;

  @media (${WINDOW_WIDTH.MOBILE}) {
    position: static;
  }
`;

const Line = styled.div<{ $bold?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  ${({ $bold }) => $bold && `${WIX_MADEFOR_TEXT_WEIGHT("700")};`}
`;

const Items = styled.div`
  display: grid;
  gap: 10px;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Thumb = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: #f3f4f6;
  overflow: hidden;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.div`
  font-size: 14px;
  ${WIX_MADEFOR_TEXT_WEIGHT("600")};
  color: #111827;
  min-width: 0;
  word-break: break-word;
`;
const Muted = styled.div`
  font-size: 12px;
  color: #6b7280;
  min-width: 0;
  word-break: break-word;
`;
const Price = styled.div`
  font-size: 14px;
  ${WIX_MADEFOR_TEXT_WEIGHT("700")};
  color: #111827;
  text-align: right;
`;

const Disclaimer = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: #6b7280;
`;

const Submit = styled.button`
  margin-top: 12px;
  width: 100%;
  border-radius: 12px;
  padding: 12px 16px;
  ${WIX_MADEFOR_TEXT_WEIGHT("700")};
  background: ${COLORS.CORPORATE_BLUE};
  color: white;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Consent = styled.label`
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 8px;
  align-items: start;
  font-size: 12px;
  color: #374151;

  input {
    transform: translateY(2px);
  }
`;

/* ======================= helpers ======================= */

const formatPrice = (n: number) =>
  Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const sanitizePhone = (raw: string) => {
  // оставляем только цифры, + и -
  const filtered = raw.replace(/[^\d+-]/g, "");
  // ограничиваем длину
  return filtered.slice(0, 20);
};

/* ======================= component ======================= */

export default function CheckoutModal({ order, productMap, onClose }: Props) {

  const router = useRouter();  

  // контактные данные
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // предпочитаемый способ связи
  const [contactMethod, setContactMethod] = useState<ContactMethod>("call");
  const [contactHandle, setContactHandle] = useState("");

  // доставка
  const [delivery, setDelivery] = useState<DeliveryType>("pickup");
  const [pickupId, setPickupId] = useState<string>(PICKUP_ADDRESSES[0].id);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");

  // платёж
  const [payment, setPayment] = useState<PaymentType>("card");

  const [consent, setConsent] = useState(true);
  const [sending, setSending] = useState(false);

  // строки заказа
  const lines = order.items.map((it) => {
    const meta = productMap[it.productArticle];
    const price = meta?.priceOfPack ?? 0;
    return {
      article: it.productArticle,
      name: meta?.name || it.productArticle,
      cover: meta?.cover || undefined,
      count: it.count,
      price,
      total: price * it.count,
    };
  });

  const totals = useMemo(() => {
    const itemsCount = lines.reduce((s, l) => s + l.count, 0);
    const amount = lines.reduce((s, l) => s + l.total, 0);
    return { itemsCount, amount };
  }, [lines]);

  const isAddressNeeded = delivery === "courier";

  const isNameValid = name.trim().length > 0 && name.trim().length <= 25;
  const isPhoneValid = phone.length > 0 && phone.length <= 20 && /^[\d+-]+$/.test(phone);

  const valid = useMemo(() => {
    if (!isNameValid) return false;
    if (!isPhoneValid) return false;
    if (!consent) return false;
    if (delivery === "pickup" && !pickupId) return false;
    if (isAddressNeeded && (!city.trim() || !street.trim())) return false;
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNameValid, isPhoneValid, consent, delivery, pickupId, isAddressNeeded, city, street]);

  async function submitToTelegram(payload: any) {
    const res = await fetch("/api/checkout/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `Telegram request failed: ${res.status}`);
    }
  }

  const onSubmit = async () => {
    if (!valid) return;

    const pickupAddress =
      delivery === "pickup"
        ? PICKUP_ADDRESSES.find((p) => p.id === pickupId)?.label || null
        : null;

    const payload = {
      createdAt: new Date().toISOString(),
      customer: {
        name: name.trim(),
        phone,
        preferredContact: {
          method: contactMethod,
          handle: contactHandle || null,
        },
      },
      delivery: {
        type: delivery,
        pickup: delivery === "pickup" ? { id: pickupId, address: pickupAddress } : null,
        address:
          delivery === "courier"
            ? { city, street, house: house || null, apartment: apartment || null }
            : null,
      },
      payment, // "card" | "cash" | "link" | "split"
      comment: comment || null,
      order: {
        id: order.id,
        items: lines.map((l) => ({
          article: l.article,
          name: l.name,
          count: l.count,
          priceOfPack: l.price,
          lineTotal: l.total,
        })),
        totals,
      },
    };

    try {
      setSending(true);
      await submitToTelegram(payload);

      // 1) показываем alert
      alert("Заявка отправлена! Мы свяжемся с вами.");

      // 2) очищаем корзину (cookie 'orders')
      await clearOrderCookie();
      // при желании можно обнулить счётчики:
      // await resetOrderCounters();

      // 3) закрываем модалку (если надо)
      if (onClose) onClose();

      // 4) редиректим на главную
      router.replace("/");

    } catch (e: any) {
      alert(e?.message || "Не удалось отправить заявку");
    } finally {
      setSending(false);
    }
  };

  return (
    <Wrap>
      {/* Левая колонка: формы */}
      <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
        <Block>
          <Title>Контактные данные</Title>

          {/* Имя (ограничение 25 символов) */}
          <Label>
            Имя* 
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 25))}
              placeholder="Иван"
              maxLength={25}
            />
          </Label>

          {/* Телефон под именем */}
          <div style={{ marginTop: 12 }}>
            <Label>
              Телефон* 
              <Input
                value={phone}
                onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                placeholder="+7"
                maxLength={20}
                inputMode="tel"
                pattern="[\d+-]{1,20}"
              />
            </Label>
          </div>

          {/* Способ связи */}
          <div style={{ marginTop: 12 }}>
            <Label>
              Предпочтительный способ связи
              <RadioGroup>
                <RadioLine>
                  <input
                    type="radio"
                    checked={contactMethod === "call"}
                    onChange={() => setContactMethod("call")}
                  />
                  Позвонить
                </RadioLine>
                <RadioLine>
                  <input
                    type="radio"
                    checked={contactMethod === "sms"}
                    onChange={() => setContactMethod("sms")}
                  />
                  SMS
                </RadioLine>
                <RadioLine>
                  <input
                    type="radio"
                    checked={contactMethod === "telegram"}
                    onChange={() => setContactMethod("telegram")}
                  />
                  Telegram
                </RadioLine>
                <RadioLine>
                  <input
                    type="radio"
                    checked={contactMethod === "whatsapp"}
                    onChange={() => setContactMethod("whatsapp")}
                  />
                  WhatsApp
                </RadioLine>
              </RadioGroup>
            </Label>

          </div>
        </Block>

        <Block>
          <Title>Доставка</Title>
          <RadioGroup>
            <RadioLine>
              <input
                type="radio"
                checked={delivery === "pickup"}
                onChange={() => setDelivery("pickup")}
              />
              Самовывоз
            </RadioLine>
            <div style={{ marginTop: 6, marginLeft: 28 }}>
              <Label>
                Пункт самовывоза
                <Select
                  value={pickupId}
                  onChange={(e) => setPickupId(e.target.value)}
                  disabled={delivery !== "pickup"}
                >
                  {PICKUP_ADDRESSES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>

            <RadioLine style={{ marginTop: 8 }}>
              <input
                type="radio"
                checked={delivery === "courier"}
                onChange={() => setDelivery("courier")}
              />
              Курьером
            </RadioLine>
          </RadioGroup>

          {delivery === "courier" && (
            <>
              <Row style={{ marginTop: 10 }}>
                <Label>
                  Город*
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Москва" />
                </Label>
                <Label>
                  Улица*
                  <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Тверская" />
                </Label>
              </Row>
              <Row>
                <Label>
                  Дом
                  <Input value={house} onChange={(e) => setHouse(e.target.value)} placeholder="1к2" />
                </Label>
                <Label>
                  Кв./офис
                  <Input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="12" />
                </Label>
              </Row>
            </>
          )}
        </Block>

        <Block>
          <Title>Оплата</Title>
          <RadioGroup>
            <RadioLine>
              <input
                type="radio"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
              />
              Банковской картой
            </RadioLine>
            <RadioLine>
              <input
                type="radio"
                checked={payment === "cash"}
                onChange={() => setPayment("cash")}
              />
              Наличными при получении
            </RadioLine>
            <RadioLine>
              <input
                type="radio"
                checked={payment === "link"}
                onChange={() => setPayment("link")}
              />
              По ссылке / QR-коду
            </RadioLine>
            <RadioLine>
              <input
                type="radio"
                checked={payment === "split"}
                onChange={() => setPayment("split")}
              />
              Яндекс Сплит
            </RadioLine>
          </RadioGroup>
        </Block>

        <Block>
          <Title>Комментарий к заказу</Title>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: позвонить заранее, подъезд со двора и т.д."
          />
          <div style={{ marginTop: 10 }}>
            <Consent>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Я согласен на обработку персональных данных и подтверждаю корректность введённых данных.
              </span>
            </Consent>
          </div>
        </Block>
      </div>

      {/* Правая колонка: итоги */}
      <Summary>
        <Title>Ваш заказ</Title>
        <Items>
          {lines.map((l) => (
            <ItemRow key={l.article}>
              <Thumb>
                {l.cover ? <img src={l.cover} alt={l.name} /> : <span>—</span>}
              </Thumb>
              <div>
                <Name>{l.name}</Name>
                <Muted>
                  Арт. {l.article} • {l.count} шт. × {formatPrice(l.price)}
                </Muted>
              </div>
              <Price>{formatPrice(l.total)}</Price>
            </ItemRow>
          ))}
        </Items>

        <div style={{ borderTop: "1px dashed #e5e7eb", margin: "12px 0" }} />

        <Line>
          <span>Товары</span>
          <span>{lines.reduce((s, l) => s + l.count, 0)}</span>
        </Line>

        <Line $bold>
          <span>Итого к оплате</span>
          <span>{formatPrice(totals.amount)}</span>
        </Line>

        <Submit disabled={!valid || sending} onClick={onSubmit}>
          {sending ? "Отправляем…" : "Отправить заявку"}
        </Submit>
        <Disclaimer>
          Нажимая кнопку, вы оформляете заявку. Менеджер свяжется для подтверждения,
          уточнит сроки и условия доставки/оплаты.
        </Disclaimer>
      </Summary>
    </Wrap>
  );
}
