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
import CustomPagination from '@/components/CustomPagination/CustomPagination';

const Product = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(40);

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productSelected, setProductSelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [product, setProduct] = useState<IProductData>();
  const [roleName, setRolename] = useState('');

  const { setProductData, productData, totalData, setTotalData } =
    useAppContext();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      const roleName = user.role.name;
      setRolename(roleName);
    } else {
      console.error('User data not found in local storage');
    }
  }, [roleName]);

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getProductData}s?pagination[page]=${page}&pagination[limit]=${limit}`;
    if (searchQuery) {
      url = `${url}&search=${searchQuery}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setProductData(response.data.data);
        setTotalData(response?.data?.pagination?.total);
      })
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
      {/* {roleName !== 'User' && roleName !== 'Simple User' && ()} */}
      {roleName !== 'User' && roleName !== 'Simple User' && (
        <div className={styles.createBtnContainer}>
          <button
            className={styles.createButton}
            onClick={() => {
              setIsEditMode(false);
              setProduct(null as any);
              setShowModal(true);
            }}
          >
            <PlusCircledIcon /> Create Product
          </button>
        </div>
      )}

      {loading ? (
        'Loading....'
      ) : (
        <>
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
                <tr
                  key={index}
                  onClick={() => {
                    router.push(`/productDetail?id=${row.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    {row.name.length > 20
                      ? `${row.name.substring(0, 20)}...`
                      : row.name}
                  </td>
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
                    {parseFloat(row.discountPrice) > 0 ? (
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
                  <td>
                    {row.brand.length > 20
                      ? `${row.brand.substring(0, 20)}...`
                      : row.brand}
                  </td>
                  <td>
                    {row.store.storeName.length > 20
                      ? `${row.store.storeName.substring(0, 20)}...`
                      : row.store.storeName}
                  </td>
                  <td>{row.createdAt.split('T')[0]}</td>
                  <td>
                    <div>
                      {roleName !== 'User' && roleName !== 'Simple User' && (
                        <span
                          style={{
                            display: 'inline-block',
                            marginRight: '1rem',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setShowModal(true);
                            setProduct(row);
                            setIsEditMode(true);
                          }}
                        >
                          Edit
                        </span>
                      )}
                      {roleName !== 'Editor' &&
                        roleName !== 'User' &&
                        roleName !== 'Simple User' && (
                          <span
                            style={{
                              color: 'red',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setProductSelected(row.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </span>
                        )}
                    </div>
                  </td>
                </tr>
              );
            }}
          />
          <CustomPagination
            totalItems={totalData}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={(page: number) => setPage(page)}
          />
        </>
      )}
      <CreateProduct
        showModal={showModal}
        setShowModal={setShowModal}
        isEditMode={isEditMode}
        product={product}
      />
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
