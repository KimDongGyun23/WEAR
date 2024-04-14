import { FormTrade, Header } from 'components/index';
import close from 'assets/icons/close_large.svg';
import { useNavigate } from 'react-router-dom';
import { useNewProductMutation } from 'hooks/queries/products/useNewProductMutation';
import { useEffect } from 'react';
import { useProductListActions } from 'store/productListData';

const ProductNew = () => {
  const navigate = useNavigate();
  const { setActiveCategory } = useProductListActions();
  const { mutate: newProductMutation } = useNewProductMutation();

  useEffect(() => {
    setActiveCategory('');
  }, []);

  return (
    <>
      <Header>
        <p>상품 등록</p>
        <img src={close} className="right" alt="btn-close" onClick={() => navigate(-1)} />
      </Header>

      <FormTrade handleSubmitAction={newProductMutation} btnText={'등록하기'} />
    </>
  );
};

export default ProductNew;
