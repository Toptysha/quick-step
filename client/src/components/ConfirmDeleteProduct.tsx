'use client';

import styled from 'styled-components';
import { useAppDispatch } from '@/redux/store';
import { closeModal } from '@/redux/reducers';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    align-items: center;
`;

const Title = styled.div`
    font-size: 18px;
    font-weight: bold;
    text-align: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 16px;
`;

const Button = styled.button<{ $danger?: boolean }>`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: ${({ $danger }) => ($danger ? '#e53935' : '#ccc')};
    color: ${({ $danger }) => ($danger ? '#fff' : '#000')};
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        opacity: 0.9;
    }
`;

interface ConfirmDeleteProductProps {
  productArticle: string;
  onDeleted?: () => void;
}

export default function ConfirmDeleteProduct({ productArticle, onDeleted }: ConfirmDeleteProductProps) {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${productArticle}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Товар успешно удалён');
        onDeleted?.();
      } else {
        const err = await res.json();
        alert(`Ошибка при удалении: ${err.error || 'неизвестная ошибка'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении');
    } finally {
      dispatch(closeModal());
    }
  };

  return (
    <Wrapper>
      <Title>Вы уверены, что хотите удалить товар <br /> <b>{productArticle}</b>?</Title>
      <ButtonGroup>
        <Button $danger={true} onClick={handleDelete}>Подтвердить удаление</Button>
        <Button onClick={() => dispatch(closeModal())}>Отмена</Button>
      </ButtonGroup>
    </Wrapper>
  );
}
