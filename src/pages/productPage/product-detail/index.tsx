import {
  BoxKebabList,
  BoxProductProfile,
  ButtonBack,
  Carousel,
  DescriptionProduct,
  FooterProductDetail,
  Header,
  ModalProduct,
} from 'components/index';
import * as S from './style';
import kebab from 'assets/icons/kebab.svg';
import { useNavigate, useParams } from 'react-router-dom';

import { Seller } from 'types/types';
import { useEffect, useState } from 'react';
import { userId } from 'data/shared';
import { instance } from 'apis';
import { useProduct, useProductActions } from 'store/product';
import { useQuery } from '@tanstack/react-query';

async function getProductDetailData(id: string | undefined) {
  try {
    const response = await instance.get(`/products/${id}`);
    console.log('데이터 가져오기 성공', response);
    return response.data.content;
  } catch (e) {
    console.log('데이터 가져오기 실패', e);
  }
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openKebab, setOpenKebab] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const product = useProduct();
  const { setProduct, updateOnSale, changeStrToArr } = useProductActions();

  const { data, error, isLoading } = useQuery({
    queryKey: ['products', 'product-detail'],
    queryFn: () => getProductDetailData(id),
  });

  useEffect(() => {
    if (data) {
      setProduct(data);
      changeStrToArr(data.product_image);
    }
  }, [data]);

  const handleOnSaleClick = async () => {
    if (product?.post_status === 'onSale') {
      await instance
        .put(`/products/soldOut/${userId}`, {
          id: id,
          product_stauts: 'soldOut',
        })
        .then((response) => {
          console.log('판매 완료 변경 성공', response);
          alert('판매 완료로 변경하였습니다.');
          updateOnSale('soldOut');
          console.log(product);
        })
        .catch((e) => {
          console.log('판매 완료 변경 실패', e);
        });
    } else {
      await instance
        .put(`/products/soldOut/${id}`, { id: id, product_stauts: 'onSale' })
        .then((response) => {
          console.log('판매 중으로 변경 성공', response);
          updateOnSale('onSale');
        })
        .catch((e) => {
          console.log('판매 중으로 변경 실패', e);
        });
    }
  };

  const handleHideClick = async () => {
    await instance
      .put(`/products/private/${userId}/${id}`, {
        is_private: true,
      })
      .then((response) => {
        console.log('글 숨기기 성공', response);
        alert('글 숨기기에 성공했습니다.');
        navigate('/product');
      })
      .catch((e) => {
        console.log('글 숨기기 실패', e);
        alert('글 숨기기에 실패했습니다. 다시 시도해주세요.');
      });
  };

  /**게시글 삭제 api 호출 */
  const handleDeleteProduct = async () => {
    await instance
      .delete(`/products/delete/${userId}/${product?.id}`)
      .then((response) => {
        console.log('글 삭제 성공', response);
        navigate('/product');
      })
      .catch((e) => {
        console.log('글 삭제 실패', e);
      });
    navigate('/product');
  };

  return (
    <>
      {' '}
      {openModal && (
        <ModalProduct
          select1="취소"
          select2="삭제"
          openModal={openModal}
          setOpenModal={setOpenModal}
          id={id as string}
          onClick={handleDeleteProduct}
        >
          <p>게시글을 삭제하시겠어요?</p>
        </ModalProduct>
      )}
      <Header>
        <ButtonBack className="left" $marginLeft="10px" onClick={() => navigate(-1)} />
        <img
          src={kebab}
          className="right"
          alt="btn-kebab"
          onClick={() => setOpenKebab(!openKebab)}
        />
      </Header>
      {product && (
        <>
          {openKebab && product.seller?.id !== userId && (
            <BoxKebabList>
              <p>차단하기</p>
              <p className="red">신고하기</p>
            </BoxKebabList>
          )}
          {openKebab && product.seller?.id === userId && (
            <BoxKebabList>
              <p onClick={() => navigate(`/product/edit/${id}`)}>수정하기</p>
              {product.post_status === 'onSale' ? (
                <p onClick={handleOnSaleClick}>판매 완료로 변경</p>
              ) : (
                <p onClick={handleOnSaleClick}>판매 중으로 변경</p>
              )}
              <p onClick={handleHideClick}>글 숨기기</p>
              <p className="red" onClick={() => setOpenModal(!openModal)}>
                삭제
              </p>
            </BoxKebabList>
          )}
          <S.Content>
            <section className="profile">
              <BoxProductProfile user={product.seller as Seller} />
            </section>

            <S.SectionScroll>
              <section className="product-image">
                <Carousel $dot="13px" $width="100%" $height="314px">
                  {product.product_image.map((url, i) => (
                    <img src={url} alt={`img-${i}`} key={i} />
                  ))}
                </Carousel>
              </section>

              <section className="description">
                <DescriptionProduct product={product} />
              </section>
            </S.SectionScroll>
          </S.Content>
          <FooterProductDetail product={product} />
        </>
      )}{' '}
    </>
  );
};

export default ProductDetail;
