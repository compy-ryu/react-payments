/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useState } from 'react';
import { usePageContext } from 'contexts/PageContext';
import { useCardDataContext } from 'contexts/CardDataContext';
import useModal from 'hooks/useModal';

import Button from 'components/@common/Button';
import { Card } from 'components';

import { PAGE_LIST } from 'constants';
import { CardWallet, ButtonAddCard } from './styles';

function CardList() {
  const { setPageTitle, setPageLocation } = usePageContext();
  useEffect(() => setPageTitle('카드 목록'), []);

  const [focusCardIndex, setCardFocus] = useState(-1);

  const {
    Modal: EditModal,
    handleModalOpen: handleEditModalOpen,
    handleModalClose: handleEditModalClose,
  } = useModal();
  const { cardList, handleDeleteCardData } = useCardDataContext();

  const onClickCard = (index) => {
    setCardFocus(index);
    handleEditModalOpen();
  };

  const onClickDeleteButton = async (index) => {
    if (!confirm('정말 해당 카드를 제거하시겠습니까?')) return;

    await handleDeleteCardData(index);
    handleEditModalClose();
  };

  return (
    <>
      <div className="layout-side-container">
        <CardWallet>
          {cardList.map((cardData, index) => (
            <Card
              key={cardData.id}
              {...cardData}
              isMargin={false}
              onClick={() => onClickCard(index)}
            />
          ))}
        </CardWallet>
      </div>

      <div className="layout-main-container bottom">
        <ButtonAddCard onClick={() => setPageLocation(PAGE_LIST.CARD_EDITOR)}>
          <div className="icon">➕</div>
          <p className="text">새로운 카드 추가</p>
        </ButtonAddCard>
      </div>

      <EditModal>
        <h2>카드 편집</h2>
        {cardList[focusCardIndex] && <Card {...cardList[focusCardIndex]} />}
        <div className="button-container flex">
          <Button type="primary" width="50%">
            편집
          </Button>
          <Button type="warning" width="50%" onClick={() => onClickDeleteButton(focusCardIndex)}>
            삭제
          </Button>
        </div>
        <Button width="100%" onClick={handleEditModalClose}>
          닫기
        </Button>
      </EditModal>
    </>
  );
}

export default CardList;
