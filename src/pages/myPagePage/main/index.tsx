import React, { useEffect } from 'react';
import * as S from './style';
import { UserSection, MenuItem, Nav, Loading } from 'components/index';
import { Navigate } from 'react-router-dom';
import { useMypage } from 'service/user/useUserService';
import { useUserProfileActions } from 'store/userData';

const MyPageMain: React.FC = () => {
  const { data: mypageData, status } = useMypage();
  const { updateUserProfileInfo } = useUserProfileActions();

  useEffect(() => {
    if (mypageData) updateUserProfileInfo(mypageData);
  }, [mypageData]);

  if (status === 'pending') return <Loading $height="100svh" />;
  if (status === 'error') return <Navigate replace to={`/login`} />;

  return (
    <>
      <S.MenuItemWrapper>
        <UserSection userData={mypageData} />
        <MenuItem />
      </S.MenuItemWrapper>
      <Nav currentTab="마이페이지" />
    </>
  );
};

export default MyPageMain;
