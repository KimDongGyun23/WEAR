import { useProductList } from 'store/productListData';
import { useHiddenProductQuery } from 'hooks/queries/user/useHiddenProductQuery';
import { ListTradeItems, Loading } from 'components';

const ListSalesHidden = () => {
  const hiddenProductQuery = useHiddenProductQuery();
  const productList = useProductList();
  console.log('ListSalesHidden productList', productList);

  if (hiddenProductQuery.isLoading) return <Loading />;

  return <ListTradeItems />;
};

export default ListSalesHidden;
