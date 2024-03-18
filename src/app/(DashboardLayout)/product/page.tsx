'use client';
import Table from '@/components/Table/Table';
import styles from '../product/product.module.scss';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import SearchComponent from '@/components/Filter/Filter';
import { IProductData } from '@/types/shared';
import axios from 'axios';
import CreateProduct from './CreateProduct';
import withProductContext from './withProductContext';
import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import { Modal } from '@/components/Modal/Modal';

const Product = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productSelected, setProductSelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);

  const { setProductData, productData } = useAppContext();

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getProductData}s?pagination[page]=${page}&pagination[limit]=50`;
    if (searchQuery) {
      url = `${url}&search=${searchQuery}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setProductData(response.data.data))
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
    setLoading(false);
    setForceRefresh(false);
  }, [searchQuery, page, forceRefresh]);

  const deleteProduct = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .delete(`${ServerRoutes.getProductData}/${productSelected}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setPage(1);
        setForceRefresh(true);
      })
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
  };

  return (
    <div>
      <h2 className={styles.pageHeader}>Product</h2>
      <div style={{ marginBottom: '20px' }}>
        <SearchComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className={styles.createBtnContainer}>
        <button
          className={styles.createButton}
          onClick={() => setShowModal(true)}
        >
          <PlusCircledIcon /> Create Product
        </button>
      </div>
      {loading ? (
        'Loading....'
      ) : (
        <Table
          headers={[
            {
              id: 1,
              label: 'Product Name',
            },
            {
              id: 2,
              label: 'Featured Image',
            },
            {
              id: 3,
              label: 'Quantity',
            },
            {
              id: 4,
              label: 'Status',
            },
            {
              id: 5,
              label: 'Price',
            },
            {
              id: 6,
              label: 'Brand',
            },
            {
              id: 7,
              label: 'Store',
            },
            {
              id: 8,
              label: 'Date Created',
            },
            {
              id: 9,
              label: 'Actions',
            },
          ]}
          data={productData}
          renderRow={(row: IProductData, index: number) => {
            return (
              <tr key={index}>
                <td>{row.name}</td>
                <td>
                  {
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.featuredImage}`}
                      style={{ height: '50px' }}
                    />
                  }
                </td>
                <td>{row.quantity}</td>
                <td>{row.published ? 'Published' : 'Unpublished'}</td>
                <td>
                  {row.discountPrice > 0 ? (
                    <span>
                      <span style={{ textDecoration: 'line-through' }}>
                        {row.price}
                      </span>{' '}
                      <span style={{ fontSize: '.8rem' }}>
                        {row.discountPrice}
                      </span>
                    </span>
                  ) : (
                    row.price
                  )}
                </td>
                <td>{row.brand}</td>
                <td>{row.createdBy.name}</td>
                <td>{row.createdAt}</td>
                <td>
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginRight: '1rem',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </span>
                    <span
                      style={{
                        color: 'red',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setProductSelected(row.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </span>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      )}
      <CreateProduct showModal={showModal} setShowModal={setShowModal} />
      <Modal
        isOpen={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        text=""
      >
        {showDeleteModal && (
          <div className={styles.pricingApproveModal}>
            <h2>Are you sure you want to delete this product?</h2>
            <div className={styles['button-container']}>
              <button
                className={`${styles.button} ${styles.yes}`}
                onClick={() => {
                  deleteProduct();
                  setShowDeleteModal(false);
                }}
                style={{ backgroundColor: '#f44336' }}
              >
                Yes
              </button>
              <button
                className={`${styles.button} ${styles.no}`}
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default withProductContext(Product);
