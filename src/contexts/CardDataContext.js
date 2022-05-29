import { createContext, useReducer, useMemo, useContext, useEffect, useState } from 'react';
import {
  requestDeleteCardData,
  requestErrorHandler,
  requestGetCardData,
  requestInsertCardData,
  requestUpdateCardData,
} from 'api';
import { CARD_EDIT_TARGET_INDEX } from 'constants/';

const CardDataContext = createContext();

function reducer(cardList, { type, data }) {
  const actionList = {
    PRELOAD: () => data,
    INSERT: () => {
      const { cardData } = data;
      return cardList.concat(cardData);
    },
    UPDATE: () => {
      const newCardList = [...cardList];
      const { index, cardData } = data;

      newCardList[index] = cardData;
      return newCardList;
    },
    DELETE: () => {
      const newCardList = [...cardList];
      const { index } = data;

      newCardList.splice(index, 1);
      return newCardList;
    },
  };

  return actionList[type]();
}

function CardDataContextProvider({ children }) {
  const [currentEditIndex, setEditIndex] = useState(CARD_EDIT_TARGET_INDEX.NEW);
  const [cardList, dispatch] = useReducer(reducer, []);
  const value = useMemo(
    () => ({ state: { cardList, currentEditIndex }, action: { dispatch, setEditIndex } }),
    [currentEditIndex, cardList],
  );

  useEffect(() => {
    (async () => {
      const response = await requestGetCardData();

      requestErrorHandler(response)({
        SUCCESS: (result) => dispatch({ type: 'PRELOAD', data: result }),
        FAIL: (errorMessage) => alert(`서버에서 카드 목록 로드에 실패하였습니다.\n${errorMessage}`),
      });
    })();
  }, []);

  return <CardDataContext.Provider value={value}>{children}</CardDataContext.Provider>;
}

function useCardDataContext() {
  const context = useContext(CardDataContext);
  if (context === undefined) {
    throw new Error('CardDataContextProvider가 로드되지 않았습니다.');
  }

  const { cardList, currentEditIndex } = context.state;
  const { dispatch, setEditIndex } = context.action;

  const getCardData = (cardIndex) =>
    CARD_EDIT_TARGET_INDEX.NEW === cardIndex
      ? cardList[cardList.length - 1] || {}
      : cardList[cardIndex] || {};

  const setCardEditIndex = (index) => {
    setEditIndex(index);
  };

  const addCardData = async (cardData) => {
    const response = await requestInsertCardData(cardData);

    requestErrorHandler(response)({
      SUCCESS: (result) => dispatch({ type: 'INSERT', data: { cardData: result } }),
      FAIL: (errorMessage) => {
        throw new Error(errorMessage);
      },
    });
  };

  const updateCardData = async (index, cardData) => {
    const { id } = cardList[index];
    const response = await requestUpdateCardData(id, cardData);

    requestErrorHandler(response)({
      SUCCESS: (result) => dispatch({ type: 'UPDATE', data: { index, cardData: result } }),
      FAIL: (errorMessage) => {
        throw new Error(errorMessage);
      },
    });
  };

  const removeCardData = async (index) => {
    const { id } = cardList[index];
    const response = await requestDeleteCardData(id);

    requestErrorHandler(response)({
      SUCCESS: () => dispatch({ type: 'DELETE', data: { index } }),
      FAIL: (errorMessage) => {
        throw new Error(errorMessage);
      },
    });
  };

  return {
    cardList,
    currentEditIndex,
    getCardData,
    setCardEditIndex,
    addCardData,
    updateCardData,
    removeCardData,
  };
}

export { CardDataContextProvider, useCardDataContext };
