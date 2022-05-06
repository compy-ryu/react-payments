import PropTypes from 'prop-types';
import reactDom from 'react-dom';
import { MODAL_STATE } from 'constants';

import { Container, ModalContent } from './styles';

function Modal({ className, handleClose, handleHidden, children }) {
  const onAnimationEnd = () => {
    if (className === MODAL_STATE.VISIBLE) return;

    handleHidden();
  };

  const render = (
    <Container className={className} onClick={handleClose} onAnimationEnd={onAnimationEnd}>
      <ModalContent>{children}</ModalContent>
    </Container>
  );

  const modalContainer = document.getElementById('root');
  return reactDom.createPortal(render, modalContainer);
}

Modal.defaultProps = {
  className: MODAL_STATE.HIDDEN,
  handleClose: () => {},
  handleHidden: () => {},
};

Modal.propTypes = {
  className: PropTypes.string,
  handleClose: PropTypes.func,
  handleHidden: PropTypes.func,
};

export default Modal;