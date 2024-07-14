'use server';

import { FindProductsDocument, FindProductsQueryVariables } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';

class ProductService {
  async find(variables?: FindProductsQueryVariables) {
    const { products } = await executeGraphQL(FindProductsDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: variables ?? {},
    });
    return products?.edges.map((edge) => edge.node) || [];
  }
}

const productService = new ProductService();

export default productService;
