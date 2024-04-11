import { useQuery } from '@tanstack/react-query';
import { instance } from 'apis';
import { productMainDummyData } from 'data/product';
import { userId } from 'data/shared';
import { useEffect } from 'react';
import { useActiveCategory, useClickedOnSale, useProductListActions } from 'store/productListData';

const getProductListData = async (category: string, onSale: string | null) => {
  try {
    const response = await instance.get(
      `/products/${
        onSale ? `category/sale?` : `category?`
      }categoryName=${category}&userId=${userId}&pageNumber=0
      `
    );
    console.log('물품 리스트 불러오기 성공', response);
    return response.data.content;
  } catch (e) {
    console.log('물품 리스트 불러오기 실패 ', e);
    const productData = productMainDummyData();
    return productData;
  }
};

export const useProductMainQuery = () => {
  const clickedOnSale = useClickedOnSale();
  const activeCategory = useActiveCategory();
  const { setInitialProductList } = useProductListActions();

  const productMainQuery = useQuery({
    queryKey: ['products', activeCategory, clickedOnSale],
    queryFn: () => getProductListData(activeCategory, clickedOnSale),
  });

  useEffect(() => {
    if (productMainQuery.data) {
      setInitialProductList(productMainQuery.data);
    }
  }, [productMainQuery.data, setInitialProductList]);

  return productMainQuery;
};
