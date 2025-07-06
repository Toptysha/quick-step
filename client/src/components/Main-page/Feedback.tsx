'use client';

import styled from "styled-components";
import { COLORS, WIX_MADEFOR_TEXT_WEIGHT } from "@/constants";
import { CatalogButtonComponent } from "@/components";

const FeedbackWrapper = styled.div`
    // background-color: ${COLORS.CORPORATE_BLUE};
    box-shadow: 4px 0px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 400px;
    margin: 20px 0 80px 0;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
`

const PhotoBox = styled.img`
    width: 50%;
    height: 100%;
    border-radius: 24px 250px 24px 24px;
`

const FeedbackBox = styled.div`
    box-sizing: border-box;
    width: 50%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;
    font-size: 20px;
`

const FeedbackHeader = styled.div`
    width: 100%;
    margin: 0 0 10px 0;
    color: ${COLORS.CORPORATE_BLUE};
    ${WIX_MADEFOR_TEXT_WEIGHT('600')};
    font-size: 26px;
    letter-spacing: -1px;
`

const FeedbackDescription = styled.div`
    width: 100%;
`

const FeedbackForm = styled.div`
    width: 100%;
`

const FeedbackInputs = styled.div`
    width: 90%;
    padding: 20px 5%;
    display: flex;
    justify-content: space-between;
`

const FeedbackInput = styled.input`
    width: 40%;
    padding: 10px;
    border-radius: 12px;
    border: none;
    outline: none;
`

const FeedbackTextarea = styled.textarea`
    box-sizing: border-box;
    width: 90%;
    min-width: 90%;
    max-width: 90%;
    height: 100px;
    min-height: 40px;
    max-height: 120px;
    padding: 10px;
    border-radius: 12px;
    border: none;
    outline: none;
    ${WIX_MADEFOR_TEXT_WEIGHT('400')};
    letter-spacing: -0.5px;;
`

const FeedbackSubmit = styled.div`
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const FeedbackCheckboxBlock = styled.label`
    cursor: pointer;
    width: 50%;
    display: flex;
    
`

const FeedbackCheckboxText = styled.div`
    font-size: 14px;
`

const FeedbackCheckbox = styled.input`
    width: 40px;
`

const PrivacyPolicy = styled.a`
  box-shadow: inset 0 -1px 0 black;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: inset 0 0 0 black;
  }
`

export default function FeedbackComponent() {
    return (
        <FeedbackWrapper>
            <PhotoBox src='img/feedback-cover/feedback-cover.webp' alt='Feedback' />
            <FeedbackBox>
                <FeedbackHeader>
                    НУЖНА  ПОМОЩЬ  В  ВЫБОРЕ   ИЛИ  КОНСУЛЬТАЦИЯ?
                </FeedbackHeader>
                <FeedbackDescription>
                    Наш менеджер свяжется с Вами и проконсультирует по возникшим вопросам
                </FeedbackDescription>
                <FeedbackForm>
                    <FeedbackInputs>
                        <FeedbackInput placeholder="Ваше имя..." />
                        <FeedbackInput placeholder="Ваш телефон..." />
                    </FeedbackInputs>
                    <FeedbackTextarea placeholder="Ваш вопрос..." />
                </FeedbackForm>
                <FeedbackSubmit>
                    <FeedbackCheckboxBlock>
                        <FeedbackCheckbox type="checkbox" />
                        <FeedbackCheckboxText>
                            Я даю согласие на обработку своих персональных данных и соглашаюсь с  
                            <PrivacyPolicy>политикой конфиденциальности</PrivacyPolicy>
                        </FeedbackCheckboxText>
                    </FeedbackCheckboxBlock>
                    <CatalogButtonComponent buttonName="Оставить заявку" width="200px" fontSize="20px" />
                </FeedbackSubmit>
            </FeedbackBox>
        </FeedbackWrapper>
    )
}