import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query {
    getCategories {
      name
      slug
      imageUrl
      _id
    }
  }
`;

export const CURRENT_CATEGORY = gql`
  query CurrentCategory($slug: String!, $pageIndex: Int!) {
    currentCategory(slug: $slug, pageIndex: $pageIndex) {
      success
      count
      pagination {
        previous {
          page
          limit
        }
        next {
          limit
          page
        }
      }
      data {
        content
        _id
        price
        imageUrl
        slug
        name
      }
    }
  }
`;
