import * as S from './style';
import Loading from 'components/atom/loading';
import { BoxError, Button, ProfileAvatar, TextLabel } from 'components';
import { levelUrlArr } from 'utils/levelUrlArr';
import { BlockList } from 'types/userType';
import { useUnblock } from 'service/user/useUserService';

interface ListBlockUser {
  userList: BlockList[];
  status: string;
}

const ListBlockUser = ({ userList, status }: ListBlockUser) => {
  const { mutate: unblockMutation } = useUnblock();
  const height = `var(--content-size)`;

  if (status === 'pending') return <Loading $height={height} />;
  if (status === 'error')
    return <BoxError $height={height}>차단한 사용자를 불러오지 못했습니다.</BoxError>;
  if (userList.length === 0) return <BoxError $height={height}>차단한 사용자가 없습니다.</BoxError>;

  return (
    <S.Container>
      {userList.map((blockUser: BlockList, index: number) => (
        <S.BoxUser key={index}>
          <ProfileAvatar imageUrl={blockUser.blocked_user_profile_image} />

          <S.UserName>
            <TextLabel size={16}>{blockUser.blocked_user_nick_name}</TextLabel>
            <img src={levelUrlArr(blockUser.blocked_user_level)} width={11} height={11} />
          </S.UserName>

          <Button
            width="77px"
            $padding="5px 10px"
            $borderRadius="10px"
            fontSize="14px"
            handleOnClick={() => unblockMutation(blockUser.blocked_user_id)}
          >
            차단해제
          </Button>
        </S.BoxUser>
      ))}
    </S.Container>
  );
};

export default ListBlockUser;
