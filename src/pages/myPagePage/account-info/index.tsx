import { Header, TextLabel, TextInput } from 'components/index';
import * as S from './style';
import arrow from 'assets/icons/arrow.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAccountInfoQuery } from 'hooks/queries/user/useAccountInfoQuery';
import { useChangeAccountMutation } from 'hooks/queries/user/useChangeAccountMutation';

const AccountInfo = () => {
  const navigate = useNavigate();
  const { mutate: changeAccountInfo } = useChangeAccountMutation();
  const [accountInfo, setAccountInfo] = useState({
    user_name: '',
    university_name: '',
    university_email: '',
  });

  useAccountInfoQuery(setAccountInfo);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({ ...accountInfo, user_name: e.target.value });
  };

  return (
    <>
      <Header>
        <TextLabel text="계정 정보" size={18} $weight={700} />
        <S.BackIcon className="left" src={arrow} alt="go back" onClick={() => navigate(-1)} />
        <S.HederLeft
          className="right "
          onClick={() => changeAccountInfo()}
          text="저장"
          size={18}
          $weight={700}
          color="var(--grey-5)"
        />
      </Header>
      <S.InputWrapper>
        <TextInput
          label="이름"
          labelSize={16}
          value={accountInfo.user_name}
          onChange={onChangeInput}
        />
        <TextInput
          label="학교"
          labelSize={16}
          value={accountInfo.university_name}
          readonly={true}
        />
        <TextInput
          label="이메일"
          labelSize={16}
          value={accountInfo.university_email}
          readonly={true}
        />
        <S.Link>학교 변경하기</S.Link>
      </S.InputWrapper>
    </>
  );
};

export default AccountInfo;