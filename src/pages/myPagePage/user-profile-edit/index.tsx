import * as S from './style';
import arrow from 'assets/icons/arrow.svg';
import { Header, TextLabel, TextInput, ImageInput, TagInput } from 'components/index';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../apis/index';
import { useEffect, useState } from 'react';
import { userId, userProfile } from 'data/shared';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getUserProfileData = async () => {
  try {
    const response = await instance.get(`/users/profile/${userId}`);
    console.log('프로필 정보 불러오기 성공', response.data);
    return response.data;
  } catch (e) {
    console.error('프로필 정보 불러오기 실패', e);
    return userProfile;
  }
};

const UserProfileEdit = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    nick_name: '',
    profile_image: '',
    style: [],
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['user', 'profile-edit'],
    queryFn: getUserProfileData,
  });

  useEffect(() => {
    if (data) {
      setUserInfo({ ...data });
    }
  }, [data]);

  /*프로필 정보를 저장하는 api 호출 */
  const postChangeProfileInfo = async () => {
    await instance
      .put(`/users/profile/${userId}`, userInfo)
      .then((res) => {
        console.log('프로필 수정 성공', res.data);

        alert('저장되었습니다.');
        alert('저장되었습니다.');
      })
      .catch((e) => console.log('프로필 수정 실패', e));
  };

  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, nick_name: e.target.value });
  };

  return (
    <>
      {!isLoading && (
        <>
          <Header>
            <TextLabel text="내 프로필" size={18} $weight={700} />
            <S.BackIcon className="left" src={arrow} alt="go back" onClick={() => navigate(-1)} />
            <S.BackIcon className="left" src={arrow} alt="go back" onClick={() => navigate(-1)} />
            <TextLabel
              className="right "
              onClick={postChangeProfileInfo}
              text="저장"
              size={18}
              $weight={700}
              color="var(--grey-5)"
            />
          </Header>
          <TextInput
            label="닉네임"
            value={userInfo.nick_name}
            labelSize={16}
            onChange={handleChangeNickname}
          />
          <ImageInput image={userInfo.profile_image} />
          <TagInput />
        </>
      )}
    </>
  );
};

export default UserProfileEdit;
