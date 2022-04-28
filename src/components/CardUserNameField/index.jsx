import PropTypes from 'prop-types';
import { useState } from 'react';

import FieldSet from 'components/@common/FieldSet';
import TextField from 'components/@common/TextField';

import { validateUserName } from 'validators';
import { USER_NAME } from 'constants';

function CardUserNameField({ userName, onChange }) {
  const [errorMessage, setErrorMessage] = useState('');

  const onBlurUserName = () => {
    try {
      validateUserName(userName);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <FieldSet title="카드 소유자 이름 (선택)" errorMessage={errorMessage}>
      <TextField
        name="userName"
        maxLength={USER_NAME.MAX_LENGTH}
        value={userName}
        onBlur={onBlurUserName}
        onChange={onChange}
      />
      <div className="input-length-text">{`${userName.length} / ${USER_NAME.MAX_LENGTH}`}</div>
    </FieldSet>
  );
}

CardUserNameField.defaultProps = {
  userName: '',
};

CardUserNameField.propTypes = {
  userName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default CardUserNameField;