import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { initializeApollo } from 'src/apollo';
import Link from 'next/link';
import styles from '../styles/ProductCard.module.css';
import { useQuery } from '@apollo/client';
import { SEARCH_PRODUCT } from '../GraphQL/Apollo-Client/Queries/productQuerys';
import Image from 'next/image';
import Layout from '../Components/Layout';
import Head from 'next/head';
import styles1 from '../styles/ProductsSold.module.css';

function Product() {
  const router = useRouter();

  let searchProduct;
  if (router.query.search) {
    searchProduct = router.query.search;
  }

  const [pageIndex, setPageIndex] = useState(1);

  const { data } = useQuery(SEARCH_PRODUCT, {
    variables: {
      slug: searchProduct ? searchProduct : '',
      pageIndex: pageIndex,
    },
  });

  return (
    <Layout>
      <Head>
        <title>Search Product</title>
      </Head>
      <div className={styles.productMainCard}>
        <div className={`${styles.productCard} mt-1`}>
          {data ? (
            <div>
              {data.searchProduct.data[0] &&
              router.query.search !== '' &&
              router.query.search !== ' ' ? (
                <div>
                  {data.searchProduct.data.map((product) => (
                    <div
                      className={`card ${styles.card}`}
                      style={{
                        display: 'inline-block',
                        borderRadius: '1rem',
                        backgroundColor: '#f2f2f2',
                      }}
                      key={product._id}
                    >
                      <div className={`${styles.imgMarginTop}`}>
                        <Image
                          src={product.imageUrl[0]}
                          width={800}
                          height={800}
                          layout="intrinsic"
                          className={`img ${styles.img}`}
                          alt={`${product.name}`}
                          priority
                        />
                      </div>

                      <div className={'card-body ' + styles.cardBody}>
                        <h5 className={'card-title ' + styles.cardBody}>
                          <div className={styles.titleName}>{product.name}</div>
                          <br />
                          <div className={styles.price}>
                            $ {parseFloat(product.price).toFixed(2)}
                          </div>
                        </h5>
                        <p className={'card-title ' + styles.cardText}>
                          {product.content}
                        </p>
                        <Link href={`/product/${product.slug}`}>
                          <a
                            className="btn btn-block btn-primary"
                            style={{ fontSize: '0.9rem' }}
                          >
                            <strong>Go to Product</strong>
                          </a>
                        </Link>
                      </div>
                    </div>
                  ))}

                  <div>
                    {data ? (
                      <div className={styles.paginationMainDiv}>
                        <ul
                          className="pagination"
                          style={{ justifyContent: 'space-around' }}
                        >
                          <li
                            className={`page-item ${
                              data.searchProduct.pagination.previous
                                ? ''
                                : 'disabled'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              data.searchProduct.pagination.previous
                                ? setPageIndex(pageIndex - 1)
                                : null;
                            }}
                          >
                            <div className={`page-link ${styles.previousBtn}`}>
                              Previous
                            </div>
                          </li>

                          <li
                            className={`page-item ${
                              data.searchProduct.pagination.next
                                ? ''
                                : 'disabled'
                            }`}
                            style={{ cursor: 'pointer', color: 'black' }}
                            onClick={() => {
                              data.searchProduct.pagination.next
                                ? setPageIndex(pageIndex + 1)
                                : null;
                            }}
                          >
                            <div className={`page-link ${styles.nextBtn}`}>
                              Next
                            </div>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={styles1.notProduct}>
                    The product you are looking for was not found
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export default Product;

export const getStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  const { connectDatabase } = require('Server/DB/connectDatabase');

  await connectDatabase();
  await apolloClient.readQuery({
    query: SEARCH_PRODUCT,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      revalidate: 60,
    },
  };
};
