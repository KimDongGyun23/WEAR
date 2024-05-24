import * as S from './style';
import heart from 'assets/icons/heart.svg';
import fillheart from 'assets/icons/fill-heart.svg';
import { Button } from 'components/index';
import { transformPrice } from 'utils/transformPrice';
import { useNavigate } from 'react-router-dom';
import { useLikedMutation } from 'hooks/queries/products/useLikedMutation';
import { useUnlikedMutation } from 'hooks/queries/products/useUnlikedMutation';
import { ProductDetailItem } from 'types/productType';
import { useNewChatRoom } from 'hooks/queries/chatting/useNewChatRoom';
import { userId } from 'data/shared';

interface FooterProductDetailProps {
  product: ProductDetailItem;
  status: string;
}

const FooterProductDetail = ({ product, status }: FooterProductDetailProps) => {
  const { mutate: likedMutation } = useLikedMutation(product?.id as number);
  const { mutate: unlikedMutation } = useUnlikedMutation(product?.id as number);
  const { mutate: roomIdMutation } = useNewChatRoom(product?.id);
  const navigate = useNavigate();

  const isMine = product?.seller.id === userId;

  if (status === 'pending' || status === 'error') return null;

  const handleChatClick = () => {
    if (product?.id) {
      const room_id = roomIdMutation();
      // 생성된 방으로 이동 && 실제 room_id로 수정 필요
      navigate(`/chat/room/2`);
      // navigate(`/chat/room/${room_id}`);
    }
  };

  return (
    <S.Container>
      <img
        src={product.is_selected ? fillheart : heart}
        className="heart"
        alt="heart"
        onClick={() => (product.is_selected ? unlikedMutation() : likedMutation())}
      />
      <p className="price">{transformPrice(product.price as number)}원</p>
      <Button
        width="280"
        $bgcolor={product.post_status === 'soldOut' || isMine ? 'var(--grey-3)' : 'var(--green-6)'}
        color={product.post_status === 'soldOut' || isMine ? 'var(--grey-5)' : 'white'}
        disabled={product.post_status === 'soldOut'}
        handleOnClick={handleChatClick}
      >
        채팅하기
      </Button>
    </S.Container>
  );
};

export default FooterProductDetail;
